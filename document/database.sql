-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(12, 2),
    discount DECIMAL(12, 2),
    stock INT,
    category_id INT, -- không dùng foreign key
    images TEXT, -- JSON array dạng text
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    parent_id INT, -- không dùng foreign key
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT,
    status VARCHAR(50),
    total_amount DECIMAL(12, 2),
    payment_method VARCHAR(100),
    shipping_method VARCHAR(100),
    shipping_address TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(12, 2),
    discount DECIMAL(12, 2)
);

-- Payments Table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INT,
    user_id INT,
    amount DECIMAL(12, 2),
    method VARCHAR(100),
    status VARCHAR(50),
    paid_at TIMESTAMP
);

-- Reviews Table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INT,
    user_id INT,
    rating INT,
    comment TEXT,
    created_at TIMESTAMP
);

-- Wishlists Table
CREATE TABLE wishlists (
    id SERIAL PRIMARY KEY,
    user_id INT,
    product_id INT,
    created_at TIMESTAMP
);

-- Carts Table
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT,
    added_at TIMESTAMP
);

-- Shipments Table
CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    order_id INT,
    carrier VARCHAR(100),
    tracking_number VARCHAR(100),
    status VARCHAR(50),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP
);

-- Admins Table
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(50),
    created_at TIMESTAMP
);
