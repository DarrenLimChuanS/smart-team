package com.example.polls.model;

import com.example.polls.model.audit.UserDateAudit;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "id", nullable = false)
    private Course course;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinTable(name = "section_students", joinColumns = { @JoinColumn(name = "section_id") }, inverseJoinColumns = {
            @JoinColumn(name = "id") })
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Set<Student> students = new HashSet<>();

    public Section() {

    }

    public Section(String name, Long noOfStudents, Set<Student> students, Course course, Long year, String status) {
        this.name = name;
        this.noOfStudents = noOfStudents;
        this.students = students;
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

    public Set<Student> getStudents() {
        return students;
    }

    public void setStudents(Set<Student> students) {
        this.students = students;
    }
}
