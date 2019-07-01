package com.example.polls.service;

import com.example.polls.exception.BadRequestException;
import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.*;
import com.example.polls.payload.ApiResponse;
import com.example.polls.payload.CriteriaResponse;
import com.example.polls.payload.PagedResponse;
import com.example.polls.payload.SmartTeamRequest;
import com.example.polls.repository.*;
import com.example.polls.security.UserPrincipal;
import com.example.polls.util.AppConstants;
import com.example.polls.util.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

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

    public SmartTeam createSmartTeam(SmartTeamRequest smartTeamRequest) {
        SmartTeam smartteam = new SmartTeam();
        smartteam.setName(smartTeamRequest.getName());
        smartteam.setSmartteamStartdate(smartTeamRequest.getSmartteamStartdate());
        smartteam.setSmartteamEnddate(smartTeamRequest.getSmartteamEnddate());
        smartteam.setQuestionnaire(smartTeamRequest.getQuestionnaire());
        smartteam.setUser(smartTeamRequest.getUser());
        smartteam.setSection(smartTeamRequest.getSection());

        // Update status of Section
        Section tempSection = sectionRepository.findBySectionId(smartTeamRequest.getSection().getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section", "Section ID",
                        smartTeamRequest.getSection().getSectionId()));
        tempSection.setStatus("Grouping");
        sectionService.updateSectionById(tempSection, tempSection.getSectionId());

        return smartTeamRepository.save(smartteam);
    }

    public void populateSmartTeam(Long smartTeamId) {
        // Fetch SmartTeam
        SmartTeam tempSmartTeam = smartTeamRepository.findBySmartteamId(smartTeamId)
                .orElseThrow(() -> new ResourceNotFoundException("SmartTeam", "SmartTeam ID", smartTeamId));

        // Fetch Section in SmartTeam
        Section tempSection = sectionRepository.findBySectionId(tempSmartTeam.getSection().getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section", "Section ID",
                        tempSmartTeam.getSection().getSectionId()));

        // Fetch Section in SmartTeam
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
    }

    public PagedResponse<CriteriaResponse> getCriteriaCreatedBy(String username, UserPrincipal currentUser, int page,
            int size) {
        validatePageNumberAndSize(page, size);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Retrieve all criterias created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Criteria> criterias = criteriaRepository.findByCreatedBy(user.getId(), pageable);

        if (criterias.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), criterias.getNumber(), criterias.getSize(),
                    criterias.getTotalElements(), criterias.getTotalPages(), criterias.isLast());
        }

        // Map criterias to CriteriaResponses
        List<CriteriaResponse> CriteriaResponses = criterias
                .map(criteria -> ModelMapper.mapCriteriaToCriteriaResponse(criteria, user)).getContent();

        return new PagedResponse<>(CriteriaResponses, criterias.getNumber(), criterias.getSize(),
                criterias.getTotalElements(), criterias.getTotalPages(), criterias.isLast());
    }

    public CriteriaResponse getCriteriaById(Long criteriaId) {
        Criteria criteria = criteriaRepository.findByCriteriaId(criteriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Criteria", "id", criteriaId));

        // Retrieve criteria creator details
        User creator = userRepository.findById(criteria.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", criteria.getCreatedBy()));

        return ModelMapper.mapCriteriaToCriteriaResponse(criteria, creator);
    }

    public ResponseEntity<Object> updateCriteriaById(@RequestBody Criteria criteria, @PathVariable Long criteriaId) {

        Optional<Criteria> criteriaOptional = criteriaRepository.findById(criteriaId);

        if (!criteriaOptional.isPresent())
            return ResponseEntity.notFound().build();

        criteria.setId(criteriaId);
        criteriaRepository.save(criteria);
        return ResponseEntity.ok(new ApiResponse(true, "Criteria Updated Successfully"));

    }

    public ResponseEntity<?> deleteById(Long criteriaId) {
        if (criteriaRepository.findById(criteriaId).isPresent()) {
            criteriaRepository.deleteById(criteriaId);
            return ResponseEntity.ok(new ApiResponse(true, "Criteria Deleted Successfully"));
        }
        return ResponseEntity.ok(new ApiResponse(false, "Criteria cannot be found."));
    }

    public List<Criteria> getAllCriteria() {
        return criteriaRepository.findAll();
    }

    private void validatePageNumberAndSize(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if (size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }
}
