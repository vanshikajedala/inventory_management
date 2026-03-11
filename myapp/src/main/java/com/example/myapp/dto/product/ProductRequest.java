package com.example.myapp.dto.product;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String sku;

    @Min(0)
    private int quantity;

    @NotNull
    private BigDecimal price;

    @Min(1)
    private int lowStockThreshold = 10;

    private String description;

    private Long supplierId;
}
