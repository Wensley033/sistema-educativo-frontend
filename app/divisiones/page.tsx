'use client';

import { Division, divisionApi } from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DivisionesPage() {
  const [divisiones, setDivisiones] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'activas'>('all');

  useEffect(() => {
    fetchDivisiones();
  }, [filter]);

  const fetchDivisiones = async () => {
    try {
      setLoading(true);
      const data = filter === 'activas' 
        ? await divisionApi.getActive() 
        : await divisionApi.getAll();
      setDivisiones(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    if (confirm('¿Estás seguro de cambiar el estado de esta división?')) {
      try {
        await divisionApi.toggleStatus(id);
        fetchDivisiones();
      } catch (err) {
        alert('Error al cambiar estado: ' + (err instanceof Error ? err.message : 'Error desconocido'));
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta división?')) {
      try {
        await divisionApi.delete(id);
        fetchDivisiones();
      } catch (err) {
        alert('Error al eliminar: ' + (err instanceof Error ? err.message : 'Error desconocido'));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando divisiones...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Divisiones</h1>
              <p className="mt-2 text-gray-600">
                Gestión de divisiones y programas educativos
              </p>
            </div>
            <Link
              href="/divisiones/crear"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              + Nueva División
            </Link>
          </div>

          {/* Filtros */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Todas ({divisiones.length})
            </button>
            <button
              onClick={() => setFilter('activas')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'activas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Activas
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Lista de Divisiones */}
        {divisiones.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No hay divisiones registradas</p>
            <Link
              href="/divisiones/crear"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              Crear la primera división
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {divisiones.map((division) => (
              <div
                key={division.divisionId}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Header de la tarjeta */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white">
                      {division.nombre}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        division.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {division.activo ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="px-6 py-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Programas Educativos:</p>
                    {division.programaEducativa && division.programaEducativa.length > 0 ? (
                      <ul className="space-y-1">
                        {division.programaEducativa.map((programa, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-700 flex items-start"
                          >
                            <span className="text-blue-600 mr-2">•</span>
                            {programa}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">Sin programas</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm font-medium text-gray-600">
                      {division.numeroProgramas} programa(s)
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="px-6 py-4 bg-gray-50 flex gap-2">
                  <Link
                    href={`/divisiones/${division.divisionId}`}
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Ver Detalles
                  </Link>
                  <button
                    onClick={() => handleToggleStatus(division.divisionId)}
                    className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg text-sm font-medium transition"
                  >
                    {division.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => handleDelete(division.divisionId)}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}