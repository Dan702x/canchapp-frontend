import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
// ¡CAMBIO! Importamos un ícono que sí existe: FaCheckCircle
import { FaCheckCircle } from 'react-icons/fa';
import { post } from '../lib/api';

const VerificarEmail = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email;

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg text-center">
           <h1 className="text-2xl font-bold text-red-600">Error</h1>
           <p className="text-gray-700">No se ha proporcionado un email para verificar.</p>
           <Link to="/registrar" className="font-medium text-blue-600 hover:text-blue-500">
            Volver a registrarse
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const response = await post('/verify-email', {
        email: email,
        code: code
      });

      setMessage(response.mensaje);
      alert("¡Cuenta verificada! Serás redirigido a Iniciar Sesión.");
      navigate('/login'); 

    } catch (err) {
      console.error("Error en la verificación:", err);
      setError(err.message); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center">
          {/* ¡CAMBIO! Usamos el ícono correcto */}
          <FaCheckCircle className="h-10 w-10 text-blue-600" />
          <h1 className="mt-4 text-3xl font-bold text-center text-gray-900">
            Verifica tu cuenta
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hemos enviado un código de 6 dígitos a:
            <br />
            <strong className="text-gray-800">{email}</strong>
          </p>
          <p className="mt-1 text-center text-sm text-gray-500 italic">
            (Revisa tu bandeja de entrada o spam)
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {message && (
             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{message}</span>
            </div>
          )}

          <div>
            <label htmlFor="code" className="sr-only">Código de Verificación</label>
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              maxLength="6"
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Ingresa el código de 6 dígitos"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Verificando...' : 'Verificar Cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificarEmail;