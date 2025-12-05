'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Cargar usuario desde localStorage al montar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }

    setLoading(false);
  }, []);

  /**
   * Login del usuario
   */
  const login = async (credentials) => {
    try {
      // TODO: Implementar llamada real al backend
      // Por ahora simulamos el login
      const mockUser = {
        id: 1,
        nombre: credentials.usuario,
        email: `${credentials.usuario}@universidad.edu`,
        rol: 'ADMIN',
        avatar: null,
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      // Guardar en localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('authToken', mockToken);

      setUser(mockUser);

      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  /**
   * Logout del usuario
   */
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/');
  };

  /**
   * Actualizar datos del usuario
   */
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  /**
   * Verificar si el usuario está autenticado
   */
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('authToken');
  };

  /**
   * Verificar si el usuario tiene un rol específico
   */
  const hasRole = (role) => {
    return user?.rol === role;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar el contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
}
