import { Navigate } from "react-router-dom";

function isTokenValid(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  } catch (e) {
    console.error("Token invalide ou mal formé", e);
    return false;
  }
}

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("access");
  const isValid = token && isTokenValid(token);

  return isValid ? children : <Navigate to="/login" replace />;
}