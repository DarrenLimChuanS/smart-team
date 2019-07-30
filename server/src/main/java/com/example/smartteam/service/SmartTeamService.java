package com.example.smartteam.service;

import com.example.smartteam.exception.ResourceNotFoundException;
import com.example.smartteam.model.*;
import com.example.smartteam.payload.ApiResponse;
import com.example.smartteam.payload.SmartTeamRequest;
import com.example.smartteam.payload.TeamListRequest;
import com.example.smartteam.payload.TeamRequest;
import com.example.smartteam.repository.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


@Service
public class SmartTeamService {
    @Autowired
    private SmartTeamRepository smartTeamRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private QuestionnaireRepository questionnaireRepository;

    @Autowired
    private TeamRepository teamRepository;

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
     * Function to create a Team
     * @param teamRequest
     * @return
     */
    public Team createTeam(TeamRequest teamRequest) {
        Team team = new Team();
        team.setComplianceScore(teamRequest.getTeam().getComplianceScore());
        
        Section tempSection = sectionRepository.findBySectionId(teamRequest.getTeam().getSection().getSectionId())
        .orElseThrow(() -> new ResourceNotFoundException("Section", "Section ID", teamRequest.getTeam().getSection().getSectionId()));
        team.setSection(tempSection);

        for (User student : teamRequest.getTeam().getUsers()) {
            User tempStudent = userRepository.findById(student.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student", "id", student.getId()));
            team.getUsers().add(tempStudent);
        }

        // Find SmartTeam
        SmartTeam tempSmartTeam = smartTeamRepository.findBySmartteamId(teamRequest.getTeam().getSmartteam().getSmartteamId())
        .orElseThrow(() -> new ResourceNotFoundException("SmartTeam", "SmartTeam ID", teamRequest.getTeam().getSmartteam().getSmartteamId()));
        team.setSmartteam(tempSmartTeam);

        return teamRepository.save(team);
    }

    /**
     * Function to create a list of Teams
     * @param teamListRequest
     * @return
     */
    public List<Team> createTeamList(TeamListRequest teamListRequest) {
        List<Team> teamList = new ArrayList<Team>();
        for (Team tempTeam : teamListRequest.getTeam()) {
            Team team = new Team();
            team.setComplianceScore(tempTeam.getComplianceScore());
        
            Section tempSection = sectionRepository.findBySectionId(tempTeam.getSection().getSectionId())
            .orElseThrow(() -> new ResourceNotFoundException("Section", "Section ID", tempTeam.getSection().getSectionId()));
            team.setSection(tempSection);
    
            // Clean the User List first
            team.getUsers().clear();
            for (User student : tempTeam.getUsers()) {
                User tempStudent = userRepository.findById(student.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Student", "id", student.getId()));
                team.getUsers().add(tempStudent);
            }
    
            // Find SmartTeam
            SmartTeam tempSmartTeam = smartTeamRepository.findBySmartteamId(tempTeam.getSmartteam().getSmartteamId())
            .orElseThrow(() -> new ResourceNotFoundException("SmartTeam", "SmartTeam ID", tempTeam.getSmartteam().getSmartteamId()));
            team.setSmartteam(tempSmartTeam);
            
            // Save team into List and database
            teamList.add(team);
            teamRepository.save(team);
        }
        // Update status of Section to Teamed
        Section sectionToUpdate = sectionRepository.findBySectionId(teamListRequest.getTeam().get(0).getSection().getSectionId())
        .orElseThrow(() -> new ResourceNotFoundException("Section", "Section ID", teamListRequest.getTeam().get(0).getSection().getSectionId()));
        sectionToUpdate.setStatus("Teamed");
        sectionRepository.save(sectionToUpdate);
        return teamList;
    }

    /**
     * Function to loop through all combinations and find the best compliance score across the Teams
     * @param teamList
     * @param criteriaCompliances
     * @return
     */
    public List<Team> smartTeamAllocation(List<Team> teamList, List<CriteriaCompliance> criteriaCompliances, int swapPassThreshold) {
        // Counter for Time-To-Live
        int swapPass = 0;
        Double oldScore;
        Double newScore;
        // For each Team in TeamList
        outerloop:
        for (int x = 0; x < teamList.size(); x++) {
            // Loop through each Team in TeamList and check if it is himself
            for (int y = 0; y < teamList.size(); y++) {
                // Same Team no point checking
                if (x != y) {
                    List<User> studentListA = new ArrayList<User>(teamList.get(x).getUsers());
                    List<User> studentListB = new ArrayList<User>(teamList.get(y).getUsers());
                    for (int i = 0; i < studentListA.size(); i++) {
                        for (int j = 0; j < studentListB.size(); j++) {
                            oldScore = getComplianceScore(teamList.get(x), criteriaCompliances) + getComplianceScore(teamList.get(y), criteriaCompliances);
                            // Swap by deleting from A, adding into B. Deleting from B, adding into A
                            User tempUserA = studentListA.get(i);
                            User tempUserB = studentListB.get(j);
                            System.out.println("Swap Pass = " + swapPass);
                            System.out.println("SetA Size = " + teamList.get(x).getUsers().size());
                            System.out.println("SetA Size = " + teamList.get(y).getUsers().size());
                            System.out.println("StudentListA Size = " + studentListA.size());
                            System.out.println("StudentListB Size = " + studentListB.size());
                            System.out.println("\n===Before Swapped i = " + i + ", x = " + x + ", y = " + y + ", j = " + j + "===\n");
                            System.out.println("Before swap Set A is " + teamList.get(x).getUsers());
                            System.out.println("Before swap Set B is " + teamList.get(y).getUsers());
                            System.out.println("Before swap List A is " + studentListA);
                            System.out.println("Before swap List B is " + studentListB);
                            teamList.get(y).getUsers().add(tempUserA);
                            teamList.get(x).getUsers().remove(tempUserA);
                            teamList.get(x).getUsers().add(tempUserB);
                            teamList.get(y).getUsers().remove(tempUserB);
                            studentListA.clear();
                            studentListA.addAll(teamList.get(x).getUsers());
                            studentListB.clear();
                            studentListB.addAll(teamList.get(y).getUsers());
                            System.out.println("\n===Swapped===\n");
                            System.out.println("After swap Set A is " + teamList.get(x).getUsers());
                            System.out.println("After swap Set B is " + teamList.get(y).getUsers());
                            System.out.println("After swap List A is " + studentListA);
                            System.out.println("After swap List B is " + studentListB);
                            System.out.println("\n===Revert Swap===\n");

                            newScore = getComplianceScore(teamList.get(x), criteriaCompliances) + getComplianceScore(teamList.get(y), criteriaCompliances);
                            if (newScore > oldScore) {
                                // There is an improvement in score, reset swap pass and keep the swap
                                swapPass = 0;
                                break;
                            } else {
                                // Swap back and increment swap pass
                                teamList.get(x).getUsers().add(tempUserA);
                                teamList.get(y).getUsers().remove(tempUserA);
                                teamList.get(y).getUsers().add(tempUserB);
                                teamList.get(x).getUsers().remove(tempUserB);
                                studentListA.clear();
                                studentListA.addAll(teamList.get(x).getUsers());
                                studentListB.clear();
                                studentListB.addAll(teamList.get(y).getUsers());
                                System.out.println("After swap Set A is " + teamList.get(x).getUsers());
                                System.out.println("After swap Set B is " + teamList.get(y).getUsers());
                                System.out.println("After swap List A is " + studentListA);
                                System.out.println("After swap List B is " + studentListB);
                                swapPass++;
                                // Check swap pass threshold, swapPassThreshold is the optimal outerloop count => All teams goes through at least once if no swaps are made
                                if (swapPass == swapPassThreshold) {
                                    break outerloop;
                                }
                            }
                        }
                    }
                }
            }
        }
        return teamList;
    }

    /**
     * Function to loop through all the teams and add a compliance score to it
     * @param teamList
     * @param criteriaCompliances
     * @return
     */
    public List<Team> appendComplianceScore(List<Team> teamList, List<CriteriaCompliance> criteriaCompliances) {
        for (Team tempTeam : teamList) {
            tempTeam.setComplianceScore(getComplianceScore(tempTeam, criteriaCompliances));
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

    public List<Team> allocateTeam(List<Team> teamList, List<CriteriaCompliance> criteriaCompliances, int swapPassThreshold) {
        List<Team> allocatedTeam = smartTeamAllocation(teamList, criteriaCompliances, swapPassThreshold);
        return appendComplianceScore(allocatedTeam, criteriaCompliances);
    }
}
