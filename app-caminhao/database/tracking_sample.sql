CREATE TABLE tracking_sample (
  id SERIAL PRIMARY KEY,
  driver VARCHAR(255) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  speed DOUBLE PRECISION DEFAULT 0,
  is_sleeping BOOLEAN DEFAULT false,
  time TIMESTAMPTZ DEFAULT NOW()
);

-- Enable real-time for the table
ALTER PUBLICATION supabase_realtime ADD TABLE tracking_sample;