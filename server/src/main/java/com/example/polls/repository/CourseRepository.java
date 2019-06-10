package com.example.polls.repository;

import com.example.polls.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    Optional<Course> findById(Long courseId);

    Page<Course> findByCreatedBy(Long userId, Pageable pageable);

    long countByCreatedBy(Long userId);

    void deleteById(Long courseId);

    List<Course> findByIdIn(List<Long> courseIds);

    List<Course> findByIdIn(List<Long> courseIds, Sort sort);
}
