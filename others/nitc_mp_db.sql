CREATE DATABASE nitc_mp_db;

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
USE nitc_mp_db;

--@block
-- CREATE TABLE nitc_mp_db.items (
--     item_id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     title VARCHAR(150) NOT NULL,
--     description TEXT,
--     price DECIMAL(10, 2) NOT NULL,
--     category VARCHAR(100),
--     image_url TEXT,
--     item_condition VARCHAR(20) DEFAULT 'Used',
--     is_sold BOOLEAN DEFAULT FALSE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
-- );
--@block
DROP TABLE nitc_mp_db.items;

--@block
CREATE TABLE nitc_mp_db.categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    total_items INT DEFAULT 0 
);

--  ** NEW-ITEMS TABLE DROP ABOVE TABLE AND UPDATE THIS **

--@block
CREATE TABLE nitc_mp_db.items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT DEFAULT 1,  -- ✅ How many units the seller wants to list
    image_url TEXT,
    item_condition ENUM('New', 'Good', 'Used') DEFAULT 'Used',
    is_sold BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    user_id INT NOT NULL,
    category_id INT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

--@block
INSERT INTO categories (category_id, name) VALUES
(1, 'Books & Study Material'),
(2, 'Electronics & Gadgets'),
(3, 'Laptops & Accessories'),
(4, 'Cycles & Transportation'),
(5, 'Room Essentials'),
(6, 'Sports Equipment'),
(7, 'Clothing & Wearables'),
(8, 'Hostel Utilities'),
(9, 'Musical Instruments'),
(10, 'Event Costumes & Props'),
(11, 'Lab Equipment & Tools'),
(12, 'Mess & Food Coupons'),
(13, 'Project Components'),
(14, 'Art & Stationery'),
(15, 'Games & Entertainment'),
(16, 'Miscellaneous');

--@block
SELECT * FROM nitc_mp_db.categories;

--@block
SELECT * FROM nitc_mp_db.items;

--@block
ALTER TABLE nitc_mp_db.users
ADD COLUMN photo_url VARCHAR(255) DEFAULT 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

--  ** ADD THIS NEW TABLE **
--@block
CREATE TABLE nitc_mp_db.lost_found_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL, -- Foreign key to the users table (the person who listed it)
    listing_type ENUM('Lost', 'Found') NOT NULL, -- 'Lost' if user lost it, 'Found' if user found it
    item_name VARCHAR(255) NOT NULL,
    description TEXT, -- Detailed description of the item, including distinguishing marks
    -- item_category VARCHAR(100), -- e.g., 'Electronics', 'Documents', 'Clothing', 'Keys', 'Bags', 'Jewelry', 'Books'
    location_details VARCHAR(255), -- Specific place it was lost/found (e.g., "NITC Main Library, 2nd Floor", "Near C-Block Parking Lot C")
    date_time_lost_found DATETIME NOT NULL, -- When the item was lost or found
    image_url VARCHAR(500), -- URL to the image of the item (assuming images are stored externally, e.g., cloud storage)
    status ENUM('Active', 'Claimed', 'Returned', 'Archived') DEFAULT 'Active', -- Current status of the listing
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- When the listing was created
    resolved_at DATETIME, -- When the item was successfully returned/claimed
    FOREIGN KEY (user_id) REFERENCES nitc_mp_db.users(user_id)
);
