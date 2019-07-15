package com.example.polls.controller;

import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.CriteriaResponseQuarterCount;
import com.example.polls.model.SmartTeam;
import com.example.polls.payload.ApiResponse;
import com.example.polls.payload.SmartTeamRequest;
import com.example.polls.repository.SmartTeamRepository;
import com.example.polls.repository.VoteRepository;
import com.example.polls.repository.VoteRepository.STOCount;
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

    /**
     * GET a SmartTeam
     * @param smartTeamId
     * @return
     */
    @GetMapping("/{smartTeamId}")
    @PreAuthorize("hasAnyRole('USER', 'STUDENT')")
    public SmartTeam getBySmartTeamId(@PathVariable Long smartTeamId) {
        return smartTeamRepository.findBySmartteamId(smartTeamId)
                .orElseThrow(() -> new ResourceNotFoundException("Smart Team", "id", smartTeamId));
    }

    /**
     * Create a SmartTeam
     * @param smartTeamRequest
     * @return
     */
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createSmartTeam(@Valid @RequestBody SmartTeamRequest smartTeamRequest) {
        // Create a SmartTeam request
        SmartTeam smartteam = smartTeamService.createSmartTeam(smartTeamRequest);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{smartTeamId}")
                .buildAndExpand(smartteam.getSmartteamId()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, smartteam.getSmartteamId().toString()));
    }

    /**
     * Populate the master list for a SmartTeam that was created
     * @param smartTeamId
     * @return
     */
    @PutMapping("/{smartTeamId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> populateSmartTeam(@PathVariable Long smartTeamId) {
        return smartTeamService.populateSmartTeam(smartTeamId);
    }

    /**
     * GET the unique count of Outcome grouped by Criteria Id for a SmartTeam
     * @param smartteamId
     * @return
     */
    @GetMapping("/{smartteamId}/outcome")
    @PreAuthorize("hasRole('USER')")
    public List<STOCount> countByOutcomeGroupByCriteriaId(@PathVariable Long smartteamId) {
        return voteRepository.countByOutcomeGroupByCriteriaId(smartteamId);
    }

    @GetMapping("/{smartteamId}/{criteriaId}/{userIds}/outcome")
    @PreAuthorize("hasRole('USER')")
    public List<String> findOutcomeByUserIdAndCriteriaId(@PathVariable Long smartteamId, @PathVariable Long criteriaId, @PathVariable List<Long> userIds) {
        return voteRepository.findOutcomeByUserIdAndCriteriaId(smartteamId, criteriaId, userIds);
    }
}
