-- Drop and recreate payments table (Example)

DROP TABLE IF EXISTS payments CASCADE;
CREATE TABLE payments (
  id SERIAL PRIMARY KEY NOT NULL,
  reservation_id INTEGER REFERENCES reservations(id),
  payment_date TIMESTAMP,
  amount DECIMAL(10,2) NOT NULL
);
