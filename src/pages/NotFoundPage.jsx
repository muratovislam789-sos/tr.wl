import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/" className="btn">На главную</Link>
    </div>
  );
}
