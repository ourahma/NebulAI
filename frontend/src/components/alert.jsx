import { useEffect } from "react";
import PropTypes from "prop-types";
import "../assets/css/alert.css"; // Assure-toi d'importer ton CSS ici

export default function Alert({
  type = "info",
  message,
  duration = 3000,
  onClose,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeConfig = {
    danger: { icon: "bi bi-ban-fill", title: "Erreur" },
    warning: { icon: "bi bi-exclamation-diamond-fill", title: "Attention" },
    info: { icon: "bi bi-info-circle-fill", title: "Informations" },
    success: { icon: "bi bi-check-circle-fill", title: "Succès" },
  };

  const { icon, title } = typeConfig[type] || typeConfig["info"];

  return (
    <div className={`alert alert-${type}`} id="alert">
      <div className="icon__wrapper">
        <i className={icon}></i>
      </div>
      <p>
        {title} <br />
        {message}
      </p>
      
      <span onClick={onClose}>
        <i className="bi bi-x"></i>
      </span>
    </div>
  );
}

Alert.propTypes = {
  type: PropTypes.oneOf(["error", "warning", "info", "success"]),
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
  onClose: PropTypes.func,
};
