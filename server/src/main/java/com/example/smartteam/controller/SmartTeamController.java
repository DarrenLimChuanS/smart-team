package com.example.smartteam.controller;

import com.example.smartteam.exception.ResourceNotFoundException;
import com.example.smartteam.model.SmartTeam;
import com.example.smartteam.model.Team;
import com.example.smartteam.payload.ApiResponse;
import com.example.smartteam.payload.SmartTeamRequest;
import com.example.smartteam.payload.TeamListRequest;
import com.example.smartteam.payload.TeamRequest;
import com.example.smartteam.repository.SmartTeamRepository;
import com.example.smartteam.repository.TeamRepository;
import com.example.smartteam.repository.VoteRepository;
import com.example.smartteam.repository.VoteRepository.STOCount;
import com.example.smartteam.service.SmartTeamService;
import java.net.URI;
import java.util.List;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


@RestController
@RequestMapping("/api/smartteams")
public class SmartTeamController {

    @Autowired
    private SmartTeamService smartTeamService;

    @Autowired
    private SmartTeamRepository smartTeamRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private TeamRepository teamRepository;

    /**
     * GET a SmartTeam
     * 
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
     * 
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
     * 
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
     * 
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
    public List<String> findOutcomeByUserIdAndCriteriaId(@PathVariable Long smartteamId, @PathVariable Long criteriaId,
            @PathVariable List<Long> userIds) {
        return voteRepository.findOutcomeByUserIdAndCriteriaId(smartteamId, criteriaId, userIds);
    }

    @PostMapping("/compliance")
    @PreAuthorize("hasRole('USER')")
    public Double getComplianceScore(@Valid @RequestBody TeamRequest teamRequest) {
        Double score = smartTeamService.getComplianceScore(teamRequest.getTeam(), teamRequest.getCriteriaCompliances());
        return score;
    }

    @PostMapping("/allocate")
    @PreAuthorize("hasRole('USER')")
    public List<Team> smartTeamAllocation(@Valid @RequestBody TeamListRequest teamListRequest) {
        List<Team> smartTeam = smartTeamService.smartTeamAllocation(teamListRequest.getTeam(),
                teamListRequest.getCriteriaCompliances(), teamListRequest.getSwapPassThreshold());
        return smartTeam;
    }

    @PostMapping("/allocate/compliance") 
    @PreAuthorize("hasRole('USER')")
    public List<Team> appendComplianceScore(@Valid @RequestBody TeamListRequest teamListRequest) {
        List<Team> smartTeam = smartTeamService.appendComplianceScore(teamListRequest.getTeam(),
                teamListRequest.getCriteriaCompliances());
        return smartTeam;
    }

    @PostMapping("/team")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createTeam(@Valid @RequestBody TeamRequest teamRequest) {
        Team team = smartTeamService.createTeam(teamRequest);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{teamId}")
                .buildAndExpand(team.getTeamId()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "Team Created Successfully"));
    }

    @PostMapping("/teamlist")
    @PreAuthorize("hasRole('USER')")
    public List<Team> createTeamList(@Valid @RequestBody TeamListRequest teamListRequest) {
        return smartTeamService.createTeamList(teamListRequest);
    }

    @PostMapping("/allocate/team")
    @PreAuthorize("hasRole('USER')")
    public List<Team> allocateTeam(@Valid @RequestBody TeamListRequest teamListRequest) {
        return smartTeamService.allocateTeam(teamListRequest.getTeam(), teamListRequest.getCriteriaCompliances(), teamListRequest.getSwapPassThreshold());
    }

    @GetMapping("/{smartteamId}/teams")
    @PreAuthorize("hasAnyRole('USER','STUDENT')")
    public List<Team> getTeamsBySmartteamId(@PathVariable Long smartteamId) {
        return teamRepository.findBySmartteamSmartteamId(smartteamId).orElseThrow(() -> new ResourceNotFoundException("Teams with Smart Team ID", "id", smartteamId));
    }
}
