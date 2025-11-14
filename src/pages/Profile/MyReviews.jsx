// src/pages/Profile/MyReviews.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get, del, put } from '../../lib/api'; // CAMBIO: Importamos 'put'

// --- Componente de Icono de Estrella (Se mantiene) ---
const IconStar = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Componente para renderizar las estrellas (Se mantiene)
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

// --- NUEVO: Copiamos el componente de Input de Estrellas ---
// Lo necesitamos para el modal de edición
const StarRatingInput = ({ rating, setRating }) => {
    return (
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => {
          const ratingValue = i + 1;
          return (
            <button
              type="button" // Previene que el formulario se envíe al hacer clic
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
// --- Fin Componentes de Iconos ---


const MyReviews = () => {
  
  const [userReviews, setUserReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NUEVOS ESTADOS PARA EL MODAL (HU-0020) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 'editingReview' guardará los datos de la reseña que estamos editando
  const [editingReview, setEditingReview] = useState(null); 


  const fetchMyReviews = async () => {
      try {
        setIsLoading(true);
        const data = await get('/resenas/mis-resenas');
        setUserReviews(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar tus reseñas.');
      } finally {
        setIsLoading(false);
      }
  };

  useEffect(() => {
    fetchMyReviews(); 
  }, []); 

  const handleDelete = async (idReseña) => {
      if (!window.confirm('¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer.')) {
          return;
      }
      try {
          await del(`/resenas/${idReseña}`);
          fetchMyReviews(); 
      } catch (err) {
          console.error(err);
          alert(`Error al eliminar la reseña: ${err.message}`);
      }
  };

  // --- NUEVAS FUNCIONES PARA EL MODAL (HU-0020) ---

  // 1. Se llama al hacer clic en "Editar"
  const handleOpenEditModal = (review) => {
    setEditingReview(review); // Guarda la reseña a editar en el estado
    setIsModalOpen(true); // Abre el modal
  };

  // 2. Se llama al hacer clic en "Cancelar" o fuera del modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReview(null); // Limpia el estado
  };

  // 3. Actualiza el estado mientras el usuario escribe en el modal
  const handleEditChange = (e) => {
    setEditingReview({
      ...editingReview,
      comment: e.target.value,
    });
  };

  // 4. Actualiza el estado cuando el usuario cambia las estrellas
  const handleEditRatingChange = (rating) => {
    setEditingReview({
      ...editingReview,
      rating: rating,
    });
  };

  // 5. Se llama al hacer clic en "Guardar cambios"
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingReview) return;

    try {
      // Llama al nuevo endpoint PUT
      await put(`/resenas/${editingReview.id}`, {
        calificacion: editingReview.rating,
        comentario: editingReview.comment
      });
      
      handleCloseModal(); // Cierra el modal
      fetchMyReviews(); // Refresca la lista de reseñas
      alert("¡Reseña actualizada con éxito!");

    } catch (err) {
      console.error(err);
      alert(`Error al actualizar la reseña: ${err.message}`);
    }
  };

  // --- FIN DE NUEVAS FUNCIONES ---


  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Reseñas</h2>

      {isLoading && <p>Cargando reseñas...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <>
          {userReviews.length > 0 ? (
            <div className="space-y-6">
              {userReviews.map((review) => (
                <div key={review.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <Link 
                    to={`/cancha/${review.canchaId}`} 
                    className="text-lg font-semibold text-blue-600 hover:underline mb-1 block"
                  >
                    {review.canchaNombre} 
                  </Link>
                  <div className="flex items-center justify-between mb-2">
                    <ReviewStars rating={review.rating} />
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  
                  <div className="flex space-x-3 text-sm">
                      {/* CAMBIO: El botón "Editar" ahora abre el modal */}
                    <button 
                            onClick={() => handleOpenEditModal(review)}
                            className="text-blue-500 hover:underline"
                        >
                            Editar
                        </button>
                    
                    <button 
                            onClick={() => handleDelete(review.id)}
                            className="text-red-500 hover:underline"
                        >
                            Eliminar
                        </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Aún no has dejado ninguna reseña.</p>
          )}
        </>
      )}

      {/* --- ¡NUEVO! EL MODAL DE EDICIÓN (HU-0020) --- */}
      {isModalOpen && editingReview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
          onClick={handleCloseModal} // Cierra si se hace clic afuera
        >
          <div 
            className="bg-white w-full max-w-lg p-6 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic adentro
          >
            <form onSubmit={handleEditSubmit}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Editar reseña</h3>
              <p className="text-sm text-gray-600 mb-4">
                Estás editando tu reseña para: <strong className="text-blue-600">{editingReview.canchaNombre}</strong>
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Tu calificación:</label>
                {/* Usamos el StarRatingInput con los datos del estado 'editingReview' */}
                <StarRatingInput 
                  rating={editingReview.rating} 
                  setRating={handleEditRatingChange} 
                />
              </div>

              <div className="mb-6">
                <label htmlFor="editComment" className="block text-sm font-semibold text-gray-600 mb-2">Tu comentario:</label>
                <textarea
                  id="editComment"
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Escribe tu experiencia aquí..."
                  value={editingReview.comment}
                  onChange={handleEditChange}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* --- FIN DEL MODAL --- */}
    </div>
  );
};

export default MyReviews;