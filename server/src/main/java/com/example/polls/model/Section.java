package com.example.polls.model;

import com.example.polls.model.audit.UserDateAudit;
import javax.validation.constraints.NotBlank;
import javax.persistence.*;

@Entity
@Table(name = "section")
public class Section extends UserDateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sectionId;

    @NotBlank
    @Column(length = 60)
    private String name;

    @Column(length = 255)
    private Long noOfStudents;

    @Column(length = 6)
    private Long year;

    @Column(length = 255)
    private String status;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "id", nullable = false)
    private Course course;

    public Section() {

    }

    public Section(String name, Long noOfStudents, Long year, String status) {
        this.name = name;
        this.noOfStudents = noOfStudents;
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

}
