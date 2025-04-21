// backend/scripts/seedDestinations.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from '../models/destination.js';
import destinationData from '../data/destinationData.js';

dotenv.config(); // Load .env file

const seedDestinations = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('❌ MONGODB_URI is not defined in .env');
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🟢 Connected to MongoDB');

    await Destination.deleteMany();
    console.log('🗑️ Cleared existing destinations');

    await Destination.insertMany(destinationData);
    console.log('✅ Seeded new destinations');

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding destinations:', error);
    process.exit(1);
  }
};

seedDestinations();
