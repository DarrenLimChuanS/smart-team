package com.example.smartteam.controller;

import com.example.smartteam.exception.AppException;
import com.example.smartteam.model.Role;
import com.example.smartteam.model.RoleName;
import com.example.smartteam.model.User;
import com.example.smartteam.payload.ApiResponse;
import com.example.smartteam.payload.JwtAuthenticationResponse;
import com.example.smartteam.payload.LoginRequest;
import com.example.smartteam.payload.SignUpRequest;
import com.example.smartteam.repository.RoleRepository;
import com.example.smartteam.repository.UserRepository;
import com.example.smartteam.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

        @Autowired
        AuthenticationManager authenticationManager;

        @Autowired
        UserRepository userRepository;

        @Autowired
        RoleRepository roleRepository;

        @Autowired
        PasswordEncoder passwordEncoder;

        @Autowired
        JwtTokenProvider tokenProvider;

        private RoleName getRole(String role) {
                switch (role) {
                case "teacher":
                        return RoleName.ROLE_USER;
                case "student":
                        return RoleName.ROLE_STUDENT;
                case "admin":
                        return RoleName.ROLE_ADMIN;
                default:
                        return RoleName.ROLE_USER;
                }
        }

        @PostMapping("/signin")
        public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

                Authentication authentication = authenticationManager
                                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsernameOrEmail(),
                                                loginRequest.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                String jwt = tokenProvider.generateToken(authentication);
                return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
        }

        @PostMapping("/signup/{role}")
        public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest,
                        @PathVariable String role) {
                if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                        return new ResponseEntity(new ApiResponse(false, "Username is already taken!"),
                                        HttpStatus.BAD_REQUEST);
                }

                if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                        String message = "Email Address already in use!";
                        return new ResponseEntity(new ApiResponse(false, message), HttpStatus.BAD_REQUEST);
                }

                // Creating user's account
                User user = new User(signUpRequest.getName(), signUpRequest.getUsername(), signUpRequest.getEmail(),
                                signUpRequest.getPassword());

                user.setPassword(passwordEncoder.encode(user.getPassword()));

                Role userRole = roleRepository.findByName(getRole(role))
                                .orElseThrow(() -> new AppException("User Role not set."));

                user.setRoles(Collections.singleton(userRole));

                User result = userRepository.save(user);

                URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path("/users/{username}")
                                .buildAndExpand(result.getUsername()).toUri();

                return ResponseEntity.created(location).body(new ApiResponse(true, "User registered successfully"));
        }
}
