import React, { useEffect, useState, useContext } from 'react';
import { Container, Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchRequest = async () => {
    try {
      const res = await api.get(`/requests/${id}`);
      setRequest(res.data);
    } catch (error) {
      console.error(error);
      navigate('/requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id, navigate]);

  const handleChangeStatus = async (newStatus) => {
    try {
      await api.put(`/requests/${id}`, { ...request, estado: newStatus });
      // Recargar datos
      await fetchRequest();
      // Opcional: mostrar mensaje de éxito
    } catch (error) {
      console.error(error);
      alert('Error al cambiar el estado');
    }
  };

  if (loading) return <Container className="mt-4"><p>Cargando...</p></Container>;
  if (!request) return <Container className="mt-4"><p>Solicitud no encontrada</p></Container>;

  const estadoColor = {
    pendiente: 'warning',
    en_proceso: 'info',
    completada: 'success',
    rechazada: 'danger',
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h5">
          Solicitud #{request.id} - {request.titulo}
          <Badge bg={estadoColor[request.estado]} className="ms-3">
            {request.estado}
          </Badge>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Descripción:</strong></p>
              <p>{request.descripcion}</p>
            </Col>
            <Col md={6}>
              <p><strong>Categoría:</strong> {request.Category?.nombre}</p>
              <p><strong>Creado por:</strong> {request.User?.nombre} ({request.User?.email})</p>
              <p><strong>Fecha de creación:</strong> {new Date(request.created_at).toLocaleString()}</p>
              <p><strong>Fecha de vencimiento:</strong> {request.fecha_vencimiento || 'No especificada'}</p>
            </Col>
          </Row>

          {/* Botones rápidos solo para admin/operador */}
          {(user?.rol === 'admin' || user?.rol === 'operador') && (
            <Row className="mt-4">
              <Col>
                <strong>Cambiar estado:</strong>
                <Button variant="outline-warning" size="sm" onClick={() => handleChangeStatus('pendiente')} className="ms-2">Pendiente</Button>
                <Button variant="outline-info" size="sm" onClick={() => handleChangeStatus('en_proceso')} className="ms-2">En proceso</Button>
                <Button variant="outline-success" size="sm" onClick={() => handleChangeStatus('completada')} className="ms-2">Completada</Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleChangeStatus('rechazada')} className="ms-2">Rechazada</Button>
              </Col>
            </Row>
          )}
        </Card.Body>
        <Card.Footer>
          <Button variant="secondary" onClick={() => navigate('/requests')}>Volver a la lista</Button>
          {(user?.rol === 'admin' || user?.rol === 'operador') && (
            <Button as={Link} to={`/requests/edit/${request.id}`} variant="warning" className="ms-2">
              Editar solicitud (formulario completo)
            </Button>
          )}
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default RequestDetail;