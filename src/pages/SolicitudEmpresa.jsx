// src/pages/SolicitudEmpresa.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { post } from '../lib/api';
import { useAuth } from '../context/AuthContext'; // Importamos useAuth

const SolicitudEmpresa = () => {
  // --- ¡CAMBIO! Obtenemos refreshUser ---
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    ruc: '',
    descripcion: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // --- ¡CAMBIO! El estado 'success' ya no es necesario ---
  // const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- ¡CAMBIO! handleSubmit ahora refresca el estado y redirige ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
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
      // 1. Enviamos la solicitud
      await post('/empresas/solicitar-registro', formData);
      
      // 2. Forzamos al AuthContext a recargar (¡Esto actualiza el header!)
      await refreshUser();
      
      // 3. Redirigimos al usuario a la página de "Ver Solicitud"
      navigate('/mi-solicitud');

    } catch (err) {
      setError(err.message);
      setIsLoading(false); // Solo detenemos la carga si hay un error
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
  
  // --- ¡CAMBIO! El bloque 'if (success)' se eliminó ---

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