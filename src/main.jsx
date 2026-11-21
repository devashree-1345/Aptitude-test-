import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('main.jsx: Starting application rendering')
const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('main.jsx: Root element not found')
} else {
  console.log('main.jsx: Root element found')
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
