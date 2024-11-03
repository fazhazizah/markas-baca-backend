const Borrowing = require('../models/borrowing_model');
const Book = require('../models/book_model');

// Helper function untuk mengubah format tanggal ke DD-MM-YYYY
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`; // Memperbaiki sintaks
};

// Fungsi untuk menghitung denda
const calculateFine = (dueDate, returnDate) => {
    const due = new Date(dueDate);
    const returned = new Date(returnDate);
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const daysLate = Math.floor((returned - due) / millisecondsPerDay);

    if (daysLate > 0) {
        const finePerDay = 5000; // Denda per hari
        return daysLate * finePerDay;
    }
    return 0;
};

// Menambahkan data peminjaman buku baru
exports.borrowBook = async (req, res) => {
    try {
        const { bookId, borrowerId, borrowedDate } = req.body;

        if (!bookId || !borrowerId || !borrowedDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.stock <= 0) {
            return res.status(400).json({ message: 'Book out of stock' });
        }

        book.stock -= 1; // Mengurangi stok buku
        await book.save();

        const borrowedDateObject = new Date(borrowedDate); // Mengubah ke Date object
        const dueDate = new Date(borrowedDateObject); // Membuat salinan untuk dueDate
        dueDate.setDate(dueDate.getDate() + 7); // Mengatur dueDate 7 hari setelah borrowedDate

        const newBorrowing = new Borrowing({
            bookId,
            borrowerId,
            borrowedDate: borrowedDateObject, // Pastikan ini adalah Date object
            dueDate: dueDate, // Tambahkan dueDate
        });
        await newBorrowing.save();

        // Format tanggal sebelum mengirim response
        const response = {
            ...newBorrowing.toObject(),
            borrowedDate: formatDate(newBorrowing.borrowedDate),
            returnDate: newBorrowing.returnDate ? formatDate(newBorrowing.returnDate) : null,
            dueDate: formatDate(newBorrowing.dueDate), // Format dueDate untuk response
        };

        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Error borrowing book', error });
    }
};

// Mendapatkan daftar peminjaman buku yang masih aktif
exports.getActiveBorrowings = async (req, res) => {
    try {
        const activeBorrowings = await Borrowing.find({ returnDate: { $exists: false } }).populate('bookId borrowerId');

        const formattedBorrowings = activeBorrowings.map(borrowing => ({
            ...borrowing.toObject(),
            borrowedDate: formatDate(borrowing.borrowedDate),
            returnDate: borrowing.returnDate ? formatDate(borrowing.returnDate) : null,
        }));

        res.status(200).json(formattedBorrowings);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving active borrowings', error });
    }
};

// Mengembalikan buku dan menghitung denda
exports.returnBook = async (req, res) => {
    try {
        const { borrowingId, returnDate } = req.body;

        if (!borrowingId || !returnDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const borrowing = await Borrowing.findById(borrowingId);
        if (!borrowing) {
            return res.status(404).json({ message: 'Borrowing not found' });
        }

        const fine = calculateFine(borrowing.borrowedDate, returnDate);

        const book = await Book.findById(borrowing.bookId);
        if (book) {
            book.stock += 1; // Mengembalikan stok buku
            await book.save();
        }

        borrowing.returnDate = new Date(returnDate);
        borrowing.fine = fine;
        borrowing.status = 'returned';
        await borrowing.save();

        const response = {
            ...borrowing.toObject(),
            borrowedDate: formatDate(borrowing.borrowedDate),
            returnDate: formatDate(borrowing.returnDate),
        };

        res.status(200).json({ message: 'Book returned successfully', borrowing: response });
    } catch (error) {
        res.status(500).json({ message: 'Error returning book', error });
    }
};

