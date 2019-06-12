package com.example.polls.payload;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class SectionRequest {
    @NotBlank
    @Size(max = 60)
    private String name;

    @Size(max = 255)
    private Long noOfStudents;

    @Size(max = 6)
    private Long year;

    @Size(max = 255)
    private String status;

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

}
