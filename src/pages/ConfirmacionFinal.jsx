// src/pages/ConfirmacionFinal.jsx

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Componente para el ícono de verificación (Checkmark)
const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const ConfirmacionFinal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [showDetails, setShowDetails] = useState(true); 

    // CAMBIO: Recuperamos los datos pasados desde SeleccionHorario
    const { 
        id_reserva, // ¡NUEVO Y MUY IMPORTANTE!
        canchaNombre = 'Cancha No Especificada', 
        fecha = 'Fecha No Especificada', 
        hora = 'Hora No Especificada', 
        monto = 0.00 
    } = location.state || {}; // Usamos un objeto vacío como fallback
    
    // Datos fijos del mockup
    const nReserva = `R-${id_reserva || '000000'}`; // Usa el ID de reserva real
    const sede = 'Sede Central'; // Esto debería venir de la API también
    const montoSimulado = monto;

    const paymentData = {
        reservaEstado: 'PENDIENTE DE PAGO', 
        metodoPago: '---', 
        precioTotal: montoSimulado.toFixed(2), 
    };

    // CAMBIO: FUNCIÓN PARA EL BOTÓN DE PAGO
    const handleGoToPayment = () => {
        if (!id_reserva) {
            alert("Error: No se encontró un ID de reserva para pagar.");
            return;
        }
        // Redirige a la página de pago simulada
        // NUEVO: Pasa el id_reserva y el monto a la página de pago
        navigate('/reservar/pago', {
            state: {
                id_reserva: id_reserva,
                monto: montoSimulado,
                // Pasa los demás datos para mostrarlos en el comprobante final
                canchaNombre: canchaNombre,
                fecha: fecha,
                hora: hora
            }
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center py-10 px-4">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-2xl text-center">
                
                <h1 className="text-4xl font-bold text-green-600 mb-4 flex items-center justify-center">
                    ¡Reserva confirmada! 
                </h1>
                
                <div className="my-6 border-4 border-green-300 border-dashed rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                    <IconCheck />
                </div>
                
                {/* CAMBIO: Muestra datos reales del 'state' */}
                <div className="text-left space-y-3 mb-6 text-base font-medium">
                    <p><strong>N° Reserva:</strong> <span className="text-blue-600">{nReserva}</span></p>
                    <p><strong>Cancha:</strong> {canchaNombre}</p>
                    <p><strong>Sede:</strong> {sede}</p>
                    <p><strong>Fecha/Hora:</strong> {fecha} {hora}</p>
                    <p><strong>Monto:</strong> <span className="text-green-700 font-bold">S/ {montoSimulado.toFixed(2)}</span></p>
                </div>
                
                {/* ----------------- DETALLES OCULTOS ----------------- */}
                {showDetails && (
                    <div className="bg-gray-100 p-4 mt-4 rounded-lg text-left text-sm space-y-1 mb-6">
                        <p className="font-semibold mb-1">Detalles de la Transacción:</p>
                        
                        <p><strong>Estado de la Reserva:</strong> <span className="text-red-500 font-bold">{paymentData.reservaEstado}</span></p>
                        <p><strong>Método de Pago:</strong> {paymentData.metodoPago}</p>
                        <p><strong>Precio Total:</strong> S/ {paymentData.precioTotal}</p>

                    </div>
                )}
                {/* ----------------- FIN DETALLES OCULTOS ----------------- */}

                <p className="text-gray-600 mb-8 text-sm">
                    Te enviaremos los detalles de tu reserva a tu correo electrónico.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button 
                        onClick={() => setShowDetails(!showDetails)}
                        className="py-2 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200"
                    >
                        {showDetails ? 'Ocultar Detalles' : 'Ver Detalles'}
                    </button>
                    
                    <button 
                        onClick={handleGoToPayment}
                        className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Ir al pago de cancha
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmacionFinal;