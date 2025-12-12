package com.drapz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopSellingProductResponse {
    private String productName;
    private long sales;
}
