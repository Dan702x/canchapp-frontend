// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
// ¡Ya no necesitamos 'js-cookie' aquí!
// import Cookies from 'js-cookie'; 
import { get, post } from '../lib/api'; // Importamos 'get' y 'post'

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  // Función para Iniciar Sesión
  const login = (userData) => {
    setUser(userData.user);
    // El token se guarda en una cookie HttpOnly desde el backend
  };

  // Función para Cerrar Sesión
  const logout = async () => {
    try {
      // ¡NUEVO! Llama al backend para que destruya la cookie
      await post('/logout', {}); 
    } catch (err) {
      console.error("Error al cerrar sesión en el backend:", err);
    } finally {
      setUser(null);
    }
  };
  
  // ¡CORREGIDO! Este es el cambio principal.
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // No intentes leer la cookie. Solo pregunta al backend.
        // El navegador enviará la cookie HttpOnly automáticamente.
        const userData = await get('/profile'); 
        setUser(userData); // Si esto tiene éxito, ¡estamos logueados!
      } catch (err) {
        // Si falla (error 401), significa que no hay sesión.
        console.log("No hay sesión activa.");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserSession();
  }, []);

  // Muestra un "cargando" mientras verifica la sesión
  if (isLoading) {
    // Puedes poner un spinner bonito aquí si quieres
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};