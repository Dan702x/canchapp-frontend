// src/pages/DetalleCancha/ComprobantePago.jsx

import { Link, useNavigate, useLocation } from 'react-router-dom'; // CAMBIO: Importa useLocation
import { useState } from 'react'; // <-- AÑADE
import { post } from '../../lib/api'; // <-- AÑADE

// Componente para el ícono de verificación
const IconCheckSquare = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const ComprobantePago = () => {
    const navigate = useNavigate();
    const location = useLocation(); // CAMBIO: Hook para leer el estado

    const [isSending, setIsSending] = useState(false);

    // CAMBIO: Recupera los datos del comprobante pasados desde DetallePago
    const data = location.state || {
        cancha: 'Cancha (Error)',
        fecha: 'Fecha (Error)',
        hora: 'Hora (Error)',
        metodo: 'Método (Error)',
        monto: 0.00,
        operacion: 'Error-000',
    };
    
    const API_URL = import.meta.env.VITE_API || 'http://localhost:8080/api';

    const handleSendEmail = async () => {
        if (!data.id_reserva) {
            alert("Error: No se encontró ID de reserva.");
            return;
        }
        setIsSending(true);
        try {
            const response = await post(`/reservas/${data.id_reserva}/enviar-comprobante`, {});
            alert(response.mensaje);
        } catch (err) {
            alert(`Error al enviar el correo: ${err.message}`);
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center py-10 px-4">
            <div className="max-w-xl w-full p-8 bg-white rounded-lg shadow-2xl">
                
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center border-b pb-4">
                    Comprobante de pago
                </h1>

                {/* Mensaje de éxito */}
                <div className="flex items-center justify-center text-xl font-semibold text-green-700 mb-8">
                    <IconCheckSquare /> Pago realizado con éxito
                </div>

                {/* CAMBIO: Detalles del Comprobante (AHORA CON DATOS REALES) */}
                <div className="border border-gray-300 p-6 rounded-lg text-left space-y-2 text-base font-medium mb-10">
                    <p><strong>Cancha:</strong> {data.cancha}</p>
                    <p><strong>Fecha:</strong> {data.fecha}</p>
                    <p><strong>Hora:</strong> {data.hora}</p>
                    <p><strong>Método:</strong> {data.metodo}</p>
                    {/* Asegura que el monto sea un número antes de formatear */}
                    <p><strong>Monto:</strong> S/ {parseFloat(data.monto || 0).toFixed(2)}</p>
                    <p><strong>N° Operación:</strong> {data.operacion}</p>
                </div>
                
                {/* Botones de Acción (Simulados por ahora) */}
                <div className="space-y-4 mb-10 border-b pb-6">
                    {/* --- ¡BOTÓN DE DESCARGA (AHORA ES UN ENLACE)! --- */}
    <div className="flex justify-center">
        <a 
            href={`${API_URL}/reservas/${data.id_reserva}/comprobante-pdf`}
            download
            className="py-3 px-8 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-200 text-center"
        >
            Descargar comprobante
        </a>
    </div>

    {/* --- ¡BOTÓN DE ENVIAR CORREO (AHORA FUNCIONA)! --- */}
    <div className="flex justify-center">
        <button 
            onClick={handleSendEmail}
            disabled={isSending}
            className="py-3 px-8 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-200 disabled:opacity-50"
        >
            {isSending ? 'Enviando...' : 'Enviar a mi correo'}
        </button>
    </div>
</div>

                {/* Botones de Navegación Final */}
                <div className="flex justify-between">
                    <Link to="/" className="py-3 px-6 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200">
                        Volver al inicio
                    </Link>
                    <button 
                        onClick={() => navigate('/perfil/reservas')} 
                        className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Ver mis reservas
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ComprobantePago;