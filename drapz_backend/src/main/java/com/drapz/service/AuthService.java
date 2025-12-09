package com.drapz.service;

import com.drapz.dto.AuthRequest;
import com.drapz.dto.AuthResponse;
import com.drapz.dto.InscriptionRequest;
import com.drapz.entity.Utilisateur;
import com.drapz.entity.Utilisateur.Role;
import com.drapz.entity.PasswordResetToken;
import com.drapz.repository.PasswordResetTokenRepository;
import com.drapz.exception.ApiException;
import com.drapz.repository.UtilisateurRepository;
import com.drapz.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Transactional
    public AuthResponse inscription(InscriptionRequest request) {
        log.info("Inscription d'un nouvel utilisateur: {}", request.getEmail());

        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("Un utilisateur avec cet email existe déjà");
        }

        Utilisateur utilisateur = Utilisateur.builder()
            .email(request.getEmail())
            .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
            .nom(request.getNom())
            .prenom(request.getPrenom())
            .role(Role.USER)
            .actif(true)
            .build();

        utilisateur = utilisateurRepository.save(utilisateur);
        String token = jwtTokenProvider.generateTokenFromEmail(utilisateur.getEmail());

        return AuthResponse.builder()
            .token(token)
            .email(utilisateur.getEmail())
            .nom(utilisateur.getNom())
            .prenom(utilisateur.getPrenom())
            .build();
    }

    public AuthResponse connexion(AuthRequest request) {
        log.info("Connexion de l'utilisateur: {}", request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getMotDePasse()
            )
        );

        String token = jwtTokenProvider.generateToken(authentication);
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ApiException("Utilisateur non trouvé"));

        return AuthResponse.builder()
            .token(token)
            .email(utilisateur.getEmail())
            .nom(utilisateur.getNom())
            .prenom(utilisateur.getPrenom())
            .build();
    }

    /**
     * Récupérer les infos de l'utilisateur connecté basé sur l'email du token JWT
     */
    public AuthResponse getCurrentUser(String email) {
        log.info("Récupération des infos pour: {}", email);

        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
            .orElseThrow(() -> new ApiException("Utilisateur non trouvé"));

        return AuthResponse.builder()
            .token(null) // ❌ Ne pas retourner le token
            .email(utilisateur.getEmail())
            .nom(utilisateur.getNom())
            .prenom(utilisateur.getPrenom())
            .build();
    }

    /**
     * Créer une requête de réinitialisation de mot de passe.
     * Génère un token sécurisé, le stocke et renvoie l'URL (logged for now).
     */
    @Transactional
    public void requestPasswordReset(String email, String frontendBaseUrl) {
        log.info("Demande de réinitialisation pour: {}", email);

        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
            .orElseThrow(() -> new ApiException("Utilisateur non trouvé"));

        // Générer un token sécurisé
        byte[] random = new byte[48];
        new java.security.SecureRandom().nextBytes(random);
        String token = java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(random);

        PasswordResetToken resetToken = PasswordResetToken.builder()
            .token(token)
            .utilisateur(utilisateur)
            .expiresAt(java.time.LocalDateTime.now().plusHours(24))
            .used(false)
            .build();

        passwordResetTokenRepository.save(resetToken);

        // Construire le lien de reset (stub d'email: on logue le lien)
        String base = (frontendBaseUrl == null || frontendBaseUrl.isBlank()) ? "http://localhost:3000" : frontendBaseUrl;
        String link = String.format("%s/auth/reset/confirm?token=%s", base, token);
        log.info("Password reset link for {}: {}", email, link);
    }

    /**
     * Confirme la réinitialisation: vérifie le token, met à jour le mot de passe et invalide le token.
     */
    @Transactional
    public void confirmPasswordReset(String token, String nouveauMotDePasse) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
            .orElseThrow(() -> new ApiException("Token invalide"));

        if (resetToken.isUsed()) {
            throw new ApiException("Token déjà utilisé");
        }

        if (resetToken.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new ApiException("Token expiré");
        }

        Utilisateur utilisateur = resetToken.getUtilisateur();
        utilisateur.setMotDePasse(passwordEncoder.encode(nouveauMotDePasse));
        utilisateurRepository.save(utilisateur);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }
}
