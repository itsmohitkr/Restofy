import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

import App from './App.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'
import { RestaurantProvider } from "./Context/RestaurantContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RestaurantProvider>
          <App />
        </RestaurantProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

