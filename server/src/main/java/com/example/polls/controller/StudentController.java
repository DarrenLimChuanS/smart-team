package com.example.polls.controller;

import com.example.polls.exception.AppException;
import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.Role;
import com.example.polls.model.RoleName;
import com.example.polls.model.Student;
import com.example.polls.payload.*;
import com.example.polls.repository.PollRepository;
import com.example.polls.repository.VoteRepository;
import com.example.polls.repository.StudentRepository;
import com.example.polls.repository.RoleRepository;
import com.example.polls.security.UserPrincipal;
import com.example.polls.service.PollService;
import com.example.polls.security.CurrentUser;
import com.example.polls.util.AppConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.Collections;

@RestController
@RequestMapping("/api")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private PollService pollService;

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    @GetMapping("/student/me")
    @PreAuthorize("hasRole('STUDENT')")
    public UserSummary getCurrentStudent(@CurrentUser UserPrincipal currentUser) {
        UserSummary userSummary = new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName());
        return userSummary;
    }

    @GetMapping("/student/checkUsernameAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
        Boolean isAvailable = !studentRepository.existsByUsername(username);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/student/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = !studentRepository.existsByEmail(email);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/student/{username}")
    public UserProfile getStudentProfile(@PathVariable(value = "username") String username) {
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        long pollCount = pollRepository.countByCreatedBy(student.getId());
        long voteCount = voteRepository.countByUserId(student.getId());

        UserProfile userProfile = new UserProfile(student.getId(), student.getUsername(), student.getName(), student.getCreatedAt(), pollCount, voteCount);

        return userProfile;
    }

    // Function to select all Student
    @GetMapping("/student")
    public List<Student> getStudent() {
        List<Student> studentList = studentRepository.findAll();

        return studentList;
    }

    // Function to delete Student
    @DeleteMapping("/student/{id}")
    public void deleteStudent(@PathVariable long id) {
        studentRepository.deleteById(id);
    }

    // Function to create Student
    @PostMapping("/student/add")
    public ResponseEntity<?> addStudent(@Valid @RequestBody StudentRequest studentRequest) {
        if(studentRepository.existsByUsername(studentRequest.getUsername())) {
            return new ResponseEntity(new ApiResponse(false, "Username is already taken!"),
                    HttpStatus.BAD_REQUEST);
        }

        if(studentRepository.existsByEmail(studentRequest.getEmail())) {
            return new ResponseEntity(new ApiResponse(false, "Email Address already in use!"),
                    HttpStatus.BAD_REQUEST);
        }

        // Creating student's account
        Student student = new Student(studentRequest.getBatch_no(), studentRequest.getName(), studentRequest.getUsername(),
                studentRequest.getEmail(), studentRequest.getPassword());

        student.setPassword(passwordEncoder.encode(student.getPassword()));

        Role studentRole = roleRepository.findByName(RoleName.ROLE_STUDENT)
                .orElseThrow(() -> new AppException("User Role not set."));

        student.setRoles(Collections.singleton(studentRole));

        Student result = studentRepository.save(student);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/student/{username}")
                .buildAndExpand(result.getUsername()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "Student created successfully"));
    }
}
