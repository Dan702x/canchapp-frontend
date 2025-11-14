// src/lib/api.js

const BASE_URL = import.meta.env.VITE_API || 'http://localhost:8080/api';

export async function get(path){
  const r = await fetch(`${BASE_URL}${path}`, { credentials:'include' });
  if(!r.ok) {
    const errorBody = await r.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(errorBody.error || 'Error al hacer GET');
  }
  return r.json();
}

export async function post(path, body){
  const r = await fetch(`${BASE_URL}${path}`, {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    credentials:'include',
    body: JSON.stringify(body)
  });
  if(!r.ok) {
    const errorBody = await r.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(errorBody.error || 'Error al hacer POST');
  }
  return r.json();
}

/*
 *
 * ¡AQUÍ ESTÁ LA NUEVA FUNCIÓN QUE FALTABA!
 *
 */
export async function put(path, body){
  const r = await fetch(`${BASE_URL}${path}`, {
    method:'PUT',
    headers:{ 'Content-Type':'application/json' },
    credentials:'include',
    body: JSON.stringify(body)
  });
  if(!r.ok) {
    const errorBody = await r.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(errorBody.error || 'Error al hacer PUT');
  }
  return r.json();
}

// (Opcional, pero la necesitaremos para "Eliminar Reseña" en Sprint 2)
export async function del(path){
  const r = await fetch(`${BASE_URL}${path}`, {
    method:'DELETE',
    credentials:'include',
  });
  if(!r.ok) {
    const errorBody = await r.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(errorBody.error || 'Error al hacer DELETE');
  }
  return r.json();
}