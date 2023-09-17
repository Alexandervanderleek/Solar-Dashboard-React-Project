import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './input.css'
import { BrowserRouter as Router } from 'react-router-dom';
import AuthProvider from './context/auth/AuthProvider';
import GlobalState from './context/global/GlobalState';

//Main entry for react App
//Render APP component & Provide Global & Auth State classes to all children components [children inherent from auth/global]
//Enabling us to always access a set of global state variables


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Router>
      <GlobalState>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GlobalState>
    </Router>
  </>
);


