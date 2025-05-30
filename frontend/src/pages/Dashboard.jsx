import React, { useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import Footer from "../components/footer";
import "../assets/css/dashboard.css";
import Grid from "@mui/material/Grid";
import NavBar from "../components/navbar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "bootstrap-icons/font/bootstrap-icons.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
          <span className="visually-hidden">Chargement...</span>
        </div>
        <div className="mt-3 fs-4">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrap">
        <NavBar />
        <div className="container-dashboard">
          <Grid container spacing={3}>
            <Grid xs={12} sm={12} md={12}>
              <div className="card gr-1" style={{ borderRadius: 12 }}>
                <div className="txt p-3">
                  <h3>Image générées</h3>
                  <p>Nombre total d'images générées aujourd'hui</p>
                  <h1>{stats.total_generated}</h1>
                </div>

                <div className="ico-card m-3">
                  <i className="bi bi-card-image fs-1 "></i>
                </div>
              </div>
            </Grid>
            <Grid xs={12} sm={4}>
              <div className="card gr-2" style={{ borderRadius: 12 }}>
                <div className="txt p-3">
                  <h3>Nombre de likes</h3>
                  <p>Total des likes reçus</p>
                  <h1>{stats.total_likes}</h1>
                </div>
                <div className="ico-card m-3">
                  <i className="bi bi-hand-thumbs-up fs-1 icon-hover"></i>
                </div>
              </div>
            </Grid>
            <Grid xs={12} sm={4}>
              <div className="card gr-3" style={{ borderRadius: 12 }}>
                <div className="txt p-3">
                  <h3>Nombre de dislikes</h3>
                  <p>Total des dislikes reçus</p>
                  <h1>{stats.total_dislikes}</h1>
                </div>
                <div className="ico-card m-3">
                  <i className="bi bi-hand-thumbs-down fs-1 icon-hover"></i>
                </div>
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={3} className="mt-3">
            <Grid item xs={12}>
              <Card
                style={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  background: "white",
                }}
              >
                <CardContent className="chart-card-content p-6">
                  <h3>Historique des générations</h3>
                  <Bar
                    className="chart-container"
                    data={stats.generation_history}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3} className="mt-3">
            <Grid item xs={12}>
              <Card
                style={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  background: "white",
                }}
              >
                <CardContent className="chart-card-content">
                  <h3>Répartition Like / Dislike</h3>
                  <Pie
                    className="chart-container"
                    data={stats.like_dislike_pie}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
