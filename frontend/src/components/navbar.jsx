import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isAuthenticated, setAuthentificated] = useState(false);
  const naviagte = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setUsername(localStorage.getItem("username"));
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.username) {
        console.log(username);
        setUsername(decoded.username);
      }
    }
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
    <nav className="navbar navbar-expand-lg fixed-top bg-light navbar-light p-2 ">
      <div className="container rounded-3">
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
                <div className="btn-group ml-5">
                  <span className="align-self-center">Bienvenue {username}</span>
                  <button
                    type="button"
                    className="btn btn-link dropdown-toggle dropdown-toggle-split"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></button>
                  <ul className="dropdown-menu">
                    <li>
                      {" "}
                      <a
                        onClick={handleLogout}
                        className="text-dark nav-link m-1 "
                      >
                        <i className="bi bi-box-arrow-left m-1 "></i>Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className={`btn btn-dark text-white m-1 nav-link ${isActive(
                      "/login"
                    )}`}
                  >
                    <i className="bi bi-box-arrow-in-right m-1"></i>Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className={`btn btn-dark text-white m-1 nav-link ${isActive(
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
// décoder le username pour l'affciher
function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    console.log(e);
    return null;
  }
}
