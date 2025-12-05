/**
 * Servicio de Autenticación
 * Maneja login, logout y validación de tokens
 */

import { api } from './api';

const BASE_PATH = '/auth'; // Ajustar según el microservicio de autenticación

export const authService = {
  /**
   * Login de usuario
   * @param {Object} credentials - { usuario, password }
   */
  login: async (credentials) => {
    try {
      // TODO: Implementar endpoint real cuando esté disponible
      // return api.post(`${BASE_PATH}/login`, credentials);

      // Por ahora, simulamos respuesta exitosa
      return {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 1,
          nombre: credentials.usuario,
          email: `${credentials.usuario}@universidad.edu`,
          rol: 'ADMIN',
        },
      };
    } catch (error) {
      throw {
        message: 'Error al iniciar sesión',
        details: error,
      };
    }
  },

  /**
   * Logout de usuario
   */
  logout: async () => {
    try {
      // TODO: Implementar endpoint real cuando esté disponible
      // return api.post(`${BASE_PATH}/logout`);

      return { success: true };
    } catch (error) {
      throw {
        message: 'Error al cerrar sesión',
        details: error,
      };
    }
  },

  /**
   * Validar token actual
   */
  validateToken: async () => {
    try {
      // TODO: Implementar endpoint real cuando esté disponible
      // return api.get(`${BASE_PATH}/validate`);

      const token = localStorage.getItem('authToken');
      return {
        valid: !!token,
        token,
      };
    } catch (error) {
      throw {
        message: 'Error al validar token',
        details: error,
      };
    }
  },

  /**
   * Refrescar token
   */
  refreshToken: async () => {
    try {
      // TODO: Implementar endpoint real cuando esté disponible
      // return api.post(`${BASE_PATH}/refresh`);

      return {
        token: 'refreshed-token-' + Date.now(),
      };
    } catch (error) {
      throw {
        message: 'Error al refrescar token',
        details: error,
      };
    }
  },

  /**
   * Cambiar contraseña
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      // TODO: Implementar endpoint real cuando esté disponible
      // return api.post(`${BASE_PATH}/change-password`, {
      //   currentPassword,
      //   newPassword,
      // });

      return { success: true };
    } catch (error) {
      throw {
        message: 'Error al cambiar contraseña',
        details: error,
      };
    }
  },

  /**
   * Solicitar recuperación de contraseña
   */
  requestPasswordReset: async (email) => {
    try {
      // TODO: Implementar endpoint real cuando esté disponible
      // return api.post(`${BASE_PATH}/forgot-password`, { email });

      return {
        success: true,
        message: 'Se ha enviado un correo para restablecer tu contraseña',
      };
    } catch (error) {
      throw {
        message: 'Error al solicitar recuperación de contraseña',
        details: error,
      };
    }
  },
};
