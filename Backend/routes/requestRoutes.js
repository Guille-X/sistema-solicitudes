const express = require('express');
const {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
} = require('../controllers/requestController');
const auth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.use(auth);
router.get('/', getRequests); // Todos los roles autenticados pueden listar
router.get('/:id', getRequestById);
router.post('/', roleMiddleware('admin', 'operador'), createRequest);
router.put('/:id', roleMiddleware('admin', 'operador'), updateRequest);
router.delete('/:id', roleMiddleware('admin'), deleteRequest);

module.exports = router;