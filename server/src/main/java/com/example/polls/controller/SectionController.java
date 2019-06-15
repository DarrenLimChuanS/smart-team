package com.example.polls.controller;

import com.example.polls.model.Section;
import com.example.polls.payload.ApiResponse;
import com.example.polls.payload.SectionRequest;
import com.example.polls.payload.SectionResponse;
import com.example.polls.repository.CourseRepository;
import com.example.polls.repository.SectionRepository;
import com.example.polls.repository.StudentRepository;
import com.example.polls.security.CurrentUser;
import com.example.polls.security.UserPrincipal;
import com.example.polls.service.CourseService;
import com.example.polls.service.SectionService;
import java.net.URI;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/sections")
public class SectionController {

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SectionService sectionService;

    @Autowired
    private CourseService courseService;

    private static final Logger logger = LoggerFactory.getLogger(SectionController.class);

    @GetMapping() // Finds all stored lecturers in a pageable format
    public Page<Section> getSections(Pageable pageable) {
        return sectionRepository.findAll(pageable);
    }

    @GetMapping
    public PagedResponse<SectionResponse> getSections(@CurrentUser UserPrincipal currentUser,
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return sectionService.getAllSections(currentUser, page, size);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createSection(@Valid @RequestBody SectionRequest sectionRequest) {
        Section section = sectionService.createSection(sectionRequest);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{sectionId}")
                .buildAndExpand(section.getSectionId()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "Section Created Successfully"));
    }

    @GetMapping("/{sectionId}")
    @PreAuthorize("hasRole('USER')")
    public SectionResponse getSectionById(@CurrentUser UserPrincipal currentUser, @PathVariable Long sectionId) {
        return sectionService.getSectionById(sectionId, currentUser);
    }

    @PutMapping("/{sectionId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> updateSection(@RequestBody Section section, @PathVariable long sectionId) {
        return sectionService.updateSectionById(section, sectionId);
    }

    @DeleteMapping("/{sectionId}")
    @PreAuthorize("hasRole('USER')")
    @Transactional
    public ResponseEntity<?> deleteSection(@PathVariable long sectionId) {
        return sectionService.deleteById(sectionId);
    }
}
