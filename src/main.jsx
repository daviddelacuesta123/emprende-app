import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Convierte enlaces viejos con "#/" (de antes de las direcciones limpias) a la dirección nueva.
if (location.hash.startsWith('#/')) history.replaceState(null, '', location.hash.slice(1))

// Supabase devuelve los enlaces de correo vencidos o ya usados con "#error_code=...". Fuera de
// /nueva-contrasena (que ya lo explica), se llevan al acceso para mostrar qué pasó.
const authError = new URLSearchParams(location.hash.slice(1)).get('error_code') ?? new URLSearchParams(location.search).get('error_code')
if (authError && location.pathname !== '/nueva-contrasena') history.replaceState(null, '', '/acceso?enlace=vencido')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
