import React, { useState } from "react";
import { Link } from "react-router-dom";
import { countries } from "../data/countries";
import { tripSummary, formatKzt } from "../lib/utils";

export default function TripsPage({ trips, dispatch }) {
  const [countryCode, setCountryCode] = useState(countries[0].code);
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    const selectedCountry = countries.find(c => c.code === countryCode);
    if (!selectedCountry || !budget) return;

    dispatch({
      type: "ADD_TRIP",
      payload: {
        country: selectedCountry,
        budget: Number(budget),
        startDate,
        endDate
      }
    });

    setBudget("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="container">
      <h1>Мои поездки</h1>

      <div className="card">
        <h2>Создать поездку</h2>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Страна назначения</label>
            <select value={countryCode} onChange={e => setCountryCode(e.target.value)}>
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.name} ({c.currency.toUpperCase()})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Бюджет (₸)</label>
            <input type="number" required min="1" value={budget} onChange={e => setBudget(e.target.value)} placeholder="500000" />
          </div>
          <div className="flex">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Дата начала</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Дата окончания</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn">Создать</button>
        </form>
      </div>

      <h2>Список поездок</h2>
      {trips.length === 0 ? <p>Поездок пока нет.</p> : (
        trips.map(trip => {
          const { spent, left, percent } = tripSummary(trip.budget, trip.expenses || []);
          return (
            <div key={trip.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src={`https://flagcdn.com/w80/${trip.country.code}.png`} alt={trip.country.name} style={{ width: "40px", borderRadius: "4px" }} />
                  <div>
                    <h3 style={{ margin: 0 }}>
                      <Link to={`/trip/${trip.id}`} style={{ textDecoration: "none", color: "#2563eb" }}>
                        {trip.country.name}
                      </Link>
                    </h3>
                    <small>{trip.startDate} — {trip.endDate}</small>
                  </div>
                </div>
                <div>
                  {deleteId === trip.id ? (
                    <div>
                      <span>Удалить? </span>
                      <button className="btn btn-danger" onClick={() => dispatch({ type: "DELETE_TRIP", payloadId: trip.id })}>Да</button>
                      <button className="btn" style={{ marginLeft: "5px" }} onClick={() => setDeleteId(null)}>Отмена</button>
                    </div>
                  ) : (
                    <button className="btn btn-danger" onClick={() => setDeleteId(trip.id)}>Удалить</button>
                  )}
                </div>
              </div>
              <div style={{ marginTop: "15px" }}>
                <p style={{ margin: "5px 0" }}>Бюджет: <strong>{formatKzt(trip.budget)}</strong> | Потрачено: <strong>{formatKzt(spent)}</strong> | Остаток: <strong>{formatKzt(left)}</strong></p>
                <div className="progress-bar">
                  <div className={`progress-fill ${percent > 100 ? "overbudget" : ""}`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
