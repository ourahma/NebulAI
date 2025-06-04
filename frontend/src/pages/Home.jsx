import "../App.css";
import BackgroundGrid from "../components/BackgroundGrid";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import ImageGenerator from "../components/ImageGenerator";
import "../index.css";

function Home() {
  
  return (
    <div>
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

      
      <main className="z-20 position-relative justify-content-center align-items-center p-5">
        <ImageGenerator />
      </main>
    </div>
  );
}
export default Home;