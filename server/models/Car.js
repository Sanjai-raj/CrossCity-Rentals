const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  branchId: { type: String, required: true }, // Keeping string ID to match frontend constants for now
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  type: { type: String, required: true },
  transmission: { type: String, required: true },
  fuel: { type: String, required: true },
  seats: { type: Number, required: true },
  pricePerHour: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  trips: { type: Number, default: 0 },
  features: [String],
  image: { type: String, required: true },
  status: { type: String, enum: ['active', 'maintenance', 'booked'], default: 'active' }
});

module.exports = mongoose.model('Car', carSchema);