const { Category } = require('../models');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ where: { activo: true } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, { where: { activo: true } });
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada.' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const newCategory = await Category.create({ nombre, descripcion, activo: true });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const category = await Category.findByPk(req.params.id);
    if (!category || !category.activo) return res.status(404).json({ message: 'Categoría no encontrada.' });
    category.nombre = nombre || category.nombre;
    category.descripcion = descripcion || category.descripcion;
    await category.save();
    res.json({ message: 'Categoría actualizada.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada.' });
    category.activo = false;
    await category.save();
    res.json({ message: 'Categoría eliminada (lógicamente).' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};