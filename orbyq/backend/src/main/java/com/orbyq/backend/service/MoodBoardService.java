package com.orbyq.backend.service;

import com.orbyq.backend.dto.MoodBoardItemDTO;
import com.orbyq.backend.model.MoodBoardItem;
import com.orbyq.backend.model.User;
import com.orbyq.backend.repository.MoodBoardItemRepository;
import com.orbyq.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MoodBoardService {

    @Autowired
    private MoodBoardItemRepository moodBoardItemRepository;

    @Autowired
    private UserRepository userRepository;

    public List<MoodBoardItemDTO> getUserMoodBoardItems(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<MoodBoardItem> items = moodBoardItemRepository.findByUser(user);
        return items.stream().map(item -> {
            MoodBoardItemDTO dto = new MoodBoardItemDTO();
            dto.setId(item.getId().toString());
            dto.setImageUrl(item.getImageUrl());
            dto.setCreatedAt(item.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    public MoodBoardItem createMoodBoardItem(String username, MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
        String imageUrl = "data:image/" + file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".") + 1) + ";base64," + base64Image;

        MoodBoardItem item = new MoodBoardItem();
        item.setUser(user);
        item.setImageUrl(imageUrl);
        item.setCreatedAt(LocalDate.now());
        item.setVersion(0L);

        return moodBoardItemRepository.save(item);
    }

    @Transactional
    public void deleteMoodBoardItem(String username, String itemId) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        MoodBoardItem item = moodBoardItemRepository.findById(UUID.fromString(itemId))
                .orElseThrow(() -> new IllegalArgumentException("Mood board item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to delete this mood board item");
        }

        moodBoardItemRepository.delete(item);
    }
}