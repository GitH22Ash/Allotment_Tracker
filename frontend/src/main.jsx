import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('API_BASE (build):', import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');
// also expose it to window for quick runtime check:
window.__API_BASE__ = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
