package com.example.myapp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.myapp.dto.order.PurchaseOrderRequest;
import com.example.myapp.exception.NotFoundException;
import com.example.myapp.model.Product;
import com.example.myapp.model.PurchaseOrder;
import com.example.myapp.model.Supplier;
import com.example.myapp.model.enums.PurchaseOrderStatus;
import com.example.myapp.repository.ProductRepository;
import com.example.myapp.repository.PurchaseOrderRepository;
import com.example.myapp.repository.SupplierRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    public List<PurchaseOrder> getAll() {
        return purchaseOrderRepository.findAll();
    }

    public PurchaseOrder create(PurchaseOrderRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new NotFoundException("Product not found: " + request.getProductId()));

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new NotFoundException("Supplier not found: " + request.getSupplierId()));

        PurchaseOrder order = new PurchaseOrder();
        order.setProduct(product);
        order.setSupplier(supplier);
        order.setQuantity(request.getQuantity());
        order.setStatus(PurchaseOrderStatus.CREATED);
        return purchaseOrderRepository.save(order);
    }

    public PurchaseOrder updateStatus(Long id, PurchaseOrderStatus status) {
        PurchaseOrder order = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Purchase order not found: " + id));
        order.setStatus(status);
        return purchaseOrderRepository.save(order);
    }
}
