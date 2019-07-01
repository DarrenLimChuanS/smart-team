package com.example.polls.payload;

import com.example.polls.model.Course;
import java.util.HashSet;
import java.util.Set;

public class UserCourses {
    private Long id;
    private String username;
    private String name;
    private Set<Course> courses = new HashSet<>();

    public UserCourses(Long id, String username, String name, Set<Course> courses) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.courses = courses;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Course> getCourses() {
        return courses;
    }

    public void setName(Set<Course> courses) {
        this.courses = courses;
    }
}
