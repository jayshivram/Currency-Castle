const BASE_URL = 'https://api.frankfurter.dev/v2'

/**
 * Fetch all available currencies.
 * v2 returns an ARRAY: [{ iso_code, name, symbol, ... }, ...]
 * Normalised to: { "EUR": { name: "Euro", symbol: "€" }, ... }
 * @returns {Promise<Object>}
 */
export async function fetchCurrencies() {
  const res = await fetch(`${BASE_URL}/currencies`)
  if (!res.ok) throw new Error(`Failed to fetch currencies: ${res.status}`)
  const arr = await res.json()
  const map = {}
  for (const c of arr) {
    if (c.iso_code) {
      map[c.iso_code] = { name: c.name, symbol: c.symbol }
    }
  }
  return map
}

/**
 * Fetch today's rate between base and target currency.
 * v2 returns: [{ date, base, quote, rate }]
 * @param {string} base
 * @param {string} target
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ date: string, base: string, quote: string, rate: number }>}
 */
export async function fetchTodayRate(base, target, signal) {
  const res = await fetch(`${BASE_URL}/rates?base=${base}&quotes=${target}`, { signal })
  if (res.status === 404) throw new Error(`Currency not found: ${base} or ${target}`)
  if (res.status === 400) throw new Error(`Invalid parameters: ${base}/${target}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const arr = await res.json()
  // arr = [{ date, base, quote, rate }]
  if (!arr || arr.length === 0) throw new Error('No rate data returned')
  return arr[0]
}

/**
 * Fetch historical rates for a date range.
 * v2 returns: [{ date, base, quote, rate }, ...]
 * @param {string} base
 * @param {string} target
 * @param {string} from  YYYY-MM-DD
 * @param {string} to    YYYY-MM-DD
 * @returns {Promise<Array<{ date: string, base: string, quote: string, rate: number }>>}
 */
export async function fetchHistoricalRates(base, target, from, to) {
  const res = await fetch(
    `${BASE_URL}/rates?base=${base}&quotes=${target}&from=${from}&to=${to}`
  )
  if (res.status === 404) throw new Error(`Currency not found: ${base} or ${target}`)
  if (res.status === 400) throw new Error(`Invalid date range or parameters`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const arr = await res.json()
  if (!arr || arr.length === 0) throw new Error('No historical data returned')
  return arr
}
