const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  descripcion: DataTypes.TEXT,
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'categorias',
  timestamps: false,
});

module.exports = Category;