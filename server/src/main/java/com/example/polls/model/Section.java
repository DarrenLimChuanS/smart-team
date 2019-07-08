package com.example.polls.model;

import com.example.polls.model.audit.UserDateAudit;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "section")
public class Section extends UserDateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sectionId;

    @NotBlank
    @Column(length = 60)
    private String name;

    private Long noOfStudents;

    @Column(length = 6)
    private Long year;

    private String status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference("course_sections")
    private Course course;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinTable(name = "section_users", joinColumns = { @JoinColumn(name = "section_id") }, inverseJoinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "id") })
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Set<User> users = new HashSet<>();

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference("smartteam_section")
    private Set<SmartTeam> smartteams = new HashSet<>();

    public Section() {

    }

    public Section(String name, Long noOfStudents, Course course, Long year, String status, Set<User> users) {
        this.name = name;
        this.noOfStudents = noOfStudents;
        this.users = users;
        this.course = course;
        this.year = year;
        this.status = status;
    }

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
