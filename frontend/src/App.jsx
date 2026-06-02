import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import RequestList from './components/Solicitudes/RequestList';
import RequestForm from './components/Solicitudes/RequestForm';
import UserList from './components/Usuarios/UserList';
import CategoryList from './components/Categorias/CategoryList';
import NavigationBar from './components/Layout/Navbar';
import RequestDetail from './components/Solicitudes/RequestDetail';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/requests" element={<PrivateRoute><RequestList /></PrivateRoute>} />
          <Route path="/requests/new" element={<PrivateRoute allowedRoles={['admin', 'operador']}><RequestForm /></PrivateRoute>} />
          <Route path="/requests/edit/:id" element={<PrivateRoute allowedRoles={['admin', 'operador']}><RequestForm /></PrivateRoute>} />
          <Route path="/requests/:id" element={<PrivateRoute><RequestDetail /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute allowedRoles={['admin']}><UserList /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute allowedRoles={['admin']}><CategoryList /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;