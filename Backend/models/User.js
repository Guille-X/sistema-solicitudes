const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Role = require('./Role');

const User = sequelize.define('User', {
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

User.belongsTo(Role, { foreignKey: 'rol_id' });
Role.hasMany(User, { foreignKey: 'rol_id' });

module.exports = User;