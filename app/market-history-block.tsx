'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type Dict, LANG_LOCALE, type Lang } from '@/lib/i18n'
import type { MarketDetailResponse, MarketResult } from '@/lib/lottery-api'

const HISTORY_PAGE_SIZE = 20

type HistoryPaginationData = {
  page: number
  limit: number
  count: number
  total: number
  has_more: boolean
}

function shortDate(s: string, lang: Lang) {
  const parts = new Intl.DateTimeFormat(LANG_LOCALE[lang], {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  }).formatToParts(new Date(`${s}T12:00:00`))
  const day = parts.find(part => part.type === 'day')?.value
  const month = parts.find(part => part.type === 'month')?.value
  const year = parts.find(part => part.type === 'year')?.value

  return day && month && year ? `${day} ${month} ${year}` : s
}

export function MarketHistoryBlock({
  marketId,
  marketName,
  initialHistory,
  initialPagination,
  initialPage,
  canonicalPath,
  accentColor,
  t,
  lang,
}: {
  marketId: string
  marketName: string
  initialHistory: MarketResult[]
  initialPagination?: HistoryPaginationData
  initialPage: number
  canonicalPath: string
  accentColor: string
  t: Dict
  lang: Lang
}) {
  const [history, setHistory] = useState(initialHistory)
  const [pagination, setPagination] = useState<HistoryPaginationData | undefined>(initialPagination)
  const [currentPage, setCurrentPage] = useState(initialPagination?.page ?? initialPage)
  const [loadingPage, setLoadingPage] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const pageSize = pagination?.limit ?? HISTORY_PAGE_SIZE
  const totalHistory = pagination?.total ?? history.length
  const totalPages = Math.max(1, Math.ceil(totalHistory / pageSize))
  const visibleHistory = useMemo(
    () => pagination ? history : history.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, history, pageSize, pagination],
  )

  useEffect(() => {
    if (!canonicalPath) return
    if (window.location.pathname + window.location.search !== canonicalPath) {
      window.history.replaceState(null, '', canonicalPath)
    }
  }, [canonicalPath])

  async function goToPage(page: number) {
    const nextPage = Math.min(Math.max(1, page), totalPages)
    if (nextPage === currentPage || loadingPage) return

    setLoadingPage(nextPage)
    setError(null)
    if (canonicalPath) window.history.replaceState(null, '', canonicalPath)

    try {
      const params = new URLSearchParams({
        lang,
        page: String(nextPage),
        limit: String(pageSize),
      })
      const response = await fetch(`/api/market/${encodeURIComponent(marketId)}?${params.toString()}`, {
        cache: 'no-store',
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const detail = await response.json() as MarketDetailResponse
      if (!detail.success || !detail.data) {
        throw new Error(detail.error ?? detail.message ?? t.loadFail)
      }

      setHistory(detail.data.history ?? [])
      setPagination(detail.data.pagination)
      setCurrentPage(detail.data.pagination?.page ?? nextPage)
      if (canonicalPath) window.history.replaceState(null, '', canonicalPath)
    } catch {
      setError(t.loadFail)
    } finally {
      setLoadingPage(null)
    }
  }

  return (
    <div className="market-detail-history" aria-busy={loadingPage !== null}>
      <div className="market-detail-history-head">
        <h2 style={{ color: accentColor }}>{t.history}</h2>
        <div style={{ background: `linear-gradient(90deg, ${accentColor}30, transparent)` }} />
        <span>{totalHistory} {t.draws}</span>
      </div>

      <div className="market-detail-history-table-wrap" style={{ opacity: loadingPage ? 0.6 : 1 }}>
        <table className="market-detail-history-table">
          <thead>
            <tr>
              <th>{t.historyDate}</th>
              <th>{t.firstPrize}</th>
              <th>{t.top3}</th>
              <th>{t.top2Short}</th>
              <th>{t.bottom2Short}</th>
            </tr>
          </thead>
          <tbody>
            {visibleHistory.length > 0 ? (
              visibleHistory.map(h => (
                <HistoryTableRow
                  key={h.draw_id}
                  result={h}
                  accentColor={accentColor}
                  t={t}
                  lang={lang}
                  marketName={marketName}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="market-detail-history-empty">{t.notYet}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error && <p className="market-detail-history-empty">{error}</p>}

      <HistoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        loadingPage={loadingPage}
        t={t}
        onPageChange={goToPage}
      />
    </div>
  )
}

function HistoryTableRow({
  result,
  accentColor,
  t,
  lang,
  marketName,
}: {
  result: MarketResult
  accentColor: string
  t: Dict
  lang: Lang
  marketName: string
}) {
  const rn = result.result_number
  const noResult = rn?.no_result === true
  const firstPrize = result.first_prize || rn?.first_prize || ''
  const top3 = result.result_top_3 || rn?.top_3 || ''
  const top2 = result.result_top_2 || rn?.top_2 || ''
  const bottom2 = result.result_bottom_2 || rn?.bottom_2 || ''

  return (
    <tr>
      <th scope="row" className="market-detail-history-date">{marketName} | {shortDate(result.draw_date, lang)}</th>
      {noResult ? (
        <td colSpan={4} className="market-detail-history-empty">{rn?.label ?? t.noResult}</td>
      ) : (
        <>
          <HistoryTableNumber value={firstPrize.length > 3 ? firstPrize : ''} accentColor={accentColor} />
          <HistoryTableNumber value={top3} accentColor={accentColor} />
          <HistoryTableNumber value={top2} accentColor={accentColor} />
          <HistoryTableNumber value={bottom2} accentColor={accentColor} />
        </>
      )}
    </tr>
  )
}

function HistoryTableNumber({ value, accentColor }: { value: string; accentColor: string }) {
  return (
    <td className="market-detail-history-number">
      <span style={{
        background: `linear-gradient(130deg, #f5d060, ${accentColor})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>{value || '-'}</span>
    </td>
  )
}

function HistoryPagination({
  currentPage,
  totalPages,
  loadingPage,
  t,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  loadingPage: number | null
  t: Dict
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const pages = historyPaginationPages(currentPage, totalPages)
  const previousDisabled = currentPage <= 1 || loadingPage !== null
  const nextDisabled = currentPage >= totalPages || loadingPage !== null

  return (
    <nav className="market-detail-history-pagination" aria-label={`${t.history} ${t.page}`}>
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className={`market-detail-history-page-nav${previousDisabled ? ' disabled' : ''}`}
        disabled={previousDisabled}
      >
        <ChevronLeft size={16} />
        <span>{t.previousPage}</span>
      </button>

      <div className="market-detail-history-page-numbers">
        {pages.map((page, index) => page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="market-detail-history-page-ellipsis">...</span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`market-detail-history-page-number${page === currentPage ? ' active' : ''}`}
            aria-current={page === currentPage ? 'page' : undefined}
            disabled={page === currentPage || loadingPage !== null}
          >
            {loadingPage === page ? '...' : page}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className={`market-detail-history-page-nav${nextDisabled ? ' disabled' : ''}`}
        disabled={nextDisabled}
      >
        <span>{t.nextPage}</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}

function historyPaginationPages(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)

  const pages = new Set<number>([1, totalPages, currentPage])
  if (currentPage > 1) pages.add(currentPage - 1)
  if (currentPage < totalPages) pages.add(currentPage + 1)
  if (currentPage <= 3) {
    pages.add(2)
    pages.add(3)
    pages.add(4)
  }
  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1)
    pages.add(totalPages - 2)
    pages.add(totalPages - 3)
  }

  const sorted = [...pages]
    .filter(page => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)

  return sorted.reduce<Array<number | 'ellipsis'>>((items, page, index) => {
    const previous = sorted[index - 1]
    if (previous && page - previous > 1) items.push('ellipsis')
    items.push(page)
    return items
  }, [])
}
