package com.example.smartteam.repository;

import com.example.smartteam.model.ChoiceVoteCount;
import com.example.smartteam.model.Vote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    @Query("SELECT NEW com.example.smartteam.model.ChoiceVoteCount(v.choice.id, count(v.id)) FROM Vote v WHERE v.poll.id in :pollIds GROUP BY v.choice.id")
    List<ChoiceVoteCount> countByPollIdInGroupByChoiceId(@Param("pollIds") List<Long> pollIds);

    @Query("SELECT NEW com.example.smartteam.model.ChoiceVoteCount(v.choice.id, count(v.id)) FROM Vote v WHERE v.poll.id = :pollId GROUP BY v.choice.id")
    List<ChoiceVoteCount> countByPollIdGroupByChoiceId(@Param("pollId") Long pollId);

    @Query("SELECT v FROM Vote v where v.user.id = :userId and v.poll.id in :pollIds")
    List<Vote> findByUserIdAndPollIdIn(@Param("userId") Long userId, @Param("pollIds") List<Long> pollIds);

    @Query("SELECT v FROM Vote v where v.user.id = :userId and v.poll.id = :pollId")
    Vote findByUserIdAndPollId(@Param("userId") Long userId, @Param("pollId") Long pollId);

    @Query("SELECT COUNT(v.id) from Vote v where v.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT v.poll.id FROM Vote v WHERE v.user.id = :userId")
    Page<Long> findVotedPollIdsByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT v FROM Vote v where v.user.id = :userId and v.poll.id = :pollId and v.smartteam.id = :smartteamId and v.criteria.id = :criteriaId")
    Vote findByUserIdAndPollIdAndSmartteamIdAndCriteriaId(@Param("userId") Long userId, @Param("pollId") Long pollId,
            @Param("smartteamId") Long smartteamId, @Param("criteriaId") Long criteriaId);

    @Query("SELECT v FROM Vote v where v.user.id = :userId and v.smartteam.id = :smartteamId and v.criteria.id = :criteriaId")
    Vote findAllByUserIdAndSmartteamIdAndCriteriaId(@Param("userId") Long userId,
            @Param("smartteamId") Long smartteamId, @Param("criteriaId") Long criteriaId);

    @Query("SELECT v FROM Vote v where v.smartteam.id = :smartteamId")
    List<Vote> findAllBySmartteamId(@Param("smartteamId") Long smartteamId);

    // Query to fetch count of Smart Team outcome
    @Query(nativeQuery = true, value = "SELECT criteria_id AS CriteriaId, outcome AS Outcome, count(outcome) AS `OutcomeCount` FROM (SELECT * FROM smart_team.votes WHERE smartteam_id = ?1 GROUP BY criteria_id, user_id) a GROUP BY outcome, criteria_id ORDER BY criteria_id, outcome;")
    List<STOCount> countByOutcomeGroupByCriteriaId(Long smartteamId);

    // Query to fetch OutcomeList of the team for a criteria
    @Query("SELECT v.outcome FROM Vote v WHERE v.smartteam.id = :smartteamId AND v.criteria.id = :criteriaId AND v.user.id IN :userIds GROUP BY v.criteria.id, v.user.id")
    List<String> findOutcomeByUserIdAndCriteriaId(@Param("smartteamId") Long smartteamId, 
            @Param("criteriaId") Long criteriaId, @Param("userIds") List<Long> userIds);

    // Interface Based Projection
    public static interface STOCount {
        Long getCriteriaId();
        String getOutcome();
        Long getOutcomeCount();
    }
}