// borrower_routes.js
const express = require('express');
const router = express.Router();
const borrowerController = require('../controllers/borrower_controller');

// Routes untuk borrowers
router.get('/', borrowerController.getBorrowers); // Mendapatkan semua peminjam
router.get('/:id', borrowerController.getBorrowerById); // Mendapatkan peminjam berdasarkan ID
router.post('/', borrowerController.addBorrower); // Menambahkan peminjam baru
router.put('/:id', borrowerController.updateBorrower); // Memperbarui peminjam berdasarkan ID
router.delete('/:id', borrowerController.deleteBorrower); // Menghapus peminjam berdasarkan ID

module.exports = router;
