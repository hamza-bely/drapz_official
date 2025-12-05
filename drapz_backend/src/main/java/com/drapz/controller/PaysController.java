package com.drapz.controller;

import com.drapz.dto.PaysResponse;
import com.drapz.service.PaysService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pays")
@RequiredArgsConstructor
@Tag(name = "Pays", description = "Endpoints pour la gestion des pays et drapeaux")
public class PaysController {

    private final PaysService paysService;

    @GetMapping
    @Operation(summary = "Récupérer la liste de tous les pays disponibles")
    public ResponseEntity<List<PaysResponse>> obtenirTousPays() {
        List<PaysResponse> pays = paysService.obtenirTousPays();
        return ResponseEntity.ok(pays);
    }

    @GetMapping("/{code}")
    @Operation(summary = "Récupérer un pays par son code")
    public ResponseEntity<PaysResponse> obtenirPaysParCode(@PathVariable String code) {
        PaysResponse pays = paysService.obtenirPaysParCode(code);
        if (pays != null) {
            return ResponseEntity.ok(pays);
        }
        return ResponseEntity.notFound().build();
    }
}
