import "../App.css";
import BackgroundGrid from "../components/BackgroundGrid";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import ImageGenerator from "../components/ImageGenerator";
import "../index.css";

function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        minWidth: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Navbar />

      {/* Background fixé derrière tout */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100 z-n1"
        style={{
          left: 0,
        }}
      >
        <BackgroundGrid />
      </div>

      {/* Overlay semi-transparent */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100 "
        style={{
          left: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      ></div>

      
      <main
        style={{
          flex: 1,
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ImageGenerator />
      </main>
      <p>test</p>
    </div>
  );
}
export default Home;