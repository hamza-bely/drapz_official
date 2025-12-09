package com.drapz.controller;

import com.drapz.dto.CreerSessionRequest;
import com.drapz.dto.CreerSessionResponse;
import com.drapz.service.CommandeService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/paiement")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Paiement", description = "Endpoints pour la gestion des paiements Stripe")
public class PaiementController {

    private final CommandeService commandeService;

    @Value("${app.stripe.webhook-secret}")
    private String endpointSecret;

    @PostMapping("/creer-session")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Créer une session de paiement Stripe")
    public ResponseEntity<CreerSessionResponse> creerSession(
            @Valid @RequestBody CreerSessionRequest request,
            Authentication authentication) {
        String utilisateurId = ((UserDetails) authentication.getPrincipal()).getUsername();
        CreerSessionResponse response = commandeService.creerSessionPaiement(utilisateurId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/webhook")
    @Operation(summary = "Webhook pour les notifications Stripe")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, endpointSecret);

            switch (event.getType()) {
                case "checkout.session.completed" -> {
                    Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
                    if (session != null) {
                        log.info("Paiement confirmé pour la session: {}", session.getId());
                        commandeService.traiterPaiementConfirme(session.getId());
                    }
                }
                case "checkout.session.expired" -> {
                    Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
                    if (session != null) {
                        log.info("Paiement expiré pour la session: {}", session.getId());
                        commandeService.traiterPaiementEchoue(session.getId());
                    }
                }
                default -> log.info("Type d'événement non géré: {}", event.getType());
            }

            return ResponseEntity.ok("{\"status\":\"success\"}");
        } catch (SignatureVerificationException e) {
            log.error("Erreur de vérification de signature Stripe", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }
    }
}
