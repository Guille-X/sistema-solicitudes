import React, { useEffect, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const RequestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria_id: '',
    fecha_vencimiento: '',
    estado: 'pendiente'
  });
  const [categories, setCategories] = useState([]);
  const isEditing = !!id;

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get('/categories');
      setCategories(res.data);
    };
    fetchCategories();
    if (isEditing) {
      const fetchRequest = async () => {
        const res = await api.get(`/requests/${id}`);
        // Asegurar que fecha_vencimiento esté en formato YYYY-MM-DD para el input date
        const reqData = res.data;
        reqData.fecha_vencimiento = reqData.fecha_vencimiento ? reqData.fecha_vencimiento.split('T')[0] : '';
        setFormData(reqData);
      };
      fetchRequest();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/requests/${id}`, formData);
      } else {
        await api.post('/requests', formData);
      }
      navigate('/requests');
    } catch (error) {
      console.error(error);
      alert('Error al guardar la solicitud');
    }
  };

  return (
    <Container className="mt-4">
      <h2>{isEditing ? 'Editar Solicitud' : 'Nueva Solicitud'}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Título</Form.Label>
          <Form.Control type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control as="textarea" rows={3} name="descripcion" value={formData.descripcion} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Categoría</Form.Label>
          <Form.Select name="categoria_id" value={formData.categoria_id} onChange={handleChange} required>
            <option value="">Seleccione...</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Fecha vencimiento</Form.Label>
          <Form.Control type="date" name="fecha_vencimiento" value={formData.fecha_vencimiento} onChange={handleChange} />
        </Form.Group>
        {isEditing && (
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select name="estado" value={formData.estado} onChange={handleChange}>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="completada">Completada</option>
              <option value="rechazada">Rechazada</option>
            </Form.Select>
          </Form.Group>
        )}
        <Button variant="primary" type="submit">Guardar</Button>
        <Button variant="secondary" onClick={() => navigate('/requests')} className="ms-2">Cancelar</Button>
      </Form>
    </Container>
  );
};

export default RequestForm;