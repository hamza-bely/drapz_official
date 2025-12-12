package com.drapz.dto;

import com.drapz.entity.Utilisateur;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @Email
    private String email;

    private String nom;

    private String prenom;

    private Utilisateur.Role role;
}
