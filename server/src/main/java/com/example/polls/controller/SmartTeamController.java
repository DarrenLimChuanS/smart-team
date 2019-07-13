package com.example.polls.controller;

import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.Criteria;
import com.example.polls.model.Poll;
import com.example.polls.model.Section;
import com.example.polls.model.SmartTeam;
import com.example.polls.model.SmartTeamOutcomeCount;
import com.example.polls.model.User;
import com.example.polls.model.Vote;
import com.example.polls.payload.ApiResponse;
import com.example.polls.payload.CriteriaNameAvailability;
import com.example.polls.payload.CriteriaRequest;
import com.example.polls.payload.CriteriaResponse;
import com.example.polls.payload.SmartTeamRequest;
import com.example.polls.repository.CriteriaRepository;
import com.example.polls.repository.SmartTeamRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.repository.VoteRepository;
import com.example.polls.service.CriteriaService;
import com.example.polls.service.SectionService;
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
@RequestMapping("/api/smartteams")
public class SmartTeamController {

    @Autowired
    private SmartTeamService smartTeamService;

    @Autowired
    private SmartTeamRepository smartTeamRepository;

    @Autowired
    private VoteRepository voteRepository;

    @GetMapping("/{smartTeamId}")
    @PreAuthorize("hasAnyRole('USER', 'STUDENT')")
    public SmartTeam getBySmartTeamId(@PathVariable Long smartTeamId) {
        return smartTeamRepository.findBySmartteamId(smartTeamId)
                .orElseThrow(() -> new ResourceNotFoundException("Smart Team", "id", smartTeamId));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createSmartTeam(@Valid @RequestBody SmartTeamRequest smartTeamRequest) {
        // Create a SmartTeam request
        SmartTeam smartteam = smartTeamService.createSmartTeam(smartTeamRequest);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{smartTeamId}")
                .buildAndExpand(smartteam.getSmartteamId()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, smartteam.getSmartteamId().toString()));
    }

    @PutMapping("/{smartTeamId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> populateSmartTeam(@PathVariable Long smartTeamId) {
        return smartTeamService.populateSmartTeam(smartTeamId);
    }

    @GetMapping("/outcome/{smartteamId}")
    @PreAuthorize("hasRole('USER')")
    public List<Object[][][]> countByOutcomeGroupByCriteriaId(@PathVariable Long smartteamId) {
        return voteRepository.countByOutcomeGroupByCriteriaId(smartteamId);
    }
}
