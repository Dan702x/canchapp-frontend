import React from 'react';
import { FaMapMarkerAlt, FaFutbol, FaSpinner } from 'react-icons/fa';
import PropTypes from 'prop-types';

const Buscador = ({ onUseLocation, isLoading }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-4xl mx-auto -mt-16 relative z-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Encuentra tu cancha favorita
      </h2>
      
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="flex flex-col">
            <label htmlFor="ubicacion" className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-500" /> Ubicación
            </label>
            <select 
              id="ubicacion" 
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los distritos</option>
              <option value="miraflores">Miraflores</option>
              <option value="surco">Surco</option>
              <option value="la-molina">La Molina</option>
              <option value="san-isidro">San Isidro</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="deporte" className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
              <FaFutbol className="mr-2 text-green-500" /> Deporte
            </label>
            <select 
              id="deporte" 
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los deportes</option>
              <option value="futbol">Fútbol</option>
              <option value="basket">Basket</option>
              <option value="tenis">Tenis</option>
              <option value="voley">Vóley</option>
            </select>
          </div>
        
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 max-w-lg mx-auto">
          
          <button
            type="button"
            onClick={onUseLocation}
            disabled={isLoading}
            className="flex items-center justify-center p-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition duration-300 text-sm font-semibold disabled:opacity-50 disabled:cursor-wait w-full"
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

          <button 
            type="submit"
            className="bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 transition duration-300 w-full"
          >
            Buscar
          </button>
        </div>
        
      </form>
    </div>
  );
};

Buscador.propTypes = {
  onUseLocation: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default Buscador;