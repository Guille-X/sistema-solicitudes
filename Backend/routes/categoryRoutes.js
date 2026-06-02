const express = require('express');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const auth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.use(auth);
router.get('/', getCategories); // Todos los roles pueden ver
router.get('/:id', getCategoryById);
router.post('/', roleMiddleware('admin'), createCategory);
router.put('/:id', roleMiddleware('admin'), updateCategory);
router.delete('/:id', roleMiddleware('admin'), deleteCategory);

module.exports = router;