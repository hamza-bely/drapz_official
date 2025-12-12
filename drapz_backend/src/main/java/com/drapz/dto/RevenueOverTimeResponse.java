package com.drapz.dto;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class RevenueOverTimeResponse {
    private LocalDate date;
    private BigDecimal revenue;
}
