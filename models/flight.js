const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
    default: 60,
  },
  bookedSeats: {
    type: [String],
    default: [],
  },
});

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;
