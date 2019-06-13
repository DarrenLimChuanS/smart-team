package com.example.polls.service;

import com.example.polls.exception.BadRequestException;
import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.*;
import com.example.polls.payload.PagedResponse;
import com.example.polls.payload.CriteriaRequest;
import com.example.polls.payload.CriteriaResponse;
import com.example.polls.repository.CriteriaRepository;
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
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class CriteriaService {

    @Autowired
    private CriteriaRepository criteriaRepository;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(CriteriaService.class);


    public Criteria createCriteria(CriteriaRequest criteriaRequest) {
        Criteria criteria = new Criteria();
        criteria.setName(criteriaRequest.getName());
        criteria.setDescription(criteriaRequest.getDescription());
        criteria.setType(criteriaRequest.getType());
        criteria.setGraded(criteriaRequest.getGraded());
        return criteriaRepository.save(criteria);
    }

    public Criteria updateCriteria(CriteriaRequest criteriaRequest) {
        Criteria criteria = new Criteria();
        criteria.setName(criteriaRequest.getName());
        criteria.setDescription(criteriaRequest.getDescription());
        criteria.setType(criteriaRequest.getType());
        criteria.setGraded(criteriaRequest.getGraded());
        return criteriaRepository.save(criteria);
    }

    // public CourseResponse getCourseById(Long courseId, UserPrincipal currentUser) {
    //     Course course = courseRepository.findById(courseId)
    //             .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

    //     // Retrieve course creator details
    //     User creator = userRepository.findById(course.getCreatedBy())
    //             .orElseThrow(() -> new ResourceNotFoundException("User", "id", course.getCreatedBy()));

    //     return ModelMapper.mapCourseToCourseResponse(course, creator);
    // }

}
