package com.drapz.repository;

import com.drapz.entity.Pays;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaysRepository extends JpaRepository<Pays, String> {
    List<Pays> findByActifTrue();
    Pays findByCode(String code);
}
