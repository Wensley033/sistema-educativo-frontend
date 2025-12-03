'use client';

import { useState } from 'react';
import { X, Plus, Pencil, Trash2, Users, AlertTriangle, Search } from 'lucide-react';

export default function GruposPage() {
  const [grupos, setGrupos] = useState([
    {
      id: 1,
      nombre: 'A-101',
      carrera: 'Ingeniería Industrial',
      semestre: 1,
      turno: 'Matutino',
      totalAlumnos: 32,
      aula: 'Edificio A - 101'
    },
    {
      id: 2,
      nombre: 'B-205',
      carrera: 'Ingeniería en Sistemas',
      semestre: 3,
      turno: 'Vespertino',
      totalAlumnos: 28,
      aula: 'Edificio B - 205'
    },
    {
      id: 3,
      nombre: 'C-301',
      carrera: 'Administración',
      semestre: 5,
      turno: 'Matutino',
      totalAlumnos: 35,
      aula: 'Edificio C - 301'
    },
    {
      id: 4,
      nombre: 'A-102',
      carrera: 'Ingeniería Mecánica',
      semestre: 2,
      turno: 'Matutino',
      totalAlumnos: 30,
      aula: 'Edificio A - 102'
    }
  ]);

  const [modalAbierta, setModalAbierta] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [grupoAEliminar, setGrupoAEliminar] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [grupoActual, setGrupoActual] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    carrera: '',
    semestre: 1,
    turno: 'Matutino',
    totalAlumnos: 0,
    aula: ''
  });

  const abrirModalAgregar = () => {
    setModoEdicion(false);
    setFormData({
      nombre: '',
      carrera: '',
      semestre: 1,
      turno: 'Matutino',
      totalAlumnos: 0,
      aula: ''
    });
    setModalAbierta(true);
  };

  const abrirModalEditar = (grupo) => {
    setModoEdicion(true);
    setGrupoActual(grupo);
    setFormData({
      nombre: grupo.nombre,
      carrera: grupo.carrera,
      semestre: grupo.semestre,
      turno: grupo.turno,
      totalAlumnos: grupo.totalAlumnos,
      aula: grupo.aula
    });
    setModalAbierta(true);
  };

  const cerrarModal = () => {
    setModalAbierta(false);
    setGrupoActual(null);
  };

  const abrirModalConfirmacion = (grupo) => {
    setGrupoAEliminar(grupo);
    setModalConfirmacion(true);
  };

  const cerrarModalConfirmacion = () => {
    setModalConfirmacion(false);
    setGrupoAEliminar(null);
  };

  const confirmarEliminacion = () => {
    if (grupoAEliminar) {
      setGrupos(grupos.filter(grp => grp.id !== grupoAEliminar.id));
      cerrarModalConfirmacion();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modoEdicion && grupoActual) {
      setGrupos(grupos.map(grp => 
        grp.id === grupoActual.id 
          ? { ...grp, ...formData }
          : grp
      ));
    } else {
      const nuevoGrupo = {
        id: grupos.length > 0 ? Math.max(...grupos.map(g => g.id)) + 1 : 1,
        ...formData
      };
      setGrupos([...grupos, nuevoGrupo]);
    }
    
    cerrarModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['semestre', 'totalAlumnos'].includes(name) ? parseInt(value) || 0 : value
    }));
  };

  const gruposFiltrados = grupos.filter(grupo => 
    grupo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    grupo.carrera.toLowerCase().includes(busqueda.toLowerCase()) ||
    grupo.aula.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
                <Users className="w-10 h-10 text-indigo-600" />
                Grupos
              </h1>
              <p className="text-slate-600 mt-2">
                Administra los grupos escolares de tu institución
              </p>
            </div>
            <button
              onClick={abrirModalAgregar}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Nuevo Grupo
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, carrera o aula..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400 bg-white"
            />
          </div>
        </div>

        {/* Tabla de Grupos */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Grupo
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Carrera
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Semestre
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Turno
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Alumnos
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Aula
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {gruposFiltrados.map((grupo) => (
                  <tr 
                    key={grupo.id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <Users className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="font-semibold text-slate-800">
                          {grupo.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {grupo.carrera}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                        {grupo.semestre}° Semestre
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        grupo.turno === 'Matutino' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {grupo.turno}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {grupo.totalAlumnos}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {grupo.aula}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirModalEditar(grupo)}
                          className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => abrirModalConfirmacion(grupo)}
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
          {gruposFiltrados.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                {busqueda ? 'No se encontraron grupos' : 'No hay grupos registrados'}
              </h3>
              <p className="text-slate-500">
                {busqueda 
                  ? 'Intenta con otros términos de búsqueda' 
                  : 'Comienza agregando tu primer grupo'
                }
              </p>
            </div>
          )}
        </div>

        {/* Contador de resultados */}
        {grupos.length > 0 && (
          <div className="mt-4 text-sm text-slate-600">
            Mostrando {gruposFiltrados.length} de {grupos.length} grupos
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
                {modoEdicion ? 'Editar Grupo' : 'Nuevo Grupo'}
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
                {/* Nombre del Grupo */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre del Grupo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="Ej: A-101"
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

                {/* Turno */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Turno
                  </label>
                  <select
                    name="turno"
                    value={formData.turno}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900"
                    required
                  >
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Nocturno">Nocturno</option>
                  </select>
                </div>

                {/* Total de Alumnos */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Total de Alumnos
                  </label>
                  <input
                    type="number"
                    name="totalAlumnos"
                    value={formData.totalAlumnos}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="0"
                    required
                  />
                </div>

                {/* Aula */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Aula
                  </label>
                  <input
                    type="text"
                    name="aula"
                    value={formData.aula}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="Ej: Edificio A - 101"
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
                ¿Estás seguro de que deseas eliminar el grupo:
              </p>
              <p className="text-slate-800 font-bold text-lg mb-4">
                {grupoAEliminar?.nombre}?
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