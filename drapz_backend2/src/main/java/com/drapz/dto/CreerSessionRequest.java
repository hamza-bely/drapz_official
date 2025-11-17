package com.drapz.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreerSessionRequest {

    @NotEmpty(message = "Le panier ne peut pas être vide")
    @Valid
    private List<LigneCommandeRequest> articles;
}
