-- Create the PostgREST API user
CREATE ROLE postgrest_user WITH LOGIN PASSWORD 'securepassword';
GRANT USAGE ON SCHEMA public TO postgrest_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO postgrest_user;

-- Allow PostgREST to work with new tables automatically
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO postgrest_user;

-- Create an anonymous role for public (read-only) access
CREATE ROLE anon NOLOGIN;
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Ensure permissions apply to future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO db_user;

-- Grant access to all tables in public schema
GRANT ALL ON ALL TABLES IN SCHEMA public TO db_user;

-- Grant access to future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO db_user;

-- Function to generate random string of specified length
CREATE OR REPLACE FUNCTION random_string(length INTEGER) RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Functions to generate IDs for each table
CREATE OR REPLACE FUNCTION generate_noun_id() RETURNS TEXT AS $$
BEGIN
  RETURN 'noun_' || random_string(8);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_class_id() RETURNS TEXT AS $$
BEGIN
  RETURN 'cls_' || random_string(8);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_material_id() RETURNS TEXT AS $$
BEGIN
  RETURN 'mat_' || random_string(8);
END;
$$ LANGUAGE plpgsql;

CREATE TABLE Noun (
    id TEXT PRIMARY KEY DEFAULT generate_noun_id(),
    name TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Class (
    id TEXT PRIMARY KEY DEFAULT generate_class_id(),
    noun_id TEXT NOT NULL,
    name TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_noun FOREIGN KEY (noun_id) REFERENCES Noun(id) ON DELETE CASCADE
);

CREATE TABLE Material (
    id TEXT PRIMARY KEY DEFAULT generate_material_id(),
    material_number INT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    long_text TEXT,
    details TEXT,
    noun_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    CONSTRAINT fk_noun FOREIGN KEY (noun_id) REFERENCES Noun(id) ON DELETE CASCADE,
    CONSTRAINT fk_class FOREIGN KEY (class_id) REFERENCES Class(id) ON DELETE CASCADE
);

CREATE INDEX idx_material_number ON Material(material_number);
CREATE INDEX idx_material_noun_id ON Material(noun_id);
CREATE INDEX idx_material_class_id ON Material(class_id);
CREATE INDEX idx_noun_name ON Noun(name);
CREATE INDEX idx_class_name ON Class(name);

-- Insert sample data without specifying IDs (they will be generated automatically)
INSERT INTO Noun (name, active) VALUES
('Metal', TRUE),
('Plastic', TRUE),
('Wood', TRUE),
('Ceramic', TRUE),
('Glass', TRUE);

-- We need to get the generated IDs for the nouns to use in the class insertions
DO $$ 
DECLARE
    metal_id TEXT;
    plastic_id TEXT;
    wood_id TEXT;
    ceramic_id TEXT;
    glass_id TEXT;
BEGIN
    SELECT id INTO metal_id FROM Noun WHERE name = 'Metal';
    SELECT id INTO plastic_id FROM Noun WHERE name = 'Plastic';
    SELECT id INTO wood_id FROM Noun WHERE name = 'Wood';
    SELECT id INTO ceramic_id FROM Noun WHERE name = 'Ceramic';
    SELECT id INTO glass_id FROM Noun WHERE name = 'Glass';

    -- Insert classes with the retrieved noun IDs
    -- Metal classes
    INSERT INTO Class (noun_id, name, active) VALUES
    (metal_id, 'Aluminum', TRUE),
    (metal_id, 'Steel', TRUE),
    (metal_id, 'Copper', TRUE);

    -- Plastic classes
    INSERT INTO Class (noun_id, name, active) VALUES
    (plastic_id, 'Polyethylene', TRUE),
    (plastic_id, 'PVC', TRUE),
    (plastic_id, 'Polycarbonate', TRUE);

    -- Wood classes
    INSERT INTO Class (noun_id, name, active) VALUES
    (wood_id, 'Pine', TRUE),
    (wood_id, 'Oak', TRUE),
    (wood_id, 'Maple', TRUE);

    -- Ceramic classes
    INSERT INTO Class (noun_id, name, active) VALUES
    (ceramic_id, 'Porcelain', TRUE),
    (ceramic_id, 'Stoneware', TRUE),
    (ceramic_id, 'Earthenware', TRUE);

    -- Glass classes
    INSERT INTO Class (noun_id, name, active) VALUES
    (glass_id, 'Tempered Glass', TRUE),
    (glass_id, 'Laminated Glass', TRUE),
    (glass_id, 'Frosted Glass', TRUE);

    -- Insert materials using the noun and class IDs
    INSERT INTO Material (material_number, description, long_text, details, noun_id, class_id)
    SELECT 1001, 'Lightweight aluminum sheet', 'Used in aerospace applications', 'Thickness: 2mm', 
           metal_id, id
    FROM Class WHERE name = 'Aluminum' AND noun_id = metal_id;

    INSERT INTO Material (material_number, description, long_text, details, noun_id, class_id)
    SELECT 1002, 'Reinforced steel rod', 'High tensile strength', 'Diameter: 10mm',
           metal_id, id
    FROM Class WHERE name = 'Steel' AND noun_id = metal_id;

    INSERT INTO Material (material_number, description, long_text, details, noun_id, class_id)
    SELECT 1003, 'PVC plumbing pipe', 'Used for residential plumbing', 'Diameter: 3 inches',
           plastic_id, id
    FROM Class WHERE name = 'PVC' AND noun_id = plastic_id;

    INSERT INTO Material (material_number, description, long_text, details, noun_id, class_id)
    SELECT 1004, 'Oak wood plank', 'Premium quality oak wood', 'Dimensions: 200cm x 50cm',
           wood_id, id
    FROM Class WHERE name = 'Oak' AND noun_id = wood_id;

    INSERT INTO Material (material_number, description, long_text, details, noun_id, class_id)
    SELECT 1005, 'Tempered glass panel', 'Shatter-resistant glass', 'Size: 100cm x 50cm',
           glass_id, id
    FROM Class WHERE name = 'Tempered Glass' AND noun_id = glass_id;
END $$;