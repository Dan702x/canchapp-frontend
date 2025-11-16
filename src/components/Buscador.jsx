import React from 'react';
import { FaMapMarkerAlt, FaFutbol, FaSpinner } from 'react-icons/fa';
import PropTypes from 'prop-types';

// Lista de distritos de Lima
const distritosLima = [
  "Ancón", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos", "Cieneguilla",
  "Comas", "El Agustino", "Independencia", "Jesús María", "La Molina", "La Victoria", "Lince",
  "Los Olivos", "Lurigancho-Chosica", "Lurín", "Magdalena del Mar", "Miraflores", "Pachacámac",
  "Pucusana", "Pueblo Libre", "Puente Piedra", "Punta Hermosa", "Punta Negra", "Rímac",
  "San Bartolo", "San Borja", "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores",
  "San Luis", "San Martín de Porres", "San Miguel", "Santa Anita", "Santa María del Mar",
  "Santa Rosa", "Santiago de Surco", "Surquillo", "Villa El Salvador", "Villa María del Triunfo"
];

// --- ¡ESTA ES LA LÍNEA CORREGIDA! ---
// Ahora aceptamos todas las nuevas props que vienen desde Inicio.jsx
const Buscador = ({ 
  onUseLocation, 
  isLoading,
  tiposDeporte,
  filtroUbicacion,
  setFiltroUbicacion,
  filtroDeporte,
  setFiltroDeporte
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-4xl mx-auto -mt-16 relative z-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Encuentra tu cancha favorita
      </h2>
      
      {/* Este es el formulario que ya actualizaste, ahora funcionará */}
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="flex flex-col">
            <label htmlFor="ubicacion" className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-500" /> Ubicación
            </label>
            <select 
              id="ubicacion" 
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtroUbicacion}
              onChange={(e) => setFiltroUbicacion(e.target.value)}
            >
              <option value="">Todos los distritos</option>
              {distritosLima.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="deporte" className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
              <FaFutbol className="mr-2 text-green-500" /> Deporte
            </label>
            <select 
              id="deporte" 
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtroDeporte}
              onChange={(e) => setFiltroDeporte(e.target.value)}
            >
              <option value="">Todos los deportes</option>
              {tiposDeporte.map(d => (
                <option key={d.id_tipo_deporte} value={d.id_tipo_deporte}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>
        
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={onUseLocation}
            disabled={isLoading}
            className="flex items-center justify-center p-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition duration-300 text-sm font-semibold disabled:opacity-50 disabled:cursor-wait w-full max-w-xs"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            {isLoading ? 'Localizando...' : 'Usar mi ubicación'}
          </button>
        </div>
        
      </form>
    </div>
  );
};

// --- ¡TAMBIÉN CORREGIMOS LOS PROPTYPES! ---
Buscador.propTypes = {
  onUseLocation: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  tiposDeporte: PropTypes.array.isRequired,
  filtroUbicacion: PropTypes.string.isRequired,
  setFiltroUbicacion: PropTypes.func.isRequired,
  filtroDeporte: PropTypes.string.isRequired,
  setFiltroDeporte: PropTypes.func.isRequired,
};

export default Buscador;