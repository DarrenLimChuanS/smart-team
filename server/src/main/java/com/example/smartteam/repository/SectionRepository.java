package com.example.smartteam.repository;

import com.example.smartteam.model.Section;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {

    Optional<Section> findBySectionId(Long sectionId);

    Page<Section> findByCreatedBy(Long userId, Pageable pageable);

    long countByCreatedBy(Long userId);

    void deleteBySectionId(Long sectionId);

    List<Section> findBySectionIdIn(List<Long> sectionIds);

    List<Section> findBySectionIdIn(List<Long> sectionIds, Sort sort);
}
