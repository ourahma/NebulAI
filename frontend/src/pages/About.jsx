import NavBar from "../components/navbar";
import Footer from "../components/footer";
function About() {
  return (
    <div className="page-container">
      <div className="content-wrap">
        <NavBar />
        <div className="container-fluid">
          <div className="card-group">
            <div className="card m-2">
              <img
                src="/src/assets/galaxies/13.jpg"
                className="card-img-top"
                alt="dataset"
              />
              <div className="card-body">
                <h5 className="card-title">
                  Dataset{" "}
                  <a href="https://www.kaggle.com/datasets/razaimam45/spacenet-an-optimally-distributed-astronomy-data">
                    SpaceNet
                  </a>{" "}
                  depuis kaggle.
                </h5>
                <p className="card-text text-dark">
                  Le dataset SpaceNet est une collection d’images satellite à
                  haute résolution avec annotations, utilisée pour la détection
                  d’objets géospatiaux (comme les bâtiments et routes),
                  favorisant la recherche en vision par ordinateur pour la
                  cartographie automatique et urbaine.
                </p>
              </div>
            </div>
            <div className="card m-2">
              <img
                src="/images/kmeans.png"
                className="card-img-top"
                alt="Palm Springs Road"
              />
              <div className="card-body">
                <h5 className="card-title">
                  Utilisation d'algorithme K-means.
                </h5>
                <p className="card-text text-dark">
                  L'utiliseation de K-Means a permet de regrouper
                  automatiquement des pixels ou caractéristiques similaires dans
                  les images, ce qui facilite la segmentation ou l'extraction de
                  régions d’intérêt sans supervision, améliorant ainsi l’analyse
                  ou le pré-traitement des données satellite.
                </p>
              </div>
            </div>
            <div className="card m-2">
              <img
                src="/images/cgan.png"
                className="card-img-top"
                alt="Los Angeles Skyscrapers"
              />
              <div className="card-body">
                <h5 className="card-title">Approche adopté - KMEANS + CGAN</h5>
                <p className="card-text text-dark">
                  Le Conditional GAN est utilisé pour générer des images
                  réalistes en tenant compte des clusters définis par K-Means.
                  En conditionnant le générateur sur ces clusters, le modèle
                  apprend à produire des images spécifiques à chaque groupe,
                  améliorant la diversité et la qualité des sorties. Cette
                  approche permet de mieux contrôler la génération selon les
                  caractéristiques extraites des données initiales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default About;
