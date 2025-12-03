'use client';

import { useState } from 'react';
import { X, Plus, Pencil, Trash2, BookOpen, AlertTriangle, Search, Clock } from 'lucide-react';

export default function MateriasView() {
  const [materias, setMaterias] = useState([
    {
      id: 1,
      nombre: 'Cálculo Diferencial',
      codigo: 'MAT-101',
      carrera: 'Ingeniería Industrial',
      semestre: 1,
      creditos: 5,
      horasSemanales: 6,
      tipo: 'Obligatoria'
    },
    {
      id: 2,
      nombre: 'Programación Estructurada',
      codigo: 'ISC-201',
      carrera: 'Ingeniería en Sistemas',
      semestre: 2,
      creditos: 4,
      horasSemanales: 5,
      tipo: 'Obligatoria'
    },
    {
      id: 3,
      nombre: 'Contabilidad Financiera',
      codigo: 'ADM-301',
      carrera: 'Administración',
      semestre: 3,
      creditos: 4,
      horasSemanales: 4,
      tipo: 'Obligatoria'
    },
    {
      id: 4,
      nombre: 'Inglés Avanzado',
      codigo: 'ING-401',
      carrera: 'Todas',
      semestre: 4,
      creditos: 3,
      horasSemanales: 3,
      tipo: 'Optativa'
    },
    {
      id: 5,
      nombre: 'Base de Datos',
      codigo: 'ISC-301',
      carrera: 'Ingeniería en Sistemas',
      semestre: 3,
      creditos: 5,
      horasSemanales: 6,
      tipo: 'Obligatoria'
    }
  ]);

  const [modalAbierta, setModalAbierta] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [materiaAEliminar, setMateriaAEliminar] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [materiaActual, setMateriaActual] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    carrera: '',
    semestre: 1,
    creditos: 0,
    horasSemanales: 0,
    tipo: 'Obligatoria'
  });

  const abrirModalAgregar = () => {
    setModoEdicion(false);
    setFormData({
      nombre: '',
      codigo: '',
      carrera: '',
      semestre: 1,
      creditos: 0,
      horasSemanales: 0,
      tipo: 'Obligatoria'
    });
    setModalAbierta(true);
  };

  const abrirModalEditar = (materia) => {
    setModoEdicion(true);
    setMateriaActual(materia);
    setFormData({
      nombre: materia.nombre,
      codigo: materia.codigo,
      carrera: materia.carrera,
      semestre: materia.semestre,
      creditos: materia.creditos,
      horasSemanales: materia.horasSemanales,
      tipo: materia.tipo
    });
    setModalAbierta(true);
  };

  const cerrarModal = () => {
    setModalAbierta(false);
    setMateriaActual(null);
  };

  const abrirModalConfirmacion = (materia) => {
    setMateriaAEliminar(materia);
    setModalConfirmacion(true);
  };

  const cerrarModalConfirmacion = () => {
    setModalConfirmacion(false);
    setMateriaAEliminar(null);
  };

  const confirmarEliminacion = () => {
    if (materiaAEliminar) {
      setMaterias(materias.filter(mat => mat.id !== materiaAEliminar.id));
      cerrarModalConfirmacion();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modoEdicion && materiaActual) {
      setMaterias(materias.map(mat => 
        mat.id === materiaActual.id 
          ? { ...mat, ...formData }
          : mat
      ));
    } else {
      const nuevaMateria = {
        id: materias.length > 0 ? Math.max(...materias.map(m => m.id)) + 1 : 1,
        ...formData
      };
      setMaterias([...materias, nuevaMateria]);
    }
    
    cerrarModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['semestre', 'creditos', 'horasSemanales'].includes(name) 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const materiasFiltradas = materias.filter(materia => 
    materia.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    materia.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
    materia.carrera.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
                <BookOpen className="w-10 h-10 text-indigo-600" />
                Materias
              </h1>
              <p className="text-slate-600 mt-2">
                Administra el catálogo de materias de tu institución
              </p>
            </div>
            <button
              onClick={abrirModalAgregar}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Nueva Materia
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, código o carrera..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400 bg-white"
            />
          </div>
        </div>

        {/* Tabla de Materias */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Materia
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Código
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Carrera
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Semestre
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Créditos
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Horas/Sem
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {materiasFiltradas.map((materia) => (
                  <tr 
                    key={materia.id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <BookOpen className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="font-semibold text-slate-800">
                          {materia.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {materia.codigo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {materia.carrera}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                        {materia.semestre}°
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                        <span className="text-indigo-600 font-bold">{materia.creditos}</span>
                        créditos
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-slate-700">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {materia.horasSemanales}h
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        materia.tipo === 'Obligatoria' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {materia.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirModalEditar(materia)}
                          className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => abrirModalConfirmacion(materia)}
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
          {materiasFiltradas.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                {busqueda ? 'No se encontraron materias' : 'No hay materias registradas'}
              </h3>
              <p className="text-slate-500">
                {busqueda 
                  ? 'Intenta con otros términos de búsqueda' 
                  : 'Comienza agregando tu primera materia'
                }
              </p>
            </div>
          )}
        </div>

        {/* Contador de resultados */}
        {materias.length > 0 && (
          <div className="mt-4 text-sm text-slate-600">
            Mostrando {materiasFiltradas.length} de {materias.length} materias
          </div>
        )}
      </div>

      {/* Modal Agregar/Editar */}
      {modalAbierta && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-slate-800">
                {modoEdicion ? 'Editar Materia' : 'Nueva Materia'}
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
                {/* Nombre de la Materia */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre de la Materia
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="Ej: Cálculo Diferencial"
                    required
                  />
                </div>

                {/* Código */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Código
                  </label>
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400 font-mono"
                    placeholder="Ej: MAT-101"
                    required
                  />
                </div>

                {/* Carrera */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Carrera
                  </label>
                  <input
                    type="text"
                    name="carrera"
                    value={formData.carrera}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="Ej: Ingeniería Industrial"
                    required
                  />
                </div>

                {/* Semestre */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Semestre
                  </label>
                  <select
                    name="semestre"
                    value={formData.semestre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sem => (
                      <option key={sem} value={sem}>{sem}° Semestre</option>
                    ))}
                  </select>
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tipo de Materia
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900"
                    required
                  >
                    <option value="Obligatoria">Obligatoria</option>
                    <option value="Optativa">Optativa</option>
                  </select>
                </div>

                {/* Créditos */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Créditos
                  </label>
                  <input
                    type="number"
                    name="creditos"
                    value={formData.creditos}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="0"
                    required
                  />
                </div>

                {/* Horas Semanales */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Horas por Semana
                  </label>
                  <input
                    type="number"
                    name="horasSemanales"
                    value={formData.horasSemanales}
                    onChange={handleChange}
                    min="0"
                    max="20"
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
              <p className="text-slate-600 mb-2">
                ¿Estás seguro de que deseas eliminar la materia:
              </p>
              <p className="text-slate-800 font-bold text-lg mb-1">
                {materiaAEliminar?.nombre}
              </p>
              <p className="text-slate-600 text-sm mb-4">
                Código: <span className="font-mono font-semibold">{materiaAEliminar?.codigo}</span>
              </p>
              <p className="text-slate-500 text-sm">
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