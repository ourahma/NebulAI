import React from 'react';

export default function Navbar() {
  return (
    
<nav className="navbar navbar-expand-lg fixed-top bg-light navbar-light">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#">
      <img
        id="logo"
        src="/images/logo_sans_text.jpg"
        alt="Logo"
        draggable="false"
        height="30"
      />
      <div className="d-flex flex-column">
        <span className="fw-bold">NebulAI</span>
        <small className="text-muted" style={{ fontSize: "0.75rem" }}>Explore the infinite</small>
      </div>
    </a>

    <button className="navbar-toggler" type="button" data-mdb-collapse-init data-mdb-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <i className="fas fa-bars"></i>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto align-items-center">
        <li className="nav-item">
          <a className="nav-link mx-2" href="#!"><i className="fas fa-plus-circle pe-2"></i>Post</a>
        </li>
        <li className="nav-item">
          <a className="nav-link mx-2" href="#!"><i className="fas fa-bell pe-2"></i>Alerts</a>
        </li>
        <li className="nav-item">
          <a className="nav-link mx-2" href="#!"><i className="fas fa-heart pe-2"></i>Trips</a>
        </li>
        <li className="nav-item ms-3">
          <a className="btn btn-dark btn-rounded justify-content-end" href="#!">Sign in</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

  );
}
