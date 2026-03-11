package com.example.myapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.myapp.model.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}
