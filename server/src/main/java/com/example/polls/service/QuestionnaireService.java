package com.example.polls.service;

import com.example.polls.exception.BadRequestException;
import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.*;
import com.example.polls.payload.PagedResponse;
import com.example.polls.payload.CriteriaRequest;
import com.example.polls.payload.QuestionnaireRequest;
import com.example.polls.payload.QuestionnaireResponse;
import com.example.polls.payload.CriteriaResponse;
import com.example.polls.repository.CriteriaRepository;
import com.example.polls.repository.QuestionnaireRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.security.UserPrincipal;
import com.example.polls.util.AppConstants;
import com.example.polls.util.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.stereotype.Service;
import com.example.polls.payload.ApiResponse;

import java.util.Collections;
import java.util.Optional;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class QuestionnaireService {

    @Autowired
    private QuestionnaireRepository questionnaireRepository;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(QuestionnaireService.class);

    public Questionnaire createQuestionnaire(User user, QuestionnaireRequest questionnaireRequest) {
        Questionnaire questionnaire = new Questionnaire();
        questionnaire.setUser(user);
        questionnaire.setName(questionnaireRequest.getName());
        questionnaire.setInstruction(questionnaireRequest.getInstruction());
        return questionnaireRepository.save(questionnaire);
    }

    public PagedResponse<QuestionnaireResponse> getQuestionnairesCreatedBy(String username, UserPrincipal currentUser,
            int page, int size) {
        validatePageNumberAndSize(page, size);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Retrieve all questionnaires created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Questionnaire> questionnaires = questionnaireRepository.findByCreatedBy(user.getId(), pageable);

        if (questionnaires.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), questionnaires.getNumber(), questionnaires.getSize(),
                    questionnaires.getTotalElements(), questionnaires.getTotalPages(), questionnaires.isLast());
        }

        // Map questionnaires to QuestionnaireResponses
        List<QuestionnaireResponse> QuestionnaireResponses = questionnaires
                .map(questionnaire -> ModelMapper.mapQuestionnaireToQuestionnaireResponse(questionnaire, user))
                .getContent();

        return new PagedResponse<>(QuestionnaireResponses, questionnaires.getNumber(), questionnaires.getSize(),
                questionnaires.getTotalElements(), questionnaires.getTotalPages(), questionnaires.isLast());
    }

    public ResponseEntity<Object> updateQuestionnaireById(@RequestBody Questionnaire questionnaire,
            @PathVariable Long questionnaire_id, User user) {

        Optional<Questionnaire> questionnaireOptional = questionnaireRepository.findById(questionnaire_id);

        if (!questionnaireOptional.isPresent())
            return ResponseEntity.notFound().build();

        questionnaire.setQuestionnaireId(questionnaire_id);
        questionnaire.setUser(user);
        questionnaireRepository.save(questionnaire);
        return ResponseEntity.ok(new ApiResponse(true, "Questionnaire Updated Successfully"));
    }

    public ResponseEntity<?> deleteById(Long questionnaire_id) {
        if (questionnaireRepository.findById(questionnaire_id).isPresent()) {
            questionnaireRepository.deleteById(questionnaire_id);
            return ResponseEntity.ok(new ApiResponse(true, "Questionnaire Deleted Successfully"));
        }
        return ResponseEntity.ok(new ApiResponse(false, "Questionnaire Deleted is Unsuccessful"));
    }

    public List<Questionnaire> getAllQuestionnaire() {
        return questionnaireRepository.findAll();
    }

    private void validatePageNumberAndSize(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if (size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }

    /** PROTOTYPE OF UPDATE BY NAME **/
    // public ResponseEntity<Object> updateCriteriaByName(@RequestBody Criteria
    // criteria, @PathVariable String name) {

    // Optional<Criteria> criteriaOptional = criteriaRepository.findByName(name);

    // if (!criteriaOptional.isPresent())
    // return ResponseEntity.notFound().build();

    // criteria.setId(courseId);
    // courseRepository.save(criteria);
    // return ResponseEntity.ok(new ApiResponse(true, "Course Updated
    // Successfully"));
    // }

}
