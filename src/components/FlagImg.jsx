import { useState } from 'react'
import { getFlagUrl } from '../utils/currencyUtils'

/**
 * Renders a country flag image from flagcdn.com.
 * Falls back to a neutral globe icon if no flag is available (e.g. XAU gold).
 */
export default function FlagImg({ code, size = 24, style = {} }) {
  const [errored, setErrored] = useState(false)
  const url = getFlagUrl(code)

  if (!url || errored) {
    // Fallback: coloured circle with currency code initial
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size * 0.67,
        borderRadius: '3px',
        background: 'rgba(6,182,212,0.2)',
        border: '1px solid rgba(6,182,212,0.3)',
        fontSize: size * 0.38,
        fontWeight: 700,
        color: '#06b6d4',
        letterSpacing: '-0.05em',
        flexShrink: 0,
        ...style,
      }}>
        {code?.slice(0, 2)}
      </span>
    )
  }

  return (
    <img
      src={url}
      alt={code}
      width={size}
      height={Math.round(size * 0.67)}
      onError={() => setErrored(true)}
      style={{
        borderRadius: '3px',
        objectFit: 'cover',
        flexShrink: 0,
        display: 'inline-block',
        ...style,
      }}
    />
  )
}
