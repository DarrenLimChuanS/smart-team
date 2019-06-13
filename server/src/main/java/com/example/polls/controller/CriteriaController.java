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
    private CriteriaRepository CriteriaRepository;

    @Autowired
    private CriteriaService criteriaService;

    @Autowired
    private PollService pollService;

    private static final Logger logger = LoggerFactory.getLogger(CriteriaController.class);

    @GetMapping("/criteria/checkNameAvailability")
    public CriteriaNameAvailability checkNameAvailability(@RequestParam(value = "name") String name) {
        Boolean isAvailable = !CriteriaRepository.existsByName(name);
        return new CriteriaNameAvailability(isAvailable);
    }

    @PostMapping("/criteria/createCriteria")
    // @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createCriteria(@RequestBody CriteriaRequest criteriaRequest) {
        Criteria criteria = criteriaService.createCriteria(criteriaRequest);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{critiera_Id}")
                .buildAndExpand(criteria.getId()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "Criteria Created Successfully"));
    }

    @PostMapping("/criteria/{name}")
    public ResponseEntity<Object> updateStudent(@RequestBody CriteriaRequest criteriaRequest, @PathVariable String name) {

        Boolean isExist = CriteriaRepository.existsByName(name);

        if (isExist == false)
            return ResponseEntity.notFound().build();

        Criteria criteria = criteriaService.createCriteria(criteriaRequest);
        
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{critiera_Id}")
                .buildAndExpand(criteria.getId()).toUri();

        return ResponseEntity.noContent().build();
    }

    // @GetMapping("/user/me")
    // @PreAuthorize("hasRole('USER')")
    // public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
    //     UserSummary userSummary = new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName());
    //     return userSummary;
    // }

    // @GetMapping("/user/checkUsernameAvailability")
    // public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
    //     Boolean isAvailable = !userRepository.existsByUsername(username);
    //     return new UserIdentityAvailability(isAvailable);
    // }

    // @GetMapping("/user/checkEmailAvailability")
    // public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
    //     Boolean isAvailable = !userRepository.existsByEmail(email);
    //     return new UserIdentityAvailability(isAvailable);
    // }

    // @GetMapping("/users/{username}")
    // public UserProfile getUserProfile(@PathVariable(value = "username") String username) {
    //     User user = userRepository.findByUsername(username)
    //             .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

    //     long pollCount = pollRepository.countByCreatedBy(user.getId());
    //     long voteCount = voteRepository.countByUserId(user.getId());

    //     UserProfile userProfile = new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt(), pollCount, voteCount);

    //     return userProfile;
    // }

    // @GetMapping("/users/{username}/polls")
    // public PagedResponse<PollResponse> getPollsCreatedBy(@PathVariable(value = "username") String username,
    //                                                      @CurrentUser UserPrincipal currentUser,
    //                                                      @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
    //                                                      @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
    //     return pollService.getPollsCreatedBy(username, currentUser, page, size);
    // }


    // @GetMapping("/users/{username}/votes")
    // public PagedResponse<PollResponse> getPollsVotedBy(@PathVariable(value = "username") String username,
    //                                                    @CurrentUser UserPrincipal currentUser,
    //                                                    @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
    //                                                    @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
    //     return pollService.getPollsVotedBy(username, currentUser, page, size);
    // }

}
