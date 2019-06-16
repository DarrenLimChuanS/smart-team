package com.example.polls.util;

import com.example.polls.model.Course;
import com.example.polls.model.Poll;
import com.example.polls.model.Questionnaire;
import com.example.polls.model.User;
import com.example.polls.model.Section;
import com.example.polls.model.Criteria;
import com.example.polls.payload.ChoiceResponse;
import com.example.polls.payload.CourseResponse;
import com.example.polls.payload.PollResponse;
import com.example.polls.payload.QuestionnaireResponse;
import com.example.polls.payload.SectionResponse;
import com.example.polls.payload.CriteriaResponse;
import com.example.polls.payload.UserSummary;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ModelMapper {

    public static PollResponse mapPollToPollResponse(Poll poll, Map<Long, Long> choiceVotesMap, User creator,
            Long userVote) {
        PollResponse pollResponse = new PollResponse();
        pollResponse.setId(poll.getId());
        pollResponse.setQuestion(poll.getQuestion());
        pollResponse.setCreationDateTime(poll.getCreatedAt());
        pollResponse.setExpirationDateTime(poll.getExpirationDateTime());
        Instant now = Instant.now();
        pollResponse.setExpired(poll.getExpirationDateTime().isBefore(now));

        List<ChoiceResponse> choiceResponses = poll.getChoices().stream().map(choice -> {
            ChoiceResponse choiceResponse = new ChoiceResponse();
            choiceResponse.setId(choice.getId());
            choiceResponse.setText(choice.getText());

            if (choiceVotesMap.containsKey(choice.getId())) {
                choiceResponse.setVoteCount(choiceVotesMap.get(choice.getId()));
            } else {
                choiceResponse.setVoteCount(0);
            }
            return choiceResponse;
        }).collect(Collectors.toList());

        pollResponse.setChoices(choiceResponses);
        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName());
        pollResponse.setCreatedBy(creatorSummary);

        if (userVote != null) {
            pollResponse.setSelectedChoice(userVote);
        }

        long totalVotes = pollResponse.getChoices().stream().mapToLong(ChoiceResponse::getVoteCount).sum();
        pollResponse.setTotalVotes(totalVotes);

        return pollResponse;
    }

    public static CourseResponse mapCourseToCourseResponse(Course course, User creator) {
        CourseResponse courseResponse = new CourseResponse();
        courseResponse.setId(course.getId());
        courseResponse.setCourseCode(course.getCourseCode());
        courseResponse.setName(course.getName());
        courseResponse.setDescription(course.getDescription());
        courseResponse.setCreationDateTime(course.getCreatedAt());

        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName());
        courseResponse.setCreatedBy(creatorSummary);

        return courseResponse;
    }

    public static SectionResponse mapSectionToSectionResponse(Section section, User creator) {
        SectionResponse sectionResponse = new SectionResponse();
        sectionResponse.setSectionId(section.getSectionId());
        sectionResponse.setName(section.getName());
        sectionResponse.setNoOfStudents(section.getNoOfStudents());
        sectionResponse.setYear(section.getYear());
        sectionResponse.setCourse(section.getCourse());
        sectionResponse.setStatus(section.getStatus());
        sectionResponse.setStudents(section.getStudents());
        sectionResponse.setCreationDateTime(section.getCreatedAt());

        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName());
        sectionResponse.setCreatedBy(creatorSummary);

        return sectionResponse;
    }

    public static CriteriaResponse mapCriteriaToCriteriaResponse(Criteria criteria, User creator) {
        CriteriaResponse criteriaResponse = new CriteriaResponse();
        criteriaResponse.setId(criteria.getId());
        criteriaResponse.setName(criteria.getName());
        criteriaResponse.setType(criteria.getType());
        criteriaResponse.setGraded(criteria.getGraded());
        criteriaResponse.setDescription(criteria.getDescription());
        criteriaResponse.setQuestionnaire(criteria.getQuestionnaires());
        criteriaResponse.setCreationDateTime(criteria.getCreatedAt());

        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName());
        criteriaResponse.setCreatedBy(creatorSummary);

        return criteriaResponse;
    }

    public static QuestionnaireResponse mapQuestionnaireToQuestionnaireResponse(Questionnaire questionnaire,
            User creator) {
        QuestionnaireResponse questionnaireResponse = new QuestionnaireResponse();
        questionnaireResponse.setQuestionnaireId(questionnaire.getQuestionnaireId());
        questionnaireResponse.setName(questionnaire.getName());
        questionnaireResponse.setInstruction(questionnaire.getInstruction());
        questionnaireResponse.setCriteria(questionnaire.getCriteria());
        questionnaireResponse.setCreationDateTime(questionnaire.getCreatedAt());

        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName());
        questionnaireResponse.setCreatedBy(creatorSummary);

        return questionnaireResponse;
    }

}
