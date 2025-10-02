-- PostgreSQL Database Setup for Voice Report POC
-- Run this script to create the database and user

-- Create database
CREATE DATABASE voice_report_poc;

-- Create user (optional, you can use existing postgres user)
-- CREATE USER voice_user WITH PASSWORD 'voice_password';
-- GRANT ALL PRIVILEGES ON DATABASE voice_report_poc TO voice_user;

-- Connect to the database
\c voice_report_poc;

-- Create the sales_data table
CREATE TABLE IF NOT EXISTS sales_data (
    id BIGSERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sales_date DATE NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sales_data_date ON sales_data(sales_date);
CREATE INDEX IF NOT EXISTS idx_sales_data_category ON sales_data(category);
CREATE INDEX IF NOT EXISTS idx_sales_data_region ON sales_data(region);
CREATE INDEX IF NOT EXISTS idx_sales_data_date_range ON sales_data(sales_date, category, region);

-- Grant permissions (if using separate user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO voice_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO voice_user;
