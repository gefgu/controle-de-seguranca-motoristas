-- Current tracking for Lucas (in transit from Recife to Salvador)
INSERT INTO tracking (driver_id, trip_id, vehicle_id, lat, lon, speed, is_sleeping)
SELECT d.id, t.id, v.id, -10.5800, -36.9800, 85.5, false
FROM drivers d, trips t, vehicles v
WHERE d.name = 'Lucas Ferreira' 
AND t.origin_name = 'Recife' AND t.destination_name = 'Salvador'
AND v.license_plate = 'PQR1234';

-- Current tracking for Sophia (in transit from Curitiba to Foz do Iguaçu)
INSERT INTO tracking (driver_id, trip_id, vehicle_id, lat, lon, speed, is_sleeping)
SELECT d.id, t.id, v.id, -25.3200, -52.3800, 92.0, false
FROM drivers d, trips t, vehicles v
WHERE d.name = 'Sophia Ribeiro' 
AND t.origin_name = 'Curitiba' AND t.destination_name = 'Foz do Iguaçu'
AND v.license_plate = 'STU5678';

-- Simulating multiple tracking points for another driver (Julia - Belo Horizonte to Brasília)
-- These would normally be added over time, but we're adding historical data
INSERT INTO tracking (driver_id, trip_id, vehicle_id, lat, lon, speed, is_sleeping, timestamp)
SELECT d.id, t.id, v.id, -19.4800, -44.2500, 78.3, false, '2025-04-12 09:15:00'
FROM drivers d, trips t, vehicles v
WHERE d.name = 'Julia Costa' 
AND t.origin_name = 'Belo Horizonte' AND t.destination_name = 'Brasília'
AND v.license_plate = 'MNO7890';

INSERT INTO tracking (driver_id, trip_id, vehicle_id, lat, lon, speed, is_sleeping, timestamp)
SELECT d.id, t.id, v.id, -19.0100, -44.8900, 82.1, false, '2025-04-12 10:30:00'
FROM drivers d, trips t, vehicles v
WHERE d.name = 'Julia Costa' 
AND t.origin_name = 'Belo Horizonte' AND t.destination_name = 'Brasília'
AND v.license_plate = 'MNO7890';

INSERT INTO tracking (driver_id, trip_id, vehicle_id, lat, lon, speed, is_sleeping, timestamp)
SELECT d.id, t.id, v.id, -18.5700, -45.6200, 65.8, true, '2025-04-12 12:00:00'
FROM drivers d, trips t, vehicles v
WHERE d.name = 'Julia Costa' 
AND t.origin_name = 'Belo Horizonte' AND t.destination_name = 'Brasília'
AND v.license_plate = 'MNO7890';

INSERT INTO tracking (driver_id, trip_id, vehicle_id, lat, lon, speed, is_sleeping, timestamp)
SELECT d.id, t.id, v.id, -17.8900, -46.4500, 90.2, false, '2025-04-12 14:30:00'
FROM drivers d, trips t, vehicles v
WHERE d.name = 'Julia Costa' 
AND t.origin_name = 'Belo Horizonte' AND t.destination_name = 'Brasília'
AND v.license_plate = 'MNO7890';