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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.stereotype.Service;
import com.example.polls.payload.ApiResponse;

import java.util.Collections;
import java.util.Optional;
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

    public ResponseEntity<Object> updateCriteriaById(@RequestBody Criteria criteria, @PathVariable Long criteria_id) {

        Optional<Criteria> criteriaOptional = criteriaRepository.findById(criteria_id);

        if (!criteriaOptional.isPresent())
            return ResponseEntity.notFound().build();

        criteria.setId(criteria_id);
        criteriaRepository.save(criteria);
        return ResponseEntity.ok(new ApiResponse(true, "Criteria Updated Successfully"));
    }

    public ResponseEntity<?> deleteById(Long criteria_id) {
        if (criteriaRepository.findById(criteria_id).isPresent()){
            criteriaRepository.deleteById(criteria_id);
            return ResponseEntity.ok(new ApiResponse(true, "Criteria Deleted Successfully"));
        }
        return ResponseEntity.ok(new ApiResponse(false, "Criteria Deleted is Unsuccessful"));
    }

    public List<Criteria> getAllCriteria() {
        return criteriaRepository.findAll();
    }

    private void validatePageNumberAndSize(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if (size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }

    /** PROTOTYPE OF UPDATE BY NAME **/
    // public ResponseEntity<Object> updateCriteriaByName(@RequestBody Criteria criteria, @PathVariable String name) {

    //     Optional<Criteria> criteriaOptional = criteriaRepository.findByName(name);

    //     if (!criteriaOptional.isPresent())
    //         return ResponseEntity.notFound().build();

    //     criteria.setId(courseId);
    //     courseRepository.save(criteria);
    //     return ResponseEntity.ok(new ApiResponse(true, "Course Updated Successfully"));
    // }

}
