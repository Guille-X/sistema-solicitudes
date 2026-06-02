const { Role } = require('../models');

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({ attributes: ['id', 'nombre'] });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};