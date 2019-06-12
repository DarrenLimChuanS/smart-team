package com.example.polls.controller;

import com.example.polls.model.Course;
import com.example.polls.model.Section;
import com.example.polls.payload.ApiResponse;
import com.example.polls.payload.CourseRequest;
import com.example.polls.payload.CourseResponse;
import com.example.polls.payload.PagedResponse;
import com.example.polls.payload.SectionResponse;
import com.example.polls.repository.CourseRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.repository.SectionRepository;
import com.example.polls.service.CourseService;
import com.example.polls.service.SectionService;
import com.example.polls.util.AppConstants;
import com.example.polls.security.CurrentUser;
import com.example.polls.security.UserPrincipal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private CourseService courseService;

    @Autowired
    private SectionService sectionService;

    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);

    @GetMapping
    public PagedResponse<CourseResponse> getCourses(@CurrentUser UserPrincipal currentUser,
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return courseService.getAllCourses(currentUser, page, size);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createCourse(@Valid @RequestBody CourseRequest courseRequest) {
        Course course = courseService.createCourse(courseRequest);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{courseId}")
                .buildAndExpand(course.getId()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "Course Created Successfully"));
    }

    @GetMapping("/{courseId}")
    @PreAuthorize("hasRole('USER')")
    public CourseResponse getCourseById(@CurrentUser UserPrincipal currentUser, @PathVariable Long courseId) {
        return courseService.getCourseById(courseId, currentUser);
    }

    @PutMapping("/{courseId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> updateStudent(@RequestBody Course course, @PathVariable long courseId) {
        return courseService.updateStudentById(course, courseId);
    }

    @DeleteMapping("/{courseId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteCourse(@PathVariable long courseId) {
        return courseService.deleteById(courseId);
    }
}
