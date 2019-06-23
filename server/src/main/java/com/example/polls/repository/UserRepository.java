package com.example.polls.repository;

import com.example.polls.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    Optional<User> findById(Long userId);

    Page<User> findByCreatedBy(Long userId, Pageable pageable);

    Optional<User> findByUsernameOrEmail(String username, String email);

    List<User> findByIdIn(List<Long> userIds);

    Optional<User> findByUsername(String username);

    // Function to select all User
    List<User> findAll();

    // Function to delete User
    void deleteById(Long id);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
