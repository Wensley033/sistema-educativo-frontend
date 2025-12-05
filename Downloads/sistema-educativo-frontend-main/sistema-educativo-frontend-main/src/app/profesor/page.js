'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';

const BASE_URL_PROFESORES = "http://localhost:8082";
const BASE_URL_DIVISIONES = "http://localhost:8081";

export default function ProfesoresView() {
  const [profesores, setProfesores] = useState([]);
  const [divisiones, setDivisiones] = useState([]);
  const [modalAbierta, setModalAbierta] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [profesorAEliminar, setProfesorAEliminar] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [profesorActual, setProfesorActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    divisionId: ''
  });

  // Cargar profesores
  useEffect(() => {
    fetch(`${BASE_URL_PROFESORES}/profesores`)
      .then(res => res.json())
      .then(data => setProfesores(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error cargando profesores:", err));
  }, []);

  // Cargar divisiones activas
  useEffect(() => {
    fetch(`${BASE_URL_DIVISIONES}/divisiones/activas`)
      .then(res => res.json())
      .then(data => {
        console.log('Divisiones cargadas:', data);
        console.log('Primera división:', data[0]);
        setDivisiones(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Error cargando divisiones:", err));
  }, []);

  const abrirModalAgregar = () => {
    setModoEdicion(false);
    setFormData({ nombre: '', apellido: '', correo: '', telefono: '', divisionId: '' });
    setModalAbierta(true);
  };

  const abrirModalEditar = (profesor) => {
    setModoEdicion(true);
    setProfesorActual(profesor);
    setFormData({
      nombre: profesor.nombre,
      apellido: profesor.apellido,
      correo: profesor.correo,
      telefono: profesor.telefono || '',
      divisionId: profesor.divisionId ? String(profesor.divisionId) : ''
    });
    setModalAbierta(true);
  };

  const cerrarModal = () => {
    setModalAbierta(false);
    setProfesorActual(null);
  };

  const abrirModalConfirmacion = (profesor) => {
    setProfesorAEliminar(profesor);
    setModalConfirmacion(true);
  };

  const cerrarModalConfirmacion = () => {
    setModalConfirmacion(false);
    setProfesorAEliminar(null);
  };

  const confirmarEliminacion = async () => {
    if (!profesorAEliminar) return;
    try {
      await fetch(`${BASE_URL_PROFESORES}/profesores/${profesorAEliminar.id}`, { method: "DELETE" });
      setProfesores(profesores.filter(p => p.id !== profesorAEliminar.id));
      cerrarModalConfirmacion();
    } catch (error) {
      console.error("Error eliminando profesor:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('handleChange - name:', name, 'value:', value, 'type:', typeof value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log('New formData:', newData);
      return newData;
    });
  };

  const handleSubmit = async () => {
    console.log('=== DEBUG SUBMIT ===');
    console.log('formData completo:', formData);
    console.log('divisionId value:', formData.divisionId);
    console.log('divisionId type:', typeof formData.divisionId);
    
    // Validación básica
    if (!formData.nombre || !formData.apellido || !formData.correo || !formData.divisionId) {
      alert('Por favor completa todos los campos obligatorios');
      console.log('Validación falló - campos faltantes');
      return;
    }
    
    // Preparar datos asegurando que divisionId sea un número válido
    const divisionIdNumber = parseInt(formData.divisionId, 10);
    console.log('divisionId convertido:', divisionIdNumber);
    console.log('divisionId es número válido:', !isNaN(divisionIdNumber));
    
    const dataToSend = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      correo: formData.correo,
      telefono: formData.telefono,
      divisionId: divisionIdNumber
    };

    console.log('Datos a enviar:', dataToSend);
    console.log('JSON stringificado:', JSON.stringify(dataToSend));

    try {
      if (modoEdicion && profesorActual) {
        console.log('Modo edición - PUT');
        const res = await fetch(`${BASE_URL_PROFESORES}/profesores/${profesorActual.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend)
        });
        console.log('Response status:', res.status);
        const data = await res.json();
        console.log('Response data:', data);
        setProfesores(profesores.map(p => p.id === profesorActual.id ? data : p));
      } else {
        console.log('Modo crear - POST');
        const res = await fetch(`${BASE_URL_PROFESORES}/profesores`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend)
        });
        console.log('Response status:', res.status);
        const responseText = await res.text();
        console.log('Response text:', responseText);
        
        if (res.ok) {
          const data = JSON.parse(responseText);
          setProfesores([...profesores, data]);
          cerrarModal();
        } else {
          alert('Error al crear profesor: ' + responseText);
        }
        return;
      }
      cerrarModal();
    } catch (error) {
      console.error("Error guardando profesor:", error);
      alert("Error al guardar el profesor. Verifica la consola para más detalles.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
            <Plus className="w-10 h-10 text-indigo-600" />
            Profesores
          </h1>
          <button onClick={abrirModalAgregar} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all duration-200 hover:scale-105">
            <Plus className="w-5 h-5" /> Nuevo Profesor
          </button>
        </div>

        {/* Grid de Profesores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(profesores) && profesores.map(prof => (
            <div key={prof.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{prof.nombre} {prof.apellido}</h3>
                <p className="text-slate-600 mb-1">Correo: {prof.correo}</p>
                <p className="text-slate-600 mb-1">Tel: {prof.telefono || 'N/A'}</p>
                <p className="text-slate-600 mb-4">
                  División: {divisiones.find(d => d.divisionId === prof.divisionId)?.nombre || 'N/A'}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => abrirModalEditar(prof)} className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    <Pencil className="w-4 h-4" /> Editar
                  </button>
                  <button onClick={() => abrirModalConfirmacion(prof)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!profesores || profesores.length === 0) && (
          <div className="text-center py-16">
            <Plus className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No hay profesores registrados</h3>
            <p className="text-slate-500 mb-6">Comienza agregando tu primer profesor</p>
            <button onClick={abrirModalAgregar} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2">
              <Plus className="w-5 h-5" /> Agregar Profesor
            </button>
          </div>
        )}
      </div>

      {/* Modal Agregar/Editar */}
      {modalAbierta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">{modoEdicion ? 'Editar Profesor' : 'Nuevo Profesor'}</h2>
              <button onClick={cerrarModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre *</label>
                <input 
                  type="text" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Apellido *</label>
                <input 
                  type="text" 
                  name="apellido" 
                  value={formData.apellido} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Correo *</label>
                <input 
                  type="email" 
                  name="correo" 
                  value={formData.correo} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Teléfono</label>
                <input 
                  type="text" 
                  name="telefono" 
                  value={formData.telefono} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">División *</label>
                <select 
                  name="divisionId" 
                  value={formData.divisionId} 
                  onChange={(e) => {
                    console.log('Select onChange triggered');
                    console.log('Selected value:', e.target.value);
                    console.log('Selected name:', e.target.name);
                    handleChange(e);
                  }}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white cursor-pointer"
                >
                  <option value="">-- Selecciona una división --</option>
                  {divisiones.map(d => (
                    <option key={d.divisionId} value={d.divisionId}>
                      {d.nombre}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Valor actual: {formData.divisionId || 'ninguno'} | Divisiones cargadas: {divisiones.length}
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={cerrarModal} 
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  onClick={handleSubmit} 
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación */}
      {modalConfirmacion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Confirmar Eliminación</h2>
              </div>
              <button onClick={cerrarModalConfirmacion} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-2">¿Estás seguro de que deseas eliminar al profesor:</p>
              <p className="text-slate-800 font-bold text-lg mb-4">{profesorAEliminar?.nombre} {profesorAEliminar?.apellido}?</p>
              <p className="text-slate-500 text-sm">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3 mt-6">
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
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}