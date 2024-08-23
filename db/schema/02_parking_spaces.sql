-- Drop and recreate parking spaces table
DROP TABLE IF EXISTS parking_spaces CASCADE;
CREATE TABLE parking_spaces (
    id SERIAL PRIMARY KEY NOT NULL,
    location VARCHAR(20) NOT NULL,
    isReserved BOOLEAN DEFAULT FALSE,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
