export function roundMoney(amount) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function convertToKzt(amount, currency, rates) {
  const curr = currency.toLowerCase();
  if (curr === "kzt") return roundMoney(amount);
  if (!rates || typeof rates[curr] !== "number") return null;
  const rate = rates[curr];
  if (rate === 0) return 0;
  return roundMoney(amount / rate);
}

export function formatKzt(amount) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function tripSummary(budget, expenses) {
  let spent = 0;
  expenses.forEach(exp => {
    spent += exp.amountKzt || 0;
  });
  
  spent = roundMoney(spent);
  const left = roundMoney(budget - spent);
  const percent = budget > 0 ? roundMoney((spent / budget) * 100) : 0;

  return { spent, left, percent };
}

export function byCategory(expenses) {
  const categories = {};
  expenses.forEach(exp => {
    const cat = exp.category || "прочее";
    const amount = exp.amountKzt || 0;
    categories[cat] = roundMoney((categories[cat] || 0) + amount);
  });
  return categories;
}
