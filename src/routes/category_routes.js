const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category_controller');

// Routes untuk categories
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryController.addCategory); // Endpoint ini harus ada
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
