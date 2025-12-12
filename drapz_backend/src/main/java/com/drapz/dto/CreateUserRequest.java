package com.drapz.dto;

import com.drapz.entity.Utilisateur;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateUserRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6)
    private String motDePasse;

    @NotBlank
    private String nom;

    @NotBlank
    private String prenom;

    @NotNull
    private Utilisateur.Role role;
}
