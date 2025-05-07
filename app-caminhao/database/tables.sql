

CREATE TABLE drivers (
    id bigint primary key generated always as identity,
    name text NOT NULL,
    license_number text UNIQUE NOT NULL,
    phone text,
    email text,
    status text CHECK (status IN ('active', 'inactive', 'on_trip')),
    date_hired date,
    created_at timestamp with time zone DEFAULT now()
) WITH (OIDS=FALSE);
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

CREATE TABLE vehicles (
    id bigint primary key generated always as identity,
    license_plate text UNIQUE NOT NULL,
    model text,
    year integer,
    status text CHECK (status IN ('active', 'maintenance', 'inactive')),
    created_at timestamp with time zone DEFAULT now()
) WITH (OIDS=FALSE);
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE TABLE trips (
    id bigint primary key generated always as identity,
    driver_id bigint references drivers(id) NOT NULL,
    vehicle_id bigint references vehicles(id),
    origin_name text NOT NULL,
    origin_lat double precision NOT NULL,
    origin_lon double precision NOT NULL,
    destination_name text NOT NULL,
    destination_lat double precision NOT NULL,
    destination_lon double precision NOT NULL,
    distance double precision,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    status text CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    description text,
    created_at timestamp with time zone DEFAULT now()
) WITH (OIDS=FALSE);
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE TABLE tracking (
    id bigint primary key generated always as identity,
    driver_id bigint references drivers(id) NOT NULL,
    trip_id bigint references trips(id),
    vehicle_id bigint references vehicles(id),
    lat double precision NOT NULL,
    lon double precision NOT NULL,
    speed double precision,
    is_sleeping boolean DEFAULT false,
    road_index integer,
    timestamp timestamp with time zone DEFAULT now()
) WITH (OIDS=FALSE);
ALTER TABLE tracking ENABLE ROW LEVEL SECURITY;

CREATE TABLE sleep_events (
    id bigint primary key generated always as identity,
    trip_id bigint references trips(id) NOT NULL,
    driver_id bigint references drivers(id) NOT NULL,
    lat double precision NOT NULL,
    lon double precision NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    duration interval,
    severity text CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    created_at timestamp with time zone DEFAULT now()
) WITH (OIDS=FALSE);
ALTER TABLE sleep_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE roads (
    road_id text,
    road_index integer,
    name text,
    lat double precision NOT NULL,
    lon double precision NOT NULL,
    PRIMARY KEY (road_id, road_index)
) WITH (OIDS=FALSE);
ALTER TABLE roads ENABLE ROW LEVEL SECURITY;

CREATE TABLE supervisors (
    id bigint primary key generated always as identity,
    name text NOT NULL,
    email text UNIQUE NOT NULL,
    phone text,
    created_at timestamp with time zone DEFAULT now()
) WITH (OIDS=FALSE);
ALTER TABLE supervisors ENABLE ROW LEVEL SECURITY;

CREATE TABLE supervisor_driver (
    supervisor_id bigint references supervisors(id),
    driver_id bigint references drivers(id),
    assigned_date timestamp with time zone DEFAULT now(),
    primary key (supervisor_id, driver_id)
) WITH (OIDS=FALSE);
ALTER TABLE supervisor_driver ENABLE ROW LEVEL SECURITY;

CREATE TABLE trip_statistics (
    id bigint primary key generated always as identity,
    month integer,
    year integer,
    total_trips integer,
    total_distance double precision,
    average_trip_duration interval,
    total_sleep_events integer,
    critical_sleep_incidents integer,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (month, year)
) WITH (OIDS=FALSE);
ALTER TABLE trip_statistics ENABLE ROW LEVEL SECURITY;
