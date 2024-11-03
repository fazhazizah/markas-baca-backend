// author_controller.js
const Author = require('../models/author_model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Folder penyimpanan
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Filter file untuk memastikan hanya foto yang diizinkan (jpg, jpeg, png)
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

// Membuat instance multer dengan konfigurasi penyimpanan dan filter file
const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 } // Batas ukuran file 1 MB
});

// Mendapatkan semua penulis
exports.getAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    console.error('Error retrieving authors:', error);
    res.status(500).json({ message: 'Error retrieving authors', error });
  }
};

// Mendapatkan detail penulis berdasarkan ID
exports.getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.status(200).json(author);
  } catch (error) {
    console.error('Error retrieving author:', error);
    res.status(500).json({ message: 'Error retrieving author', error });
  }
};

// Menambahkan penulis baru
exports.addAuthor = async (req, res) => {
  try {
    if (!req.body.name || !req.body.bio) {
      return res.status(400).json({ message: 'Name and bio are required' });
    }

    const newAuthor = new Author(req.body);
    await newAuthor.save();
    res.status(201).json(newAuthor);
  } catch (error) {
    console.error('Error adding author:', error);
    res.status(400).json({ message: 'Error adding author', error });
  }
};

// Mengupdate data penulis berdasarkan ID
exports.updateAuthor = async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error('Error updating author:', error);
    res.status(400).json({ message: 'Error updating author', error });
  }
};

// Menghapus penulis berdasarkan ID
exports.deleteAuthor = async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (error) {
    console.error('Error deleting author:', error);
    res.status(500).json({ message: 'Error deleting author', error });
  }
};

// Upload foto penulis
exports.uploadAuthorPhoto = (req, res) => {
  upload.single('photo')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({ message: 'Error uploading file', error: err.message });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(200).json({ message: 'File uploaded successfully', file });
  });
};
