import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug: Verificar variables de entorno
console.log('🔍 Debug Supabase Config:')
console.log('URL:', supabaseUrl ? '✅ Configurada' : '❌ Faltante')
console.log('Key:', supabaseAnonKey ? '✅ Configurada' : '❌ Faltante')

// Validación de variables requeridas
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is required. Check your environment variables.')
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required. Check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Configuración de autenticación
export const auth = supabase.auth

// Funciones auxiliares para la base de datos
export const db = {
  // Usuarios
  users: {
    getAll: () => supabase.from('users').select('*'),
    getById: (id) => supabase.from('users').select('*').eq('id', id).single(),
    create: (user) => supabase.from('users').insert(user),
    update: (id, updates) => supabase.from('users').update(updates).eq('id', id),
    delete: (id) => supabase.from('users').delete().eq('id', id)
  },
  
  // Formularios
  forms: {
    getAll: () => supabase.from('formularios').select('*'),
    getById: (id) => supabase.from('formularios').select('*').eq('id', id).single(),
    create: (form) => supabase.from('formularios').insert(form),
    update: (id, updates) => supabase.from('formularios').update(updates).eq('id', id),
    delete: (id) => supabase.from('formularios').delete().eq('id', id)
  },
  
  // Cotizaciones
  quotes: {
    getAll: () => supabase.from('cotizaciones').select('*'),
    getById: (id) => supabase.from('cotizaciones').select('*').eq('id', id).single(),
    create: (quote) => supabase.from('cotizaciones').insert(quote),
    update: (id, updates) => supabase.from('cotizaciones').update(updates).eq('id', id),
    delete: (id) => supabase.from('cotizaciones').delete().eq('id', id)
  },
  
  // Productos (Patch Cords)
  products: {
    getAll: () => supabase.from('productos').select('*'),
    getById: (id) => supabase.from('productos').select('*').eq('id', id).single(),
    create: (product) => supabase.from('productos').insert(product),
    update: (id, updates) => supabase.from('productos').update(updates).eq('id', id),
    delete: (id) => supabase.from('productos').delete().eq('id', id)
  }
}

export default supabase
