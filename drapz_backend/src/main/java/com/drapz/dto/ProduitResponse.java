package com.drapz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProduitResponse {
    private String id;
    private String nom;
    private String description;
    private BigDecimal prix;
    private Integer stock;
    private String imageUrl;
    private Boolean actif;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
