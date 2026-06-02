
CREATE DATABASE bd_solicitudes;
USE bd_solicitudes;


CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(20) UNIQUE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  rol_id INT,
  activo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;


CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  descripcion TEXT,
  activo TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;


CREATE TABLE solicitudes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'pendiente',
  categoria_id INT,
  usuario_id INT,
  fecha_vencimiento DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  activo TINYINT(1) DEFAULT 1,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;
