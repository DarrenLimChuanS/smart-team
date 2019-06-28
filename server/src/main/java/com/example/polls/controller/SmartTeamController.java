package com.example.polls.controller;

import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.Criteria;
import com.example.polls.model.SmartTeam;
import com.example.polls.payload.ApiResponse;
import com.example.polls.payload.CriteriaNameAvailability;
import com.example.polls.payload.CriteriaRequest;
import com.example.polls.payload.CriteriaResponse;
import com.example.polls.payload.SmartTeamRequest;
import com.example.polls.repository.CriteriaRepository;
import com.example.polls.repository.SmartTeamRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.service.CriteriaService;
import com.example.polls.service.SmartTeamService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/smartteam")
public class SmartTeamController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CriteriaRepository criteriaRepository;

    @Autowired
    private CriteriaService criteriaService;

    @Autowired
    private SmartTeamRepository smartTeamRepository;

    @Autowired
    private SmartTeamService smartTeamService;

    @GetMapping("/checkNameAvailability")
    public CriteriaNameAvailability checkNameAvailability(@RequestParam(value = "name") String name) {
        Boolean isAvailable = !criteriaRepository.existsByName(name);
        return new CriteriaNameAvailability(isAvailable);
    }

    // @GetMapping()
    // public List<Criteria> getCriteria() {
    //     return criteriaRepository.findAll();
    // }

    // @GetMapping("/{criteriaId}")
    // @PreAuthorize("hasRole('USER')")
    // public CriteriaResponse getCriteriaById(@PathVariable Long criteriaId) {
    //     return criteriaService.getCriteriaById(criteriaId);
    // }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createSmartTeam(@Valid @RequestBody SmartTeamRequest smartTeamRequest) {
        SmartTeam smartteam = smartTeamService.createSmartTeam(smartTeamRequest);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{smartTeamId}")
                .buildAndExpand(smartteam.getSmartteamId()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "SmartTeam Created Successfully"));
    }

    // @PutMapping("/{criteriaId}")
    // @PreAuthorize("hasRole('USER')")
    // public ResponseEntity<Object> updateCriteria(@RequestBody Criteria criteria, @PathVariable Long criteriaId,
    //         @PathVariable Long user_id) {
    //     return userRepository.findById(user_id).map(user -> criteriaService.updateCriteriaById(criteria, criteriaId)).orElseThrow(() -> new ResourceNotFoundException("User", "id", user_id));
    // }

    // @DeleteMapping("/{criteriaId}")
    // @PreAuthorize("hasRole('USER')")
    // public ResponseEntity<?> deleteCriteria(@PathVariable long criteriaId) {
    //     return criteriaService.deleteById(criteriaId);
    // }

}
