export function loadTrips() {
  try {
    const data = localStorage.getItem("travel_wallet_trips");
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function saveTrips(trips) {
  localStorage.setItem("travel_wallet_trips", JSON.stringify(trips));
}

export function tripsReducer(state, action) {
  switch (action.type) {
    case "ADD_TRIP": {
      const newTrip = {
        id: Date.now().toString(),
        ...action.payload,
        expenses: []
      };
      const newState = [newTrip, ...state];
      saveTrips(newState);
      return newState;
    }
    case "DELETE_TRIP": {
      const newState = state.filter(t => t.id !== action.payloadId);
      saveTrips(newState);
      return newState;
    }
    case "ADD_EXPENSE": {
      const newState = state.map(trip => {
        if (trip.id === action.tripId) {
          const newExpense = {
            id: Date.now().toString(),
            ...action.payload
          };
          return {
            ...trip,
            expenses: [newExpense, ...trip.expenses]
          };
        }
        return trip;
      });
      saveTrips(newState);
      return newState;
    }
    case "DELETE_EXPENSE": {
      const newState = state.map(trip => {
        if (trip.id === action.tripId) {
          return {
            ...trip,
            expenses: trip.expenses.filter(e => e.id !== action.expenseId)
          };
        }
        return trip;
      });
      saveTrips(newState);
      return newState;
    }
    default:
      return state;
  }
}
