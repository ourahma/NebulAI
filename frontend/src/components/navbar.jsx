import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isAuthenticated, setAuthentificated] = useState(false);
  const naviagte = useNavigate();

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
              <Link to="/about" className="nav-link ">
                <i className="fas fa-bell "></i>A propos
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link ">
                <i className="fas fa-bell "></i>Dashaboard
              </Link>
            </li>
            {isAuthenticated ? (
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-dark text-white nav-link "
                >
                  <i className="fas fa-bell "></i>Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="btn btn-dark text-white nav-link "
                  >
                    <i className="fas fa-bell "></i>Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="btn btn-dark text-white nav-link"
                  >
                    <i className="fas fa-bell "></i>Register
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
