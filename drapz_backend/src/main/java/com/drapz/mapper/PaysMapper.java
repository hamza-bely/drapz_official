package com.drapz.mapper;

import com.drapz.dto.PaysResponse;
import com.drapz.entity.Pays;
import org.springframework.stereotype.Component;

@Component
public class PaysMapper {
    public PaysResponse toResponse(Pays pays) {
        return PaysResponse.builder()
            .id(pays.getId())
            .nom(pays.getNom())
            .code(pays.getCode())
            .latitude(pays.getLatitude())
            .longitude(pays.getLongitude())
            .flagUrl(pays.getFlagUrl())
            .actif(pays.getActif())
            .build();
    }
}
