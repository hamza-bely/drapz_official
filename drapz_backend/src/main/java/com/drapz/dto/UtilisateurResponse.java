package com.drapz.dto;

import com.drapz.entity.Utilisateur;
import lombok.Data;

@Data
public class UtilisateurResponse {
    private String id;
    private String email;
    private String nom;
    private String prenom;
    private String role;

    public static UtilisateurResponse from(Utilisateur utilisateur) {
        UtilisateurResponse response = new UtilisateurResponse();
        response.setId(utilisateur.getId());
        response.setEmail(utilisateur.getEmail());
        response.setNom(utilisateur.getNom());
        response.setPrenom(utilisateur.getPrenom());
        response.setRole(utilisateur.getRole().name());
        return response;
    }
}
