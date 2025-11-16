// src/pages/Empresa/EmpresaLayout.jsx

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const EmpresaLayout = () => {
  const linkClasses = "block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white";
  const activeLinkClasses = "bg-blue-500 text-white";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Negocio</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        <aside className="md:col-span-1">
          <nav className="bg-white p-4 rounded-lg shadow space-y-1">
            {/* --- ¡AÑADE ESTE ENLACE! --- */}
            <NavLink 
              to="/mi-negocio/datos"
              className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : 'text-gray-700'}`}
            >
              Datos de la Empresa
            </NavLink>

            <NavLink 
              to="/mi-negocio/sedes"
              className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : 'text-gray-700'}`}
            >
              Mis Sedes
            </NavLink>
            <NavLink 
              to="/mi-negocio/canchas"
              className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : 'text-gray-700'}`}
            >
              Mis Canchas
            </NavLink>

            <div className="border-t border-gray-200 !mt-4 !mb-2"></div> 
            <NavLink 
              to="/mi-negocio/eliminar"
              className={({ isActive }) => `block py-2.5 px-4 rounded transition duration-200 text-red-600 hover:bg-red-100 ${isActive ? 'bg-red-100 font-medium' : ''}`}
            >
              Eliminar Negocio
            </NavLink>
          </nav>
        </aside>

        <main className="md:col-span-4 bg-white p-6 rounded-lg shadow">
          <Outlet /> 
        </main>

      </div>
    </div>
  );
};

export default EmpresaLayout;