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

// --- Improve MongoDB connection with clear logs and graceful handling ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://carRental:12345@carrental.vbz3jkc.mongodb.net/carRental?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    // optionally exit so Render/K8s restarts the process if DB is required
    // process.exit(1);
  });

// Optional: log connection state changes
mongoose.connection.on('connected', () => console.log('Mongoose connected (event)'));
mongoose.connection.on('error', err => console.error('Mongoose connection error (event):', err));
mongoose.connection.on('disconnected', () => console.warn('Mongoose disconnected'));

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.json({ message: 'User registered' });
  } catch (error) {
    console.error('Register error:', error);
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

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- CAR ROUTES ---

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
    const transformedCars = cars.map(c => ({ 
      ...c.toObject(), 
      id: c._id.toString(),
      _id: c._id.toString() 
    }));
    res.json(transformedCars);
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

app.get('/api/cars/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json({ 
      ...car.toObject(), 
      id: car._id.toString(),
      _id: car._id.toString()
    });
  } catch (error) {
    console.error('Get car by id error:', error);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

// --- BOOKING ROUTES ---

app.post('/api/bookings', async (req, res) => {
  try {
    // In a real app, verify JWT token here
    const booking = await Booking.create(req.body);
    res.json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Booking failed' });
  }
});

app.get('/api/bookings/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('carId');
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// --- ADMIN STATS ---

app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    const revenueAgg = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const statusAgg = await Car.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const stats = {
      totalCars,
      totalBookings,
      totalRevenue,
      statusBreakdown: statusAgg
    };
    res.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Stats failed' });
  }
});

// --- Health & root endpoints (added) ---
app.get('/health', (req, res) => {
  const state = mongoose.connection?.readyState ?? 0;
  res.json({ status: 'ok', mongooseReadyState: state });
});

app.get('/', (req, res) => {
  res.send('Backend up. See /health for status and /api for endpoints.');
});

// Serve static client build if present (optional)
const path = require('path');
const clientBuildPath = path.join(__dirname, 'client', 'build');
if (require('fs').existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown handlers (useful in host environments)
function gracefulShutdown() {
  console.log('Shutting down gracefully...');
  mongoose.connection.close(false, () => {
    console.log('Mongo connection closed. Exiting.');
    process.exit(0);
  });
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
