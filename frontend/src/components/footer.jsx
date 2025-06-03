export default function Footer() {
  return (
    <footer
      className="d-flex justify-content-between align-items-center bg-light"
      style={{
        backgroundColor: "green",
        color: "black",
        zIndex: 100,
        width: "100%",
        margin: 0,
      }}
    >
      {/* Left side: logo + slogan */}
      <div className="d-flex align-items-center">
        <img
          src="/images/nebulai.png"
          alt="Logo"
          height={70} // logo bigger
          width={70}
          className="rounded-circle"
          draggable="false"
        />
        <div className="d-flex flex-column">
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontWeight: "bold",
              fontSize: "1.3rem",
            }}
          >
            NebulAI
          </span>
          <span style={{ fontSize: "0.9rem" }}>Explore the infinite</span>
        </div>
      </div>


      <section className="mb-4 text-center">
        <a
          className="btn btn-outline-dark btn-floating m-1"
          href="https://www.linkedin.com/in/maroua-ourahma/"
          role="button"
        >
          <i className="bi bi-linkedin"></i>
        </a>

        <a
          className="btn btn-outline-dark btn-floating m-1"
          href="https://github.com/ourahma"
          role="button"
        >
          <i className="bi bi-github"></i>
        </a>
      </section>
      <div>
        <small className="text-muted">
          &copy; {new Date().getFullYear()} NebulAI, OURAHMA Maroua.
        </small>
      </div>
    </footer>
  );
}
