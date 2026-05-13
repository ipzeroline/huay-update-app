'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { RefreshCw, Sparkles } from 'lucide-react'
import type { Lang } from '@/lib/i18n'

export type LuckyNumberRow = {
  id: string
  groupCode: string
  groupName: string
  marketName: string
  marketLogo: string
  marketHref: string
  top3: string
  top2: string
  bottom2: string
  highlight: string
  pair: string
}

type LuckyNumbersClientCopy = {
  all: string
  randomAgain: string
  tableTitle: string
  category: string
  lottery: string
  top3: string
  top2: string
  bottom2: string
  highlight: string
  pair: string
  history: string
  empty: string
}

function numberString(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
}

function buildRandomRow(row: LuckyNumberRow): LuckyNumberRow {
  const first = Math.floor(Math.random() * 10)
  const second = Math.floor(Math.random() * 10)
  return {
    ...row,
    top3: numberString(3),
    top2: numberString(2),
    bottom2: numberString(2),
    highlight: String(first),
    pair: `${first}${second}`,
  }
}

function groupTone(groupCode: string) {
  if (groupCode === 'lotto-thai') return { cls: 'tone-thai', icon: '🇹🇭' }
  if (groupCode === 'lotto-foreign') return { cls: 'tone-foreign', icon: '🌏' }
  if (groupCode === 'lotto-stock') return { cls: 'tone-stock', icon: '📈' }
  if (groupCode === 'lotto-daily') return { cls: 'tone-daily', icon: '✨' }
  return { cls: 'tone-default', icon: '🎲' }
}

export default function LuckyNumbersClient({
  rows,
  copy,
}: {
  lang: Lang
  rows: LuckyNumberRow[]
  copy: LuckyNumbersClientCopy
}) {
  const [currentRows, setCurrentRows] = useState(rows)
  const groupedRows = useMemo(() => {
    const groups = new Map<string, { code: string; name: string; rows: LuckyNumberRow[] }>()
    currentRows.forEach(row => {
      const group = groups.get(row.groupCode) ?? { code: row.groupCode, name: row.groupName, rows: [] }
      group.rows.push(row)
      groups.set(row.groupCode, group)
    })
    return Array.from(groups.values())
  }, [currentRows])

  return (
    <section className="lucky-panel" aria-label={copy.tableTitle}>
      <div className="lucky-panel-head">
        <div>
          <p className="lottery-topic-kicker">{copy.tableTitle}</p>
          <h2>{copy.tableTitle}</h2>
        </div>
        <button
          type="button"
          className="lucky-random-button"
          onClick={() => setCurrentRows(prev => prev.map(buildRandomRow))}
        >
          <RefreshCw size={16} />
          <span>{copy.randomAgain}</span>
        </button>
      </div>

      <div className="lucky-group-list">
        {groupedRows.length === 0 ? (
          <p className="lucky-empty">{copy.empty}</p>
        ) : groupedRows.map(group => {
          const tone = groupTone(group.code)
          return (
            <section key={group.code} className={`lucky-group ${tone.cls}`}>
              <div className="lucky-group-head">
                <div className="lucky-group-title">
                  <span>{tone.icon}</span>
                  <h3>{group.name}</h3>
                </div>
                <div className="lucky-group-line" />
                <span className="lucky-group-count">{group.rows.length}</span>
              </div>

              <div className="lucky-card-grid">
                {group.rows.map(row => (
                  <article key={row.id} className="lucky-card">
                    <div className="lucky-card-head">
                      <div className="lucky-card-title">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={row.marketLogo || '/logo.png'}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 9,
                            objectFit: 'cover',
                            border: '1px solid var(--border)',
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <span>{copy.lottery}</span>
                          <h4>{row.marketName}</h4>
                        </div>
                      </div>
                      <Link href={row.marketHref} className="lucky-history-link">
                        <Sparkles size={14} />
                        <span>{copy.history}</span>
                      </Link>
                    </div>

                    <div className="lucky-primary-number">
                      <span>{copy.top3}</span>
                      <strong>{row.top3}</strong>
                    </div>

                    <div className="lucky-number-grid">
                      <div>
                        <span>{copy.top2}</span>
                        <strong>{row.top2}</strong>
                      </div>
                      <div>
                        <span>{copy.bottom2}</span>
                        <strong>{row.bottom2}</strong>
                      </div>
                      <div>
                        <span>{copy.highlight}</span>
                        <strong>{row.highlight}</strong>
                      </div>
                      <div>
                        <span>{copy.pair}</span>
                        <strong>{row.pair}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </section>
  )
}
