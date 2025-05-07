-- Sleep events for João Silva's Curitiba to São Paulo trip
INSERT INTO sleep_events (trip_id, driver_id, lat, lon, start_time, end_time, duration, severity)
SELECT t.id, d.id, -24.785, -48.222, '2025-04-24 10:15:00', '2025-04-24 10:30:00', INTERVAL '15 minutes', 'medium'
FROM trips t, drivers d
WHERE t.origin_name = 'Curitiba' AND t.destination_name = 'São Paulo' AND d.name = 'João Silva';

INSERT INTO sleep_events (trip_id, driver_id, lat, lon, start_time, end_time, duration, severity)
SELECT t.id, d.id, -24.1021, -47.5851, '2025-04-24 12:45:00', '2025-04-24 13:00:00', INTERVAL '15 minutes', 'low'
FROM trips t, drivers d
WHERE t.origin_name = 'Curitiba' AND t.destination_name = 'São Paulo' AND d.name = 'João Silva';

INSERT INTO sleep_events (trip_id, driver_id, lat, lon, start_time, end_time, duration, severity)
SELECT t.id, d.id, -23.878, -46.9945, '2025-04-24 15:30:00', '2025-04-24 15:45:00', INTERVAL '15 minutes', 'high'
FROM trips t, drivers d
WHERE t.origin_name = 'Curitiba' AND t.destination_name = 'São Paulo' AND d.name = 'João Silva';

-- Sleep event for Maria Oliveira's Joinville to Florianópolis trip
INSERT INTO sleep_events (trip_id, driver_id, lat, lon, start_time, end_time, duration, severity)
SELECT t.id, d.id, -26.9124, -48.66, '2025-04-20 08:00:00', '2025-04-20 08:12:00', INTERVAL '12 minutes', 'low'
FROM trips t, drivers d
WHERE t.origin_name = 'Joinville' AND t.destination_name = 'Florianópolis' AND d.name = 'Maria Oliveira';

-- Sleep events for Ana Pereira's São Paulo to Rio de Janeiro trip
INSERT INTO sleep_events (trip_id, driver_id, lat, lon, start_time, end_time, duration, severity)
SELECT t.id, d.id, -23.317, -46.0008, '2025-04-15 06:30:00', '2025-04-15 06:45:00', INTERVAL '15 minutes', 'medium'
FROM trips t, drivers d
WHERE t.origin_name = 'São Paulo' AND t.destination_name = 'Rio de Janeiro' AND d.name = 'Ana Pereira';

INSERT INTO sleep_events (trip_id, driver_id, lat, lon, start_time, end_time, duration, severity)
SELECT t.id, d.id, -23.0293, -45.5521, '2025-04-15 07:45:00', '2025-04-15 08:00:00', INTERVAL '15 minutes', 'low'
FROM trips t, drivers d
WHERE t.origin_name = 'São Paulo' AND t.destination_name = 'Rio de Janeiro' AND d.name = 'Ana Pereira';

INSERT INTO sleep_events (trip_id, driver_id, lat, lon, start_time, end_time, duration, severity)
SELECT t.id, d.id, -22.8316, -44.2739, '2025-04-15 09:20:00', '2025-04-15 09:35:00', INTERVAL '15 minutes', 'high'
FROM trips t, drivers d
WHERE t.origin_name = 'São Paulo' AND t.destination_name = 'Rio de Janeiro' AND d.name = 'Ana Pereira';

INSERT INTO sleep_events (trip_id, driver_id, lat, lon, start_time, end_time, duration, severity)
SELECT t.id, d.id, -22.8756, -43.6349, '2025-04-15 11:00:00', '2025-04-15 11:15:00', INTERVAL '15 minutes', 'critical'
FROM trips t, drivers d
WHERE t.origin_name = 'São Paulo' AND t.destination_name = 'Rio de Janeiro' AND d.name = 'Ana Pereira';