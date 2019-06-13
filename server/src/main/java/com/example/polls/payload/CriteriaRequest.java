package com.example.polls.payload;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CriteriaRequest {
    

    @NotBlank
    @Size(max = 40)
    private String name;

    @NotBlank
    @Size(max = 15)
    private String type;

    @Size(max = 255)
    private String description;

    private Boolean graded;
    

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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getGraded() {
        return graded;
    }

    public void setGraded(Boolean graded) {
        this.graded = graded;
    }
}
