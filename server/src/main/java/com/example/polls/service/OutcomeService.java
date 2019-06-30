package com.example.polls.service;

import com.example.polls.exception.BadRequestException;
import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.Choice;
import com.example.polls.model.Criteria;
import com.example.polls.model.Outcome;
import com.example.polls.model.Vote;
import com.example.polls.model.Poll;
import com.example.polls.model.User;
import com.example.polls.payload.ApiResponse;
import com.example.polls.payload.CriteriaRequest;
import com.example.polls.payload.CriteriaResponse;
import com.example.polls.payload.OutcomeRequest;
import com.example.polls.payload.PagedResponse;
import com.example.polls.repository.CriteriaRepository;
import com.example.polls.repository.ChoiceRepository;
import com.example.polls.repository.VoteRepository;
import com.example.polls.repository.PollRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.security.UserPrincipal;
import com.example.polls.util.AppConstants;
import com.example.polls.util.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Collections;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class OutcomeService {

    @Autowired
    private CriteriaRepository criteriaRepository;

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChoiceRepository choiceRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private PollService pollService;

    /* TO GET CATEGORISE RESULT */
    public Outcome categorise(OutcomeRequest outcomeRequest, int totalScore){
        Outcome outcome = new Outcome();

        Criteria criteria = criteriaRepository.findByCriteriaId(outcomeRequest.getCriteriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Criteria", "id", outcomeRequest.getCriteriaId()));

        int q1 = criteria.getQ1();
        int q2 = criteria.getQ2();
        int q3 = criteria.getQ3();
        int q4 = criteria.getQ4();

        if(totalScore <= q1)
            outcome.setOutcome("q1");
        else if (totalScore > q1 && totalScore <= q2)
            outcome.setOutcome("q2");
        else if (totalScore > q2 && totalScore <= q3)
            outcome.setOutcome("q3");
        else if (totalScore <= q4)
            outcome.setOutcome("q4");

        outcome.setCriteriaId(outcomeRequest.getCriteriaId());

        return outcome;
    }

    /* TO UPDATE VOTE TABLE */
    public ResponseEntity<Object> updateVote(OutcomeRequest outcomeRequest, Choice choice, String outcome) {

        Vote tempVote = voteRepository.findByUserIdAndPollIdAndSmartteamIdAndCriteriaId(outcomeRequest.getUserId(),outcomeRequest.getPollId(),outcomeRequest.getSmartteamId(),outcomeRequest.getCriteriaId());
        
        tempVote.setChoice(choice);
        tempVote.setOutcome(outcome);
        voteRepository.save(tempVote);
        return ResponseEntity.ok(new ApiResponse(true, "Vote Updated Successfully"));
    }
    
}
