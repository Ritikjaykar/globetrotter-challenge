// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from './models/destination.js';
import destinations from './data/destinationData.js'; // <-- ✅ importing full list

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); // ✅ simplified and modern
    await Destination.deleteMany({});
    await Destination.insertMany(destinations); // ✅ using full list
    console.log('✅ Successfully seeded full destination list');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
