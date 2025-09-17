import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import {MotionConfig} from 'motion/react'
//import { AppProvider } from './context/AppContext.jsx';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>

    <MotionConfig viewport ={{once:true}}>
      <App />
    </MotionConfig>
    
  </BrowserRouter>
);
