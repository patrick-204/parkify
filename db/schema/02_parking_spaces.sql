-- Drop and recreate parking spaces table
DROP TABLE IF EXISTS parking_spaces CASCADE;
CREATE TABLE parking_spaces (
    id SERIAL PRIMARY KEY NOT NULL,
    location VARCHAR(20) NOT NULL,
    street_address VARCHAR(50) NOT NULL,
    city VARCHAR(30) NOT NULL,
    province VARCHAR(20) NOT NULL,
    price DECIMAL(10, 2),
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
