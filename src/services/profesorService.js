/**
 * Servicio para el microservicio de Profesores
 * Maneja CRUD de profesores
 */

import { api, buildQueryString } from './api';

const BASE_PATH = '/microservicio-profesor';

export const profesorService = {
  /**
   * Obtener todos los profesores
   */
  getAllProfesores: async (filters = {}) => {
    const queryString = buildQueryString(filters);
    return api.get(`${BASE_PATH}/profesores${queryString}`);
  },

  /**
   * Obtener profesor por ID
   */
  getProfesorById: async (id) => {
    return api.get(`${BASE_PATH}/profesores/${id}`);
  },

  /**
   * Obtener profesor con datos de división
   */
  getProfesorConDivision: async (id) => {
    return api.get(`${BASE_PATH}/profesores/${id}/division`);
  },

  /**
   * Crear nuevo profesor
   */
  createProfesor: async (profesorData) => {
    return api.post(`${BASE_PATH}/profesores`, profesorData);
  },

  /**
   * Actualizar profesor
   */
  updateProfesor: async (id, profesorData) => {
    return api.put(`${BASE_PATH}/profesores/${id}`, profesorData);
  },

  /**
   * Eliminar profesor (soft delete)
   */
  deleteProfesor: async (id) => {
    return api.delete(`${BASE_PATH}/profesores/${id}`);
  },

  /**
   * Activar/desactivar profesor
   */
  toggleProfesorEstado: async (id) => {
    return api.patch(`${BASE_PATH}/profesores/${id}/toggle-estado`);
  },

  /**
   * Buscar profesores por nombre
   */
  searchProfesoresByNombre: async (nombre) => {
    return api.get(`${BASE_PATH}/profesores/buscar?nombre=${encodeURIComponent(nombre)}`);
  },

  /**
   * Obtener profesores por división
   */
  getProfesoresByDivision: async (divisionId) => {
    return api.get(`${BASE_PATH}/profesores/division/${divisionId}`);
  },

  /**
   * Validar disponibilidad de correo
   */
  checkEmailDisponible: async (email) => {
    return api.get(`${BASE_PATH}/profesores/validar-email?email=${encodeURIComponent(email)}`);
  },
};
