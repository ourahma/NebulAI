import { useEffect } from "react";

export default function Alert({
  type = "success",
  message = "Message de test",
  duration = 3000,
  onClose,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: "bi-check-circle-fill",
    danger: "bi-exclamation-triangle-fill",
    warning: "bi-exclamation-circle-fill",
    info: "bi-info-circle-fill",
  };

  const iconClass = icons[type] || "bi-info-circle-fill";

  return (
    <div className="alert-overlay">
      <div
        className={`alert alert-${type} d-flex align-items-center justify-content-between text-dark`}
        role="alert"
        style={{ padding: "1rem 1.25rem" }}
      >
        <div className="d-flex align-items-center">
          <i className={`bi ${iconClass} fs-4 m-3`}></i>
          <div>
            <h6 className="alert-heading text-capitalize mb-1">{type}</h6>
            <p className="mt-1">{message}</p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-sm text-white"
          onClick={onClose}
          style={{ background: "transparent", border: "none" }}
        >
          <i className="bi bi-x-circle fs-5"></i>
        </button>
      </div>
    </div>
  );
}
