// app/profesores/page.tsx
"use client";

import { divisionApi, profesorApi } from '@/lib/api';
import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';

interface Profesor {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string | null;
  divisionId: number | null;
}

interface Division {
  divisionId: number;
  nombre: string;
}

export default function ProfesoresPage() {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [divisiones, setDivisiones] = useState<Division[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profesoresData, divisionesData] = await Promise.all([
        profesorApi.getAll(),
        divisionApi.getAll()
      ]);
      setProfesores(profesoresData);
      setDivisiones(divisionesData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este profesor?')) {
      try {
        await profesorApi.delete(id);
        fetchData();
      } catch (err) {
        alert('Error al eliminar: ' + (err instanceof Error ? err.message : 'Error desconocido'));
      }
    }
  };

  const getDivisionName = (divisionId: number | null): string => {
    if (!divisionId) return 'Sin división';
    const division = divisiones.find(d => d.divisionId === divisionId);
    return division ? division.nombre : 'Sin división';
  };

  // Filtrar profesores
  const filteredProfesores = profesores.filter(profesor => {
    const searchLower = searchTerm.toLowerCase();
    return (
      profesor.nombre.toLowerCase().includes(searchLower) ||
      profesor.apellido.toLowerCase().includes(searchLower) ||
      profesor.correo.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando profesores...</div>
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
              <h1 className="text-3xl font-bold text-gray-900">Profesores</h1>
              <p className="mt-2 text-gray-600">
                Gestión de profesores del sistema
              </p>
            </div>
            <Link
              href="/profesores/crear"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              + Nuevo Profesor
            </Link>
          </div>

          {/* Búsqueda */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o correo..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Total de Profesores</p>
              <p className="text-2xl font-bold text-gray-900">{profesores.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Con División Asignada</p>
              <p className="text-2xl font-bold text-blue-600">
                {profesores.filter(p => p.divisionId).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Sin División</p>
              <p className="text-2xl font-bold text-yellow-600">
                {profesores.filter(p => !p.divisionId).length}
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

        {/* Tabla de Profesores */}
        {filteredProfesores.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No se encontraron profesores' : 'No hay profesores registrados'}
            </p>
            {!searchTerm && (
              <Link
                href="/profesores/crear"
                className="mt-4 inline-block text-blue-600 hover:text-blue-700"
              >
                Crear el primer profesor
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    División
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProfesores.map((profesor) => (
                  <tr key={profesor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {profesor.nombre.charAt(0)}{profesor.apellido.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {profesor.nombre} {profesor.apellido}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{profesor.correo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{profesor.telefono || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        profesor.divisionId
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getDivisionName(profesor.divisionId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        <Link
                          href={`/profesores/${profesor.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ver
                        </Link>
                        <Link
                          href={`/profesores/${profesor.id}/editar`}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(profesor.id)}
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
        )}
      </div>
    </div>
  );
}