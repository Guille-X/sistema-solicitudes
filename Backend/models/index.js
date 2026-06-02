const sequelize = require('../config/db');
const Role = require('./Role');
const User = require('./User');
const Category = require('./Category');
const Request = require('./Request');

// Relaciones ya definidas en cada modelo, pero aseguramos:
User.belongsTo(Role, { foreignKey: 'rol_id' });
Role.hasMany(User, { foreignKey: 'rol_id' });

Request.belongsTo(Category, { foreignKey: 'categoria_id' });
Request.belongsTo(User, { foreignKey: 'usuario_id' });
Category.hasMany(Request, { foreignKey: 'categoria_id' });
User.hasMany(Request, { foreignKey: 'usuario_id' });

module.exports = {
  sequelize,
  Role,
  User,
  Category,
  Request,
};