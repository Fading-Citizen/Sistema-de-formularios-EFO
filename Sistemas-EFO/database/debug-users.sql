-- Debug y verificación de usuarios en Supabase
-- Ejecutar estos queries uno por uno para diagnosticar problemas

-- 1. Verificar que los usuarios existen
SELECT 
    id,
    email,
    name,
    role,
    active,
    created_at,
    length(password_hash) as hash_length
FROM public.users 
WHERE email LIKE '%@efo.com'
ORDER BY email;

-- 2. Verificar que la extensión pgcrypto está habilitada
SELECT * FROM pg_extension WHERE extname = 'pgcrypto';

-- 3. Verificar que la función verify_password existe
SELECT 
    proname,
    proargnames,
    prosrc
FROM pg_proc 
WHERE proname = 'verify_password';

-- 4. Test manual de verificación de contraseña
-- Reemplaza 'superadmin@efo.com' y 'efo2025super' por los valores reales
SELECT 
    email,
    name,
    role,
    verify_password('superadmin@efo.com', 'efo2025super') as password_correct
FROM public.users 
WHERE email = 'superadmin@efo.com';

-- 5. Test directo de crypt (alternativo)
SELECT 
    email,
    name,
    role,
    (password_hash = crypt('efo2025super', password_hash)) as password_matches
FROM public.users 
WHERE email = 'superadmin@efo.com';

-- 6. Si nada funciona, recrear usuarios con contraseñas simples (TEMPORAL)
-- SOLO para debugging - NO usar en producción
/*
UPDATE public.users 
SET password_hash = crypt('test123', gen_salt('bf'))
WHERE email = 'superadmin@efo.com';

-- Verificar el cambio
SELECT verify_password('superadmin@efo.com', 'test123');
*/
