const Book = require('../models/book_model');
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan untuk unggahan sampul buku
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Menggunakan path.join untuk memastikan jalur yang tepat
    cb(null, path.join(__dirname, '../uploadbuku')); // Folder penyimpanan khusus untuk sampul buku
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});


// Filter file untuk memastikan hanya format gambar yang diizinkan
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpg, jpeg, png)'));
  }
};

// Instance multer dengan konfigurasi penyimpanan dan filter
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 } // Batas ukuran file 1 MB
});

// Mendapatkan semua buku
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books', error });
  }
};

// Mendapatkan detail buku berdasarkan ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving book', error });
  }
};

// Menambahkan buku baru
exports.addBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: 'Error adding book', error });
  }
};

// Mengupdate data buku berdasarkan ID
exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: 'Error updating book', error });
  }
};

// Menghapus buku berdasarkan ID
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error });
  }
};

// Upload sampul buku
exports.uploadBookCover = (req, res) => {
  upload.single('cover')(req, res, (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(400).json({ message: err.message });
    }
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ message: 'File uploaded successfully', file });
  });
};
