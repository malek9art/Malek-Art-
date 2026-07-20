import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './auth/authProvider.tsx';
import './index.css';
console.log("DEPLOY VERIFY", "21168dda0b1fcc564cf1dcebdb9f80c05e81229a");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
