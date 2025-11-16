// src/App.jsx

import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
// Importaciones de Páginas base
import ConfirmacionFinal from './pages/ConfirmacionFinal';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Registrar from './pages/Registrar';
import VerificarEmail from './pages/VerificarEmail'; // <-- 1. AÑADE ESTA IMPORTACIÓN

// Importaciones de Perfil (Asegúrate que las rutas existan)
import ProfileLayout from './components/ProfileLayout';
import DeleteAccount from './pages/Profile/DeleteAccount';
import Favorites from './pages/Profile/Favorites';
import MyReviews from './pages/Profile/MyReviews';
import PersonalData from './pages/Profile/PersonalData';
import Reservations from './pages/Profile/Reservations';
import Security from './pages/Profile/Security';

// IMPORTACIONES FINALES DESDE LA SUB-CARPETA DetalleCancha
import ComprobantePago from './pages/DetalleCancha/ComprobantePago';
import DetalleCancha from './pages/DetalleCancha/DetalleCancha';
import DetallePago from './pages/DetalleCancha/DetallePago';
import SeleccionFecha from './pages/DetalleCancha/SeleccionFecha';
import SeleccionHorario from './pages/DetalleCancha/SeleccionHorario';

// IMPORTACIONES de Empresa y Solicitudes
import SolicitudEmpresa from './pages/SolicitudEmpresa';
import GestionEmpresas from './pages/Admin/GestionEmpresas';
import EmpresaLayout from './pages/Empresa/EmpresaLayout';
import MisSedes from './pages/Empresa/MisSedes';
import MisCanchas from './pages/Empresa/MisCanchas';
import MiSolicitud from './pages/Empresa/MiSolicitud';
import DatosEmpresa from './pages/Empresa/DatosEmpresa';
import EliminarNegocio from './pages/Empresa/EliminarNegocio';

function App() {
  return (
      <Routes>
        
        {/* --- MODIFICADO --- */}
        {/* Ya NO hay rutas públicas fuera del Layout */}
        
        {/* Rutas Principales (TODAS DENTRO DEL LAYOUT) */}
        <Route path="/" element={<Layout />}>
          
          {/* Página de Inicio */}
          <Route index element={<Inicio />} />
          
          {/* NUEVO: Rutas de Login y Registro (Ahora dentro del Layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Registrar />} />
          
          {/* 2. AÑADE ESTA RUTA */}
          <Route path="/verificar-email" element={<VerificarEmail />} />
          
          {/* --- Fin de rutas movidas --- */}
          
          {/* 1. Detalle de la cancha */}
          <Route path="/cancha/:id" element={<DetalleCancha />} /> 

          {/* 2. Ruta para dejar una reseña */}
          <Route path="/cancha/:id/reseñar/:id_reserva" element={<DetalleCancha />} />

          {/* 2. Selección de fecha */}
          <Route path="/cancha/:id/reservar" element={<SeleccionFecha />} /> 
          
          {/* 3. Selección de horario */}
          <Route path="/cancha/:id/reservar/horario" element={<SeleccionHorario />} />
          
          {/* RUTAS SIN ID DE CANCHA */}
          
          {/* 4. Pasarela de Pago */}
          <Route path="/reservar/pago" element={<DetallePago />} /> 
          
          {/* 5. Comprobante de pago (DESTINO FINAL) */}
          <Route path="/reservar/comprobante" element={<ComprobantePago />} />
          
          {/* 6. Confirmación de reserva (Mantenida) */}
          <Route path="/reservar/confirmacion-final" element={<ConfirmacionFinal />} />

          {/* 7. Solicitar ser una empresa */}
          <Route path="/soy-empresa" element={<SolicitudEmpresa />} />

          {/* 8. Panel de administrador para ver gestion de empresa */}
          <Route path="/admin/empresas" element={<GestionEmpresas />} />

          {/* 9. AÑADE LAS RUTAS DE "MI NEGOCIO" */}
          <Route path="/mi-negocio" element={<EmpresaLayout />}>
            <Route path="datos" element={<DatosEmpresa />} />
            <Route path="sedes" element={<MisSedes />} />
            <Route path="canchas" element={<MisCanchas />} />
            <Route path="eliminar" element={<EliminarNegocio />} />
          </Route>

          {/* 10. Revisar el estado de mi solicitud */}
          <Route path="/mi-solicitud" element={<MiSolicitud />} />

          {/* Rutas de Perfil (Anidadas) */}
          <Route path="/perfil" element={<ProfileLayout />}>
            <Route path="datos" element={<PersonalData />} />
            <Route path="favoritos" element={<Favorites />} />
            <Route path="reservas" element={<Reservations />} />
            <Route path="reseñas" element={<MyReviews />} />
            <Route path="seguridad" element={<Security />} />
            <Route path="eliminar-cuenta" element={<DeleteAccount />} />
          </Route>

        </Route>
        
      </Routes>
  );
}

export default App;