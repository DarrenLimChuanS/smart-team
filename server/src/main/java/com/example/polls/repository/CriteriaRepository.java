package com.example.polls.repository;

import com.example.polls.model.Criteria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CriteriaRepository extends JpaRepository<Criteria, Long> {
    Boolean existsByName(String name);

    Page<Criteria> findByCreatedBy(Long userId, Pageable pageable);

    Optional<Criteria> findByName(String name);

    Optional<Criteria> findById(Long criteriaId);

    void deleteById(Long criteriaId);

    List<Criteria> findAll();
}
