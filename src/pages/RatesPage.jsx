import React, { useState, useEffect } from "react";
import { getRates } from "../api/rates";
import { countries } from "../data/countries";
import { formatKzt, convertToKzt } from "../lib/utils";

export default function RatesPage() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState("latest");

  const [amount, setAmount] = useState("100");
  const [currency, setCurrency] = useState("usd");

  const fetchRates = async (selectedDate) => {
    setLoading(true);
    setError("");
    try {
      const data = await getRates(selectedDate);
      setRates(data);
    } catch (err) {
      setError(err.message || "Ошибка загрузки курсов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates(date);
  }, [date]);

  const convertedValue = rates ? convertToKzt(Number(amount), currency, rates) : null;

  return (
    <div className="container">
      <h1>Курсы валют и конвертер</h1>

      <div className="card">
        <div className="form-group">
          <label>Дата курса</label>
          <input type="date" value={date === "latest" ? "" : date} onChange={e => setDate(e.target.value || "latest")} />
          <small>Оставьте пустым для актуального курса</small>
        </div>
      </div>

      <div className="card">
        <h2>Быстрый конвертер в ₸</h2>
        <div className="flex">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Сумма</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Валюта</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)}>
              {countries.map(c => (
                <option key={c.code} value={c.currency}>{c.name} ({c.currency.toUpperCase()})</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ marginTop: "15px", fontSize: "1.2em" }}>
          Итог: <strong>{convertedValue !== null ? formatKzt(convertedValue) : "Расчёт..."}</strong>
        </div>
      </div>

      <div className="card">
        <h2>Таблица курсов (К 1 ₸)</h2>
        {loading && <p>Загрузка курсов...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {rates && (
          <table>
            <thead>
              <tr>
                <th>Страна</th>
                <th>Валюта</th>
                <th>Курс (1 ₸ =)</th>
                <th>Примерно (1 единица =)</th>
              </tr>
            </thead>
            <tbody>
              {countries.map(c => {
                const rate = rates[c.currency];
                const inKzt = rate ? (1 / rate) : null;
                return (
                  <tr key={c.code}>
                    <td>{c.name}</td>
                    <td>{c.currency.toUpperCase()}</td>
                    <td>{rate ? rate : "Нет данных"}</td>
                    <td>{inKzt ? formatKzt(inKzt) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
