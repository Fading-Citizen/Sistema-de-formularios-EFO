import { supabase } from './supabase.js';

// API de autenticación alternativa - versión simplificada
export const authApiSimple = {
  async login(email, password) {
    try {
      console.log('🔐 Login simple con:', email);
      
      // Método directo usando SQL en el cliente
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('active', true);

      console.log('📊 Resultado consulta:', { users, error });

      if (error || !users || users.length === 0) {
        return { 
          success: false, 
          error: 'Usuario no encontrado: ' + (error?.message || 'No existe') 
        };
      }

      const user = users[0];
      console.log('👤 Usuario encontrado:', user.email, user.role);

      // Verificar contraseña usando RPC
      const { data: isValid, error: verifyError } = await supabase
        .rpc('check_password', {
          user_email: email,
          user_password: password
        });

      console.log('🔑 Verificación contraseña:', { isValid, verifyError });

      if (verifyError) {
        console.error('Error verificando contraseña:', verifyError);
        return { 
          success: false, 
          error: 'Error verificando contraseña: ' + verifyError.message 
        };
      }

      if (!isValid) {
        return { 
          success: false, 
          error: 'Contraseña incorrecta' 
        };
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
      console.error('💥 Error en login simple:', error);
      return { 
        success: false, 
        error: 'Error interno: ' + error.message 
      };
    }
  }
};
