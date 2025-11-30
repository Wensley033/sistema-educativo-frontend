// pages/profesores/crear.tsx
"use client";
import { divisionApi, profesorApi } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

interface Division {
  divisionId: number;
  nombre: string;
}

interface FormData {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  divisionId: string;
}

interface DataToSend {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  divisionId: number | null;
}

export default function CrearProfesorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDivisiones, setLoadingDivisiones] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [divisiones, setDivisiones] = useState<Division[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    divisionId: ''
  });

  useEffect(() => {
    fetchDivisiones();
  }, []);

  const fetchDivisiones = async () => {
    try {
      const data = await divisionApi.getActive();
      setDivisiones(data);
    } catch (err) {
      setError('Error al cargar divisiones: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setLoadingDivisiones(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.correo.trim()) {
      setError('Nombre, apellido y correo son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dataToSend: DataToSend = {
        ...formData,
        divisionId: formData.divisionId ? parseInt(formData.divisionId) : null
      };

      await profesorApi.create(dataToSend);
      router.push('/profesores');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el profesor');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profesores"
            className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center"
          >
            ← Volver a profesores
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Nuevo Profesor
          </h1>
          <p className="mt-2 text-gray-600">
            Registra un nuevo profesor en el sistema
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Juan Carlos"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido *
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                placeholder="Martínez López"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                placeholder="juan.martinez@uteq.edu.mx"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="4421234567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* División */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                División
              </label>
              {loadingDivisiones ? (
                <p className="text-gray-500">Cargando divisiones...</p>
              ) : (
                <select
                  name="divisionId"
                  value={formData.divisionId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sin división asignada</option>
                  {divisiones.map((division) => (
                    <option key={division.divisionId} value={division.divisionId}>
                      {division.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-6 border-t mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              {loading ? 'Guardando...' : 'Crear Profesor'}
            </button>
            <Link
              href="/profesores"
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}