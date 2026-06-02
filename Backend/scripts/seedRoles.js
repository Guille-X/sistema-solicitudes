const { Role } = require('../models');
const sequelize = require('../config/db');

async function seedRoles() {
  await sequelize.sync();
  await Role.bulkCreate([
    { nombre: 'admin' },
    { nombre: 'operador' },
    { nombre: 'consulta' },
  ], { ignoreDuplicates: true });
  console.log('Roles insertados');
  process.exit();
}

seedRoles();