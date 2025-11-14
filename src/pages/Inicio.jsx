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

  // NUEVO: useEffect para cargar las canchas desde el backend
  useEffect(() => {
    const fetchCanchas = async () => {
      try {
        setIsLoadingCanchas(true);
        setError(null);
        // Llama al endpoint del backend: GET /api/canchas
        const data = await get('/canchas');
        setCanchas(data); // Guarda los datos de la BD en el estado
      } catch (err) {
        console.error("Error al cargar canchas:", err);
        setError("No se pudieron cargar las canchas. Asegúrate de que el backend (puerto 8080) esté funcionando.");
      } finally {
        setIsLoadingCanchas(false);
      }
    };

    fetchCanchas(); // Ejecuta la función al cargar la página
  }, []); // El array vacío [] asegura que solo se ejecute una vez

  // Función que simula la obtención de la ubicación del usuario
  const handleUseLocation = () => {
    console.log("Simulando obtención de ubicación...");
    setIsLoadingLocation(true);

    setTimeout(() => {
      const simulatedUserLocation = { lat: -12.1190, lng: -77.0311 };

      // USA 'canchas' (del estado) en lugar de 'canchasRecomendadas'
      const canchasConDistancia = canchas.map(cancha => {
        const distancia = calculateFakeDistance(simulatedUserLocation, { lat: cancha.lat, lng: cancha.lng });
        return {
          ...cancha,
          distancia: parseFloat(distancia),
        };
      });

      canchasConDistancia.sort((a, b) => a.distancia - b.distancia);

      setCanchas(canchasConDistancia);
      setIsLoadingLocation(false);
      console.log("Ubicación simulada obtenida y distancias calculadas.");
    }, 1000);
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inicio;