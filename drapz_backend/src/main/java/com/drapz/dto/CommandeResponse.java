
package com.drapz.dto;

import com.drapz.entity.Commande;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommandeResponse {
    // ⚠️ Choisis le type de id : Long (recommandé) ou String
    private String id; // ← plus cohérent si Commande.getId() retourne Long
    private Commande.StatutCommande statut; // enum imbriqué dans Commande
    private BigDecimal montantTotal;
    private LocalDateTime createdAt;
    private List<LigneCommandeResponse> lignes;
    private UtilisateurResponse utilisateur;

    public static CommandeResponse from(Commande commande) {
        return CommandeResponse.builder()
                .id(commande.getId())                         // Long
                .statut(commande.getStatut())
                .montantTotal(commande.getMontantTotal())
                .createdAt(commande.getCreatedAt())
                .lignes(commande.getLignes().stream()
                        .map(LigneCommandeResponse::from)
                        .toList())
                .utilisateur(UtilisateurResponse.from(commande.getUtilisateur()))
                .build();
    }
}
