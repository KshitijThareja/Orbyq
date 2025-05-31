package com.orbyq.backend.controller;

import com.orbyq.backend.dto.CanvasDTO;
import com.orbyq.backend.dto.CanvasItemDTO;
import com.orbyq.backend.model.Canvas;
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
import java.util.List;

@RestController
@RequestMapping("/api")
public class CanvasItemController {
    @Autowired
    private CanvasItemService canvasItemService;

    @GetMapping("/canvases")
    @PreAuthorize("isAuthenticated()")
    public List<CanvasDTO.CanvasInfoDTO> getUserCanvases(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return canvasItemService.getUserCanvases(userDetails.getUsername());
    }

    @PostMapping("/canvas/new")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Canvas> createNewCanvas(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(value = "title", defaultValue = "Untitled Canvas") String title
    ) {
        Canvas canvas = canvasItemService.createCanvas(userDetails.getUsername(), title);
        return ResponseEntity.ok(canvas);
    }

    @PutMapping("/canvas/{canvasId}/title")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateCanvasTitle(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String canvasId,
            @RequestParam String title
    ) {
        canvasItemService.updateCanvasTitle(userDetails.getUsername(), canvasId, title);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/canvas/{canvasId}")
    @PreAuthorize("isAuthenticated()")
    public CanvasDTO getCanvasItems(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String canvasId
    ) {
        return canvasItemService.getCanvasItems(userDetails.getUsername(), canvasId);
    }

    @PostMapping(value = "/canvas/{canvasId}", consumes = "application/json")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CanvasItem> createCanvasItemJson(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String canvasId,
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
        CanvasItem item = canvasItemService.createCanvasItem(userDetails.getUsername(), canvasId, canvasItemDTO);
        return ResponseEntity.ok(item);
    }

    @PostMapping(value = "/canvas/{canvasId}", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CanvasItem> createCanvasItemMultipart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String canvasId,
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
        CanvasItem item = canvasItemService.createCanvasItem(userDetails.getUsername(), canvasId, canvasItemDTO);
        return ResponseEntity.ok(item);
    }

    @PutMapping(value = "/canvas/{canvasId}/{itemId}", consumes = "application/json")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateCanvasItemJson(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String canvasId,
            @PathVariable String itemId,
            @RequestBody CanvasItemDTO canvasItemDTO
    ) {
        canvasItemService.updateCanvasItem(userDetails.getUsername(), canvasId, itemId, canvasItemDTO);
        return ResponseEntity.ok().build();
    }

    @PutMapping(value = "/canvas/{canvasId}/{itemId}", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateCanvasItemMultipart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String canvasId,
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
        canvasItemService.updateCanvasItem(userDetails.getUsername(), canvasId, itemId, canvasItemDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/canvas/{canvasId}/{itemId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteCanvasItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String canvasId,
            @PathVariable String itemId
    ) {
        canvasItemService.deleteCanvasItem(userDetails.getUsername(), canvasId, itemId);
        return ResponseEntity.ok().build();
    }
}