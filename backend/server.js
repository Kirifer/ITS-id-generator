const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const adminRoutes = require('./routes/admin');
const approverRoutes = require('./routes/approver');  // ✅ renamed from hr.js
const employeeRoutes = require('./routes/employee');
const authRoutes = require('./routes/auth');



// Load environment variables
dotenv.config();

if (!process.env.MONGO_URI || !process.env.FRONTEND_URL || !process.env.JWT_SECRET) {
  console.error('Missing required environment variables: MONGO_URI, FRONTEND_URL, or JWT_SECRET');
  process.exit(1);
}

const app = express();

// CORS
const corsOptions = {
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '10mb', strict: false }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logger
app.use((req, res, next) => {
  console.log('=== Incoming Request ===');
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/approver', approverRoutes);  // ✅ renamed route
app.use('/api/employee', employeeRoutes);



// 404 Handler
app.use((req, res) => {
  console.log('404 - Route Not Found:', req.method, req.url);
  res.status(404).json({
    error: 'Route Not Found',
    method: req.method,
    path: req.url,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// MongoDB connection
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });
