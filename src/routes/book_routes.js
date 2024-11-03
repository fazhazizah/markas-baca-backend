const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book_controller');

// Route untuk mendapatkan semua buku
router.get('/', bookController.getBooks); // GET /api/v1/books

// Route untuk mendapatkan detail buku berdasarkan ID
router.get('/:id', bookController.getBookById);

// Route untuk menambahkan buku baru
router.post('/', bookController.addBook);

// Route untuk mengupdate data buku berdasarkan ID
router.put('/:id', bookController.updateBook);

// Route untuk menghapus buku berdasarkan ID
router.delete('/:id', bookController.deleteBook);

// Route untuk mengunggah sampul buku
router.post('/upload-cover', bookController.uploadBookCover);

module.exports = router;
