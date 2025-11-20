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

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/multicity_carshare')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.json({ message: 'User registered' });
  } catch (error) {
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
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- CAR ROUTES ---

app.get('/api/cars', async (req, res) => {
  try {
    const { cityId, branchId, type, transmission } = req.query;
    const query = { status: 'active' };

    // Note: Logic assumes branches map to cities stringently in frontend
    if (branchId && branchId !== 'all') {
      query.branchId = branchId;
    } else if (cityId) {
       // In a real DB, Branch would be a model and we'd join. 
       // For this MVP, we rely on the branchId naming convention or pass valid branch IDs from frontend
       // Simple RegEx filter for branchId containing city code (e.g. 'blr-')
       query.branchId = { $regex: `^${cityId}`, $options: 'i' };
    }

    if (type && type !== 'all') query.type = type;
    if (transmission && transmission !== 'all') query.transmission = transmission;

    const cars = await Car.find(query);
    // Transform _id to id string for frontend compatibility explicitly
    const transformedCars = cars.map(c => ({ 
      ...c.toObject(), 
      id: c._id.toString(),
      _id: c._id.toString() 
    }));
    res.json(transformedCars);
  } catch (error) {
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
    res.status(500).json({ error: 'Booking failed' });
  }
});

app.get('/api/bookings/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('carId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// --- ADMIN STATS ---

app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Mock revenue calculation (sum of totalPrice)
    const revenueAgg = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Get fleet status
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
    res.status(500).json({ error: 'Stats failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));