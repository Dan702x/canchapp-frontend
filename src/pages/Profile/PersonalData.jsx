// src/pages/Profile/PersonalData.jsx

import React, { useState, useEffect } from 'react';
import { get, put } from '../../lib/api';
import { useAuth } from '../../context/AuthContext'; // 1. Importa el hook useAuth

const PersonalData = () => {
  const { user } = useAuth(); // 2. Obtiene los datos del usuario logueado
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    documento: '',
    telefono: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);

  // 3. Cargar los datos del perfil
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) { // Si no hay usuario, no intentes cargar nada
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        // ¡CAMBIO! Llamamos al 'GET /api/profile'
        // El backend (por ahora) ignora el ID, pero usa el simulado (ID 1)
        // Esto cargará los datos de "Admin Joga"
        const data = await get('/profile'); 
        setFormData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            documento: data.documento || '',
            telefono: data.telefono || '',
            email: data.email || ''
        });
      } catch (err) {
        setMessage({ type: 'error', text: 'No se pudieron cargar tus datos.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]); // Se ejecuta cuando el 'user' cambia (al iniciar sesión)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 4. Guardar los cambios (HU-010)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);
    try {
      // ¡CAMBIO! Llamamos al 'PUT /api/profile'
      // El backend (por ahora) actualizará los datos del ID 1
      const updatedData = await put('/profile', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        documento: formData.documento,
        telefono: formData.telefono
      });
      setMessage({ type: 'success', text: updatedData.mensaje });
      setIsEditing(false); // Bloquear campos de nuevo
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Si no hay usuario logueado, muestra un mensaje
  if (!user) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos Personales</h2>
        <p className="text-gray-600">Debes <Link to="/login" className="text-blue-600">iniciar sesión</Link> para ver tus datos.</p>
      </div>
    );
  }

  if (isLoading && !formData.first_name) {
    return <p>Cargando datos personales...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos Personales</h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nombres</label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              value={formData.first_name}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellidos</label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              value={formData.last_name}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="documento" className="block text-sm font-medium text-gray-700">Documento de identidad</label>
            <input
              type="text"
              name="documento"
              id="documento"
              value={formData.documento || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              id="telefono"
              value={formData.telefono || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            disabled // El email no se puede cambiar
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              Editar datos
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // (Opcional: recargar datos para descartar cambios)
                }}
                className="py-2 px-5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="py-2 px-5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default PersonalData;