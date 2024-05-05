import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import "bootstrap/dist/css/bootstrap.min.css";
import 'remixicon/fonts/remixicon.css'

import { UserProvider } from './utils/UserContext';
import { BrowserRouter } from 'react-router-dom'
import {UserInfoProvider } from './utils/UserInforContext'
import {PostsProvider } from "./utils/PostsContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <UserInfoProvider>
          <PostsProvider>
            <App />
            </PostsProvider>
        </UserInfoProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
