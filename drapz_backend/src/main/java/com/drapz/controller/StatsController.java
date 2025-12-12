package com.drapz.controller;

import com.drapz.dto.RevenueOverTimeResponse;
import com.drapz.dto.SummaryStatsResponse;
import com.drapz.dto.TopSellingProductResponse;
import com.drapz.service.StatsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
@Tag(name = "Statistics", description = "Endpoints for retrieving e-commerce statistics")
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/summary")
    public ResponseEntity<SummaryStatsResponse> getSummaryStats() {
        return ResponseEntity.ok(statsService.getSummaryStats());
    }

    @GetMapping("/revenue-over-time")
    public ResponseEntity<List<RevenueOverTimeResponse>> getRevenueOverTime() {
        return ResponseEntity.ok(statsService.getRevenueOverTime());
    }

    @GetMapping("/top-selling-products")
    public ResponseEntity<List<TopSellingProductResponse>> getTopSellingProducts() {
        return ResponseEntity.ok(statsService.getTopSellingProducts());
    }
}
