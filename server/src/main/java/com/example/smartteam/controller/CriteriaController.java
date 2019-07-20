package com.example.smartteam.controller;

import com.example.smartteam.exception.ResourceNotFoundException;
import com.example.smartteam.model.Criteria;
import com.example.smartteam.payload.ApiResponse;
import com.example.smartteam.payload.CriteriaNameAvailability;
import com.example.smartteam.payload.CriteriaRequest;
import com.example.smartteam.payload.CriteriaResponse;
import com.example.smartteam.repository.CriteriaRepository;
import com.example.smartteam.repository.UserRepository;
import com.example.smartteam.service.CriteriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/criteria")
public class CriteriaController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CriteriaRepository criteriaRepository;

    @Autowired
    private CriteriaService criteriaService;

    @GetMapping("/checkNameAvailability")
    public CriteriaNameAvailability checkNameAvailability(@RequestParam(value = "name") String name) {
        Boolean isAvailable = !criteriaRepository.existsByName(name);
        return new CriteriaNameAvailability(isAvailable);
    }

    @GetMapping()
    public List<Criteria> getCriteria() {
        return criteriaRepository.findAll();
    }

    @GetMapping("/{criteriaId}")
    @PreAuthorize("hasRole('USER')")
    public CriteriaResponse getCriteriaById(@PathVariable Long criteriaId) {
        return criteriaService.getCriteriaById(criteriaId);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createCriteria(@Valid @RequestBody CriteriaRequest criteriaRequest) {
        Criteria criteria = criteriaService.createCriteria(criteriaRequest);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{criteriaId}")
                .buildAndExpand(criteria.getId()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "Criteria Created Successfully"));
    }

    @PutMapping("/{criteriaId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> updateCriteria(@RequestBody Criteria criteria, @PathVariable Long criteriaId,
            @PathVariable Long user_id) {
        return userRepository.findById(user_id).map(user -> criteriaService.updateCriteriaById(criteria, criteriaId)).orElseThrow(() -> new ResourceNotFoundException("User", "id", user_id));
    }

    @DeleteMapping("/{criteriaId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteCriteria(@PathVariable long criteriaId) {
        return criteriaService.deleteById(criteriaId);
    }

}
