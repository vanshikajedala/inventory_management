package com.example.myapp.model;

import jakarta.persistence.*;

@Entity
@Table(name="products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int quantity;
    private double price;

    public Product(){}

    public Long getId(){
        return id;
    }

    public String getName(){
        return name;
    }

    public int getQuantity(){
        return quantity;
    }

    public double getPrice(){
        return price;
    }

    public void setId(Long id){
        this.id=id;
    }

    public void setName(String name){
        this.name=name;
    }

    public void setQuantity(int quantity){
        this.quantity=quantity;
    }

    public void setPrice(double price){
        this.price=price;
    }
}