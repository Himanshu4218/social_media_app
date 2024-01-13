import React from 'react'
import axios from 'axios'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

axios.defaults.baseURL = `${window.location.origin}`;
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
