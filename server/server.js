// --- IMPORTS ---
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

// --- STRICT MONGO CONNECTION ---
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('FATAL: MONGO_URI is not set. Please set MONGO_URI in Render.');
  process.exit(1);
}

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
}
connectDB();

mongoose.connection.on('connected', () => console.log('Mongoose connected (event)'));
mongoose.connection.on('error', (err) => console.error('Mongoose error:', err));
mongoose.connection.on('disconnected', () => console.warn('Mongoose disconnected'));

// --- TEMP: CHECK OUTBOUND IP ---
app.get('/myip', (req, res) => {
  res.send({ ip: req.ip });
});

// --- HEALTH CHECK ---
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mongooseReadyState: mongoose.connection.readyState
  });
});

// --- ROOT ---
app.get('/', (req, res) => {
  res.send('Backend up. See /health for status and /api for endpoints.');
});

// -------------------------
// AUTH ROUTES
// -------------------------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, role });
    res.json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// -------------------------
// CAR ROUTES
// -------------------------
app.get('/api/cars', async (req, res) => {
  try {
    const { cityId, branchId, type, transmission } = req.query;
    const query = { status: 'active' };

    if (branchId && branchId !== 'all') {
      query.branchId = branchId;
    } else if (cityId) {
      query.branchId = { $regex: `^${cityId}`, $options: 'i' };
    }

    if (type && type !== 'all') query.type = type;
    if (transmission && transmission !== 'all') query.transmission = transmission;

    const cars = await Car.find(query);

    res.json(
      cars.map(c => ({
        ...c.toObject(),
        id: c._id.toString(),
        _id: c._id.toString()
      }))
    );
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

// CAR BY ID
app.get('/api/cars/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });

    res.json({
      ...car.toObject(),
      id: car._id.toString(),
      _id: car._id.toString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

// -------------------------
// BOOKING ROUTES
// -------------------------
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Booking failed' });
  }
});

app.get('/api/bookings/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('carId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// -------------------------
// ADMIN STATS
// -------------------------
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const revenueAgg = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      totalCars,
      totalBookings,
      totalRevenue: revenueAgg[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Stats failed' });
  }
});

// -------------------------
// START SERVER (IMPORTANT)
// -------------------------
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => mongoose.connection.close());
process.on('SIGINT', () => mongoose.connection.close());
