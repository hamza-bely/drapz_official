package com.drapz.repository;

import com.drapz.dto.TopSellingProductResponse;
import com.drapz.entity.LigneCommande;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LigneCommandeRepository extends JpaRepository<LigneCommande, String> {

    @Query("SELECT new com.drapz.dto.TopSellingProductResponse(p.nom, SUM(lc.quantite)) " +
           "FROM LigneCommande lc JOIN lc.produit p " +
           "GROUP BY p.nom " +
           "ORDER BY SUM(lc.quantite) DESC")
    List<TopSellingProductResponse> findTopSellingProducts(Pageable pageable);
}
