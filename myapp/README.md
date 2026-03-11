# Simple Inventory Manager (Spring Boot)

Backend project generated from your abstract for inventory management using layered architecture (Controller, Service, Repository, Database).

## Tech Stack
- Spring Boot 3
- Spring Data JPA
- Spring Security + JWT
- H2 in-memory database

## Run
```bash
mvn spring-boot:run
```
App runs on `http://localhost:4040`.

## Default Seed User
- Email: `admin@inventory.local`
- Password: `admin123`

## Core Modules Implemented
- Product Management: add, update, delete, list, get by id
- Inventory Viewing: search and low-stock alert listing
- Database Module: JPA entities + repositories
- API Module: REST endpoints for all operations
- Future Scope features included: auth, low-stock alerts, supplier and order management, dashboard summary

## API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Products
- `GET /api/products`
- `GET /api/products?q=mouse`
- `GET /api/products/low-stock`
- `GET /api/products/{id}`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

### Inventory
- `POST /api/inventory/stock-in`
- `POST /api/inventory/stock-out`

### Suppliers
- `GET /api/suppliers`
- `GET /api/suppliers/{id}`
- `POST /api/suppliers`
- `PUT /api/suppliers/{id}`
- `DELETE /api/suppliers/{id}`

### Purchase Orders
- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/orders/{id}/status?status=APPROVED`

### Dashboard
- `GET /api/dashboard/summary`

## H2 Console
- URL: `http://localhost:4040/h2-console`
- JDBC URL: `jdbc:h2:mem:inventorydb`
- User: `sa`
- Password: (empty)
