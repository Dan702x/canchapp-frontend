// src/pages/DetalleCancha/SeleccionFecha.jsx
import { useState, useEffect } from 'react'; // ¡MODIFICADO!
import { Link, useNavigate, useParams } from 'react-router-dom';
import { get } from '../../lib/api'; // ¡MODIFICADO!

// ¡MODIFICADO! Ya no importamos canchasData
// import { canchasData } from '../../data/canchasData';

// Función para obtener el primer día del mes (Se mantiene)
const getStartDay = (year, month) => new Date(year, month, 1).getDay();

const SeleccionFecha = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // --- ¡NUEVOS ESTADOS para la API! ---
    const [canchaNombre, setCanchaNombre] = useState('Cargando...');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // --- Fin de nuevos estados ---

    // Estado para la fecha seleccionada
    const [selectedDayNumber, setSelectedDayNumber] = useState(null); // Inicia sin selección

    // Estado para el mes y año actual
    const [currentDate, setCurrentDate] = useState(new Date()); // Inicia en el mes actual

    const [confirming, setConfirming] = useState(false);

    // --- ¡NUEVO! useEffect para cargar datos de la cancha ---
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchCancha = async () => {
            try {
                setIsLoading(true);
                const data = await get(`/canchas/${id}`);
                setCanchaNombre(data.nombre);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar la información de la cancha.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCancha();
    }, [id]);
    // --- Fin de useEffect ---


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
            console.error('Por favor, selecciona una fecha.'); 
            return;
        }
        setConfirming(true);
        
        const dateToPass = new Date(currentYear, currentMonth, selectedDayNumber);

        navigate(`/cancha/${id}/reservar/horario`, { 
            state: { fecha: dateToPass.toISOString() } 
        });
    };

    const formattedDate = selectedDayNumber
        ? new Date(currentYear, currentMonth, selectedDayNumber).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Selecciona un día'; 

    const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    // --- ¡MODIFICADO! Manejo de Carga y Error ---
    if (isLoading) {
        return <div className="text-center py-20"><p>Cargando cancha...</p></div>;
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500">{error}</p>
                <Link to="/" className="text-blue-600">Volver al inicio</Link>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                 <div className="text-sm text-gray-500 mb-4">
                   <Link to="/" className="hover:underline">Inicio</Link>
                   <span className="mx-2">&gt;</span>
                   {/* ¡MODIFICADO! Usa el nombre de la API */}
                   <Link to={`/cancha/${id}`} className="hover:underline">{canchaNombre}</Link>
                   <span className="mx-2">&gt;</span>
                   <span className="font-semibold text-gray-700">Seleccionar Fecha</span>
                 </div>
                
                <div className="bg-white px-4 py-8 sm:p-8 rounded-lg shadow-xl max-w-lg mx-auto"> 
                     <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6">Selecciona la Fecha</h1>

                    <div className="text-center mb-6">
                        <p className="text-base sm:text-lg font-medium text-gray-700">
                            Fecha seleccionada: <span className="font-bold text-blue-600">
                                {formattedDate}
                            </span>
                        </p>
                    </div>

                    <div className="calendar-sim mb-8 p-2 sm:p-4 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center text-base sm:text-lg font-bold text-gray-800 mb-4">
                            <button 
                                onClick={() => changeMonth(-1)}
                                className="text-blue-600 hover:text-blue-800 flex items-center p-1 sm:p-2 rounded hover:bg-gray-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                <span className="hidden sm:inline">Anterior</span>
                            </button>

                            <span className='capitalize text-center'>
                                {monthNames[currentMonth]} {currentYear}
                            </span>

                            <button 
                                onClick={() => changeMonth(1)}
                                className="text-blue-600 hover:text-blue-800 flex items-center p-1 sm:p-2 rounded hover:bg-gray-100"
                            >
                                 <span className="hidden sm:inline">Siguiente</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-7 text-center text-xs sm:text-sm text-gray-500 mb-2">
                            {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(day => <span key={day}>{day}</span>)}
                        </div>
                        
                        <div className="grid grid-cols-7 text-center gap-1 sm:gap-2"> 
                            
                            {[...Array(firstDayIndex)].map((_, i) => <span key={`empty-${i}`} className="w-8 h-8 md:w-10 md:h-10"></span>)}

                            {[...Array(daysInMonth)].map((_, i) => {
                                const day = i + 1;
                                const today = new Date();
                                const currentDay = new Date(currentYear, currentMonth, day);
                                today.setHours(0, 0, 0, 0); 
        
                                const isAvailable = currentDay >= today;
                                const isSelected = selectedDayNumber === day;
                                
                                let classes = "flex items-center justify-center rounded-full cursor-pointer w-8 h-8 text-xs md:w-10 md:h-10 md:text-sm font-semibold"; 

                                if (isSelected) {
                                    classes += " bg-blue-600 text-white";
                                } else if (isAvailable) {
                                    classes += " bg-green-200 text-green-700 hover:bg-green-300";
                                } else {
                                    classes += " text-gray-400 cursor-not-allowed";
                                }

                                return (
                                    <button
                                        key={day} 
                                        type="button"
                                        className={classes}
                                        onClick={isAvailable ? () => setSelectedDayNumber(day) : null}
                                        disabled={!isAvailable}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-xs">
                            <div className="flex items-center"><span className="w-3 h-3 bg-green-200 rounded-full mr-1.5"></span>Disponible</div>
                            <div className="flex items-center"><span className="w-3 h-3 bg-blue-600 rounded-full mr-1.5"></span>Seleccionado</div>
                            <div className="flex items-center text-gray-400"><span>•</span> No disponible</div>
                        </div>
                    </div>
                    
                    <div className="text-center mt-8">
                        <button 
                            onClick={handleConfirmDate}
                            disabled={confirming || !selectedDayNumber} 
                            className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            {confirming ? 'Cargando...' : 'Confirmar Fecha y Ver Horarios'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeleccionFecha;