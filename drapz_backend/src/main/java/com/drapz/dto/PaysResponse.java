package com.drapz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaysResponse {
    private String id;
    private String nom;
    private String code;
    private Double latitude;
    private Double longitude;
    private String flagUrl;
    private Boolean actif;
}
