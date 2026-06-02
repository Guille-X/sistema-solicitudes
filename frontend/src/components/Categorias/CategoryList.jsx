import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import api from '../../services/api';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta categoría?')) {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      setSuccess('Categoría eliminada');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, formData);
        setSuccess('Categoría actualizada');
      } else {
        await api.post('/categories', formData);
        setSuccess('Categoría creada');
      }
      setShowModal(false);
      fetchCategories();
      setFormData({ nombre: '', descripcion: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  const openModal = (cat = null) => {
    setEditing(cat);
    if (cat) {
      setFormData({ nombre: cat.nombre, descripcion: cat.descripcion || '' });
    } else {
      setFormData({ nombre: '', descripcion: '' });
    }
    setShowModal(true);
  };

  return (
    <Container className="mt-4">
      <h2>Categorías</h2>
      <Button className="mb-3" onClick={() => openModal()}>Crear Categoría</Button>
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      <Table striped bordered hover responsive>
        <thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.nombre}</td>
              <td>{cat.descripcion}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => openModal(cat)}>Editar</Button>
                <Button size="sm" variant="danger" className="ms-2" onClick={() => handleDelete(cat.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editing ? 'Editar Categoría' : 'Nueva Categoría'}</Modal.Title></Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={3} value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default CategoryList;