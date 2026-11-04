import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { tripSummary, formatKzt, convertToKzt } from "../lib/utils";
import { getRates } from "../api/rates";

export default function TripDetailsPage({ trips, dispatch }) {
  const { id } = useParams();
  const trip = trips.find(t => t.id === id);

  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(trip ? trip.country.currency : "usd");
  const [category, setCategory] = useState("еда");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!trip) {
    return (
      <div className="container">
        <h2>Поездка не найдена</h2>
        <Link to="/">Вернуться на главную</Link>
      </div>
    );
  }

  const { spent, left, percent } = tripSummary(trip.budget, trip.expenses || []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount || !date) return;
    setLoading(true);
    setError("");

    try {
      const rates = await getRates(date);
      const amountKzt = convertToKzt(Number(amount), currency, rates);

      if (amountKzt === null) {
        throw new Error("Не удалось пересчитать сумму в тенге по этой валюте");
      }

      dispatch({
        type: "ADD_EXPENSE",
        tripId: trip.id,
        payload: {
          amount: Number(amount),
          currency,
          amountKzt,
          category,
          date,
          comment
        }
      });

      setAmount("");
      setComment("");
    } catch (err) {
      setError(err.message || "Ошибка при получении курса");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Link to="/" style={{ textDecoration: "none", color: "#2563eb" }}>← Все поездки</Link>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "15px 0" }}>
        <img src={`https://flagcdn.com/w80/${trip.country.code}.png`} alt={trip.country.name} style={{ width: "50px", borderRadius: "4px" }} />
        <h1>{trip.country.name}</h1>
      </div>

      <div className="card">
        <h3>Обзор бюджета</h3>
        <p>Бюджет: <strong>{formatKzt(trip.budget)}</strong></p>
        <p>Потрачено: <strong>{formatKzt(spent)}</strong></p>
        <p>Остаток: <strong style={{ color: left < 0 ? "red" : "green" }}>{formatKzt(left)}</strong></p>
        <div className="progress-bar">
          <div className={`progress-fill ${percent > 100 ? "overbudget" : ""}`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
        </div>
      </div>

      <div className="card">
        <h3>Добавить расход</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleAddExpense}>
          <div className="flex">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Сумма</label>
              <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="100" />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Валюта</label>
              <input type="text" value={currency} onChange={e => setCurrency(e.target.value.toLowerCase())} placeholder="try, usd, kzt" />
            </div>
          </div>
          <div className="flex">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Категория</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="еда">Еда</option>
                <option value="транспорт">Транспорт</option>
                <option value="жильё">Жильё</option>
                <option value="развлечения">Развлечения</option>
                <option value="покупки">Покупки</option>
                <option value="прочее">Прочее</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Дата расхода</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Комментарий</label>
            <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Обед в кафе" />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Загрузка курса..." : "Добавить расход"}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>История расходов</h3>
        {trip.expenses.length === 0 ? <p>Расходов пока нет.</p> : (
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Категория</th>
                <th>Комментарий</th>
                <th>Сумма в валюте</th>
                <th>В тенге (₸)</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {trip.expenses.map(exp => (
                <tr key={exp.id}>
                  <td>{exp.date}</td>
                  <td>{exp.category}</td>
                  <td>{exp.comment || "—"}</td>
                  <td>{exp.amount} {exp.currency.toUpperCase()}</td>
                  <td><strong>{formatKzt(exp.amountKzt)}</strong></td>
                  <td>
                    <button className="btn btn-danger" onClick={() => dispatch({ type: "DELETE_EXPENSE", tripId: trip.id, expenseId: exp.id })}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
