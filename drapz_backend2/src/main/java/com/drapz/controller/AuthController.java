package com.drapz.controller;

import com.drapz.dto.AuthRequest;
import com.drapz.dto.AuthResponse;
import com.drapz.dto.InscriptionRequest;
import com.drapz.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentification", description = "Endpoints pour l'authentification des utilisateurs")
public class  AuthController {

    private final AuthService authService;

    @PostMapping("/inscription")
    @Operation(summary = "Créer un nouveau compte utilisateur")
    public ResponseEntity<AuthResponse> inscription(@Valid @RequestBody InscriptionRequest request) {
        AuthResponse response = authService.inscription(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/connexion")
    @Operation(summary = "Connexion utilisateur et génération de JWT")
    public ResponseEntity<AuthResponse> connexion(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.connexion(request);
        return ResponseEntity.ok(response);
    }
}
