package com.example.smartteam.repository;

import com.example.smartteam.model.Team;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    Optional<Team> findByTeamId(Long teamId);

    Optional<List<Team>> findBySmartteamSmartteamId(Long smartteamId);

    void deleteById(Long smartteamId);

    List<Team> findAll();
}
