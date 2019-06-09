package com.example.polls.model;

import com.example.polls.model.audit.UserDateAudit;
import javax.validation.constraints.NotBlank;
import javax.persistence.*;

@Entity
@Table(name = "courses")
public class Course extends UserDateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(length = 60)
    private String course_id;

    @NotBlank
    @Column(length = 60)
    private String name;

    @Column(length = 255)
    private String description;

    public Course() {

    }

    public Course(String course_id, String name, String description) {
        this.course_id = course_id;
        this.name = name;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseId() {
        return course_id;
    }

    public void setCourseId(String course_id) {
        this.course_id = course_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
