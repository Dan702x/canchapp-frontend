import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { canchasData } from '../../data/canchasData';

// Función para obtener el primer día del mes dado (0 = enero, 11 = diciembre)
const getStartDay = (year, month) => new Date(year, month, 1).getDay();

const SeleccionFecha = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const cancha = canchasData.find(c => c.id === parseInt(id));
    
    // Estado para la fecha seleccionada
    const [selectedDayNumber, setSelectedDayNumber] = useState(26);

    // Estado para el mes y año actual
    const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // Octubre 2025

    const [confirming, setConfirming] = useState(false);

    // --- Lógica del Calendario Dinámico ---
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = (getStartDay(currentYear, currentMonth) + 6) % 7; // Ajuste Lunes = 0

    const changeMonth = (delta) => {
        const newMonth = currentMonth + delta;
        setCurrentDate(new Date(currentYear, newMonth, 1));
        setSelectedDayNumber(null); 
    };

    // --- Lógica de Reserva y Redirección ---
    const handleConfirmDate = () => {
        if (!selectedDayNumber) {
            // En una app real, mostrarías un mensaje más amigable
            console.error('Por favor, selecciona una fecha.'); 
            return;
        }
        setConfirming(true);
        
        const dateToPass = new Date(currentYear, currentMonth, selectedDayNumber);

        navigate(`/cancha/${id}/reservar/horario`, { 
            state: { fecha: dateToPass.toISOString() } 
        });

        // Simula tiempo de carga o transición
        // setTimeout(() => setConfirming(false), 500); // Comentado, la navegación es inmediata
    };

    const formattedDate = selectedDayNumber
        ? new Date(currentYear, currentMonth, selectedDayNumber).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Selecciona un día'; 

    // Datos simulados (solo para marcar algunos días disponibles)
    const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    if (!cancha) {
        return (
            <div className="text-center py-20">
                <p>Cancha no encontrada.</p>
                <Link to="/" className="text-blue-600">Volver al inicio</Link>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-50 min-h-screen"> {/* Asegura fondo gris */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* Migas de pan (simplificado) */}
                 <div className="text-sm text-gray-500 mb-4">
                   <Link to="/" className="hover:underline">Inicio</Link>
                   <span className="mx-2">&gt;</span>
                   <Link to={`/cancha/${id}`} className="hover:underline">{cancha.nombre}</Link>
                   <span className="mx-2">&gt;</span>
                   <span className="font-semibold text-gray-700">Seleccionar Fecha</span>
                 </div>
                
                {/* MODIFICADO: Padding responsivo */}
                <div className="bg-white px-4 py-8 sm:p-8 rounded-lg shadow-xl max-w-lg mx-auto"> 
                    {/* MODIFICADO: Quitada la cabecera con botón Reservar */}
                     <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6">Selecciona la Fecha</h1>

                    {/* Fecha seleccionada */}
                    <div className="text-center mb-6">
                        <p className="text-base sm:text-lg font-medium text-gray-700">
                            Fecha seleccionada: <span className="font-bold text-blue-600">
                                {formattedDate}
                            </span>
                        </p>
                    </div>

                    {/* Calendario */}
                    {/* MODIFICADO: Padding responsivo */}
                    <div className="calendar-sim mb-8 p-2 sm:p-4 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center text-base sm:text-lg font-bold text-gray-800 mb-4">
                            {/* MODIFICADO: Botones más compactos en móvil */}
                            <button 
                                onClick={() => changeMonth(-1)}
                                className="text-blue-600 hover:text-blue-800 flex items-center p-1 sm:p-2 rounded hover:bg-gray-100" // Padding añadido
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                <span className="hidden sm:inline">Anterior</span> {/* Oculta texto en móvil */}
                            </button>

                            <span className='capitalize text-center'> {/* Centrado */}
                                {monthNames[currentMonth]} {currentYear}
                            </span>

                            {/* MODIFICADO: Botones más compactos en móvil */}
                            <button 
                                onClick={() => changeMonth(1)}
                                className="text-blue-600 hover:text-blue-800 flex items-center p-1 sm:p-2 rounded hover:bg-gray-100" // Padding añadido
                            >
                                 <span className="hidden sm:inline">Siguiente</span> {/* Oculta texto en móvil */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                        
                        {/* Días semana */}
                        <div className="grid grid-cols-7 text-center text-xs sm:text-sm text-gray-500 mb-2">
                            {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(day => <span key={day}>{day}</span>)}
                        </div>
                        
                        {/* Días mes */}
                        {/* MODIFICADO: Gap responsivo */}
                        <div className="grid grid-cols-7 text-center gap-1 sm:gap-2"> 
                            
                            {/* Relleno */}
                             {/* MODIFICADO: Tamaño responsivo */}
                            {[...Array(firstDayIndex)].map((_, i) => <span key={`empty-${i}`} className="w-8 h-8 md:w-10 md:h-10"></span>)}

                            {/* Días */}
                            {[...Array(daysInMonth)].map((_, i) => {
                                const day = i + 1;
                                // Comprueba si el día es hoy o en el futuro
const today = new Date();
const currentDay = new Date(currentYear, currentMonth, day);
today.setHours(0, 0, 0, 0); // Pone la hora a 00:00 para comparar solo fechas
        
const isAvailable = currentDay >= today; // Solo disponible si es hoy o futuro
                                const isSelected = selectedDayNumber === day;
                                const isMaintenance = day === 3; // Ejemplo
                                
                                // MODIFICADO: Clases de tamaño y fuente responsivas
                                let classes = "flex items-center justify-center rounded-full cursor-pointer w-8 h-8 text-xs md:w-10 md:h-10 md:text-sm font-semibold"; 

                                if (isMaintenance) {
                                    classes += " bg-gray-300 text-gray-600 cursor-not-allowed line-through relative";
                                } else if (isSelected) {
                                    classes += " bg-blue-600 text-white";
                                } else if (isAvailable) {
                                    classes += " bg-green-200 text-green-700 hover:bg-green-300";
                                } else {
                                    classes += " text-gray-400 cursor-not-allowed"; // No clickeable si no está disponible
                                }

                                return (
                                    <button // Cambiado a button para mejor accesibilidad
                                        key={day} 
                                        type="button" // Previene envío de formulario si estuviera dentro de uno
                                        className={classes}
                                        onClick={isMaintenance || !isAvailable ? null : () => setSelectedDayNumber(day)} // Solo permite click si está disponible
                                        disabled={isMaintenance || !isAvailable} // Deshabilita si no está disponible
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Leyenda (Opcional, pero útil) */}
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-xs">
                            <div className="flex items-center"><span className="w-3 h-3 bg-green-200 rounded-full mr-1.5"></span>Disponible</div>
                            <div className="flex items-center"><span className="w-3 h-3 bg-blue-600 rounded-full mr-1.5"></span>Seleccionado</div>
                             <div className="flex items-center"><span className="w-3 h-3 bg-gray-300 rounded-full mr-1.5 line-through"></span>Mantenimiento</div>
                            <div className="flex items-center text-gray-400"><span>•</span> No disponible</div>
                        </div>
                    </div>
                    
                    {/* Botón Confirmar Fecha */}
                    <div className="text-center mt-8"> {/* Añadido margen superior */}
                        <button 
                            onClick={handleConfirmDate}
                            disabled={confirming || !selectedDayNumber} 
                            className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto" // Ancho completo en móvil
                        >
                            {confirming ? 'Cargando...' : 'Confirmar Fecha y Ver Horarios'}
                        </button>
                    </div>
                    
                    {/* Sección horarios (Simplificada como placeholder) */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                         <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Horarios disponibles</h3>
                         <div className="text-center py-4 text-gray-500 italic">
                             Selecciona una fecha disponible para ver los horarios.
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeleccionFecha;
