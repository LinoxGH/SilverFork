import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PaymentPage from './Components/PaymentPage.jsx'
import CartPage from './Components/CartPage.jsx'
import RestaurantDashboard from './Components/RestaurantDashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RestaurantDashboard />
  </StrictMode>,
)
