// src/pages/Empresa/MisSedes.jsx

import React, { useState, useEffect } from 'react';
import { get, post, put, del } from '../../lib/api'; // Importamos put y del

// --- Sub-Componente: Modal para Crear/Editar Sede ---
const SedeModal = ({ sede, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre_sede: sede ? sede.nombre_sede : '',
    ubicacion_texto: sede ? sede.ubicacion_texto : '',
    latitud: sede ? (sede.latitud || '') : '',
    longitud: sede ? (sede.longitud || '') : ''
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
      let savedSede;
      if (sede) { // Estamos Editando
        savedSede = await put(`/empresa/sedes/${sede.id_sede}`, formData);
      } else { // Estamos Creando
        savedSede = await post('/empresa/sedes', formData);
      }
      onSave(savedSede); // Llama a la función onSave del padre
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
          <h3 className="text-xl font-bold text-gray-800 mb-6">{sede ? 'Editar Sede' : 'Crear Nueva Sede'}</h3>
          <div className="space-y-4">
            <input
              type="text" name="nombre_sede" value={formData.nombre_sede} onChange={handleChange}
              placeholder="Nombre de la Sede" required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text" name="ubicacion_texto" value={formData.ubicacion_texto} onChange={handleChange}
              placeholder="Dirección" required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number" step="any" name="latitud" value={formData.latitud} onChange={handleChange}
                placeholder="Latitud (Opcional)"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="number" step="any" name="longitud" value={formData.longitud} onChange={handleChange}
                placeholder="Longitud (Opcional)"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Guardando...' : 'Guardar Sede'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Sub-Componente: Modal de Confirmación para Eliminar ---
const DeleteModal = ({ sede, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await del(`/empresa/sedes/${sede.id_sede}`);
      onConfirm(); // Llama a onConfirm del padre
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Eliminación</h3>
        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que quieres eliminar la sede <strong className="text-red-600">{sede.nombre_sede}</strong>?
          <br />
          <span className="text-sm font-medium">Esta acción no se puede deshacer.</span>
        </p>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={isDeleting} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
            Cancelar
          </button>
          <button onClick={handleDelete} disabled={isDeleting} className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50">
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Componente Principal: MisSedes ---
const MisSedes = () => {
  const [sedes, setSedes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para controlar los modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSede, setEditingSede] = useState(null); // Guarda la sede a editar
  const [deletingSede, setDeletingSede] = useState(null); // Guarda la sede a eliminar

  const fetchSedes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await get('/empresa/sedes');
      setSedes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSedes();
  }, []);

  // Función callback para el modal (Crear o Editar)
  const handleSaveSede = (savedSede) => {
    if (editingSede) { // Si estábamos editando
      setSedes(prev => prev.map(s => s.id_sede === savedSede.id_sede ? savedSede : s));
    } else { // Si estábamos creando
      setSedes(prev => [...prev, savedSede]);
    }
    setIsCreateModalOpen(false);
    setEditingSede(null);
  };

  // Función callback para el modal (Eliminar)
  const handleDeleteSede = () => {
    setSedes(prev => prev.filter(s => s.id_sede !== deletingSede.id_sede));
    setDeletingSede(null);
  };

  return (
    <div>
      {/* --- Cabecera con el botón --- */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mis Sedes</h2>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Registrar Nueva Sede
        </button>
      </div>

      {/* --- Lista de Sedes Registradas (estilo tabla) --- */}
      <div className="bg-white border rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="3" className="p-4 text-center text-gray-500">Cargando...</td></tr>
              ) : error ? (
                <tr><td colSpan="3" className="p-4 text-center text-red-500">{error}</td></tr>
              ) : sedes.length === 0 ? (
                <tr><td colSpan="3" className="p-4 text-center text-gray-500">Aún no has registrado ninguna sede.</td></tr>
              ) : (
                sedes.map(sede => (
                  <tr key={sede.id_sede}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sede.nombre_sede}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{sede.ubicacion_texto}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button onClick={() => setEditingSede(sede)} className="text-blue-600 hover:text-blue-900">Editar</button>
                      <button onClick={() => setDeletingSede(sede)} className="text-red-600 hover:text-red-900">Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* --- Renderizado de Modales --- */}
      {isCreateModalOpen && (
        <SedeModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSave={handleSaveSede} 
        />
      )}
      
      {editingSede && (
        <SedeModal 
          sede={editingSede}
          onClose={() => setEditingSede(null)} 
          onSave={handleSaveSede} 
        />
      )}
      
      {deletingSede && (
        <DeleteModal
          sede={deletingSede}
          onClose={() => setDeletingSede(null)}
          onConfirm={handleDeleteSede}
        />
      )}
    </div>
  );
};

export default MisSedes;