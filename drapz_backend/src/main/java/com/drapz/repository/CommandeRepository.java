package com.drapz.repository;

import com.drapz.entity.Commande;
import com.drapz.entity.Commande.StatutCommande;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, String> {
    Page<Commande> findByUtilisateurId(String utilisateurId, Pageable pageable);
    Optional<Commande> findByStripeSessionId(String stripeSessionId);
    Optional<Commande> findByStripePaymentIntentId(String stripePaymentIntentId);

    List<Commande> findByCreatedAtAfterAndStatut(LocalDateTime createdAt, StatutCommande statut);
}
