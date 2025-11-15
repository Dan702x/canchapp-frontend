// src/components/ModalCompartirReserva.jsx

import React, { useState } from 'react';

// ... (Iconos IconCopiarEnlace e IconCheck se mantienen igual) ...
const IconCopiarEnlace = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101m-.758 4.899l-5.656 5.656" />
  </svg>
);
const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);


const ModalCompartirReserva = ({ reserva, onClose }) => {
  const [hasCopied, setHasCopied] = useState(false);

  if (!reserva) return null;

  // Formateamos los datos para mostrar
  const canchaNombre = reserva.cancha_nombre;
  const fecha = new Date(reserva.fecha_hora_inicio).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const hora = new Date(reserva.fecha_hora_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
  // 1. Obtenemos el "origen" (ej: "http://localhost:5173")
  const baseUrl = window.location.origin;

  // 2. Creamos la URL completa a la página del detalle de la cancha
  const canchaUrl = `${baseUrl}/cancha/${reserva.id_cancha}`;

  // 3. Creamos el nuevo texto para compartir, INCLUYENDO LA URL
  const linkText = `¡Te invito a jugar!
  
Cancha: ${canchaNombre}
Día: ${fecha}
Hora: ${hora}

Mira la cancha aquí: ${canchaUrl}`;
  // --- FIN DEL CAMBIO ---

  // Función para copiar al portapapeles (CR-02)
  const handleCopy = () => {
    try {
      const ta = document.createElement('textarea');
      ta.innerText = linkText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();

      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000); // Resetea el botón
    } catch (err) {
      console.error('Error al copiar: ', err);
      alert('No se pudo copiar el enlace.');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Invita a tus amigos</h3>
        
        <p className="text-gray-600 mb-6">
          Estás invitando a la reserva de:
          <br />
          <strong className="text-blue-600 text-lg">{canchaNombre}</strong>
          <br />
          <span className="font-semibold">{fecha} a las {hora} hs.</span>
        </p>

        {/* El botón de Copiar ahora copia el texto CON la URL */}
        <button 
          onClick={handleCopy}
          className={`w-full flex items-center justify-center py-3 px-5 rounded-lg font-semibold transition-colors border-2 ${
            hasCopied 
              ? 'bg-green-100 text-green-700 border-green-300' 
              : 'bg-white text-gray-800 border-gray-400 hover:bg-gray-100'
          }`}
        >
          {hasCopied ? <IconCheck /> : <IconCopiarEnlace />}
          {hasCopied ? '¡Invitación Copiada!' : 'Copiar Invitación'}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Cerrar
        </button>

      </div>
    </div>
  );
};

export default ModalCompartirReserva;