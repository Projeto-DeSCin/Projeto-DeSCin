import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Explorar from './pages/Explorar';
import Projeto from './pages/Projeto';
import Wallet from './pages/Wallet';
import Depositar from './pages/Depositar';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/explorar" element={<Explorar />} />
        <Route path="/projetos/:ticker" element={<Projeto />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/depositar" element={<Depositar />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
