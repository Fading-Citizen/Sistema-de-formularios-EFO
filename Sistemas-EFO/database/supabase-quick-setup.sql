-- ===================================
-- SISTEMA EFO - CONFIGURACIÓN SUPABASE
-- ===================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de formularios de crédito
CREATE TABLE IF NOT EXISTS public.formularios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre_cliente VARCHAR(255) NOT NULL,
    email_cliente VARCHAR(255) NOT NULL,
    telefono_cliente VARCHAR(20),
    empresa VARCHAR(255),
    monto_solicitado DECIMAL(12,2),
    plazo_pago INTEGER,
    garantias TEXT,
    referencias_comerciales TEXT,
    estado VARCHAR(50) DEFAULT 'pendiente',
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de productos (Patch Cords)
CREATE TABLE IF NOT EXISTS public.productos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo VARCHAR(100) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    subcategoria VARCHAR(100),
    longitud VARCHAR(50),
    tipo_conector VARCHAR(100),
    tipo_fibra VARCHAR(100),
    color VARCHAR(50),
    precio_value DECIMAL(10,2),
    precio_premium DECIMAL(10,2),
    disponible BOOLEAN DEFAULT true,
    stock INTEGER DEFAULT 0,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cotizaciones
CREATE TABLE IF NOT EXISTS public.cotizaciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre_cliente VARCHAR(255) NOT NULL,
    email_cliente VARCHAR(255) NOT NULL,
    telefono_cliente VARCHAR(20),
    empresa VARCHAR(255),
    linea_producto VARCHAR(50) DEFAULT 'Value',
    descuento_porcentaje DECIMAL(5,2) DEFAULT 0,
    impuesto_porcentaje DECIMAL(5,2) DEFAULT 16,
    subtotal DECIMAL(12,2) NOT NULL,
    descuento_monto DECIMAL(12,2) DEFAULT 0,
    impuesto_monto DECIMAL(12,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    items JSON NOT NULL,
    estado VARCHAR(50) DEFAULT 'borrador',
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de equipos OTDR
CREATE TABLE IF NOT EXISTS public.equipos_otdr (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    modelo VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    rango_dinamico VARCHAR(50),
    resolucion VARCHAR(50),
    longitud_onda VARCHAR(50),
    tipo_conector VARCHAR(100),
    pantalla_tactil BOOLEAN DEFAULT false,
    wifi BOOLEAN DEFAULT false,
    bluetooth BOOLEAN DEFAULT false,
    gps BOOLEAN DEFAULT false,
    disponible BOOLEAN DEFAULT true,
    stock INTEGER DEFAULT 0,
    descripcion TEXT,
    precio_referencia DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DATOS DE EJEMPLO - PRODUCTOS
INSERT INTO public.productos (codigo, nombre, categoria, subcategoria, longitud, tipo_conector, tipo_fibra, color, precio_value, precio_premium, disponible) VALUES
('PC-SC-SC-SM-1M', 'Patch Cord SC/SC Monomodo 1m', 'Patch Cords', 'Monomodo', '1m', 'SC/SC', 'Monomodo', 'Amarillo', 15.50, 22.00, true),
('PC-LC-LC-SM-2M', 'Patch Cord LC/LC Monomodo 2m', 'Patch Cords', 'Monomodo', '2m', 'LC/LC', 'Monomodo', 'Amarillo', 18.75, 26.50, true),
('PC-FC-FC-SM-3M', 'Patch Cord FC/FC Monomodo 3m', 'Patch Cords', 'Monomodo', '3m', 'FC/FC', 'Monomodo', 'Amarillo', 22.25, 31.00, true),
('PC-SC-LC-MM-1M', 'Patch Cord SC/LC Multimodo 1m', 'Patch Cords', 'Multimodo', '1m', 'SC/LC', 'Multimodo', 'Naranja', 14.25, 20.50, true),
('PC-LC-SC-MM-2M', 'Patch Cord LC/SC Multimodo 2m', 'Patch Cords', 'Multimodo', '2m', 'LC/SC', 'Multimodo', 'Naranja', 17.50, 24.75, true),
('PC-ST-ST-MM-1M', 'Patch Cord ST/ST Multimodo 1m', 'Patch Cords', 'Multimodo', '1m', 'ST/ST', 'Multimodo', 'Naranja', 13.75, 19.25, true),
('PC-SC-SC-SM-5M', 'Patch Cord SC/SC Monomodo 5m', 'Patch Cords', 'Monomodo', '5m', 'SC/SC', 'Monomodo', 'Amarillo', 28.50, 38.75, true),
('PC-LC-LC-SM-10M', 'Patch Cord LC/LC Monomodo 10m', 'Patch Cords', 'Monomodo', '10m', 'LC/LC', 'Monomodo', 'Amarillo', 45.00, 62.50, true)
ON CONFLICT (codigo) DO NOTHING;

-- DATOS DE EJEMPLO - EQUIPOS OTDR
INSERT INTO public.equipos_otdr (modelo, marca, rango_dinamico, resolucion, longitud_onda, tipo_conector, pantalla_tactil, wifi, bluetooth, gps, disponible, precio_referencia) VALUES
('FHO5000-D26', 'EXFO', '26 dB', '1 cm', '1310/1550 nm', 'SC/APC', true, true, true, true, true, 15000.00),
('FHO5000-D28', 'EXFO', '28 dB', '1 cm', '1310/1550 nm', 'SC/APC', true, true, true, true, true, 18000.00),
('AQ1200', 'Yokogawa', '24 dB', '2 cm', '1310/1550 nm', 'SC/PC', false, false, false, false, true, 12000.00),
('AQ1210', 'Yokogawa', '26 dB', '1 cm', '1310/1550 nm', 'SC/PC', true, true, false, false, true, 16000.00),
('OWL300', 'AFL', '22 dB', '3 cm', '1310/1550 nm', 'SC/APC', false, false, false, false, true, 8000.00),
('OWL350', 'AFL', '24 dB', '2 cm', '1310/1550 nm', 'SC/APC', true, false, false, false, true, 10500.00)
ON CONFLICT DO NOTHING;

-- Usuario administrador por defecto
INSERT INTO public.users (email, password_hash, name, role, active) VALUES
('admin@efo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador EFO', 'superadmin', true)
ON CONFLICT (email) DO NOTHING;
