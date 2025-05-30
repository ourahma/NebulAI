import React, { useState } from "react";
import axios from "axios";
import Alert from "./alert";

export default function ImageGenerator() {
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [fid, setFid] = useState(0);
  const [kid, setKid] = useState(0);
  const [imageId, setImageId] = useState(null);
  const [dislikes, setDislikes] = useState(0);
  const [alert, setAlert] = useState(null);
  const [userVote, setUserVote] = useState(null); // 'like', 'dislike' ou null
  const [voting, setVoting] = useState(false);


  const generateImage = async () => {
    setLoading(true);
    setError(null);
    setImageData(null);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/generate-image/",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      setImageData(`http://localhost:8000${response.data.image_url}`);
      setLikes(0);
      setDislikes(0);
      setFid(response.data.fid);
      setKid(response.data.kid);
      setImageId(response.data.id);
      setAlert({ type: "success", message: "Génération résussie" });
    } catch (err) {
      setAlert({ type: "danger", message: "Erreur lors de la génération" });
      console.error(err);
    }
    setVoting(false);
  };

  // voter sur des images
  const voteImage = async (type) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/vote-image/${imageId}/`,
        { vote_type: type },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
    } catch (error) {
      console.error("Erreur de vote :", error);
    }
  };

  const handleClose = () => {
    setImageData(null);
    setLikes(0);
    setDislikes(0);
    setError(null);
  };

  return (
    <>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          duration={3000}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="container mt-4">
        {!imageData && (
          <div className="text-center mb-4">
            <button
              className="btn px-5 py-3"
              style={{
                backgroundColor: "rgba(175, 83, 8, 0.9)",
              }}
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
              <i className="bi bi-x-lg"></i>
            </button>
            {/* Colonne 1 - Image */}
            <div style={{ flex: "1 1 50%", gap: "10px" }}>
              <img
                src={imageData}
                alt="Generated"
                className="img-fluid rounded"
                style={{ maxHeight: 400, width: "100%", objectFit: "contain" }}
              />
            </div>
            {/* Colonne 2 - fid et kid */}

            <div
              className="d-flex flex-column justify-content-center align-items-stretch"
              style={{ flex: "0 0 180px", gap: "15px" }}
            >
              {[
                { label: "FID", value: fid.toFixed(2), bg: "#ffe0b2" },
                { label: "KID", value: kid.toFixed(2), bg: "#d1f5d3" },
              ].map(({ label, value, bg }, index) => (
                <div
                  key={index}
                  className="position-relative rounded shadow-sm p-3"
                  style={{
                    backgroundColor: bg,
                    minHeight: "90px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      zIndex: 2,
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#444",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </div>

                  {/* Valeur */}
                  <div
                    style={{
                      zIndex: 2,
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#111",
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Colonne 3 - Boutons */}
            <div
              style={{ flex: "0 0 200px" }}
              className="d-flex flex-column align-items-center"
            >
              {[
                {
                  icon: "hand-thumbs-up",
                  action: async () => {
                    await voteImage("like");
                    setUserVote("like");
                  },
                  count: likes,
                  title: "Like",
                  disabled: userVote === "like",
                },
                {
                  icon: "hand-thumbs-down",
                  action: async () => {
                    await voteImage("dislike");
                    setUserVote("dislike");
                  },
                  count: dislikes,
                  title: "Dislike",
                  disabled: userVote === "dislike",
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
              ].map(
                ({ icon, action, count, disabled, title, href, download }, i) =>
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
                        e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.15)";
                        e.currentTarget.style.color = "rgba(255,255,255,1)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.8)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.3)";
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
                        e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.15)";
                        e.currentTarget.style.color = "rgba(255,255,255,1)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.8)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.3)";
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
                      {voting && (
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
    </>
  );
}
