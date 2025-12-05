"use client";

import { useState } from "react";
import { User, Edit2, Save, X } from "lucide-react";

export default function PerfilPage() {
  const [modalPasswordAbierta, setModalPasswordAbierta] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "José Guadalupe Coca Chávez",
    email: "2023171036@uteq.edu.mx",
    telefono: "+52 442 123 4567",
    passwordActual: "",
    passwordNueva: "",
    passwordConfirmar: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardarPerfil = (e) => {
    e.preventDefault();
    console.log("Guardando perfil:", {
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
    });
    alert("Perfil actualizado correctamente");
  };

  const handleCambiarPassword = (e) => {
    e.preventDefault();

    if (
      !formData.passwordActual ||
      !formData.passwordNueva ||
      !formData.passwordConfirmar
    ) {
      alert("Todos los campos de contraseña son obligatorios");
      return;
    }

    if (formData.passwordNueva !== formData.passwordConfirmar) {
      alert("Las contraseñas nuevas no coinciden");
      return;
    }

    console.log("Cambiando contraseña");
    alert("Contraseña actualizada correctamente");
    setModalPasswordAbierta(false);
    setFormData((prev) => ({
      ...prev,
      passwordActual: "",
      passwordNueva: "",
      passwordConfirmar: "",
    }));
  };

  const cerrarModal = () => {
    setModalPasswordAbierta(false);
    setFormData((prev) => ({
      ...prev,
      passwordActual: "",
      passwordNueva: "",
      passwordConfirmar: "",
    }));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
            <User className="w-10 h-10 text-blue-600" />
            Perfil
          </h1>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Perfil</h2>
              <p className="text-slate-600 text-sm">
                Tu información personal y los ajustes de seguridad de la cuenta.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Card de Información Personal */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 max-w-md">
              <form onSubmit={handleGuardarPerfil}>
                {/* Avatar y Cambiar Avatar */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-lg font-bold text-white">JC</span>
                  </div>
                  <button
                    type="button"
                    className="text-slate-600 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors text-sm"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Cambiar avatar
                  </button>
                </div>

                {/* Nombre completo */}
                <div className="mb-4">
                  <label className="block text-slate-700 font-medium mb-1.5 text-sm">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 text-sm"
                    placeholder="José Coca Chávez"
                    required
                  />
                </div>

                {/* Correo */}
                <div className="mb-4">
                  <label className="block text-slate-700 font-medium mb-1.5 text-sm">
                    Correo
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 text-sm"
                    placeholder="jose_c@advanpro.com.mx"
                    required
                  />
                </div>

                {/* Teléfono */}
                <div className="mb-4">
                  <label className="block text-slate-700 font-medium mb-1.5 text-sm">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 text-sm"
                    placeholder="+52 442 123 4567"
                    required
                  />
                </div>

                {/* Contraseña (readonly) */}
                <div className="mb-4">
                  <label className="block text-slate-700 font-medium mb-1.5 text-sm">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value="••••••••"
                    readOnly
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 cursor-not-allowed text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setModalPasswordAbierta(true)}
                    className="mt-1.5 text-slate-600 hover:text-blue-600 font-medium flex items-center gap-1.5 transition-colors text-sm"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Cambiar contraseña
                  </button>
                </div>

                {/* Botón Guardar */}
                <div className="flex justify-end mt-5">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg flex items-center gap-2 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Cambiar Contraseña */}
      {modalPasswordAbierta && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">
                Cambiar Contraseña
              </h2>
              <button
                onClick={cerrarModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCambiarPassword} className="p-6">
              <div className="space-y-5">
                {/* Contraseña Actual */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Contraseña actual
                  </label>
                  <input
                    type="password"
                    name="passwordActual"
                    value={formData.passwordActual}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* Nueva Contraseña */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    name="passwordNueva"
                    value={formData.passwordNueva}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    type="password"
                    name="passwordConfirmar"
                    value={formData.passwordConfirmar}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="••••••••"
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
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-blue-200"
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
