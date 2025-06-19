import React, { useState } from "react";
import axios from "axios";
import Alert from "./alert";
import "../assets/css/buttons.css";
export default function ImageGenerator() {
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState(null);

  const [likes, setLikes] = useState(0);
  const [fid, setFid] = useState(0);
  const [kid, setKid] = useState(0);
  const [Id, setImageId] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [dislikes, setDislikes] = useState(0);
  const [alert, setAlert] = useState(null);
  const [userVote, setUserVote] = useState(null); // 'like', 'dislike' ou null
  const [voting, setVoting] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setImageData(null);
    setUserVote(null);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/generate-image/",
        {}
      );
      const Id = response.data.id;
      setImageData(`http://localhost:8000${response.data.image_url}`);
      setLikes(0);
      setDislikes(0);
      setLoading(true);
      setImageId(response.data.id);
      setLoading(false);
      setAlert({
        type: "success",
        message:
          "Génération résussie! Veuillez attendez pour le calcul des métriques.",
      });
      waitForMetrics(Id);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Une erreur est survenue lors de la génération.";
      setAlert({
        type: "danger",
        message: message,
      });
      setLoading(false);
      console.error(err);
    }
    setVoting(false);
  };
  // fatcher les métrique après generation d'image
  const waitForMetrics = (id) => {
    setLoadingMetrics(true);
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/metrics/${id}/`
        );
        const { fid, kid } = response.data;
        if (fid != null && kid != null) {
          setFid(fid);
          setKid(kid);
          setLoadingMetrics(false);
          setAlert({
            type: "success",
            message: "Métriques récupérées avec succès !",
          });
          clearInterval(interval);
        }
      } catch (e) {
        console.error("Erreur lors du fetch des métriques :", e);
      }
    }, 3000); // Vérifie toutes les 3 secondes
  };

  // voter sur des images
  const voteImage = async (type) => {
    const token = localStorage.getItem("access");
    if (!token) {
      setAlert({
        type: "warning",
        message: "Vous devez être connecté pour voter.",
      });
      return;
    } else {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/vote-image/${Id}/`,
          { vote_type: type },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLikes(response.data.likes);
        setDislikes(response.data.dislikes);
      } catch (error) {
        setAlert({
          type: "danger",
          message: "Erreur lors du vote. Veuillez réessayer.",
        });
        console.error("Erreur de vote :", error);
      }
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
          onClose={() => setAlert(false)}
        />
      )}
      <div className="container mt-4">
        {!imageData && (
          <div className="text-center ">
            <button
              className="btn px-5 py-3 justify-content-center align-items-center mt-5 lancer_generate"
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

        {imageData && (
          <div
            className="card p-3 d-flex flex-row align-items-center"
            style={{ gap: "20px", backgroundColor: "rgba(247, 247, 247, 0.5)" }}
          >
            <button
              onClick={handleClose}
              aria-label="Fermer"
              className="close-btn"
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
                {
                  label: "FID",
                  value: loadingMetrics ? "Calcul ..." : fid.toFixed(4),
                },
                {
                  label: "KID",
                  value: loadingMetrics ? "Calcul ..." : kid.toFixed(4),
                },
              ].map(({ label, value }, index) => (
                <div
                  key={index}
                  className="metrcis-btn position-relative rounded shadow-sm z-index-2 font-weight-bold flex text-light justify-content-center overflowHidden align-item-center p-3"
                >
                  <div>
                    {label}
                  </div>

                  {/* Valeur */}
                  <div className="z-index-2 font-weight-bold">
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
                  action: () => {},
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
                      href={`http://localhost:8000/api/download/${Id}`}
                      download={download}
                      title={title}
                      className="custom-btn btn btn-transparent mb-3 d-flex justify-content-center align-items-center"
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
                      className="custom-btn btn btn-transparent mb-3 d-flex justify-content-center align-items-center"
                    >
                      <i className={`bi bi-${icon}`}></i>
                      {typeof count === "number" && (
                        <span className="badge position-abslute bg-transparent bottom-4 right-0 small text-light"
                        >
                          {count}
                        </span>
                      )}
                      {voting && (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
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
