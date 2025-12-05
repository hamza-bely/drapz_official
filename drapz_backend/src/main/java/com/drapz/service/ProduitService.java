package com.drapz.service;

import com.drapz.dto.ProduitRequest;
import com.drapz.dto.ProduitResponse;
import com.drapz.entity.Produit;
import com.drapz.exception.ResourceNotFoundException;
import com.drapz.repository.ProduitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public ProduitResponse creerProduit(ProduitRequest request) {
        log.info("Création d'un nouveau produit: {}", request.getNom());
        Produit produit = Produit.builder()
            .nom(request.getNom())
            .description(request.getDescription())
            .prix(request.getPrix())
            .stock(request.getStock())
            .imageUrl(request.getImageUrl())
            .actif(true)
            .build();

        produit = produitRepository.save(produit);
        return convertToResponse(produit);
    }

    @Transactional
    public ProduitResponse mettreAJourProduit(String id, ProduitRequest request) {
        log.info("Mise à jour du produit: {}", id);
        Produit produit = produitRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé avec l'ID: " + id));

        produit.setNom(request.getNom());
        produit.setDescription(request.getDescription());
        produit.setPrix(request.getPrix());
        produit.setStock(request.getStock());
        produit.setImageUrl(request.getImageUrl());

        produit = produitRepository.save(produit);
        return convertToResponse(produit);
    }

    @Transactional
    public void supprimerProduit(String id) {
        log.info("Suppression du produit: {}", id);
        Produit produit = produitRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé avec l'ID: " + id));

        produit.setActif(false);
        produitRepository.save(produit);
    }

    @Transactional
    public void mettreAJourStock(String produitId, int quantite) {
        Produit produit = produitRepository.findById(produitId)
            .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé"));

        produit.setStock(produit.getStock() - quantite);
        produitRepository.save(produit);
    }

    private ProduitResponse convertToResponse(Produit produit) {
        com.drapz.dto.PaysInfoResponse paysInfo = null;
        if (produit.getPays() != null) {
            paysInfo = com.drapz.dto.PaysInfoResponse.builder()
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
