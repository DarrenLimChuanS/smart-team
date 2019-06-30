package com.example.polls.model;

import com.example.polls.model.audit.UserDateAudit;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
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

    private String description;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonManagedReference
    private Set<Section> sections = new HashSet<>();

    public Course() {

    }

    public Course(Long id, String course_code, String name, String description, Set<Section> sections) {
        this.id = id;
        this.course_code = course_code;
        this.name = name;
        this.description = description;
        this.sections = sections;
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

    public Set<Section> getSections() {
        return sections;
    }

    public void setSections(Set<Section> sections) {
        this.sections = sections;
    }

    public void addSection(Section section) {
        sections.add(section);
        section.setCourse(this);
    }

    public void removeSection(Section section) {
        sections.remove(section);
        section.setCourse(null);
    }
}
