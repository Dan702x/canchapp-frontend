// src/pages/Empresa/EliminarNegocio.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const EliminarNegocio = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(true); // Inicia en true para el check
  const [error, setError] = useState(null); // Error de la página
  const [modalError, setModalError] = useState(null); // Error del modal

  const [canDelete, setCanDelete] = useState(false);

  // 1. Verificar si la empresa se puede eliminar
  useEffect(() => {
    const checkDeletionStatus = async () => {
      try {
        setError(null);
        await get('/empresa/delete-check');
        setCanDelete(true);
      } catch (err) {
        setCanDelete(false);
        setError(err.message); // Muestra el error "No puedes eliminar..."
      } finally {
        setIsLoading(false);
      }
    };
    checkDeletionStatus();
  }, []);

  // 2. Manejar la confirmación de borrado
  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    setModalError(null);

    if (password.length === 0) {
      setModalError("Debes ingresar tu contraseña.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await post('/empresa/delete-confirm', { password });

      alert(response.mensaje);
      
      await refreshUser();

      setIsLoading(false);
      setIsModalOpen(false);
      // Redirigimos al perfil, ya que ahora es solo un jugador
      navigate('/'); 

    } catch (err) {
      setModalError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-600 mb-6">Eliminar Negocio</h2>

      {isLoading ? (
        <p>Verificando estado del negocio...</p>
      ) : !canDelete ? (
        // Si el checkeo (useEffect) falla
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p className="font-bold">Acción no permitida</p>
          <p>{error || 'No se puede eliminar el negocio.'}</p>
        </div>
      ) : (
        // Si el checkeo es exitoso, muestra el botón
        <>
          <p className="text-gray-600 mb-4">
            Estás a punto de eliminar tu negocio de CanchApp. Esta acción es <strong>permanente</strong> y no se puede deshacer. 
            Se borrarán todas tus sedes, canchas, y tarifas asociadas.
          </p>
          <p className="text-gray-600 mb-4">
            Tu cuenta de jugador seguirá activa. Si deseas eliminar tu cuenta de jugador, deberás hacerlo desde tu Perfil después de eliminar el negocio.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
          >
            Eliminar mi negocio permanentemente
          </button>
        </>
      )}

      {/* Modal de confirmación de contraseña */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleConfirmDelete}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Eliminación</h3>
              <p className="text-gray-600 mb-4">
                Para confirmar, por favor ingresa tu contraseña de usuario.
              </p>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>

              {modalError && (
                <p className="text-red-500 text-sm mt-2">{modalError}</p>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isLoading ? 'Eliminando...' : 'Confirmar y Eliminar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EliminarNegocio;