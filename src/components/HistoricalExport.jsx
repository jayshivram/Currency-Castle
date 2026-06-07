import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Download, Calendar, AlertTriangle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchHistoricalRates } from '../services/api'
import { exportToExcel } from '../utils/excelExport'
import Chart from './Chart'
import FlagImg from './FlagImg'

const MAX_DAYS = 90

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function diffDays(start, end) {
  return Math.round((end - start) / (1000 * 60 * 60 * 24))
}

function fmtDate(date) {
  return date.toISOString().split('T')[0]
}

export default function HistoricalExport({ base, target }) {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [historicalData, setHistoricalData] = useState(null)
  const [rawRates, setRawRates] = useState(null)
  const [loading, setLoading] = useState(false)
  const [warned, setWarned] = useState(false)

  const handleDateChange = (dates) => {
    let [start, end] = dates
    setWarned(false)

    if (start && end) {
      const days = diffDays(start, end)
      if (days > MAX_DAYS) {
        end = addDays(start, MAX_DAYS)
        setWarned(true)
        toast(`Range capped at ${MAX_DAYS} days for performance`, {
          icon: '⚠️',
          style: {
            background: 'rgba(13,26,58,0.95)',
            color: '#fbbf24',
            border: '1px solid rgba(251,191,36,0.3)',
            borderRadius: '12px',
          },
        })
      }
    }
    setStartDate(start)
    setEndDate(end)
    if (start && !end) {
      setHistoricalData(null)
      setRawRates(null)
    }
  }

  const handleFetch = async () => {
    if (!startDate || !endDate) return
    setLoading(true)
    setHistoricalData(null)
    setRawRates(null)
    try {
      // v2 returns: [{ date, base, quote, rate }, ...]
      const arr = await fetchHistoricalRates(base, target, fmtDate(startDate), fmtDate(endDate))
      const chartData = arr
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(({ date, rate }) => ({ date, rate }))
      setHistoricalData(chartData)
      setRawRates(arr) // pass the raw array to export
      toast.success(`Fetched ${chartData.length} days of historical data`, {
        style: {
          background: 'rgba(13,26,58,0.95)',
          color: '#10b981',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '12px',
        },
      })
    } catch (err) {
      toast.error(err.message || 'Failed to fetch historical data', {
        style: {
          background: 'rgba(13,26,58,0.95)',
          color: '#f87171',
          border: '1px solid rgba(248,113,113,0.3)',
          borderRadius: '12px',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (!rawRates || !startDate || !endDate) return
    // rawRates is now a flat array: [{ date, base, quote, rate }]
    exportToExcel({
      base,
      target,
      startDate: fmtDate(startDate),
      endDate: fmtDate(endDate),
      ratesArray: rawRates,
    })
  }

  const canFetch = startDate && endDate && !loading
  const canExport = canFetch && rawRates && !loading

  return (
    <div
      className="glass glass-hover rounded-2xl p-6"
      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          <Calendar size={16} className="text-emerald-400" />
        </div>
        <div>
          <h3 className="font-bold text-white text-base">Historical Rates</h3>
          <p className="text-xs text-slate-500">
            <FlagImg code={base} size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            {base} →
            <FlagImg code={target} size={16} style={{ verticalAlign: 'middle', margin: '0 4px' }} />
            {target} · Max 90 days
          </p>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">
          Select Date Range
        </label>
        <div
          className="rounded-xl p-1"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            maxDate={new Date()}
            minDate={new Date('2000-01-01')}
            placeholderText="Click to select start → end date"
            className="w-full bg-transparent text-white text-sm px-3 py-2.5 outline-none cursor-pointer placeholder-slate-500"
            dateFormat="yyyy-MM-dd"
            isClearable
            showPopperArrow={false}
            withPortal
          />
        </div>

        {warned && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400">
            <AlertTriangle size={11} />
            <span>Range capped to {MAX_DAYS} days</span>
          </div>
        )}

        {startDate && endDate && (
          <div className="mt-2 text-xs text-slate-500">
            {fmtDate(startDate)} → {fmtDate(endDate)}
            <span className="ml-2 text-cyan-500">({diffDays(startDate, endDate)} days)</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleFetch}
          disabled={!canFetch}
          className="flex-1 btn-primary rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin-slow" />
              Fetching...
            </>
          ) : (
            <>
              <Calendar size={15} />
              Load Chart
            </>
          )}
        </button>

        <button
          onClick={handleExport}
          disabled={!canExport}
          className="flex-1 rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300"
          style={{
            background: canExport ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${canExport ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.07)'}`,
            color: canExport ? '#10b981' : '#475569',
            cursor: canExport ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={e => {
            if (canExport) {
              e.currentTarget.style.background = 'rgba(16,185,129,0.25)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(16,185,129,0.2)'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = canExport ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <Download size={15} />
          Export .xlsx
        </button>
      </div>

      {/* Chart Area */}
      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Chart
          data={historicalData}
          base={base}
          target={target}
          loading={loading}
        />
      </div>
    </div>
  )
}
