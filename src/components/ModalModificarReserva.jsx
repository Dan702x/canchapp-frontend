// src/components/ModalModificarReserva.jsx

import React, { useState, useEffect } from 'react';
import { get, put } from '../lib/api';

// --- (Componentes de Iconos y Ayudantes) ---
const getStartDay = (year, month) => new Date(year, month, 1).getDay();

const generateTimeSlots = () => {
    const slots = [];
    for (let h = 9; h <= 22; h++) { 
        slots.push(`${h.toString().padStart(2, '0')}:00`);
    }
    slots.push('23:00');
    return slots;
};

const IconStar = ({ className = "h-5 w-5" }) => (
   <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
   </svg>
);
// --- (Fin de Componentes de Iconos y Ayudantes) ---


const ModalModificarReserva = ({ reserva, onClose, onSave }) => {
    if (!reserva) return null;

    // --- ESTADOS DEL CALENDARIO (de SeleccionFecha) ---
    const [currentDate, setCurrentDate] = useState(new Date(reserva.fecha_hora_inicio));
    const [selectedDayNumber, setSelectedDayNumber] = useState(new Date(reserva.fecha_hora_inicio).getDate());

    // --- ESTADOS DE HORARIOS (de SeleccionHorario) ---
    const [availability, setAvailability] = useState({});
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [startSlot, setStartSlot] = useState(new Date(reserva.fecha_hora_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }).slice(0, 5));
    const [endSlot, setEndSlot] = useState(new Date(reserva.fecha_hora_fin).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }).slice(0, 5));

    const [message, setMessage] = useState(null);
    const allTimeSlots = generateTimeSlots();

    // --- LÓGICA DEL CALENDARIO ---
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = (getStartDay(currentYear, currentMonth) + 6) % 7;
    const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    const changeMonth = (delta) => {
        const newMonth = currentMonth + delta;
        setCurrentDate(new Date(currentYear, newMonth, 1));
        setSelectedDayNumber(null);
        setStartSlot(null);
        setEndSlot(null);
        setAvailability({});
    };

    // --- LÓGICA DE HORARIOS ---
    
    // 1. Carga la disponibilidad cuando cambia el día seleccionado
    useEffect(() => {
        if (!selectedDayNumber) {
            setAvailability({}); // Limpia los slots si no hay día
            return;
        }

        const fetchDisponibilidad = async () => {
            setIsLoadingSlots(true);
            setMessage(null);
            try {
                const newSelectedDate = new Date(currentYear, currentMonth, selectedDayNumber);
                const fechaQuery = newSelectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
                
                const data = await get(`/canchas/${reserva.id_cancha}/disponibilidad?fecha=${fechaQuery}`);
                setAvailability(data);
                
                // Limpia la hora seleccionada si ya no está disponible
                if(data[startSlot] === 'occupied') {
                    setStartSlot(null);
                    setEndSlot(null);
                }

            } catch (err) {
                console.error(err);
                setMessage({ type: 'error', text: 'Failed to fetch' }); // Error que viste
            } finally {
                setIsLoadingSlots(false);
            }
        };

        fetchDisponibilidad();
    }, [selectedDayNumber, currentMonth, currentYear, reserva.id_cancha]); // Dependencias


    // 2. Lógica de clic en un slot
    const getSlotIndex = (time) => allTimeSlots.indexOf(time);
    
    const handleSlotClick = (slot) => {
        setMessage(null);
        const clickedIdx = getSlotIndex(slot);
        const nextSlot = allTimeSlots[clickedIdx + 1];

        if (availability[slot] === 'occupied' || !nextSlot) {
            setMessage({ type: 'error', text: 'Esta hora no está disponible.' });
            setStartSlot(null);
            setEndSlot(null);
            return;
        }
        
        setStartSlot(slot);
        setEndSlot(nextSlot);
    };

    // 3. Estilo del slot
    const getSlotClass = (slot) => {
        if (getSlotIndex(slot) === allTimeSlots.length - 1) return "hidden"; 

        const status = availability[slot] || 'unavailable';
        let classes = "py-2 px-3 rounded text-sm font-medium transition-colors cursor-pointer ";
        
        const isSelected = startSlot === slot;

        if (status === 'occupied') {
            classes += "bg-red-500 text-white cursor-not-allowed line-through shadow-md"; 
        } else if (isSelected) {
            classes += "bg-green-600 text-white shadow-lg ring-2 ring-green-700"; 
        } else if (status === 'available') {
            classes += "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"; 
        } else {
            classes += "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"; 
        }
        return classes;
    };

    // --- LÓGICA DE GUARDAR (HU-0025) ---
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setMessage(null); // Limpia mensajes viejos
        if (!selectedDayNumber || !startSlot) {
            setMessage({ type: 'error', text: 'Debes seleccionar una nueva fecha y hora.' });
            return;
        }

        const newSelectedDate = new Date(currentYear, currentMonth, selectedDayNumber);
        const fecha_hora_inicio = `${newSelectedDate.toISOString().split('T')[0]} ${startSlot}:00`;
        const fecha_hora_fin = `${newSelectedDate.toISOString().split('T')[0]} ${endSlot}:00`;
        
        const precio_total = reserva.precio_total; 

        try {
            // ----- ¡¡¡AQUÍ ESTÁ LA CORRECCIÓN!!! -----
            // No incluimos "/api/" porque api.js ya lo añade.
            await put(`/reservas/${reserva.id_reserva}`, {
                fecha_hora_inicio,
                fecha_hora_fin,
                precio_total
            });
            alert("¡Reserva modificada con éxito!");
            onSave();
        } catch (err) {
            console.error(err);
            // Muestra el error específico del backend si existe
            setMessage({ type: 'error', text: err.message || 'Failed to fetch' });
        }
    };


    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSaveChanges}>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Modificar Reserva</h3>
                    <p className="text-gray-600 mb-2">Estás modificando la reserva para:</p>
                    <p className="text-lg font-semibold text-blue-600 mb-6">{reserva.cancha_nombre}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* --- Columna 1: Calendario --- */}
                        <div className="border-r-0 md:border-r md:pr-6">
                            <h4 className="text-lg font-semibold mb-3">1. Selecciona la nueva fecha</h4>
                            <div className="calendar-sim mb-4 p-2 border rounded-lg bg-gray-50">
                                <div className="flex justify-between items-center text-lg font-bold text-gray-800 mb-4">
                                    <button type="button" onClick={() => changeMonth(-1)} className="p-2 rounded hover:bg-gray-100">&lt;</button>
                                    <span className='capitalize'>{monthNames[currentMonth]} {currentYear}</span>
                                    <button type="button" onClick={() => changeMonth(1)} className="p-2 rounded hover:bg-gray-100">&gt;</button>
                                </div>
                                <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
                                    {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(day => <span key={day}>{day}</span>)}
                                </div>
                                <div className="grid grid-cols-7 text-center gap-2"> 
                                    {[...Array(firstDayIndex)].map((_, i) => <span key={`empty-${i}`} className="w-10 h-10"></span>)}
                                    {[...Array(daysInMonth)].map((_, i) => {
                                        const day = i + 1;
                                        const isSelected = selectedDayNumber === day;
                                        const today = new Date();
                                        const currentDay = new Date(currentYear, currentMonth, day);
                                        today.setHours(0, 0, 0, 0);
                                        const isAvailable = currentDay >= today;

                                        let classes = "flex items-center justify-center rounded-full cursor-pointer w-10 h-10 text-sm font-semibold";
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
                            </div>
                        </div>

                        {/* --- Columna 2: Horarios --- */}
                        <div>
                            <h4 className="text-lg font-semibold mb-3">2. Selecciona la nueva hora</h4>
                            {!selectedDayNumber ? (
                                <p className="text-gray-500">Selecciona un día para ver los horarios.</p>
                            ) : isLoadingSlots ? (
                                <p className="text-gray-500">Cargando horarios...</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {allTimeSlots.slice(0, -1).map(slot => (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => handleSlotClick(slot)}
                                            className={getSlotClass(slot)}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Mensajes de Error y Botones --- */}
                    {message && (
                        <div className={`mt-4 p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-8 border-t pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            disabled={!startSlot || isLoadingSlots}
                        >
                            Confirmar Cambio
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalModificarReserva;