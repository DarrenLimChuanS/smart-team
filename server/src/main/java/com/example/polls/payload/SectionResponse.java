package com.example.polls.payload;

import com.example.polls.model.Course;
import com.example.polls.model.SmartTeam;
import com.example.polls.model.User;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

public class SectionResponse {
    private Long sectionId;
    private String name;
    private Long noOfStudents;
    private String courseName;
    private String courseDescription;
    private Long year;
    private String status;
    private Set<User> users = new HashSet<>();
    private Set<SmartTeam> smartteams = new HashSet<>();
    private Course course;
    private UserSummary createdBy;
    private Instant creationDateTime;

    public Long getSectionId() {
        return sectionId;
    }

    public void setSectionId(Long sectionId) {
        this.sectionId = sectionId;
    }

    public String getName() {
        return name;
    }

    public Long getNoOfStudents() {
        return noOfStudents;
    }

    public void setNoOfStudents(Long noOfStudents) {
        this.noOfStudents = noOfStudents;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getCourseDescription() {
        return courseDescription;
    }

    public void setCourseDescription(String courseDescription) {
        this.courseDescription = courseDescription;
    }

    public Long getYear() {
        return year;
    }

    public void setYear(Long year) {
        this.year = year;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public UserSummary getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserSummary createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreationDateTime() {
        return creationDateTime;
    }

    public void setCreationDateTime(Instant creationDateTime) {
        this.creationDateTime = creationDateTime;
    }

    public Set<SmartTeam> getSmartteams() {
        return smartteams;
    }

    public void setSmartteams(Set<SmartTeam> smartteams) {
        this.smartteams = smartteams;
    }
}
