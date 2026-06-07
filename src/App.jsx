import { useState, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import { ArrowLeftRight, Castle, Zap } from 'lucide-react'
import { NumericFormat } from 'react-number-format'
import { useRates } from './hooks/useRates'
import CurrencySelector from './components/CurrencySelector'
import RateCard from './components/RateCard'
import HistoricalExport from './components/HistoricalExport'
import FlagImg from './components/FlagImg'

export default function App() {
  const [base, setBase] = useState('EUR')
  const [target, setTarget] = useState('USD')
  const [amount, setAmount] = useState('1')
  const [flipped, setFlipped] = useState(false)
  const prevRateRef = useRef(null)

  const { currencies, rate, loading, loadingRate, error, lastUpdated, refetch } = useRates(base, target)

  // Track previous rate for trend
  if (rate !== null && rate !== prevRateRef.current) {
    prevRateRef.current = rate
  }

  const handleFlip = () => {
    setFlipped(f => !f)
    setBase(target)
    setTarget(base)
  }

  return (
    <div className="min-h-screen relative">
      {/* Background layer locked and clipped */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#0A0F1D] animate-gradient grid-pattern">
        {/* Radial glow orbs */}
        <div
          className="absolute"
          style={{
            top: '-20%', left: '-10%', width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: '-10%', right: '-10%', width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      </div>

      <Toaster position="top-right" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-12">

        {/* ─── HERO HEADER ─────────────────────────────────────── */}
        <header className="text-center mb-10 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center animate-float"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                boxShadow: '0 0 30px rgba(6,182,212,0.4)',
              }}
            >
              <Castle size={24} color="#0A0F1D" strokeWidth={2.5} />
            </div>
            <h1
              className="font-black tracking-tight"
              style={{
                fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Currency Castle
            </h1>
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Live exchange rates powered by{' '}
            <a
              href="https://frankfurter.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-500 hover:text-cyan-400 transition-colors"
            >
              Frankfurter API
            </a>
            {' '}· No API key required
          </p>

          {/* Live indicator */}
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-xs"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#10b981', boxShadow: '0 0 6px #10b981', animation: 'pulse 2s infinite' }}
            />
            <span className="text-emerald-400 font-medium">Live Data</span>
            <Zap size={10} className="text-emerald-400" />
          </div>
        </header>

        {/* ─── MAIN CONVERTER CARD ─────────────────────────────── */}
        <div
          className="glass rounded-3xl p-6 sm:p-8 mb-6 animate-slide-up"
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
            animationDelay: '0.1s',
          }}
        >
          {/* Amount input */}
          <div className="mb-6">
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'block' }}>
              Amount
            </label>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                borderRadius: '12px', padding: '12px 16px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <FlagImg code={base} size={28} style={{ flexShrink: 0 }} />
              <NumericFormat
                value={amount}
                onValueChange={(values) => {
                  setAmount(values.value) // Store raw numeric string (e.g. "1000")
                }}
                thousandSeparator=","
                decimalScale={10}
                allowNegative={false}
                placeholder="1,000"
                className="rate-number"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  fontSize: '24px', fontWeight: 700, color: '#fff',
                  minWidth: 0, fontFamily: 'Inter, sans-serif',
                }}
              />
              <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '14px', flexShrink: 0 }}>{base}</span>
            </div>
          </div>

          {/* Currency selectors */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4 mb-6 relative">
            <div className="flex-1">
              <CurrencySelector
                label="From"
                value={base}
                onChange={setBase}
                currencies={currencies}
              />
            </div>

            {/* Flip button */}
            <div className="flex justify-center items-center sm:pb-2">
              <button
                onClick={handleFlip}
                className="flip-btn w-10 h-10 sm:w-12 sm:h-12 rounded-full sm:rounded-2xl flex items-center justify-center"
                title="Swap currencies"
                style={{
                  background: 'rgba(6,182,212,0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(6,182,212,0.3)',
                  zIndex: 10,
                }}
              >
                <ArrowLeftRight size={18} className={`flip-icon ${flipped ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="flex-1">
              <CurrencySelector
                label="To"
                value={target}
                onChange={setTarget}
                currencies={currencies}
              />
            </div>
          </div>

          {/* Rate Card */}
          <RateCard
            base={base}
            target={target}
            rate={rate}
            loading={loading}
            loadingRate={loadingRate}
            error={error}
            lastUpdated={lastUpdated}
            amount={amount}
            onRefresh={refetch}
          />
        </div>

        {/* ─── HISTORICAL PANEL ────────────────────────────────── */}
        <div
          className="animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          <HistoricalExport base={base} target={target} />
        </div>

        {/* ─── FOOTER ──────────────────────────────────────────── */}
        <footer className="text-center mt-10 text-xs text-slate-600 space-y-1">
          <p>Data provided by <a href="https://frankfurter.dev" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-400">Frankfurter API</a> · ECB exchange rates</p>
          <p>Built with React · Vite · Tailwind CSS</p>
        </footer>
      </div>
    </div>
  )
}
