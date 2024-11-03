const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowing_controller');

// Routes untuk borrowing books
router.post('/borrow/book', borrowingController.borrowBook);
router.get('/borrow/book/list', borrowingController.getActiveBorrowings);
router.post('/borrow/book/return', borrowingController.returnBook);

module.exports = router;

