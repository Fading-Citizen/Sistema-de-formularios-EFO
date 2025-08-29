import { supabase } from './supabase.js';

// API de autenticación usando Supabase
export const authApi = {
  // Autenticar usuario con email/password
  async login(email, password) {
    try {
      console.log('🔐 Intentando login con:', email);
      
      // Buscar usuario en la base de datos
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('active', true)
        .single();

      if (error || !user) {
        console.log('❌ Usuario no encontrado:', error);
        return { 
          success: false, 
          error: 'Usuario no encontrado o inactivo' 
        };
      }

      // Verificar contraseña usando pgcrypto
      const { data: authResult, error: authError } = await supabase
        .rpc('verify_password', {
          email: email,
          password: password
        });

      if (authError || !authResult) {
        console.log('❌ Contraseña incorrecta:', authError);
        return { 
          success: false, 
          error: 'Credenciales incorrectas' 
        };
      }

      console.log('✅ Login exitoso para:', user.email);
      
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          active: user.active,
          created_at: user.created_at
        }
      };

    } catch (error) {
      console.error('💥 Error en login:', error);
      return { 
        success: false, 
        error: 'Error interno del servidor' 
      };
    }
  },

  // Obtener información del usuario actual
  async getCurrentUser(userId) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .eq('active', true)
        .single();

      if (error || !user) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          active: user.active,
          created_at: user.created_at
        }
      };

    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  },

  // Logout (limpiar sesión local)
  async logout() {
    return { success: true };
  }
};
