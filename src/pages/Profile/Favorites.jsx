// src/pages/Profile/Favorites.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get, del } from '../../lib/api'; // ¡Importa get y del!

// Un componente pequeño para la tarjeta de favorito
const FavoriteCard = ({ cancha, onRemove }) => {
  const isActiva = cancha.estado;

  return (
  <div className={`relative bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row gap-4 ${!isActiva ? 'opacity-60' : ''}`}>
    {!isActiva && (
      <div className="absolute inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
          <span className="text-white font-bold text-lg px-4 py-2 border-2 border-white rounded">En Mantenimiento</span>
      </div>
  )}

    <img 
      src={cancha.imagen} 
      alt={cancha.nombre}
      className="w-full sm:w-32 h-24 sm:h-20 object-cover rounded-md flex-shrink-0"
    />
    <div className="flex-grow">
      <Link 
        to={`/cancha/${cancha.id}`} 
        className="text-lg font-semibold text-blue-600 hover:underline"
      >
        {cancha.nombre}
      </Link>
      <p className="text-sm text-gray-600">{cancha.ubicacion}</p>
      <p className="text-base font-semibold text-gray-800 mt-1">
        S/ {cancha.precio.toFixed(2)} / hora
      </p>
    </div>
    <div className="flex flex-col items-start sm:items-end flex-shrink-0">
      <Link 
  to={`/cancha/${cancha.id}`} 
  onClick={(e) => !isActiva && e.preventDefault()} // Previene clic
  className={`py-2 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg mb-2 w-full sm:w-auto text-center ${!isActiva ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
>
        Reservar
      </Link>
      <button 
        onClick={() => onRemove(cancha.id)}
        className="text-sm text-red-500 hover:underline"
      >
        Quitar de favoritos
      </button>
    </div>
  </div>
)};


const Favorites = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavoritos = async () => {
    try {
      setIsLoading(true);
      const data = await get('/favoritos');
      setFavoritos(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar tus favoritos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoritos();
  }, []);

  const handleRemove = async (idCancha) => {
    if (!window.confirm('¿Quitar esta cancha de tus favoritos?')) {
      return;
    }
    try {
      await del(`/favoritos/${idCancha}`);
      // Actualiza la lista en la UI sin recargar la página
      setFavoritos(prev => prev.filter(fav => fav.id !== idCancha));
    } catch (err) {
      console.error(err);
      alert(`Error al quitar favorito: ${err.message}`);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Favoritos</h2>
      
      {isLoading && <p>Cargando favoritos...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!isLoading && !error && (
        <>
          {favoritos.length > 0 ? (
            <div className="space-y-4">
              {favoritos.map((cancha) => (
                <FavoriteCard 
                  key={cancha.id} 
                  cancha={cancha} 
                  onRemove={handleRemove} 
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              Aún no has marcado ninguna cancha como favorita. 
              Usa el ícono de corazón (❤️) en una cancha para guardarla aquí.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Favorites;