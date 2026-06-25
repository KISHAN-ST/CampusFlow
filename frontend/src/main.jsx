import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import App from './App';
import './index.css';

const ToastConfig = () => {
  const { dark } = useTheme();
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 3500,
        style: {
          background:   dark ? '#2c2c2e' : '#ffffff',
          color:        dark ? '#f5f5f7' : '#1d1d1f',
          border:       dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)',
          borderRadius: '14px',
          boxShadow:    '0 8px 32px rgba(0,0,0,0.12)',
          fontSize:     '14px',
          fontWeight:   '500',
          padding:      '12px 16px',
        },
        success: { iconTheme: { primary: '#30d158', secondary: '#fff' } },
        error:   { iconTheme: { primary: '#ff3b30', secondary: '#fff' } },
      }}
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
      <ToastConfig />
    </ThemeProvider>
  </React.StrictMode>
);
