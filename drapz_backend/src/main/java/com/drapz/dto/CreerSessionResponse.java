package com.drapz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreerSessionResponse {
    private String sessionId;
    private String commandeId;
    private String url;
}
