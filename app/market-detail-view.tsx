import Link from 'next/link'
import { BarChart3, Calculator, ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react'
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
  analysisHistory,
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
  analysisHistory?: MarketResult[]
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
  const analysis = buildLotteryAnalysis(analysisHistory?.length ? analysisHistory : history)

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
          <Link href={backHref} className="market-detail-back" aria-label={t.home}>
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
          <button onClick={onClose} className="market-detail-close" aria-label={t.close}>
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

            {analysis && (
              <LotteryAnalysisBlock
                analysis={analysis}
                accentColor={accentColor}
                accentHighlight={accentHighlight}
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

type DigitStat = {
  digit: string
  count: number
  percent: number
}

type PairStat = {
  pair: string
  count: number
  source: string
}

type LotteryAnalysis = {
  sampleSize: number
  digitStats: DigitStat[]
  pairStats: PairStat[]
  trendPoints: Array<{ label: string; top2: number | null; bottom2: number | null }>
  suggestedNumbers: string[]
  randomNumbers: string[]
  aiPicks: {
    top3: string[]
    top2: string[]
    bottom2: string[]
    reason: string
  }
  confidence: number
}

function numberText(result: MarketResult, field: 'top3' | 'top2' | 'bottom2' | 'firstPrize') {
  const rn = result.result_number
  if (rn?.no_result) return ''
  if (field === 'top3') return result.result_top_3 || rn?.top_3 || ''
  if (field === 'top2') return result.result_top_2 || rn?.top_2 || ''
  if (field === 'bottom2') return result.result_bottom_2 || rn?.bottom_2 || ''
  return result.first_prize || rn?.first_prize || ''
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

function parseTwoDigitNumber(value: string) {
  const digits = digitsOnly(value).slice(-2)
  return digits.length === 2 ? Number(digits) : null
}

function seededRandom(seed: number) {
  let value = seed % 2147483647
  if (value <= 0) value += 2147483646
  return () => {
    value = value * 16807 % 2147483647
    return (value - 1) / 2147483646
  }
}

function weightedDigit(digitStats: DigitStat[], random: () => number) {
  const totalWeight = digitStats.reduce((sum, stat) => sum + stat.count + 1, 0)
  let cursor = random() * totalWeight

  for (const stat of digitStats) {
    cursor -= stat.count + 1
    if (cursor <= 0) return stat.digit
  }

  return digitStats[0]?.digit ?? '0'
}

function buildRandomNumbers(digitStats: DigitStat[], pairStats: PairStat[], seed: number) {
  const random = seededRandom(seed)
  const numbers = new Set<string>()

  pairStats.slice(0, 3).forEach(pair => {
    if (random() > 0.32) numbers.add(pair.pair)
  })

  while (numbers.size < 8) {
    const first = weightedDigit(digitStats, random)
    const second = weightedDigit(digitStats, random)
    numbers.add(`${first}${second}`)
  }

  return [...numbers].slice(0, 8)
}

function rotateDigits(value: string) {
  if (value.length < 3) return value
  return `${value[1]}${value[2]}${value[0]}`
}

function buildAiPicks(digitStats: DigitStat[], pairStats: PairStat[], seed: number) {
  const random = seededRandom(seed + 991)
  const hotDigits = digitStats.slice(0, 6).map(stat => stat.digit)
  const first = hotDigits[0] ?? '0'
  const second = hotDigits[1] ?? '1'
  const third = hotDigits[2] ?? '2'
  const fourth = hotDigits[3] ?? '3'
  const topPair = pairStats[0]?.pair ?? `${first}${second}`
  const nextPair = pairStats[1]?.pair ?? `${second}${first}`
  const supportPair = pairStats[2]?.pair ?? `${first}${third}`
  const top3Base = `${first}${second}${third}`
  const altTop3 = `${topPair}${third}`.slice(0, 3)
  const swingTop3 = rotateDigits(`${second}${fourth}${first}`)

  return {
    top3: [top3Base, altTop3, swingTop3]
      .filter((value, index, values) => value.length === 3 && values.indexOf(value) === index)
      .slice(0, 3),
    top2: [topPair, `${first}${second}`, nextPair]
      .filter((value, index, values) => value.length === 2 && values.indexOf(value) === index)
      .slice(0, 3),
    bottom2: [supportPair, `${third}${first}`, `${weightedDigit(digitStats, random)}${weightedDigit(digitStats, random)}`]
      .filter((value, index, values) => value.length === 2 && values.indexOf(value) === index)
      .slice(0, 3),
    reason: `AI ให้น้ำหนักเลข ${first}, ${second}, ${third} จากความถี่สูงสุด และดึงคู่ซ้ำ ${topPair} มาประกอบแนวทาง`,
  }
}

function buildLotteryAnalysis(history: MarketResult[]): LotteryAnalysis | null {
  const validHistory = history.filter(result => result.result_number && !result.result_number.no_result)
  if (validHistory.length < 3) return null

  const digitCounts = Array(10).fill(0) as number[]
  const pairCounts = new Map<string, { count: number; sources: Set<string> }>()
  let totalDigits = 0

  validHistory.forEach(result => {
    const values = [
      numberText(result, 'top3'),
      numberText(result, 'top2'),
      numberText(result, 'bottom2'),
      numberText(result, 'firstPrize'),
    ].map(digitsOnly).filter(Boolean)

    values.join('').split('').forEach(char => {
      const digit = Number(char)
      if (Number.isInteger(digit) && digit >= 0 && digit <= 9) {
        digitCounts[digit] += 1
        totalDigits += 1
      }
    })

    const pairValues = [
      { pair: digitsOnly(numberText(result, 'top2')).slice(-2), source: '2 บน' },
      { pair: digitsOnly(numberText(result, 'bottom2')).slice(-2), source: '2 ล่าง' },
      { pair: digitsOnly(numberText(result, 'top3')).slice(-2), source: 'ท้าย 3 บน' },
    ].filter(item => item.pair.length === 2)

    pairValues.forEach(item => {
      const current = pairCounts.get(item.pair) ?? { count: 0, sources: new Set<string>() }
      current.count += 1
      current.sources.add(item.source)
      pairCounts.set(item.pair, current)
    })
  })

  if (totalDigits === 0) return null

  const digitStats = digitCounts
    .map((count, digit) => ({
      digit: String(digit),
      count,
      percent: Math.round((count / totalDigits) * 100),
    }))
    .sort((a, b) => b.count - a.count || Number(a.digit) - Number(b.digit))

  const pairStats = [...pairCounts.entries()]
    .map(([pair, stat]) => ({ pair, count: stat.count, source: [...stat.sources].join(' / ') }))
    .sort((a, b) => b.count - a.count || a.pair.localeCompare(b.pair))
    .slice(0, 5)

  const hotDigits = digitStats.slice(0, 4).map(stat => stat.digit)
  const suggestedNumbers = [
    `${hotDigits[0] ?? '0'}${hotDigits[1] ?? '1'}`,
    `${hotDigits[1] ?? '1'}${hotDigits[0] ?? '0'}`,
    `${hotDigits[0] ?? '0'}${hotDigits[2] ?? '2'}`,
    pairStats[0]?.pair,
  ].filter((value, index, values): value is string => Boolean(value) && values.indexOf(value) === index).slice(0, 4)

  const trendPoints = validHistory
    .slice(0, 10)
    .reverse()
    .map(result => ({
      label: shortDate(result.draw_date, 'th'),
      top2: parseTwoDigitNumber(numberText(result, 'top2')),
      bottom2: parseTwoDigitNumber(numberText(result, 'bottom2')),
    }))
  const seed = validHistory.reduce(
    (sum, result, index) => sum + result.draw_id * (index + 3) + Number(result.draw_date.replace(/\D/g, '').slice(-6)),
    17,
  )

  return {
    sampleSize: validHistory.length,
    digitStats,
    pairStats,
    trendPoints,
    suggestedNumbers,
    randomNumbers: buildRandomNumbers(digitStats, pairStats, seed),
    aiPicks: buildAiPicks(digitStats, pairStats, seed),
    confidence: Math.min(92, Math.max(38, Math.round((validHistory.length / 80) * 100))),
  }
}

function analysisCopy(lang: Lang) {
  if (lang === 'en') return {
    title: 'Historical Lottery Analysis',
    aiTitle: 'AI picks for this draw',
    aiSubtitle: 'Weighted by frequency, repeated pairs, and recent movement',
    top3Pick: '3 Top',
    top2Pick: '2 Top',
    bottom2Pick: '2 Bottom',
    mainPick: 'Main',
    subtitle: 'Calculated from recent draws for number tracking only',
    sample: 'draw sample',
    confidence: 'Data strength',
    hotDigits: 'Hot digits',
    formula: 'Calculated picks',
    random: 'Stat-weighted random picks',
    pairPattern: 'Repeated pairs',
    trend: 'Top/Bottom 2 trend',
    top2: '2 Top',
    bottom2: '2 Bottom',
    note: 'Lottery outcomes are random. These numbers are statistical notes, not a prize guarantee.',
  }

  return {
    title: 'คำนวณหวยจากผลย้อนหลัง',
    aiTitle: 'AI วิเคราะห์เลขงวดนี้',
    aiSubtitle: 'คัดเลขเด่นจากความถี่ คู่ซ้ำ และแนวโน้มล่าสุด',
    top3Pick: '3 ตัวบน',
    top2Pick: '2 ตัวบน',
    bottom2Pick: '2 ตัวล่าง',
    mainPick: 'ตัวเด่น',
    subtitle: 'วิเคราะห์ความถี่ เลขซ้ำ และแนวโน้มจากงวดล่าสุด',
    sample: 'งวดที่ใช้วิเคราะห์',
    confidence: 'ความแน่นของข้อมูล',
    hotDigits: 'เลขเด่นตามสถิติ',
    formula: 'เลขคำนวณแนะนำ',
    random: 'เลขสุ่มที่คาดว่าจะออก',
    pairPattern: 'คู่เลขที่ออกซ้ำ',
    trend: 'กราฟแนวโน้ม 2 บน / 2 ล่าง',
    top2: '2 บน',
    bottom2: '2 ล่าง',
    note: 'ผลหวยเป็นการสุ่ม สถิตินี้ใช้เป็นแนวทางจัดเลขและความบันเทิงเท่านั้น ไม่รับประกันผลรางวัล',
  }
}

function AiPickGroup({
  label,
  picks,
  accentColor,
  accentHighlight,
  featured = false,
}: {
  label: string
  picks: string[]
  accentColor: string
  accentHighlight: string
  featured?: boolean
}) {
  return (
    <div className={featured ? 'market-ai-pick-group featured' : 'market-ai-pick-group'}>
      <span>{label}</span>
      <strong style={{
        borderColor: featured ? `${accentHighlight}75` : `${accentColor}45`,
      }}>{picks[0] ?? '-'}</strong>
      <div>
        {picks.slice(1).map(pick => (
          <i key={pick}>{pick}</i>
        ))}
      </div>
    </div>
  )
}

function LotteryAnalysisBlock({
  analysis,
  accentColor,
  accentHighlight,
  lang,
}: {
  analysis: LotteryAnalysis
  accentColor: string
  accentHighlight: string
  lang: Lang
}) {
  const copy = analysisCopy(lang)
  const maxDigitCount = Math.max(...analysis.digitStats.map(stat => stat.count), 1)

  return (
    <section className="market-analysis" style={{ borderColor: `${accentColor}26` }} aria-label={copy.title}>
      <div className="market-analysis-head">
        <div>
          <div className="market-analysis-kicker" style={{ color: accentColor }}>
            <Calculator size={16} />
            <span>{copy.title}</span>
          </div>
          <p>{copy.subtitle}</p>
        </div>
        <div className="market-analysis-score" style={{ borderColor: `${accentColor}35` }}>
          <strong>{analysis.confidence}%</strong>
          <span>{copy.confidence}</span>
        </div>
      </div>

      <div className="market-analysis-metrics">
        <div className="market-analysis-sample">
          <strong>{analysis.sampleSize}</strong>
          <span>{copy.sample}</span>
        </div>
        <div className="market-analysis-picks">
          {analysis.suggestedNumbers.map(number => (
            <span key={number} style={{
              background: `linear-gradient(135deg, ${accentHighlight}, ${accentColor})`,
            }}>{number}</span>
          ))}
        </div>
      </div>

      <article className="market-ai-picks" style={{ borderColor: `${accentColor}3d` }}>
        <div className="market-ai-sweep" />
        <div className="market-ai-picks-head">
          <div>
            <h3>{copy.aiTitle}</h3>
            <p>{copy.aiSubtitle}</p>
          </div>
          <span style={{ background: `linear-gradient(135deg, ${accentHighlight}, ${accentColor})` }}>AI</span>
        </div>
        <div className="market-ai-pick-grid">
          <AiPickGroup label={copy.top3Pick} picks={analysis.aiPicks.top3} accentColor={accentColor} accentHighlight={accentHighlight} featured />
          <AiPickGroup label={copy.top2Pick} picks={analysis.aiPicks.top2} accentColor={accentColor} accentHighlight={accentHighlight} />
          <AiPickGroup label={copy.bottom2Pick} picks={analysis.aiPicks.bottom2} accentColor={accentColor} accentHighlight={accentHighlight} />
        </div>
        <p className="market-ai-reason">{analysis.aiPicks.reason}</p>
      </article>

      <div className="market-analysis-grid">
        <article className="market-analysis-panel">
          <h3><BarChart3 size={16} />{copy.hotDigits}</h3>
          <div className="market-digit-chart">
            {analysis.digitStats.map(stat => (
              <div key={stat.digit} className="market-digit-row">
                <span>{stat.digit}</span>
                <div>
                  <i style={{
                    width: `${Math.max(8, (stat.count / maxDigitCount) * 100)}%`,
                    background: `linear-gradient(90deg, ${accentColor}, ${accentHighlight})`,
                  }} />
                </div>
                <strong>{stat.count}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="market-analysis-panel">
          <h3><Sparkles size={16} />{copy.formula}</h3>
          <div className="market-formula-numbers">
            {analysis.suggestedNumbers.map((number, index) => (
              <div key={number} className="market-formula-number">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong style={{
                  background: `linear-gradient(130deg, ${accentHighlight}, ${accentColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>{number}</strong>
              </div>
            ))}
          </div>
          <div className="market-pair-list">
            <h4>{copy.pairPattern}</h4>
            {analysis.pairStats.map(pair => (
              <div key={pair.pair} className="market-pair-item">
                <strong>{pair.pair}</strong>
                <span>{pair.count} ครั้ง · {pair.source}</span>
              </div>
            ))}
          </div>
          <div className="market-random-list">
            <h4>{copy.random}</h4>
            <div>
              {analysis.randomNumbers.map(number => (
                <span key={number}>{number}</span>
              ))}
            </div>
          </div>
        </article>
      </div>

      <article className="market-analysis-panel market-trend-panel">
        <h3>{copy.trend}</h3>
        <div className="market-trend-chart">
          {analysis.trendPoints.map(point => {
            const topHeight = point.top2 === null ? 4 : Math.max(8, point.top2)
            const bottomHeight = point.bottom2 === null ? 4 : Math.max(8, point.bottom2)
            return (
              <div key={`${point.label}-${point.top2}-${point.bottom2}`} className="market-trend-column">
                <div className="market-trend-bars">
                  <i title={`${copy.top2} ${point.top2 ?? '-'}`} style={{ height: `${topHeight}%`, background: accentColor }} />
                  <i title={`${copy.bottom2} ${point.bottom2 ?? '-'}`} style={{ height: `${bottomHeight}%`, background: '#60a5fa' }} />
                </div>
                <span>{point.label}</span>
              </div>
            )
          })}
        </div>
        <div className="market-trend-legend">
          <span><i style={{ background: accentColor }} />{copy.top2}</span>
          <span><i style={{ background: '#60a5fa' }} />{copy.bottom2}</span>
        </div>
      </article>

      <p className="market-analysis-note">{copy.note}</p>
    </section>
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
