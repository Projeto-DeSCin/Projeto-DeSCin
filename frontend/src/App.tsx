import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from './components/ui/Toast';
import { Header } from './components/layout/Header';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

import Dashboard from './pages/Dashboard';
import Explorar from './pages/Explorar';
import Projeto from './pages/Projeto';
import Wallet from './pages/Wallet';
import Depositar from './pages/Depositar';
import Configuracoes from './pages/Configuracoes';
import Curadoria from './pages/curadoria/index';
import CuratorReview from './pages/curadoria/CuratorReview';
import FounderDashboard from './pages/founder/index';
import CriarProjeto from './pages/founder/CriarProjeto';
import ProjetoDetail from './pages/founder/ProjetoDetail';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ paddingTop: 96, minHeight: '100vh', paddingBottom: 40 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastrar" element={<Register />} />
          <Route path="/recuperar-senha" element={<ForgotPassword />} />

          <Route path="/" element={<Dashboard />} />
          <Route path="/explorar" element={<Explorar />} />
          <Route path="/projetos/:ticker" element={<Projeto />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/depositar" element={<Depositar />} />
          <Route path="/configuracoes" element={<Configuracoes />} />

          <Route path="/curadoria" element={<ProtectedRoute requiredRole="curator"><Curadoria /></ProtectedRoute>} />
          <Route path="/curadoria/:ticker" element={<ProtectedRoute requiredRole="curator"><CuratorReview /></ProtectedRoute>} />
          <Route path="/founder" element={<ProtectedRoute requiredRole="founder"><FounderDashboard /></ProtectedRoute>} />
          <Route path="/founder/:ticker" element={<ProtectedRoute requiredRole="founder"><ProjetoDetail /></ProtectedRoute>} />
          <Route path="/criar-projeto" element={<ProtectedRoute requiredRole="founder"><CriarProjeto /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer />
    </BrowserRouter>
  );
}
