package com.example.polls.repository;

import com.example.polls.model.Criteria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Created by rajeevkumarsingh on 02/08/17.
 */
@Repository
public interface UserRepository extends JpaRepository<Criteria, Long> {
    Optional<Criteria> findByEmail(String email);

    Optional<Criteria> findByUsernameOrEmail(String username, String email);

    List<Criteria> findByIdIn(List<Long> userIds);

    Optional<Criteria> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
