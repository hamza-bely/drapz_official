package com.drapz.service;
import java.util.Comparator;
import java.util.Map;
import java.util.Objects;

import com.drapz.dto.RevenueOverTimeResponse;
import com.drapz.dto.SummaryStatsResponse;
import com.drapz.dto.TopSellingProductResponse;
import com.drapz.entity.Commande;
import com.drapz.repository.CommandeRepository;
import com.drapz.repository.LigneCommandeRepository;
import com.drapz.repository.ProduitRepository;
import com.drapz.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final UtilisateurRepository utilisateurRepository;
    private final ProduitRepository produitRepository;
    private final CommandeRepository commandeRepository;
    private final LigneCommandeRepository ligneCommandeRepository;

    public SummaryStatsResponse getSummaryStats() {
        long totalUsers = utilisateurRepository.count();
        long totalProducts = produitRepository.count();
        long totalOrders = commandeRepository.count();

        BigDecimal totalRevenue = commandeRepository.findAll().stream()
                .filter(c -> c.getStatut() == Commande.StatutCommande.LIVREE) // Or whatever status means "completed"
                .map(Commande::getMontantTotal)              // BigDecimal
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);



        return new SummaryStatsResponse(
                totalRevenue.doubleValue(), // ou change le type du champ        totalRevenue.doubleValue(), // ou change le type du champ à BigDecimal
                totalUsers,
                totalOrders,
                totalProducts
        );
    }


    public List<RevenueOverTimeResponse> getRevenueOverTime() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);

        // Récupère les commandes livrées depuis 7 jours
        List<Commande> deliveredOrders = commandeRepository
                .findByCreatedAtAfterAndStatut(sevenDaysAgo, Commande.StatutCommande.LIVREE);

        // GroupBy date (LocalDate) + somme BigDecimal
        Map<LocalDate, BigDecimal> revenueByDate = deliveredOrders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getCreatedAt().toLocalDate(),
                        Collectors.reducing(BigDecimal.ZERO, Commande::getMontantTotal, BigDecimal::add)
                ));

        // Map vers DTO + tri par date ascendante
        return revenueByDate.entrySet().stream()
                .map(entry -> RevenueOverTimeResponse.builder()
                        .date(entry.getKey())
                        .revenue(entry.getValue())
                        .build())
                .sorted(Comparator.comparing(RevenueOverTimeResponse::getDate))
                .collect(Collectors.toList());
    }


    public List<TopSellingProductResponse> getTopSellingProducts() {
        return ligneCommandeRepository.findTopSellingProducts(PageRequest.of(0, 5));
    }
}
