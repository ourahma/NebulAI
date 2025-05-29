export default function Footer() {
  return (
    <footer
      className="d-flex justify-content-between align-items-center px-4 py-3"
      style={{
        backgroundColor: "white",
        color: "black",
        boxShadow: "0 -1px 5px rgba(0,0,0,0.1)",
        zIndex: 100,
        position: "relative", // tu peux mettre "fixed" si tu veux qu’il soit toujours visible en bas
        bottom: 0,
        width: "100%",
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

      {/* Right side: copyright */}
      <div>
        <small className="text-muted">&copy; {new Date().getFullYear()} NebulAI</small>
      </div>
    </footer>
  );
}
