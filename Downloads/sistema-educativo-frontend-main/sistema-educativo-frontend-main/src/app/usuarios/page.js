'use client';

import { useState } from 'react';
import { X, Plus, Pencil, Trash2, UserCircle, AlertTriangle, Search, Mail, Shield, Ban, CheckCircle } from 'lucide-react';

export default function UsuariosView() {
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      matricula: "A001234",
      nombre: "Juan Pérez García",
      email: "juan.perez@escuela.com",
      rol: "Alumno",
      estado: "Activo",
    },
    {
      id: 2,
      matricula: "P002345",
      nombre: "María González López",
      email: "maria.gonzalez@escuela.com",
      rol: "Profesor",
      estado: "Activo",
    },
    {
      id: 3,
      matricula: "A003456",
      nombre: "Carlos Ramírez Torres",
      email: "carlos.ramirez@escuela.com",
      rol: "Alumno",
      estado: "Activo",
    },
    {
      id: 4,
      matricula: "P004567",
      nombre: "Ana Martínez Cruz",
      email: "ana.martinez@escuela.com",
      rol: "Profesor",
      estado: "Suspendido",
    },
    {
      id: 5,
      matricula: "A005678",
      nombre: "Luis Hernández Ruiz",
      email: "luis.hernandez@escuela.com",
      rol: "Alumno",
      estado: "Activo",
    },
  ]);

  const [modalAbierta, setModalAbierta] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [formData, setFormData] = useState({
    matricula: '',
    nombre: '',
    email: '',
    rol: 'Alumno',
    password: ''
  });

  const abrirModalAgregar = () => {
    setModoEdicion(false);
    setFormData({
      matricula: '',
      nombre: '',
      email: '',
      rol: 'Alumno',
      password: ''
    });
    setModalAbierta(true);
  };

  const abrirModalEditar = (usuario) => {
    setModoEdicion(true);
    setUsuarioActual(usuario);
    setFormData({
      matricula: usuario.matricula,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      password: ''
    });
    setModalAbierta(true);
  };

  const cerrarModal = () => {
    setModalAbierta(false);
    setUsuarioActual(null);
  };

  const abrirModalConfirmacion = (usuario) => {
    setUsuarioAEliminar(usuario);
    setModalConfirmacion(true);
  };

  const cerrarModalConfirmacion = () => {
    setModalConfirmacion(false);
    setUsuarioAEliminar(null);
  };

  const confirmarEliminacion = () => {
    if (usuarioAEliminar) {
      setUsuarios(usuarios.filter(usr => usr.id !== usuarioAEliminar.id));
      cerrarModalConfirmacion();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modoEdicion && usuarioActual) {
      setUsuarios(usuarios.map(usr => 
        usr.id === usuarioActual.id 
          ? { ...usr, ...formData }
          : usr
      ));
    } else {
      const nuevoUsuario = {
        id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
        ...formData,
        estado: 'Activo'
      };
      setUsuarios([...usuarios, nuevoUsuario]);
    }
    
    cerrarModal();
  };

  const toggleEstado = (usuario) => {
    setUsuarios(usuarios.map(usr =>
      usr.id === usuario.id
        ? { ...usr, estado: usr.estado === 'Activo' ? 'Suspendido' : 'Activo' }
        : usr
    ));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchBusqueda = 
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.matricula.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase());
    const matchRol = filtroRol === 'Todos' || usuario.rol === filtroRol;
    const matchEstado = filtroEstado === 'Todos' || usuario.estado === filtroEstado;
    
    return matchBusqueda && matchRol && matchEstado;
  });

  const obtenerColorRol = (rol) => {
    const colores = {
      'Alumno': 'bg-blue-100 text-blue-700',
      'Profesor': 'bg-purple-100 text-purple-700',
      'Admin': 'bg-red-100 text-red-700'
    };
    return colores[rol] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
                <UserCircle className="w-10 h-10 text-indigo-600" />
                Usuarios
              </h1>
              <p className="text-slate-600 mt-2">
                Gestiona los usuarios del sistema
              </p>
            </div>
            <button
              onClick={abrirModalAgregar}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Nuevo Usuario
            </button>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, matrícula o email..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <select
                  value={filtroRol}
                  onChange={(e) => setFiltroRol(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900"
                >
                  <option value="Todos">Todos los roles</option>
                  <option value="Alumno">Alumno</option>
                  <option value="Profesor">Profesor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900"
                >
                  <option value="Todos">Todos los estados</option>
                  <option value="Activo">Activo</option>
                  <option value="Suspendido">Suspendido</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Matrícula
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {usuariosFiltrados.map((usuario) => (
                  <tr 
                    key={usuario.id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <UserCircle className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="font-semibold text-slate-800">
                          {usuario.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {usuario.matricula}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">
                          {usuario.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${obtenerColorRol(usuario.rol)}`}>
                        <Shield className="w-3 h-3" />
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        usuario.estado === 'Activo' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {usuario.estado === 'Activo' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Ban className="w-3 h-3" />
                        )}
                        {usuario.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirModalEditar(usuario)}
                          className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleEstado(usuario)}
                          className={`p-2 rounded-lg transition-colors ${
                            usuario.estado === 'Activo'
                              ? 'bg-orange-50 hover:bg-orange-100 text-orange-600'
                              : 'bg-green-50 hover:bg-green-100 text-green-600'
                          }`}
                          title={usuario.estado === 'Activo' ? 'Suspender' : 'Activar'}
                        >
                          {usuario.estado === 'Activo' ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => abrirModalConfirmacion(usuario)}
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
          {usuariosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <UserCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                {busqueda || filtroRol !== 'Todos' || filtroEstado !== 'Todos' 
                  ? 'No se encontraron usuarios' 
                  : 'No hay usuarios registrados'}
              </h3>
              <p className="text-slate-500">
                {busqueda || filtroRol !== 'Todos' || filtroEstado !== 'Todos'
                  ? 'Intenta ajustar los filtros de búsqueda' 
                  : 'Comienza agregando tu primer usuario'
                }
              </p>
            </div>
          )}
        </div>

        {/* Contador de resultados */}
        {usuarios.length > 0 && (
          <div className="mt-4 text-sm text-slate-600">
            Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
          </div>
        )}
      </div>

      {/* Modal Agregar/Editar */}
      {modalAbierta && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-slate-800">
                {modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}
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
                {/* Matrícula */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Matrícula
                  </label>
                  <input
                    type="text"
                    name="matricula"
                    value={formData.matricula}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400 font-mono"
                    placeholder="A001234"
                    required
                  />
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="Juan Pérez García"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="usuario@escuela.com"
                    required
                  />
                </div>

                {/* Rol */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Rol
                  </label>
                  <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900"
                    required
                  >
                    <option value="Alumno">Alumno</option>
                    <option value="Profesor">Profesor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                {/* Contraseña */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Contraseña
                    {modoEdicion && (
                      <span className="text-slate-500 font-normal text-xs ml-2">
                        (dejar en blanco para no cambiar)
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="••••••••"
                    required={!modoEdicion}
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
              <p className="text-slate-600 mb-3">
                ¿Estás seguro de que deseas eliminar este usuario?
              </p>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">
                    <span className="font-semibold">Nombre:</span> {usuarioAEliminar?.nombre}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-slate-600 bg-slate-200 px-2 py-1 rounded">
                    {usuarioAEliminar?.matricula}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700 text-sm">
                    {usuarioAEliminar?.email}
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