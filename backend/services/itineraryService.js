const googleMapsService = require('./googleMapsService');

// Generate a complete travel itinerary
exports.generateItinerary = async (origin, destination, departureTime, duration, preferences = {}) => {
  try {
    const itinerary = {
      origin,
      destination,
      departureTime,
      duration,
      days: []
    };

    // Get main transportation route
    const mainRoute = await googleMapsService.getDirections(
      origin,
      destination,
      departureTime,
      'transit'
    );

    itinerary.mainTransportation = mainRoute[0]; // Best route

    // Calculate arrival time and trip duration
    const tripDuration = mainRoute[0].legs[0].duration.value;
    const arrivalTime = new Date(new Date(departureTime).getTime() + tripDuration * 1000);

    // Extract destination coordinates
    const destLat = mainRoute[0].legs[0].end_location.lat;
    const destLng = mainRoute[0].legs[0].end_location.lng;
    const destLocation = `${destLat},${destLng}`;

    // Generate daily itinerary for the duration of the trip
    const durationDays = parseInt(duration);
    for (let day = 1; day <= durationDays; day++) {
      const dayItinerary = await this.generateDayItinerary(
        destLocation,
        day,
        preferences,
        arrivalTime
      );
      itinerary.days.push(dayItinerary);
    }

    // Add return transportation
    const returnDate = new Date(arrivalTime.getTime() + durationDays * 24 * 60 * 60 * 1000);
    const returnRoute = await googleMapsService.getDirections(
      destination,
      origin,
      returnDate.toISOString(),
      'transit'
    );

    itinerary.returnTransportation = returnRoute[0];

    return itinerary;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw error;
  }
};

// Generate itinerary for a single day
exports.generateDayItinerary = async (location, dayNumber, preferences, baseDate) => {
  try {
    const dayItinerary = {
      day: dayNumber,
      date: new Date(baseDate.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000),
      activities: []
    };

    // Morning: Tourist attractions
    if (!preferences.skipAttractions) {
      const attractions = await googleMapsService.getPlaces(
        location,
        5000,
        'tourist_attraction',
        preferences.attractionKeywords || '',
        {
          minRating: preferences.minRating || 4.0,
          priceLevel: preferences.priceLevel || 3
        }
      );

      if (attractions.length > 0) {
        dayItinerary.activities.push({
          time: '09:00',
          type: 'attraction',
          name: attractions[0].name,
          location: attractions[0].geometry.location,
          address: attractions[0].vicinity,
          rating: attractions[0].rating,
          description: 'Morning sightseeing'
        });
      }

      if (attractions.length > 1) {
        dayItinerary.activities.push({
          time: '11:30',
          type: 'attraction',
          name: attractions[1].name,
          location: attractions[1].geometry.location,
          address: attractions[1].vicinity,
          rating: attractions[1].rating,
          description: 'Late morning activity'
        });
      }
    }

    // Lunch: Restaurants
    const restaurants = await googleMapsService.getPlaces(
      location,
      3000,
      'restaurant',
      preferences.foodKeywords || preferences.cuisine || '',
      {
        minRating: preferences.minRating || 4.0,
        priceLevel: preferences.priceLevel || 2
      }
    );

    if (restaurants.length > 0) {
      dayItinerary.activities.push({
        time: '13:00',
        type: 'restaurant',
        name: restaurants[0].name,
        location: restaurants[0].geometry.location,
        address: restaurants[0].vicinity,
        rating: restaurants[0].rating,
        priceLevel: restaurants[0].price_level,
        description: 'Lunch'
      });
    }

    // Afternoon: More attractions or shopping
    if (!preferences.skipAttractions) {
      const afternoonType = preferences.includeShopping ? 'shopping_mall' : 'tourist_attraction';
      const afternoonPlaces = await googleMapsService.getPlaces(
        location,
        5000,
        afternoonType,
        preferences.afternoonKeywords || '',
        {
          minRating: preferences.minRating || 4.0,
          priceLevel: preferences.priceLevel || 3
        }
      );

      if (afternoonPlaces.length > 0) {
        dayItinerary.activities.push({
          time: '15:00',
          type: afternoonType === 'shopping_mall' ? 'shopping' : 'attraction',
          name: afternoonPlaces[0].name,
          location: afternoonPlaces[0].geometry.location,
          address: afternoonPlaces[0].vicinity,
          rating: afternoonPlaces[0].rating,
          description: 'Afternoon activity'
        });
      }
    }

    // Dinner: Restaurants
    if (restaurants.length > 1) {
      dayItinerary.activities.push({
        time: '19:00',
        type: 'restaurant',
        name: restaurants[1].name,
        location: restaurants[1].geometry.location,
        address: restaurants[1].vicinity,
        rating: restaurants[1].rating,
        priceLevel: restaurants[1].price_level,
        description: 'Dinner'
      });
    }

    // Evening: Cafes or bars
    if (preferences.includeNightlife) {
      const nightPlaces = await googleMapsService.getPlaces(
        location,
        3000,
        'night_club',
        'bar',
        {
          minRating: preferences.minRating || 4.0
        }
      );

      if (nightPlaces.length > 0) {
        dayItinerary.activities.push({
          time: '21:00',
          type: 'nightlife',
          name: nightPlaces[0].name,
          location: nightPlaces[0].geometry.location,
          address: nightPlaces[0].vicinity,
          rating: nightPlaces[0].rating,
          description: 'Evening entertainment'
        });
      }
    }

    return dayItinerary;
  } catch (error) {
    console.error('Error generating day itinerary:', error);
    throw error;
  }
};
