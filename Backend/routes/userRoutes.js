const express = require('express');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.use(auth);
router.get('/', roleMiddleware('admin'), getUsers);
router.get('/:id', roleMiddleware('admin'), getUserById);
router.post('/', roleMiddleware('admin'), createUser);
router.put('/:id', roleMiddleware('admin'), updateUser);
router.delete('/:id', roleMiddleware('admin'), deleteUser);

module.exports = router;