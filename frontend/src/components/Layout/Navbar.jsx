import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Sistema de Solicitudes</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/requests">Solicitudes</Nav.Link>
            {user?.rol === 'admin' && (
              <>
                <Nav.Link as={Link} to="/categories">Categorías</Nav.Link>
                <Nav.Link as={Link} to="/users">Usuarios</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <Navbar.Text>Bienvenido, {user?.nombre} ({user?.rol})</Navbar.Text>
            <Button variant="outline-light" size="sm" onClick={handleLogout} className="ms-2">Cerrar sesión</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;