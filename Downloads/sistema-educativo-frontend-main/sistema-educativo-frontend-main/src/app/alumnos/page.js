'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';

const BASE_URL_ALUMNOS = "http://localhost:8083";
const BASE_URL_GRUPOS = "http://localhost:8083";
const BASE_URL_PROGRAMAS = "http://localhost:8081/programas-educativos/activos"; // Corregido: programas-educativos

export default function AlumnosView() {
  const [alumnos, setAlumnos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [modalAbierta, setModalAbierta] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [alumnoAEliminar, setAlumnoAEliminar] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [alumnoActual, setAlumnoActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    matricula: '',
    correo: '',
    telefono: '',
    grupoId: '',
    programaEducativoId: ''
  });

  // Cargar alumnos activos
  useEffect(() => {
    fetch(`${BASE_URL_ALUMNOS}/alumnos/activos`)
      .then(res => res.json())
      .then(data => setAlumnos(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error cargando alumnos:", err));
  }, []);

  // Cargar grupos activos
  useEffect(() => {
    fetch(`${BASE_URL_GRUPOS}/grupos/activos`)
      .then(res => res.json())
      .then(data => setGrupos(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error cargando grupos:", err));
  }, []);

  // Cargar programas educativos
  useEffect(() => {
    fetch(BASE_URL_PROGRAMAS)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Programas cargados:", data);
        setProgramas(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Error cargando programas educativos:", err));
  }, []);

  const abrirModalAgregar = () => {
    setModoEdicion(false);
    setFormData({
      nombre: '',
      apellido: '',
      matricula: '',
      correo: '',
      telefono: '',
      grupoId: '',
      programaEducativoId: ''
    });
    setModalAbierta(true);
  };

  const abrirModalEditar = (alumno) => {
    setModoEdicion(true);
    setAlumnoActual(alumno);
    setFormData({
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      matricula: alumno.matricula,
      correo: alumno.correo,
      telefono: alumno.telefono || '',
      grupoId: alumno.grupoId ? String(alumno.grupoId) : '',
      programaEducativoId: alumno.programaEducativoId ? String(alumno.programaEducativoId) : ''
    });
    setModalAbierta(true);
  };

  const cerrarModal = () => {
    setModalAbierta(false);
    setAlumnoActual(null);
  };

  const abrirModalConfirmacion = (alumno) => {
    setAlumnoAEliminar(alumno);
    setModalConfirmacion(true);
  };

  const cerrarModalConfirmacion = () => {
    setModalConfirmacion(false);
    setAlumnoAEliminar(null);
  };

  const confirmarEliminacion = async () => {
    if (!alumnoAEliminar) return;
    try {
      await fetch(`${BASE_URL_ALUMNOS}/alumnos/${alumnoAEliminar.id}`, { method: "DELETE" });
      setAlumnos(alumnos.filter(a => a.id !== alumnoAEliminar.id));
      cerrarModalConfirmacion();
    } catch (error) {
      console.error("Error eliminando alumno:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.apellido || !formData.matricula || !formData.correo || !formData.grupoId || !formData.programaEducativoId) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const grupoIdNumber = parseInt(formData.grupoId, 10);
    const programaEducativoIdNumber = parseInt(formData.programaEducativoId, 10);

    const dataToSend = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      matricula: formData.matricula,
      correo: formData.correo,
      telefono: formData.telefono,
      grupoId: grupoIdNumber,
      programaEducativoId: programaEducativoIdNumber
    };

    try {
      if (modoEdicion && alumnoActual) {
        const res = await fetch(`${BASE_URL_ALUMNOS}/alumnos/${alumnoActual.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend)
        });
        const data = await res.json();
        setAlumnos(alumnos.map(a => a.id === alumnoActual.id ? data : a));
      } else {
        const res = await fetch(`${BASE_URL_ALUMNOS}/alumnos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend)
        });
        if (res.ok) {
          const data = await res.json();
          setAlumnos([...alumnos, data]);
          cerrarModal();
        } else {
          const text = await res.text();
          alert('Error al crear alumno: ' + text);
        }
        return;
      }
      cerrarModal();
    } catch (error) {
      console.error("Error guardando alumno:", error);
      alert("Error al guardar el alumno. Verifica la consola para más detalles.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
            <Plus className="w-10 h-10 text-indigo-600" /> Alumnos
          </h1>
          <button onClick={abrirModalAgregar} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all duration-200 hover:scale-105">
            <Plus className="w-5 h-5" /> Nuevo Alumno
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumnos.map(alumno => (
            <div key={alumno.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{alumno.nombre} {alumno.apellido}</h3>
                <p className="text-slate-600 mb-1">Matrícula: {alumno.matricula}</p>
                <p className="text-slate-600 mb-1">Correo: {alumno.correo}</p>
                <p className="text-slate-600 mb-1">Tel: {alumno.telefono || 'N/A'}</p>
                <p className="text-slate-600 mb-1">
                  Programa: {programas.find(p => p.id === alumno.programaEducativoId)?.nombre || 'Sin asignar'}
                </p>
                <p className="text-slate-600 mb-4">
                  Grupo: {grupos.find(g => g.id === alumno.grupoId)?.nombre || 'Sin asignar'}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => abrirModalEditar(alumno)} className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    <Pencil className="w-4 h-4" /> Editar
                  </button>
                  <button onClick={() => abrirModalConfirmacion(alumno)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!alumnos || alumnos.length === 0) && (
          <div className="text-center py-16">
            <Plus className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No hay alumnos registrados</h3>
            <p className="text-slate-500 mb-6">Comienza agregando tu primer alumno</p>
            <button onClick={abrirModalAgregar} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2">
              <Plus className="w-5 h-5" /> Agregar Alumno
            </button>
          </div>
        )}
      </div>

      {/* Modal Agregar/Editar */}
      {modalAbierta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">{modoEdicion ? 'Editar Alumno' : 'Nuevo Alumno'}</h2>
              <button onClick={cerrarModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre *</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Apellido *</label>
                <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Matrícula *</label>
                <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Correo *</label>
                <input type="email" name="correo" value={formData.correo} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Teléfono</label>
                <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Programa Educativo *</label>
                <select name="programaEducativoId" value={formData.programaEducativoId} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white cursor-pointer">
                  <option value="">-- Selecciona un programa --</option>
                  {programas.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Grupo *</label>
                <select name="grupoId" value={formData.grupoId} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white cursor-pointer">
                  <option value="">-- Selecciona un grupo --</option>
                  {grupos.map(g => (
                    <option key={g.id} value={g.id}>{g.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={cerrarModal} className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">Cancelar</button>
                <button type="button" onClick={handleSubmit} className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg transition-colors">{modoEdicion ? 'Actualizar' : 'Crear'}</button>
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
                <div className="bg-red-100 p-2 rounded-lg"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
                <h2 className="text-2xl font-bold text-slate-800">Confirmar Eliminación</h2>
              </div>
              <button onClick={cerrarModalConfirmacion} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-2">¿Estás seguro de que deseas eliminar al alumno:</p>
              <p className="text-slate-800 font-bold text-lg mb-4">{alumnoAEliminar?.nombre} {alumnoAEliminar?.apellido}?</p>
              <p className="text-slate-500 text-sm">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={cerrarModalConfirmacion} className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">Cancelar</button>
                <button type="button" onClick={confirmarEliminacion} className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg transition-colors">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}