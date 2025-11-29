// src/pages/RecuperarPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const RecuperarPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulamos el envío
    alert(`Hemos enviado las instrucciones de recuperación a ${email}.\n(Revisa tu bandeja de entrada)`);
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <FaLock className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-center text-gray-900">
            Recuperar Contraseña
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu acceso.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
            >
              Enviar enlace de recuperación
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center gap-2">
            ← Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecuperarPassword;