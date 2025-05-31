package com.orbyq.backend.controller;

import com.orbyq.backend.dto.MoodBoardItemDTO;
import com.orbyq.backend.model.MoodBoardItem;
import com.orbyq.backend.service.MoodBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MoodBoardController {
    @Autowired
    private MoodBoardService moodBoardService;

    @GetMapping("/moodboard")
    @PreAuthorize("isAuthenticated()")
    public List<MoodBoardItemDTO> getUserMoodBoardItems(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return moodBoardService.getUserMoodBoardItems(userDetails.getUsername());
    }

    @PostMapping(value = "/moodboard/new", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MoodBoardItem> createMoodBoardItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart(value = "file", required = true) MultipartFile file
    ) throws IOException {
        MoodBoardItem item = moodBoardService.createMoodBoardItem(userDetails.getUsername(), file);
        return ResponseEntity.ok(item);
    }

    @DeleteMapping("/moodboard/{itemId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteMoodBoardItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String itemId
    ) {
        moodBoardService.deleteMoodBoardItem(userDetails.getUsername(), itemId);
        return ResponseEntity.ok().build();
    }
}