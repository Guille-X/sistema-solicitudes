const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado.' });
    }
    if (allowedRoles.includes(req.user.rolNombre)) {
      next();
    } else {
      res.status(403).json({ message: 'Acceso prohibido. No tienes los permisos necesarios.' });
    }
  };
};

module.exports = roleMiddleware;