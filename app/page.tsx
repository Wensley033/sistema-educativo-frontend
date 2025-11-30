// app/page.tsx
'use client';

import { alumnoApi, divisionApi, grupoApi, profesorApi } from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  divisiones: number;
  profesores: number;
  grupos: number;
  alumnos: number;
  loading: boolean;
  error: string | null;
}

interface Module {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  count: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    divisiones: 0,
    profesores: 0,
    grupos: 0,
    alumnos: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [divisiones, profesores, grupos, alumnos] = await Promise.all([
        divisionApi.getAll().catch(() => []),
        profesorApi.getAll().catch(() => []),
        grupoApi.getAll().catch(() => []),
        alumnoApi.getAll().catch(() => [])
      ]);

      setStats({
        divisiones: divisiones.length,
        profesores: profesores.length,
        grupos: grupos.length,
        alumnos: alumnos.length,
        loading: false,
        error: null
      });
    } catch (err) {
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar estadísticas'
      }));
    }
  };

  const modules: Module[] = [
    {
      title: 'Divisiones',
      description: 'Gestiona divisiones y programas educativos',
      icon: '🏛️',
      href: '/divisiones',
      color: 'from-blue-500 to-blue-600',
      count: stats.divisiones
    },
    {
      title: 'Profesores',
      description: 'Administra el personal docente',
      icon: '👨‍🏫',
      href: '/profesores',
      color: 'from-green-500 to-green-600',
      count: stats.profesores
    },
    {
      title: 'Grupos',
      description: 'Organiza grupos académicos',
      icon: '👥',
      href: '/grupos',
      color: 'from-purple-500 to-purple-600',
      count: stats.grupos
    },
    {
      title: 'Alumnos',
      description: 'Gestiona estudiantes del sistema',
      icon: '🎓',
      href: '/alumnos',
      color: 'from-pink-500 to-pink-600',
      count: stats.alumnos
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              Sistema de Gestión Académica
            </h1>
            <p className="text-xl text-blue-100 mb-2">
              Universidad Tecnológica de Querétaro
            </p>
            <p className="text-blue-200">
              Gestión integral de divisiones, profesores, grupos y alumnos
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        {stats.loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Cargando estadísticas...</div>
          </div>
        ) : stats.error ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-8">
            {stats.error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {modules.map((module, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{module.icon}</div>
                  <div className={`bg-gradient-to-r ${module.color} text-white px-4 py-2 rounded-full font-bold text-lg`}>
                    {module.count}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {module.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {module.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map((module, index) => (
            <Link
              key={index}
              href={module.href}
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
            >
              <div className={`bg-gradient-to-r ${module.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {module.title}
                    </h3>
                    <p className="text-blue-100">
                      {module.description}
                    </p>
                  </div>
                  <div className="text-6xl opacity-50 group-hover:opacity-100 transition-opacity">
                    {module.icon}
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Total registrado: <span className="font-bold text-gray-900">{module.count}</span>
                  </span>
                  <span className="text-blue-600 group-hover:translate-x-2 transition-transform inline-block">
                    Ver todos →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Acciones Rápidas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/divisiones/crear"
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition group"
            >
              <span className="text-2xl">➕</span>
              <div>
                <p className="font-medium text-gray-900">Nueva División</p>
                <p className="text-sm text-gray-600">Crear división</p>
              </div>
            </Link>

            <Link
              href="/profesores/crear"
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition group"
            >
              <span className="text-2xl">➕</span>
              <div>
                <p className="font-medium text-gray-900">Nuevo Profesor</p>
                <p className="text-sm text-gray-600">Registrar profesor</p>
              </div>
            </Link>

            <Link
              href="/grupos/crear"
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition group"
            >
              <span className="text-2xl">➕</span>
              <div>
                <p className="font-medium text-gray-900">Nuevo Grupo</p>
                <p className="text-sm text-gray-600">Crear grupo</p>
              </div>
            </Link>

            <Link
              href="/alumnos/crear"
              className="flex items-center gap-3 p-4 bg-pink-50 hover:bg-pink-100 rounded-lg transition group"
            >
              <span className="text-2xl">➕</span>
              <div>
                <p className="font-medium text-gray-900">Nuevo Alumno</p>
                <p className="text-sm text-gray-600">Inscribir alumno</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            Sistema de Gestión Académica - UTEQ 2024
          </p>
          <p className="text-xs mt-2">
            Conectado a API Gateway en puerto 8080
          </p>
        </div>
      </div>
    </div>
  );
}