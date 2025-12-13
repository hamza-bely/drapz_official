package com.drapz.service;

import com.drapz.dto.AuthRequest;
import com.drapz.dto.AuthResponse;
import com.drapz.dto.InscriptionRequest;
import com.drapz.entity.Utilisateur;
import com.drapz.entity.Utilisateur.Role;
import com.drapz.exception.ApiException;
import com.drapz.repository.UtilisateurRepository;
import com.drapz.security.JwtTokenProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    @Transactional
    public void forgotPassword(String email) {
        log.info("Demande de réinitialisation de mot de passe pour: {}", email);

        utilisateurRepository.findByEmail(email).ifPresent(utilisateur -> {
            String token = UUID.randomUUID().toString();
            utilisateur.setResetPasswordToken(token);
            utilisateur.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(15));
            utilisateurRepository.save(utilisateur);
            emailService.sendPasswordResetEmail(utilisateur.getEmail(), token);
        });
        // No error is thrown if the user is not found to prevent user enumeration
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        log.info("Réinitialisation du mot de passe avec le token: {}", token);

        Utilisateur utilisateur = utilisateurRepository.findByResetPasswordToken(token)
            .orElseThrow(() -> new ApiException("Token de réinitialisation invalide ou expiré"));

        if (utilisateur.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new ApiException("Token de réinitialisation expiré");
        }

        utilisateur.setMotDePasse(passwordEncoder.encode(newPassword));
        utilisateur.setResetPasswordToken(null);
        utilisateur.setResetPasswordTokenExpiry(null);
        utilisateurRepository.save(utilisateur);
    }

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
            .role(utilisateur.getRole().name())
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
            .role(utilisateur.getRole().name())
            .build();
    }

    public AuthResponse getCurrentUser(String email) {
        log.info("Récupération des infos pour: {}", email);

        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
            .orElseThrow(() -> new ApiException("Utilisateur non trouvé"));

        return AuthResponse.builder()
            .email(utilisateur.getEmail())
            .nom(utilisateur.getNom())
            .prenom(utilisateur.getPrenom())
            .role(utilisateur.getRole().name())
            .build();
    }
}
