const mongoose = require('mongoose');

const borrowerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Borrowing' }], // Referensi ke buku yang dipinjam
}, { timestamps: true });

module.exports = mongoose.model('Borrower', borrowerSchema);
