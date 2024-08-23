
-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS vehicles CASCADE;
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  license_plate VARCHAR(20) NOT NULL UNIQUE,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(30)
);
