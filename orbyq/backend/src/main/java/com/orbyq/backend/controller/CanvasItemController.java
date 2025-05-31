package com.orbyq.backend.controller;

import com.orbyq.backend.dto.CanvasDTO;
import com.orbyq.backend.dto.CanvasItemDTO;
import com.orbyq.backend.model.CanvasItem;
import com.orbyq.backend.service.CanvasItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping("/api/canvas")
public class CanvasItemController {
    @Autowired
    private CanvasItemService canvasItemService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public CanvasDTO getCanvasItems(@AuthenticationPrincipal UserDetails userDetails) {
        return canvasItemService.getCanvasItems(userDetails.getUsername());
    }

    // New endpoint for JSON-only requests (no file upload)
    @PostMapping(consumes = "application/json")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CanvasItem> createCanvasItemJson(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CanvasItemDTO canvasItemDTO
    ) {
        if (canvasItemDTO.getId() != null) {
            throw new IllegalArgumentException("ID should not be provided in a create request. Use PUT to update an existing item.");
        }
        if (canvasItemDTO.getType() == null || canvasItemDTO.getType().trim().isEmpty()) {
            throw new IllegalArgumentException("Type is required");
        }
        if (canvasItemDTO.getType().equals("image") && (canvasItemDTO.getContent() == null || !canvasItemDTO.getContent().startsWith("data:image/"))) {
            throw new IllegalArgumentException("Image items must have content with a valid data URI when created via JSON");
        }
        CanvasItem item = canvasItemService.createCanvasItem(userDetails.getUsername(), canvasItemDTO);
        return ResponseEntity.ok(item);
    }

    // Existing endpoint for multipart requests (with file upload)
    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CanvasItem> createCanvasItemMultipart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart(value = "canvasItem", required = true) CanvasItemDTO canvasItemDTO,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {
        if (canvasItemDTO.getId() != null) {
            throw new IllegalArgumentException("ID should not be provided in a create request. Use PUT to update an existing item.");
        }
        if (canvasItemDTO.getType() == null || canvasItemDTO.getType().trim().isEmpty()) {
            throw new IllegalArgumentException("Type is required");
        }
        if (file != null && !file.isEmpty()) {
            if (!canvasItemDTO.getType().equals("image")) {
                throw new IllegalArgumentException("File upload is only supported for image items");
            }
            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
            canvasItemDTO.setContent("data:image/" + file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".") + 1) + ";base64," + base64Image);
        }
        CanvasItem item = canvasItemService.createCanvasItem(userDetails.getUsername(), canvasItemDTO);
        return ResponseEntity.ok(item);
    }

    // New endpoint for JSON-only updates (no file upload)
    @PutMapping(value = "/{itemId}", consumes = "application/json")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateCanvasItemJson(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String itemId,
            @RequestBody CanvasItemDTO canvasItemDTO
    ) {
        canvasItemService.updateCanvasItem(userDetails.getUsername(), itemId, canvasItemDTO);
        return ResponseEntity.ok().build();
    }

    // Existing endpoint for multipart updates (with file upload)
    @PutMapping(value = "/{itemId}", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateCanvasItemMultipart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String itemId,
            @RequestPart(value = "canvasItem", required = true) CanvasItemDTO canvasItemDTO,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {
        if (file != null && !file.isEmpty()) {
            if (!canvasItemDTO.getType().equals("image")) {
                throw new IllegalArgumentException("File upload is only supported for image items");
            }
            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
            canvasItemDTO.setContent("data:image/" + file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".") + 1) + ";base64," + base64Image);
        }
        canvasItemService.updateCanvasItem(userDetails.getUsername(), itemId, canvasItemDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{itemId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteCanvasItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String itemId
    ) {
        canvasItemService.deleteCanvasItem(userDetails.getUsername(), itemId);
        return ResponseEntity.ok().build();
    }
}