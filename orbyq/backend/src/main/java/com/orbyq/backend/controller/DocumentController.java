package com.orbyq.backend.controller;

import com.orbyq.backend.dto.DocumentDTO;
import com.orbyq.backend.model.Document;
import com.orbyq.backend.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api")
public class DocumentController {
    @Autowired
    private DocumentService documentService;

    @GetMapping("/documents")
    @PreAuthorize("isAuthenticated()")
    public List<DocumentDTO> getUserDocuments(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return documentService.getUserDocuments(userDetails.getUsername());
    }

    @PostMapping("/document/new")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Document> createDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody DocumentDTO documentDTO
    ) {
        Document document = documentService.createDocument(userDetails.getUsername(), documentDTO);
        return ResponseEntity.ok(document);
    }

    @PutMapping("/document/{documentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String documentId,
            @RequestBody DocumentDTO documentDTO
    ) {
        documentService.updateDocument(userDetails.getUsername(), documentId, documentDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/document/{documentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String documentId
    ) {
        documentService.deleteDocument(userDetails.getUsername(), documentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/document/{documentId}/export")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<byte[]> exportDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String documentId
    ) {
        Document document = documentService.getDocumentByIdAndUser(documentId, userDetails.getUsername());
        String filename = document.getTitle().replaceAll("[^a-zA-Z0-9-_]", "_") + ".txt";
        String content = document.getContent();
        byte[] fileContent = content.getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(fileContent);
    }
}