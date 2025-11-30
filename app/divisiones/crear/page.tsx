// app/divisiones/crear/page.tsx
"use client";

import { divisionApi } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';

interface Programa {
  nombre: string;
  activo: boolean;
}

interface FormData {
  nombre: string;
}

interface ProgramaEducativo {
  nombre: string;
  activo: boolean;
}

export default function CrearDivisionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
  });

  const [programas, setProgramas] = useState<Programa[]>([
    { nombre: '', activo: true }
  ]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProgramaChange = (index: number, field: keyof Programa, value: string | boolean) => {
    const newProgramas = [...programas];
    newProgramas[index][field] = value as never;
    setProgramas(newProgramas);
  };

  const addPrograma = () => {
    setProgramas([...programas, { nombre: '', activo: true }]);
  };

  const removePrograma = (index: number) => {
    if (programas.length > 1) {
      setProgramas(programas.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre de la división es obligatorio');
      return;
    }

    const programasValidos = programas.filter(p => p.nombre.trim() !== '');
    if (programasValidos.length === 0) {
      setError('Debes agregar al menos un programa educativo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        nombre: formData.nombre,
        programasEducativos: programasValidos.map((p): ProgramaEducativo => ({
          nombre: p.nombre,
          activo: p.activo
        }))
      };

      await divisionApi.create(dataToSend);
      router.push('/divisiones');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la división');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/divisiones"
            className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center"
          >
            ← Volver a divisiones
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Nueva División
          </h1>
          <p className="mt-2 text-gray-600">
            Crea una nueva división y sus programas educativos
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
          {/* Nombre de la División */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la División *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Ingeniería y Tecnología"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Programas Educativos */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Programas Educativos *
              </label>
              <button
                type="button"
                onClick={addPrograma}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Agregar Programa
              </button>
            </div>

            <div className="space-y-4">
              {programas.map((programa, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={programa.nombre}
                      onChange={(e) => handleProgramaChange(index, 'nombre', e.target.value)}
                      placeholder="Nombre del programa"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={programa.activo}
                      onChange={(e) => handleProgramaChange(index, 'activo', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Activo</span>
                  </label>

                  {programas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePrograma(index)}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              {loading ? 'Guardando...' : 'Crear División'}
            </button>
            <Link
              href="/divisiones"
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