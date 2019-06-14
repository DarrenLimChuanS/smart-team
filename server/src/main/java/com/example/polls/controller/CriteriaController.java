package com.example.polls.controller;

import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.User;
import com.example.polls.model.Criteria;
import com.example.polls.payload.*;
import com.example.polls.repository.PollRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.repository.CriteriaRepository;
import com.example.polls.repository.VoteRepository;
import com.example.polls.security.UserPrincipal;
import com.example.polls.service.PollService;
import com.example.polls.service.CriteriaService;
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
public class CriteriaController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private CriteriaRepository criteriaRepository;

    @Autowired
    private CriteriaService criteriaService;

    @Autowired
    private PollService pollService;

    private static final Logger logger = LoggerFactory.getLogger(CriteriaController.class);

    @GetMapping("/criteria/checkNameAvailability")
    public CriteriaNameAvailability checkNameAvailability(@RequestParam(value = "name") String name) {
        Boolean isAvailable = !criteriaRepository.existsByName(name);
        return new CriteriaNameAvailability(isAvailable);
    }


    @GetMapping(("/criteria/getAllCriteria"))
    public List<Criteria> getCriteria() {
        return criteriaRepository.findAll();
    }

    @PostMapping("/criteria/{user_id}/createCriteria")
    // @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createCriteria(@PathVariable(value = "user_id") Long user_id,@RequestBody CriteriaRequest criteriaRequest) {

        return userRepository.findById(user_id).map(user -> {

            Criteria criteria = criteriaService.createCriteria(user, criteriaRequest);

            URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{critiera_Id}")
                .buildAndExpand(criteria.getId()).toUri();

            return ResponseEntity.created(location).body(new ApiResponse(true, "Criteria Created Successfully"));
        }).orElseThrow(() -> new ResourceNotFoundException("User", "id", user_id));
    }



    @PutMapping("/criteria/update/{criteria_id}/{user_id}")
    // @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> updateCriteria(@RequestBody Criteria criteria, @PathVariable Long criteria_id, @PathVariable Long user_id) {
        return userRepository.findById(user_id).map(user -> {
            return criteriaService.updateCriteriaById(criteria, criteria_id, user);
        }).orElseThrow(() -> new ResourceNotFoundException("User", "id", user_id));
    }

    @DeleteMapping("/criteria/delete/{criteria_id}")
    // @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteCriteria(@PathVariable long criteria_id) {
        return criteriaService.deleteById(criteria_id);
    }


}
