// pages/alumnos/index.tsx
"use client";

import { alumnoApi, grupoApi } from '@/lib/api';
import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';

interface Alumno {
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

interface Grupo {
  id: number;
  nombre: string;
  programaEducativoId: number;
  profesorId: number | null;
  activo: boolean;
}

type FilterActivos = 'all' | 'activos' | 'inactivos';

export default function AlumnosPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterActivos, setFilterActivos] = useState<FilterActivos>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [alumnosData, gruposData] = await Promise.all([
        alumnoApi.getAll(),
        grupoApi.getAll()
      ]);
      setAlumnos(alumnosData);
      setGrupos(gruposData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este alumno?')) {
      try {
        await alumnoApi.delete(id);
        fetchData();
      } catch (err) {
        alert('Error al eliminar: ' + (err instanceof Error ? err.message : 'Error desconocido'));
      }
    }
  };

  const handleToggleActivo = async (id: number) => {
    try {
      await alumnoApi.toggleActivo(id);
      fetchData();
    } catch (err) {
      alert('Error al cambiar estado: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
  };

  const getGrupoName = (grupoId: number | null): string => {
    if (!grupoId) return 'Sin grupo';
    const grupo = grupos.find(g => g.id === grupoId);
    return grupo ? grupo.nombre : 'Sin grupo';
  };

  // Filtrar alumnos
  const filteredAlumnos = alumnos.filter(alumno => {
    const matchesSearch = searchTerm === '' || 
      alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.matricula.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterActivos === 'all' ||
      (filterActivos === 'activos' && alumno.activo) ||
      (filterActivos === 'inactivos' && !alumno.activo);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando alumnos...</div>
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
              <h1 className="text-3xl font-bold text-gray-900">Alumnos</h1>
              <p className="mt-2 text-gray-600">
                Gestión de alumnos del sistema
              </p>
            </div>
            <Link
              href="/alumnos/crear"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              + Nuevo Alumno
            </Link>
          </div>

          {/* Búsqueda y Filtros */}
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o matrícula..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilterActivos('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterActivos === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterActivos('activos')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterActivos === 'activos'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => setFilterActivos('inactivos')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterActivos === 'inactivos'
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Inactivos
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Total de Alumnos</p>
              <p className="text-2xl font-bold text-gray-900">{alumnos.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Activos</p>
              <p className="text-2xl font-bold text-green-600">
                {alumnos.filter(a => a.activo).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Con Grupo Asignado</p>
              <p className="text-2xl font-bold text-blue-600">
                {alumnos.filter(a => a.grupoId).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Sin Grupo</p>
              <p className="text-2xl font-bold text-yellow-600">
                {alumnos.filter(a => !a.grupoId).length}
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabla de Alumnos */}
        {filteredAlumnos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No se encontraron alumnos' : 'No hay alumnos registrados'}
            </p>
            {!searchTerm && (
              <Link
                href="/alumnos/crear"
                className="mt-4 inline-block text-blue-600 hover:text-blue-700"
              >
                Crear el primer alumno
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alumno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matrícula
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Correo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grupo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAlumnos.map((alumno) => (
                    <tr key={alumno.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-medium">
                              {alumno.nombre.charAt(0)}{alumno.apellido.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {alumno.nombre} {alumno.apellido}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">{alumno.matricula}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{alumno.correo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          alumno.grupoId
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {getGrupoName(alumno.grupoId)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActivo(alumno.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                            alumno.activo
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {alumno.activo ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2 justify-end">
                          <Link
                            href={`/alumnos/${alumno.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Ver
                          </Link>
                          <Link
                            href={`/alumnos/${alumno.id}/editar`}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(alumno.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}