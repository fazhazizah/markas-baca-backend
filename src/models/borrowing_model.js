const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Borrower', required: true },
    borrowedDate: { type: Date, required: true },
    dueDate: { type: Date, required: true }, // Menambahkan dueDate
    returnDate: { type: Date },
    fine: { type: Number, default: 0 },
    status: { type: String, default: 'borrowed' }
}, { timestamps: true });

// Middleware untuk menghitung denda otomatis jika returnDate melebihi dueDate
borrowingSchema.pre('save', function (next) {
    const today = new Date();
    // Jika returnDate diisi dan sudah lewat dari dueDate
    if (this.returnDate) {
        // Hitung denda jika terlambat
        if (this.returnDate > this.dueDate) {
            const diffInDays = Math.ceil((this.returnDate - this.dueDate) / (1000 * 60 * 60 * 24));
            this.fine = diffInDays * 1000; // Denda per hari (contoh: Rp 1.000 per hari)
        } else {
            this.fine = 0; // Reset denda jika tidak terlambat
        }
    }
    next();
});

// Middleware untuk mengatur dueDate saat peminjaman dibuat
borrowingSchema.pre('save', function (next) {
    if (!this.dueDate && this.borrowedDate) {
        const dueDate = new Date(this.borrowedDate);
        dueDate.setDate(dueDate.getDate() + 7); // Mengatur dueDate 7 hari setelah borrowedDate
        this.dueDate = dueDate;
    }
    next();
});

module.exports = mongoose.model('Borrowing', borrowingSchema);
