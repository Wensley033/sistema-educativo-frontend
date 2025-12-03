'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Settings, Building2, LogOut, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar({ onMenuClick }) {
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAbierto(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVerPerfil = () => {
    setDropdownAbierto(false);
    router.push('/perfil');
  };

  const handleConfiguracion = () => {
    setDropdownAbierto(false);
    router.push('/configuracion');
  };

  const handleCambiarEmpresa = () => {
    setDropdownAbierto(false);
    // Aquí iría la lógica para cambiar de empresa
  };

  const handleCerrarSesion = () => {
    setDropdownAbierto(false);
    // Aquí iría la lógica para cerrar sesión
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">Sistema de Asistencias</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Dropdown de perfil */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownAbierto(!dropdownAbierto)}
                className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg transition-colors p-2"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">José Coca</p>
                  <p className="text-xs text-gray-500">Alumno</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  <span className="text-sm font-semibold text-white">JC</span>
                </div>
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform hidden sm:block ${dropdownAbierto ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownAbierto && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={handleVerPerfil}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                  >
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Perfil</span>
                  </button>
                  
                  <button
                    onClick={handleConfiguracion}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                  >
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Configuración</span>
                  </button>

                  <div className="border-t border-gray-200 my-2"></div>

                  <button
                    onClick={handleCerrarSesion}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}