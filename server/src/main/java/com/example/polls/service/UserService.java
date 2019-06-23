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
import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;




@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


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
        List<UserResponse> UserResponses = users.map(userInfo -> ModelMapper.mapUserToUserResponse(userInfo, creator)).getContent();

        return new PagedResponse<>(UserResponses, users.getNumber(), users.getSize(), users.getTotalElements(),
                users.getTotalPages(), users.isLast());
    }

    public ResponseEntity<?> deleteById(Long userId) {
        if (userRepository.findById(userId).isPresent())
            userRepository.deleteById(userId);
        return ResponseEntity.ok(new ApiResponse(true, "User Deleted Successfully"));
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
