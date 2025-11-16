// src/pages/Empresa/DatosEmpresa.jsx

import React, { useState, useEffect } from 'react';
import { get, put } from '../../lib/api';

const DatosEmpresa = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    ruc: '',
    descripcion: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Cargar los datos actuales de la empresa al montar
    const fetchDatos = async () => {
      try {
        setIsLoading(true);
        const data = await get('/empresa/mi-empresa');
        setFormData({
            nombre: data.nombre || '',
            ruc: data.ruc || '',
            descripcion: data.descripcion || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      // Solo enviamos los campos editables
      const dataToUpdate = {
        nombre: formData.nombre,
        descripcion: formData.descripcion
      };
      const response = await put('/empresa/mi-empresa', dataToUpdate);
      setSuccess(response.mensaje);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p>Cargando datos de la empresa...</p>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos de mi Empresa</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <span>{error}</span>
            </div>
        )}
        {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <span>{success}</span>
            </div>
        )}

        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre de la Empresa (Razón Social)
          </label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="ruc" className="block text-sm font-medium text-gray-700">
            RUC (No editable)
          </label>
          <input
            type="text"
            name="ruc"
            id="ruc"
            value={formData.ruc}
            readOnly
            disabled
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="descripcion"
            id="descripcion"
            rows="4"
            value={formData.descripcion}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
            placeholder="Describe tu negocio..."
          ></textarea>
        </div>

        <div className="text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default DatosEmpresa;