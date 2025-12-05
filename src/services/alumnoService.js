/**
 * Servicio para el microservicio de Alumnos
 * Maneja CRUD de alumnos y grupos
 */

import { api, buildQueryString } from './api';

const BASE_PATH = '/microservicio-alumno';

export const alumnoService = {
  // ==================== ALUMNOS ====================

  /**
   * Obtener todos los alumnos
   */
  getAllAlumnos: async (filters = {}) => {
    const queryString = buildQueryString(filters);
    return api.get(`${BASE_PATH}/alumnos${queryString}`);
  },

  /**
   * Obtener alumno por ID
   */
  getAlumnoById: async (id) => {
    return api.get(`${BASE_PATH}/alumnos/${id}`);
  },

  /**
   * Obtener alumno por matrícula
   */
  getAlumnoByMatricula: async (matricula) => {
    return api.get(`${BASE_PATH}/alumnos/matricula/${matricula}`);
  },

  /**
   * Crear nuevo alumno
   */
  createAlumno: async (alumnoData) => {
    return api.post(`${BASE_PATH}/alumnos`, alumnoData);
  },

  /**
   * Actualizar alumno
   */
  updateAlumno: async (id, alumnoData) => {
    return api.put(`${BASE_PATH}/alumnos/${id}`, alumnoData);
  },

  /**
   * Eliminar alumno (soft delete)
   */
  deleteAlumno: async (id) => {
    return api.delete(`${BASE_PATH}/alumnos/${id}`);
  },

  /**
   * Activar/desactivar alumno
   */
  toggleAlumnoEstado: async (id) => {
    return api.patch(`${BASE_PATH}/alumnos/${id}/toggle-estado`);
  },

  /**
   * Buscar alumnos por nombre
   */
  searchAlumnosByNombre: async (nombre) => {
    return api.get(`${BASE_PATH}/alumnos/buscar?nombre=${encodeURIComponent(nombre)}`);
  },

  // ==================== GRUPOS ====================

  /**
   * Obtener todos los grupos
   */
  getAllGrupos: async (filters = {}) => {
    const queryString = buildQueryString(filters);
    return api.get(`${BASE_PATH}/grupos${queryString}`);
  },

  /**
   * Obtener grupo por ID
   */
  getGrupoById: async (id) => {
    return api.get(`${BASE_PATH}/grupos/${id}`);
  },

  /**
   * Crear nuevo grupo
   */
  createGrupo: async (grupoData) => {
    return api.post(`${BASE_PATH}/grupos`, grupoData);
  },

  /**
   * Actualizar grupo
   */
  updateGrupo: async (id, grupoData) => {
    return api.put(`${BASE_PATH}/grupos/${id}`, grupoData);
  },

  /**
   * Eliminar grupo
   */
  deleteGrupo: async (id) => {
    return api.delete(`${BASE_PATH}/grupos/${id}`);
  },

  /**
   * Activar/desactivar grupo
   */
  toggleGrupoEstado: async (id) => {
    return api.patch(`${BASE_PATH}/grupos/${id}/toggle-estado`);
  },

  /**
   * Obtener alumnos de un grupo
   */
  getAlumnosByGrupo: async (grupoId) => {
    return api.get(`${BASE_PATH}/grupos/${grupoId}/alumnos`);
  },
};
