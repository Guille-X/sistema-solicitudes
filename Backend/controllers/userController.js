const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');

// Obtener todos los usuarios (activos)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { activo: true },
      include: { model: Role, attributes: ['nombre'] },
      attributes: { exclude: ['password_hash'] },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      where: { activo: true },
      include: { model: Role, attributes: ['nombre'] },
      attributes: { exclude: ['password_hash'] },
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear usuario (solo admin)
exports.createUser = async (req, res) => {
  try {
    const { nombre, email, password, rol_id } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'El email ya está registrado.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      nombre,
      email,
      password_hash: hashedPassword,
      rol_id,
      activo: true,
    });

    res.status(201).json({ message: 'Usuario creado exitosamente.', user: { id: newUser.id, nombre, email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const { nombre, email, password, rol_id } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user || !user.activo) return res.status(404).json({ message: 'Usuario no encontrado.' });

    user.nombre = nombre || user.nombre;
    user.email = email || user.email;
    if (password) user.password_hash = await bcrypt.hash(password, 10);
    if (rol_id) user.rol_id = rol_id;
    await user.save();

    res.json({ message: 'Usuario actualizado.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminación lógica
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
    user.activo = false;
    await user.save();
    res.json({ message: 'Usuario eliminado (lógicamente).' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};