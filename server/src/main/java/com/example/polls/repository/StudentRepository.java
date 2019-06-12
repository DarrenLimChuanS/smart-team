package com.example.polls.repository;

import com.example.polls.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);

    Optional<Student> findByUsernameOrEmail(String username, String email);

    List<Student> findByIdIn(List<Long> userIds);

    List<Student> findByTeacherId(Long id);

    Optional<Student> findByUsername(String username);

    // Function to select all Students
    List<Student> findAll();

    // Function to delete Student
    void deleteById(Long id);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
