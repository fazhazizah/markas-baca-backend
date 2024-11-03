const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  stock: { type: Number, default: 1 },
  coverImage: { type: String }, // URL sampul buku (jika ada)
  description: { type: String },
  publishedYear: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
