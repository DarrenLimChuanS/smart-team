package com.example.polls.repository;

import com.example.polls.model.Team;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    Optional<Team> findByTeamId(Long smartteamId);

    void deleteById(Long smartteamId);

    List<Team> findAll();
}
