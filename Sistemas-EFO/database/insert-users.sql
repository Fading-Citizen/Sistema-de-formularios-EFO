-- Script para crear usuarios reales en Supabase
-- Sistema EFO - Usuarios Administrativos

-- IMPORTANTE: Este script debe ejecutarse en Supabase SQL Editor
-- Las contraseñas están hasheadas con bcrypt

-- Función para hashear contraseñas (usando extensión pgcrypto)
-- Si no tienes la extensión habilitada, ejecuta primero:
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Función para verificar contraseñas
CREATE OR REPLACE FUNCTION verify_password(
    email TEXT,
    password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- Buscar el usuario por email
    SELECT * INTO user_record 
    FROM public.users 
    WHERE users.email = verify_password.email 
    AND active = true;
    
    -- Si no existe el usuario, retornar false
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar la contraseña usando crypt
    RETURN user_record.password_hash = crypt(verify_password.password, user_record.password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insertar usuarios administrativos
INSERT INTO public.users (id, email, password_hash, name, role, active) VALUES
(
    gen_random_uuid(),
    'superadmin@efo.com',
    crypt('efo2025super', gen_salt('bf')),
    'Super Administrador EFO',
    'superadmin',
    true
),
(
    gen_random_uuid(),
    'creditadmin@efo.com',
    crypt('efo2025credit', gen_salt('bf')),
    'Administrador de Crédito',
    'admin',
    true
),
(
    gen_random_uuid(),
    'generaladmin@efo.com',
    crypt('efo2025general', gen_salt('bf')),
    'Administrador General',
    'admin',
    true
),
(
    gen_random_uuid(),
    'viewer@efo.com',
    crypt('efo2025view', gen_salt('bf')),
    'Usuario Solo Lectura',
    'user',
    true
)
ON CONFLICT (email) DO NOTHING;

-- Verificar que los usuarios se crearon correctamente
SELECT 
    email,
    name,
    role,
    active,
    created_at
FROM public.users 
WHERE email LIKE '%@efo.com'
ORDER BY role DESC, email;

-- Función para verificar login (opcional para testing)
-- SELECT verify_password('superadmin@efo.com', 'efo2025super');
