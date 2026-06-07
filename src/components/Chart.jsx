import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts'
import FlagImg from './FlagImg'

function CustomTooltip({ active, payload, label, target }) {
  if (active && payload && payload.length) {
    const decimals = ['JPY', 'KRW', 'IDR'].includes(target) ? 2 : 4
    return (
      <div
        className="px-3 py-2 rounded-lg"
        style={{
          background: 'rgba(13,26,58,0.95)',
          border: '1px solid rgba(6,182,212,0.3)',
          color: '#e2e8f0',
          fontSize: '12px',
        }}
      >
        <div className="text-slate-400 mb-0.5">{label}</div>
        <div className="font-bold text-cyan-400">
          {payload[0].value.toFixed(decimals)}
        </div>
      </div>
    )
  }
  return null
}

export default function Chart({ data, base, target, loading }) {
  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="skeleton w-full h-full rounded-xl" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
        No historical data to display
      </div>
    )
  }

  const values = data.map(d => d.rate)
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const avgVal = values.reduce((a, b) => a + b, 0) / values.length

  const decimals = ['JPY', 'KRW', 'IDR'].includes(target) ? 2 : 4

  // Thin out X axis labels for readability
  const tickInterval = Math.max(1, Math.floor(data.length / 6))

  return (
    <div>
      {/* Chart header */}
      <div className="flex items-center justify-between mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8' }}>
          <FlagImg code={base} size={18} />
          <span>{base}</span>
          <span style={{ color: '#475569' }}>→</span>
          <FlagImg code={target} size={18} />
          <span>{target}</span>
          <span style={{ color: '#475569' }}>·</span>
          <span>{data.length} data points</span>
        </div>
        <div className="text-xs text-slate-500">
          Avg: <span className="text-cyan-400 font-mono">{avgVal.toFixed(decimals)}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 mb-4">
        {[
          { label: 'Min', value: minVal, color: '#f87171' },
          { label: 'Avg', value: avgVal, color: '#06b6d4' },
          { label: 'Max', value: maxVal, color: '#10b981' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="flex-1 rounded-lg px-3 py-2 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="text-xs text-slate-500 mb-0.5">{label}</div>
            <div className="text-sm font-bold font-mono" style={{ color }}>
              {value.toFixed(decimals)}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <defs>
            <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={tickInterval}
            tickFormatter={d => d.slice(5)} // MM-DD
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            width={60}
            tickFormatter={v => v.toFixed(decimals === 2 ? 1 : 2)}
          />
          <Tooltip content={<CustomTooltip target={target} />} />
          <ReferenceLine
            y={avgVal}
            stroke="rgba(6,182,212,0.3)"
            strokeDasharray="4 4"
          />
          <Area
            type="monotone"
            dataKey="rate"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#rateGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#06b6d4', stroke: '#0A0F1D', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
