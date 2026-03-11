package com.example.myapp.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.myapp.dto.inventory.StockMovementRequest;
import com.example.myapp.model.Product;
import com.example.myapp.service.InventoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Validated
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping("/stock-in")
    public Product stockIn(@Valid @RequestBody StockMovementRequest request) {
        return inventoryService.stockIn(request);
    }

    @PostMapping("/stock-out")
    public Product stockOut(@Valid @RequestBody StockMovementRequest request) {
        return inventoryService.stockOut(request);
    }
}
