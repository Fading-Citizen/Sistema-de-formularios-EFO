-- Schema para Sistema EFO en Supabase

-- Habilitar Row Level Security (RLS)
-- ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

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
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    tipo_formulario VARCHAR(50) NOT NULL CHECK (tipo_formulario IN ('credito', 'general')),
    
    -- Datos del cliente
    nombre_cliente VARCHAR(255) NOT NULL,
    email_cliente VARCHAR(255) NOT NULL,
    telefono_cliente VARCHAR(20),
    empresa VARCHAR(255),
    
    -- Datos específicos del formulario
    monto_solicitado DECIMAL(12,2),
    plazo_pago INTEGER,
    garantias TEXT,
    referencias_comerciales TEXT,
    
    -- Metadatos
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado', 'en_revision')),
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
    
    -- Especificaciones técnicas
    longitud VARCHAR(50),
    tipo_conector VARCHAR(100),
    tipo_fibra VARCHAR(100),
    color VARCHAR(50),
    
    -- Precios por línea de producto
    precio_value DECIMAL(10,2),
    precio_premium DECIMAL(10,2),
    
    -- Disponibilidad y stock
    disponible BOOLEAN DEFAULT true,
    stock INTEGER DEFAULT 0,
    
    -- Metadatos
    descripcion TEXT,
    especificaciones JSON,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cotizaciones
CREATE TABLE IF NOT EXISTS public.cotizaciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Información del cliente
    nombre_cliente VARCHAR(255) NOT NULL,
    email_cliente VARCHAR(255) NOT NULL,
    telefono_cliente VARCHAR(20),
    empresa VARCHAR(255),
    
    -- Configuración de la cotización
    linea_producto VARCHAR(50) DEFAULT 'Value' CHECK (linea_producto IN ('Value', 'Premium')),
    descuento_porcentaje DECIMAL(5,2) DEFAULT 0,
    impuesto_porcentaje DECIMAL(5,2) DEFAULT 16,
    
    -- Totales
    subtotal DECIMAL(12,2) NOT NULL,
    descuento_monto DECIMAL(12,2) DEFAULT 0,
    impuesto_monto DECIMAL(12,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    
    -- Items de la cotización (JSON para flexibilidad)
    items JSON NOT NULL,
    
    -- Estado y metadatos
    estado VARCHAR(50) DEFAULT 'borrador' CHECK (estado IN ('borrador', 'enviado', 'aceptado', 'rechazado')),
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de equipos OTDR
CREATE TABLE IF NOT EXISTS public.equipos_otdr (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    modelo VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    
    -- Especificaciones técnicas
    rango_dinamico VARCHAR(50),
    resolucion VARCHAR(50),
    longitud_onda VARCHAR(50),
    tipo_conector VARCHAR(100),
    
    -- Características
    pantalla_tactil BOOLEAN DEFAULT false,
    wifi BOOLEAN DEFAULT false,
    bluetooth BOOLEAN DEFAULT false,
    gps BOOLEAN DEFAULT false,
    
    -- Disponibilidad
    disponible BOOLEAN DEFAULT true,
    stock INTEGER DEFAULT 0,
    
    -- Metadatos
    descripcion TEXT,
    especificaciones JSON,
    precio_referencia DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de sesiones de usuarios (para autenticación)
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_formularios_user_id ON public.formularios(user_id);
CREATE INDEX IF NOT EXISTS idx_formularios_estado ON public.formularios(estado);
CREATE INDEX IF NOT EXISTS idx_formularios_created_at ON public.formularios(created_at);

CREATE INDEX IF NOT EXISTS idx_cotizaciones_user_id ON public.cotizaciones(user_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_estado ON public.cotizaciones(estado);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_created_at ON public.cotizaciones(created_at);

CREATE INDEX IF NOT EXISTS idx_productos_categoria ON public.productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_disponible ON public.productos(disponible);
CREATE INDEX IF NOT EXISTS idx_productos_codigo ON public.productos(codigo);

CREATE INDEX IF NOT EXISTS idx_equipos_otdr_disponible ON public.equipos_otdr(disponible);
CREATE INDEX IF NOT EXISTS idx_equipos_otdr_marca ON public.equipos_otdr(marca);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON public.user_sessions(expires_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_formularios_updated_at BEFORE UPDATE ON public.formularios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON public.productos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cotizaciones_updated_at BEFORE UPDATE ON public.cotizaciones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipos_otdr_updated_at BEFORE UPDATE ON public.equipos_otdr
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Datos de ejemplo para productos (Patch Cords)
INSERT INTO public.productos (codigo, nombre, categoria, subcategoria, longitud, tipo_conector, tipo_fibra, color, precio_value, precio_premium, disponible) VALUES
('PC-SC-SC-SM-1M', 'Patch Cord SC/SC Monomodo 1m', 'Patch Cords', 'Monomodo', '1m', 'SC/SC', 'Monomodo', 'Amarillo', 15.50, 22.00, true),
('PC-LC-LC-SM-2M', 'Patch Cord LC/LC Monomodo 2m', 'Patch Cords', 'Monomodo', '2m', 'LC/LC', 'Monomodo', 'Amarillo', 18.75, 26.50, true),
('PC-FC-FC-SM-3M', 'Patch Cord FC/FC Monomodo 3m', 'Patch Cords', 'Monomodo', '3m', 'FC/FC', 'Monomodo', 'Amarillo', 22.25, 31.00, true),
('PC-SC-LC-MM-1M', 'Patch Cord SC/LC Multimodo 1m', 'Patch Cords', 'Multimodo', '1m', 'SC/LC', 'Multimodo', 'Naranja', 14.25, 20.50, true),
('PC-LC-SC-MM-2M', 'Patch Cord LC/SC Multimodo 2m', 'Patch Cords', 'Multimodo', '2m', 'LC/SC', 'Multimodo', 'Naranja', 17.50, 24.75, true)
ON CONFLICT (codigo) DO NOTHING;

-- Datos de ejemplo para equipos OTDR
INSERT INTO public.equipos_otdr (modelo, marca, rango_dinamico, resolucion, longitud_onda, tipo_conector, pantalla_tactil, wifi, bluetooth, gps, disponible, precio_referencia) VALUES
('FHO5000-D26', 'EXFO', '26 dB', '1 cm', '1310/1550 nm', 'SC/APC', true, true, true, true, true, 15000.00),
('FHO5000-D28', 'EXFO', '28 dB', '1 cm', '1310/1550 nm', 'SC/APC', true, true, true, true, true, 18000.00),
('AQ1200', 'Yokogawa', '24 dB', '2 cm', '1310/1550 nm', 'SC/PC', false, false, false, false, true, 12000.00),
('AQ1210', 'Yokogawa', '26 dB', '1 cm', '1310/1550 nm', 'SC/PC', true, true, false, false, true, 16000.00)
ON CONFLICT DO NOTHING;

-- Usuario administrador por defecto (password: admin123)
INSERT INTO public.users (email, password_hash, name, role, active) VALUES
('admin@efo.com', '$2b$10$K7L/8Y0Y8Y0Y8Y0Y8Y0Y8e', 'Administrador EFO', 'superadmin', true)
ON CONFLICT (email) DO NOTHING;
