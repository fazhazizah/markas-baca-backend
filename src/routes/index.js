const express = require('express');
const bookRoutes = require('./book_routes');
const authorRoutes = require('./author_routes');
const categoryRoutes = require('./category_routes');
const borrowerRoutes = require('./borrower_routes');
const borrowingRoutes = require('./borrowing_routes');

const router = express.Router();

// Daftarkan semua route
router.use('/books', bookRoutes);
router.use('/authors', authorRoutes);
router.use('/categories', categoryRoutes);
router.use('/borrowers', borrowerRoutes);
router.use('/borrows', borrowingRoutes);

module.exports = router;
