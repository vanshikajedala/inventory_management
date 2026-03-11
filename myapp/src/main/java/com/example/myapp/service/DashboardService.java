package com.example.myapp.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.example.myapp.dto.dashboard.DashboardSummaryResponse;
import com.example.myapp.repository.ProductRepository;
import com.example.myapp.repository.SupplierRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    public DashboardSummaryResponse getSummary() {
        var products = productRepository.findAll();

        BigDecimal totalValue = products.stream()
                .map(p -> p.getPrice().multiply(BigDecimal.valueOf(p.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long lowStockCount = products.stream()
                .filter(p -> p.getQuantity() <= p.getLowStockThreshold())
                .count();

        return new DashboardSummaryResponse(
                products.size(),
                supplierRepository.count(),
                lowStockCount,
                totalValue);
    }
}
