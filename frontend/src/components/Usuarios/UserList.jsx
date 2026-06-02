import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import api from '../../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '', rol_id: '' });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  const fetchRoles = async () => {
    // Los roles no tienen un endpoint específico, pero los necesitamos. Podemos crearlo en backend o hardcodear.
    // Para simplicidad, hardcodeamos los roles que conocemos. Mejor creamos un endpoint /roles en backend.
    // Pero como no está, haremos una petición a /users y extraer los roles únicos o definirlos fijos.
    // Lo correcto es agregar en backend: GET /roles (solo admin). Te lo agrego al final.
    const res = await api.get('/roles'); // Asume que existe este endpoint. Si no, lo creamos después.
    setRoles(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este usuario?')) {
      await api.delete(`/users/${id}`);
      fetchUsers();
      setSuccess('Usuario eliminado');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData);
        setSuccess('Usuario actualizado');
      } else {
        await api.post('/users', formData);
        setSuccess('Usuario creado');
      }
      setShowModal(false);
      fetchUsers();
      setFormData({ nombre: '', email: '', password: '', rol_id: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    }
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setFormData({ nombre: user.nombre, email: user.email, password: '', rol_id: user.rol_id });
    } else {
      setFormData({ nombre: '', email: '', password: '', rol_id: '' });
    }
    setShowModal(true);
  };

  return (
    <Container className="mt-4">
      <h2>Usuarios</h2>
      <Button className="mb-3" onClick={() => openModal()}>Crear Usuario</Button>
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      <Table striped bordered hover responsive>
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.email}</td>
              <td>{user.Role?.nombre}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => openModal(user)}>Editar</Button>
                <Button size="sm" variant="danger" className="ms-2" onClick={() => handleDelete(user.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</Modal.Title></Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña {editingUser && '(dejar vacío para no cambiar)'}</Form.Label>
              <Form.Control type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!editingUser} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select value={formData.rol_id} onChange={e => setFormData({...formData, rol_id: e.target.value})} required>
                <option value="">Seleccionar</option>
                {roles.map(rol => <option key={rol.id} value={rol.id}>{rol.nombre}</option>)}
              </Form.Select>
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

export default UserList;