// backend/models/destination.js
import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  destination: { type: String, required: true },     // Name of the location (e.g., "Paris")
  clues: { type: [String], required: true },         // Multiple hints for guessing
  funFacts: { type: [String], required: true },      // Multiple fun facts to display later
}, {
  timestamps: true,
});

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
