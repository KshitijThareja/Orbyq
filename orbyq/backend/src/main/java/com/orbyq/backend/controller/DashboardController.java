package com.orbyq.backend.controller;

import com.orbyq.backend.dto.DashboardSummaryDTO;
import com.orbyq.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public DashboardSummaryDTO getDashboardSummary(@AuthenticationPrincipal UserDetails userDetails) {
        return dashboardService.getDashboardSummary(userDetails.getUsername());
    }

    @GetMapping("/ping")
    public String ping() {
        return dashboardService.ping();
    }
}
