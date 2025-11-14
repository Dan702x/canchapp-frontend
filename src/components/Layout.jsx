import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        {/* Outlet renderiza el componente de la ruta actual (ej: Inicio) */}
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default Layout;