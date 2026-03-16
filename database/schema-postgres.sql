-- PostgreSQL Schema for MyResume
-- Run this in your Render PostgreSQL database

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profile table for personal information
CREATE TABLE IF NOT EXISTS profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    title VARCHAR(100),
    bio TEXT,
    email VARCHAR(100),
    phone VARCHAR(20),
    location VARCHAR(100),
    github VARCHAR(255),
    linkedin VARCHAR(255),
    leetcode VARCHAR(255),
    twitter VARCHAR(255),
    website VARCHAR(255),
    resume_file VARCHAR(255),
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    tech_stack VARCHAR(500),
    github_link VARCHAR(255),
    demo_link VARCHAR(255),
    image VARCHAR(255),
    video VARCHAR(255),
    category VARCHAR(50),
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media library table
CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: @Anshulsnkatte)
-- You should change this password after first login
INSERT INTO users (username, password_hash) 
VALUES ('Anshulsnkatte', '$2a$10$YourHashedPasswordHere')
ON CONFLICT (username) DO NOTHING;

-- Insert default profile
INSERT INTO profile (name, title, bio, email, phone, location)
VALUES ('Your Name', 'Full Stack Developer', 'Welcome to my portfolio!', 'your.email@example.com', '+1 234 567 890', 'Your Location')
ON CONFLICT DO NOTHING;
