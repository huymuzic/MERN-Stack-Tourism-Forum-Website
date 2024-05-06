import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';

import "bootstrap/dist/css/bootstrap.min.css";
import 'remixicon/fonts/remixicon.css'

import { UserProvider } from './utils/UserContext';
import { BrowserRouter } from 'react-router-dom'
// import { ToastConfig } from './components/Toast/ToastConfig.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
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
    </BrowserRouter>
  </React.StrictMode>,
)
