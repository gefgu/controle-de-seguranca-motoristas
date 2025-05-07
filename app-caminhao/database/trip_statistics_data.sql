-- Monthly trip statistics (based on the UI showing 4 months of data)
INSERT INTO trip_statistics (month, year, total_trips, total_distance, average_trip_duration, total_sleep_events, critical_sleep_incidents)
VALUES 
(1, 2025, 164, 72560.0, INTERVAL '6 hours 15 minutes', 98, 10),
(2, 2025, 179, 78760.0, INTERVAL '6 hours 30 minutes', 110, 12),
(3, 2025, 198, 83160.0, INTERVAL '6 hours 45 minutes', 135, 16),
(4, 2025, 237, 99540.0, INTERVAL '6 hours 30 minutes', 142, 18);