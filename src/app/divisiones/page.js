'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Pencil, Trash2, Building2, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react';
import { divisionService } from '@/services/divisionService';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';

export default function DivisionesView() {
  const [divisiones, setDivisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierta, setModalAbierta] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [divisionAEliminar, setDivisionAEliminar] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [divisionActual, setDivisionActual] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activo: true
  });

  // Cargar divisiones al montar
  useEffect(() => {
    cargarDivisiones();
  }, []);

  const cargarDivisiones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await divisionService.getAllDivisiones();
      setDivisiones(data);
    } catch (err) {
      console.error('Error al cargar divisiones:', err);
      setError(err);
      toast.error('Error al cargar divisiones', {
        description: err.message || 'No se pudieron cargar las divisiones'
      });
    } finally {
      setLoading(false);
    }
  };

  const abrirModalAgregar = () => {
    setModoEdicion(false);
    setFormData({
      nombre: '',
      descripcion: '',
      activo: true
    });
    setModalAbierta(true);
  };

  const abrirModalEditar = (division) => {
    setModoEdicion(true);
    setDivisionActual(division);
    setFormData({
      nombre: division.nombre,
      descripcion: division.descripcion || '',
      activo: division.activo ?? true
    });
    setModalAbierta(true);
  };

  const cerrarModal = () => {
    setModalAbierta(false);
    setDivisionActual(null);
    setSubmitting(false);
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
      await divisionService.deleteDivision(divisionAEliminar.id);
      toast.success('División eliminada', {
        description: `${divisionAEliminar.nombre} ha sido eliminada correctamente`
      });
      await cargarDivisiones();
      cerrarModalConfirmacion();
    } catch (err) {
      console.error('Error al eliminar división:', err);
      toast.error('Error al eliminar', {
        description: err.message || 'No se pudo eliminar la división'
      });
    }
  };

  const toggleEstado = async (division) => {
    try {
      await divisionService.toggleDivisionEstado(division.id);
      toast.success('Estado actualizado', {
        description: `${division.nombre} ahora está ${!division.activo ? 'activa' : 'inactiva'}`
      });
      await cargarDivisiones();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      toast.error('Error al cambiar estado', {
        description: err.message || 'No se pudo actualizar el estado'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (modoEdicion && divisionActual) {
        await divisionService.updateDivision(divisionActual.id, formData);
        toast.success('División actualizada', {
          description: 'Los cambios se guardaron correctamente'
        });
      } else {
        await divisionService.createDivision(formData);
        toast.success('División creada', {
          description: 'La división se creó correctamente'
        });
      }

      await cargarDivisiones();
      cerrarModal();
    } catch (err) {
      console.error('Error al guardar división:', err);
      toast.error('Error al guardar', {
        description: err.message || 'No se pudo guardar la división'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <LoadingSpinner size="lg" text="Cargando divisiones..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <ErrorState
          title="Error al cargar divisiones"
          description={error.message || 'Ocurrió un error al cargar las divisiones'}
          onRetry={cargarDivisiones}
        />
      </div>
    );
  }

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
        {divisiones.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {divisiones.map((division) => (
              <div
                key={division.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 ${
                  !division.activo ? 'opacity-60' : ''
                }`}
              >
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-slate-800">
                          {division.nombre}
                        </h3>
                        {!division.activo && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                            Inactiva
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {division.descripcion || 'Sin descripción'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => abrirModalEditar(division)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors text-sm"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    <button
                      onClick={() => toggleEstado(division)}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-600 py-2 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors text-sm"
                      title={division.activo ? 'Desactivar' : 'Activar'}
                    >
                      {division.activo ? (
                        <ToggleRight className="w-4 h-4" />
                      ) : (
                        <ToggleLeft className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => abrirModalConfirmacion(division)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors text-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="No hay divisiones registradas"
            description="Comienza agregando tu primera división escolar"
            action={
              <button
                onClick={abrirModalAgregar}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Agregar División
              </button>
            }
          />
        )}
      </div>

      {/* Modal Agregar/Editar */}
      {modalAbierta && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">
                {modoEdicion ? 'Editar División' : 'Nueva División'}
              </h2>
              <button
                onClick={cerrarModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                disabled={submitting}
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
                    Nombre de la División *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="Ej: División Industrial"
                    required
                    disabled={submitting}
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
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    modoEdicion ? 'Actualizar' : 'Crear'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      {modalConfirmacion && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
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
