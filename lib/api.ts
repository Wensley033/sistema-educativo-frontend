// lib/api.ts
// Configuración centralizada de la API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Servicios
export const SERVICES = {
  DIVISION: 'microservicio-division',
  PROFESOR: 'microservicio-profesor',
  ALUMNO: 'microservicio-alumno',
} as const;

// Helper para construir URLs
const buildUrl = (service: string, endpoint: string): string => {
  return `${API_BASE_URL}/${service}${endpoint}`;
};

// Función base para peticiones
const apiRequest = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ==================== TIPOS ====================
export interface Division {
  divisionId: number;
  nombre: string;
  programaEducativa: string[];
  activo: boolean;
  numeroProgramas: number;
}

export interface ProgramaEducativo {
  id?: number;
  nombre: string;
  activo: boolean;
}

export interface Profesor {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  divisionId: number | null;
}

export interface Grupo {
  id: number;
  nombre: string;
  programaEducativoId: number;
  profesorId: number | null;
  activo: boolean;
}

export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  correo: string;
  telefono: string;
  programaEducativoId: number;
  grupoId: number | null;
  activo: boolean;
}

// ==================== DIVISIONES ====================
export const divisionApi = {
  getAll: () => apiRequest<Division[]>(buildUrl(SERVICES.DIVISION, '/divisiones')),
  getActive: () => apiRequest<Division[]>(buildUrl(SERVICES.DIVISION, '/divisiones/activas')),
  getById: (id: number) => apiRequest<Division>(buildUrl(SERVICES.DIVISION, `/divisiones/${id}`)),
  create: (data: any) => apiRequest<Division>(buildUrl(SERVICES.DIVISION, '/divisiones'), {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest<Division>(buildUrl(SERVICES.DIVISION, `/divisiones/${id}`), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest<void>(buildUrl(SERVICES.DIVISION, `/divisiones/${id}`), {
    method: 'DELETE',
  }),
  toggleStatus: (id: number) => apiRequest<Division>(buildUrl(SERVICES.DIVISION, `/divisiones/${id}/toggle-status`), {
    method: 'PATCH',
  }),
};

// ==================== PROFESORES ====================
export const profesorApi = {
  getAll: () => apiRequest<Profesor[]>(buildUrl(SERVICES.PROFESOR, '/profesores')),
  getById: (id: number) => apiRequest<Profesor>(buildUrl(SERVICES.PROFESOR, `/profesores/${id}`)),
  getWithDivision: (id: number) => apiRequest<any>(buildUrl(SERVICES.PROFESOR, `/profesores/${id}/division`)),
  create: (data: Partial<Profesor>) => apiRequest<Profesor>(buildUrl(SERVICES.PROFESOR, '/profesores'), {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<Profesor>) => apiRequest<Profesor>(buildUrl(SERVICES.PROFESOR, `/profesores/${id}`), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest<void>(buildUrl(SERVICES.PROFESOR, `/profesores/${id}`), {
    method: 'DELETE',
  }),
};

// ==================== GRUPOS ====================
export const grupoApi = {
  getAll: () => apiRequest<Grupo[]>(buildUrl(SERVICES.ALUMNO, '/grupos')),
  getActive: () => apiRequest<Grupo[]>(buildUrl(SERVICES.ALUMNO, '/grupos/activos')),
  getById: (id: number) => apiRequest<Grupo>(buildUrl(SERVICES.ALUMNO, `/grupos/${id}`)),
  getDetails: (id: number) => apiRequest<any>(buildUrl(SERVICES.ALUMNO, `/grupos/${id}/detalles`)),
  getAlumnos: (id: number) => apiRequest<Alumno[]>(buildUrl(SERVICES.ALUMNO, `/grupos/${id}/alumnos`)),
  getByPrograma: (programaId: number) => apiRequest<Grupo[]>(buildUrl(SERVICES.ALUMNO, `/grupos/programa-educativo/${programaId}`)),
  getByProfesor: (profesorId: number) => apiRequest<Grupo[]>(buildUrl(SERVICES.ALUMNO, `/grupos/profesor/${profesorId}`)),
  create: (data: Partial<Grupo>) => apiRequest<Grupo>(buildUrl(SERVICES.ALUMNO, '/grupos'), {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<Grupo>) => apiRequest<Grupo>(buildUrl(SERVICES.ALUMNO, `/grupos/${id}`), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  assignProfesor: (grupoId: number, profesorId: number) => apiRequest<Grupo>(
    buildUrl(SERVICES.ALUMNO, `/grupos/${grupoId}/asignar-profesor/${profesorId}`),
    { method: 'PATCH' }
  ),
  toggleActivo: (id: number) => apiRequest<Grupo>(buildUrl(SERVICES.ALUMNO, `/grupos/${id}/toggle-activo`), {
    method: 'PATCH',
  }),
  delete: (id: number) => apiRequest<void>(buildUrl(SERVICES.ALUMNO, `/grupos/${id}`), {
    method: 'DELETE',
  }),
};

// ==================== ALUMNOS ====================
export const alumnoApi = {
  getAll: () => apiRequest<Alumno[]>(buildUrl(SERVICES.ALUMNO, '/alumnos')),
  getActive: () => apiRequest<Alumno[]>(buildUrl(SERVICES.ALUMNO, '/alumnos/activos')),
  getById: (id: number) => apiRequest<Alumno>(buildUrl(SERVICES.ALUMNO, `/alumnos/${id}`)),
  getDetails: (id: number) => apiRequest<any>(buildUrl(SERVICES.ALUMNO, `/alumnos/${id}/detalles`)),
  getByMatricula: (matricula: string) => apiRequest<Alumno>(buildUrl(SERVICES.ALUMNO, `/alumnos/matricula/${matricula}`)),
  getByGrupo: (grupoId: number) => apiRequest<Alumno[]>(buildUrl(SERVICES.ALUMNO, `/alumnos/grupo/${grupoId}`)),
  getByPrograma: (programaId: number) => apiRequest<Alumno[]>(buildUrl(SERVICES.ALUMNO, `/alumnos/programa-educativo/${programaId}`)),
  search: (termino: string) => apiRequest<Alumno[]>(buildUrl(SERVICES.ALUMNO, `/alumnos/buscar?termino=${encodeURIComponent(termino)}`)),
  create: (data: Partial<Alumno>) => apiRequest<Alumno>(buildUrl(SERVICES.ALUMNO, '/alumnos'), {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<Alumno>) => apiRequest<Alumno>(buildUrl(SERVICES.ALUMNO, `/alumnos/${id}`), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  changeGrupo: (alumnoId: number, nuevoGrupoId: number) => apiRequest<Alumno>(
    buildUrl(SERVICES.ALUMNO, `/alumnos/${alumnoId}/cambiar-grupo`),
    {
      method: 'PATCH',
      body: JSON.stringify({ nuevoGrupoId }),
    }
  ),
  toggleActivo: (id: number) => apiRequest<Alumno>(buildUrl(SERVICES.ALUMNO, `/alumnos/${id}/toggle-activo`), {
    method: 'PATCH',
  }),
  delete: (id: number) => apiRequest<void>(buildUrl(SERVICES.ALUMNO, `/alumnos/${id}`), {
    method: 'DELETE',
  }),
};

// Exportar todo
export default {
  division: divisionApi,
  profesor: profesorApi,
  grupo: grupoApi,
  alumno: alumnoApi,
};