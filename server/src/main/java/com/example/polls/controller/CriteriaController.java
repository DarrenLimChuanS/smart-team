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
@RequestMapping("/api/criteria")
public class CriteriaController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private CriteriaRepository criteriaRepository;

    @Autowired
    private CriteriaService criteriaService;

    @Autowired
    private PollService pollService;

    @GetMapping("/checkNameAvailability")
    public CriteriaNameAvailability checkNameAvailability(@RequestParam(value = "name") String name) {
        Boolean isAvailable = !criteriaRepository.existsByName(name);
        return new CriteriaNameAvailability(isAvailable);
    }

    @GetMapping()
    public List<Criteria> getCriteria() {
        return criteriaRepository.findAll();
    }

    @GetMapping("/{criteriaId}")
    @PreAuthorize("hasRole('USER')")
    public CriteriaResponse getCriteriaById(@PathVariable Long criteriaId) {
        return criteriaService.getCriteriaById(criteriaId);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createCriteria(@Valid @RequestBody CriteriaRequest criteriaRequest) {
        Criteria criteria = criteriaService.createCriteria(criteriaRequest);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{criteriaId}")
                .buildAndExpand(criteria.getId()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "Criteria Created Successfully"));
    }

    @PutMapping("/{criteriaId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> updateCriteria(@RequestBody Criteria criteria, @PathVariable Long criteriaId,
            @PathVariable Long user_id) {
        return userRepository.findById(user_id).map(user -> {
            return criteriaService.updateCriteriaById(criteria, criteriaId, user);
        }).orElseThrow(() -> new ResourceNotFoundException("User", "id", user_id));
    }

    @DeleteMapping("/{criteriaId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteCriteria(@PathVariable long criteriaId) {
        return criteriaService.deleteById(criteriaId);
    }

}
