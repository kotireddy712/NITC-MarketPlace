INSERT INTO items (user_id, title, description, price, category, image_url, item_condition, is_sold)
VALUES
-- Cars
(12, '2015 Honda Civic', 'Well-maintained, single owner, excellent mileage.', 550000.00, 'Car', 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg', 'Used', FALSE),
(34, '2018 Maruti Suzuki Swift', 'Top model with all features, recently serviced.', 620000.00, 'Car', 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg', 'Used', FALSE),
(56, '2017 Hyundai i20', 'Sportz variant, no accidents, new tires.', 580000.00, 'Car', 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg', 'Used', FALSE),
(78, '2016 Toyota Corolla Altis', 'Diesel variant, excellent condition, single owner.', 750000.00, 'Car', 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg', 'Used', FALSE),
(90, '2019 Tata Nexon', 'Top-end model, recently serviced, excellent condition.', 800000.00, 'Car', 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg', 'Used', FALSE),
(23, '2015 Ford EcoSport', 'Well-maintained, single owner, excellent mileage.', 600000.00, 'Car', 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg', 'Used', FALSE),
(45, '2018 Renault Kwid', 'Top model with all features, recently serviced.', 450000.00, 'Car', 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg', 'Used', FALSE),
(67, '2017 Mahindra XUV500', 'Diesel variant, excellent condition, single owner.', 950000.00, 'Car', 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg', 'Used', FALSE),
(89, '2016 Skoda Rapid', 'Petrol variant, well-maintained, single owner.', 650000.00, 'Car', 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg', 'Used', FALSE),
(101, '2019 Kia Seltos', 'Top-end model, recently serviced, excellent condition.', 1000000.00, 'Car', 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg', 'Used', FALSE),

-- Bikes
(14, '2018 Royal Enfield Classic 350', 'Well-maintained, single owner, excellent mileage.', 150000.00, 'Bike', 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg', 'Used', FALSE),
(36, '2019 Bajaj Pulsar 220F', 'Top model with all features, recently serviced.', 120000.00, 'Bike', 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg', 'Used', FALSE),
(58, '2017 Yamaha FZ-S', 'Well-maintained, single owner, excellent mileage.', 90000.00, 'Bike', 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg', 'Used', FALSE),
(80, '2016 TVS Apache RTR 160', 'Top model with all features, recently serviced.', 85000.00, 'Bike', 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg', 'Used', FALSE),
(92, '2019 KTM Duke 200', 'Well-maintained, single owner, excellent mileage.', 180000.00, 'Bike', 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg', 'Used', FALSE),
(25, '2015 Hero Splendor Plus', 'Top model with all features, recently serviced.', 50000.00, 'Bike', 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg', 'Used', FALSE),
(47, '2018 Honda CB Shine', 'Well-maintained, single owner, excellent mileage.', 70000.00, 'Bike', 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg', 'Used', FALSE),
(69, '2017 Suzuki Gixxer SF', 'Top model with all features, recently serviced.', 95000.00, 'Bike', 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg', 'Used', FALSE),
(91, '2016 Bajaj Avenger 220', 'Well-maintained, single owner, excellent mileage.', 85000.00, 'Bike', 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg', 'Used', FALSE),
(103, '2019 Yamaha R15 V3', 'Top model with all features, recently serviced.', 160000.00, 'Bike', 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg', 'Used', FALSE),

-- Additional Cars
(15, '2015 Maruti Suzuki Alto 800', 'Well-maintained, single owner, excellent mileage.', 300000.00, 'Car', 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg', 'Used', FALSE),
(37, '2018 Hyundai Verna', 'Top model with all features, recently serviced.', 850000.00, 'Car', 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg', 'Used', FALSE),
(59, '2017 Honda City', 'Well-maintained, single owner, excellent mileage.', 900000.00, 'Car', 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg', 'Used', FALSE),
(81, '2016 Tata Tiago', 'Top model with all features, recently serviced.', 500000.00, 'Car', 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg', 'Used', FALSE),
(93, '2019 Mahindra Scorpio', 'Well-maintained, single owner, excellent mileage.', 1100000.00, 'Car', 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg', 'Used', FALSE),

-- Additional Bikes
(26, '2015 Bajaj Discover 125', 'Top model with all features, recently serviced.', 60000.00, 'Bike', 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg', 'Used', FALSE),
(48, '2018 Hero Passion Pro', 'Well-maintained, single owner, excellent mileage.', 65000.00, 'Bike', 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg', 'Used', FALSE),
(70, '2017 Honda Unicorn 160', 'Top model with all features, recently serviced.', 80000.00, 'Bike', 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg', 'Used', FALSE),
(92, '2016 TVS Star City Plus', 'Well-maintained, single owner, excellent mileage.', 55000.00, 'Bike', 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg', 'Used', FALSE),
(104, '2019 Suzuki Access 125', 'Top model with all features, recently serviced.', 70000.00, 'Bike', 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg', 'Used', FALSE);
--@block
SELECT * FROM items limit 10;
--@block
desc items;
--@block
INSERT INTO nitc_mp_db.items (
    title, description, price, quantity, image_url, item_condition,
    is_sold, user_id, category_id
)
VALUES
('2018 Hero Passion Pro', 'Well-maintained, single owner, excellent mileage.', 65000.00, 1,
 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg', 'Used', FALSE, 48, 4),
 
('2019 Mahindra Scorpio', 'Well-maintained, single owner, excellent mileage.', 1100000.00, 1,
 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg', 'Used', FALSE, 93, 4),

('2017 Hyundai i20', 'Sportz variant, no accidents, new tires.', 580000.00, 1,
 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg', 'Used', FALSE, 56, 4);

