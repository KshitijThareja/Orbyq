package com.orbyq.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.orbyq.backend.dto.CanvasDTO;
import com.orbyq.backend.dto.CanvasItemDTO;
import com.orbyq.backend.model.CanvasItem;
import com.orbyq.backend.model.User;
import com.orbyq.backend.repository.CanvasItemRepository;
import com.orbyq.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CanvasItemService {

    @Autowired
    private CanvasItemRepository canvasItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public CanvasDTO getCanvasItems(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<CanvasItem> items = canvasItemRepository.findByUser(user);
        List<CanvasItemDTO> itemDTOs = items.stream().map(item -> {
            CanvasItemDTO dto = new CanvasItemDTO();
            dto.setId(item.getId().toString());
            dto.setType(item.getType());
            dto.setContent(item.getContent());
            dto.setX(item.getX());
            dto.setY(item.getY());
            dto.setWidth(item.getWidth());
            dto.setHeight(item.getHeight());
            try {
                CanvasItemDTO.StyleDTO style = item.getStyleJson() != null
                    ? objectMapper.readValue(item.getStyleJson(), CanvasItemDTO.StyleDTO.class)
                    : new CanvasItemDTO.StyleDTO(); // Default to empty StyleDTO if styleJson is null
                dto.setStyle(style != null ? style : new CanvasItemDTO.StyleDTO()); // Ensure style is never null
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to deserialize style JSON", e);
            }
            return dto;
        }).collect(Collectors.toList());

        CanvasDTO canvasDTO = new CanvasDTO();
        canvasDTO.setItems(itemDTOs);
        return canvasDTO;
    }

    public CanvasItem createCanvasItem(String username, CanvasItemDTO canvasItemDTO) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        CanvasItem item = new CanvasItem();
        item.setUser(user);
        item.setType(canvasItemDTO.getType());
        item.setContent(canvasItemDTO.getContent());
        item.setX(canvasItemDTO.getX());
        item.setY(canvasItemDTO.getY());
        item.setWidth(canvasItemDTO.getWidth());
        item.setHeight(canvasItemDTO.getHeight());
        try {
            // Ensure style is not null; use empty StyleDTO if null
            CanvasItemDTO.StyleDTO style = canvasItemDTO.getStyle() != null
                ? canvasItemDTO.getStyle()
                : new CanvasItemDTO.StyleDTO();
            String styleJson = objectMapper.writeValueAsString(style);
            item.setStyleJson(styleJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize style to JSON", e);
        }
        item.setCreatedAt(LocalDate.now());
        item.setVersion(0L);

        return canvasItemRepository.save(item);
    }

    public void updateCanvasItem(String username, String itemId, CanvasItemDTO canvasItemDTO) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        CanvasItem item = canvasItemRepository.findById(UUID.fromString(itemId))
                .orElseThrow(() -> new IllegalArgumentException("Canvas item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to update this canvas item");
        }

        item.setType(canvasItemDTO.getType());
        item.setContent(canvasItemDTO.getContent());
        item.setX(canvasItemDTO.getX());
        item.setY(canvasItemDTO.getY());
        item.setWidth(canvasItemDTO.getWidth());
        item.setHeight(canvasItemDTO.getHeight());
        try {
            // Ensure style is not null; use empty StyleDTO if null
            CanvasItemDTO.StyleDTO style = canvasItemDTO.getStyle() != null
                ? canvasItemDTO.getStyle()
                : new CanvasItemDTO.StyleDTO();
            String styleJson = objectMapper.writeValueAsString(style);
            item.setStyleJson(styleJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize style to JSON", e);
        }

        canvasItemRepository.save(item);
    }

    public void deleteCanvasItem(String username, String itemId) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        CanvasItem item = canvasItemRepository.findById(UUID.fromString(itemId))
                .orElseThrow(() -> new IllegalArgumentException("Canvas item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to delete this canvas item");
        }

        canvasItemRepository.delete(item);
    }
}