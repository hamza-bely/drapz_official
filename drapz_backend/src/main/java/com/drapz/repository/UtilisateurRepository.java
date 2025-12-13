package com.drapz.repository;

import com.drapz.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, String> {
    Optional<Utilisateur> findByEmail(String email);
    Optional<Utilisateur> findByResetPasswordToken(String token);
    boolean existsByEmail(String email);
}
