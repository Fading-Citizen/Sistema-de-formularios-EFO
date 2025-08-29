-- Función simplificada para verificar contraseñas
-- Ejecutar en Supabase SQL Editor

-- Habilitar pgcrypto si no está habilitado
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Función más simple y directa
CREATE OR REPLACE FUNCTION check_password(
    user_email TEXT,
    user_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    stored_hash TEXT;
BEGIN
    -- Obtener el hash almacenado
    SELECT password_hash INTO stored_hash 
    FROM public.users 
    WHERE email = user_email AND active = true;
    
    -- Si no se encuentra el usuario
    IF stored_hash IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar contraseña
    RETURN stored_hash = crypt(user_password, stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test de la función
SELECT 
    'superadmin@efo.com' as email,
    check_password('superadmin@efo.com', 'efo2025super') as test_result;

-- Si el test anterior da FALSE, recrear el usuario con una contraseña simple
-- TEMPORAL para debugging:
/*
UPDATE public.users 
SET password_hash = crypt('admin123', gen_salt('bf'))
WHERE email = 'superadmin@efo.com';

-- Verificar
SELECT check_password('superadmin@efo.com', 'admin123');
*/
