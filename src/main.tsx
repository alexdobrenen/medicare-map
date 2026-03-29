import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import mapboxgl from 'mapbox-gl'
import './index.css'
import App from './App.tsx'

// Fix mapbox-gl worker for Vite bundler
// @ts-expect-error mapbox-gl internals
mapboxgl.workerClass = await import('mapbox-gl/dist/mapbox-gl-csp-worker?worker')
  .then(m => m.default)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
