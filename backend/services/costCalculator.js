// Cost calculation service for travel routes
// Estimates costs based on distance, transportation type, and region

// Cost per kilometer for different transportation modes (in KRW)
const COST_RATES = {
  BUS: 1200,           // Base fare for bus
  SUBWAY: 1250,        // Base fare for subway
  TRAIN: 50,           // Per km for train
  HEAVY_RAIL: 50,      // Per km for heavy rail
  HIGH_SPEED_TRAIN: 80, // Per km for high-speed train
  COMMUTER_TRAIN: 40,  // Per km for commuter train
  TRAM: 1200,          // Base fare for tram
  WALKING: 0,          // Free
  DEFAULT: 30          // Default per km cost
};

// Base fares
const BASE_FARES = {
  BUS: 1200,
  SUBWAY: 1250,
  TRAIN: 5000,
  HEAVY_RAIL: 5000,
  HIGH_SPEED_TRAIN: 10000,
  COMMUTER_TRAIN: 3000,
  TRAM: 1200
};

// Calculate cost for a single transit step
exports.calculateStepCost = (step) => {
  if (!step.transit_details) {
    return 0; // Walking or other non-transit modes are free
  }

  const transit = step.transit_details;
  const vehicleType = transit.line.vehicle.type.toUpperCase();
  const distanceInMeters = step.distance.value;
  const distanceInKm = distanceInMeters / 1000;

  let cost = 0;

  // Calculate base fare
  if (BASE_FARES[vehicleType]) {
    cost = BASE_FARES[vehicleType];
  } else {
    cost = BASE_FARES.DEFAULT || 2000;
  }

  // Add distance-based cost for trains
  if (vehicleType.includes('TRAIN') || vehicleType.includes('RAIL')) {
    const ratePerKm = COST_RATES[vehicleType] || COST_RATES.TRAIN;
    cost += distanceInKm * ratePerKm;
  }

  // Add extra cost for long-distance buses
  if (vehicleType === 'BUS' && distanceInKm > 10) {
    cost += (distanceInKm - 10) * 100;
  }

  return Math.round(cost);
};

// Calculate total cost for a route
exports.calculateRouteCost = (route) => {
  let totalCost = 0;

  if (!route || !route.legs || route.legs.length === 0) {
    return 0;
  }

  // Calculate cost for each leg
  route.legs.forEach(leg => {
    if (!leg.steps) return;

    leg.steps.forEach(step => {
      if (step.travel_mode === 'TRANSIT') {
        totalCost += this.calculateStepCost(step);
      }
    });
  });

  return totalCost;
};

// Compare multiple routes by cost and duration
exports.analyzeRoutes = (routes) => {
  if (!routes || routes.length === 0) {
    return null;
  }

  const analyzedRoutes = routes.map((route, index) => {
    const cost = this.calculateRouteCost(route);
    const duration = route.legs[0].duration.value; // in seconds
    const distance = route.legs[0].distance.value; // in meters

    // Count number of transfers
    let transfers = 0;
    route.legs[0].steps.forEach(step => {
      if (step.travel_mode === 'TRANSIT') {
        transfers++;
      }
    });
    transfers = Math.max(0, transfers - 1); // Subtract 1 because first transit is not a transfer

    return {
      index,
      route,
      cost,
      duration,
      durationMinutes: Math.round(duration / 60),
      distance,
      distanceKm: (distance / 1000).toFixed(1),
      transfers,
      costPerMinute: duration > 0 ? cost / (duration / 60) : 0
    };
  });

  // Find cheapest route
  const cheapestRoute = analyzedRoutes.reduce((min, current) =>
    current.cost < min.cost ? current : min
  );

  // Find fastest route
  const fastestRoute = analyzedRoutes.reduce((min, current) =>
    current.duration < min.duration ? current : min
  );

  // Find best value route (lowest cost per minute, but not too slow)
  const maxDuration = fastestRoute.duration * 1.5; // Within 50% of fastest
  const bestValueRoute = analyzedRoutes
    .filter(r => r.duration <= maxDuration)
    .reduce((min, current) =>
      current.costPerMinute < min.costPerMinute ? current : min
    );

  return {
    allRoutes: analyzedRoutes,
    cheapestRoute: {
      ...cheapestRoute,
      reason: '가장 저렴한 경로'
    },
    fastestRoute: {
      ...fastestRoute,
      reason: '가장 빠른 경로'
    },
    bestValueRoute: {
      ...bestValueRoute,
      reason: '최고의 가성비 경로'
    },
    recommendations: {
      saveMoney: cheapestRoute.index,
      saveTime: fastestRoute.index,
      balanced: bestValueRoute.index
    }
  };
};

// Format cost to Korean Won
exports.formatCost = (cost) => {
  return `${cost.toLocaleString('ko-KR')}원`;
};

// Calculate cost savings
exports.calculateSavings = (expensiveRoute, cheapRoute) => {
  const savings = expensiveRoute.cost - cheapRoute.cost;
  const percentage = ((savings / expensiveRoute.cost) * 100).toFixed(1);
  return {
    amount: savings,
    percentage,
    formatted: this.formatCost(savings)
  };
};
