package com.drapz.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UpdateProductRequest {

    private String nom;

    private String description;

    @Min(0)
    private Double prix;

    @Min(0)
    private Integer stock;

    private String imageUrl;
    
    private Boolean actif;
}
