package com.example.myapp.dto.dashboard;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardSummaryResponse {
    private long totalProducts;
    private long totalSuppliers;
    private long lowStockProducts;
    private BigDecimal inventoryValue;
}
