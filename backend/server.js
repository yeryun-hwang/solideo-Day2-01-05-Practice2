require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS configuration for production deployment
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // Allow these origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://yeryun-hwang.github.io'
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('github.io')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for OpenStreetMap demo
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const travelRoutes = require('./routes/travel');
app.use('/api/travel', travelRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Travel Planner API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
