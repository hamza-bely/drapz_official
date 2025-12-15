package com.drapz.repository;

import com.drapz.entity.PersonalizedFlag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PersonalizedFlagRepository extends JpaRepository<PersonalizedFlag, UUID> {
    List<PersonalizedFlag> findByNameContainingIgnoreCase(String name);
}
