-- Fernando supervises João, Maria, Carlos and Ana
INSERT INTO supervisor_driver (supervisor_id, driver_id)
SELECT s.id, d.id FROM supervisors s, drivers d
WHERE s.name = 'Fernando Mendes' AND d.name IN ('João Silva', 'Maria Oliveira', 'Carlos Santos', 'Ana Pereira');

-- Roberta supervises Pedro, Julia, Lucas
INSERT INTO supervisor_driver (supervisor_id, driver_id)
SELECT s.id, d.id FROM supervisors s, drivers d
WHERE s.name = 'Roberta Almeida' AND d.name IN ('Pedro Souza', 'Julia Costa', 'Lucas Ferreira');

-- Marcelo supervises Beatriz, Miguel, Sophia
INSERT INTO supervisor_driver (supervisor_id, driver_id)
SELECT s.id, d.id FROM supervisors s, drivers d
WHERE s.name = 'Marcelo Santos' AND d.name IN ('Beatriz Lima', 'Miguel Alves', 'Sophia Ribeiro');

-- Patricia supervises Gabriel, Isabella, Rafael
INSERT INTO supervisor_driver (supervisor_id, driver_id)
SELECT s.id, d.id FROM supervisors s, drivers d
WHERE s.name = 'Patricia Oliveira' AND d.name IN ('Gabriel Martins', 'Isabella Cardoso', 'Rafael Melo');

-- Ricardo supervises Mariana, Bruno, Camila
INSERT INTO supervisor_driver (supervisor_id, driver_id)
SELECT s.id, d.id FROM supervisors s, drivers d
WHERE s.name = 'Ricardo Costa' AND d.name IN ('Mariana Dias', 'Bruno Castro', 'Camila Rocha');