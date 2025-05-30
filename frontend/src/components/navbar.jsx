import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isAuthenticated, setAuthentificated] = useState(false);
  const naviagte = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("access");
    setAuthentificated(!!token);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setAuthentificated(false);
    naviagte("/login");
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top bg-light navbar-light"
      style={{
        height: "100px",
      }}
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img
            id="logo"
            src="/images/nebulai.png"
            alt="Logo"
            draggable="false"
            height="40px"
            width="auto"
          />
          <div className="d-flex flex-column">
            <span className="fw-bold">NebulAI</span>
            <small className="text-muted " style={{ fontSize: "0.75rem" }}>
              Explore the infinite
            </small>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${isActive("/")}`}>
                <i className="bi bi-house-door-fill m-1"></i>Acceuil
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className={`nav-link ${isActive("/about")}`}>
                <i className="bi bi-info-circle-fill m-1"></i>A propos
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/dashboard"
                className={`nav-link ${isActive("/dashboard")}`}
              >
                <i className="bi bi-bar-chart-fill m-1"></i>Dashaboard
              </Link>
            </li>
            {isAuthenticated ? (
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-dark text-white nav-link "
                >
                  <i className="bi bi-box-arrow-left m-1 "></i>Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className={`btn btn-dark text-white nav-link ${isActive(
                      "/login"
                    )}`}
                  >
                    <i className="bi bi-box-arrow-in-right m-1"></i>Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className={`btn btn-dark text-white nav-link ${isActive(
                      "/register"
                    )}`}
                  >
                    <i className="bi bi-person-plus m-1"></i>Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
