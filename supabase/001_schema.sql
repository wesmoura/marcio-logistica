-- Schema for Marcio Logística domain
-- Safe to run multiple times with IF NOT EXISTS guards where possible

-- Vehicles
CREATE TABLE IF NOT EXISTS public.vehicles (
  id BIGSERIAL PRIMARY KEY,
  plate TEXT NOT NULL UNIQUE,
  model TEXT,
  year INT,
  status TEXT,
  mileage INT,
  location TEXT,
  next_maintenance DATE,
  driver_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Drivers
CREATE TABLE IF NOT EXISTS public.drivers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cpf TEXT UNIQUE,
  phone TEXT,
  email TEXT,
  status TEXT,
  current_vehicle_id BIGINT,
  cnh TEXT,
  cnh_category TEXT,
  cnh_expiration DATE,
  hired_at DATE,
  salary NUMERIC(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vehicles
  ADD CONSTRAINT vehicles_driver_fk FOREIGN KEY (driver_id) REFERENCES public.drivers (id) ON DELETE SET NULL;

ALTER TABLE public.drivers
  ADD CONSTRAINT drivers_vehicle_fk FOREIGN KEY (current_vehicle_id) REFERENCES public.vehicles (id) ON DELETE SET NULL;

-- Tires
CREATE TABLE IF NOT EXISTS public.tires (
  id BIGSERIAL PRIMARY KEY,
  serial TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  life_estimate_km INT NOT NULL DEFAULT 100000,
  total_km INT NOT NULL DEFAULT 0,
  recaps INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('Estoque','Em uso','Descartado')),
  current_vehicle_id BIGINT,
  current_position TEXT,
  tread_depth_mm NUMERIC(6,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tires
  ADD CONSTRAINT tires_vehicle_fk FOREIGN KEY (current_vehicle_id) REFERENCES public.vehicles (id) ON DELETE SET NULL;

-- Tire cycles (each install -> remove)
CREATE TABLE IF NOT EXISTS public.tire_cycles (
  id BIGSERIAL PRIMARY KEY,
  tire_id BIGINT NOT NULL REFERENCES public.tires (id) ON DELETE CASCADE,
  vehicle_id BIGINT NOT NULL REFERENCES public.vehicles (id) ON DELETE CASCADE,
  position TEXT NOT NULL,
  install_date DATE NOT NULL,
  install_odometer INT NOT NULL,
  remove_date DATE,
  remove_odometer INT,
  km_run INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tire movements within a cycle (rotations/position changes)
CREATE TABLE IF NOT EXISTS public.tire_movements (
  id BIGSERIAL PRIMARY KEY,
  cycle_id BIGINT NOT NULL REFERENCES public.tire_cycles (id) ON DELETE CASCADE,
  moved_at DATE NOT NULL,
  from_position TEXT,
  to_position TEXT NOT NULL
);

-- Fuelings
CREATE TABLE IF NOT EXISTS public.fuelings (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id BIGINT NOT NULL REFERENCES public.vehicles (id) ON DELETE CASCADE,
  driver_id BIGINT REFERENCES public.drivers (id) ON DELETE SET NULL,
  fueled_at DATE NOT NULL,
  liters NUMERIC(10,2) NOT NULL,
  price_per_liter NUMERIC(10,2) NOT NULL,
  total NUMERIC(12,2) GENERATED ALWAYS AS (liters * price_per_liter) STORED,
  odometer INT,
  station TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Freights (with basic risk management)
CREATE TABLE IF NOT EXISTS public.freights (
  id BIGSERIAL PRIMARY KEY,
  order_code TEXT NOT NULL,
  vehicle_id BIGINT NOT NULL REFERENCES public.vehicles (id) ON DELETE CASCADE,
  driver_id BIGINT REFERENCES public.drivers (id) ON DELETE SET NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  freight_date DATE NOT NULL,
  value NUMERIC(12,2),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Baixo','Médio','Alto')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Maintenance
CREATE TABLE IF NOT EXISTS public.maintenance (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id BIGINT NOT NULL REFERENCES public.vehicles (id) ON DELETE CASCADE,
  tire_id BIGINT REFERENCES public.tires (id) ON DELETE SET NULL,
  service_date DATE NOT NULL,
  description TEXT,
  cost NUMERIC(12,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tracking positions (for realtime and history)
CREATE TABLE IF NOT EXISTS public.positions (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id BIGINT NOT NULL REFERENCES public.vehicles (id) ON DELETE CASCADE,
  driver_id BIGINT REFERENCES public.drivers (id) ON DELETE SET NULL,
  freight_id BIGINT REFERENCES public.freights (id) ON DELETE SET NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  speed NUMERIC(8,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS positions_vehicle_time_idx ON public.positions (vehicle_id, recorded_at DESC);

-- Generic alerts tied to any entity
CREATE TABLE IF NOT EXISTS public.alerts (
  id BIGSERIAL PRIMARY KEY,
  entity TABLEOID,
  entity_id BIGINT,
  title TEXT NOT NULL,
  message TEXT,
  level TEXT NOT NULL CHECK (level IN ('info','warning','critical')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Generic documents tied to any entity
CREATE TABLE IF NOT EXISTS public.documents (
  id BIGSERIAL PRIMARY KEY,
  entity TABLEOID,
  entity_id BIGINT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful views (examples)
CREATE OR REPLACE VIEW public.v_vehicle_current_driver AS
SELECT v.id AS vehicle_id, v.plate, v.model, v.year, v.status, d.id AS driver_id, d.name AS driver_name
FROM public.vehicles v
LEFT JOIN public.drivers d ON d.id = v.driver_id;

CREATE OR REPLACE VIEW public.v_tire_totals AS
SELECT t.id, t.serial, t.brand, t.total_km, t.recaps, t.status,
       COALESCE(SUM(tc.km_run), 0) AS sum_cycle_km
FROM public.tires t
LEFT JOIN public.tire_cycles tc ON tc.tire_id = t.id
GROUP BY t.id;


