"use client";

import { useState } from "react";

export default function UsuariosPage() {
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

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRol, setFilterRol] = useState("Todos");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' o 'edit'
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [formData, setFormData] = useState({
    matricula: "",
    nombre: "",
    email: "",
    rol: "Alumno",
    password: "",
  });

  // Filtrar usuarios
  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchSearch =
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRol = filterRol === "Todos" || usuario.rol === filterRol;
    const matchEstado =
      filterEstado === "Todos" || usuario.estado === filterEstado;

    return matchSearch && matchRol && matchEstado;
  });

  // Abrir modal para agregar
  const handleAddClick = () => {
    setModalMode("add");
    setFormData({
      matricula: "",
      nombre: "",
      email: "",
      rol: "Alumno",
      password: "",
    });
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEditClick = (usuario) => {
    setModalMode("edit");
    setSelectedUsuario(usuario);
    setFormData({
      matricula: usuario.matricula,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      password: "",
    });
    setShowModal(true);
  };

  // Guardar usuario
  const handleSave = () => {
    if (modalMode === "add") {
      const newUsuario = {
        id: usuarios.length + 1,
        ...formData,
        estado: "Activo",
      };
      setUsuarios([...usuarios, newUsuario]);
    } else {
      setUsuarios(
        usuarios.map((u) =>
          u.id === selectedUsuario.id ? { ...u, ...formData } : u
        )
      );
    }
    setShowModal(false);
  };

  // Suspender/Activar usuario
  const handleToggleEstado = (usuario) => {
    setUsuarios(
      usuarios.map((u) =>
        u.id === usuario.id
          ? { ...u, estado: u.estado === "Activo" ? "Suspendido" : "Activo" }
          : u
      )
    );
  };

  // Eliminar usuario
  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Usuarios</h2>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nuevo Usuario
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, matrícula o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder:text-gray-500 font-medium"
              />
            </div>
          </div>

          <div>
            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
            >
              <option value="Todos">Todos los roles</option>
              <option value="Alumno">Alumno</option>
              <option value="Profesor">Profesor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Suspendido">Suspendido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matrícula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {usuario.matricula}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {usuario.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {usuario.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        usuario.rol === "Profesor"
                          ? "bg-purple-100 text-purple-800"
                          : usuario.rol === "Admin"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        usuario.estado === "Activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {usuario.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditClick(usuario)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleEstado(usuario)}
                        className={`${
                          usuario.estado === "Activo"
                            ? "text-orange-600 hover:text-orange-800"
                            : "text-green-600 hover:text-green-800"
                        } font-medium`}
                      >
                        {usuario.estado === "Activo" ? "Suspender" : "Activar"}
                      </button>
                      <button
                        onClick={() => handleDelete(usuario.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsuarios.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-gray-500 font-medium">
              No se encontraron usuarios
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        )}
      </div>

      {/* Modal para agregar/editar */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Overlay con blur */}
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {modalMode === "add" ? "Nuevo Usuario" : "Editar Usuario"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Matrícula
                </label>
                <input
                  type="text"
                  value={formData.matricula}
                  onChange={(e) =>
                    setFormData({ ...formData, matricula: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                  placeholder="A001234"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                  placeholder="Juan Pérez García"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                  placeholder="usuario@escuela.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Rol
                </label>
                <select
                  value={formData.rol}
                  onChange={(e) =>
                    setFormData({ ...formData, rol: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                >
                  <option value="Alumno">Alumno</option>
                  <option value="Profesor">Profesor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Contraseña{" "}
                  {modalMode === "edit" && (
                    <span className="text-gray-500 font-normal">
                      (dejar en blanco para no cambiar)
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg shadow-blue-500/30"
                >
                  {modalMode === "add" ? "Crear Usuario" : "Guardar Cambios"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
