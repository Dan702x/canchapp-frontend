export const canchasData = [
  {
    id: 1,
    nombre: 'La Bombonera de Surco',
    ubicacion: 'Av. Primavera 123, Surco, Lima',
    precio: 70.00,
    imagen: 'https://placehold.co/400x300/3498DB/FFFFFF?text=Cancha+Futbol+1',
    lat: -12.1084,
    lng: -77.0031,
    rating: 4.5,
    gallery: [
      'https://placehold.co/600x400/3498DB/FFFFFF?text=Foto+Principal',
      'https://placehold.co/200x150/3498DB/FFFFFF?text=Foto+2',
      'https://placehold.co/200x150/3498DB/FFFFFF?text=Foto+3',
      'https://placehold.co/200x150/3498DB/FFFFFF?text=Foto+4',
    ],
    description: 'Disfruta de la mejor experiencia de fútbol en nuestras canchas de césped sintético de alta calidad. Perfectas para partidos con amigos o torneos locales. Contamos con iluminación LED para partidos nocturnos.',
    services: [
      { name: 'Estacionamiento', icon: '🚗' },
      { name: 'Baños y Duchas', icon: '🚿' },
      { name: 'Cafetería', icon: '☕' },
      { name: 'Tribunas', icon: '🪑' },
      { name: 'Seguridad', icon: '🛡️' },
    ],
    // NUEVO: Sección de Reseñas
    reviews: [
      {
        id: 1,
        user: 'Juan Pérez',
        rating: 5,
        date: '18/10/2025',
        comment: '¡Excelente cancha! El césped está en perfectas condiciones y la iluminación es de primera. Definitivamente volveré a reservar aquí.'
      },
      {
        id: 2,
        user: 'María Gonzales',
        rating: 4,
        date: '15/10/2025',
        comment: 'Muy buena experiencia. Los servicios (baños y cafetería) estaban limpios. Solo un poco de demora para entrar. Recomendado.'
      }
    ]
  },
  {
    id: 2,
    nombre: 'Estadio Monumental de La Molina',
    ubicacion: 'Jirón El Sol 456, La Molina, Lima',
    precio: 80.00,
    imagen: 'https://placehold.co/400x300/2ECC71/FFFFFF?text=Cancha+Futbol+2',
    lat: -12.0831,
    lng: -76.9535,
    rating: 4.8,
    gallery: [
      'https://placehold.co/600x400/2ECC71/FFFFFF?text=Foto+Principal',
      'https://placehold.co/200x150/2ECC71/FFFFFF?text=Foto+2',
      'https://placehold.co/200x150/2ECC71/FFFFFF?text=Foto+3',
    ],
    description: 'Canchas profesionales con medidas oficiales. Ideal para entrenamiento de equipos y ligas competitivas. El césped se mantiene en perfectas condiciones durante todo el año.',
    services: [
      { name: 'Estacionamiento', icon: '🚗' },
      { name: 'Baños y Duchas', icon: '🚿' },
      { name: 'Bebidas', icon: '🥤' },
    ],
    // NUEVO: Sección de Reseñas
    reviews: [
      {
        id: 1,
        user: 'Carlos Ruiz',
        rating: 5,
        date: '20/10/2025',
        comment: 'La mejor cancha de La Molina, sin duda. Vale cada sol.'
      }
    ]
  },
  {
    id: 3,
    nombre: 'Canchas Basket Miraflores',
    ubicacion: 'Av. Larco 789, Miraflores, Lima',
    precio: 50.00,
    imagen: 'https://placehold.co/400x300/E67E22/FFFFFF?text=Cancha+Basket',
    lat: -12.1219,
    lng: -77.0305,
    rating: 4.2,
    gallery: [
      'https://placehold.co/600x400/E67E22/FFFFFF?text=Foto+Principal',
      'https://placehold.co/200x150/E67E22/FFFFFF?text=Foto+2',
    ],
    description: 'El mejor parquet para basket en el corazón de Miraflores. Aros reglamentarios y espacio bien iluminado.',
    services: [
      { name: 'Baños', icon: '🚻' },
      { name: 'Bebidas', icon: '🥤' },
    ],
    // NUEVO: Sección de Reseñas (vacío para probar)
    reviews: []
  },
  {
    id: 4,
    nombre: 'Tenis Club San Isidro',
    ubicacion: 'Calle Las Flores 101, San Isidro, Lima',
    precio: 60.00,
    imagen: 'https://placehold.co/400x300/F1C40F/FFFFFF?text=Cancha+Tenis',
    lat: -12.0950,
    lng: -77.0381,
    rating: 4.6,
    gallery: [
      'https://placehold.co/600x400/F1C40F/FFFFFF?text=Foto+Principal',
      'https://placehold.co/200x150/F1C40F/FFFFFF?text=Foto+2',
      'https://placehold.co/200x150/F1C40F/FFFFFF?text=Foto+3',
    ],
    description: 'Canchas de arcilla de primer nivel. Disfruta del tenis en un ambiente exclusivo y tranquilo.',
    services: [
      { name: 'Estacionamiento', icon: '🚗' },
      { name: 'Baños y Duchas', icon: '🚿' },
      { name: 'Restaurante', icon: '🍽️' },
    ],
    // NUEVO: Sección de Reseñas
    reviews: [
      {
        id: 1,
        user: 'Ana Fernández',
        rating: 5,
        date: '22/10/2025',
        comment: 'Impecable, como siempre. El club se mantiene en perfectas condiciones.'
      }
    ]
  }
];