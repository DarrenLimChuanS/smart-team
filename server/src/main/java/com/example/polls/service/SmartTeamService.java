package com.example.polls.service;

import com.example.polls.exception.BadRequestException;
import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.Choice;
import com.example.polls.model.Criteria;
import com.example.polls.model.Poll;
import com.example.polls.model.SmartTeam;
import com.example.polls.model.User;
import com.example.polls.payload.ApiResponse;
import com.example.polls.payload.CriteriaRequest;
import com.example.polls.payload.CriteriaResponse;
import com.example.polls.payload.PagedResponse;
import com.example.polls.payload.SmartTeamRequest;
import com.example.polls.repository.CriteriaRepository;
import com.example.polls.repository.PollRepository;
import com.example.polls.repository.SmartTeamRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.security.UserPrincipal;
import com.example.polls.util.AppConstants;
import com.example.polls.util.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class SmartTeamService {

    @Autowired
    private CriteriaRepository criteriaRepository;

    @Autowired
    private SmartTeamRepository smartTeamRepository;

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PollService pollService;

    public SmartTeam createSmartTeam(SmartTeamRequest smartTeamRequest) {
        SmartTeam smartteam = new SmartTeam();
        smartteam.setName(smartTeamRequest.getName());
        System.out.println("HELLO NOTICE ME");
        System.out.println(smartTeamRequest.getSmartteamStartdate());
        smartteam.setSmartteamStartdate(smartTeamRequest.getSmartteamStartdate());
        smartteam.setSmartteamEnddate(smartTeamRequest.getSmartteamEnddate());
        smartteam.setQuestionnaire(smartTeamRequest.getQuestionnaire());
        smartteam.setUser(smartTeamRequest.getUser());
        smartteam.setSection(smartTeamRequest.getSection());

        return smartTeamRepository.save(smartteam);
    }

    public PagedResponse<CriteriaResponse> getCriteriaCreatedBy(String username, UserPrincipal currentUser, int page,
            int size) {
        validatePageNumberAndSize(page, size);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Retrieve all criterias created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Criteria> criterias = criteriaRepository.findByCreatedBy(user.getId(), pageable);

        if (criterias.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), criterias.getNumber(), criterias.getSize(),
                    criterias.getTotalElements(), criterias.getTotalPages(), criterias.isLast());
        }

        // Map criterias to CriteriaResponses
        List<CriteriaResponse> CriteriaResponses = criterias
                .map(criteria -> ModelMapper.mapCriteriaToCriteriaResponse(criteria, user)).getContent();

        return new PagedResponse<>(CriteriaResponses, criterias.getNumber(), criterias.getSize(),
                criterias.getTotalElements(), criterias.getTotalPages(), criterias.isLast());
    }

    public CriteriaResponse getCriteriaById(Long criteriaId) {
        Criteria criteria = criteriaRepository.findByCriteriaId(criteriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Criteria", "id", criteriaId));

        // Retrieve criteria creator details
        User creator = userRepository.findById(criteria.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", criteria.getCreatedBy()));

        return ModelMapper.mapCriteriaToCriteriaResponse(criteria, creator);
    }

    public ResponseEntity<Object> updateCriteriaById(@RequestBody Criteria criteria, @PathVariable Long criteriaId) {

        Optional<Criteria> criteriaOptional = criteriaRepository.findById(criteriaId);

        if (!criteriaOptional.isPresent())
            return ResponseEntity.notFound().build();

        criteria.setId(criteriaId);
        criteriaRepository.save(criteria);
        return ResponseEntity.ok(new ApiResponse(true, "Criteria Updated Successfully"));

    }

    public ResponseEntity<?> deleteById(Long criteriaId) {
        if (criteriaRepository.findById(criteriaId).isPresent()) {
            criteriaRepository.deleteById(criteriaId);
            return ResponseEntity.ok(new ApiResponse(true, "Criteria Deleted Successfully"));
        }
        return ResponseEntity.ok(new ApiResponse(false, "Criteria cannot be found."));
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
}
