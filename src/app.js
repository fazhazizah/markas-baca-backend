// app.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const routes = require('./routes'); // Pastikan file routes.js sudah ada dan benar
const connectDB = require('./config/mongodb'); // Pastikan file mongodb.js sudah ada dan benar

// Load environment variables from .env file
dotenv.config();

// Initialize the app
const app = express();

// Set the port, defaulting to 3000 if not specified in .env
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('MongoDB connected successfully!');

    // Middleware for JSON parsing
    app.use(express.json());

    // Middleware for CORS
    app.use(cors());

    // Serve static files in the uploads folder
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Use routes with the prefix /api/v1
    app.use('/api/v1', routes);

    // Error handling middleware (optional but recommended)
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something went wrong!');
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the application if the DB connection fails
  });
