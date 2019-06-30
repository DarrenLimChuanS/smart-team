package com.example.polls.service;

import com.example.polls.exception.BadRequestException;
import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.User;
import com.example.polls.payload.ApiResponse;
import com.example.polls.payload.PagedResponse;
import com.example.polls.payload.UserResponse;
import com.example.polls.repository.UserRepository;
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

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Retrieve user creator details
        User creator = userRepository.findById(user.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", user.getCreatedBy()));

        return ModelMapper.mapUserToUserResponse(user, creator);
    }

    public PagedResponse<UserResponse> getUsersCreatedBy(String username, int page, int size) {
        validatePageNumberAndSize(page, size);

        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Retrieve all users created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<User> users = userRepository.findByCreatedBy(creator.getId(), pageable);

        if (users.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), users.getNumber(), users.getSize(),
                    users.getTotalElements(), users.getTotalPages(), users.isLast());
        }

        // Map users to UserResponses containing user creator details
        List<UserResponse> UserResponses = users.map(userInfo -> ModelMapper.mapUserToUserResponse(userInfo, creator))
                .getContent();

        return new PagedResponse<>(UserResponses, users.getNumber(), users.getSize(), users.getTotalElements(),
                users.getTotalPages(), users.isLast());
    }

    public ResponseEntity<Object> updateUserById(@RequestBody User user, @PathVariable Long userId) {

        Optional<User> userOptional = userRepository.findById(userId);

        if (!userOptional.isPresent())
            return ResponseEntity.notFound().build();

        user.setId(userId);
        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse(true, "User Updated Successfully"));

    }

    public ResponseEntity<?> deleteById(Long userId) {
        if (userRepository.findById(userId).isPresent()) {
            userRepository.deleteById(userId);
            return ResponseEntity.ok(new ApiResponse(true, "Student Deleted Successfully"));
        }
        return ResponseEntity.ok(new ApiResponse(false, "Student cannot be found."));
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
