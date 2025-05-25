import React, { useState } from "react";
import axios from "axios";

export default function ImageGenerator() {
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    setImageData(null);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/generate-image/",
        {}
      );
      setImageData(`http://localhost:8000${response.data.image_url}`);
      setLikes(0);
      setDislikes(0);
    } catch (err) {
      setError("Erreur lors de la génération");
      console.error(err);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setImageData(null);
    setLikes(0);
    setDislikes(0);
    setError(null);
  };

  return (
    <div className="container mt-4">
      {!imageData && (
        <div className="text-center mb-4">
          <button
            className="btn btn-dark px-5 py-3"
            onClick={generateImage}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Génération en cours...
              </>
            ) : (
              "Générer une image"
            )}
          </button>
        </div>
      )}

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {imageData && (
        <div
          className="card p-3 d-flex flex-row align-items-center"
          style={{ gap: "20px", backgroundColor: "rgba(247, 247, 247, 0.5)" }}
        >
               <button
            onClick={handleClose}
            aria-label="Fermer"
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "transparent",
              border: "none",
              color: "rgba(0,0,0,0.6)",
              fontSize: 24,
              cursor: "pointer",
              fontWeight: "bold",
              lineHeight: 1,
              padding: 0,
              width: 32,
              height: 32,
              borderRadius: "50%",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(0,0,0,0.9)";
              e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(0,0,0,0.6)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <i class="bi bi-x-lg"></i>
          </button>
          {/* Colonne 1 - Image */}
          <div style={{ flex: "1 1 50%" }}>
            <img
              src={imageData}
              alt="Generated"
              className="img-fluid rounded"
              style={{ maxHeight: 400, width: "100%", objectFit: "contain" }}
            />
          </div>

          {/* Colonne 2 - Boutons */}
          <div
            style={{ flex: "0 0 200px" }}
            className="d-flex flex-column align-items-center"
          >
            {[
              {
                icon: "hand-thumbs-up",
                action: () => setLikes(likes + 1),
                count: likes,
                title: "Like",
              },
              {
                icon: "hand-thumbs-down",
                action: () => setDislikes(dislikes + 1),
                count: dislikes,
                title: "Dislike",
              },
              {
                icon: "arrow-down-circle-fill",
                href: imageData,
                download: "generated_image.png",
                title: "Download",
              },
              {
                icon: "arrow-clockwise",
                action: generateImage,
                disabled: loading,
                title: loading ? "Génération en cours..." : "Régénérer",
              },
            ].map(({ icon, action, count, disabled, title, href, download }, i) =>
              href ? (
                // Bouton téléchargement en <a>
                <a
                  key={i}
                  href={href}
                  download={download}
                  title={title}
                  className="btn btn-transparent mb-3 d-flex justify-content-center align-items-center"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "transparent",
                    border: "2px solid rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 28,
                    transition: "all 0.3s ease",
                    position: "relative",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.color = "rgba(255,255,255,1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                  }}
                >
                  <i className={`bi bi-${icon}`}></i>
                </a>
              ) : (
                // Boutons classiques en <button>
                <button
                  key={i}
                  onClick={action}
                  disabled={disabled}
                  title={title}
                  className="btn btn-transparent mb-3 d-flex justify-content-center align-items-center"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "transparent",
                    border: "2px solid rgba(255,255,255,0.3)",
                    cursor: disabled ? "not-allowed" : "pointer",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 28,
                    transition: "all 0.3s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.color = "rgba(255,255,255,1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                  }}
                >
                  <i className={`bi bi-${icon}`}></i>
                  {typeof count === "number" && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 4,
                        right: 8,
                        fontSize: 14,
                        color: "rgba(255,255,255,0.85)",
                        fontWeight: "bold",
                        userSelect: "none",
                      }}
                    >
                      {count}
                    </span>
                  )}
                  {disabled && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: "calc(50% - 0.5rem)",
                        left: "calc(50% - 0.5rem)",
                      }}
                    ></span>
                  )}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
