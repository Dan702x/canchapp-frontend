import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../lib/api'; // ¡Importa 'get' y 'post'!
import { useAuth } from '../../context/AuthContext'; // ¡Importa 'useAuth'!

const DeleteAccount = () => {
  const { logout } = useAuth(); // Para cerrar sesión después de eliminar
  const navigate = useNavigate();
  
  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  
  // Estados para la lógica de borrado
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Error general
  const [modalError, setModalError] = useState(null); // Error dentro del modal
  
  // CR-01: Estado para saber si se puede borrar (si tiene reservas)
  const [canDelete, setCanDelete] = useState(false);

  // CR-01: Al cargar, verificar si el usuario tiene reservas activas
  useEffect(() => {
    const checkDeletionStatus = async () => {
      try {
        setError(null);
        await get('/profile/delete-check');
        // Si la API devuelve 200 (OK), puede borrar
        setCanDelete(true);
      } catch (err) {
        // Si la API devuelve 409 (Conflict), no puede borrar
        setCanDelete(false);
        setError(err.message); // Muestra el error "¡Usted tiene reservas...!"
      }
    };
    checkDeletionStatus();
  }, []);

  // CR-02: Manejar la confirmación de borrado
  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    setModalError(null);
    
    if (password.length === 0) {
      setModalError("Debes ingresar tu contraseña.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Llamamos al nuevo endpoint con el password
      const response = await post('/profile/delete-account', { password });
      
      // CR-03: Éxito
      alert(response.mensaje);
      setIsLoading(false);
      setIsModalOpen(false);
      logout(); // Cierra la sesión del frontend
      navigate('/'); // Redirige al inicio
      
    } catch (err) {
      // Error de contraseña incorrecta (401) u otro
      setModalError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-600 mb-6">Eliminar Cuenta</h2>
      
      {/* CR-01: Muestra el error de "Reservas Pendientes" o el botón de eliminar
      */}
      {!canDelete ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p className="font-bold">Acción no permitida</p>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            Estás a punto de eliminar tu cuenta permanentemente. Esta acción no se puede deshacer. 
            Se borrarán todos tus datos, incluyendo historial de reservas y favoritos.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)} // Abre el modal de contraseña
            className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
          >
            Eliminar mi cuenta
          </button>
        </>
      )}

      {/* CR-02: Modal de confirmación de contraseña
      */}
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
              <h3 className="text-xl font-bold text-gray-800 mb-4">Proceso de eliminación</h3>
              <p className="text-gray-600 mb-4">
                Para proceder con la eliminación por favor introduzca su contraseña.
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
                  {isLoading ? 'Eliminando...' : 'Eliminar cuenta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;