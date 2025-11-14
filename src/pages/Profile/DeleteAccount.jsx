import React from 'react';

const DeleteAccount = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-red-600 mb-6">Eliminar Cuenta</h2>
      <p className="text-gray-600 mb-4">
        Estás a punto de eliminar tu cuenta permanentemente. Esta acción no se puede deshacer. 
        Se borrarán todos tus datos, incluyendo historial de reservas y favoritos.
      </p>
      <button 
        className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
        // onClick={/* Lógica para confirmar y eliminar */}
      >
        Confirmar Eliminación de Cuenta
      </button>
    </div>
  );
};

export default DeleteAccount;