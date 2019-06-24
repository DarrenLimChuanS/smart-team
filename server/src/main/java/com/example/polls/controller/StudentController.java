package com.example.polls.controller;

import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.Student;
import com.example.polls.payload.*;
import com.example.polls.repository.*;
import com.example.polls.security.CurrentUser;
import com.example.polls.security.UserPrincipal;
import com.example.polls.service.PollService;
import com.example.polls.service.SectionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private VoteRepository voteRepository;

    @GetMapping("/student/me")
    @PreAuthorize("hasRole('STUDENT')")
    public UserSummary getCurrentStudent(@CurrentUser UserPrincipal currentUser) {
        UserSummary userSummary = new UserSummary(currentUser.getId(), currentUser.getUsername(),
                currentUser.getName());
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

        UserProfile userProfile = new UserProfile(student.getId(), student.getUsername(), student.getName(),
                student.getCreatedAt(), pollCount, voteCount);

        return userProfile;
    }

    // Function to select all Student
    @GetMapping("/students")
    public Page<Student> getStudent(Pageable pageable) {
        return this.studentRepository.findAll(pageable);
    }

    // Function to create Student tied to Teacher
    @PostMapping("/users/{teacherId}/students")
    public ResponseEntity<?> addStudent(@PathVariable(value = "teacherId") Long teacherId,
            @Valid @RequestBody StudentRequest studentRequest) {
        if (studentRepository.existsByUsername(studentRequest.getUsername())) {
            return new ResponseEntity(new ApiResponse(false, "Username is already taken!"), HttpStatus.BAD_REQUEST);
        }

        if (studentRepository.existsByEmail(studentRequest.getEmail())) {
            return new ResponseEntity(new ApiResponse(false, "Email Address already in use!"), HttpStatus.BAD_REQUEST);
        }

        // Creating student's account
        Student student = new Student(studentRequest.getBatch_no(), studentRequest.getName(),
                studentRequest.getUsername(), studentRequest.getEmail(), studentRequest.getPassword());

        student.setPassword(passwordEncoder.encode(student.getPassword()));

        Student result = studentRepository.save(student);

        return this.userRepository.findById(teacherId).map((teacher) -> {
            // Map student into teacher
            teacher.getStudents().add(student);
            this.userRepository.save(teacher);

            URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path("/student/{username}")
                    .buildAndExpand(result.getUsername()).toUri();

            return ResponseEntity.created(location).body(new ApiResponse(true, "Student created successfully"));
        }).orElseThrow(() -> new ResourceNotFoundException("User", "id", teacherId));
    }

    // Function to get Student by its ID
    @GetMapping("/students/{studentId}")
    public Student getStudentById(@PathVariable(value = "studentId") Long studentId, UserPrincipal currentUser) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        return student;
    }

    // Function to update Student
    @PutMapping("/student/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable(value = "id") Long id,
            @Valid @RequestBody Student studentDetails) {

        Student temp = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        if (temp == null) {
            return ResponseEntity.notFound().build();
        }

        temp.setBatch_no(studentDetails.getBatch_no());
        temp.setUsername(studentDetails.getUsername());
        temp.setName(studentDetails.getName());
        temp.setEmail(studentDetails.getEmail());
        temp.setPassword(studentDetails.getPassword());
        // temp.setTeacher(studentDetails.getTeacher());

        Student updateStudent = studentRepository.save(temp);
        return ResponseEntity.ok().body(updateStudent);
    }

    // Function to delete Student
    @DeleteMapping("/student/{studentId}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long studentId) {
        if (studentRepository.findById(studentId).isPresent()) {
            studentRepository.deleteById(studentId);
            return ResponseEntity.ok(new ApiResponse(true, "Student Deleted Successfully"));
        } else {
            return ResponseEntity.ok(new ApiResponse(false, "Student ID not found."));
        }

    }
}
