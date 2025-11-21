// --- top-of-file (keep your existing requires + models) ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Car = require('./models/Car');
const Booking = require('./models/Booking');

const app = express();
app.use(cors());
app.use(express.json());

// --- Strict Mongo connection (fail fast if env missing) ---
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('FATAL: MONGO_URI is not set. Please set MONGO_URI in your environment (Render). Exiting.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    // Crash so Render shows the failure and you can fix it immediately.
    process.exit(1);
  });

// Optional: log connection state changes
mongoose.connection.on('connected', () => console.log('Mongoose connected (event)'));
mongoose.connection.on('error', err => console.error('Mongoose connection error (event):', err));
mongoose.connection.on('disconnected', () => console.warn('Mongoose disconnected'));

// --- Temporary route to discover outbound IP (add, deploy, call once) ---
app.get('/myip', (req, res) => {
  // Note: req.ip may show a proxied address; for Render it usually works.
  // If you get an IPv6/::ffff: format, use that value when whitelisting (strip prefix if necessary).
  res.send({ ip: req.ip });
});

// --- health and root endpoints (keep these) ---
app.get('/health', (req, res) => {
  const state = mongoose.connection?.readyState ?? 0;
  res.json({ status: 'ok', mongooseReadyState: state });
});

app.get('/', (req, res) => {
  res.send('Backend up. See /health for status and /api for endpoints.');
});
