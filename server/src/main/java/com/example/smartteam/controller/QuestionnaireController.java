package com.example.smartteam.controller;

import com.example.smartteam.model.Questionnaire;
import com.example.smartteam.payload.*;
import com.example.smartteam.security.CurrentUser;
import com.example.smartteam.security.UserPrincipal;
import com.example.smartteam.service.QuestionnaireService;
import com.example.smartteam.util.AppConstants;
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

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, questionnaire.getQuestionnaireId().toString()));
    }

    @GetMapping("/{questionnaireId}")
    @PreAuthorize("hasAnyRole('USER', 'STUDENT')")
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

    @DeleteMapping("/{questionnaireId}/criteria/{criteriaId}")
    @PreAuthorize("hasRole('USER')")
    @Transactional
    public ResponseEntity<?> removeCriteria(@PathVariable long questionnaireId, @PathVariable long criteriaId) {
        return questionnaireService.removeCriteria(questionnaireId, criteriaId);
    }
}
