import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Alert from "../components/alert";
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confrimePassword, setConfirmPasswrd] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  async function register() {
    if (confrimePassword != password) {
      setAlert({
        type: "danger",
        message: "Les mot de passes ne sont pas les mêmes",
      });
    } else {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("username",data.username);
        setAlert({ type: "success", message: "Authentification aves réussie" });

        setTimeout(() => navigate("/", 2000));
      } else {
        console.log(response);
        setAlert({ type: "danger", message: "Echec d'authentification." });
      }
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
                          Veuillez saisit vos données pour créer un compte.
                        </p>

                        <div data-mdb-input-init className="form-outline mb-4">
                          <input
                            type="text"
                            id="username"
                            className="form-control"
                            placeholder="Saisissez un username."
                            onChange={(e) => setUsername(e.target.value)}
                          />
                          <label className="form-label" htmlFor="first_name">
                            Votre Username.
                          </label>
                        </div>
                        <div data-mdb-input-init className="form-outline mb-4">
                          <input
                            type="text"
                            id="first_name"
                            className="form-control"
                            placeholder="Saisissez votre prénom."
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                          <label className="form-label" htmlFor="first_name">
                            Votre Prénom.
                          </label>
                        </div>
                        <div data-mdb-input-init className="form-outline mb-4">
                          <input
                            type="text"
                            id="last_name"
                            className="form-control"
                            placeholder="Saisissez votre nom."
                            onChange={(e) => setLastName(e.target.value)}
                          />
                          <label className="form-label" htmlFor="last_name">
                            Votre Nom.
                          </label>
                        </div>
                        <div data-mdb-input-init className="form-outline mb-4">
                          <input
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
                        <div data-mdb-input-init className="form-outline mb-4">
                          <input
                            type="password"
                            name="password"
                            id="confrimpassword"
                            placeholder="Confirmez le mot de passe"
                            className="form-control"
                            onChange={(e) => setConfirmPasswrd(e.target.value)}
                          />
                          <label
                            className="form-label"
                            htmlFor="confrimpassword"
                          >
                            Confirmez votre mot de passe.
                          </label>
                        </div>
                        <div className="text-center pt-1 mb-5 pb-1">
                          <button
                            data-mdb-button-init
                            data-mdb-ripple-init
                            className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                            type="button"
                            onClick={register}
                          >
                            Sign up.
                          </button>
                        </div>

                        <div className="d-flex align-items-center justify-content-center pb-4">
                          <p className="mb-0 me-2 text-dark p-2">
                            Vous avez déjà un compte?
                          </p>
                          <Link
                            to="/login"
                            type="button"
                            data-mdb-button-init
                            data-mdb-ripple-init
                            className="btn btn-outline-danger"
                          >
                            Log in.
                          </Link>
                        </div>
                      </form>
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
