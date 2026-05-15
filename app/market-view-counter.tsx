'use client'

import { useEffect, useMemo, useState } from 'react'
import { Eye, TrendingUp } from 'lucide-react'
import type { MarketViewStats } from '@/lib/market-views'

type MarketViewCounterProps = {
  marketId: string
  marketName: string
  groupId?: number | null
  groupName: string
  initialStats: MarketViewStats
  accentColor: string
}

function compactNumber(value: number) {
  return new Intl.NumberFormat('th-TH', {
    notation: value >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value)
}

export default function MarketViewCounter({
  marketId,
  marketName,
  groupId,
  groupName,
  initialStats,
  accentColor,
}: MarketViewCounterProps) {
  const [stats, setStats] = useState(initialStats)
  const storageKey = useMemo(() => {
    const day = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date())
    return `market-view:${marketId}:${day}`
  }, [marketId])

  useEffect(() => {
    if (!marketId || typeof window === 'undefined') return

    if (window.localStorage.getItem(storageKey)) return
    window.localStorage.setItem(storageKey, '1')

    const controller = new AbortController()
    fetch('/api/market-views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marketId, marketName, groupId, groupName }),
      cache: 'no-store',
      keepalive: true,
      signal: controller.signal,
    })
      .then(response => response.ok ? response.json() : null)
      .then(payload => {
        if (payload?.success && payload.data) {
          setStats(payload.data)
        } else {
          window.localStorage.removeItem(storageKey)
        }
      })
      .catch(() => {
        window.localStorage.removeItem(storageKey)
      })

    return () => controller.abort()
  }, [groupId, groupName, marketId, marketName, storageKey])

  return (
    <section
      className="market-view-counter"
      style={{
        borderColor: `${accentColor}35`,
        background: `linear-gradient(135deg, ${accentColor}16, rgba(8,8,16,0.62))`,
      }}
      aria-label="จำนวนผู้เข้าชมหน้านี้"
    >
      <div className="market-view-counter-main">
        <div className="market-view-counter-icon" style={{ color: accentColor }}>
          <Eye size={22} />
        </div>
        <div>
          <p>ผู้เข้าชมหน้านี้</p>
          <strong>{compactNumber(stats.totalViews)}</strong>
        </div>
      </div>
      <div className="market-view-counter-today">
        <TrendingUp size={16} />
        <span>วันนี้ {compactNumber(stats.todayViews)}</span>
      </div>
    </section>
  )
}
