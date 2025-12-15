package com.drapz.controller;

import com.drapz.entity.PersonalizedFlag;
import com.drapz.service.PersonalizedFlagService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/personalized-flags")
@AllArgsConstructor
public class PersonalizedFlagController {

    private final PersonalizedFlagService service;

    @GetMapping
    public ResponseEntity<List<PersonalizedFlag>> getPersonalizedFlags(@RequestParam(required = false) String name) {
        List<PersonalizedFlag> flags;
        if (name != null && !name.isEmpty()) {
            flags = service.searchByName(name);
        } else {
            flags = service.getAll();
        }
        return ResponseEntity.ok(flags);
    }
}
