package com.example.myapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.myapp.model.StockMovement;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
}
