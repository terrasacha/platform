import { Auth } from 'aws-amplify';

/**
 * Servicio para manejar la desactivación de cuentas de usuario en Cognito
 * Solo disponible para el rol 'constructor'
 */
export class UserAccountDisableService {
  
  /**
   * Verifica si el usuario puede desactivar su cuenta
   * @param {Object} user - Usuario autenticado
   * @returns {boolean} - true si puede desactivar, false en caso contrario
   */
  static canDisableAccount(user) {
    if (!user) return false;

    // Soportar forma Cognito (attributes) y forma GraphQL (campos planos)
    const userRole = user?.attributes?.['custom:role'] || user?.role;
    const userId = user?.attributes?.sub || user?.id;

    if (!userId) return false;

    const allowedRoles = ['constructor'];
    return allowedRoles.includes(userRole);
  }

  /**
   * Desactiva la cuenta del usuario en Cognito
   * @param {string} userId - ID del usuario
   * @param {string} confirmationText - Texto de confirmación
   * @returns {Promise<Object>} - Resultado de la operación
   */
  static async disableUserAccount(userId, confirmationText) {
    try {
      // Verificar que el texto de confirmación sea correcto
      if (confirmationText !== 'DESACTIVAR') {
        return {
          success: false,
          message: 'Debe escribir "DESACTIVAR" para confirmar la acción'
        };
      }

      // Obtener el usuario actual
      const currentUser = await Auth.currentAuthenticatedUser();
      
      // Verificar que el usuario puede desactivar su cuenta
      if (!this.canDisableAccount(currentUser)) {
        return {
          success: false,
          message: 'No tienes permisos para desactivar esta cuenta'
        };
      }

      // Verificar que el userId coincida con el usuario actual
      if ((currentUser?.attributes?.sub || '') !== userId) {
        return {
          success: false,
          message: 'No puedes desactivar la cuenta de otro usuario'
        };
      }

      // Desactivar la cuenta en Cognito
      await Auth.deleteUser();
      
      // Limpiar datos locales
      localStorage.clear();
      sessionStorage.clear();

      return {
        success: true,
        message: 'Cuenta desactivada exitosamente. Serás redirigido al login.'
      };

    } catch (error) {
      console.error('Error desactivando cuenta:', error);
      
      // Manejo específico de errores
      if (error.code === 'NotAuthorizedException') {
        return {
          success: false,
          message: 'No tienes permisos para realizar esta acción'
        };
      } else if (error.code === 'UserNotFoundException') {
        return {
          success: false,
          message: 'Usuario no encontrado'
        };
      } else if (error.code === 'LimitExceededException') {
        return {
          success: false,
          message: 'Se ha excedido el límite de intentos. Intenta más tarde'
        };
      } else {
        return {
          success: false,
          message: 'Error inesperado al desactivar la cuenta. Intenta nuevamente'
        };
      }
    }
  }

  /**
   * Cierra la sesión del usuario
   * @returns {Promise<void>}
   */
  static async signOutUser() {
    try {
      await Auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  }

  /**
   * Obtiene las consecuencias de desactivar la cuenta
   * @returns {Array<string>} - Lista de consecuencias
   */
  static getDisableConsequences() {
    return [
      'Se eliminará permanentemente tu cuenta de constructor',
      'Perderás acceso a todos tus predios y proyectos',
      'No podrás recuperar tus datos ni historial',
      'Esta acción es irreversible',
      'Tendrás que crear una nueva cuenta si deseas volver a usar la plataforma'
    ];
  }
}
