package com.drapz.mapper;

import com.drapz.dto.ProduitRequest;
import com.drapz.dto.ProduitResponse;
import com.drapz.entity.Produit;
import org.springframework.stereotype.Component;

@Component
public class ProduitMapper {

    public Produit toEntity(ProduitRequest request) {
        return Produit.builder()
            .nom(request.getNom())
            .description(request.getDescription())
            .prix(request.getPrix())
            .stock(request.getStock())
            .imageUrl(request.getImageUrl())
            .actif(true)
            .build();
    }

    public ProduitResponse toResponse(Produit produit) {
        return ProduitResponse.builder()
            .id(produit.getId())
            .nom(produit.getNom())
            .description(produit.getDescription())
            .prix(produit.getPrix())
            .stock(produit.getStock())
            .imageUrl(produit.getImageUrl())
            .actif(produit.getActif())
            .createdAt(produit.getCreatedAt())
            .updatedAt(produit.getUpdatedAt())
            .build();
    }
}
