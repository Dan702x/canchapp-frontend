// src/pages/Profile/Reservations.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { get, put } from '../../lib/api';
import ModalModificarReserva from '../../components/ModalModificarReserva'; 
import ModalCompartirReserva from '../../components/ModalCompartirReserva'; 
import { FaShareAlt } from 'react-icons/fa'; 

// --- Componente de Tarjeta de Reserva (para no repetir código) ---
// ¡MODIFICADO! Acepta las nuevas props onPagarAhora, onVerComprobante, y API_URL
const ReservationCard = ({ 
  reserva, 
  onCancelar, 
  onModificar, 
  onCompartir, 
  onDejarReseña, 
  onPagarAhora,
  onVerComprobante,
  API_URL 
}) => {
  
  const formattedDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const S_STYLES = {
    'pendiente': 'bg-yellow-200 text-yellow-800',
    'confirmada': 'bg-green-200 text-green-800',
    'cancelada': 'bg-red-200 text-red-800',
    'completada': 'bg-blue-200 text-blue-800',
  };
  const StatusBadge = ({ estado }) => (
    <span className={`px-2 py-0.5 rounded-full text-sm font-semibold ${S_STYLES[estado] || 'bg-gray-200'}`}>
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </span>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
        <Link to={`/cancha/${reserva.id_cancha}`} className="text-xl font-bold text-blue-600 hover:underline">
          {reserva.cancha_nombre}
        </Link>
        <StatusBadge estado={reserva.estado} />
      </div>
      
      <p className="text-gray-700 font-semibold">{reserva.nombre_sede}</p>
      <p className="text-sm text-gray-500 mb-2">{reserva.ubicacion_texto}</p>
      
      <p className="text-gray-800">
        <span className="font-semibold">Fecha:</span> {formattedDate(reserva.fecha_hora_inicio)}
      </p>
      <p className="text-gray-800">
        <span className="font-semibold">Precio:</span> S/ {parseFloat(reserva.precio_total).toFixed(2)}
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mt-4 border-t pt-3">
        {/* Lógica de botones basada en el estado */}
        {reserva.estado === 'confirmada' && (
          <>
            <button 
              onClick={() => onModificar(reserva)} 
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Modificar
            </button>
            <button 
              onClick={() => onCancelar(reserva.id_reserva)}
              className="font-medium text-red-600 hover:text-red-800"
            >
              Cancelar
            </button>
            <button 
              onClick={() => onCompartir(reserva)}
              className="font-medium text-gray-600 hover:text-gray-800 flex items-center"
            >
              <FaShareAlt className="mr-1" /> Compartir
            </button>
            {/* --- ¡BOTONES AÑADIDOS! --- */}
            <button 
              onClick={() => onVerComprobante(reserva)}
              className="font-medium text-green-600 hover:text-green-800"
            >
              Ver Comprobante
            </button>
            <a 
              href={`${API_URL}/reservas/${reserva.id_reserva}/comprobante-pdf`}
              download
              className="font-medium text-green-600 hover:text-green-800"
            >
              Descargar
            </a>
          </>
        )}
         {reserva.estado === 'pendiente' && (
          <>
             {/* --- ¡BOTÓN CORREGIDO! --- */}
             <button 
              onClick={() => onPagarAhora(reserva)} 
              className="font-medium text-yellow-600 hover:text-yellow-800"
            >
              Pagar ahora
            </button>
            <button 
              onClick={() => onCancelar(reserva.id_reserva)}
              className="font-medium text-red-600 hover:text-red-800"
            >
              Cancelar
            </button>
          </>
        )}
        {reserva.estado === 'completada' && (
           <>
            <button 
              onClick={() => onDejarReseña(reserva)}
              className="font-medium text-green-600 hover:text-green-800"
            >
              Dejar reseña
            </button>
            <button 
              onClick={() => onCompartir(reserva)}
              className="font-medium text-gray-600 hover:text-gray-800 flex items-center"
            >
              <FaShareAlt className="mr-1" /> Compartir
            </button>
            {/* --- ¡BOTONES AÑADIDOS! --- */}
            <button 
              onClick={() => onVerComprobante(reserva)}
              className="font-medium text-green-600 hover:text-green-800"
            >
              Ver Comprobante
            </button>
            <a 
              href={`${API_URL}/reservas/${reserva.id_reserva}/comprobante-pdf`}
              download
              className="font-medium text-green-600 hover:text-green-800"
            >
              Descargar
            </a>
           </>
        )}
         {reserva.estado === 'cancelada' && (
            <p className="text-gray-500">Esta reserva fue cancelada.</p>
        )}
      </div>
    </div>
  );
};
// --- Fin del Componente Tarjeta ---


