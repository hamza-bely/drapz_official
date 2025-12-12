package com.drapz.controller;

import com.drapz.dto.CreateUserRequest;
import com.drapz.dto.UpdateUserRequest;
import com.drapz.entity.Utilisateur;
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

    @GetMapping("/users")
    public ResponseEntity<List<Utilisateur>> getUsers() {
        return ResponseEntity.ok(adminService.getUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<Utilisateur> getUserById(@PathVariable String id) {
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
}
