package com.drapz.service;

import com.drapz.dto.PaysInfoResponse;
import com.drapz.dto.ProduitResponse;
import com.drapz.entity.Produit;
import com.drapz.exception.ResourceNotFoundException;
import com.drapz.repository.ProduitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProduitService {

    private final ProduitRepository produitRepository;

    public Page<ProduitResponse> obtenirProduits(Pageable pageable) {
        log.info("Récupération des produits actifs");
        return produitRepository.findByActifTrue(pageable)
            .map(this::convertToResponse);
    }

    public ProduitResponse obtenirProduitParId(String id) {
        log.info("Récupération du produit: {}", id);
        Produit produit = produitRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé avec l'ID: " + id));
        return convertToResponse(produit);
    }

    public ProduitResponse obtenirProduitParPaysCode(String paysCode) {
        log.info("Récupération du produit pour le pays: {}", paysCode);
        Produit produit = produitRepository.findByPaysCode(paysCode);
        if (produit == null) {
            throw new ResourceNotFoundException("Aucun produit trouvé pour le pays: " + paysCode);
        }
        return convertToResponse(produit);
    }

    private ProduitResponse convertToResponse(Produit produit) {
        PaysInfoResponse paysInfo = null;
        if (produit.getPays() != null) {
            paysInfo = PaysInfoResponse.builder()
                .id(produit.getPays().getId())
                .nom(produit.getPays().getNom())
                .code(produit.getPays().getCode())
                .latitude(produit.getPays().getLatitude())
                .longitude(produit.getPays().getLongitude())
                .flagUrl(produit.getPays().getFlagUrl())
                .build();
        }

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
            .pays(paysInfo)
            .build();
    }
}
