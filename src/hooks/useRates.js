import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchCurrencies, fetchTodayRate } from '../services/api'

export function useRates(baseCurrency, targetCurrency) {
  const [currencies, setCurrencies] = useState({})
  const [rate, setRate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingRate, setLoadingRate] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const abortRef = useRef(null)

  // Load currency list once on mount
  useEffect(() => {
    fetchCurrencies()
      .then(data => setCurrencies(data))
      .catch(err => console.error('Failed to load currencies:', err))
  }, [])

  const loadRate = useCallback(async () => {
    if (!baseCurrency || !targetCurrency) return

    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    const signal = abortRef.current.signal

    // Immediately clear stale rate so old value never bleeds into new pair
    setRate(null)
    setError(null)
    setLoadingRate(true)

    try {
      const data = await fetchTodayRate(baseCurrency, targetCurrency, signal)
      if (signal.aborted) return
      setRate(data.rate)
      setLastUpdated(data.date)
    } catch (err) {
      if (signal.aborted) return
      setError(err.message)
      setRate(null)
    } finally {
      if (!signal.aborted) {
        setLoadingRate(false)
        setLoading(false)
      }
    }
  }, [baseCurrency, targetCurrency])

  useEffect(() => {
    setLoading(true)
    loadRate()
  }, [loadRate])

  return { currencies, rate, loading, loadingRate, error, lastUpdated, refetch: loadRate }
}
