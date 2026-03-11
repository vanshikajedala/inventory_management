package com.example.myapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.myapp.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByQuantityLessThanEqual(Integer quantity);

    boolean existsBySku(String sku);
}
