import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-auto">
      <div className="max-w-7xl mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} CanchApp. Todos los derechos reservados.</p>
        <p className="text-sm text-gray-400 mt-2">
          Proyecto de Curso - Universidad
        </p>
      </div>
    </footer>
  );
};

export default Footer;