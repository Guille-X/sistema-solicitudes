const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Category = require('./Category');
const User = require('./User');

const Request = sequelize.define('Request', {
  titulo: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  descripcion: DataTypes.TEXT,
  estado: {
    type: DataTypes.ENUM('pendiente', 'en_proceso', 'completada', 'rechazada'),
    defaultValue: 'pendiente',
  },
  fecha_vencimiento: DataTypes.DATEONLY,
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'solicitudes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

Request.belongsTo(Category, { foreignKey: 'categoria_id' });
Request.belongsTo(User, { foreignKey: 'usuario_id' });
Category.hasMany(Request, { foreignKey: 'categoria_id' });
User.hasMany(Request, { foreignKey: 'usuario_id' });

module.exports = Request;