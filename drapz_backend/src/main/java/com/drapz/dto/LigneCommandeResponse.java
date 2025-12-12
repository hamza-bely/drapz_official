
package com.drapz.dto;

import com.drapz.entity.LigneCommande;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LigneCommandeResponse {
    private String id;             // ← Long au lieu de String
    private String produitId;      // ← Long au lieu de String
    private String produitNom;
    private Integer quantite;    // ← Integer au lieu de int (évite NPE si null)
    private BigDecimal prixUnitaire;
    private BigDecimal sousTotal;

    public static LigneCommandeResponse from(LigneCommande ligne) {
        return LigneCommandeResponse.builder()
                .id(ligne.getId())
                .produitId(ligne.getProduit().getId())
                .produitNom(ligne.getProduit().getNom())
                .quantite(ligne.getQuantite())
                .prixUnitaire(ligne.getPrixUnitaire())
                .sousTotal(ligne.getSousTotal())
                .build();
    }
}
