import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';

import "bootstrap/dist/css/bootstrap.min.css";
import 'remixicon/fonts/remixicon.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import { UserProvider } from './utils/UserContext';
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './theme/Theme.jsx';
//import { ToastConfig } from './components/Toast/ToastConfig.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <App />
          <ToastContainer
            autoClose={3000}
            hideProgressBar
            closeButton={false}
            position={'bottom-left'}
            newestOnTop
            pauseOnFocusLoss={false}
            style={{ fontFamily: 'inherit' }}
          />
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
