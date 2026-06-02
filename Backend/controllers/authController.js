const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email, activo: true },
      include: Role,
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rolId: user.rol_id,
        rolNombre: user.Role.nombre,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.Role.nombre,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};