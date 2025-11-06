const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travelController');

// Get directions with real-time transit
router.post('/directions', travelController.getDirections);

// Get places (attractions, restaurants) based on preferences
router.post('/places', travelController.getPlaces);

// Generate full travel itinerary
router.post('/itinerary', travelController.generateItinerary);

module.exports = router;
