package com.drapz.controller;

import com.drapz.dto.*;
import com.drapz.entity.Produit;
import com.drapz.entity.Utilisateur;
import com.drapz.entity.Commande;
import com.drapz.service.AdminService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Endpoints pour la gestion des administrateurs")
public class AdminController {

    private final AdminService adminService;

    // --- User Management ---

    @GetMapping("/users")
    public ResponseEntity<List<UtilisateurResponse>> getUsers() {
        return ResponseEntity.ok(adminService.getUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UtilisateurResponse> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @PostMapping("/users")
    public ResponseEntity<Utilisateur> createUser(@Valid @RequestBody CreateUserRequest request) {
        Utilisateur newUser = adminService.createUser(request);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<Utilisateur> updateUser(@PathVariable String id, @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(adminService.updateUser(id, request));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // --- Product Management ---

    @PostMapping("/produits")
    public ResponseEntity<Produit> createProduct(@Valid @RequestBody CreateProductRequest request) {
        Produit newProduct = adminService.createProduct(request);
        return new ResponseEntity<>(newProduct, HttpStatus.CREATED);
    }

    @PutMapping("/produits/{id}")
    public ResponseEntity<Produit> updateProduct(@PathVariable String id, @Valid @RequestBody UpdateProductRequest request) {
        return ResponseEntity.ok(adminService.updateProduct(id, request));
    }

    @DeleteMapping("/produits/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        adminService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // --- Order Management ---

    @GetMapping("/commandes")
    public ResponseEntity<List<CommandeResponse>> getOrders() {
        return ResponseEntity.ok(adminService.getOrders());
    }

    @GetMapping("/commandes/{id}")
    public ResponseEntity<CommandeResponse> getOrderById(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getOrderById(id));
    }

    @PutMapping("/commandes/{id}/status")
    public ResponseEntity<Commande> updateOrderStatus(@PathVariable String id, @RequestBody String status) {
        return ResponseEntity.ok(adminService.updateOrderStatus(id, status));
    }
}

