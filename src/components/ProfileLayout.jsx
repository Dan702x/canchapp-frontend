import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const ProfileLayout = () => {
  const linkClasses = "block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white";
  const activeLinkClasses = "bg-blue-500 text-white";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <aside className="md:col-span-1">
          <nav className="bg-white p-4 rounded-lg shadow space-y-1">
            <NavLink 
              to="/perfil/datos"
              className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : 'text-gray-700'}`}
            >
              Datos personales
            </NavLink>
            <NavLink 
              to="/perfil/favoritos"
              className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : 'text-gray-700'}`}
            >
              Mis favoritos
            </NavLink>
            <NavLink 
              to="/perfil/reservas"
              className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : 'text-gray-700'}`}
            >
              Mis reservas
            </NavLink>
            {/* --- NUEVO: NavLink para Mis Reseñas --- */}
            <NavLink 
              to="/perfil/reseñas"
              className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : 'text-gray-700'}`}
            >
              Mis reseñas
            </NavLink>
            {/* --- Fin Nuevo NavLink --- */}
            <NavLink 
              to="/perfil/seguridad"
              className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : 'text-gray-700'}`}
            >
              Seguridad
            </NavLink>
            
            <div className="border-t border-gray-200 !mt-4 !mb-2"></div> 

            <NavLink 
              to="/perfil/eliminar-cuenta"
              className={({ isActive }) => `block py-2.5 px-4 rounded transition duration-200 text-red-600 hover:bg-red-100 ${isActive ? 'bg-red-100 font-medium' : ''}`}
            >
              Eliminar cuenta
            </NavLink>
          </nav>
        </aside>

        <main className="md:col-span-3 bg-white p-6 rounded-lg shadow">
          <Outlet /> 
        </main>

      </div>
    </div>
  );
};

export default ProfileLayout;