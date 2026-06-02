const { Request, Category, User, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    // Solicitudes por estado
    const porEstado = await Request.findAll({
      attributes: ['estado', [sequelize.fn('COUNT', sequelize.col('id')), 'total']],
      where: { activo: true },
      group: ['estado'],
    });

    // Solicitudes por categoría
    const porCategoria = await Request.findAll({
      attributes: [
        [sequelize.col('Category.nombre'), 'categoria'],
        [sequelize.fn('COUNT', sequelize.col('Request.id')), 'total'],
      ],
      include: [{ model: Category, attributes: [] }],
      where: { activo: true },
      group: ['Category.nombre'],
    });

    // Evolución últimos 30 días (solicitudes por día)
    const treintaDiasAtras = new Date();
    treintaDiasAtras.setDate(treintaDiasAtras.getDate() - 30);
    const evolucion = await Request.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'fecha'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad'],
      ],
      where: {
        activo: true,
        created_at: { [Op.gte]: treintaDiasAtras },
      },
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
    });

    res.json({
      porEstado,
      porCategoria,
      evolucion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};