import { useState } from 'react'
import { RefreshCw, Clock } from 'lucide-react'
import FlagImg from './FlagImg'
import { useCountUp } from '../hooks/useCountUp'

function SkeletonRate() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
      <div className="skeleton" style={{ height: '64px', width: '75%', borderRadius: '8px' }} />
      <div className="skeleton" style={{ height: '32px', width: '50%', borderRadius: '8px' }} />
      <div className="skeleton" style={{ height: '20px', width: '33%', borderRadius: '8px' }} />
    </div>
  )
}

function AnimatedNumber({ value, decimals }) {
  const display = useCountUp(value, decimals)
  return <>{display}</>
}

export default function RateCard({
  base, target, rate, loading, loadingRate, error, lastUpdated, amount, onRefresh
}) {
  const [isSpinning, setIsSpinning] = useState(false)

  const handleRefresh = () => {
    setIsSpinning(true)
    onRefresh()
    setTimeout(() => setIsSpinning(false), 1000)
  }

  const rateDecimals = ['JPY', 'KRW', 'IDR'].includes(target) ? 2 : 4
  const convertedDecimals = 2  // always show converted amount as currency (2dp)
  const rawAmount = parseFloat(String(amount || '1').replace(/,/g, '')) || 1
  const converted = rate != null ? (rawAmount * rate) : null

  return (
    <div
      className="glass animate-pulse-glow"
      style={{
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(6,182,212,0.15)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#10b981', boxShadow: '0 0 8px #10b981',
          }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Live Rate
          </span>
        </div>
        <button
          onClick={handleRefresh}
          title="Refresh rates"
          disabled={loadingRate}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', color: '#94a3b8', background: 'none', border: 'none',
            cursor: loadingRate ? 'not-allowed' : 'pointer', opacity: loadingRate ? 0.5 : 1,
          }}
          onMouseEnter={e => { if (!loadingRate) e.currentTarget.style.color = '#06b6d4' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8' }}
        >
          <RefreshCw size={13} className={loadingRate || isSpinning ? 'animate-spin-slow' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Body */}
      {loading || loadingRate ? (
        <SkeletonRate />
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ color: '#f87171', fontSize: '14px', marginBottom: '8px' }}>⚠ {error}</div>
          <button
            onClick={handleRefresh}
            style={{ fontSize: '12px', color: '#06b6d4', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Retry
          </button>
        </div>
      ) : rate != null ? (
        <div style={{ textAlign: 'center' }}>
          {/* Currency pair flags */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <FlagImg code={base} size={40} />
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginTop: '4px' }}>{base}</div>
            </div>
            <span style={{ color: '#334155', fontSize: '24px', fontWeight: 300 }}>→</span>
            <div style={{ textAlign: 'center' }}>
              <FlagImg code={target} size={40} />
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginTop: '4px' }}>{target}</div>
            </div>
          </div>

          {/* PRIMARY: Converted amount — the hero number */}
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#64748b', fontSize: '13px' }}>
              {Number(amount || 1).toLocaleString('en-US')} {base} =
            </span>
          </div>
          <div
            className="rate-number"
            style={{
              fontSize: 'clamp(2.2rem, 7vw, 4rem)',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #06b6d4, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
              marginBottom: '6px',
              letterSpacing: '-0.02em',
            }}
          >
            <AnimatedNumber value={converted} decimals={convertedDecimals} />
          </div>
          <div style={{ color: '#cbd5e1', fontWeight: 700, fontSize: '20px', marginBottom: '16px' }}>
            {target}
          </div>

          {/* SECONDARY: Exchange rate pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '13px',
            color: '#94a3b8',
            marginBottom: '12px',
          }}>
            <span>1 {base} =</span>
            <span style={{ fontWeight: 700, color: '#e2e8f0', fontVariantNumeric: 'tabular-nums' }}>
              <AnimatedNumber value={rate} decimals={rateDecimals} />
            </span>
            <span>{target}</span>
          </div>

          {/* Last updated */}
          {lastUpdated && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '6px', marginTop: '8px', fontSize: '12px', color: '#475569'
            }}>
              <Clock size={11} />
              <span>Last updated: {lastUpdated}</span>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: '14px' }}>
          Rate unavailable
        </div>
      )}
    </div>
  )
}
