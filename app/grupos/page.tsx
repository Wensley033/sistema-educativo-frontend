'use client';

import { Grupo, grupoApi } from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function GruposPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'activos'>('all');

  useEffect(() => {
    fetchGrupos();
  }, [filter]);

  const fetchGrupos = async () => {
    try {
      setLoading(true);
      const data = filter === 'activos' 
        ? await grupoApi.getActive() 
        : await grupoApi.getAll();
      setGrupos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActivo = async (id: number) => {
    if (confirm('¿Estás seguro de cambiar el estado de este grupo?')) {
      try {
        await grupoApi.toggleActivo(id);
        fetchGrupos();
      } catch (err) {
        alert('Error al cambiar estado: ' + (err instanceof Error ? err.message : 'Error desconocido'));
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este grupo? (No se puede eliminar si tiene alumnos)')) {
      try {
        await grupoApi.delete(id);
        fetchGrupos();
      } catch (err) {
        alert('Error al eliminar: ' + (err instanceof Error ? err.message : 'Error desconocido'));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando grupos...</div>
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
              <h1 className="text-3xl font-bold text-gray-900">Grupos</h1>
              <p className="mt-2 text-gray-600">
                Gestión de grupos académicos
              </p>
            </div>
            <Link
              href="/grupos/crear"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              + Nuevo Grupo
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
              Todos ({grupos.length})
            </button>
            <button
              onClick={() => setFilter('activos')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'activos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Activos
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Lista de Grupos */}
        {grupos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No hay grupos registrados</p>
            <Link
              href="/grupos/crear"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              Crear el primer grupo
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {grupos.map((grupo) => (
              <div
                key={grupo.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Header de la tarjeta */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-white">
                      {grupo.nombre}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        grupo.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {grupo.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <p className="text-indigo-100 text-sm mt-2">
                    ID: {grupo.id}
                  </p>
                </div>

                {/* Contenido */}
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Programa Educativo</p>
                      <p className="text-sm font-medium text-gray-900">
                        ID: {grupo.programaEducativoId}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Profesor Asignado</p>
                      <p className="text-sm font-medium text-gray-900">
                        {grupo.profesorId ? `ID: ${grupo.profesorId}` : 'Sin profesor'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="px-6 py-4 bg-gray-50 flex flex-col gap-2">
                  <Link
                    href={`/grupos/${grupo.id}`}
                    className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Ver Detalles
                  </Link>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActivo(grupo.id)}
                      className="flex-1 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg text-sm font-medium transition"
                    >
                      {grupo.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => handleDelete(grupo.id)}
                      className="flex-1 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}