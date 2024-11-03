// author_routes.js
const express = require('express');
const router = express.Router();
const authorController = require('../controllers/author_controller');

// Routes untuk authors
router.get('/', authorController.getAuthors);            // Mendapatkan semua penulis
router.get('/:id', authorController.getAuthorById);      // Mendapatkan penulis berdasarkan ID
router.post('/', authorController.addAuthor);            // Menambahkan penulis baru
router.put('/:id', authorController.updateAuthor);       // Mengupdate data penulis berdasarkan ID
router.delete('/:id', authorController.deleteAuthor);    // Menghapus penulis berdasarkan ID

// Route untuk upload foto penulis
router.post('/upload-photo', authorController.uploadAuthorPhoto); // Mengupload foto penulis

module.exports = router;
