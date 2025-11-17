package com.drapz.controller;

import com.drapz.dto.CommandeResponse;
import com.drapz.service.CommandeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/api/commandes")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearer-jwt")
@Tag(name = "Commandes", description = "Endpoints pour la gestion des commandes")
public class CommandeController {

    private final CommandeService commandeService;

    @GetMapping
    @Operation(summary = "Récupérer l'historique des commandes de l'utilisateur")
    public ResponseEntity<Page<CommandeResponse>> obtenirMesCommandes(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String utilisateurId = ((UserDetails) authentication.getPrincipal()).getUsername();
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(commandeService.obtenirCommandesUtilisateur(utilisateurId, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer les détails d'une commande")
    public ResponseEntity<CommandeResponse> obtenirCommande(
            @PathVariable String id,
            Authentication authentication) {
        String utilisateurId = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.ok(commandeService.obtenirCommandeParId(id, utilisateurId));
    }
}
