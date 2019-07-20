package com.example.smartteam.controller;

import com.example.smartteam.model.Course;
import com.example.smartteam.payload.ApiResponse;
import com.example.smartteam.payload.CourseRequest;
import com.example.smartteam.payload.CourseResponse;
import com.example.smartteam.payload.PagedResponse;
import com.example.smartteam.security.CurrentUser;
import com.example.smartteam.security.UserPrincipal;
import com.example.smartteam.service.CourseService;
import com.example.smartteam.util.AppConstants;
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
    private CourseService courseService;

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
        return courseService.updateCourseById(course, courseId);
    }

    @DeleteMapping("/{courseId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteCourse(@PathVariable long courseId) {
        return courseService.deleteById(courseId);
    }
}
