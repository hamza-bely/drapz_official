package com.drapz.service;

import com.drapz.dto.CreateUserRequest;
import com.drapz.dto.UpdateUserRequest;
import com.drapz.entity.Utilisateur;
import com.drapz.exception.ApiException;
import com.drapz.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Utilisateur> getUsers() {
        return utilisateurRepository.findAll();
    }

    public Utilisateur getUserById(String id) {
        return utilisateurRepository.findById(id)
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
        Utilisateur utilisateur = getUserById(id);

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
}