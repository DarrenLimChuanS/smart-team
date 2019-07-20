package com.example.smartteam.payload;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CourseRequest {
    @NotBlank
    @Size(max = 140)
    private String courseCode;

    @NotBlank
    @Size(max = 140)
    private String name;

    @Size(max = 255)
    private String description;

    public String getCourseCode() {
        return courseCode;
    }

    public void getCourseCode(String courseCode) {
        this.courseCode = courseCode;
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
