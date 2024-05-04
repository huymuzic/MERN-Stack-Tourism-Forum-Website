import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import "bootstrap/dist/css/bootstrap.min.css";
import 'remixicon/fonts/remixicon.css'

import { UserProvider } from './utils/UserContext';
import { BrowserRouter } from 'react-router-dom'
import {UserInfoProvider } from './utils/UserInforContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <UserInfoProvider>
            <App />
        </UserInfoProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
