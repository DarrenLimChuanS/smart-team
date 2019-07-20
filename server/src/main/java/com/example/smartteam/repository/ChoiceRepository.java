package com.example.smartteam.repository;

import com.example.smartteam.model.Choice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChoiceRepository extends JpaRepository<Choice, Long> {

    Optional<Choice> findById(Long id);

}
