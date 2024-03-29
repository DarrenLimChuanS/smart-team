package com.example.smartteam.service;

import com.example.smartteam.exception.BadRequestException;
import com.example.smartteam.exception.ResourceNotFoundException;
import com.example.smartteam.model.Criteria;
import com.example.smartteam.model.Questionnaire;
import com.example.smartteam.model.User;
import com.example.smartteam.payload.*;
import com.example.smartteam.repository.CriteriaRepository;
import com.example.smartteam.repository.QuestionnaireRepository;
import com.example.smartteam.repository.UserRepository;
import com.example.smartteam.security.UserPrincipal;
import com.example.smartteam.util.AppConstants;
import com.example.smartteam.util.ModelMapper;
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
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class QuestionnaireService {

    @Autowired
    private QuestionnaireRepository questionnaireRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CriteriaRepository criteriaRepository;

    public PagedResponse<QuestionnaireResponse> getAllQuestionnaires(int page, int size) {
        validatePageNumberAndSize(page, size);

        // Retrieve Questionnaires
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Questionnaire> questionnaires = questionnaireRepository.findAll(pageable);

        if (questionnaires.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), questionnaires.getNumber(), questionnaires.getSize(),
                    questionnaires.getTotalElements(), questionnaires.getTotalPages(), questionnaires.isLast());
        }

        // Map questionnaire to QuestionnaireResponse containing questionnaire creator
        // details
        Map<Long, User> creatorMap = getQuestionnaireCreatorMap(questionnaires.getContent());

        List<QuestionnaireResponse> QuestionnaireResponses = questionnaires.map(questionnaire -> ModelMapper
                .mapQuestionnaireToQuestionnaireResponse(questionnaire, creatorMap.get(questionnaire.getCreatedBy())))
                .getContent();

        return new PagedResponse<>(QuestionnaireResponses, questionnaires.getNumber(), questionnaires.getSize(),
                questionnaires.getTotalElements(), questionnaires.getTotalPages(), questionnaires.isLast());
    }

    public QuestionnaireResponse getQuestionnaireById(Long questionnaireId, UserPrincipal currentUser) {
        Questionnaire questionnaire = questionnaireRepository.findByQuestionnaireId(questionnaireId)
                .orElseThrow(() -> new ResourceNotFoundException("Questionnaire", "id", questionnaireId));

        // Retrieve questionnaire creator details
        User creator = userRepository.findById(questionnaire.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", questionnaire.getCreatedBy()));

        return ModelMapper.mapQuestionnaireToQuestionnaireResponse(questionnaire, creator);
    }

    public Questionnaire createQuestionnaire(QuestionnaireRequest questionnaireRequest) {
        Questionnaire questionnaire = new Questionnaire();
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
            @PathVariable long questionnaireId) {

        Optional<Questionnaire> questionnaireOptional = questionnaireRepository.findByQuestionnaireId(questionnaireId);

        if (questionnaireOptional.isPresent())
            return ResponseEntity.notFound().build();

        questionnaire.setQuestionnaireId(questionnaireId);
        questionnaire.setName(questionnaireOptional.get().getName());
        questionnaire.setInstruction(questionnaireOptional.get().getInstruction());
        questionnaire.setCreatedAt(questionnaireOptional.get().getCreatedAt());
        questionnaire.setCreatedBy(questionnaireOptional.get().getCreatedBy());
        questionnaireRepository.save(questionnaire);
        return ResponseEntity.ok(new ApiResponse(true, "Questionnaire Created Successfully"));
    }

    public ResponseEntity<Object> addCriteria(@PathVariable long questionnaireId, @PathVariable long criteriaId) {
        Questionnaire questionnaire = questionnaireRepository.findByQuestionnaireId(questionnaireId)
                .orElseThrow(() -> new ResourceNotFoundException("Questionnaire", "id", questionnaireId));

        Criteria criteria = criteriaRepository.findById(criteriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Criteria", "id", criteriaId));

        questionnaire.getCriteria().add(criteria);

        questionnaireRepository.save(questionnaire);
        return ResponseEntity.ok(new ApiResponse(true, "Criteria added Successfully"));
    }

    public ResponseEntity<?> deleteById(Long questionnaireId) {
        if (questionnaireRepository.findById(questionnaireId).isPresent()) {
            questionnaireRepository.deleteById(questionnaireId);
            return ResponseEntity.ok(new ApiResponse(true, "Questionnaire Deleted Successfully"));
        }
        return ResponseEntity.ok(new ApiResponse(false, "Questionnaire ID cannot be found."));
    }

    private void validatePageNumberAndSize(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if (size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }

    public ResponseEntity<Object> removeCriteria(@PathVariable long questionnaireId, @PathVariable long criteriaId) {
        Questionnaire questionnaire = questionnaireRepository.findByQuestionnaireId(questionnaireId)
                .orElseThrow(() -> new ResourceNotFoundException("Questionnaire", "id", questionnaireId));

        Criteria criteria = criteriaRepository.findById(criteriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Criteria", "id", criteriaId));

        questionnaire.getCriteria().remove(criteria);

        questionnaireRepository.save(questionnaire);
        return ResponseEntity.ok(new ApiResponse(true, "Criteria removed Successfully"));
    }

    Map<Long, User> getQuestionnaireCreatorMap(List<Questionnaire> questionnaires) {
        // Get Questionnaire Creator details of the given list of questionnaires

        List<Long> creatorIds = questionnaires.stream().map(Questionnaire::getCreatedBy).distinct()
                .collect(Collectors.toList());
        List<User> creators = userRepository.findByIdIn(creatorIds);
        Map<Long, User> creatorMap = creators.stream().collect(Collectors.toMap(User::getId, Function.identity()));

        return creatorMap;
    }

}
