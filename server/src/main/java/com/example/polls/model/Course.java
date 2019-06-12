package com.example.polls.model;

import com.example.polls.model.audit.UserDateAudit;
import javax.validation.constraints.NotBlank;
import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
public class Course extends UserDateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(length = 60)
    private String course_code;

    @NotBlank
    @Column(length = 60)
    private String name;

    @Column(length = 255)
    private String description;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "course_section", joinColumns = @JoinColumn(name = "id"), inverseJoinColumns = @JoinColumn(name = "section_id"))
    private Set<Section> roles = new HashSet<>();

    public Course() {

    }

    public Course(String course_code, String name, String description) {
        this.course_code = course_code;
        this.name = name;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseCode() {
        return course_code;
    }

    public void setCourseCode(String course_code) {
        this.course_code = course_code;
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
