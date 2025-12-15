package com.drapz.service;

import com.drapz.entity.PersonalizedFlag;
import com.drapz.repository.PersonalizedFlagRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PersonalizedFlagService {

    private final PersonalizedFlagRepository repository;

    public List<PersonalizedFlag> getAll() {
        return repository.findAll();
    }

    public List<PersonalizedFlag> searchByName(String name) {
        return repository.findByNameContainingIgnoreCase(name);
    }
}
