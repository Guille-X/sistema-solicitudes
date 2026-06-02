const bcrypt = require('bcryptjs');
const { sequelize, User, Role } = require('../models');

async function createAdmin() {
  try {
    await sequelize.sync();

    // Buscar el rol 'admin'
    const adminRole = await Role.findOne({ where: { nombre: 'admin' } });
    if (!adminRole) {
      console.error(' No se encontró el rol "admin". Ejecuta primero el seed de roles.');
      process.exit(1);
    }

    // Verificar si ya existe algún admin
    const existingAdmin = await User.findOne({ where: { rol_id: adminRole.id } });
    if (existingAdmin) {
      console.log(`Ya existe un administrador: ${existingAdmin.email}`);
      console.log('Si olvidaste la contraseña, elimínalo y vuelve a correr este script.');
      process.exit(0);
    }

    // Contraseña por defecto
    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const admin = await User.create({
      nombre: 'Administrador',
      email: 'admin@example.com',
      password_hash: hashedPassword,
      rol_id: adminRole.id,
      activo: true,
    });

    console.log('Administrador creado exitosamente:');
    console.log(`Email: ${admin.email}`);
    console.log(`Contraseña: ${plainPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('Error al crear administrador:', error);
    process.exit(1);
  }
}

createAdmin();