'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Pencil, Trash2, GraduationCap, Building2, AlertTriangle } from 'lucide-react';

const BASE_URL = "http://localhost:8081";

export default function DivisionesView() {
  const [divisiones, setDivisiones] = useState([]);
  const [modalAbierta, setModalAbierta] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [divisionAEliminar, setDivisionAEliminar] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [divisionActual, setDivisionActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    programasEducativos: [{ nombre: '' }]
  });

  // Cargar divisiones activas
  useEffect(() => {
    fetch(`${BASE_URL}/divisiones/activas`)
      .then(res => res.json())
      .then(data => setDivisiones(data))
      .catch(err => console.error("Error cargando divisiones:", err));
  }, []);

  const abrirModalAgregar = () => {
    setModoEdicion(false);
    setFormData({ nombre: '', descripcion: '', programasEducativos: [{ nombre: '' }] });
    setModalAbierta(true);
  };

  const abrirModalEditar = (division) => {
    setModoEdicion(true);
    setDivisionActual(division);
    setFormData({
      nombre: division.nombre,
      descripcion: division.descripcion || '',
      programasEducativos: division.programaEducativa?.map(p => ({ nombre: p })) || [{ nombre: '' }]
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

  const confirmarEliminacion = async () => {
    if (!divisionAEliminar) return;
    try {
      await fetch(`${BASE_URL}/divisiones/${divisionAEliminar.divisionId}`, {
        method: "DELETE"
      });
      setDivisiones(divisiones.filter(d => d.divisionId !== divisionAEliminar.divisionId));
      cerrarModalConfirmacion();
    } catch (error) {
      console.error("Error eliminando división:", error);
    }
  };

  // Agregar o quitar inputs de programas educativos
  const agregarPrograma = () => {
    setFormData(prev => ({
      ...prev,
      programasEducativos: [...prev.programasEducativos, { nombre: '' }]
    }));
  };

  const eliminarPrograma = (index) => {
    setFormData(prev => ({
      ...prev,
      programasEducativos: prev.programasEducativos.filter((_, i) => i !== index)
    }));
  };

  const handleProgramaChange = (index, value) => {
    setFormData(prev => {
      const nuevosProgramas = [...prev.programasEducativos];
      nuevosProgramas[index].nombre = value;
      return { ...prev, programasEducativos: nuevosProgramas };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      programasEducativos: formData.programasEducativos.filter(p => p.nombre.trim() !== '')
    };

    try {
      if (modoEdicion && divisionActual) {
        const res = await fetch(`${BASE_URL}/divisiones/${divisionActual.divisionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        setDivisiones(divisiones.map(d => d.divisionId === divisionActual.divisionId ? data : d));
      } else {
        const res = await fetch(`${BASE_URL}/divisiones`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        setDivisiones([...divisiones, data]);
      }
      cerrarModal();
    } catch (error) {
      console.error("Error guardando división:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
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
            <Plus className="w-5 h-5" /> Nueva División
          </button>
        </div>

        {/* Grid de Divisiones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {divisiones.map((division) => (
            <div key={division.divisionId} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{division.nombre}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{division.descripcion || ''}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 mb-4 bg-slate-50 rounded-lg p-3">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <span className="text-slate-700 font-medium">
                    {division.numeroProgramas} {division.numeroProgramas === 1 ? 'Carrera' : 'Carreras'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => abrirModalEditar(division)}
                    className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Pencil className="w-4 h-4" /> Editar
                  </button>
                  <button
                    onClick={() => abrirModalConfirmacion(division)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar
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
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No hay divisiones registradas</h3>
            <p className="text-slate-500 mb-6">Comienza agregando tu primera división escolar</p>
            <button
              onClick={abrirModalAgregar}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Agregar División
            </button>
          </div>
        )}
      </div>

      {/* Modal Agregar/Editar */}
      {modalAbierta && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">{modoEdicion ? 'Editar División' : 'Nueva División'}</h2>
              <button onClick={cerrarModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre de la División</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={e => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ej: División Industrial"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={e => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  rows="3"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Describe las características de esta división..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Programas Educativos</label>
                {formData.programasEducativos.map((p, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={p.nombre}
                      onChange={e => handleProgramaChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder={`Programa ${index + 1}`}
                      required
                    />
                    <button type="button" onClick={() => eliminarPrograma(index)} className="px-3 py-2 bg-red-100 text-red-600 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={agregarPrograma} className="mt-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Agregar Programa
                </button>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={cerrarModal} className="flex-1 px-6 py-3 border border-slate-300 rounded-xl">Cancelar</button>
                <button type="submit" className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"> {modoEdicion ? 'Actualizar' : 'Crear'} </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación */}
      {modalConfirmacion && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Confirmar Eliminación</h2>
              </div>
              <button onClick={cerrarModalConfirmacion} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-2">¿Estás seguro de que deseas eliminar la división:</p>
              <p className="text-slate-800 font-bold text-lg mb-4">{divisionAEliminar?.nombre}?</p>
              <p className="text-slate-500 text-sm">Esta acción no se puede deshacer.</p>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button type="button" onClick={cerrarModalConfirmacion} className="flex-1 px-6 py-3 border border-slate-300 rounded-xl">Cancelar</button>
              <button type="button" onClick={confirmarEliminacion} className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
