package com.example.polls.controller;

import com.example.polls.model.Questionnaire;
import com.example.polls.payload.ApiResponse;
import com.example.polls.payload.PagedResponse;
import com.example.polls.payload.QuestionnaireRequest;
import com.example.polls.payload.QuestionnaireResponse;
import com.example.polls.repository.CourseRepository;
import com.example.polls.repository.QuestionnaireRepository;
import com.example.polls.security.CurrentUser;
import com.example.polls.security.UserPrincipal;
import com.example.polls.service.CourseService;
import com.example.polls.service.QuestionnaireService;
import com.example.polls.util.AppConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/questionnaires")
public class QuestionnaireController {
    @Autowired
    private QuestionnaireService questionnaireService;

    @GetMapping
    public PagedResponse<QuestionnaireResponse> getQuestionnaires(
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return questionnaireService.getAllQuestionnaires(page, size);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createQuestionnaire(@Valid @RequestBody QuestionnaireRequest questionnaireRequest) {
        Questionnaire questionnaire = questionnaireService.createQuestionnaire(questionnaireRequest);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{questionnaireId}")
                .buildAndExpand(questionnaire.getQuestionnaireId()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "Questionnaire Created Successfully"));
    }

    @GetMapping("/{questionnaireId}")
    @PreAuthorize("hasRole('USER')")
    public QuestionnaireResponse getQuestionnaireById(@CurrentUser UserPrincipal currentUser,

            @PathVariable Long questionnaireId) {
        return questionnaireService.getQuestionnaireById(questionnaireId, currentUser);
    }

    @PutMapping("/{questionnaireId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> updateQuestionnaire(@RequestBody Questionnaire questionnaire,
            @PathVariable long questionnaireId) {
        return questionnaireService.updateQuestionnaireById(questionnaire, questionnaireId);
    }

    @PutMapping("/{questionnaireId}/criteria/{criteriaId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> addCriteria(@PathVariable long questionnaireId, @PathVariable long criteriaId) {
        return questionnaireService.addCriteria(questionnaireId, criteriaId);
    }

    @DeleteMapping("/{questionnaireId}")
    @PreAuthorize("hasRole('USER')")
    @Transactional
    public ResponseEntity<?> deleteQuestionnaire(@PathVariable long questionnaireId) {
        return questionnaireService.deleteById(questionnaireId);
    }
}
