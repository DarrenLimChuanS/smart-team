package com.example.polls.util;

import com.example.polls.model.*;
import com.example.polls.payload.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ModelMapper {

    public static UserResponse mapUserToUserResponse(User user, User creator) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setName(user.getName());
        userResponse.setUsername(user.getUsername());
        userResponse.setEmail(user.getEmail());
        userResponse.setRoles(user.getRoles());
        userResponse.setSections(user.getSections());
        userResponse.setSmartteams(user.getSmartteams());
        userResponse.setCreationDateTime(user.getCreatedAt());

        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName(),
                creator.getRoles());
        userResponse.setCreatedBy(creatorSummary);

        return userResponse;
    }

    public static PollResponse mapPollToPollResponse(Poll poll, Map<Long, Long> choiceVotesMap, User creator,
            Long userVote) {
        PollResponse pollResponse = new PollResponse();
        pollResponse.setId(poll.getId());
        pollResponse.setQuestion(poll.getQuestion());
        pollResponse.setCreationDateTime(poll.getCreatedAt());
        // pollResponse.setExpirationDateTime(poll.getExpirationDateTime());
        // Instant now = Instant.now();
        // pollResponse.setExpired(poll.getExpirationDateTime().isBefore(now));

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
        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName(),
                creator.getRoles());
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
        courseResponse.setSections(course.getSections());
        courseResponse.setCreationDateTime(course.getCreatedAt());

        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName(),
                creator.getRoles());
        courseResponse.setCreatedBy(creatorSummary);

        return courseResponse;
    }

    public static SectionResponse mapSectionToSectionResponse(Section section, User creator) {
        SectionResponse sectionResponse = new SectionResponse();
        sectionResponse.setSectionId(section.getSectionId());
        sectionResponse.setName(section.getName());
        sectionResponse.setCourseName(section.getCourse().getName());
        sectionResponse.setCourseDescription(section.getCourse().getDescription());
        sectionResponse.setNoOfStudents(section.getNoOfStudents());
        sectionResponse.setYear(section.getYear());
        sectionResponse.setStatus(section.getStatus());
        sectionResponse.setUsers(section.getUsers());
        sectionResponse.setCreationDateTime(section.getCreatedAt());

        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName(),
                creator.getRoles());
        sectionResponse.setCreatedBy(creatorSummary);

        return sectionResponse;
    }

    public static CriteriaResponse mapCriteriaToCriteriaResponse(Criteria criteria, User creator) {
        CriteriaResponse criteriaResponse = new CriteriaResponse();
        criteriaResponse.setId(criteria.getId());
        criteriaResponse.setName(criteria.getName());
        criteriaResponse.setGraded(criteria.getGraded());
        criteriaResponse.setDescription(criteria.getDescription());
        criteriaResponse.setQ1(criteria.getQ1());
        criteriaResponse.setQ2(criteria.getQ2());
        criteriaResponse.setQ3(criteria.getQ3());
        criteriaResponse.setQ4(criteria.getQ4());
        criteriaResponse.setPolls(criteria.getPolls());
        criteriaResponse.setCreationDateTime(criteria.getCreatedAt());

        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName(),
                creator.getRoles());
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

        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName(),
                creator.getRoles());
        questionnaireResponse.setCreatedBy(creatorSummary);

        return questionnaireResponse;
    }

}
