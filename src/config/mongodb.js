const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
      await mongoose.connect('mongodb+srv://moonskyzeea:moviezzvocasia@clustermoviezzz.ol6bg.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMoviezzz');
      console.log('MongoDB connected successfully!');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  };
  

module.exports = connectDB;  
