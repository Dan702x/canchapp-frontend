// src/pages/Empresa/MiSolicitud.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { get, del } from '../../lib/api';

const MiSolicitud = () => {
  const [solicitud, setSolicitud] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const data = await get('/empresa/mi-solicitud');
        setSolicitud(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSolicitud();
  }, []);

  const handleReintentar = async () => {
    if (!window.confirm("¿Estás seguro? Se borrará tu solicitud rechazada y podrás enviar una nueva.")) {
      return;
    }
    try {
      await del('/empresa/mi-solicitud');
      navigate('/soy-empresa'); // Redirige al formulario de solicitud
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const renderStatus = () => {
    if (isLoading) {
      return <p className="text-gray-600">Cargando estado de tu solicitud...</p>;
    }
    if (error) {
      return <p className="text-red-600">{error}</p>;
    }

    if (!solicitud || !solicitud.estado) {
        // Esto es para usuarios que aún no han enviado el formulario /soy-empresa
         return (
             <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Aún no has enviado una solicitud</h2>
                <p className="text-gray-600 mb-6">Si tienes un negocio de canchas, puedes registrarlo aquí.</p>
                <Link to="/soy-empresa" className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                    Iniciar Solicitud
                </Link>
            </div>
         )
    }

    switch (solicitud.estado) {
      case 'pendiente':
        return (
          <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Tu solicitud está en revisión</h2>
            <p className="text-blue-600">Nuestro equipo está validando tus datos. Te notificaremos pronto.</p>
          </div>
        );
      case 'activo':
        return (
          <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-2xl font-bold text-green-700 mb-2">¡Solicitud Aprobada!</h2>
            <p className="text-green-600 mb-6">¡Felicitaciones! Ya puedes empezar a registrar tus sedes y canchas.</p>
            <Link to="/mi-negocio/sedes" className="py-2 px-5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
              Ir a Mi Negocio
            </Link>
          </div>
        );
      case 'rechazado':
        return (
          <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-2xl font-bold text-red-700 mb-2">Solicitud Rechazada</h2>
            <p className="text-gray-800 font-semibold">Motivo del rechazo:</p>
            <p className="text-red-600 mb-6 italic">"{solicitud.motivo_rechazo || 'No se especificó un motivo.'}"</p>
            <p className="text-gray-600 mb-4">Por favor, corrige la información y vuelve a intentarlo.</p>
            <button onClick={handleReintentar} className="py-2 px-5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">
              Eliminar y Volver a Intentar
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Estado de tu Solicitud</h1>
      {renderStatus()}
    </div>
  );
};

export default MiSolicitud;