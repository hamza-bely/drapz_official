package com.drapz.service;

import com.drapz.dto.PaysResponse;
import com.drapz.entity.Pays;
import com.drapz.mapper.PaysMapper;
import com.drapz.repository.PaysRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaysService {
    private final PaysRepository paysRepository;
    private final PaysMapper paysMapper;

    public List<PaysResponse> obtenirTousPays() {
        log.info("Récupération de tous les pays actifs");
        return paysRepository.findByActifTrue()
            .stream()
            .map(paysMapper::toResponse)
            .collect(Collectors.toList());
    }

    public PaysResponse obtenirPaysParCode(String code) {
        log.info("Récupération du pays avec le code: {}", code);
        Pays pays = paysRepository.findByCode(code);
        if (pays != null) {
            return paysMapper.toResponse(pays);
        }
        return null;
    }
}
