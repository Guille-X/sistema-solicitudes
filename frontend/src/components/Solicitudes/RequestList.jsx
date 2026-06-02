import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Row, Col, Pagination, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ estado: '', categoriaId: '', fechaInicio: '', fechaFin: '', search: '' });
  const [categories, setCategories] = useState([]);
  const { user } = useContext(AuthContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    const params = { ...filters, page: currentPage, limit: 10 };
    const res = await api.get('/requests', { params });
    setRequests(res.data.requests);
    setTotalPages(res.data.pages);
  };

  const fetchCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data);
  };

  useEffect(() => {
    fetchRequests();
    fetchCategories();
  }, [currentPage, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    await api.delete(`/requests/${selectedRequest.id}`);
    setShowDeleteModal(false);
    fetchRequests();
  };

  const canEdit = user?.rol === 'admin' || user?.rol === 'operador';

  return (
    <Container className="mt-4">
      <h2>Solicitudes</h2>
      {canEdit && <Button as={Link} to="/requests/new" variant="primary" className="mb-3">Nueva Solicitud</Button>}

      {/* Filtros */}
      <Row className="mb-3">
        <Col md={3}>
          <Form.Control type="text" placeholder="Buscar..." name="search" value={filters.search} onChange={handleFilterChange} />
        </Col>
        <Col md={2}>
          <Form.Select name="estado" value={filters.estado} onChange={handleFilterChange}>
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="completada">Completada</option>
            <option value="rechazada">Rechazada</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select name="categoriaId" value={filters.categoriaId} onChange={handleFilterChange}>
            <option value="">Todas las categorías</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Control type="date" name="fechaInicio" value={filters.fechaInicio} onChange={handleFilterChange} />
        </Col>
        <Col md={2}>
          <Form.Control type="date" name="fechaFin" value={filters.fechaFin} onChange={handleFilterChange} />
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th><th>Título</th><th>Estado</th><th>Categoría</th><th>Creado por</th><th>Fecha</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.titulo}</td>
              <td>{req.estado}</td>
              <td>{req.Category?.nombre}</td>
              <td>{req.User?.nombre}</td>
              <td>{new Date(req.created_at).toLocaleDateString()}</td>
              <td>
                <Button as={Link} to={`/requests/${req.id}`} size="sm" variant="info">Ver</Button>
                {canEdit && <Button as={Link} to={`/requests/edit/${req.id}`} size="sm" variant="warning" className="ms-2">Editar</Button>}
                {user?.rol === 'admin' && <Button size="sm" variant="danger" className="ms-2" onClick={() => { setSelectedRequest(req); setShowDeleteModal(true); }}>Eliminar</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {[...Array(totalPages).keys()].map(p => (
          <Pagination.Item key={p+1} active={p+1 === currentPage} onClick={() => setCurrentPage(p+1)}>{p+1}</Pagination.Item>
        ))}
      </Pagination>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton><Modal.Title>Confirmar eliminación</Modal.Title></Modal.Header>
        <Modal.Body>¿Estás seguro de eliminar la solicitud "{selectedRequest?.titulo}"?</Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button><Button variant="danger" onClick={handleDelete}>Eliminar</Button></Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RequestList;