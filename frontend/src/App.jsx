import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Register from "./pages/register";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/login";
import PrivateRoute from "./components/PrivateRoute";
import "../src/assets/css/cursor.css";
import Alert from "./components/alert";
import AnimatedCursor from "./components/AnimatedCursor";

function App() {
  return (
    <>
      <AnimatedCursor />

      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/login" element={<Login />} ></Route>
          <Route path="/alert" element={<Alert />} > </Route>
          <Route path="/register" element={<Register />}></Route>
          {/* Route protégé suelement en cas de login */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
