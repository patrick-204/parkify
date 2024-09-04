-- Drop the reservations table if it exists
DROP TABLE IF EXISTS reservations CASCADE;

-- Create the reservations table with status
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  parking_space_id INTEGER REFERENCES parking_spaces(id) ON DELETE CASCADE,
  reservation_start TIMESTAMP,
  reservation_end TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' -- Status column to track reservation status
);
