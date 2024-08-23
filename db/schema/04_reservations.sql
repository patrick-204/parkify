-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS reservations CASCADE;

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  parking_space_id INTEGER REFERENCES parking_spaces(id) ON DELETE CASCADE,
  reservation_start TIMESTAMP,
  reservation_end  TIMESTAMP
);

