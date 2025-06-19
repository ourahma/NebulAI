import React, { useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import Footer from "../components/footer";
import "../assets/css/dashboard.css";
import NavBar from "../components/navbar";
import CountUp from "react-countup";
import { motion } from "framer-motion";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";

import "bootstrap-icons/font/bootstrap-icons.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);
import { Bar, Pie, Line } from "react-chartjs-2";
const Dashboard = () => {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/dashboard-stats/")
      .then((reponse) => reponse.json())
      .then((data) => {
        console.log(data);
        setStats(data);
        setLoading(false);
      })

      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);
  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "4rem", height: "4rem" }}
        >
          <span className="visually-hidden"></span>
        </div>
        <div className="mt-3 fs-4">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrap">
        <NavBar />
        <div className="container-dashboard mt-5">
          <div className="row mt-3">
            <div className="col-12 col-md-4 mb-3">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div className="card gr-1" style={{ borderRadius: 12 }}>
                  <div className="txt p-3">
                    <h3>Image générées</h3>
                    <p>Nombre total d'images générées.</p>

                    <h1>
                      <CountUp
                        end={stats.total_generated}
                        duration={2}
                      ></CountUp>
                    </h1>
                  </div>

                  <div className="ico-card m-3">
                    <i className="bi bi-card-image fs-1 "></i>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="col-12 col-md-4 mb-3">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div className="card gr-2" style={{ borderRadius: 12 }}>
                  <div className="txt p-3">
                    <h3>Nombre de likes</h3>
                    <p>Total des likes reçus</p>
                    <h1>
                      <CountUp end={stats.total_likes} duration={2}></CountUp>
                    </h1>
                  </div>
                  <div className="ico-card m-3">
                    <i className="bi bi-hand-thumbs-up fs-1 icon-hover"></i>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="col-12 col-md-4 mb-3">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div className="card gr-3" style={{ borderRadius: 12 }}>
                  <div className="txt p-3">
                    <h3>Nombre de dislikes</h3>
                    <p>Total des dislikes reçus</p>
                    <h1>
                      <CountUp
                        end={stats.total_dislikes}
                        duration={2}
                      ></CountUp>
                    </h1>
                  </div>
                  <div className="ico-card m-3">
                    <i className="bi bi-hand-thumbs-down fs-1 icon-hover"></i>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12 col-lg-6 mb-4">
              <Card
                style={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  background: "white",
                }}
              >
                <CardContent className="chart-card-content">
                  <h5>Historique des générations</h5>
                  <Bar
                    className="chart-container"
                    data={stats.generation_history}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="col-12 col-lg-6 mb-4">
              <Card>
                <CardContent className="chart-card-content">
                  <h5>Historique de la métrique FID</h5>
                  <Line
                    className="chart-container"
                    data={stats.fid_history}
                    toolip={stats.fid_history.tootlips}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="col-12 col-lg-6 mb-4">
              <Card>
                <CardContent className="chart-card-content">
                  <h5>Historique de la métrique KID</h5>
                  <Line
                    className="chart-container"
                    data={stats.kid_history}
                    toolip={stats.fid_history.tootlips}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="col-12 col-lg-6 mb-4">
              <Card>
                <CardContent className="chart-card-content">
                  <h5>Répartition Like / Dislike</h5>
                  <Pie
                    className="chart-container"
                    data={stats.like_dislike_pie}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
