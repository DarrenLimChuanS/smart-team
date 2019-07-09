package com.example.polls.service;

import com.example.polls.exception.BadRequestException;
import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.Course;
import com.example.polls.model.Section;
import com.example.polls.model.User;
import com.example.polls.payload.ApiResponse;
import com.example.polls.payload.PagedResponse;
import com.example.polls.payload.SectionRequest;
import com.example.polls.payload.SectionResponse;
import com.example.polls.repository.CourseRepository;
import com.example.polls.repository.SectionRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.util.AppConstants;
import com.example.polls.util.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class SectionService {

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    Logger logger = LoggerFactory.getLogger(SectionService.class);

    public PagedResponse<SectionResponse> getAllSections(int page, int size) {
        validatePageNumberAndSize(page, size);

        // Retrieve Sections
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Section> sections = sectionRepository.findAll(pageable);

        if (sections.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), sections.getNumber(), sections.getSize(),
                    sections.getTotalElements(), sections.getTotalPages(), sections.isLast());
        }

        // Map section to SectionResponse containing section creator details
        Map<Long, User> creatorMap = getSectionCreatorMap(sections.getContent());

        List<SectionResponse> SectionResponses = sections.map(
                section -> ModelMapper.mapSectionToSectionResponse(section, creatorMap.get(section.getCreatedBy())))
                .getContent();

        return new PagedResponse<>(SectionResponses, sections.getNumber(), sections.getSize(),
                sections.getTotalElements(), sections.getTotalPages(), sections.isLast());
    }

    public PagedResponse<SectionResponse> getSectionsCreatedBy(String username, int page, int size) {
        validatePageNumberAndSize(page, size);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Retrieve all sections created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Section> sections = sectionRepository.findByCreatedBy(user.getId(), pageable);

        if (sections.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), sections.getNumber(), sections.getSize(),
                    sections.getTotalElements(), sections.getTotalPages(), sections.isLast());
        }

        // Map sections to SectionResponses
        List<SectionResponse> SectionResponses = sections
                .map(section -> ModelMapper.mapSectionToSectionResponse(section, user)).getContent();

        return new PagedResponse<>(SectionResponses, sections.getNumber(), sections.getSize(),
                sections.getTotalElements(), sections.getTotalPages(), sections.isLast());
    }

    public Section createSection(SectionRequest sectionRequest) {
        Section section = new Section();
        section.setName(sectionRequest.getName());
        section.setNoOfStudents(sectionRequest.getNoOfStudents());
        section.setYear(sectionRequest.getYear());
        section.setStatus(sectionRequest.getStatus());
        System.out.println("HEYHEY");

        Course course = sectionRequest.getCourse();
        Course courseInfo = courseRepository.findById(course.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", course.getId()));
        section.setCourse(courseInfo);
        System.out.println("HEYHEY2");

        for (User student : sectionRequest.getUsers()) {
            User studentInfo = userRepository.findById(student.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student", "id", student.getId()));
            section.getUsers().add(studentInfo);
        }

        return sectionRepository.save(section);
    }

    public SectionResponse getSectionById(Long sectionId) {
        Section section = sectionRepository.findBySectionId(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section", "id", sectionId));

        // Retrieve section creator details
        User creator = userRepository.findById(section.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", section.getCreatedBy()));

        return ModelMapper.mapSectionToSectionResponse(section, creator);
    }

    public ResponseEntity<?> deleteById(Long sectionId) {
        if (sectionRepository.findBySectionId(sectionId).isPresent())
            sectionRepository.deleteBySectionId(sectionId);
        return ResponseEntity.ok(new ApiResponse(true, "Section Deleted Successfully"));
    }

    public ResponseEntity<Object> updateSectionById(@RequestBody Section section, @PathVariable long sectionId) {

        Optional<Section> sectionOptional = sectionRepository.findBySectionId(sectionId);

        if (sectionOptional.isPresent())
            return ResponseEntity.notFound().build();

        section.setSectionId(sectionId);
        section.setCreatedAt(sectionOptional.get().getCreatedAt());
        section.setCreatedBy(sectionOptional.get().getCreatedBy());
        sectionRepository.save(section);
        return ResponseEntity.ok(new ApiResponse(true, "Section Updated Successfully"));
    }

    private void validatePageNumberAndSize(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if (size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }

    Map<Long, User> getSectionCreatorMap(List<Section> sections) {
        // Get Section Creator details of the given list of sections
        List<Long> creatorIds = sections.stream().map(Section::getCreatedBy).distinct().collect(Collectors.toList());

        List<User> creators = userRepository.findByIdIn(creatorIds);
        Map<Long, User> creatorMap = creators.stream().collect(Collectors.toMap(User::getId, Function.identity()));

        return creatorMap;
    }

}
