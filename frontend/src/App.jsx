import "./App.css";
import BackgroundGrid from "./components/BackgroundGrid";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import ImageGenerator from "./components/ImageGenerator";
import "./index.css";

function App() {
  return (
    <div
      style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
    >
      <Navbar />

      {/* BackgroundGrid derrière tout */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          padding: 0,
          margin: 0,
        }}
      >
        <BackgroundGrid />
      </div>
      {/* Overlay semi-transparent par-dessus le background */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 5,
        }}
      >
        <div
          className="w-100 h-100"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        ></div>
      </div>

      {/* Bouton flottant centré */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 10,
        }}
      >
        <ImageGenerator />
      </div>

   
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
