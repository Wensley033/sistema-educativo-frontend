'use client';

import { useState } from 'react';
import { X, Plus, Pencil, Trash2, Calendar, AlertTriangle, Search, Clock, MapPin, BookOpen, Users } from 'lucide-react';

export default function ClasesView() {
  const [clases, setClases] = useState([
    {
      id: 1,
      grupo: 'A-101',
      materia: 'Cálculo Diferencial',
      profesor: 'Dr. Juan Pérez',
      salon: 'Lab-A 301',
      diaSemana: 'Lunes',
      horaInicio: '07:00',
      horaFin: '09:00'
    },
    {
      id: 2,
      grupo: 'B-205',
      materia: 'Programación Estructurada',
      profesor: 'Ing. María González',
      salon: 'Lab-Comp 102',
      diaSemana: 'Martes',
      horaInicio: '09:00',
      horaFin: '11:00'
    },
    {
      id: 3,
      grupo: 'A-101',
      materia: 'Química',
      profesor: 'Dra. Ana Martínez',
      salon: 'Lab-Q 205',
      diaSemana: 'Miércoles',
      horaInicio: '11:00',
      horaFin: '13:00'
    },
    {
      id: 4,
      grupo: 'C-301',
      materia: 'Contabilidad Financiera',
      profesor: 'Lic. Carlos Ramírez',
      salon: 'Aula 401',
      diaSemana: 'Jueves',
      horaInicio: '13:00',
      horaFin: '15:00'
    },
    {
      id: 5,
      grupo: 'B-205',
      materia: 'Base de Datos',
      profesor: 'Ing. Luis Torres',
      salon: 'Lab-Comp 103',
      diaSemana: 'Viernes',
      horaInicio: '15:00',
      horaFin: '17:00'
    }
  ]);

  const [modalAbierta, setModalAbierta] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [claseAEliminar, setClaseAEliminar] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [claseActual, setClaseActual] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({
    grupo: '',
    materia: '',
    profesor: '',
    salon: '',
    diaSemana: 'Lunes',
    horaInicio: '07:00',
    horaFin: '09:00'
  });

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const horariosDisponibles = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00'
  ];

  const abrirModalAgregar = () => {
    setModoEdicion(false);
    setFormData({
      grupo: '',
      materia: '',
      profesor: '',
      salon: '',
      diaSemana: 'Lunes',
      horaInicio: '07:00',
      horaFin: '09:00'
    });
    setModalAbierta(true);
  };

  const abrirModalEditar = (clase) => {
    setModoEdicion(true);
    setClaseActual(clase);
    setFormData({
      grupo: clase.grupo,
      materia: clase.materia,
      profesor: clase.profesor,
      salon: clase.salon,
      diaSemana: clase.diaSemana,
      horaInicio: clase.horaInicio,
      horaFin: clase.horaFin
    });
    setModalAbierta(true);
  };

  const cerrarModal = () => {
    setModalAbierta(false);
    setClaseActual(null);
  };

  const abrirModalConfirmacion = (clase) => {
    setClaseAEliminar(clase);
    setModalConfirmacion(true);
  };

  const cerrarModalConfirmacion = () => {
    setModalConfirmacion(false);
    setClaseAEliminar(null);
  };

  const confirmarEliminacion = () => {
    if (claseAEliminar) {
      setClases(clases.filter(cls => cls.id !== claseAEliminar.id));
      cerrarModalConfirmacion();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modoEdicion && claseActual) {
      setClases(clases.map(cls => 
        cls.id === claseActual.id 
          ? { ...cls, ...formData }
          : cls
      ));
    } else {
      const nuevaClase = {
        id: clases.length > 0 ? Math.max(...clases.map(c => c.id)) + 1 : 1,
        ...formData
      };
      setClases([...clases, nuevaClase]);
    }
    
    cerrarModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clasesFiltradas = clases.filter(clase => 
    clase.grupo.toLowerCase().includes(busqueda.toLowerCase()) ||
    clase.materia.toLowerCase().includes(busqueda.toLowerCase()) ||
    clase.profesor.toLowerCase().includes(busqueda.toLowerCase()) ||
    clase.salon.toLowerCase().includes(busqueda.toLowerCase())
  );

  const obtenerColorDia = (dia) => {
    const colores = {
      'Lunes': 'bg-blue-100 text-blue-700',
      'Martes': 'bg-green-100 text-green-700',
      'Miércoles': 'bg-purple-100 text-purple-700',
      'Jueves': 'bg-orange-100 text-orange-700',
      'Viernes': 'bg-pink-100 text-pink-700',
      'Sábado': 'bg-teal-100 text-teal-700'
    };
    return colores[dia] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
                <Calendar className="w-10 h-10 text-indigo-600" />
                Clases
              </h1>
              <p className="text-slate-600 mt-2">
                Administra los horarios y asignación de clases
              </p>
            </div>
            <button
              onClick={abrirModalAgregar}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Nueva Clase
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por grupo, materia, profesor o salón..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400 bg-white"
            />
          </div>
        </div>

        {/* Tabla de Clases */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Grupo
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Materia
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Profesor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Día
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Horario
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Salón
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {clasesFiltradas.map((clase) => (
                  <tr 
                    key={clase.id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <Users className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="font-semibold text-slate-800">
                          {clase.grupo}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700 font-medium">
                          {clase.materia}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {clase.profesor}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${obtenerColorDia(clase.diaSemana)}`}>
                        {clase.diaSemana}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700 font-medium">
                          {clase.horaInicio} - {clase.horaFin}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">
                          {clase.salon}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirModalEditar(clase)}
                          className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => abrirModalConfirmacion(clase)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {clasesFiltradas.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                {busqueda ? 'No se encontraron clases' : 'No hay clases registradas'}
              </h3>
              <p className="text-slate-500">
                {busqueda 
                  ? 'Intenta con otros términos de búsqueda' 
                  : 'Comienza agregando tu primera clase'
                }
              </p>
            </div>
          )}
        </div>

        {/* Contador de resultados */}
        {clases.length > 0 && (
          <div className="mt-4 text-sm text-slate-600">
            Mostrando {clasesFiltradas.length} de {clases.length} clases
          </div>
        )}
      </div>

      {/* Modal Agregar/Editar */}
      {modalAbierta && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-slate-800">
                {modoEdicion ? 'Editar Clase' : 'Nueva Clase'}
              </h2>
              <button
                onClick={cerrarModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Grupo */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Grupo
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      name="grupo"
                      value={formData.grupo}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="Ej: A-101"
                      required
                    />
                  </div>
                </div>

                {/* Materia */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Materia
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      name="materia"
                      value={formData.materia}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="Ej: Cálculo Diferencial"
                      required
                    />
                  </div>
                </div>

                {/* Profesor */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Profesor
                  </label>
                  <input
                    type="text"
                    name="profesor"
                    value={formData.profesor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="Ej: Dr. Juan Pérez"
                    required
                  />
                </div>

                {/* Día de la Semana */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Día de la Semana
                  </label>
                  <select
                    name="diaSemana"
                    value={formData.diaSemana}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900"
                    required
                  >
                    {diasSemana.map(dia => (
                      <option key={dia} value={dia}>{dia}</option>
                    ))}
                  </select>
                </div>

                {/* Salón */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Salón
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      name="salon"
                      value={formData.salon}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="Ej: Lab-A 301"
                      required
                    />
                  </div>
                </div>

                {/* Hora Inicio */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hora de Inicio
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select
                      name="horaInicio"
                      value={formData.horaInicio}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900"
                      required
                    >
                      {horariosDisponibles.map(hora => (
                        <option key={hora} value={hora}>{hora}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Hora Fin */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hora de Fin
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select
                      name="horaFin"
                      value={formData.horaFin}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900"
                      required
                    >
                      {horariosDisponibles.map(hora => (
                        <option key={hora} value={hora}>{hora}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-200"
                >
                  {modoEdicion ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      {modalConfirmacion && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Confirmar Eliminación
                </h2>
              </div>
              <button
                onClick={cerrarModalConfirmacion}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-3">
                ¿Estás seguro de que deseas eliminar esta clase?
              </p>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">
                    <span className="font-semibold">Grupo:</span> {claseAEliminar?.grupo}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">
                    <span className="font-semibold">Materia:</span> {claseAEliminar?.materia}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">
                    <span className="font-semibold">Horario:</span> {claseAEliminar?.diaSemana} {claseAEliminar?.horaInicio} - {claseAEliminar?.horaFin}
                  </span>
                </div>
              </div>
              <p className="text-slate-500 text-sm mt-4">
                Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                type="button"
                onClick={cerrarModalConfirmacion}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarEliminacion}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-red-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}