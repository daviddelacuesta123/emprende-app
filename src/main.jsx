import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Convierte enlaces viejos con "#/" (de antes de las direcciones limpias) a la dirección nueva.
if (location.hash.startsWith('#/')) history.replaceState(null, '', location.hash.slice(1))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
