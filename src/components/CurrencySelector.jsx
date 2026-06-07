import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import FlagImg from './FlagImg'

export default function CurrencySelector({ label, value, onChange, currencies }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const currencyList = Object.entries(currencies || {})
  const filtered = currencyList.filter(([code, info]) => {
    const q = search.toLowerCase()
    const name = info?.name || ''
    return code.toLowerCase().includes(q) || name.toLowerCase().includes(q)
  })

  const selectedName = currencies?.[value]?.name || value

  return (
    <div className="relative">
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
        {label}
      </p>

      <button
        onClick={() => setOpen(!open)}
        className="glass glass-hover"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '12px',
          textAlign: 'left',
          cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.04)',
        }}
      >
        <FlagImg code={value} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '18px', lineHeight: 1.2 }}>{value}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedName}</div>
        </div>
        <ChevronDown
          size={16}
          color="#94a3b8"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', flexShrink: 0 }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            zIndex: 50,
            width: '100%',
            marginTop: '8px',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            background: 'rgba(13,26,58,0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            maxHeight: '320px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Search input */}
          <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
            <input
              autoFocus
              type="text"
              placeholder="Search currency..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && filtered.length > 0) {
                  onChange(filtered[0][0])
                  setOpen(false)
                  setSearch('')
                }
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: '#e2e8f0',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>

          {/* Currency list */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>No currencies found</div>
            ) : (
              filtered.map(([code, info]) => {
                const name = info?.name || code
                const isSelected = code === value
                return (
                  <button
                    key={code}
                    onClick={() => { onChange(code); setOpen(false); setSearch('') }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      border: 'none',
                      borderLeft: isSelected ? '2px solid #06b6d4' : '2px solid transparent',
                      background: isSelected ? 'rgba(6,182,212,0.12)' : 'transparent',
                      transition: 'background 0.15s',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                  >
                    <FlagImg code={code} size={24} />
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '13px' }}>{code}</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                    {isSelected && <span style={{ marginLeft: 'auto', color: '#06b6d4', fontSize: '12px' }}>✓</span>}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Overlay to close */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
          onClick={() => { setOpen(false); setSearch('') }}
        />
      )}
    </div>
  )
}
