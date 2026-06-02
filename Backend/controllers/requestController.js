const { Request, Category, User } = require('../models');
const { enviarCorreo } = require('../utils/emailService');
const { Op } = require('sequelize');

exports.getRequests = async (req, res) => {
  try {
    const { estado, categoriaId, fechaInicio, fechaFin, search, page = 1, limit = 10 } = req.query;
    const where = { activo: true };
    if (estado) where.estado = estado;
    if (categoriaId) where.categoria_id = parseInt(categoriaId);
    if (fechaInicio && fechaFin) {
      where.created_at = { [Op.between]: [new Date(fechaInicio), new Date(fechaFin)] };
    }
    if (search) {
      where[Op.or] = [
        { titulo: { [Op.iLike]: `%${search}%` } },
        { descripcion: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await Request.findAndCountAll({
      where,
      include: [
        { model: Category, attributes: ['id', 'nombre'] },
        { model: User, attributes: ['id', 'nombre', 'email'] },
      ],
      order: [['created_at', 'DESC']],
      offset,
      limit: parseInt(limit),
    });

    res.json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      requests: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findByPk(req.params.id, {
      where: { activo: true },
      include: [
        { model: Category, attributes: ['id', 'nombre'] },
        { model: User, attributes: ['id', 'nombre', 'email'] },
      ],
    });
    if (!request) return res.status(404).json({ message: 'Solicitud no encontrada.' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const { titulo, descripcion, categoria_id, fecha_vencimiento } = req.body;
    const usuario_id = req.user.id; // del token

    const newRequest = await Request.create({
      titulo,
      descripcion,
      categoria_id,
      usuario_id,
      fecha_vencimiento,
      estado: 'pendiente',
      activo: true,
    });

    // Obtener datos completos para el correo
    const requestWithData = await Request.findByPk(newRequest.id, {
      include: [{ model: User, attributes: ['email'] }],
    });

    // Enviar correo al usuario que creó la solicitud (o al administrador)
    await enviarCorreo(
      requestWithData.User.email,
      'Solicitud registrada exitosamente',
      `<h3>Nueva solicitud: ${titulo}</h3><p>Descripción: ${descripcion}</p><p>Estado: pendiente</p>`
    );

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const { titulo, descripcion, estado, categoria_id, fecha_vencimiento } = req.body;
    const request = await Request.findByPk(req.params.id);
    if (!request || !request.activo) return res.status(404).json({ message: 'Solicitud no encontrada.' });

    request.titulo = titulo || request.titulo;
    request.descripcion = descripcion || request.descripcion;
    request.estado = estado || request.estado;
    request.categoria_id = categoria_id || request.categoria_id;
    request.fecha_vencimiento = fecha_vencimiento || request.fecha_vencimiento;
    await request.save();

    // Notificar al usuario creador sobre el cambio de estado
    const usuario = await User.findByPk(request.usuario_id);
    await enviarCorreo(
      usuario.email,
      `Actualización de solicitud #${request.id}`,
      `<p>La solicitud "${request.titulo}" ha cambiado a estado: ${request.estado}</p>`
    );

    res.json({ message: 'Solicitud actualizada.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: 'Solicitud no encontrada.' });
    request.activo = false;
    await request.save();
    res.json({ message: 'Solicitud eliminada (lógicamente).' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};