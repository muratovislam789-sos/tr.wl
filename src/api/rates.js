const memoryCache = new Map();

export async function getRates(date = "latest") {
  const cacheKey = `rates_${date}`;

  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  if (date !== "latest") {
    const cachedLocal = localStorage.getItem(cacheKey);
    if (cachedLocal) {
      try {
        const parsed = JSON.parse(cachedLocal);
        memoryCache.set(cacheKey, parsed);
        return parsed;
      } catch (e) {
        // Игнорируем
      }
    }
  }

  const primaryUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/kzt.json`;
  const fallbackUrl = `https://${date === "latest" ? "latest" : date}.currency-api.pages.dev/v1/currencies/kzt.json`;

  let data = null;

  try {
    const response = await fetch(primaryUrl);
    if (!response.ok) throw new Error("Primary API failed");
    data = await response.json();
  } catch (err) {
    console.warn("Основной API недоступен, пробуем резервный...", err);
    try {
      const response = await fetch(fallbackUrl);
      if (!response.ok) throw new Error("Fallback API failed");
      data = await response.json();
    } catch (fallbackErr) {
      throw new Error("Не удалось загрузить курсы валют ни с основного, ни с резервного сервера.");
    }
  }

  const ratesData = data.kzt || {};

  memoryCache.set(cacheKey, ratesData);
  if (date !== "latest") {
    localStorage.setItem(cacheKey, JSON.stringify(ratesData));
  }

  return ratesData;
}
