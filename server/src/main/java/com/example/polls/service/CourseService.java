package com.example.polls.service;

import com.example.polls.exception.BadRequestException;
import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.*;
import com.example.polls.payload.PagedResponse;
import com.example.polls.payload.CourseRequest;
import com.example.polls.payload.CourseResponse;
import com.example.polls.repository.CourseRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.security.UserPrincipal;
import com.example.polls.util.AppConstants;
import com.example.polls.util.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.polls.payload.ApiResponse;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(CourseService.class);

    public PagedResponse<CourseResponse> getAllCourses(UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        // Retrieve Courses
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Course> courses = courseRepository.findAll(pageable);

        if (courses.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), courses.getNumber(), courses.getSize(),
                    courses.getTotalElements(), courses.getTotalPages(), courses.isLast());
        }

        // Map courses to CourseResponses containing vote counts and course creator
        // details
        Map<Long, User> creatorMap = getCourseCreatorMap(courses.getContent());

        List<CourseResponse> CourseResponses = courses.map(course -> {
            return ModelMapper.mapCourseToCourseResponse(course, creatorMap.get(course.getCreatedBy()));
        }).getContent();

        return new PagedResponse<>(CourseResponses, courses.getNumber(), courses.getSize(), courses.getTotalElements(),
                courses.getTotalPages(), courses.isLast());
    }

    public PagedResponse<CourseResponse> getCoursesCreatedBy(String username, UserPrincipal currentUser, int page,
            int size) {
        validatePageNumberAndSize(page, size);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Retrieve all courses created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Course> courses = courseRepository.findByCreatedBy(user.getId(), pageable);

        if (courses.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), courses.getNumber(), courses.getSize(),
                    courses.getTotalElements(), courses.getTotalPages(), courses.isLast());
        }

        // Map courses to CourseResponses containing course creator details
        List<CourseResponse> CourseResponses = courses.map(course -> {
            return ModelMapper.mapCourseToCourseResponse(course, user);
        }).getContent();

        return new PagedResponse<>(CourseResponses, courses.getNumber(), courses.getSize(), courses.getTotalElements(),
                courses.getTotalPages(), courses.isLast());
    }

    public Course createCourse(CourseRequest courseRequest) {
        Course course = new Course();
        course.setCourseCode(courseRequest.getCourseCode());
        course.setName(courseRequest.getName());
        course.setDescription(courseRequest.getDescription());

        return courseRepository.save(course);
    }

    public CourseResponse getCourseById(Long courseId, UserPrincipal currentUser) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        // Retrieve course creator details
        User creator = userRepository.findById(course.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", course.getCreatedBy()));

        return ModelMapper.mapCourseToCourseResponse(course, creator);
    }

    public ResponseEntity<?> deleteById(Long courseId) {
        if (courseRepository.findById(courseId).isPresent())
            courseRepository.deleteById(courseId);
        return ResponseEntity.ok(new ApiResponse(true, "Course Deleted Successfully"));
    }

    public ResponseEntity<Object> updateStudentById(@RequestBody Course course, @PathVariable long courseId) {

        Optional<Course> courseOptional = courseRepository.findById(courseId);

        if (!courseOptional.isPresent())
            return ResponseEntity.notFound().build();

        course.setId(courseId);
        course.setCreatedAt(courseOptional.get().getCreatedAt());
        course.setCreatedBy(courseOptional.get().getCreatedBy());
        courseRepository.save(course);
        return ResponseEntity.ok(new ApiResponse(true, "Course Created Successfully"));
    }

    private void validatePageNumberAndSize(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if (size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }

    Map<Long, User> getCourseCreatorMap(List<Course> courses) {
        // Get Course Creator details of the given list of courses
        List<Long> creatorIds = courses.stream().map(Course::getCreatedBy).distinct().collect(Collectors.toList());

        List<User> creators = userRepository.findByIdIn(creatorIds);
        Map<Long, User> creatorMap = creators.stream().collect(Collectors.toMap(User::getId, Function.identity()));

        return creatorMap;
    }

}
