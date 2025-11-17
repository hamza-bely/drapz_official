package com.drapz.dto;

import com.drapz.entity.Commande.StatutCommande;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommandeResponse {
    private String id;
    private StatutCommande statut;
    private BigDecimal montantTotal;
    private LocalDateTime createdAt;
    private List<LigneCommandeResponse> lignes;
}
