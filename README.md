# Sistema de Gestión de Solicitudes Internas - Cooperativa INTERCOP RL

[![Demo en vivo](https://img.shields.io/badge/Demo_en_vivo-Azure-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)](https://nice-beach-056ffe810.5.azurestaticapps.net/login)

Sistema web moderno para administrar solicitudes internas de colaboradores. Permite registrar, dar seguimiento, gestionar usuarios y categorías, enviar notificaciones automáticas por correo y visualizar estadísticas mediante dashboard. Incluye control de acceso por roles (admin, operador, consulta), filtros avanzados, eliminación lógica y diseño responsivo.

## 🌐 Demo en vivo

Puedes probar la versión demo del sistema, desplegada en Microsoft Azure, aquí:

**URL de la demo:** [https://nice-beach-056ffe810.5.azurestaticapps.net/login](https://nice-beach-056ffe810.5.azurestaticapps.net/login)

> **Nota:** La demo requiere credenciales:  
> Usuario: `admin@example.com`  
> Contraseña: `admin123`

> **Importante:** La primera vez que inicies sesión, el sistema puede tardar unos segundos en responder. Esto se debe a que la demo está desplegada en modo **serverless** y el servicio entra en reposo cuando no se usa, por lo que el primer acceso puede experimentar un tiempo de espera adicional (*cold start*).

## Tecnologías

- **Backend:** Node.js, Express, Sequelize (ORM), MySQL, JWT, Nodemailer.
- **Frontend:** React, React Router, Axios, Bootstrap (React-Bootstrap), Chart.js.
- **Herramientas:** Vite, Nodemon, Git.

## Requisitos previos

- Node.js v18 o superior
- MySQL v8 o superior
- npm o yarn

## Instalación

### Clonar el repositorio
```bash

# Configurar Backend

git clone https://github.com/Guille-X/sistema-solicitudes.git
cd sistema-solicitudes
cd Backend
npm install
cp .env.example .env   # y edita las variables (base de datos, correo, JWT)
CREATE DATABASE bd_solicitudes; # Crea la base de datos en MySQL
npm run dev # El servidor corre en http://localhost:5000


# Configurar frontend
cd ../frontend
npm install
npm run dev # La aplicación estará en http://localhost:5173

```

## Contacto

### Para soporte o consultas: guillermoajsivinac@gmail.com
