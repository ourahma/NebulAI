export default function Footer() {
  return (
    <footer
      className="d-flex justify-content-between align-items-center px-4 py-3"
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "white",
        color: "black",
        boxShadow: "0 -1px 5px rgba(0,0,0,0.1)",
        zIndex: 100,
      }}
    >
      {/* Left side: logo + slogan */}
      <div className="d-flex align-items-center gap-3">
        <img
          src="/images/nebulai.jpg"
          alt="Logo"
          style={{ height: 40, objectFit: "contain" }}
        />
        <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>
          Ton slogan ici
        </span>
      </div>

      {/* Right side: icônes sociales + email */}
      <div className="d-flex align-items-center gap-3">
        <a
          href="mailto:tonemail@example.com"
          className="text-dark"
          title="Envoyer un mail"
          style={{ fontSize: 24, textDecoration: "none" }}
        >
          <i className="bi bi-envelope-fill"></i>
        </a>

        <a
          href="https://www.linkedin.com/in/maroua-ourahma/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-dark"
          title="LinkedIn"
          style={{ fontSize: 24 }}
        >
          <i className="bi bi-linkedin"></i>
        </a>

        <a
          href="https://github.com/ourahma"
          target="_blank"
          rel="noopener noreferrer"
          className="text-dark"
          title="GitHub"
          style={{ fontSize: 24 }}
        >
          <i className="bi bi-github"></i>
        </a>
      </div>
    </footer>
  );
}
