import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "../../components/utils/ui/AlertContext";
import { useAuth } from "../../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { success, danger } = useAlert();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => {
    const errs = {};
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Informe um e-mail válido.";
    if (form.password && form.password.length < 4) errs.password = "A senha deve ter pelo menos 4 caracteres.";
    return errs;
  }, [form.email, form.password]);

  useEffect(() => {
    const remembered = localStorage.getItem("remember");
    if (remembered === "1") {
      // recupere email se quiser
    }
  }, []);

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.email || errors.password) {
      danger("Corrija os erros antes de continuar.", { heading: "Erro de validação", scope: "global" });
      return;
    }

    try {
      setLoading(true);

      // mock simples
      const ok = form.email === import.meta.env.VITE_ID_USER && form.password === import.meta.env.VITE_ID_PASSWORD;
      if (!ok) {
        danger("Login ou senha inválidos.");
        return;
      }

      // 🔑 isto liga o isAuthenticated e persiste no localStorage
      await login({ email: form.email });

      if (form.remember) localStorage.setItem("remember", "1");
      else localStorage.removeItem("remember");

      success("Bem-vinda!", { heading: "Login realizado", scope: "global" });

      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      danger("Não foi possível autenticar. Tente novamente.", { heading: "Erro no login", scope: "global" });
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="page page-center min-vh-100 d-flex align-items-center ">
      <div className="container container-tight py-4" style={{ maxWidth: 420 }}>
        <div className="text-center mb-4">
          <Link to="/" className="navbar-brand">
            <span className="fs-3 fw-bold">Evolution Sports</span>
          </Link>
        </div>

        <div className="card card-md">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Entrar</h2>

            <form onSubmit={handleSubmit} autoComplete="on" noValidate>
              {/* E-mail */}
              <div className="mb-3">
                <label className="form-label" htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  name="email"
                  placeholder="voce@email.com"
                  value={form.email}
                  onChange={onChange}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "emailError" : undefined}
                  autoFocus
                />
                {errors.email && (
                  <div id="emailError" className="invalid-feedback">
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Senha */}
              <div className="mb-3">
                <label className="form-label" htmlFor="password">
                  Senha
                  <span className="form-label-description ms-2">
                    <Link to="/esqueci-a-senha">Esqueci a senha</Link>
                  </span>
                </label>

                <div className="input-group input-group-flat">
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    name="password"
                    placeholder="Sua senha"
                    value={form.password}
                    onChange={onChange}
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "passwordError" : undefined}
                  />
                  <span className="input-group-text">
                    <button
                      type="button"
                      className="link-secondary border-0 bg-transparent p-0"
                      title={show ? "Ocultar senha" : "Mostrar senha"}
                      onClick={() => setShow((s) => !s)}
                    >
                      {/* Ícone olho (Tabler) */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon"
                      >
                        {show ? (
                          <>
                            <path d="M2 2l20 20" />
                            <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                            <path d="M16.68 16.68A11.94 11.94 0 0 1 12 18c-7 0-10-6-10-6a20.29 20.29 0 0 1 5.09-5.64" />
                            <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
                            <path d="M20.49 15.42A20.12 20.12 0 0 0 22 12s-3-6-10-6a11.94 11.94 0 0 0-3.95.7" />
                          </>
                        ) : (
                          <>
                            <path d="M2 12s3-6 10-6 10 6 10 6-3 6-10 6-10-6-10-6z" />
                            <circle cx="12" cy="12" r="3" />
                          </>
                        )}
                      </svg>
                    </button>
                  </span>
                </div>
                {errors.password && (
                  <div id="passwordError" className="invalid-feedback d-block">
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Lembrar de mim */}
              <div className="mb-2">
                <label className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={onChange}
                  />
                  <span className="form-check-label">Lembrar de mim</span>
                </label>
              </div>

              {/* Ações */}
              <div className="form-footer d-flex align-items-center justify-content-between">               
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Carregando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-4 text-center text-muted small">
          {/* Aviso: este é um mock de autenticação. Substitua pela integração real com seu backend. */}
        </div>
      </div>
    </div>
  );
}
