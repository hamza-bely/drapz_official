package com.drapz.repository;

import com.drapz.entity.Produit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, String> {
    
    @Query("SELECT p FROM Produit p LEFT JOIN FETCH p.pays WHERE p.actif = true")
    Page<Produit> findByActifTrue(Pageable pageable);
    
    @Query("SELECT p FROM Produit p LEFT JOIN FETCH p.pays WHERE p.pays.code = :paysCode")
    Produit findByPaysCode(@Param("paysCode") String paysCode);
}
