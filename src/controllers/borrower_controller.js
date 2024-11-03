const Borrower = require('../models/borrower_model');

// Mendapatkan semua data peminjam
exports.getBorrowers = async (req, res) => {
  try {
    const borrowers = await Borrower.find();
    res.status(200).json(borrowers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving borrowers', error });
  }
};

// Mendapatkan detail peminjam berdasarkan ID
exports.getBorrowerById = async (req, res) => {
  try {
    const borrower = await Borrower.findById(req.params.id);
    if (!borrower) return res.status(404).json({ message: 'Borrower not found' });
    res.status(200).json(borrower);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving borrower', error });
  }
};

// Menambahkan peminjam baru
exports.addBorrower = async (req, res) => {
  try {
    const newBorrower = new Borrower(req.body);
    await newBorrower.save();
    res.status(201).json(newBorrower);
  } catch (error) {
    res.status(400).json({ message: 'Error adding borrower', error });
  }
};

// Mengupdate data peminjam berdasarkan ID
exports.updateBorrower = async (req, res) => {
  try {
    const updatedBorrower = await Borrower.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBorrower) return res.status(404).json({ message: 'Borrower not found' });
    res.status(200).json(updatedBorrower);
  } catch (error) {
    res.status(400).json({ message: 'Error updating borrower', error });
  }
};

// Menghapus peminjam berdasarkan ID
exports.deleteBorrower = async (req, res) => {
  try {
    const deletedBorrower = await Borrower.findByIdAndDelete(req.params.id);
    if (!deletedBorrower) return res.status(404).json({ message: 'Borrower not found' });
    res.status(200).json({ message: 'Borrower deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting borrower', error });
  }
};
