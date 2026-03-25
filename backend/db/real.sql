CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20),
    photo_url VARCHAR(255)
        DEFAULT 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    account_status ENUM('active', 'disabled') NOT NULL DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
--@block
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,);  
--@block    
CREATE TABLE lost_found_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    listing_type ENUM('Lost', 'Found') NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    location_details VARCHAR(255),
    date_time_lost_found DATETIME NOT NULL,
    image_url VARCHAR(500),
    status ENUM('Active', 'Claimed', 'Returned', 'Archived')
           NOT NULL DEFAULT 'Active',
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
--@block
CREATE TABLE items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    quantity INT DEFAULT 1,
    image_url TEXT,
    item_condition ENUM('New', 'Good', 'Used') DEFAULT 'Used',
    is_sold TINYINT(1) NOT NULL DEFAULT 0,
    is_approved TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
               ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);
--@block
CREATE TABLE feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    feedback_text TEXT NOT NULL,
    submission_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);
--@block
CREATE TABLE email_otp (
    otp_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    /* The OTP is hashed for security */
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
--@block
SET GLOBAL event_scheduler = ON;
CREATE EVENT delete_expired_otps
ON SCHEDULE EVERY 1 day
DO
    DELETE FROM email_otp
    WHERE expires_at < NOW();

