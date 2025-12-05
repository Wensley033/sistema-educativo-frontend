/**
 * Servicio para el microservicio de Divisiones
 * Maneja CRUD de divisiones, programas educativos y coordinadores
 */

import { api, buildQueryString } from './api';

const BASE_PATH = '/microservicio-division';

export const divisionService = {
  // ==================== DIVISIONES ====================

  /**
   * Obtener todas las divisiones
   */
  getAllDivisiones: async (filters = {}) => {
    const queryString = buildQueryString(filters);
    return api.get(`${BASE_PATH}/divisiones${queryString}`);
  },

  /**
   * Obtener división por ID
   */
  getDivisionById: async (id) => {
    return api.get(`${BASE_PATH}/divisiones/${id}`);
  },

  /**
   * Crear nueva división
   */
  createDivision: async (divisionData) => {
    return api.post(`${BASE_PATH}/divisiones`, divisionData);
  },

  /**
   * Actualizar división
   */
  updateDivision: async (id, divisionData) => {
    return api.put(`${BASE_PATH}/divisiones/${id}`, divisionData);
  },

  /**
   * Eliminar división (soft delete)
   */
  deleteDivision: async (id) => {
    return api.delete(`${BASE_PATH}/divisiones/${id}`);
  },

  /**
   * Activar/desactivar división
   */
  toggleDivisionEstado: async (id) => {
    return api.patch(`${BASE_PATH}/divisiones/${id}/toggle-estado`);
  },

  /**
   * Obtener divisiones activas
   */
  getDivisionesActivas: async () => {
    return api.get(`${BASE_PATH}/divisiones/activas`);
  },

  // ==================== PROGRAMAS EDUCATIVOS ====================

  /**
   * Obtener todos los programas educativos
   */
  getAllProgramas: async (filters = {}) => {
    const queryString = buildQueryString(filters);
    return api.get(`${BASE_PATH}/programas${queryString}`);
  },

  /**
   * Obtener programa por ID
   */
  getProgramaById: async (id) => {
    return api.get(`${BASE_PATH}/programas/${id}`);
  },

  /**
   * Obtener programas por división
   */
  getProgramasByDivision: async (divisionId) => {
    return api.get(`${BASE_PATH}/divisiones/${divisionId}/programas`);
  },

  /**
   * Crear nuevo programa educativo
   */
  createPrograma: async (programaData) => {
    return api.post(`${BASE_PATH}/programas`, programaData);
  },

  /**
   * Actualizar programa educativo
   */
  updatePrograma: async (id, programaData) => {
    return api.put(`${BASE_PATH}/programas/${id}`, programaData);
  },

  /**
   * Eliminar programa educativo
   */
  deletePrograma: async (id) => {
    return api.delete(`${BASE_PATH}/programas/${id}`);
  },

  /**
   * Activar/desactivar programa
   */
  toggleProgramaEstado: async (id) => {
    return api.patch(`${BASE_PATH}/programas/${id}/toggle-estado`);
  },

  /**
   * Obtener programas activos
   */
  getProgramasActivos: async () => {
    return api.get(`${BASE_PATH}/programas/activos`);
  },

  // ==================== COORDINADORES ====================

  /**
   * Obtener todos los coordinadores
   */
  getAllCoordinadores: async (filters = {}) => {
    const queryString = buildQueryString(filters);
    return api.get(`${BASE_PATH}/coordinadores${queryString}`);
  },

  /**
   * Obtener coordinador por ID
   */
  getCoordinadorById: async (id) => {
    return api.get(`${BASE_PATH}/coordinadores/${id}`);
  },

  /**
   * Crear nuevo coordinador
   */
  createCoordinador: async (coordinadorData) => {
    return api.post(`${BASE_PATH}/coordinadores`, coordinadorData);
  },

  /**
   * Actualizar coordinador
   */
  updateCoordinador: async (id, coordinadorData) => {
    return api.put(`${BASE_PATH}/coordinadores/${id}`, coordinadorData);
  },

  /**
   * Eliminar coordinador
   */
  deleteCoordinador: async (id) => {
    return api.delete(`${BASE_PATH}/coordinadores/${id}`);
  },
};
