DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM Pg_type WHERE typname = 'estado') THEN
    CREATE TYPE estado AS ENUM ('Pendiente', 'Aprobado', 'Rechazado');
  END IF;
END$$;

ALTER TABLE expenses
ADD COLUMN estado estado NOT NULL DEFAULT 'Pendiente';
