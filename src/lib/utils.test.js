import { describe, it, expect } from "vitest";
import { convertToKzt, roundMoney, tripSummary, byCategory } from "./utils";
import { tripsReducer } from "./reducer";

describe("Travel Wallet Utils & Reducer", () => {
  const rates = { usd: 0.002, try: 0.01 };

  it("convertToKzt calculates correctly", () => {
    expect(convertToKzt(100, "usd", rates)).toBe(50000);
    expect(convertToKzt(1500, "kzt", rates)).toBe(1500);
    expect(convertToKzt(100, "xyz", rates)).toBeNull();
  });

  it("roundMoney handles float precision", () => {
    expect(roundMoney(0.1 + 0.2)).toBe(0.3);
  });

  it("tripSummary computes spent, left, percent", () => {
    const expenses = [
      { amount: 100, amountKzt: 100000 },
      { amount: 25, amountKzt: 25000 }
    ];
    const summary = tripSummary(500000, expenses);
    expect(summary).toEqual({ spent: 125000, left: 375000, percent: 25 });
  });

  it("tripSummary handles overbudget", () => {
    const expenses = [{ amount: 120, amountKzt: 120000 }];
    const summary = tripSummary(100000, expenses);
    expect(summary.left).toBe(-20000);
    expect(summary.percent).toBe(120);
  });

  it("byCategory aggregates correctly", () => {
    const expenses = [
      { category: "еда", amountKzt: 3000 },
      { category: "транспорт", amountKzt: 1200 },
      { category: "еда", amountKzt: 2000 }
    ];
    expect(byCategory(expenses)).toEqual({ еда: 5000, транспорт: 1200 });
  });

  it("tripsReducer ADD_EXPENSE adds expense without mutating original", () => {
    const initialState = [{ id: "1", expenses: [] }];
    const action = {
      type: "ADD_EXPENSE",
      tripId: "1",
      payload: { amount: 50, currency: "usd", category: "еда", date: "2026-10-01", amountKzt: 25000 }
    };
    const nextState = tripsReducer(initialState, action);
    expect(nextState[0].expenses.length).toBe(1);
    expect(initialState[0].expenses.length).toBe(0);
  });
});