// --- ¡COMPONENTE PRINCIPAL! ---
const Reservations = () => {
  const [reservas, setReservas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('proximos');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharingReserva, setSharingReserva] = useState(null);
  
  const navigate = useNavigate();
  // ¡AÑADIDA LA URL DE LA API!
  const API_URL = import.meta.env.VITE_API || 'http://localhost:8080/api';

  const fetchReservas = async () => {
    try {
      setIsLoading(true);
      const data = await get('/reservas'); 
      setReservas(data);
    } catch (err) {
      setError('No se pudieron cargar tus reservas.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const { proximosReservas, historialReservas } = useMemo(() => {
    const proximos = reservas.filter(
      r => r.estado === 'confirmada' || r.estado === 'pendiente'
    );
    const historial = reservas.filter(
      r => r.estado === 'completada' || r.estado === 'cancelada'
    );
    return { proximosReservas: proximos, historialReservas: historial };
  }, [reservas]); 

  const displayedReservas = activeTab === 'proximos' ? proximosReservas : historialReservas;
  
  // --- Manejadores de Acciones ---

  const handleCancelar = async (idReserva) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return;
    }
    try {
      // 1. Llama al backend para cancelar
      await put(`/reservas/${idReserva}/cancelar`, {});

      // --- ¡ESTA ES LA LÍNEA QUE PEDISTE! ---
      alert("Reserva cancelada correctamente");

      // 2. Refresca la lista de reservas
      fetchReservas(); 
    } catch (err) {
      console.error(err);
      alert(`Error al cancelar la reserva: ${err.message}`);
    }
  };
  
  const handleOpenEditModal = (reserva) => {
    setSelectedReserva(reserva);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setSelectedReserva(null);
    setIsEditModalOpen(false);
  };
  const handleSaveSuccess = () => {
    handleCloseEditModal(); 
    fetchReservas(); 
  };

  const handleOpenShareModal = (reserva) => {
    setSharingReserva(reserva);
    setIsShareModalOpen(true);
  };
  const handleCloseShareModal = () => {
    setSharingReserva(null);
    setIsShareModalOpen(false);
  };

const handleDejarReseña = (reserva) => {
    // ¡CAMBIO! Navegamos a la nueva ruta usando la URL
    navigate(`/cancha/${reserva.id_cancha}/reseñar/${reserva.id_reserva}`);
  };

  // ¡FUNCIÓN AÑADIDA!
  const handlePagarAhora = (reserva) => {
    const fecha = new Date(reserva.fecha_hora_inicio).toLocaleDateString('es-ES', { 
      weekday: 'long', day: 'numeric', month: 'long' 
    });
    const hora = new Date(reserva.fecha_hora_inicio).toLocaleTimeString('es-ES', { 
      hour: '2-digit', minute: '2-digit' 
    });
    
    navigate('/reservar/pago', {
      state: {
        id_reserva: reserva.id_reserva,
        monto: parseFloat(reserva.precio_total),
        canchaNombre: reserva.cancha_nombre,
        fecha: fecha,
        hora: hora
      }
    });
  };

  // ¡ESTA ES LA FUNCIÓN QUE FALTABA O ESTABA MAL COLOCADA!
  const handleVerComprobante = (reserva) => {
    const fecha = new Date(reserva.fecha_hora_inicio).toLocaleDateString('es-ES', { 
      day: 'numeric', month: 'long', year: 'numeric' 
    });
    const horaInicio = new Date(reserva.fecha_hora_inicio).toLocaleTimeString('es-ES', { 
      hour: '2-digit', minute: '2-digit' 
    });
    const horaFin = new Date(reserva.fecha_hora_fin).toLocaleTimeString('es-ES', { 
      hour: '2-digit', minute: '2-digit' 
    });
    const hora = `${horaInicio} - ${horaFin}`;

    navigate('/reservar/comprobante', {
      replace: true, 
      state: {
        id_reserva: reserva.id_reserva,
        monto: parseFloat(reserva.precio_total),
        cancha: reserva.cancha_nombre,
        fecha: fecha,
        hora: hora,
        metodo: reserva.metodo_pago || 'N/A', 
        operacion: reserva.id_transaccion_externa || 'N/A' 
      }
    });
  };

  // --- Clases para las pestañas ---
  const getTabClass = (tabName) => {
    const isActive = activeTab === tabName;
    return `py-2 px-4 font-semibold rounded-t-lg transition-colors ${
      isActive
        ? 'border-b-2 border-blue-600 text-blue-600'
        : 'text-gray-500 hover:text-gray-700'
    }`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Reservas</h2>
      
      <div className="flex border-b border-gray-300 mb-6">
        <button
          className={getTabClass('proximos')}
          onClick={() => setActiveTab('proximos')}
        >
          Próximos
        </button>
        <button
          className={getTabClass('historial')}
          onClick={() => setActiveTab('historial')}
        >
          Historial
        </button>
      </div>
      
      {isLoading && <p>Cargando reservas...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!isLoading && !error && (
        <div className="space-y-6">
          {displayedReservas.length === 0 ? (
            <p className="text-gray-600">
              {activeTab === 'proximos'
                ? 'No tienes próximas reservas.'
                : 'No tienes reservas en tu historial.'
              }
            </p>
          ) : (
            displayedReservas.map((reserva) => (
              <ReservationCard
                key={reserva.id_reserva}
                reserva={reserva}
                onCancelar={handleCancelar}
                onModificar={handleOpenEditModal}
                onCompartir={handleOpenShareModal}
                onDejarReseña={handleDejarReseña}
                onPagarAhora={handlePagarAhora}
                onVerComprobante={handleVerComprobante} // ¡Ahora sí existe!
                API_URL={API_URL} 
              />
            ))
          )}
        </div>
      )}

      {isEditModalOpen && (
        <ModalModificarReserva 
          reserva={selectedReserva}
          onClose={handleCloseEditModal}
          onSave={handleSaveSuccess}
        />
      )}

      {isShareModalOpen && (
        <ModalCompartirReserva
          reserva={sharingReserva}
          onClose={handleCloseShareModal}
        />
      )}
    </div>
  );
};

export default Reservations;