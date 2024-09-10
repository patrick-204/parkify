-- Insert parking spaces data
INSERT INTO parking_spaces (location, street_address, city, province, price, isReserved, owner_id)
VALUES
    ('M5A 1A1', '1 King Street E', 'Toronto', 'ON', 1.20, FALSE, 1),
    ('M5A 1B2', '2 Queen Street E', 'Toronto', 'ON', 8.0, TRUE, 2),
    ('M5B 2H1', '3 Gerrard Street E', 'Toronto', 'ON', 9.50, FALSE, 3),
    ('M5C 1M1', '4 Dundas Street E', 'Toronto', 'ON', 6.75, TRUE, 4),
    ('M6G 1A1', '5 Bathurst Street', 'Toronto', 'ON', 8.00, FALSE, 5),
    ('M6H 2S2', '6 Bloor Street W', 'Toronto', 'ON', 7.00, FALSE, 6),
    ('M4J 1R1', '7 Danforth Avenue', 'Toronto', 'ON', 6.00, TRUE, 7),
    ('M4L 1A1', '8 Coxwell Avenue', 'Toronto', 'ON', 5.00, FALSE, 8),
    ('M8V 1A1', '9 The Queensway', 'Toronto', 'ON', 6.00, FALSE, 9),
    ('M9W 1A1', '10 Albion Road', 'Toronto', 'ON', 7.50, TRUE, 10);
    