// src/pages/DetalleCancha/DetalleCancha.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { get, post } from '../../lib/api'; // Asegúrate de importar 'post'

const DetalleCancha = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [cancha, setCancha] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [mainImage, setMainImage] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
  // 1. Movemos la función fetchCanchaDetalle FUERA del useEffect
  // para que otras funciones (como handleSubmitReview) puedan usarla.
  const fetchCanchaDetalle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await get(`/canchas/${id}`);
      setCancha(data);
      setMainImage(data.gallery[0]); 
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la información de la cancha.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. El useEffect ahora solo LLAMA a la función.
  useEffect(() => {
    window.scrollTo(0, 0); // Sube el scroll al cargar
    fetchCanchaDetalle();
  }, [id]); // Se ejecuta cada vez que el 'id' en la URL cambie
  // --- FIN DE LA CORRECCIÓN ---


  // --- Componentes de Iconos SVG (Completos) ---
  const IconStar = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  const IconMapMarker = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
  );

  const IconHeart = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
  );
  
  const ReviewStars = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <IconStar 
            key={i} 
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  const StarRatingInput = ({ rating, setRating }) => {
    return (
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => {
          const ratingValue = i + 1;
          return (
            <button
              type="button"
              key={ratingValue}
              className={`transition-colors ${ratingValue <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
              onClick={() => setRating(ratingValue)}
            >
              <IconStar className="h-8 w-8" />
            </button>
          );
        })}
      </div>
    );
  };
  // --- Fin de Iconos ---

  const handleReservation = () => {
    navigate(`/cancha/${id}/reservar`);
  };

  // Esta función ahora SÍ PUEDE VER a 'fetchCanchaDetalle'
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (newRating === 0 || newComment.trim() === "") {
      alert("Por favor, selecciona una calificación y escribe un comentario.");
      return;
    }

    // --- Lógica para enviar la reseña ---
    // 1. Necesitamos saber qué "reserva completada" estamos reseñando.
    // Buscamos en la BD una reserva completada del usuario para esta cancha
    // (Esto es un truco, idealmente el backend lo validaría con más fuerza)
    const idReservaCompletada = 2; // Simulación (Reserva 2 = "El Camp Nou")
    
    // Solo permitimos reseñar "El Camp Nou" (id=2) en esta demo
    if (id !== "2") {
        alert("Demo: Solo puedes dejar reseñas en 'El Camp Nou de Surco' (cancha id 2) donde tienes una reserva completada.");
        return;
    }
    
    try {
        await post('/resenas', {
            id_reserva: idReservaCompletada,
            calificacion: newRating,
            comentario: newComment
        });
        
        alert("¡Gracias por tu reseña!");
        
        setNewRating(0);
        setNewComment("");
        // ¡Ahora sí puede llamar a la función para refrescar la lista!
        fetchCanchaDetalle(); 
        
    } catch (err) {
        console.error(err);
        alert(`Error al enviar la reseña: ${err.message}`);
    }
  };

  // --- NUEVO: Muestra estados de Carga, Error o No Encontrado ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-700">Cargando cancha...</p>
      </div>
    );
  }
  
  if (error) {
     return (
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
         <h1 className="text-2xl font-bold text-red-500">Error</h1>
         <p className="text-gray-600">{error}</p>
         <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
           &larr; Volver al inicio
         </Link>
       </div>
     );
  }

  if (!cancha) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Cancha no encontrada</h1>
        <p className="text-gray-600">No pudimos encontrar los datos para la cancha con ID: {id}</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          &larr; Volver al inicio
        </Link>
      </div>
    );
  }
  // --- FIN: Estados de Carga ---

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:underline">Inicio</Link>
          <span className="mx-2">&gt;</span>
          <span className="font-semibold text-gray-700">{cancha.nombre}</span>
        </div>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{cancha.nombre}</h1>
            
            <div className="flex items-center gap-4 flex-shrink-0 mt-2 sm:mt-0">
              <span className="text-xl font-semibold text-green-600 bg-green-100 px-4 py-1 rounded-full">
                Disponible
              </span>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-colors duration-200 ${isFavorite ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
                aria-label="Marcar como favorito"
              >
                <IconHeart />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
            <div className="flex items-center text-yellow-500">
              <IconStar className="h-5 w-5" />
              <span className="ml-1 text-gray-700 font-semibold">{cancha.rating}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <IconMapMarker />
              <span>{cancha.ubicacion}</span>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <img 
            src={mainImage} 
            alt="Imagen principal de la cancha" 
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg mb-4"
          />
          <div className="flex gap-2 overflow-x-auto">
            {cancha.gallery.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Miniatura ${index + 1}`}
                onClick={() => setMainImage(img)}
                className={`w-20 h-16 md:w-32 md:h-24 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-blue-500' : 'border-transparent'}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Descripción</h2>
            <p className="text-gray-600 mb-8 whitespace-pre-line">
              {cancha.description}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Servicios</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {cancha.services.map((service) => (
                <div key={service.name} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl mr-3">{service.icon}</span>
                  <span className="text-gray-700">{service.name}</span>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reseñas</h2>
            <div className="space-y-6">
            {/* CAMBIO: Ahora usa cancha.reviews */}
              {cancha.reviews && cancha.reviews.length > 0 ? (
                cancha.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center mb-1">
                      <h3 className="font-semibold text-gray-900">{review.user}</h3>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="mb-2">
                      <ReviewStars rating={review.rating} />
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Aún no hay reseñas para esta cancha.</p>
              )}
            </div>

            {/* --- Formulario para Dejar Reseña (Sprint 2) --- */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Deja tu reseña</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Tu calificación:</label>
                  <StarRatingInput rating={newRating} setRating={setNewRating} />
                  </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-semibold text-gray-600 mb-2">Tu comentario:</label>
                  <textarea
                    id="comment"
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Escribe tu experiencia aquí..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                  disabled={newRating === 0 || newComment.trim() === ""}
                >
                  Publicar reseña
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-24">
              <p className="text-3xl font-bold text-blue-600 mb-4">
                S/ {cancha.precio.toFixed(2)}
                <span className="text-lg font-normal text-gray-500"> / hora</span>
              </p>
              
              <button 
                  onClick={handleReservation}
                  className="w-full bg-blue-600 text-white font-bold p-4 rounded-lg hover:bg-blue-700 transition duration-300 mt-4"
              >
                Reservar Ahora
              </button>
            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
};

export default DetalleCancha;