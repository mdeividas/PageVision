import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('__DEBUG', 'GREETINGS FROM REACT');

ReactDOM.createRoot(document.getElementById('PageVision_')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
