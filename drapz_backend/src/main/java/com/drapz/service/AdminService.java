package com.drapz.service;

import com.drapz.dto.*;
import com.drapz.entity.Commande;
import com.drapz.entity.Produit;
import com.drapz.entity.Utilisateur;
import com.drapz.exception.ApiException;
import com.drapz.repository.CommandeRepository;
import com.drapz.repository.ProduitRepository;
import com.drapz.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UtilisateurRepository utilisateurRepository;
    private final ProduitRepository produitRepository;
    private final CommandeRepository commandeRepository;
    private final PasswordEncoder passwordEncoder;

    // --- User Management ---

    public List<UtilisateurResponse> getUsers() {
        return utilisateurRepository.findAll().stream().map(UtilisateurResponse::from).collect(Collectors.toList());
    }

    public UtilisateurResponse getUserById(String id) {
        return utilisateurRepository.findById(id).map(UtilisateurResponse::from)
                .orElseThrow(() -> new ApiException("Utilisateur non trouvé"));
    }

    @Transactional
    public Utilisateur createUser(CreateUserRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("Un utilisateur avec cet email existe déjà");
        }

        Utilisateur utilisateur = Utilisateur.builder()
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .role(request.getRole())
                .actif(true)
                .build();

        return utilisateurRepository.save(utilisateur);
    }

    @Transactional
    public Utilisateur updateUser(String id, UpdateUserRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ApiException("Utilisateur non trouvé"));

        if (request.getEmail() != null) {
            utilisateur.setEmail(request.getEmail());
        }
        if (request.getNom() != null) {
            utilisateur.setNom(request.getNom());
        }
        if (request.getPrenom() != null) {
            utilisateur.setPrenom(request.getPrenom());
        }
        if (request.getRole() != null) {
            utilisateur.setRole(request.getRole());
        }

        return utilisateurRepository.save(utilisateur);
    }

    @Transactional
    public void deleteUser(String id) {
        if (!utilisateurRepository.existsById(id)) {
            throw new ApiException("Utilisateur non trouvé");
        }
        utilisateurRepository.deleteById(id);
    }

    // --- Product Management ---

    public Produit getProductById(String id) {
        return produitRepository.findById(id)
                .orElseThrow(() -> new ApiException("Produit non trouvé"));
    }

    @Transactional
    public Produit createProduct(CreateProductRequest request) {
        // 1) Convertir en BigDecimal (propre pour les montants)
        Double prixDouble = request.getPrix(); // peut être null
        BigDecimal prix = (prixDouble != null)
                ? BigDecimal.valueOf(prixDouble).setScale(2, RoundingMode.HALF_UP)
                : null;

        // 2) Construire l'entité en injectant le BigDecimal
        Produit produit = Produit.builder()
                .nom(request.getNom())
                .description(request.getDescription())
                .prix(prix)                    // ← ici on passe BigDecimal
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())
                .actif(true)
                .build();

        // (Optionnel) Si tu préfères setter après :
        // produit.setPrix(prix);

        return produitRepository.save(produit);
    }


        @Transactional
    public Produit updateProduct(String id, UpdateProductRequest request) {
        Produit produit = getProductById(id);

        if (request.getNom() != null) {
            produit.setNom(request.getNom());
        }
        if (request.getDescription() != null) {
            produit.setDescription(request.getDescription());
        }
        if (request.getPrix() != null) {
            Double prixDouble = request.getPrix(); // peut être null
            BigDecimal prix = (prixDouble != null)
                    ? BigDecimal.valueOf(prixDouble).setScale(2, RoundingMode.HALF_UP)
                    : null;
            produit.setPrix(prix);
        }
        if (request.getStock() != null) {
            produit.setStock(request.getStock());
        }
        if (request.getImageUrl() != null) {
            produit.setImageUrl(request.getImageUrl());
        }
        if (request.getActif() != null) {
            produit.setActif(request.getActif());
        }

        return produitRepository.save(produit);
    }

    @Transactional
    public void deleteProduct(String id) {
        if (!produitRepository.existsById(id)) {
            throw new ApiException("Produit non trouvé");
        }
        produitRepository.deleteById(id);
    }
    
    // --- Order Management ---
    
    public List<CommandeResponse> getOrders() {
        return commandeRepository.findAll().stream().map(CommandeResponse::from).collect(Collectors.toList());
    }
    
    public CommandeResponse getOrderById(String id) {
        return commandeRepository.findById(id).map(CommandeResponse::from)
                .orElseThrow(() -> new ApiException("Commande non trouvée"));
    }
    
    @Transactional
    public Commande updateOrderStatus(String id, String status) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new ApiException("Commande non trouvée"));
        commande.setStatut(Commande.StatutCommande.valueOf(status));
        return commandeRepository.save(commande);
    }
}