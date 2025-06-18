package com.orbyq.backend.service;

import com.orbyq.backend.dto.DocumentDTO;
import com.orbyq.backend.model.Document;
import com.orbyq.backend.model.User;
import com.orbyq.backend.repository.DocumentRepository;
import com.orbyq.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<DocumentDTO> getUserDocuments(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Document> documents = documentRepository.findByUser(user);
        return documents.stream().map(doc -> {
            DocumentDTO dto = new DocumentDTO();
            dto.setId(doc.getId().toString());
            dto.setTitle(doc.getTitle());
            dto.setContent(doc.getContent());
            dto.setCreatedAt(doc.getCreatedAt());
            dto.setUpdatedAt(doc.getUpdatedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    public Document createDocument(String username, DocumentDTO documentDTO) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Document document = new Document();
        document.setUser(user);
        document.setTitle(documentDTO.getTitle());
        document.setContent(documentDTO.getContent());
        document.setCreatedAt(LocalDate.now());
        document.setUpdatedAt(LocalDate.now());
        document.setVersion(0L);

        return documentRepository.save(document);
    }

    public void updateDocument(String username, String documentId, DocumentDTO documentDTO) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Document document = documentRepository.findById(UUID.fromString(documentId))
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));

        if (!document.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to update this document");
        }

        document.setTitle(documentDTO.getTitle());
        document.setContent(documentDTO.getContent());
        document.setUpdatedAt(LocalDate.now());

        documentRepository.save(document);
    }

    @Transactional
    public void deleteDocument(String username, String documentId) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Document document = documentRepository.findById(UUID.fromString(documentId))
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));

        if (!document.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to delete this document");
        }

        documentRepository.delete(document);
    }

    public Document getDocumentByIdAndUser(String documentId, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Document document = documentRepository.findById(UUID.fromString(documentId))
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        if (!document.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to access this document");
        }
        return document;
    }
}