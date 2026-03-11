package com.example.myapp.dto.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PurchaseOrderRequest {

    @NotNull
    private Long productId;

    @NotNull
    private Long supplierId;

    @Min(1)
    private int quantity;
}
