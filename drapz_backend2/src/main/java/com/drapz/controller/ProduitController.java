package com.drapz.controller;

import com.drapz.dto.ProduitRequest;
import com.drapz.dto.ProduitResponse;
import com.drapz.service.ProduitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/api/produits")
@RequiredArgsConstructor
@Tag(name = "Catalogue", description = "Endpoints pour la gestion du catalogue de produits")
public class ProduitController {

    private final ProduitService produitService;

    @GetMapping
    @Operation(summary = "Récupérer la liste des produits disponibles")
    public ResponseEntity<Page<ProduitResponse>> obtenirProduits(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(produitService.obtenirProduits(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un produit par son ID")
    public ResponseEntity<ProduitResponse> obtenirProduit(@PathVariable String id) {
        return ResponseEntity.ok(produitService.obtenirProduitParId(id));
    }

    @PostMapping
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Créer un nouveau produit (ADMIN uniquement)")
    public ResponseEntity<ProduitResponse> creerProduit(@Valid @RequestBody ProduitRequest request) {
        ProduitResponse response = produitService.creerProduit(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Mettre à jour un produit (ADMIN uniquement)")
    public ResponseEntity<ProduitResponse> mettreAJourProduit(
            @PathVariable String id,
            @Valid @RequestBody ProduitRequest request) {
        ProduitResponse response = produitService.mettreAJourProduit(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Supprimer un produit (ADMIN uniquement)")
    public ResponseEntity<Void> supprimerProduit(@PathVariable String id) {
        produitService.supprimerProduit(id);
        return ResponseEntity.noContent().build();
    }
}
