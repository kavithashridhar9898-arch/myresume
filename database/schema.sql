-- MyResume Database Schema
-- Midnight Luxury Tech Portfolio Platform

CREATE DATABASE IF NOT EXISTS myresume;
USE myresume;

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Profile table for personal information
CREATE TABLE IF NOT EXISTS profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL DEFAULT 'Your Name',
    title VARCHAR(200) DEFAULT 'Full Stack Developer',
    bio TEXT,
    email VARCHAR(100),
    phone VARCHAR(20),
    location VARCHAR(100),
    resume_file VARCHAR(255),
    github VARCHAR(255),
    linkedin VARCHAR(255),
    leetcode VARCHAR(255),
    twitter VARCHAR(255),
    website VARCHAR(255),
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects table for portfolio showcase
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    tech_stack VARCHAR(500),
    github_link VARCHAR(255),
    demo_link VARCHAR(255),
    image VARCHAR(255),
    video VARCHAR(255),
    category VARCHAR(100),
    featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills table for skill showcase
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL,
    category ENUM('Frontend', 'Backend', 'Database', 'AI/Tools', 'DevOps', 'Other') DEFAULT 'Other',
    percentage INT DEFAULT 0,
    icon VARCHAR(100),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Media table for file references
CREATE TABLE IF NOT EXISTS media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('image', 'video', 'document', 'logo', 'other') DEFAULT 'image',
    file_path VARCHAR(255) NOT NULL,
    file_name VARCHAR(255),
    file_size INT,
    mime_type VARCHAR(100),
    alt_text VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: @Anshulsnkatte)
-- bcrypt hash for @Anshulsnkatte
INSERT INTO users (username, password_hash) VALUES 
('Anshulsnkatte', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert default profile
INSERT INTO profile (name, title, bio, email, github, linkedin, leetcode) VALUES 
('Your Name', 'Full Stack Developer', 'Welcome to my portfolio! I am a passionate developer creating amazing web experiences.', 'your.email@example.com', 'https://github.com/yourusername', 'https://linkedin.com/in/yourusername', 'https://leetcode.com/yourusername');

-- Insert sample skills
INSERT INTO skills (skill_name, category, percentage, display_order) VALUES
('HTML/CSS', 'Frontend', 95, 1),
('JavaScript', 'Frontend', 90, 2),
('React', 'Frontend', 85, 3),
('Node.js', 'Backend', 88, 4),
('Python', 'Backend', 80, 5),
('MySQL', 'Database', 85, 6),
('MongoDB', 'Database', 75, 7),
('Git', 'DevOps', 90, 8),
('Docker', 'DevOps', 70, 9),
('Machine Learning', 'AI/Tools', 65, 10);
