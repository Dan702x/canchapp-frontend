// src/pages/Admin/GestionEmpresas.jsx

import React, { useState, useEffect } from 'react';
import { get, put } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

// --- ¡NUEVO! Modal para Editar Empresa (Admin) ---
const EmpresaEditModal = ({ empresa, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: empresa ? empresa.nombre : '',
    ruc: empresa ? empresa.ruc : ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await put(`/admin/empresas/${empresa.id_empresa}`, formData);
      onSave({ ...empresa, ...formData }); // Llama al onSave con los datos actualizados
    } catch (err) {
      alert(`Error al guardar: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h3 className="text-xl font-bold text-gray-800 mb-6">Editar Empresa</h3>
          <div className="space-y-4">
            <input
              type="text" name="nombre" value={formData.nombre} onChange={handleChange}
              placeholder="Nombre de la Empresa" required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text" name="ruc" value={formData.ruc} onChange={handleChange}
              placeholder="RUC" required maxLength="11"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Componente Principal ---
const GestionEmpresas = () => {
  const { user } = useAuth();
  const [empresas, setEmpresas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ¡NUEVO! Estado para el filtro, por defecto "pendiente"
  const [filtroEstado, setFiltroEstado] = useState('pendiente');
  // ¡NUEVO! Estado para el modal de edición
  const [editingEmpresa, setEditingEmpresa] = useState(null);

  const fetchEmpresas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // ¡MODIFICADO! Usamos el nuevo endpoint y pasamos el filtro
      const data = await get(`/admin/empresas?estado=${filtroEstado}`); 
      setEmpresas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Se ejecuta al cargar y cuando cambia el filtro
  useEffect(() => {
    fetchEmpresas();
  }, [filtroEstado]);

  // Misma función de 'gestionar_solicitud' (Aprobar/Rechazar)
  const handleGestionSolicitud = async (idEmpresa, accion) => {
    try {
      let payload = { accion };
      if (accion === 'rechazar') {
        const motivo = window.prompt("Por favor, ingresa el motivo del rechazo:");
        if (motivo === null) return; 
        if (motivo.trim() === "") { alert("El motivo no puede estar vacío."); return; }
        payload.motivo = motivo;
      }
      await put(`/admin/solicitudes/${idEmpresa}`, payload);
      fetchEmpresas(); // Recargamos la lista
    } catch (err) {
      alert(`Error al gestionar la solicitud: ${err.message}`);
    }
  };
  
  // ¡NUEVO! Función para Activar/Desactivar (Banear)
  const handleUpdateEstado = async (idEmpresa, nuevoEstado) => {
     try {
        await put(`/admin/empresas/${idEmpresa}/estado`, { estado: nuevoEstado });
        fetchEmpresas(); // Recargamos la lista
     } catch (err) {
        alert(`Error al actualizar estado: ${err.message}`);
     }
  };
  
  // ¡NUEVO! Callback para el modal de edición
  const handleSaveEmpresa = (empresaActualizada) => {
    setEmpresas(prev => prev.map(e => e.id_empresa === empresaActualizada.id_empresa ? empresaActualizada : e));
    setEditingEmpresa(null);
  };

  // Protección de la ruta
  if (user?.id_rol !== 2) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
        <p className="text-gray-700">No tienes permisos de administrador para ver esta página.</p>
        <Link to="/" className="text-blue-600 underline mt-4">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Empresas</h1>
      
      {/* --- ¡NUEVO! Filtros --- */}
      <div className="mb-4">
        <label htmlFor="filtroEstado" className="text-sm font-medium text-gray-700 mr-2">Filtrar por estado:</label>
        <select 
          id="filtroEstado"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="pendiente">Pendientes</option>
          <option value="activo">Activas</option>
          <option value="rechazado">Rechazadas</option>
          <option value="">Todas</option>
        </select>
      </div>

      {/* --- Tabla de Empresas --- */}
      <div className="bg-white border rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="4" className="p-4 text-center text-gray-500">Cargando...</td></tr>
              ) : error ? (
                <tr><td colSpan="4" className="p-4 text-center text-red-500">{error}</td></tr>
              ) : empresas.length === 0 ? (
                <tr><td colSpan="4" className="p-4 text-center text-gray-500">No se encontraron empresas con ese estado.</td></tr>
              ) : (
                empresas.map((emp) => (
                  <tr key={emp.id_empresa}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{emp.nombre}</div>
                      <div className="text-sm text-gray-500">{emp.ruc}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{emp.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        emp.estado === 'activo' ? 'bg-green-100 text-green-800' :
                        emp.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {emp.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-3">
                   {emp.estado === 'pendiente' && (
                    <>
                      <button onClick={() => handleGestionSolicitud(emp.id_empresa, 'aprobar')} className="text-green-600 hover:text-green-900">Aprobar</button>
                      <button onClick={() => handleGestionSolicitud(emp.id_empresa, 'rechazar')} className="text-red-600 hover:text-red-900">Rechazar</button>
                    </>
                  )}
                  {emp.estado === 'activo' && (
                    <>
                      <button onClick={() => setEditingEmpresa(emp)} className="text-blue-600 hover:text-blue-900">Editar</button>
                      <button onClick={() => handleUpdateEstado(emp.id_empresa, 'rechazado')} className="text-red-600 hover:text-red-900">Desactivar</button>
                    </>
                  )}
                  {emp.estado === 'rechazado' && (
                    <>
                      <button onClick={() => setEditingEmpresa(emp)} className="text-blue-600 hover:text-blue-900">Editar</button>
                      <button onClick={() => handleUpdateEstado(emp.id_empresa, 'activo')} className="text-green-600 hover:text-green-900">Re-Activar</button>
                    </>
                  )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
        </table>
      </div>
      
      {/* --- Modal de Edición --- */}
      {editingEmpresa && (
        <EmpresaEditModal
          empresa={editingEmpresa}
          onClose={() => setEditingEmpresa(null)}
          onSave={handleSaveEmpresa}
        />
      )}
    </div>
  );
};

export default GestionEmpresas;