import React, { useReducer } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import TripsPage from "./pages/TripsPage";
import TripDetailsPage from "./pages/TripDetailsPage";
import RatesPage from "./pages/RatesPage";
import NotFoundPage from "./pages/NotFoundPage";
import { tripsReducer, loadTrips } from "./lib/reducer";

export default function App() {
  const [trips, dispatch] = useReducer(tripsReducer, [], loadTrips);

  return (
    <div>
      <nav>
        <div style={{ fontWeight: "bold", fontSize: "1.2em" }}>Кошелёк путешественника</div>
        <div>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Мои поездки
          </NavLink>
          <NavLink to="/rates" className={({ isActive }) => (isActive ? "active" : "")}>
            Курсы
          </NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<TripsPage trips={trips} dispatch={dispatch} />} />
        <Route path="/trip/:id" element={<TripDetailsPage trips={trips} dispatch={dispatch} />} />
        <Route path="/rates" element={<RatesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
