// src/pages/SolicitudEmpresa.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const SolicitudEmpresa = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    ruc: '',
    descripcion: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!formData.nombre || !formData.ruc) {
      setError('El nombre de la empresa y el RUC son obligatorios.');
      return;
    }
    
    if (!/^\d{11}$/.test(formData.ruc)) {
        setError('El RUC debe contener 11 dígitos numéricos.');
        return;
    }

    setIsLoading(true);
    try {
      const response = await post('/empresas/solicitar-registro', formData);
      setSuccess(response.mensaje);
      setFormData({ nombre: '', ruc: '', descripcion: '' });
      setTimeout(() => navigate('/perfil/datos'), 3000); // Redirige al perfil
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
        <div className="max-w-xl mx-auto my-12 p-8 bg-white shadow-lg rounded-lg text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
            <p className="text-gray-700">Debes <Link to="/login" className="text-blue-600 underline">iniciar sesión</Link> para poder registrar tu empresa.</p>
        </div>
    );
  }
  
  if (success) {
     return (
        <div className="max-w-xl mx-auto my-12 p-8 bg-white shadow-lg rounded-lg text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-4">¡Solicitud Enviada!</h1>
            <p className="text-gray-700">{success}</p>
            <p className="mt-2 text-sm text-gray-500">Serás redirigido a tu perfil en 3 segundos...</p>
        </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Registra tu Empresa</h1>
      <p className="text-gray-600 mb-6">
        Completa este formulario para que nuestro equipo valide tu negocio.
        Una vez aprobado, podrás registrar tus sedes y canchas.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <span className="block sm:inline">{error}</span>
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
            RUC (11 dígitos)
          </label>
          <input
            type="text"
            name="ruc"
            id="ruc"
            maxLength="11"
            value={formData.ruc}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
            Descripción Breve (Opcional)
          </label>
          <textarea
            name="descripcion"
            id="descripcion"
            rows="3"
            value={formData.descripcion}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
            placeholder="Ej: Brindamos canchas de grass sintético con iluminación LED..."
          ></textarea>
        </div>
        
        <div className="text-right">
            <button
              type="submit"
              disabled={isLoading}
              className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default SolicitudEmpresa;