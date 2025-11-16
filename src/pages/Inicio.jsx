// src/pages/Inicio.jsx

import React, { useState, useEffect } from 'react';
import Buscador from '../components/Buscador';
import CardCancha from '../components/CardCancha';
import { get } from '../lib/api'; 

// La función de distancia simulada
const calculateFakeDistance = (userLoc, canchaLoc) => {
  if (!userLoc || !canchaLoc || !canchaLoc.lat || !canchaLoc.lng) {
      return null;
  }
  const dx = userLoc.lat - canchaLoc.lat;
  const dy = userLoc.lng - canchaLoc.lng;
  const distance = Math.sqrt(dx * dx + dy * dy) * 111;
  return distance.toFixed(1);
};


const Inicio = () => {
  const [canchas, setCanchas] = useState([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingCanchas, setIsLoadingCanchas] = useState(true);
  const [error, setError] = useState(null);

  const [filtroUbicacion, setFiltroUbicacion] = useState('');
  const [filtroDeporte, setFiltroDeporte] = useState('');
  const [tiposDeporte, setTiposDeporte] = useState([]);

  // Cargar tipos de deporte para el filtro
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

  // useEffect para cargar las canchas (con filtros)
  useEffect(() => {
    const fetchCanchas = async () => {
      try {
        setIsLoadingCanchas(true);
        setError(null);
        
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
  }, [filtroUbicacion, filtroDeporte]); // Se re-ejecuta si los filtros cambian

  // Función para "Usar mi ubicación"
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        console.log("Ubicación real obtenida:", userLocation);

        const canchasConDistancia = canchas.map(cancha => {
          const distancia = calculateFakeDistance(userLocation, { lat: cancha.lat, lng: cancha.lng });
          return {
            ...cancha,
            distancia: distancia ? parseFloat(distancia) : null,
          };
        });

        canchasConDistancia.sort((a, b) => {
          if (a.distancia === null) return 1;
          if (b.distancia === null) return -1;
          return a.distancia - b.distancia;
        });

        setCanchas(canchasConDistancia);
        setIsLoadingLocation(false);
      },
      (error) => {
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

      {/* Sección de Canchas Disponibles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          {/* Usamos tu nuevo título "Canchas Disponibles" */}
          Canchas Disponibles
        </h2>

        {/* --- ¡AQUÍ ESTÁ LA LÓGICA CORREGIDA! --- */}
        {isLoadingCanchas ? (
          <p className="text-center text-gray-600">Cargando canchas...</p>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        ) : canchas.length === 0 ? (
          // ¡ESTE ES EL MENSAJE QUE PEDISTE!
          <p className="text-center text-gray-500 italic text-lg">
            No se encontraron canchas en la ubicación indicada
          </p>
        ) : (
          // Si hay canchas, muestra el grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {canchas.map((cancha) => (
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
        )}
        {/* --- FIN DE LA LÓGICA --- */}

      </div>
    </div>
  );
};

export default Inicio;