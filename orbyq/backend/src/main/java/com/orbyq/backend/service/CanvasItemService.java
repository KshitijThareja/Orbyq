package com.orbyq.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.orbyq.backend.dto.CanvasDTO;
import com.orbyq.backend.dto.CanvasItemDTO;
import com.orbyq.backend.model.Canvas;
import com.orbyq.backend.model.CanvasItem;
import com.orbyq.backend.model.User;
import com.orbyq.backend.repository.CanvasItemRepository;
import com.orbyq.backend.repository.CanvasRepository;
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
public class CanvasItemService {

    @Autowired
    private CanvasItemRepository canvasItemRepository;

    @Autowired
    private CanvasRepository canvasRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public List<CanvasDTO.CanvasInfoDTO> getUserCanvases(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Canvas> canvases = canvasRepository.findByUser(user);
        return canvases.stream().map(canvas -> {
            CanvasDTO.CanvasInfoDTO canvasInfo = new CanvasDTO.CanvasInfoDTO();
            canvasInfo.setId(canvas.getId().toString());
            canvasInfo.setTitle(canvas.getTitle());
            return canvasInfo;
        }).collect(Collectors.toList());
    }

    public CanvasDTO getCanvasItems(String username, String canvasId) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Canvas canvas = canvasRepository.findById(UUID.fromString(canvasId))
                .orElseThrow(() -> new IllegalArgumentException("Canvas not found"));

        if (!canvas.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to access this canvas");
        }

        List<CanvasItem> items = canvasItemRepository.findByCanvas(canvas);
        List<CanvasItemDTO> itemDTOs = items.stream().map(item -> {
            CanvasItemDTO dto = new CanvasItemDTO();
            dto.setId(item.getId().toString());
            dto.setCanvasId(item.getCanvas().getId().toString());
            dto.setType(item.getType());
            dto.setContent(item.getContent());
            dto.setX(item.getX());
            dto.setY(item.getY());
            dto.setWidth(item.getWidth());
            dto.setHeight(item.getHeight());
            try {
                CanvasItemDTO.StyleDTO style = item.getStyleJson() != null
                        ? objectMapper.readValue(item.getStyleJson(), CanvasItemDTO.StyleDTO.class)
                        : new CanvasItemDTO.StyleDTO();
                dto.setStyle(style != null ? style : new CanvasItemDTO.StyleDTO());
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to deserialize style JSON", e);
            }
            return dto;
        }).collect(Collectors.toList());

        CanvasDTO canvasDTO = new CanvasDTO();
        CanvasDTO.CanvasInfoDTO canvasInfo = new CanvasDTO.CanvasInfoDTO();
        canvasInfo.setId(canvas.getId().toString());
        canvasInfo.setTitle(canvas.getTitle());
        canvasDTO.setCanvas(canvasInfo);
        canvasDTO.setItems(itemDTOs);
        return canvasDTO;
    }

    public Canvas createCanvas(String username, String title) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Canvas canvas = new Canvas();
        canvas.setUser(user);
        canvas.setTitle(title);
        canvas.setCreatedAt(LocalDate.now());
        canvas.setVersion(0L);

        return canvasRepository.save(canvas);
    }

    public void updateCanvasTitle(String username, String canvasId, String newTitle) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Canvas canvas = canvasRepository.findById(UUID.fromString(canvasId))
                .orElseThrow(() -> new IllegalArgumentException("Canvas not found"));

        if (!canvas.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to update this canvas");
        }

        canvas.setTitle(newTitle);
        canvasRepository.save(canvas);
    }

    public CanvasItem createCanvasItem(String username, String canvasId, CanvasItemDTO canvasItemDTO) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Canvas canvas = canvasRepository.findById(UUID.fromString(canvasId))
                .orElseThrow(() -> new IllegalArgumentException("Canvas not found"));

        if (!canvas.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to create items in this canvas");
        }

        CanvasItem item = new CanvasItem();
        item.setCanvas(canvas);
        item.setUser(user);
        item.setType(canvasItemDTO.getType());
        item.setContent(canvasItemDTO.getContent());
        item.setX(canvasItemDTO.getX());
        item.setY(canvasItemDTO.getY());
        item.setWidth(canvasItemDTO.getWidth());
        item.setHeight(canvasItemDTO.getHeight());
        try {
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

    public void updateCanvasItem(String username, String canvasId, String itemId, CanvasItemDTO canvasItemDTO) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Canvas canvas = canvasRepository.findById(UUID.fromString(canvasId))
                .orElseThrow(() -> new IllegalArgumentException("Canvas not found"));

        if (!canvas.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to update items in this canvas");
        }

        CanvasItem item = canvasItemRepository.findById(UUID.fromString(itemId))
                .orElseThrow(() -> new IllegalArgumentException("Canvas item not found"));

        if (!item.getCanvas().getId().equals(canvas.getId()) || !item.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to update this canvas item");
        }

        item.setType(canvasItemDTO.getType());
        item.setContent(canvasItemDTO.getContent());
        item.setX(canvasItemDTO.getX());
        item.setY(canvasItemDTO.getY());
        item.setWidth(canvasItemDTO.getWidth());
        item.setHeight(canvasItemDTO.getHeight());
        try {
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

    public void deleteCanvasItem(String username, String canvasId, String itemId) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Canvas canvas = canvasRepository.findById(UUID.fromString(canvasId))
                .orElseThrow(() -> new IllegalArgumentException("Canvas not found"));

        if (!canvas.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to delete items in this canvas");
        }

        CanvasItem item = canvasItemRepository.findById(UUID.fromString(itemId))
                .orElseThrow(() -> new IllegalArgumentException("Canvas item not found"));

        if (!item.getCanvas().getId().equals(canvas.getId()) || !item.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to delete this canvas item");
        }

        canvasItemRepository.delete(item);
    }

    @Transactional
    public void deleteCanvas(String username, String canvasId) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Canvas canvas = canvasRepository.findById(UUID.fromString(canvasId))
                .orElseThrow(() -> new IllegalArgumentException("Canvas not found"));

        if (!canvas.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to delete this canvas");
        }

        // Delete the canvas (associated items will be deleted via cascade)
        canvasRepository.delete(canvas);
    }
}