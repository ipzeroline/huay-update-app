import Link from 'next/link'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { type Dict, LANG_LOCALE, type Lang } from '@/lib/i18n'
import type { MarketDetailResponse, MarketResult } from '@/lib/lottery-api'

type MarketShell = {
  market_id?: number
  market_name: string
  market_logo?: string
}

const HISTORY_PAGE_SIZE = 20

function fullDate(s: string, lang: Lang) {
  return new Date(`${s}T12:00:00`).toLocaleDateString(LANG_LOCALE[lang], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
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

function fmtTime(s: string | null) {
  const match = s?.match(/\b(\d{2}):(\d{2})/)
  return match ? `${match[1]}:${match[2]}` : ''
}

export function MarketDetailPanel({
  market,
  detail,
  loading = false,
  accentColor,
  accentHighlight,
  t,
  lang,
  onClose,
  asModal = false,
  backHref,
  historyPage = 1,
  historyPageHref,
}: {
  market: MarketShell
  detail: MarketDetailResponse | null
  loading?: boolean
  accentColor: string
  accentHighlight: string
  t: Dict
  lang: Lang
  onClose?: () => void
  asModal?: boolean
  backHref?: string
  historyPage?: number
  historyPageHref?: (page: number) => string
}) {
  const m = detail?.data?.market
  const latest = detail?.data?.latest_result
  const history = detail?.data?.history ?? []
  const marketName = m?.name ?? market.market_name
  const apiPagination = detail?.data?.pagination
  const pageSize = apiPagination?.limit ?? HISTORY_PAGE_SIZE
  const totalHistory = apiPagination?.total ?? history.length
  const totalPages = Math.max(1, Math.ceil(totalHistory / pageSize))
  const currentPage = Math.min(
    Math.max(1, apiPagination?.page ?? historyPage),
    totalPages,
  )
  const visibleHistory = apiPagination
    ? history
    : history.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div
      className={asModal ? 'market-detail-card modal-mode' : 'market-detail-card page-mode'}
      style={{
        background: `linear-gradient(180deg, ${accentColor}0a 0%, var(--bg) 60%)`,
        borderColor: `${accentColor}30`,
        boxShadow: asModal ? `0 20px 60px ${accentColor}25` : `0 20px 60px ${accentColor}18`,
      }}
    >
      <div className="market-detail-head">
        {backHref && (
          <Link href={backHref} className="market-detail-back" aria-label="กลับหน้าแรก">
            <ChevronLeft size={16} />
          </Link>
        )}
        {market.market_logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={market.market_logo} alt="" className="market-detail-logo" loading="lazy" decoding="async" />
        )}
        <div className="market-detail-title">
          <h1>{m?.name ?? market.market_name}</h1>
          <p>{m?.group_name ?? ''}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="market-detail-close" aria-label="ปิด">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="market-detail-body">
        {loading && (
          <div className="market-detail-loading">
            <div className="skeleton" style={{ height: 140 }} />
            <div className="skeleton" style={{ height: 24, width: 120 }} />
            {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 56 }} />)}
          </div>
        )}

        {!loading && detail && !detail.success && (
          <div className="market-detail-error">
            ⚠️ {detail.error ?? detail.message ?? t.loadFail}
          </div>
        )}

        {!loading && detail?.success && (
          <>
            {latest && (
              <LatestResultBlock
                result={latest}
                accentColor={accentColor}
                accentHighlight={accentHighlight}
                t={t}
                lang={lang}
              />
            )}

            <div className="market-detail-history">
              <div className="market-detail-history-head">
                <h2 style={{ color: accentColor }}>{t.history}</h2>
                <div style={{ background: `linear-gradient(90deg, ${accentColor}30, transparent)` }} />
                <span>{totalHistory} {t.draws}</span>
              </div>

              <div className="market-detail-history-table-wrap">
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

              <HistoryPagination
                currentPage={currentPage}
                totalPages={totalPages}
                t={t}
                historyPageHref={historyPageHref}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function LatestResultBlock({ result, accentColor, accentHighlight, t, lang }: { result: MarketResult; accentColor: string; accentHighlight: string; t: Dict; lang: Lang }) {
  const rn = result.result_number
  const noResult = rn?.no_result === true
  const firstPrize = result.first_prize || rn?.first_prize || ''
  const top3 = result.result_top_3 || rn?.top_3 || ''
  const top2 = result.result_top_2 || rn?.top_2 || ''
  const bottom2 = result.result_bottom_2 || rn?.bottom_2 || ''

  return (
    <div className="market-detail-latest" style={{
      background: `linear-gradient(135deg, ${accentColor}10 0%, rgba(8,8,16,0.5) 70%)`,
      borderColor: `${accentColor}25`,
    }}>
      <div className="market-detail-kicker" style={{ color: accentColor }}>{t.latest}</div>
      <div className="market-detail-date">
        📅 {fullDate(result.draw_date, lang)}
        <span> · {fmtTime(result.result_at)} {t.hourSuffix}</span>
      </div>

      {noResult ? (
        <div className="market-detail-no-result">
          {rn?.label ?? t.noResult}
        </div>
      ) : (
        <div className="market-detail-history-card-body">
          {firstPrize && firstPrize.length > 3 && (
            <div className="market-detail-history-first-prize">
              <span>{t.firstPrize}</span>
              <strong style={{
                background: `linear-gradient(130deg, #f5d060, ${accentColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>{firstPrize}</strong>
            </div>
          )}
          <div className="market-detail-history-card-numbers">
            <HistoryCell label={t.top3} value={top3} accentColor={accentColor} accentHighlight={accentHighlight} boxed />
            <HistoryCell label={t.top2Short} value={top2} accentColor={accentColor} accentHighlight={accentHighlight} boxed />
            <HistoryCell label={t.bottom2Short} value={bottom2} accentColor={accentColor} accentHighlight={accentHighlight} boxed />
          </div>
        </div>
      )}
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
      }}>{value || '—'}</span>
    </td>
  )
}

function HistoryPagination({
  currentPage,
  totalPages,
  t,
  historyPageHref,
}: {
  currentPage: number
  totalPages: number
  t: Dict
  historyPageHref?: (page: number) => string
}) {
  if (totalPages <= 1 || !historyPageHref) return null

  const pages = historyPaginationPages(currentPage, totalPages)
  const previousDisabled = currentPage <= 1
  const nextDisabled = currentPage >= totalPages

  return (
    <nav className="market-detail-history-pagination" aria-label={`${t.history} ${t.page}`}>
      <Link
        href={historyPageHref(Math.max(1, currentPage - 1))}
        className={`market-detail-history-page-nav${previousDisabled ? ' disabled' : ''}`}
        aria-disabled={previousDisabled}
        tabIndex={previousDisabled ? -1 : undefined}
      >
        <ChevronLeft size={16} />
        <span>{t.previousPage}</span>
      </Link>

      <div className="market-detail-history-page-numbers">
        {pages.map((page, index) => page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="market-detail-history-page-ellipsis">...</span>
        ) : (
          <Link
            key={page}
            href={historyPageHref(page)}
            className={`market-detail-history-page-number${page === currentPage ? ' active' : ''}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Link>
        ))}
      </div>

      <Link
        href={historyPageHref(Math.min(totalPages, currentPage + 1))}
        className={`market-detail-history-page-nav${nextDisabled ? ' disabled' : ''}`}
        aria-disabled={nextDisabled}
        tabIndex={nextDisabled ? -1 : undefined}
      >
        <span>{t.nextPage}</span>
        <ChevronRight size={16} />
      </Link>
    </nav>
  )
}

function historyPaginationPages(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)

  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1])
  if (currentPage <= 3) {
    pages.add(2)
    pages.add(3)
    pages.add(4)
  }
  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 3)
    pages.add(totalPages - 2)
    pages.add(totalPages - 1)
  }

  const sortedPages = [...pages]
    .filter(page => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)
  const result: Array<number | 'ellipsis'> = []

  sortedPages.forEach((page, index) => {
    if (index > 0 && page - sortedPages[index - 1] > 1) result.push('ellipsis')
    result.push(page)
  })

  return result
}

function HistoryCell({ label, value, accentColor, accentHighlight, boxed = false }: { label: string; value: string; accentColor: string; accentHighlight: string; boxed?: boolean }) {
  return (
    <div className={boxed ? 'market-detail-history-cell boxed' : 'market-detail-history-cell'}>
      <div>{label}</div>
      <strong style={{
        background: `linear-gradient(130deg, ${accentHighlight}, ${accentColor})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>{value || '—'}</strong>
    </div>
  )
}
