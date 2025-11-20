const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'completed', 'cancelled'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);