package com.drapz.repository;

import com.drapz.entity.Produit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, String> {
    Page<Produit> findByActifTrue(Pageable pageable);
}
