package com.example.myapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.myapp.model.PurchaseOrder;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
}
