package com.drapz.controller;

import com.drapz.dto.*;
import com.drapz.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentification", description = "Endpoints pour l'authentification des utilisateurs")
public class AuthController {

    private final UserService userService;
    private static final String TOKEN_COOKIE_NAME = "accessToken";
    private static final int TOKEN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

    @PostMapping("/inscription")
    @Operation(summary = "Créer un nouveau compte utilisateur")
    public ResponseEntity<AuthResponse> inscription(@Valid @RequestBody InscriptionRequest request, HttpServletResponse response) {
        AuthResponse authResponse = userService.inscription(request);
        setTokenCookie(response, authResponse.getToken());

        return ResponseEntity.status(HttpStatus.CREATED).body(
            AuthResponse.builder()
                .email(authResponse.getEmail())
                .nom(authResponse.getNom())
                .prenom(authResponse.getPrenom())
                .build()
        );
    }

    @PostMapping("/connexion")
    @Operation(summary = "Connexion utilisateur et génération de JWT")
    public ResponseEntity<AuthResponse> connexion(@Valid @RequestBody AuthRequest request, HttpServletResponse response) {
        AuthResponse authResponse = userService.connexion(request);
        setTokenCookie(response, authResponse.getToken());

        return ResponseEntity.ok(
            AuthResponse.builder()
                .email(authResponse.getEmail())
                .nom(authResponse.getNom())
                .prenom(authResponse.getPrenom())
                    .role(authResponse.getRole())
                .build()
        );
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Demande de réinitialisation de mot de passe")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        userService.forgotPassword(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "Si un compte avec cet email existe, un lien de réinitialisation a été envoyé."));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Réinitialiser le mot de passe avec un token")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Votre mot de passe a été réinitialisé avec succès."));
    }

    @GetMapping("/me")
    @Operation(summary = "Récupérer les infos de l'utilisateur connecté")
    public ResponseEntity<AuthResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        AuthResponse response = userService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Déconnexion et suppression du cookie")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        response.addHeader("Set-Cookie", TOKEN_COOKIE_NAME + "=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax");
        return ResponseEntity.ok().build();
    }

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
