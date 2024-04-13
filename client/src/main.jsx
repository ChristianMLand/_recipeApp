import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.jsx';
import AppV2 from './AppV2.jsx';

import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppV2 />
    </BrowserRouter>
  </React.StrictMode>,
)
