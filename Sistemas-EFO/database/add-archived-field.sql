-- Migración para agregar campo de archivado a formularios
-- Ejecutar en Supabase SQL Editor

-- Agregar campo archived a la tabla formularios
ALTER TABLE public.formularios 
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

-- Agregar campo archived_at para timestamp
ALTER TABLE public.formularios 
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;

-- Verificar que los campos se agregaron
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'formularios' 
AND column_name IN ('archived', 'archived_at')
ORDER BY column_name;
