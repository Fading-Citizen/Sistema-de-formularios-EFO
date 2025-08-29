import { supabase } from './supabase.js';

// API de autenticación usando Supabase
export const authApi = {
  // Autenticar usuario con email/password
  async login(email, password) {
    try {
      console.log('🔐 Intentando login con:', email);
      
      // Paso 1: Buscar usuario en la base de datos
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('active', true)
        .single();

      console.log('🔍 Resultado búsqueda usuario:', { user, error });

      if (error || !user) {
        console.log('❌ Usuario no encontrado:', error);
        return { 
          success: false, 
          error: 'Usuario no encontrado o inactivo' 
        };
      }

      console.log('✅ Usuario encontrado:', user.email, 'Role:', user.role);

      // Paso 2: Verificar contraseña usando SQL directo
      const { data: authResult, error: authError } = await supabase
        .from('users')
        .select('id, email, name, role')
        .eq('email', email)
        .eq('password_hash', supabase.rpc('crypt', { password, salt: user.password_hash }))
        .single();

      console.log('🔍 Resultado verificación contraseña:', { authResult, authError });

      // Si la verificación anterior falla, probemos con la función
      if (authError || !authResult) {
        console.log('🔄 Intentando con verify_password function...');
        
        const { data: funcResult, error: funcError } = await supabase
          .rpc('verify_password', {
            email: email,
            password: password
          });

        console.log('🔍 Resultado verify_password:', { funcResult, funcError });

        if (funcError || !funcResult) {
          console.log('❌ Contraseña incorrecta:', funcError);
          return { 
            success: false, 
            error: 'Credenciales incorrectas - ' + (funcError?.message || 'Contraseña inválida')
          };
        }
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
        error: 'Error interno del servidor: ' + error.message 
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
