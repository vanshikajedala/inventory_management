package com.example.myapp.config;

import java.math.BigDecimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.myapp.model.AppUser;
import com.example.myapp.model.Product;
import com.example.myapp.model.Supplier;
import com.example.myapp.model.enums.Role;
import com.example.myapp.repository.AppUserRepository;
import com.example.myapp.repository.ProductRepository;
import com.example.myapp.repository.SupplierRepository;

@Configuration
public class SeedDataConfig {

    @Bean
    CommandLineRunner seedData(
            AppUserRepository userRepository,
            ProductRepository productRepository,
            SupplierRepository supplierRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                AppUser admin = new AppUser();
                admin.setName("Admin");
                admin.setEmail("admin@inventory.local");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
            }

            if (supplierRepository.count() == 0) {
                Supplier supplier = new Supplier();
                supplier.setName("Core Supplies");
                supplier.setEmail("sales@coresupplies.local");
                supplier.setPhone("+91-9000000000");
                supplierRepository.save(supplier);
            }

            if (productRepository.count() == 0) {
                Supplier supplier = supplierRepository.findAll().get(0);

                Product p1 = new Product();
                p1.setName("Laptop Stand");
                p1.setSku("SKU-LS-1001");
                p1.setDescription("Aluminum ergonomic stand");
                p1.setPrice(new BigDecimal("1499.00"));
                p1.setQuantity(25);
                p1.setLowStockThreshold(8);
                p1.setSupplier(supplier);
                productRepository.save(p1);

                Product p2 = new Product();
                p2.setName("Wireless Mouse");
                p2.setSku("SKU-WM-1002");
                p2.setDescription("2.4GHz office mouse");
                p2.setPrice(new BigDecimal("799.00"));
                p2.setQuantity(6);
                p2.setLowStockThreshold(10);
                p2.setSupplier(supplier);
                productRepository.save(p2);
            }
        };
    }
}
