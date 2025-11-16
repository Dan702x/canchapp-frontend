// src/pages/Empresa/MisCanchas.jsx

import React, { useState, useEffect } from 'react';
import { get, post, put, del } from '../../lib/api'; // ¡Volvemos a usar 'post' normal!

// --- Hook para cargar catálogos (Sedes, Deportes, Superficies) ---
const useCatalogos = () => {
  const [sedes, setSedes] = useState([]);
  const [tiposDeporte, setTiposDeporte] = useState([]);
  const [tiposSuperficie, setTiposSuperficie] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCatalogos = async () => {
    try {
      const [sedesData, deportesData, superficiesData] = await Promise.all([
        get('/empresa/sedes'),
        get('/catalogos/tipos-deporte'),
        get('/catalogos/tipos-superficie')
      ]);
      setSedes(sedesData);
      setTiposDeporte(deportesData);
      setTiposSuperficie(superficiesData);
    } catch (err) {
      console.error("Error cargando catálogos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogos();
  }, []);
  
  return { sedes, tiposDeporte, tiposSuperficie, loadingCatalogos: loading, fetchCatalogos };
};


// --- ¡ESTE ES EL COMPONENTE QUE PEDISTE! ---
// --- Modal para Crear/Editar Cancha (con 3 URLs) ---
const CanchaModal = ({ cancha, onClose, onSave, catalogos }) => {
  const { sedes, tiposDeporte, tiposSuperficie } = catalogos;
  
  // Estado para los campos de TEXTO
  const [formData, setFormData] = useState({
    id_sede: cancha ? cancha.id_sede : '',
    id_tipo_deporte: cancha ? cancha.id_tipo_deporte : '',
    id_tipo_superficie: cancha ? (cancha.id_tipo_superficie || '') : '',
    nombre: cancha ? cancha.nombre : '',
    precio_por_hora: cancha ? (cancha.precio_por_hora || '') : '',
    descripcion: cancha ? (cancha.descripcion || '') : '',
    foto_url_1: cancha ? (cancha.foto_url_1 || '') : '', // ¡NUEVO!
    foto_url_2: cancha ? (cancha.foto_url_2 || '') : '', // ¡NUEVO!
    foto_url_3: cancha ? (cancha.foto_url_3 || '') : ''  // ¡NUEVO!
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
      if (cancha) { // Editando
        await put(`/empresa/canchas/${cancha.id_cancha}`, formData);
      } else { // Creando
        await post('/empresa/canchas', formData);
      }
      onSave(); 
    } catch (err) {
      alert(`Error al guardar: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h3 className="text-xl font-bold text-gray-800 mb-6">{cancha ? 'Editar Cancha' : 'Crear Nueva Cancha'}</h3>
          <div className="space-y-4">
            {/* --- Fila 1 --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select name="id_sede" value={formData.id_sede} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md">
                <option value="">-- Selecciona una Sede --</option>
                {sedes.map(s => <option key={s.id_sede} value={s.id_sede}>{s.nombre_sede}</option>)}
              </select>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre de la Cancha (Ej: Cancha A)" required className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            {/* --- Fila 2 --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select name="id_tipo_deporte" value={formData.id_tipo_deporte} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md">
                <option value="">-- Tipo de Deporte --</option>
                {tiposDeporte.map(t => <option key={t.id_tipo_deporte} value={t.id_tipo_deporte}>{t.nombre}</option>)}
              </select>
              <select name="id_tipo_superficie" value={formData.id_tipo_superficie} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                <option value="">-- Tipo de Superficie (Opcional) --</option>
                {tiposSuperficie.map(t => <option key={t.id_tipo_superficie} value={t.id_tipo_superficie}>{t.nombre}</option>)}
              </select>
              <input type="number" step="0.01" name="precio_por_hora" value={formData.precio_por_hora} onChange={handleChange} placeholder="Precio por Hora (Ej: 100.00)" required className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            {/* --- Fila 3 (Descripción) --- */}
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción (Obligatorio)" required className="w-full p-2 border border-gray-300 rounded-md" rows="3"></textarea>
            
            {/* --- Fila 4 (URLs de Fotos) --- */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Fotos (Mínimo 1)</label>
                <input 
                    type="text" // Cambiado de 'url' a 'text' para más flexibilidad
                    name="foto_url_1"
                    value={formData.foto_url_1}
                    onChange={handleChange}
                    placeholder="URL de la Foto Principal (Obligatorio)" 
                    required 
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input 
                    type="text" 
                    name="foto_url_2"
                    value={formData.foto_url_2}
                    onChange={handleChange}
                    placeholder="URL de la Foto 2 (Opcional)" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input 
                    type="text" 
                    name="foto_url_3"
                    value={formData.foto_url_3}
                    onChange={handleChange}
                    placeholder="URL de la Foto 3 (Opcional)" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Guardando...' : 'Guardar Cancha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Modal de Confirmación para Eliminar ---
// (Sin cambios)
const DeleteModal = ({ cancha, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await del(`/empresa/canchas/${cancha.id_cancha}`); 
      onConfirm();
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
          ¿Estás seguro de que quieres eliminar la cancha <strong className="text-red-600">{cancha.nombre}</strong>?
          <br />
          <span className="text-sm font-medium">Esta acción es PERMANENTE y no se puede deshacer.</span>
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


// --- Componente Principal: MisCanchas ---
// (La lógica es la misma, solo cambia el renderizado de la tabla)
const MisCanchas = () => {
  const [canchas, setCanchas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const catalogos = useCatalogos();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCancha, setEditingCancha] = useState(null);
  const [deletingCancha, setDeletingCancha] = useState(null);

  const [filtroSede, setFiltroSede] = useState('');
  const [filtroDeporte, setFiltroDeporte] = useState('');

  const fetchCanchas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filtroSede) params.append('sede', filtroSede);
      if (filtroDeporte) params.append('deporte', filtroDeporte);
      const data = await get(`/empresa/canchas?${params.toString()}`);
      setCanchas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCanchas();
  }, [filtroSede, filtroDeporte]); 

  const handleSaveCancha = () => {
    setIsCreateModalOpen(false);
    setEditingCancha(null);
    fetchCanchas(); 
    catalogos.fetchCatalogos(); 
  };

  const handleDeleteCancha = () => {
    setDeletingCancha(null);
    fetchCanchas(); 
  };

  const handleToggleEstado = async (cancha) => {
    const nuevoEstado = !cancha.estado;
    const confirmMsg = `¿Estás seguro de que quieres ${nuevoEstado ? 'ACTIVAR' : 'DESACTIVAR'} la cancha "${cancha.nombre}"?`;
    
    if (window.confirm(confirmMsg)) {
      try {
        await put(`/empresa/canchas/${cancha.id_cancha}/estado`, { estado: nuevoEstado });
        fetchCanchas(); 
      } catch (err) {
        alert(`Error al cambiar estado: ${err.message}`);
      }
    }
  };

  return (
    <div>
      {/* --- Cabecera con el botón --- */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mis Canchas</h2>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Registrar Nueva Cancha
        </button>
      </div>

      {/* --- Sección de Filtros --- */}
      <div className="flex justify-start items-center gap-4 mb-4">
        <select 
          value={filtroSede} 
          onChange={(e) => setFiltroSede(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-white text-sm"
          disabled={catalogos.loadingCatalogos}
        >
          <option value="">Todas las Sedes</option>
          {catalogos.sedes.map(s => <option key={s.id_sede} value={s.id_sede}>{s.nombre_sede}</option>)}
        </select>
        <select 
          value={filtroDeporte}
          onChange={(e) => setFiltroDeporte(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-white text-sm"
          disabled={catalogos.loadingCatalogos}
        >
          <option value="">Todos los Deportes</option>
          {catalogos.tiposDeporte.map(t => <option key={t.id_tipo_deporte} value={t.id_tipo_deporte}>{t.nombre}</option>)}
        </select>
      </div>


      {/* --- Tabla --- */}
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre de la Cancha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deporte</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sede</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio X Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading || catalogos.loadingCatalogos ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">Cargando...</td></tr>
            ) : error ? (
              <tr><td colSpan="6" className="p-4 text-center text-red-500">{error}</td></tr>
            ) : canchas.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">No se encontraron canchas (o aún no has registrado ninguna).</td></tr>
            ) : (
              canchas.map(cancha => (
                <tr key={cancha.id_cancha}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {/* ¡MODIFICADO! Usamos foto_url_1 (que ahora se llama foto_principal) */}
                      <img className="h-10 w-16 object-cover rounded mr-3 flex-shrink-0" src={cancha.foto_url_1 || 'https://placehold.co/100x75/CCCCCC/FFFFFF?text=Sin+Foto'} alt={cancha.nombre} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{cancha.nombre}</div>
                        <div className="text-sm text-gray-500">{cancha.tipo_superficie || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{cancha.tipo_deporte}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{cancha.nombre_sede}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">S/ {parseFloat(cancha.precio_por_hora || 0).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cancha.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {cancha.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left text-sm font-medium">
                    <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1">
                      <button onClick={() => setEditingCancha(cancha)} className="text-blue-600 hover:text-blue-900">Editar</button>
                      <button onClick={() => handleToggleEstado(cancha)} className={cancha.estado ? "text-yellow-600 hover:text-yellow-900" : "text-green-600 hover:text-green-900"}>
                        {cancha.estado ? 'Desactivar' : 'Activar'}
                      </button>
                      <button onClick={() => setDeletingCancha(cancha)} className="text-red-600 hover:text-red-900">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* --- Renderizado de Modales --- */}
      {isCreateModalOpen && (
        <CanchaModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSave={handleSaveCancha}
          catalogos={catalogos}
        />
      )}
      
      {editingCancha && (
        <CanchaModal 
          cancha={editingCancha}
          onClose={() => setEditingCancha(null)} 
          onSave={handleSaveCancha}
          catalogos={catalogos}
        />
      )}
      
      {deletingCancha && (
        <DeleteModal
          cancha={deletingCancha}
          onClose={() => setDeletingCancha(null)}
          onConfirm={handleDeleteCancha}
        />
      )}
    </div>
  );
};

export default MisCanchas;