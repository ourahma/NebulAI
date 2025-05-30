export default function Footer() {
  return (
    <footer
      className="d-flex justify-content-between align-items-center px-4 py-3 bg-light"
      style={{
        backgroundColor: "green",
        color: "black",
        zIndex: 100,
        width: "100%",
        margin: 0,
      }}
    >
      {/* Left side: logo + slogan */}
      <div className="d-flex align-items-center gap-3">
        <img
          src="/images/nebulai.png"
          alt="Logo"
          height={40}
          draggable="false"
        />
        <span>NebulAI — Explore the infinite</span>
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
