// backend/models/destination.js

import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  clues: [String],
  funFact: String,
});

const Destination = mongoose.model('Destination', destinationSchema);

export default Destination;
