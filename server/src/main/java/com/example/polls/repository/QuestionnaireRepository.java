package com.example.polls.repository;

import com.example.polls.model.Questionnaire;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Created by rajeevkumarsingh on 02/08/17.
 */
@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {

    Boolean existsByName(String name);

    Optional<Questionnaire> findByName(String name);

    Optional<Questionnaire> findByQuestionnaireId(Long questionnaire_id);

    Page<Questionnaire> findByCreatedBy(Long userId, Pageable pageable);

    void deleteById(Long questionnaire_id);

    List<Questionnaire> findAll();
}
