package com.drapz.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateProductRequest {

    @NotBlank
    private String nom;

    @NotBlank
    private String description;

    @NotNull
    @Min(0)
    private Double prix;

    @NotNull
    @Min(0)
    private Integer stock;

    @NotBlank
    private String imageUrl;
}
