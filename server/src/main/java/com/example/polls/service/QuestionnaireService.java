package com.example.polls.service;

import com.example.polls.exception.BadRequestException;
import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.Criteria;
import com.example.polls.model.Questionnaire;
import com.example.polls.model.User;
import com.example.polls.payload.ApiResponse;
import com.example.polls.payload.PagedResponse;
import com.example.polls.payload.QuestionnaireRequest;
import com.example.polls.payload.QuestionnaireResponse;
import com.example.polls.repository.QuestionnaireRepository;
import com.example.polls.repository.UserRepository;
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
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class QuestionnaireService {

    @Autowired
    private QuestionnaireRepository questionnaireRepository;

    @Autowired
    private UserRepository userRepository;

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

    public ResponseEntity<Object> addCriteria(@RequestBody Criteria criteria, @PathVariable long questionnaireId) {

        Optional<Questionnaire> questionnaire = questionnaireRepository.findByQuestionnaireId(questionnaireId);

        if (questionnaire.isPresent())
            return ResponseEntity.notFound().build();

        Questionnaire updatedQuestionnaire = new Questionnaire();
        updatedQuestionnaire.setQuestionnaireId(questionnaireId);
        updatedQuestionnaire.setName(questionnaire.get().getName());
        updatedQuestionnaire.setInstruction(questionnaire.get().getInstruction());
        updatedQuestionnaire.setCreatedAt(questionnaire.get().getCreatedAt());
        updatedQuestionnaire.setCreatedBy(questionnaire.get().getCreatedBy());
        updatedQuestionnaire.setCriteria(questionnaire.get().getCriteria());
        updatedQuestionnaire.getCriteria().add(criteria);
        questionnaireRepository.save(questionnaire.get());
        return ResponseEntity.ok(new ApiResponse(true, "Criteria added Successfully"));
    }

    public ResponseEntity<?> deleteById(Long questionnaire_id) {
        if (questionnaireRepository.findById(questionnaire_id).isPresent()) {
            questionnaireRepository.deleteById(questionnaire_id);
            return ResponseEntity.ok(new ApiResponse(true, "Questionnaire Deleted Successfully"));
        }
        return ResponseEntity.ok(new ApiResponse(false, "Questionnaire Deleted is Unsuccessful"));
    }

    private void validatePageNumberAndSize(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if (size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
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
