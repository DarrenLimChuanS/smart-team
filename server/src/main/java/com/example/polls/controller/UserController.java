package com.example.polls.controller;

import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.Section;
import com.example.polls.model.SmartTeam;
import com.example.polls.model.User;
import com.example.polls.payload.*;
import com.example.polls.repository.PollRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.repository.VoteRepository;
import com.example.polls.security.CurrentUser;
import com.example.polls.security.UserPrincipal;
import com.example.polls.service.*;
import com.example.polls.util.AppConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PollService pollService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private SectionService sectionService;

    @Autowired
    private CriteriaService criteriaService;

    @Autowired
    private QuestionnaireService questionnaireService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping("/user/me")
    @PreAuthorize("hasAnyRole('USER', 'STUDENT')")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId()).get();
        UserSummary userSummary = new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName(),
                user.getRoles());
        return userSummary;
    }

    @GetMapping("/user/checkUsernameAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
        Boolean isAvailable = !userRepository.existsByUsername(username);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/user/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = !userRepository.existsByEmail(email);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/users/{username}")
    public UserProfile getUserProfile(@PathVariable(value = "username") String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        long pollCount = pollRepository.countByCreatedBy(user.getId());
        long voteCount = voteRepository.countByUserId(user.getId());

        UserProfile userProfile = new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt(),
                pollCount, voteCount);

        return userProfile;
    }

    // Function to select all courses the User is in
    @GetMapping("/users/{username}/courses/in")
    public Set<UserCourse> getUserCourses(@PathVariable(value = "username") String username) throws ParseException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        Set<UserCourse> userInCourses = new HashSet<>();
        for (Section section : user.getSections()) {
            UserCourse course = new UserCourse(section.getCourse().getId(), section.getCourse().getName(),
                    section.getCourse().getDescription());
            for (SmartTeam smartteam : section.getSmartteams()) {
                Date now = new Date();
                Date startDate = smartteam.getSmartteamStartdate();
                long remainingSmartTeamTime = startDate.getTime() - now.getTime();
                // Time for SmartTeam initiation has not ended
                if (remainingSmartTeamTime > 0) {
                    course.setSection(section);
                } 
            }
            userInCourses.add(course);
        }
        return userInCourses;
    }

    // Function to select all User
    @GetMapping("/users")
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    // Function to select User by ID
    @GetMapping("/users/id/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    // Function to delete User
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userService.deleteById(id);
    }

    // Function to update User
    @PutMapping("/student/{id}")
    public ResponseEntity<User> updateStudent(@PathVariable(value = "id") Long id,
            @Valid @RequestBody User userDetails) {

        User temp = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        if (temp == null) {
            return ResponseEntity.notFound().build();
        }

        temp.setUsername(userDetails.getUsername());
        temp.setName(userDetails.getName());
        temp.setEmail(userDetails.getEmail());
        temp.setPassword(passwordEncoder.encode(userDetails.getPassword()));

        User updateUser = userRepository.save(temp);
        return ResponseEntity.ok().body(updateUser);
    }

    @GetMapping("/users/{username}/polls")
    public PagedResponse<PollResponse> getPollsCreatedBy(@PathVariable(value = "username") String username,
            @CurrentUser UserPrincipal currentUser,
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return pollService.getPollsCreatedBy(username, currentUser, page, size);
    }

    @GetMapping("/users/{username}/students")
    public PagedResponse<UserResponse> getStudentsCreatedBy(@PathVariable(value = "username") String username,
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return userService.getUsersCreatedBy(username, page, size);
    }

    @GetMapping("/users/{username}/courses")
    public PagedResponse<CourseResponse> getCoursesCreatedBy(@PathVariable(value = "username") String username,
            @CurrentUser UserPrincipal currentUser,
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return courseService.getCoursesCreatedBy(username, currentUser, page, size);
    }

    @GetMapping("/users/{username}/sections")
    public PagedResponse<SectionResponse> getSectionsCreatedBy(@PathVariable(value = "username") String username,
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return sectionService.getSectionsCreatedBy(username, page, size);
    }

    @GetMapping("/users/{username}/criteria")
    public PagedResponse<CriteriaResponse> getCriteriaCreatedBy(@PathVariable(value = "username") String username,
            @CurrentUser UserPrincipal currentUser,
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return criteriaService.getCriteriaCreatedBy(username, currentUser, page, size);
    }

    @GetMapping("/users/{username}/questionnaires")
    public PagedResponse<QuestionnaireResponse> getQuestionnairesCreatedBy(
            @PathVariable(value = "username") String username, @CurrentUser UserPrincipal currentUser,
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return questionnaireService.getQuestionnairesCreatedBy(username, currentUser, page, size);
    }

    @GetMapping("/users/{username}/votes")
    public PagedResponse<PollResponse> getPollsVotedBy(@PathVariable(value = "username") String username,
            @CurrentUser UserPrincipal currentUser,
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return pollService.getPollsVotedBy(username, currentUser, page, size);
    }

}
