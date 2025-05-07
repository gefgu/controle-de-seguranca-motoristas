-- Curitiba to São Paulo trip for João Silva
INSERT INTO trips (driver_id, vehicle_id, origin_name, origin_lat, origin_lon, destination_name, destination_lat, destination_lon, distance, start_time, end_time, status, description)
SELECT d.id, v.id, 'Curitiba', -25.4284, -49.2733, 'São Paulo', -23.5505, -46.6333, 408.0, 
'2025-04-24 08:30:00', '2025-04-24 17:45:00', 'completed', 'Transporte de produtos eletrônicos'
FROM drivers d, vehicles v 
WHERE d.name = 'João Silva' AND v.license_plate = 'ABC1234';

-- Joinville to Florianópolis trip for Maria Oliveira
INSERT INTO trips (driver_id, vehicle_id, origin_name, origin_lat, origin_lon, destination_name, destination_lat, destination_lon, distance, start_time, end_time, status, description)
SELECT d.id, v.id, 'Joinville', -26.3034, -48.8458, 'Florianópolis', -27.5969, -48.5495, 188.0, 
'2025-04-20 06:15:00', '2025-04-20 10:30:00', 'completed', 'Transporte de alimentos refrigerados'
FROM drivers d, vehicles v 
WHERE d.name = 'Maria Oliveira' AND v.license_plate = 'DEF5678';

-- Porto Alegre to Caxias do Sul trip for Carlos Santos
INSERT INTO trips (driver_id, vehicle_id, origin_name, origin_lat, origin_lon, destination_name, destination_lat, destination_lon, distance, start_time, end_time, status, description)
SELECT d.id, v.id, 'Porto Alegre', -30.0277, -51.2287, 'Caxias do Sul', -29.1684, -51.1796, 125.0, 
'2025-04-18 09:00:00', '2025-04-18 11:45:00', 'completed', 'Transporte de produtos têxteis'
FROM drivers d, vehicles v 
WHERE d.name = 'Carlos Santos' AND v.license_plate = 'GHI9012';

-- São Paulo to Rio de Janeiro trip for Ana Pereira
INSERT INTO trips (driver_id, vehicle_id, origin_name, origin_lat, origin_lon, destination_name, destination_lat, destination_lon, distance, start_time, end_time, status, description)
SELECT d.id, v.id, 'São Paulo', -23.5505, -46.6333, 'Rio de Janeiro', -22.9068, -43.1729, 435.0, 
'2025-04-15 05:30:00', '2025-04-15 12:15:00', 'completed', 'Transporte de equipamentos industriais'
FROM drivers d, vehicles v 
WHERE d.name = 'Ana Pereira' AND v.license_plate = 'JKL3456';

-- Belo Horizonte to Brasília trip for Julia Costa
INSERT INTO trips (driver_id, vehicle_id, origin_name, origin_lat, origin_lon, destination_name, destination_lat, destination_lon, distance, start_time, end_time, status, description)
SELECT d.id, v.id, 'Belo Horizonte', -19.9227, -43.9453, 'Brasília', -15.7801, -47.9292, 716.0, 
'2025-04-12 07:00:00', '2025-04-12 18:30:00', 'completed', 'Transporte de mercadorias diversas'
FROM drivers d, vehicles v 
WHERE d.name = 'Julia Costa' AND v.license_plate = 'MNO7890';

-- Current in-progress trips
-- Recife to Salvador trip for Lucas Ferreira
INSERT INTO trips (driver_id, vehicle_id, origin_name, origin_lat, origin_lon, destination_name, destination_lat, destination_lon, distance, start_time, status, description)
SELECT d.id, v.id, 'Recife', -8.0476, -34.8770, 'Salvador', -12.9714, -38.5014, 675.0, 
'2025-04-24 10:15:00', 'in_progress', 'Transporte de produtos petroquímicos'
FROM drivers d, vehicles v 
WHERE d.name = 'Lucas Ferreira' AND v.license_plate = 'PQR1234';

-- Curitiba to Foz do Iguaçu trip for Sophia Ribeiro
INSERT INTO trips (driver_id, vehicle_id, origin_name, origin_lat, origin_lon, destination_name, destination_lat, destination_lon, distance, start_time, status, description)
SELECT d.id, v.id, 'Curitiba', -25.4284, -49.2733, 'Foz do Iguaçu', -25.5163, -54.5854, 636.0, 
'2025-04-24 08:00:00', 'in_progress', 'Transporte de equipamentos agrícolas'
FROM drivers d, vehicles v 
WHERE d.name = 'Sophia Ribeiro' AND v.license_plate = 'STU5678';

-- Planned future trips
-- São Paulo to Goiânia trip for Rafael Melo
INSERT INTO trips (driver_id, vehicle_id, origin_name, origin_lat, origin_lon, destination_name, destination_lat, destination_lon, distance, start_time, status, description)
SELECT d.id, v.id, 'São Paulo', -23.5505, -46.6333, 'Goiânia', -16.6864, -49.2648, 926.0, 
'2025-04-28 06:00:00', 'planned', 'Transporte de produtos eletrônicos'
FROM drivers d, vehicles v 
WHERE d.name = 'Rafael Melo' AND v.license_plate = 'VWX9012';