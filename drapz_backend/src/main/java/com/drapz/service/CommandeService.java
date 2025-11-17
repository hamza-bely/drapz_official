package com.drapz.service;

import com.drapz.dto.CommandeResponse;
import com.drapz.dto.CreerSessionRequest;
import com.drapz.dto.CreerSessionResponse;
import com.drapz.dto.LigneCommandeResponse;
import com.drapz.entity.Commande;
import com.drapz.entity.Commande.StatutCommande;
import com.drapz.entity.LigneCommande;
import com.drapz.entity.Produit;
import com.drapz.entity.Utilisateur;
import com.drapz.exception.ApiException;
import com.drapz.exception.ResourceNotFoundException;
import com.drapz.repository.CommandeRepository;
import com.drapz.repository.ProduitRepository;
import com.drapz.repository.UtilisateurRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommandeService {

    private final CommandeRepository commandeRepository;
    private final ProduitRepository produitRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Transactional
    public CreerSessionResponse creerSessionPaiement(String utilisateurId, CreerSessionRequest request) {
        log.info("Création d'une session de paiement pour l'utilisateur: {}", utilisateurId);

        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
        BigDecimal montantTotal = BigDecimal.ZERO;

        Commande commande = Commande.builder()
            .utilisateur(utilisateur)
            .statut(StatutCommande.EN_ATTENTE)
            .lignes(new ArrayList<>())
            .build();

        for (var article : request.getArticles()) {
            Produit produit = produitRepository.findById(article.getProduitId())
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé: " + article.getProduitId()));

            if (produit.getStock() < article.getQuantite()) {
                throw new ApiException("Stock insuffisant pour le produit: " + produit.getNom());
            }

            BigDecimal sousTotal = produit.getPrix().multiply(BigDecimal.valueOf(article.getQuantite()));
            montantTotal = montantTotal.add(sousTotal);

            LigneCommande ligneCommande = LigneCommande.builder()
                .commande(commande)
                .produit(produit)
                .quantite(article.getQuantite())
                .prixUnitaire(produit.getPrix())
                .sousTotal(sousTotal)
                .build();

            commande.getLignes().add(ligneCommande);

            lineItems.add(SessionCreateParams.LineItem.builder()
                .setPriceData(
                    SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency("eur")
                        .setUnitAmount((produit.getPrix().multiply(BigDecimal.valueOf(100)).longValue()))
                        .setProductData(
                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                .setName(produit.getNom())
                                .setDescription(produit.getDescription())
                                .build()
                        )
                        .build()
                )
                .setQuantity((long) article.getQuantite())
                .build()
            );
        }

        commande.setMontantTotal(montantTotal);
        Commande commandeSauvegardee = commandeRepository.save(commande);

        try {
            String successUrl = "http://localhost:3000/paiement/succes?sessionId={CHECKOUT_SESSION_ID}";
            String cancelUrl = "http://localhost:3000/paiement/annulation";

            SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .addAllLineItem(lineItems)
                .setCustomerEmail(utilisateur.getEmail())
                .setClientReferenceId(commandeSauvegardee.getId())
                .build();

            Session session = Session.create(params);

            commandeSauvegardee.setStripeSessionId(session.getId());
            commandeRepository.save(commandeSauvegardee);

            return CreerSessionResponse.builder()
                .sessionId(session.getId())
                .commandeId(commandeSauvegardee.getId())
                .url(session.getUrl())
                .build();

        } catch (StripeException e) {
            log.error("Erreur lors de la création de la session Stripe", e);
            throw new ApiException("Erreur lors de la création de la session de paiement: " + e.getMessage());
        }
    }

    public Page<CommandeResponse> obtenirCommandesUtilisateur(String utilisateurId, Pageable pageable) {
        log.info("Récupération des commandes pour l'utilisateur: {}", utilisateurId);
        return commandeRepository.findByUtilisateurId(utilisateurId, pageable)
            .map(this::convertToResponse);
    }

    public CommandeResponse obtenirCommandeParId(String commandeId, String utilisateurId) {
        log.info("Récupération de la commande: {}", commandeId);
        Commande commande = commandeRepository.findById(commandeId)
            .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));

        if (!commande.getUtilisateur().getId().equals(utilisateurId)) {
            throw new ApiException("Accès refusé à cette commande");
        }

        return convertToResponse(commande);
    }

    @Transactional
    public void traiterPaiementConfirme(String stripeSessionId) {
        log.info("Traitement du paiement confirmé pour la session: {}", stripeSessionId);

        Commande commande = commandeRepository.findByStripeSessionId(stripeSessionId)
            .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée pour la session Stripe"));

        commande.setStatut(StatutCommande.CONFIRMEE);

        for (LigneCommande ligne : commande.getLignes()) {
            Produit produit = ligne.getProduit();
            produit.setStock(produit.getStock() - ligne.getQuantite());
            produitRepository.save(produit);
        }

        commandeRepository.save(commande);
    }

    @Transactional
    public void traiterPaiementEchoue(String stripeSessionId) {
        log.info("Traitement du paiement échoué pour la session: {}", stripeSessionId);

        Commande commande = commandeRepository.findByStripeSessionId(stripeSessionId)
            .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));

        commande.setStatut(StatutCommande.ANNULEE);
        commandeRepository.save(commande);
    }

    private CommandeResponse convertToResponse(Commande commande) {
        List<LigneCommandeResponse> lignesResponse = commande.getLignes().stream()
            .map(ligne -> LigneCommandeResponse.builder()
                .id(ligne.getId())
                .produitId(ligne.getProduit().getId())
                .produitNom(ligne.getProduit().getNom())
                .quantite(ligne.getQuantite())
                .prixUnitaire(ligne.getPrixUnitaire())
                .sousTotal(ligne.getSousTotal())
                .build()
            )
            .collect(Collectors.toList());

        return CommandeResponse.builder()
            .id(commande.getId())
            .statut(commande.getStatut())
            .montantTotal(commande.getMontantTotal())
            .createdAt(commande.getCreatedAt())
            .lignes(lignesResponse)
            .build();
    }
}
