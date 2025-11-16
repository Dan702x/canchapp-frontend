// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { get, post } from '../lib/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  // Función para Iniciar Sesión
  const login = (userData) => {
    setUser(userData.user);
    // El token se guarda en una cookie HttpOnly desde el backend
  };

// Función para Cerrar Sesión
  const logout = async () => {
    try {
      await post('/logout', {}); 
    } catch (err) {
      console.error("Error al cerrar sesión en el backend:", err);
    } finally {
      setUser(null);
      navigate('/'); // <-- ¡AQUÍ ESTÁ LA CORRECCIÓN!
    }
  };
  
  // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
  // 1. Definimos la función para recargar el perfil FUERA del useEffect
  const refreshUser = async () => {
    try {
      const userData = await get('/profile'); 
      setUser(userData); // Si esto tiene éxito, estamos logueados
    } catch (err) {
      console.log("No hay sesión activa.");
      setUser(null);
    }
  };

  // 2. El useEffect ahora solo llama a la función
  useEffect(() => {
    const checkSessionOnLoad = async () => {
      await refreshUser();
      setIsLoading(false); // Marcamos como cargado después del primer chequeo
    }
    checkSessionOnLoad();
  }, []);
  // --- FIN DE LA CORRECCIÓN ---


  // Muestra un "cargando" mientras verifica la sesión
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Cargando...</div>;
  }

  return (
    // 3. Pasamos la función refreshUser al contexto
    <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};