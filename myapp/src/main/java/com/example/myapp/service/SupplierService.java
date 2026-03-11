package com.example.myapp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.myapp.dto.supplier.SupplierRequest;
import com.example.myapp.exception.NotFoundException;
import com.example.myapp.model.Supplier;
import com.example.myapp.repository.SupplierRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public List<Supplier> getAll() {
        return supplierRepository.findAll();
    }

    public Supplier getById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Supplier not found: " + id));
    }

    public Supplier create(SupplierRequest request) {
        Supplier supplier = new Supplier();
        map(request, supplier);
        return supplierRepository.save(supplier);
    }

    public Supplier update(Long id, SupplierRequest request) {
        Supplier supplier = getById(id);
        map(request, supplier);
        return supplierRepository.save(supplier);
    }

    public void delete(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new NotFoundException("Supplier not found: " + id);
        }
        supplierRepository.deleteById(id);
    }

    private void map(SupplierRequest request, Supplier supplier) {
        supplier.setName(request.getName());
        supplier.setEmail(request.getEmail());
        supplier.setPhone(request.getPhone());
    }
}
