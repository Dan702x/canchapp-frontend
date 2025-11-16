// src/pages/Inicio.jsx

import React, { useState, useEffect } from 'react';
import Buscador from '../components/Buscador';
import CardCancha from '../components/CardCancha';
import { get } from '../lib/api'; // CAMBIO: Importa la función 'get' de tu API

// CAMBIO: Eliminamos la importación de canchasRecomendadas

// La función de distancia simulada puede quedarse
const calculateFakeDistance = (userLoc, canchaLoc) => {
  const dx = userLoc.lat - canchaLoc.lat;
  const dy = userLoc.lng - canchaLoc.lng;
  const distance = Math.sqrt(dx * dx + dy * dy) * 111;
  return distance.toFixed(1);
};


const Inicio = () => {
  // CAMBIO: El estado de canchas inicia vacío
  const [canchas, setCanchas] = useState([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // NUEVO: Estados para manejar la carga y errores de la API
  const [isLoadingCanchas, setIsLoadingCanchas] = useState(true);
  const [error, setError] = useState(null);

  const [filtroUbicacion, setFiltroUbicacion] = useState('');
  const [filtroDeporte, setFiltroDeporte] = useState('');
  const [tiposDeporte, setTiposDeporte] = useState([]);


// ¡NUEVO! Cargar tipos de deporte para el filtro
  useEffect(() => {
    const fetchTiposDeporte = async () => {
      try {
        const data = await get('/catalogos/tipos-deporte');
        setTiposDeporte(data);
      } catch (err) {
        console.error("Error al cargar tipos de deporte:", err);
      }
    };
    fetchTiposDeporte();
  }, []);

  // NUEVO: useEffect para cargar las canchas desde el backend
useEffect(() => {
  const fetchCanchas = async () => {
    try {
      setIsLoadingCanchas(true);
      setError(null);

      // ¡NUEVO! Construye la query con los filtros
      const params = new URLSearchParams();
      if (filtroUbicacion) params.append('ubicacion', filtroUbicacion);
      if (filtroDeporte) params.append('deporte', filtroDeporte);

      const data = await get(`/canchas?${params.toString()}`);
      setCanchas(data); 
    } catch (err) {
      console.error("Error al cargar canchas:", err);
      setError("No se pudieron cargar las canchas. Asegúrate de que el backend (puerto 8080) esté funcionando.");
    } finally {
      setIsLoadingCanchas(false);
    }
  };

  fetchCanchas();
}, [filtroUbicacion, filtroDeporte]);

  // ¡NUEVA FUNCIÓN! Pide la ubicación real al navegador
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    setIsLoadingLocation(true);
    
    // 1. Pide la ubicación al navegador
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // ¡Éxito!
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        console.log("Ubicación real obtenida:", userLocation);

        // 2. Calcula la distancia (usando tu función existente)
        const canchasConDistancia = canchas.map(cancha => {
          // Ignora canchas que no tienen coordenadas
          if (!cancha.lat || !cancha.lng) {
            return { ...cancha, distancia: null };
          }
          
          const distancia = calculateFakeDistance(userLocation, { lat: cancha.lat, lng: cancha.lng });
          return {
            ...cancha,
            distancia: parseFloat(distancia),
          };
        });

        // 3. Ordena las canchas
        canchasConDistancia.sort((a, b) => {
          if (a.distancia === null) return 1; // Manda las nulas al final
          if (b.distancia === null) return -1;
          return a.distancia - b.distancia;
        });

        setCanchas(canchasConDistancia);
        setIsLoadingLocation(false);
      },
      (error) => {
        // ¡Error! (Usuario denegó el permiso, etc.)
        console.error("Error al obtener ubicación:", error);
        alert("No se pudo obtener tu ubicación. Asegúrate de dar permisos.");
        setIsLoadingLocation(false);
      }
    );
  };

  return (
    <div>
      {/* Sección Hero (Banner principal) */}
      <div className="bg-blue-700 h-64 w-full relative">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold text-center p-4">
            Reserva tu cancha, <br /> vive tu pasión
          </h1>
        </div>
      </div>

      {/* Componente Buscador */}
      <Buscador 
        onUseLocation={handleUseLocation}
        isLoading={isLoadingLocation}
        tiposDeporte={tiposDeporte}
        filtroUbicacion={filtroUbicacion}
        setFiltroUbicacion={setFiltroUbicacion}
        filtroDeporte={filtroDeporte}
        setFiltroDeporte={setFiltroDeporte}

      />

      {/* Sección de Recomendados (HU-013) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Recomendados
        </h2>

        {/* NUEVO: Muestra estado de carga o error */}
        {isLoadingCanchas && (
          <p className="text-center text-gray-600">Cargando canchas...</p>
        )}
        {error && (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        )}

        {/* Grid de Canchas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Mapeamos desde el estado 'canchas' */}
          {!isLoadingCanchas && canchas.map((cancha) => (
            <CardCancha
              key={cancha.id}
              id={cancha.id}
              nombre={cancha.nombre}
              ubicacion={cancha.ubicacion}
              precio={cancha.precio}
              imagen={cancha.imagen}
              distancia={cancha.distancia}
              is_favorito={cancha.is_favorito}
              estado={cancha.estado}
              tipo_deporte={cancha.tipo_deporte}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inicio;