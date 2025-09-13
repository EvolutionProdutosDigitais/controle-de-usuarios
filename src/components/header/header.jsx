import React from 'react';
import { NavLink, Link, useNavigate } from "react-router-dom";
import { IconHome, IconUsers, IconCash, IconUserCircle } from "@tabler/icons-react";
import imagem from './logo.webp';
import { useAuth } from "../../auth/AuthContext";               // 👈
import { useAlert } from "../../components/utils/ui/AlertContext"; // 👈 opcional

export function Header() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();       // 👈 pega logout e (opcional) user
  const { success } = useAlert();           // 👈 opcional

  const handleLogout = (e) => {
    e.preventDefault();
    logout();                               // zera isAuthenticated e limpa localStorage
    success?.("Você saiu da conta.", { heading: "Logout", scope: "global" }); // opcional
    navigate("/login", { replace: true });  // volta para login
  };

  return (
    <header className="navbar navbar-expand-md navbar-light d-print-none sticky-top bg-white border-bottom">
      <div className="container-xl">

        {/* Marca (clique volta pra Home) */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src={imagem} className="logoHeader" alt="logo evolution" />
        </Link>

        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <span className="nav-link-icon"><IconHome size={24} /></span>
              <span className="nav-link-title">Home</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/alunos" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <span className="nav-link-icon"><IconUsers size={24} /></span>
              <span className="nav-link-title">Alunos</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/pagamentos" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <span className="nav-link-icon"><IconCash size={24} /></span>
              <span className="nav-link-title">Pagamentos</span>
            </NavLink>
          </li>
        </ul>

        <div className="navbar-nav flex-row order-md-last ms-auto">
          <div className="nav-item dropdown">
            {/* Botão que abre o dropdown (Bootstrap) */}
            <button
              className="nav-link d-flex lh-1 text-reset bg-transparent border-0"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="nav-link-icon"><IconUserCircle size={24} /></span>
              <div className="d-none d-xl-block ps-2 text-start">
                <div>{user?.email || "Evolution Sports"}</div>
                <div className="mt-1 small text-secondary">Administrador</div>
              </div>
            </button>

            <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              {/* Outros itens… */}
              {/* <div className="dropdown-divider"></div> */}

              {/* ✅ Logout real (SPA) */}
              <button type="button" className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
