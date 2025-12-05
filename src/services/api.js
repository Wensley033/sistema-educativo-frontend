/**
 * Servicio API Base
 * Configuración central para todas las llamadas HTTP al API Gateway
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';

/**
 * Obtiene el token de autenticación desde localStorage
 */
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

/**
 * Configuración base para fetch
 */
const getRequestConfig = (options = {}) => {
  const token = getAuthToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
};

/**
 * Maneja errores de respuesta HTTP
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    };

    try {
      const errorData = await response.json();
      error.message = errorData.message || errorData.error || 'Error en la petición';
      error.details = errorData;
    } catch {
      error.message = `Error ${response.status}: ${response.statusText}`;
    }

    throw error;
  }

  // Si la respuesta es 204 No Content, devolver null
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

/**
 * Métodos HTTP genéricos
 */
export const api = {
  /**
   * GET request
   */
  get: async (endpoint, options = {}) => {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      getRequestConfig({ ...options, method: 'GET' })
    );
    return handleResponse(response);
  },

  /**
   * POST request
   */
  post: async (endpoint, data, options = {}) => {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      getRequestConfig({
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
      })
    );
    return handleResponse(response);
  },

  /**
   * PUT request
   */
  put: async (endpoint, data, options = {}) => {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      getRequestConfig({
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
      })
    );
    return handleResponse(response);
  },

  /**
   * PATCH request
   */
  patch: async (endpoint, data, options = {}) => {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      getRequestConfig({
        ...options,
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    );
    return handleResponse(response);
  },

  /**
   * DELETE request
   */
  delete: async (endpoint, options = {}) => {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      getRequestConfig({ ...options, method: 'DELETE' })
    );
    return handleResponse(response);
  },
};

/**
 * Helper para construcción de query strings
 */
export const buildQueryString = (params) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};
