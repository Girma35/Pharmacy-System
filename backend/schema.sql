-- SQL Migration Schema for Pharmacy Management System (PostgreSQL)

-- Roles & Access Table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    permissions JSONB DEFAULT '[]'::jsonb
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact VARCHAR(100),
    email VARCHAR(100),
    address TEXT,
    balance DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medicines Catalog Table
CREATE TABLE IF NOT EXISTS medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    barcode VARCHAR(50) UNIQUE,
    batch_no VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    stock_qty INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 10,
    supplier_id INT REFERENCES suppliers(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100),
    loyalty_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
    doctor_name VARCHAR(100) NOT NULL,
    notes TEXT,
    prescription_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales Ledger Table
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id) ON DELETE SET NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    discount DECIMAL(12,2) DEFAULT 0.00,
    tax DECIMAL(12,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(30) DEFAULT 'Cash',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sale Dispensed Items Table
CREATE TABLE IF NOT EXISTS sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INT REFERENCES sales(id) ON DELETE CASCADE,
    medicine_id INT REFERENCES medicines(id) ON DELETE SET NULL,
    qty INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00
);

-- Purchase Orders Ledger Table
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(id) ON DELETE SET NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    total DECIMAL(12,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Delivered', 'Cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Invoice Items Table
CREATE TABLE IF NOT EXISTS purchase_items (
    id SERIAL PRIMARY KEY,
    purchase_id INT REFERENCES purchases(id) ON DELETE CASCADE,
    medicine_id INT REFERENCES medicines(id) ON DELETE SET NULL,
    qty INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

-- Inventory Transaction logs Table
CREATE TABLE IF NOT EXISTS inventory_logs (
    id SERIAL PRIMARY KEY,
    medicine_id INT REFERENCES medicines(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('Stock In', 'Stock Out', 'Adjustment')),
    qty INT NOT NULL,
    reason TEXT,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEED MOCK DATA

-- Roles
INSERT INTO roles (id, name, permissions) VALUES 
(1, 'Admin', '["all"]'::jsonb),
(2, 'Pharmacist', '["medicines", "inventory", "sales", "suppliers", "prescriptions"]'::jsonb),
(3, 'Cashier', '["sales", "customers"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Seed Default Admin User (Password is 'admin123' after hashing)
INSERT INTO users (id, name, email, password_hash, role_id, status) VALUES
(1, 'Dr. Jane Foster', 'jane@pharmacy.com', '$2a$10$YxR1Z8Jj/m.2B7E1a3fW6OHV3WpXnF1j0i1R2e4U5O6L7m8N9O0P1', 1, 'Active')
ON CONFLICT (id) DO NOTHING;
