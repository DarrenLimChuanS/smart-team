package com.example.polls.controller;

import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.User;
import com.example.polls.model.Criteria;
import com.example.polls.model.Questionnaire;
import com.example.polls.payload.*;
import com.example.polls.repository.PollRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.repository.CriteriaRepository;
import com.example.polls.repository.QuestionnaireRepository;
import com.example.polls.repository.VoteRepository;
import com.example.polls.security.UserPrincipal;
import com.example.polls.service.PollService;
import com.example.polls.service.CriteriaService;
import com.example.polls.service.QuestionnaireService;
import com.example.polls.security.CurrentUser;
import com.example.polls.util.AppConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import javax.validation.Valid;
import java.net.URI;

import java.util.List;

@RestController
@RequestMapping("/api")
public class QuestionnaireController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private QuestionnaireRepository questionnaireRepository;

    @Autowired
    private QuestionnaireService questionnaireService;

    @Autowired
    private PollService pollService;

    private static final Logger logger = LoggerFactory.getLogger(QuestionnaireController.class);

    @GetMapping("/questionnaire/checkNameAvailability")
    public QuestionnaireNameAvailability checkNameAvailability(@RequestParam(value = "name") String name) {
        Boolean isAvailable = !questionnaireRepository.existsByName(name);
        return new QuestionnaireNameAvailability(isAvailable);
    }

    @GetMapping(("/questionnaire/getAllQuestionnaire"))
    public List<Questionnaire> getQuestionnaires() {
        return questionnaireRepository.findAll();
    }

    @PostMapping("/questionnaire/{user_id}/createQuestionnaire")
    // @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createQuestionnaire(@PathVariable(value = "user_id") Long user_id,
            @RequestBody QuestionnaireRequest questionnaireRequest) {

        return userRepository.findById(user_id).map(user -> {
            Questionnaire questionnaire = questionnaireService.createQuestionnaire(user, questionnaireRequest);

            URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{questionnaire_Id}")
                    .buildAndExpand(questionnaire.getQuestionnaireId()).toUri();

            return ResponseEntity.created(location).body(new ApiResponse(true, "Questionnaire Created Successfully"));
        }).orElseThrow(() -> new ResourceNotFoundException("User", "id", user_id));
    }

    @PutMapping("/questionnaire/update/{questionnaire_id}/{user_id}")
    // @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> updateQuestionnaire(@RequestBody Questionnaire questionnaire,
            @PathVariable Long questionnaire_id, @PathVariable Long user_id) {
        return userRepository.findById(user_id).map(user -> {
            return questionnaireService.updateQuestionnaireById(questionnaire, questionnaire_id, user);
        }).orElseThrow(() -> new ResourceNotFoundException("User", "id", user_id));

    }

    @DeleteMapping("/questionnaire/delete/{questionnaire_id}")
    // @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteQuestionnaire(@PathVariable long questionnaire_id) {
        return questionnaireService.deleteById(questionnaire_id);
    }

}
