const googleMapsService = require('../services/googleMapsService');
const itineraryService = require('../services/itineraryService');

// Get directions between two locations
exports.getDirections = async (req, res) => {
  try {
    const { origin, destination, departureTime, travelMode } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        error: 'Origin and destination are required'
      });
    }

    const directions = await googleMapsService.getDirections(
      origin,
      destination,
      departureTime,
      travelMode || 'transit'
    );

    res.json({ success: true, data: directions });
  } catch (error) {
    console.error('Error getting directions:', error);
    res.status(500).json({
      error: 'Failed to get directions',
      message: error.message
    });
  }
};

// Get places (attractions, restaurants) based on preferences
exports.getPlaces = async (req, res) => {
  try {
    const { location, radius, type, keyword, preferences } = req.body;

    if (!location) {
      return res.status(400).json({
        error: 'Location is required'
      });
    }

    const places = await googleMapsService.getPlaces(
      location,
      radius || 5000,
      type,
      keyword,
      preferences
    );

    res.json({ success: true, data: places });
  } catch (error) {
    console.error('Error getting places:', error);
    res.status(500).json({
      error: 'Failed to get places',
      message: error.message
    });
  }
};

// Generate complete travel itinerary
exports.generateItinerary = async (req, res) => {
  try {
    const {
      origin,
      destination,
      departureTime,
      duration,
      preferences
    } = req.body;

    if (!origin || !destination || !departureTime || !duration) {
      return res.status(400).json({
        error: 'Origin, destination, departure time, and duration are required'
      });
    }

    const itinerary = await itineraryService.generateItinerary(
      origin,
      destination,
      departureTime,
      duration,
      preferences
    );

    res.json({ success: true, data: itinerary });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({
      error: 'Failed to generate itinerary',
      message: error.message
    });
  }
};
