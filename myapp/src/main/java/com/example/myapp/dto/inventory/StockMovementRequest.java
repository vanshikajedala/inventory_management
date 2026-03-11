package com.example.myapp.dto.inventory;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StockMovementRequest {

    @NotNull
    private Long productId;

    @Min(1)
    private int quantity;

    private String notes;
}
