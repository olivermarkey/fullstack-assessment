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
GRANT USAGE ON SCHEMA public TO ${POSTGRES_USER};

-- Grant access to all tables in public schema
GRANT ALL ON ALL TABLES IN SCHEMA public TO ${POSTGRES_USER};

-- Grant access to future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${POSTGRES_USER};

CREATE TABLE Noun (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Class (
    id TEXT PRIMARY KEY,
    noun_id TEXT NOT NULL,
    name TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_noun FOREIGN KEY (noun_id) REFERENCES Noun(id) ON DELETE CASCADE
);

CREATE TABLE Material (
    id TEXT PRIMARY KEY,
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


INSERT INTO Noun (id, name, active) VALUES
('noun_kj123u98', 'Metal', TRUE),
('noun_123lkjj8as', 'Plastic', TRUE),
('noun_asdjkl819', 'Wood', TRUE),
('noun_qwe7812yhj', 'Ceramic', TRUE),
('noun_zxc12jk8yu', 'Glass', TRUE);

INSERT INTO Class (id, noun_id, name, active) VALUES
-- Classes for 'Metal'
('cls_asj81lkjds', 'noun_kj123u98', 'Aluminum', TRUE),
('cls_qwlkj12789', 'noun_kj123u98', 'Steel', TRUE),
('cls_zx8912lkjs', 'noun_kj123u98', 'Copper', TRUE),

-- Classes for 'Plastic'
('cls_lkj8912asd', 'noun_123lkjj8as', 'Polyethylene', TRUE),
('cls_mnbv9812jk', 'noun_123lkjj8as', 'PVC', TRUE),
('cls_vcxz1278jk', 'noun_123lkjj8as', 'Polycarbonate', TRUE),

-- Classes for 'Wood'
('cls_asdf1298kl', 'noun_asdjkl819', 'Pine', TRUE),
('cls_qwe7812jkl', 'noun_asdjkl819', 'Oak', TRUE),
('cls_zxcv1289lk', 'noun_asdjkl819', 'Maple', TRUE),

-- Classes for 'Ceramic'
('cls_oplkj8712zx', 'noun_qwe7812yhj', 'Porcelain', TRUE),
('cls_iuy8912mnbv', 'noun_qwe7812yhj', 'Stoneware', TRUE),
('cls_rtyu8712vbn', 'noun_qwe7812yhj', 'Earthenware', TRUE),

-- Classes for 'Glass'
('cls_bvcd1298lmn', 'noun_zxc12jk8yu', 'Tempered Glass', TRUE),
('cls_uiop1298qwe', 'noun_zxc12jk8yu', 'Laminated Glass', TRUE),
('cls_mkjh8712xcv', 'noun_zxc12jk8yu', 'Frosted Glass', TRUE);

INSERT INTO Material (id, material_number, description, long_text, details, noun_id, class_id) VALUES
('mat_1kjl8912qwe', 1001, 'Lightweight aluminum sheet', 'Used in aerospace applications', 'Thickness: 2mm', 'noun_kj123u98', 'cls_asj81lkjds'),
('mat_2lkj8912asd', 1002, 'Reinforced steel rod', 'High tensile strength', 'Diameter: 10mm', 'noun_kj123u98', 'cls_qwlkj12789'),
('mat_3zxcv1289kl', 1003, 'PVC plumbing pipe', 'Used for residential plumbing', 'Diameter: 3 inches', 'noun_123lkjj8as', 'cls_mnbv9812jk'),
('mat_4oplkj8712zx', 1004, 'Oak wood plank', 'Premium quality oak wood', 'Dimensions: 200cm x 50cm', 'noun_asdjkl819', 'cls_qwe7812jkl'),
('mat_5uiop1298qwe', 1005, 'Tempered glass panel', 'Shatter-resistant glass', 'Size: 100cm x 50cm', 'noun_zxc12jk8yu', 'cls_bvcd1298lmn');


