package com.example.myapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.example.myapp.model.Product;
import com.example.myapp.repo.ProductRepository;

@RestController
@RequestMapping("/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductRepository repo;

    @GetMapping
    public List<Product> getProducts(){
        return repo.findAll();
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product){
        return repo.save(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id){
        repo.deleteById(id);
    }

}