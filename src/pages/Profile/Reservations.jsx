// src/pages/Profile/Reservations.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get, put } from '../../lib/api';
// ¡NUEVO! Importamos el modal que acabamos de crear
import ModalModificarReserva from '../../components/ModalModificarReserva'; 

// Componente para formatear la fecha
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

// Componente para la etiqueta de estado
const StatusBadge = ({ estado }) => {
  const S_STYLES = {
    'pendiente': 'bg-yellow-200 text-yellow-800',
    'confirmada': 'bg-green-200 text-green-800',
    'cancelada': 'bg-red-200 text-red-800',
    'completada': 'bg-blue-200 text-blue-800',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-sm font-semibold ${S_STYLES[estado] || 'bg-gray-200'}`}>
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </span>
  );
};


const Reservations = () => {
  const [reservas, setReservas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NUEVOS ESTADOS PARA EL MODAL (HU-0025) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);

  
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

  const handleCancelar = async (idReserva) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return;
    }
    
    try {
      await put(`/reservas/${idReserva}/cancelar`, {});
      fetchReservas(); 
    } catch (err) {
      console.error(err);
      alert(`Error al cancelar la reserva: ${err.message}`);
    }
  };

  // --- NUEVAS FUNCIONES PARA EL MODAL (HU-0025) ---
  const handleOpenModal = (reserva) => {
    setSelectedReserva(reserva);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReserva(null);
    setIsModalOpen(false);
  };

  // Esta función se la pasamos al modal para que la llame
  // cuando la reserva se haya guardado exitosamente.
  const handleSaveSuccess = () => {
    handleCloseModal(); // Cierra el modal
    fetchReservas(); // Refresca la lista de reservas
  };
  // --- FIN DE NUEVAS FUNCIONES ---

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Reservas</h2>
      
      {isLoading && <p>Cargando reservas...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!isLoading && !error && (
        <div className="space-y-6">
          {reservas.length === 0 ? (
            <p className="text-gray-600">Aún no tienes ninguna reserva.</p>
          ) : (
            reservas.map((reserva) => (
              <div key={reserva.id_reserva} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                  <Link to={`/cancha/${reserva.id_cancha}`} className="text-xl font-bold text-blue-600 hover:underline">
                    {reserva.cancha_nombre}
                  </Link>
                  <StatusBadge estado={reserva.estado} />
                </div>
                
                <p className="text-gray-700 font-semibold">{reserva.nombre_sede}</p>
                <p className="text-sm text-gray-500 mb-2">{reserva.ubicacion_texto}</p>
                
                <p className="text-gray-800">
                  <span className="font-semibold">Fecha:</span> {formatDate(reserva.fecha_hora_inicio)}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Precio:</span> S/ {parseFloat(reserva.precio_total).toFixed(2)}
                </p>

                <div className="flex space-x-3 text-sm mt-4 border-t pt-3">
                  {reserva.estado === 'confirmada' && (
                    <>
                      {/* ¡BOTÓN CONECTADO! */}
                      <button 
                        onClick={() => handleOpenModal(reserva)} 
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        Modificar
                      </button>
                      <button 
                        onClick={() => handleCancelar(reserva.id_reserva)}
                        className="font-medium text-red-600 hover:text-red-800"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                  {reserva.estado === 'completada' && (
                     <Link 
                        to={`/cancha/${reserva.id_cancha}`}
                        // ¡CAMBIO! Aquí le pasamos el ID de la reserva completada
                        state={{ idReservaParaReseñar: reserva.id_reserva }}
                        className="font-medium text-green-600 hover:text-green-800"
                     >
                        Dejar reseña
                     </Link>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* --- ¡NUEVO! Renderiza el modal si está abierto --- */}
      {isModalOpen && (
        <ModalModificarReserva 
          reserva={selectedReserva}
          onClose={handleCloseModal}
          onSave={handleSaveSuccess}
        />
      )}
    </div>
  );
};

export default Reservations;