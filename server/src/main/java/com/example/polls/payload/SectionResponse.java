package com.example.polls.payload;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import com.example.polls.model.Student;
import com.example.polls.model.Course;

public class SectionResponse {
    private Long sectionId;
    private String name;
    private Long noOfStudents;
    private Long year;
    private String status;
    private Course course;
    private Set<Student> students = new HashSet<>();
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

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Set<Student> getStudents() {
        return students;
    }

    public void setStudents(Set<Student> students) {
        this.students = students;
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
}
