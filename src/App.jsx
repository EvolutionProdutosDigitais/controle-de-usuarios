import React from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { Home } from "./pages/Home/Home";
import { CadastroAlunos } from "./pages/CadastroAlunos/CadastroAlunos";
import { CadastroPagamentos } from "./pages/CadastroPagamentos/CadastroPagamentos";
import { AlunoDetalhe } from "./pages/CadastroAlunos/AlunoDetalhe";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./pages/Login/Login";
import "./index.css";
import "./App.css";

import { AlertProvider } from "./components/utils/ui/AlertContext";
import { AlertOutlet } from "./components/utils/ui/AlertOutlet";

import { useAuth } from "./auth/AuthContext";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <AlertProvider>
      <AlertOutlet scope="global" fixed />
      <div className="page">
        {isAuthenticated && <Header />}

        <main className="container-xl page-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/alunos"
              element={
                <ProtectedRoute>
                  <CadastroAlunos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alunos/:cpf"
              element={
                <ProtectedRoute>
                  <AlunoDetalhe />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pagamentos"
              element={
                <ProtectedRoute>
                  <CadastroPagamentos />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </AlertProvider>
  );
}
