package com.drapz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SummaryStatsResponse {
    private double totalRevenue;
    private long totalUsers;
    private long totalOrders;
    private long totalProducts;
}
