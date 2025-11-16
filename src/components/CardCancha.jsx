import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { post, del } from '../lib/api'; 
import { useAuth } from '../context/AuthContext'; 

// --- Iconos (Sin cambios) ---
const IconMapMarker = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-400 mr-2 flex-shrink-0 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const IconHeart = ({ isFavorite }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill={isFavorite ? 'currentColor' : 'none'} stroke="white" strokeWidth={1.5}>
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

// --- Componente Principal ---

// ¡CAMBIO 1: Añadida la prop "estado" con valor por defecto true!
const CardCancha = ({ id, nombre, ubicacion, precio, imagen, distancia = null, is_favorito = false, estado = true, tipo_deporte = 'Deporte' }) => {
  
  const { user } = useAuth(); 
  const [isFavorite, setIsFavorite] = useState(is_favorito);

  // Sincroniza el estado si el prop cambia (Sin cambios)
  useEffect(() => {
    setIsFavorite(is_favorito);
  }, [is_favorito]);

  // Manejador async que usa la API (Sin cambios)
  const handleFavoriteClick = async (e) => {
    e.preventDefault();  
    e.stopPropagation(); 
    
    if (!user) {
      alert("Debes iniciar sesión para añadir favoritos.");
      return;
    }

    const originalState = isFavorite;
    setIsFavorite(!originalState); // Actualización optimista

    try {
      if (originalState) {
        await del(`/favoritos/${id}`); // Borrar
      } else {
        await post('/favoritos', { id_cancha: id }); // Añadir
      }
    } catch (err) {
      console.error("Error al cambiar favorito:", err);
      setIsFavorite(originalState); // Revertir si falla
      alert(`Error al guardar favorito: ${err.message}`);
    }
  };

  return (
    // ¡CAMBIO 2: Lógica de "estado" aplicada al Link!
    <Link 
      to={`/cancha/${id}`}
      // Previene la navegación si la cancha está inactiva (en mantenimiento)
      onClick={(e) => !estado && e.preventDefault()} 
      // Añade 'relative' para el overlay y 'opacity-60' si está inactiva
      className={`bg-white rounded-lg shadow-lg overflow-hidden flex flex-col relative ${estado ? 'transform hover:-translate-y-1 transition-all duration-300' : 'opacity-60'}`}
    >
      
      {/* ¡CAMBIO 3: Overlay de Mantenimiento! */}
      {!estado && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-10">
              <span className="text-white font-bold text-lg px-4 py-2 border-2 border-white rounded">En Mantenimiento</span>
          </div>
      )}

      {/* El resto del contenido de la tarjeta */}
      <div className="relative">
        <img 
          className="w-full h-48 object-cover" 
          src={imagen} 
          alt={`Imagen de ${nombre}`} 
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/CCCCCC/FFFFFF?text=Imagen+No+Disponible'; }}
        />
        {user && (
          <button
            onClick={handleFavoriteClick}
            // Deshabilita el botón de favorito si la cancha está en mantenimiento
            disabled={!estado} 
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${isFavorite ? 'text-red-500 bg-white/70' : 'text-white/80 bg-black/30 hover:text-red-400'} disabled:opacity-50`}
            aria-label="Marcar como favorito"
          >
            <IconHeart isFavorite={isFavorite} />
          </button>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-blue-600 uppercase mb-1">{tipo_deporte}</span>
        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{nombre}</h3>
        <div className="text-gray-600 mb-3">
          <div className="flex items-center">
            <IconMapMarker /> 
            <p className="text-sm truncate">{ubicacion}</p>
          </div>
          {distancia && (
            <div className="flex items-center text-sm text-blue-600 font-semibold mt-1 ml-1 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Aprox. a {distancia} km de ti</p>
            </div>
          )}
        </div>
        <p className="text-lg font-semibold text-blue-600 mt-auto">
          S/ {parseFloat(precio).toFixed(2)} <span className="text-sm font-normal text-gray-500">x hora</span>
        </p>
      </div>
    </Link>
  );
};

// ¡CAMBIO 4: Añadir "estado" a los propTypes!
CardCancha.propTypes = {
  id: PropTypes.number.isRequired,
  nombre: PropTypes.string.isRequired,
  ubicacion: PropTypes.string.isRequired,
  precio: PropTypes.number.isRequired,
  imagen: PropTypes.string.isRequired,
  distancia: PropTypes.number,
  is_favorito: PropTypes.bool,
  estado: PropTypes.bool,
  tipo_deporte: PropTypes.string,
};

export default CardCancha;