import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import api from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Cargando estadísticas...</div>;

  const estadoLabels = stats.porEstado.map(e => e.estado);
  const estadoData = stats.porEstado.map(e => e.total);
  const estadoColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

  const categoriaLabels = stats.porCategoria.map(c => c.categoria);
  const categoriaData = stats.porCategoria.map(c => c.total);

  const evolucionLabels = stats.evolucion.map(e => e.fecha);
  const evolucionData = stats.evolucion.map(e => e.cantidad);

  return (
    <Container fluid className="mt-4">
      <h2>Dashboard</h2>
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Solicitudes por estado</Card.Title>
              <Pie data={{ labels: estadoLabels, datasets: [{ data: estadoData, backgroundColor: estadoColors }] }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Solicitudes por categoría</Card.Title>
              <Bar data={{ labels: categoriaLabels, datasets: [{ label: 'Cantidad', data: categoriaData, backgroundColor: '#36A2EB' }] }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Evolución últimos 30 días</Card.Title>
              <Line data={{ labels: evolucionLabels, datasets: [{ label: 'Solicitudes por día', data: evolucionData, borderColor: '#FF6384', fill: false }] }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;