CREATE DATABASE nitc_mp_db;

--@block
USE nitc_mp_db;

--@block
CREATE TABLE nitc_mp_db.users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255),
    contact_number VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

--@block
SELECT * FROM users limit 10;