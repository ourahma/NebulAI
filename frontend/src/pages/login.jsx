import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Alert from "../components/alert";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  async function login() {
    const response = await fetch("http://localhost:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Utilisateur est authentifié avec succée");
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      setAlert({ type: "success", message: "Authentification aves réussie" });

      setTimeout(() => navigate("/", 3000));
    } else {
      console.log(response);
      setAlert({ type: "danger", message: "Echec d'authentification." });
    }
  }

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
      <section className="h-100 gradient-form">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-10">
              <div className="card rounded-3 text-black">
                <div className="row g-0">
                  <div className="col-lg-6">
                    <div className="card-body  mx-md-2">
                      <div className="text-center">
                        <img
                          src="images/logo_sans_text.jpg"
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                          }}
                          alt="logo"
                        />
                        <h4 className="mt-1 mb-5 pb-5">Nebul AI</h4>
                      </div>

                      <form onSubmit={(e) => e.preventDefault()}>
                        <p className="text-dark">
                          Veuillez saisit vos données d'authentification.
                        </p>

                        <div data-mdb-input-init className="form-outline mb-4">
                          <input
                            autoComplete="off"
                            autoCorrect="off"
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <label className="form-label" htmlFor="email">
                            Email
                          </label>
                        </div>

                        <div data-mdb-input-init className="form-outline mb-4">
                          <input
                            autoComplete="off"
                            autoCorrect="off"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Mot de passe"
                            className="form-control"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <label className="form-label" htmlFor="password">
                            Mot de passe
                          </label>
                        </div>

                        <div className="text-center pt-1 mb-5 pb-1">
                          <button
                            data-mdb-button-init
                            data-mdb-ripple-init
                            className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                            type="button"
                            onClick={login}
                          >
                            Log in
                          </button>
                        </div>

                        <div className="d-flex align-items-center justify-content-center pb-4">
                          <p className="mb-0 me-2 text-dark p-2">
                            Vous n'avez pas un compte?
                          </p>
                          <Link
                            to="/register"
                            type="button"
                            data-mdb-button-init
                            data-mdb-ripple-init
                            className="btn btn-outline-danger"
                          >
                            Créer un nouveau compte.
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                      <h4 className="mb-4">Explorez l’univers avec l’IA</h4>
                      <p className="medium mb-0">
                        Une application innovante propulsée par l’intelligence
                        artificielle, conçue pour générer des images réalistes
                        de l’espace et des paysages extraterrestres à l’aide de
                        réseaux antagonistes génératifs (GAN).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
