package com.example.polls.service;

import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.*;
import com.example.polls.payload.ApiResponse;
import com.example.polls.payload.SmartTeamRequest;
import com.example.polls.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class SmartTeamService {

    @Autowired
    private CriteriaRepository criteriaRepository;

    @Autowired
    private SmartTeamRepository smartTeamRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private QuestionnaireRepository questionnaireRepository;

    @Autowired
    private SectionService sectionService;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Function to create Smart Team
     * @param smartTeamRequest
     * @return
     */
    public SmartTeam createSmartTeam(SmartTeamRequest smartTeamRequest) {
        SmartTeam smartteam = new SmartTeam();
        smartteam.setName(smartTeamRequest.getName());
        smartteam.setNoOfTeams(smartTeamRequest.getNoOfTeams());
        smartteam.setUser(smartTeamRequest.getUser());
        smartteam.setSection(smartTeamRequest.getSection());

        // Get questionnaire information based on the provided questionnaire id
        Questionnaire questionnaireData = questionnaireRepository
                .findByQuestionnaireId(smartTeamRequest.getQuestionnaire().getQuestionnaireId())
                .orElseThrow(() -> new ResourceNotFoundException("Questionnaire", "Questionnaire ID",
                        smartTeamRequest.getQuestionnaire().getQuestionnaireId()));
        smartteam.setQuestionnaire(questionnaireData);

        smartteam.setSmartteamStartdate(smartTeamRequest.getSmartteamStartdate());
        smartteam.setSmartteamEnddate(smartTeamRequest.getSmartteamEnddate());

        // Update status of Section
        Section tempSection = sectionRepository.findBySectionId(smartTeamRequest.getSection().getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section", "Section ID",
                        smartTeamRequest.getSection().getSectionId()));
        tempSection.setStatus("Teaming");
        sectionService.updateSectionById(tempSection.getSectionId(), tempSection);

        return smartTeamRepository.save(smartteam);
    }

    /**
     * Function to populate Smart Team master list
     * @param smartTeamId
     * @return
     */
    public ResponseEntity<Object> populateSmartTeam(Long smartTeamId) {
        // Fetch SmartTeam
        SmartTeam tempSmartTeam = smartTeamRepository.findBySmartteamId(smartTeamId)
                .orElseThrow(() -> new ResourceNotFoundException("SmartTeam", "SmartTeam ID", smartTeamId));

        // Fetch Section in SmartTeam
        Section tempSection = sectionRepository.findBySectionId(tempSmartTeam.getSection().getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section", "Section ID",
                        tempSmartTeam.getSection().getSectionId()));

        // Fetch Questionnaire in SmartTeam
        Questionnaire tempQuestionnaire = questionnaireRepository
                .findByQuestionnaireId(tempSmartTeam.getQuestionnaire().getQuestionnaireId())
                .orElseThrow(() -> new ResourceNotFoundException("Questionnaire", "Questionnaire ID",
                        tempSmartTeam.getQuestionnaire().getQuestionnaireId()));

        // Create Master list in Vote table
        // Loop through students in section
        for (User student : tempSection.getUsers()) {
            // Loop through criterias of questionnaire
            for (Criteria criteria : tempQuestionnaire.getCriteria()) {
                // Loop through questions in criteria
                for (Poll poll : criteria.getPolls()) {
                    Vote tempVote = new Vote();
                    tempVote.setSmartteam(tempSmartTeam);
                    tempVote.setUser(student);
                    tempVote.setCriteria(criteria);
                    tempVote.setPoll(poll);
                    voteRepository.save(tempVote);
                }
            }
        }

        // Update Section with the SmartTeam
        Set<SmartTeam> smartteamList = new HashSet<>(); 
        smartteamList = tempSection.getSmartteams();
        smartteamList.add(tempSmartTeam);
        tempSection.setSmartteams(smartteamList);
        sectionRepository.save(tempSection);
        return ResponseEntity.ok(new ApiResponse(true, "Section Updated Successfully"));
    }

    /**
     * Function to loop through all combinations and find the best compliance score across the Teams
     * @param teamList
     * @param criteriaCompliances
     * @return
     */
    public List<Team> smartTeamAllocation(List<Team> teamList, List<CriteriaCompliance> criteriaCompliances) {
        // Counter for Time-To-Live
        int swapPass = 0;
        Double oldScore = (double) 0;
        Double newScore = (double) 0;
        // Team 1, 2, 3, 4, 5
        // For each Team in TeamList
        for (Team teamA : teamList) {
            // Check swap pass threshold
            if (swapPass == 20) {
                break;
            }
            // Loop through each Team in TeamList and check if it is himself
            for (Team teamB : teamList) {
                // Same Team no point checking
                if (teamA == teamB) {
                    break;
                } else {
                    List<User> studentListA = new ArrayList<User>(teamA.getUsers());
                    List<User> studentListB = new ArrayList<User>(teamB.getUsers());
                    for (int i = 0; i < studentListA.size(); i++) {
                        for (int j = 0; j < studentListB.size(); j++) {
                            oldScore = getComplianceScore(teamA, criteriaCompliances) + getComplianceScore(teamB, criteriaCompliances);
                            // Swap by deleting from A, adding into B. Deleting from B, adding into A
                            // teamB.getUsers().add(studentListA.get(i));
                            // teamA.getUsers().remove(studentListA.get(i));
                            // teamA.getUsers().add(studentListB.get(j));
                            // teamB.getUsers().remove(studentListB.get(j));
                            swapUser(studentListA.get(i), studentListB.get(j), teamA.getUsers(), teamB.getUsers());
                            newScore = getComplianceScore(teamA, criteriaCompliances) + getComplianceScore(teamB, criteriaCompliances);
                            if (newScore > oldScore) {
                                // There is an improvement in score, reset swap pass and keep the swap
                                swapPass = 0;
                                break;
                            } else {
                                // Swap back and increment swap pass
                                swapUser(studentListA.get(i), studentListB.get(j), teamA.getUsers(), teamB.getUsers());
                                swapPass++;
                            }
                        }
                    }
                }
            }
        }
        return teamList;
    }

    /**
     * Function to get the compliance score of the criteria in a team
     * @param team
     * @param criteriaCompliances
     * @return
     */
    public Double getComplianceScore(Team team, List<CriteriaCompliance> criteriaCompliances) {
        // Initialise Compliance Score for summation
        Double complianceScore = (double) 0;
        // Get SmartTeam ID
        Long smartTeamId = team.getSmartteam().getSmartteamId();
        // Fetch User List in the team
        Set<User> userList = team.getUsers();
        // Initiate List to store user id in the team
        List<Long> userIdList = new ArrayList<Long>();
        // Append all user ids into list
        for (User user : userList) {
            userIdList.add(user.getId());
        }
        // Loop through all CriteriaCompliance
        for (CriteriaCompliance criterion : criteriaCompliances) {
            // Generate OutcomeList of the team for a criteria
            List<String> outcomeList = voteRepository.findOutcomeByUserIdAndCriteriaId(smartTeamId, criterion.getCriteriaId(), userIdList);
            // Calculate the Diversity Score of the criteria multiplied with diversity scale
            complianceScore += getDiversityScore(outcomeList) * criterion.getDiversityScale();
        }

        return complianceScore;
    }

    /**
     * Utility function to get Diversity Score
     * @param outcomeList
     * @return
     */
    public Double getDiversityScore (List<String> outcomeList) {
        // Find number of outcome which is also the team size
        int teamSize = outcomeList.size();
        // Find the unique selections in the team
        Set<String> uniqueOutcomes = new HashSet<>(outcomeList);
        // Tabulate the size of the unique selections
        int uniqueValues = uniqueOutcomes.size();
        // Return the heterogeneity
        return (double)uniqueValues/teamSize;
    }

    /**
     * Utility function to swap two Users from two Sets
     * @param studentA
     * @param studentB
     * @param setA
     * @param setB
     */
    public void swapUser(User studentA, User studentB, Set<User> setA, Set<User> setB) {
        setB.add(studentA);
        setA.remove(studentA);
        setA.add(studentB);
        setB.remove(studentB);
    }
}
