import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initTracing } from './lib/tracing'
import './styles/globals.css'
import App from './App.tsx'

initTracing();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
