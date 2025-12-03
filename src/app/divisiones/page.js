'use client';

import { useState } from 'react';
import { X, Plus, Pencil, Trash2, GraduationCap, Building2, AlertTriangle } from 'lucide-react';

export default function DivisionesView() {
  const [divisiones, setDivisiones] = useState([
    {
      id: 1,
      nombre: 'División Industrial',
      descripcion: 'Carreras enfocadas en ingeniería y manufactura',
      totalCarreras: 5
    },
    {
      id: 2,
      nombre: 'División Administrativa',
      descripcion: 'Programas de administración y negocios',
      totalCarreras: 3
    },
    {
      id: 3,
      nombre: 'División de Tecnologías',
      descripcion: 'Carreras tecnológicas y computacionales',
      totalCarreras: 4
    }
  ]);

  const [modalAbierta, setModalAbierta] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [divisionAEliminar, setDivisionAEliminar] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [divisionActual, setDivisionActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    totalCarreras: 0
  });

  const abrirModalAgregar = () => {
    setModoEdicion(false);
    setFormData({
      nombre: '',
      descripcion: '',
      totalCarreras: 0
    });
    setModalAbierta(true);
  };

  const abrirModalEditar = (division) => {
    setModoEdicion(true);
    setDivisionActual(division);
    setFormData({
      nombre: division.nombre,
      descripcion: division.descripcion,
      totalCarreras: division.totalCarreras
    });
    setModalAbierta(true);
  };

  const cerrarModal = () => {
    setModalAbierta(false);
    setDivisionActual(null);
  };

  const abrirModalConfirmacion = (division) => {
    setDivisionAEliminar(division);
    setModalConfirmacion(true);
  };

  const cerrarModalConfirmacion = () => {
    setModalConfirmacion(false);
    setDivisionAEliminar(null);
  };

  const confirmarEliminacion = () => {
    if (divisionAEliminar) {
      setDivisiones(divisiones.filter(div => div.id !== divisionAEliminar.id));
      cerrarModalConfirmacion();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modoEdicion && divisionActual) {
      setDivisiones(divisiones.map(div => 
        div.id === divisionActual.id 
          ? { ...div, ...formData }
          : div
      ));
    } else {
      const nuevaDivision = {
        id: divisiones.length > 0 ? Math.max(...divisiones.map(d => d.id)) + 1 : 1,
        ...formData
      };
      setDivisiones([...divisiones, nuevaDivision]);
    }
    
    cerrarModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalCarreras' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
                <Building2 className="w-10 h-10 text-indigo-600" />
                Divisiones Escolares
              </h1>
              <p className="text-slate-600 mt-2">
                Gestiona las divisiones académicas de tu institución
              </p>
            </div>
            <button
              onClick={abrirModalAgregar}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Nueva División
            </button>
          </div>
        </div>

        {/* Grid de Divisiones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {divisiones.map((division) => (
            <div
              key={division.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
            >
              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      {division.nombre}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {division.descripcion}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 mb-4 bg-slate-50 rounded-lg p-3">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <span className="text-slate-700 font-medium">
                    {division.totalCarreras} {division.totalCarreras === 1 ? 'Carrera' : 'Carreras'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => abrirModalEditar(division)}
                    className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => abrirModalConfirmacion(division)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {divisiones.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              No hay divisiones registradas
            </h3>
            <p className="text-slate-500 mb-6">
              Comienza agregando tu primera división escolar
            </p>
            <button
              onClick={abrirModalAgregar}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Agregar División
            </button>
          </div>
        )}
      </div>

      {/* Modal Agregar/Editar con backdrop blur */}
      {modalAbierta && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">
                {modoEdicion ? 'Editar División' : 'Nueva División'}
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
              <div className="space-y-5">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre de la División
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="Ej: División Industrial"
                    required
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-slate-900 placeholder:text-slate-400"
                    placeholder="Describe las características de esta división..."
                    required
                  />
                </div>

                {/* Total Carreras */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Número de Carreras
                  </label>
                  <input
                    type="number"
                    name="totalCarreras"
                    value={formData.totalCarreras}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="0"
                    required
                  />
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

      {/* Modal de Confirmación con backdrop blur */}
      {modalConfirmacion && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
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

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-slate-600 mb-2">
                ¿Estás seguro de que deseas eliminar la división:
              </p>
              <p className="text-slate-800 font-bold text-lg mb-4">
                {divisionAEliminar?.nombre}?
              </p>
              <p className="text-slate-500 text-sm">
                Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Modal Footer */}
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