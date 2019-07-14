package com.example.polls.payload;

import com.example.polls.model.Course;
import com.example.polls.model.SmartTeam;
import com.example.polls.model.User;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

public class SectionRequest {
    @NotBlank
    @Size(max = 60)
    private String name;

    private Long noOfStudents;

    private Long year;

    @Size(max = 255)
    private String status;

    private Course course;

    private Set<User> users = new HashSet<>();

    private Set<SmartTeam> smartteams = new HashSet<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getNoOfStudents() {
        return noOfStudents;
    }

    public void setNoOfStudents(Long noOfStudents) {
        this.noOfStudents = noOfStudents;
    }

    public Long getYear() {
        return year;
    }

    public void setYear(Long year) {
        this.year = year;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
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

    public Set<SmartTeam> getSmartteams() {
        return smartteams;
    }

    public void setSmartteams(Set<SmartTeam> smartteams) {
        this.smartteams = smartteams;
    }
}
