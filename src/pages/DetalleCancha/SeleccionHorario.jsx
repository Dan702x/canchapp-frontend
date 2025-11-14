// pages/DetalleCancha/SeleccionHorario.jsx

import { useState, useEffect } from 'react'; // CAMBIO: Importa useEffect
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { get, post } from '../../lib/api'; // CAMBIO: Importa 'get' y 'post'

// CAMBIO: Eliminamos la importación de canchasData
// import { canchasData } from '../../data/canchasData';

// Función para generar slots (Se mantiene igual)
const generateTimeSlots = () => {
    const slots = [];
    for (let h = 9; h <= 22; h++) { 
        slots.push(`${h.toString().padStart(2, '0')}:00`);
    }
    slots.push('23:00'); // Hora final de cierre
    return slots;
};

// CAMBIO: Eliminamos mockAvailability, vendrá de la API
// const mockAvailability = { ... };

const SeleccionHorario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const selectedDateISO = location.state?.fecha;
    const selectedDate = selectedDateISO ? new Date(selectedDateISO) : null;
    
    // NUEVO: Estados para datos de la API
    const [canchaNombre, setCanchaNombre] = useState('Cargando...');
    const [canchaPrecio, setCanchaPrecio] = useState(0);
    const [availability, setAvailability] = useState({}); // Estado para horarios
    const [isLoading, setIsLoading] = useState(true);
  
    const [startSlot, setStartSlot] = useState(null);
    const [endSlot, setEndSlot] = useState(null);
    const [message, setMessage] = useState(null);

    const allTimeSlots = generateTimeSlots();


    // NUEVO: useEffect para cargar datos de la cancha y disponibilidad
    useEffect(() => {
      // Sube el scroll al cargar
      window.scrollTo(0, 0);

      if (!selectedDate || !id) {
          setIsLoading(false);
          return;
      }

      const fetchDisponibilidad = async () => {
        try {
          setIsLoading(true);
          setMessage(null);
          
          // 1. Carga los detalles de la cancha para nombre y precio
          const canchaData = await get(`/canchas/${id}`);
          setCanchaNombre(canchaData.nombre);
          setCanchaPrecio(canchaData.precio); // Asumimos que el precio es por hora

          // 2. Carga la disponibilidad para esa fecha
          const fechaQuery = selectedDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
          const data = await get(`/canchas/${id}/disponibilidad?fecha=${fechaQuery}`);
          setAvailability(data);
        } catch (err) {
          console.error(err);
          setMessage({ type: 'error', text: 'No se pudo cargar la disponibilidad.' });
        } finally {
          setIsLoading(false);
        }
      };

      fetchDisponibilidad();
    }, [id, selectedDateISO]); // Se ejecuta si cambia el ID o la fecha


    if (!selectedDate) {
        return (
            <div className="text-center py-20">
                <p className="text-xl font-semibold text-red-500">Error: No se seleccionó una fecha válida.</p>
                <Link to={id ? `/cancha/${id}/reservar` : '/'} className="text-blue-600 hover:underline mt-4 inline-block">
                    &larr; Volver a Seleccionar Fecha
                </Link>
            </div>
        );
    }
    
    const getSlotIndex = (time) => allTimeSlots.indexOf(time);


    // CAMBIO: Lógica de selección AHORA USA 'availability'
    const handleSlotClick = (slot) => {
        setMessage(null);
        
        const clickedIdx = getSlotIndex(slot);
        const nextSlot = allTimeSlots[clickedIdx + 1];
        
        // CAMBIO: usa availability
        if (availability[slot] === 'occupied' || !nextSlot) {
            setMessage({ type: 'error', text: 'Esta hora no está disponible.' });
            setStartSlot(null);
            setEndSlot(null);
            return;
        }

        if (startSlot === slot) {
            setStartSlot(null);
            setEndSlot(null);
            return;
        }

        if (!startSlot) {
            // CAMBIO: usa availability
            if (availability[nextSlot] === 'occupied') {
                 setMessage({ type: 'error', text: 'La reserva mínima de 1 hora no puede completarse en esta hora.' });
                 return;
            }
            setStartSlot(slot);
            setEndSlot(nextSlot); 
            return;
        }
        
        // ... (Tu lógica de rango se mantiene)
        const startIdx = getSlotIndex(startSlot);
        const endReferenceIdx = clickedIdx;
        
        const newStartIdx = Math.min(startIdx, endReferenceIdx);
        const newEndIdx = Math.max(startIdx, endReferenceIdx);

        const reservationEndSlot = allTimeSlots[newEndIdx + 1]; 
        
        if (!reservationEndSlot) {
             setMessage({ type: 'error', text: 'El rango seleccionado excede la hora de cierre (23:00).' });
             return;
        }
        
        // CAMBIO: usa availability
        for (let i = newStartIdx; i <= newEndIdx; i++) {
            if (availability[allTimeSlots[i]] === 'occupied') {
                setMessage({ type: 'error', text: 'El rango seleccionado incluye horarios ocupados.' });
                setStartSlot(null);
                setEndSlot(null);
                return;
            }
        }
        
        const newDurationSlots = newEndIdx - newStartIdx + 1;
        if (newDurationSlots < 1) { 
            setMessage({ type: 'error', text: 'Debes seleccionar un bloque de al menos 1 hora.' });
            setStartSlot(null);
            setEndSlot(null);
            return;
        }

        setStartSlot(allTimeSlots[newStartIdx]);
        setEndSlot(reservationEndSlot);
    };
    
    // CAMBIO: Lógica de clases AHORA USA 'availability'
    const getSlotClass = (slot) => {
        const slotIdx = getSlotIndex(slot);
        
        if (slotIdx === allTimeSlots.length - 1) {
            return "hidden"; 
        }

        const status = availability[slot] || 'unavailable'; // CAMBIO
        let classes = "py-2 px-3 rounded text-sm font-medium transition-colors cursor-pointer ";
        
        const startIdx = startSlot ? getSlotIndex(startSlot) : -1;
        const endIdx = endSlot ? getSlotIndex(endSlot) : -1;
        
        const isWithinSelection = startSlot && endSlot && slotIdx >= startIdx && slotIdx < endIdx;

        if (status === 'occupied') {
            classes += "bg-red-500 text-white cursor-not-allowed line-through shadow-md"; 
        } else if (isWithinSelection) {
            classes += "bg-green-600 text-white shadow-lg ring-2 ring-green-700"; 
        } else if (status === 'available') {
            classes += "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"; 
        } else {
            classes += "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"; 
        }
        return classes;
    };

    // CAMBIO: Función para avanzar a la CONFIRMACIÓN FINAL (HU-016)
    const handleConfirmReservation = async () => {
        if (!startSlot || !endSlot) {
            setMessage({ type: 'error', text: 'Debes seleccionar un bloque de 1 hora.' });
            return;
        }
        
        const startIdx = getSlotIndex(startSlot);
        const endIdx = getSlotIndex(endSlot);
        const durationSlots = endIdx - startIdx;
        
        if (durationSlots < 1) {
             setMessage({ type: 'error', text: 'El bloque seleccionado es menor a 1 hora.' });
             return;
        }

        const montoTotal = canchaPrecio * durationSlots;
        
        // Formato DATETIME para MySQL (YYYY-MM-DD HH:MM:SS)
        const fecha_hora_inicio = `${selectedDate.toISOString().split('T')[0]} ${startSlot}:00`;
        const fecha_hora_fin = `${selectedDate.toISOString().split('T')[0]} ${endSlot}:00`;

        try {
          // Llama al backend para crear la reserva en estado 'pendiente'
          const reservaData = await post('/reservas', {
            id_cancha: id,
            fecha_hora_inicio: fecha_hora_inicio,
            fecha_hora_fin: fecha_hora_fin,
            precio_total: montoTotal
          });

          // Navega a la confirmación, pasando los datos Y la NUEVA ID DE RESERVA
          navigate(`/reservar/confirmacion-final`, { 
            state: { 
              id_reserva: reservaData.id_reserva, // ¡Importante!
              canchaNombre: canchaNombre,
              fecha: selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
              hora: `${startSlot} - ${endSlot}`, 
              monto: montoTotal
            }
          });
        } catch (err) {
          console.error(err);
          setMessage({ type: 'error', text: 'Error al intentar crear la reserva. Inténtalo de nuevo.' });
        }
    };

    const formattedDate = selectedDate.toLocaleDateString('es-ES', { 
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });

    // CAMBIO: usa availability
    const availableSlotCount = allTimeSlots.length - 1 - Object.values(availability).filter(s => s === 'occupied').length;


    return (
        <div className="bg-gray-50 min-h-screen py-6 sm:py-12"> 
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <p className="text-sm text-gray-500 mb-6">Inicio &gt; {canchaNombre} &gt; Seleccionar Horario</p>

                <div className="bg-white p-4 sm:p-8 rounded-lg shadow-xl">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-3">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Seleccionar Hora</h1>
                        <button 
                            onClick={handleConfirmReservation}
                            className="w-full sm:w-auto bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50"
                            disabled={!startSlot || !endSlot || isLoading}
                        >
                            {isLoading ? 'Cargando...' : 'Confirmar Reserva'}
                        </button>
                    </div>

                    {/* --- Cabecera de Datos --- */}
                    <div className="flex flex-wrap justify-start gap-2 sm:gap-4 mb-6">
                        <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-2 py-1 rounded-full">
                            Fecha seleccionada: {formattedDate}
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-xs sm:text-sm font-medium px-2 py-1 rounded-full">
                            Bloque seleccionado: {startSlot && endSlot ? `${startSlot} - ${endSlot}` : 'Min. 1h'}
                        </span>
                        <span className="bg-gray-100 text-gray-800 text-xs sm:text-sm font-medium px-2 py-1 rounded-full">
                            Slots libres: {isLoading ? '...' : availableSlotCount}
                        </span>
                    </div>

                    {/* --- Mensajes de Error/Información --- */}
                    {message && (
                        <div 
                            className={`p-3 mb-6 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
                        >
                            {message.text}
                        </div>
                    )}
                    
                    {/* --- Leyenda --- */}
                    <div className="text-sm text-gray-600 mb-6 border-t pt-4">
                        Estado de horarios (<span className="text-green-600">verde = disponible</span>, <span className="text-red-600">rojo = ocupado</span>). La reserva mínima es de **1 hora** (Horas completas).
                    </div>


                    {/* -------------------- HORARIOS (Slots) -------------------- */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {/* NUEVO: Muestra 'cargando' o los slots */}
                      {isLoading ? (
                        <p className="text-gray-500">Cargando horarios...</p>
                      ) : (
                        allTimeSlots.slice(0, -1).map(slot => (
                            <button
                                key={slot}
                                onClick={() => handleSlotClick(slot)}
                                className={getSlotClass(slot)}
                            >
                                {slot}
                            </button>
                        ))
                      )}
                    </div>
                    
                    {/* --- Bloque Seleccionado Actual --- */}
                     <div className="p-4 border-t mt-4 text-center">
                        <p className="text-lg font-semibold text-gray-700">Bloque seleccionado (1 hora):</p>
                        <p className={`text-xl font-bold ${startSlot ? 'text-blue-600' : 'text-gray-400'}`}>
                            {startSlot && endSlot ? `${startSlot} - ${endSlot}` : 'Selecciona una hora de inicio'}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SeleccionHorario;