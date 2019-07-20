package com.example.smartteam.repository;

import com.example.smartteam.model.SmartTeam;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SmartTeamRepository extends JpaRepository<SmartTeam, Long> {
    Boolean existsByName(String name);

    Optional<SmartTeam> findBySmartteamId(Long smartteamId);

    Optional<SmartTeam> findByName(String name);

    void deleteById(Long smartteamId);

    List<SmartTeam> findAll();
}
