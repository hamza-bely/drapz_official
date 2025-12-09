package com.drapz.controller;

import com.drapz.dto.AuthRequest;
import com.drapz.dto.AuthResponse;
import com.drapz.dto.InscriptionRequest;
import com.drapz.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentification", description = "Endpoints pour l'authentification des utilisateurs")
public class  AuthController {

    private final AuthService authService;
    private static final String TOKEN_COOKIE_NAME = "accessToken";
    private static final int TOKEN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 jours

    @PostMapping("/inscription")
    @Operation(summary = "Créer un nouveau compte utilisateur")
    public ResponseEntity<AuthResponse> inscription(@Valid @RequestBody InscriptionRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.inscription(request);
        setTokenCookie(response, authResponse.getToken());
        
        // Retourner la réponse sans le token (il est en cookie HttpOnly)
        return ResponseEntity.status(HttpStatus.CREATED).body(
            AuthResponse.builder()
                .token(null) // ❌ Ne pas retourner le token en JSON
                .email(authResponse.getEmail())
                .nom(authResponse.getNom())
                .prenom(authResponse.getPrenom())
                .build()
        );
    }

    @PostMapping("/connexion")
    @Operation(summary = "Connexion utilisateur et génération de JWT")
    public ResponseEntity<AuthResponse> connexion(@Valid @RequestBody AuthRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.connexion(request);
        setTokenCookie(response, authResponse.getToken());
        
        // Retourner la réponse sans le token (il est en cookie HttpOnly)
        return ResponseEntity.ok(
            AuthResponse.builder()
                .token(null) // ❌ Ne pas retourner le token en JSON
                .email(authResponse.getEmail())
                .nom(authResponse.getNom())
                .prenom(authResponse.getPrenom())
                .build()
        );
    }

    @GetMapping("/me")
    @Operation(summary = "Récupérer les infos de l'utilisateur connecté")
    public ResponseEntity<AuthResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        AuthResponse response = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Déconnexion et suppression du cookie")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // Supprimer le cookie
        response.addHeader("Set-Cookie", TOKEN_COOKIE_NAME + "=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax");
        return ResponseEntity.ok().build();
    }

    /**
     * Définir le cookie HttpOnly avec le token JWT
     */
    private void setTokenCookie(HttpServletResponse response, String token) {
        String cookieValue = String.format(
            "%s=%s; Path=/; HttpOnly; Max-Age=%d; SameSite=Lax",
            TOKEN_COOKIE_NAME,
            token,
            TOKEN_COOKIE_MAX_AGE
        );
        response.addHeader("Set-Cookie", cookieValue);
    }
}
