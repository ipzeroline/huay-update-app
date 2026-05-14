'use client'

import { useState, useEffect, useCallback, useMemo, useRef, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  RefreshCw, ChevronLeft, ChevronRight,
  TrendingUp, Globe, Flag, Clock, LayoutGrid,
  Menu, X, Compass, Sparkles, FileText, Calculator, Search, CircleDollarSign,
} from 'lucide-react'
import { DICT, LANGS, LANG_LABEL, LANG_FLAG, isLang, type Lang, type Dict } from '@/lib/i18n'
import { getLotterySeoPage, lotterySeoPages } from '@/lib/lottery-seo-pages'
import { marketPath } from '@/lib/market-url'

/* ─── Types matching the 1168lot API ─── */
interface ResultNumber {
  no_result?: boolean
  status?: string
  label?: string
  no_result_reason?: string
  manual_cancelled_all_tickets?: boolean
  first_prize?: string
  last_2_digits?: string
  top_3?: string
  top_2?: string
  bottom_2?: string
}
interface MarketResult {
  draw_id: number
  draw_date: string
  result_at: string | null
  status: string
  result_number: ResultNumber | null
  result_top_3: string
  result_top_2: string
  result_bottom_2: string
  first_prize: string
  last_2_digits: string
}
interface Market {
  market_id: number
  market_name: string
  market_logo: string
  market_icon: string
  result: MarketResult | null
}
interface Group {
  group_id: number
  group_code: string
  group_name: string
  markets: Market[]
}
interface ApiResponse {
  success: boolean
  data?: {
    draw_date: string
    groups: Group[]
    summary?: { group_count: number; market_count: number; result_count: number }
  }
  message?: string
  error?: string
}

/* ─── Group meta — keyed by group_code ─── */
const GROUP_META: Record<string, { icon: React.ReactNode; color: string; highlight: string; cls: string }> = {
  'lotto-thai':          { icon: <Flag size={13} />,       color: '#d4af37', highlight: '#f5d060', cls: 'gt-thai' },
  'lotto-foreign':       { icon: <Globe size={13} />,      color: '#60a5fa', highlight: '#93c5fd', cls: 'gt-foreign' },
  'lotto-stock':         { icon: <TrendingUp size={13} />,  color: '#4ade80', highlight: '#86efac', cls: 'gt-stock' },
  'lotto-daily':         { icon: <Clock size={13} />,       color: '#a78bfa', highlight: '#c4b5fd', cls: 'gt-daily' },
}
const FALLBACK_META = { icon: <LayoutGrid size={13} />, color: '#d4af37', highlight: '#f5d060', cls: 'gt-thai' }
const metaFor = (code: string) => GROUP_META[code] ?? FALLBACK_META
const GROUP_NAV = [
  { code: 'lotto-thai', labelKey: 'lotteryThai' },
  { code: 'lotto-foreign', labelKey: 'lotteryForeign' },
  { code: 'lotto-stock', labelKey: 'lotteryStock' },
  { code: 'lotto-daily', labelKey: 'lotteryDaily' },
]
const MENU_TOPIC_TITLE: Record<Lang, string> = {
  th: 'ข้อมูลหวย',
  en: 'Lottery guides',
  la: 'ຂໍ້ມູນຫວຍ',
  kh: 'ព័ត៌មានឆ្នោត',
  zh: '彩票指南',
}
const PAGE_HEADING: Record<Lang, { all: string; group: (name: string) => string }> = {
  th: {
    all: 'ผลหวยวันนี้ ครบทุกประเภท',
    group: name => `ผล${name}วันนี้`,
  },
  en: {
    all: 'Today lottery results by category',
    group: name => `${name} results today`,
  },
  la: {
    all: 'ຜົນຫວຍມື້ນີ້ ຄົບທຸກປະເພດ',
    group: name => `ຜົນ${name}ມື້ນີ້`,
  },
  kh: {
    all: 'លទ្ធផលឆ្នោតថ្ងៃនេះ គ្រប់ប្រភេទ',
    group: name => `លទ្ធផល${name}ថ្ងៃនេះ`,
  },
  zh: {
    all: '今日各类彩票开奖结果',
    group: name => `今日${name}结果`,
  },
}
const AI_PICK_COPY: Record<Lang, {
  kicker: string
  title: string
  subtitle: string
  refresh: string
  top3: string
  top2: string
  bottom2: string
  view: string
  note: string
}> = {
  th: {
    kicker: 'AI สุ่มหวยประจำวัน',
    title: 'หวยเด่นที่ AI เลือกให้วันนี้',
    subtitle: 'สุ่มจากรายการหวยที่มีข้อมูลในระบบ พร้อมเลขแนวทางสำหรับจดเป็นไอเดีย',
    refresh: 'สุ่มใหม่',
    top3: '3 ตัวบน',
    top2: '2 ตัวบน',
    bottom2: '2 ตัวล่าง',
    view: 'ดูผลย้อนหลัง',
    note: 'ใช้เพื่อความบันเทิงและจดแนวทางเท่านั้น ไม่รับประกันผลรางวัล',
  },
  en: {
    kicker: 'Daily AI lottery pick',
    title: 'AI-picked lottery highlight today',
    subtitle: 'Randomly selected from available lottery markets with number ideas for personal notes.',
    refresh: 'Pick again',
    top3: '3 Top',
    top2: '2 Top',
    bottom2: '2 Bottom',
    view: 'View history',
    note: 'For entertainment and personal notes only. No prize guarantee.',
  },
  la: {
    kicker: 'AI ສຸ່ມຫວຍປະຈຳວັນ',
    title: 'ຫວຍເດັ່ນທີ່ AI ເລືອກມື້ນີ້',
    subtitle: 'ສຸ່ມຈາກລາຍການຫວຍໃນລະບົບ ພ້ອມເລກແນວທາງສຳລັບຈົດບັນທຶກ',
    refresh: 'ສຸ່ມໃໝ່',
    top3: '3 ໂຕເທິງ',
    top2: '2 ໂຕເທິງ',
    bottom2: '2 ໂຕລຸ່ມ',
    view: 'ເບິ່ງຜົນຍ້ອນຫຼັງ',
    note: 'ໃຊ້ເພື່ອຄວາມບັນເທີງ ແລະຈົດແນວທາງເທົ່ານັ້ນ ບໍ່ຮັບປະກັນຜົນ',
  },
  kh: {
    kicker: 'AI ជ្រើសឆ្នោតប្រចាំថ្ងៃ',
    title: 'ឆ្នោតដែល AI ជ្រើសសម្រាប់ថ្ងៃនេះ',
    subtitle: 'ជ្រើសចៃដន្យពីទីផ្សារឆ្នោតដែលមានក្នុងប្រព័ន្ធ ជាមួយលេខសម្រាប់កំណត់ត្រាផ្ទាល់ខ្លួន',
    refresh: 'ជ្រើសថ្មី',
    top3: '3 ខ្ទង់លើ',
    top2: '2 ខ្ទង់លើ',
    bottom2: '2 ខ្ទង់ក្រោម',
    view: 'មើលប្រវត្តិ',
    note: 'សម្រាប់ការកម្សាន្ត និងកំណត់ត្រាផ្ទាល់ខ្លួនប៉ុណ្ណោះ មិនធានារង្វាន់ទេ',
  },
  zh: {
    kicker: '每日 AI 彩票推荐',
    title: 'AI 今日精选彩票',
    subtitle: '从系统内可用彩票市场随机选择，并提供号码思路供个人记录。',
    refresh: '重新选择',
    top3: '前三位',
    top2: '前两位',
    bottom2: '后两位',
    view: '查看历史',
    note: '仅供娱乐和个人记录，不保证中奖。',
  },
}
const MARKET_TICKER_COPY: Record<Lang, string[]> = {
  th: [
    'HUAY UPDATE +LIVE',
    'ผลหวยวันนี้ อัปเดตครบทุกประเภท',
    'หวยไทย หวยลาว หวยฮานอย หวยหุ้น หวยรายวัน',
    'เลขเด็ด AI ใช้เป็นแนวทางเท่านั้น',
    'ดูผลย้อนหลังแยกตามตลาดหวยได้ทันที',
  ],
  en: [
    'HUAY UPDATE +LIVE',
    'Today lottery results across every category',
    'Thai Lao Hanoi Stock Daily markets',
    'AI lucky numbers are for guidance only',
    'Open lottery history by market instantly',
  ],
  la: [
    'HUAY UPDATE +LIVE',
    'ຜົນຫວຍມື້ນີ້ ອັບເດດຄົບທຸກປະເພດ',
    'ຫວຍໄທ ຫວຍລາວ ຮານອຍ ຫວຍຫຸ້ນ ຫວຍລາຍວັນ',
    'ເລກເດັດ AI ໃຊ້ເປັນແນວທາງເທົ່ານັ້ນ',
    'ເບິ່ງຜົນຍ້ອນຫຼັງແຍກຕາມຕະຫຼາດໄດ້ທັນທີ',
  ],
  kh: [
    'HUAY UPDATE +LIVE',
    'លទ្ធផលឆ្នោតថ្ងៃនេះ អាប់ដេតគ្រប់ប្រភេទ',
    'ឆ្នោតថៃ ឡាវ ហាណូយ ហ៊ុន ប្រចាំថ្ងៃ',
    'លេខ AI សម្រាប់ជាគំនិតប៉ុណ្ណោះ',
    'មើលប្រវត្តិតាមទីផ្សារបានភ្លាមៗ',
  ],
  zh: [
    'HUAY UPDATE +LIVE',
    '今日彩票结果覆盖全部分类',
    '泰国 老挝 河内 股票 每日市场',
    'AI 幸运号码仅供参考',
    '可按市场立即查看历史结果',
  ],
}

/* per-group highlight palettes — cycle through these per market card */
const GROUP_PALETTE: Record<string, string[]> = {
  'lotto-thai':    ['#f5d060', '#f0c14b', '#e8b923', '#d4af37', '#c9a227'],
  'lotto-foreign': ['#93c5fd', '#7dd3fc', '#67e8f9', '#5eead4', '#a5b4fc'],
  'lotto-stock':   ['#86efac', '#6ee7b7', '#4ade80', '#34d399', '#a7f3d0'],
  'lotto-daily':   ['#c4b5fd'],
}
const FALLBACK_PALETTE = ['#f5d060']
const paletteFor = (code: string) => GROUP_PALETTE[code] ?? FALLBACK_PALETTE
const lotteryDatePath = (date: string, prefix = '') => `${prefix}/lottery/${date}`
const GROUP_EMOJI: Record<string, string> = {
  'lotto-thai': '🇹🇭',
  'lotto-foreign': '🌍',
  'lotto-stock': '📈',
  'lotto-daily': '🕘',
}
const emojiForGroup = (code: string) => GROUP_EMOJI[code] ?? '🎲'

const DATE_LABELS: Record<Lang, { monthsShort: string[]; monthsLong: string[]; weekdays: string[]; weekdaysShort: string[]; buddhistYear?: boolean }> = {
  th: {
    monthsShort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
    monthsLong: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
    weekdays: ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'],
    weekdaysShort: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
    buddhistYear: true,
  },
  en: {
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    monthsLong: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  la: {
    monthsShort: ['ມ.ກ.', 'ກ.ພ.', 'ມ.ນ.', 'ມ.ສ.', 'ພ.ພ.', 'ມິ.ຖ.', 'ກ.ລ.', 'ສ.ຫ.', 'ກ.ຍ.', 'ຕ.ລ.', 'ພ.ຈ.', 'ທ.ວ.'],
    monthsLong: ['ມັງກອນ', 'ກຸມພາ', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ', 'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ'],
    weekdays: ['ວັນອາທິດ', 'ວັນຈັນ', 'ວັນອັງຄານ', 'ວັນພຸດ', 'ວັນພະຫັດ', 'ວັນສຸກ', 'ວັນເສົາ'],
    weekdaysShort: ['ອາ', 'ຈ', 'ອັ', 'ພ', 'ພຫ', 'ສຸ', 'ສ'],
  },
  kh: {
    monthsShort: ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'],
    monthsLong: ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'],
    weekdays: ['ថ្ងៃអាទិត្យ', 'ថ្ងៃចន្ទ', 'ថ្ងៃអង្គារ', 'ថ្ងៃពុធ', 'ថ្ងៃព្រហស្បតិ៍', 'ថ្ងៃសុក្រ', 'ថ្ងៃសៅរ៍'],
    weekdaysShort: ['អា', 'ច', 'អ', 'ពុ', 'ព្រ', 'សុ', 'សៅ'],
  },
  zh: {
    monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    monthsLong: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    weekdaysShort: ['日', '一', '二', '三', '四', '五', '六'],
  },
}

/* ─── Helpers ─── */
function toLocalDateStr(d: Date) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
function addDays(s: string, n: number) {
  const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return toLocalDateStr(d)
}
function addMonths(s: string, n: number) {
  const d = new Date(s + 'T12:00:00'); d.setMonth(d.getMonth() + n, 1); return toLocalDateStr(d)
}
function dateParts(s: string) {
  const d = new Date(s + 'T12:00:00')
  return { date: d, day: d.getDate(), month: d.getMonth(), year: d.getFullYear() }
}
function shortDate(s: string, lang: Lang) {
  const { day, month, year } = dateParts(s)
  const labels = DATE_LABELS[lang]
  const displayYear = labels.buddhistYear ? year + 543 : year
  const shortYear = String(displayYear).slice(-2)
  if (lang === 'zh') return `${month + 1}月${day}日`
  return lang === 'en'
    ? `${labels.monthsShort[month]} ${day}, ${shortYear}`
    : `${day} ${labels.monthsShort[month]} ${shortYear}`
}
function fullDate(s: string, lang: Lang) {
  const { date, day, month, year } = dateParts(s)
  const labels = DATE_LABELS[lang]
  const displayYear = labels.buddhistYear ? year + 543 : year
  if (lang === 'en') return `${labels.weekdays[date.getDay()]}, ${labels.monthsLong[month]} ${day}, ${displayYear}`
  if (lang === 'th') return `${labels.weekdays[date.getDay()]}ที่ ${day} ${labels.monthsLong[month]} ${displayYear}`
  if (lang === 'zh') return `${displayYear}年${month + 1}月${day}日 ${labels.weekdays[date.getDay()]}`
  return `${labels.weekdays[date.getDay()]} ${day} ${labels.monthsLong[month]} ${displayYear}`
}
function fmtTime(s: string | null, lang: Lang) {
  if (!s) return ''
  const match = s.match(/\b(\d{2}):(\d{2})/)
  if (!match) return ''
  const [, hour, minute] = match
  return lang === 'en' ? `${hour}:${minute}` : `${hour}:${minute}`
}
function seededRandom(seed: string) {
  let hash = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return () => {
    hash += 0x6D2B79F5
    let t = hash
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function randomDigits(next: () => number, length: number) {
  return Array.from({ length }, () => Math.floor(next() * 10)).join('')
}
function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, '')
}

/* ──────────────────────────────────────────── */
export default function LotteryApp({ initialData, initialDate, initialLang, groupCode, groupName, langPrefix = '', breadcrumbs }: {
  initialData?: ApiResponse | null
  initialDate?: string
  initialLang?: Lang
  groupCode?: string
  groupName?: string
  langPrefix?: string
  breadcrumbs?: React.ReactNode
} = {}) {
  const [today, setToday] = useState(() => toLocalDateStr(new Date()))
  const date = initialDate ?? today
  const pathname = usePathname()
  const [lang, setLang] = useState<Lang>(initialLang ?? 'th')
  const t: Dict = DICT[lang]

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('lang')
    if (isLang(stored) && stored !== lang) {
      setLang(stored)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changeLang = useCallback((l: Lang) => {
    setLang(l)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('lang', l)
      document.cookie = `lang=${l}; path=/; max-age=${60 * 60 * 24 * 365}`
    }
  }, [])

  useEffect(() => {
    const tick = () => {
      const now = toLocalDateStr(new Date())
      setToday(prev => (prev === now ? prev : now))
    }
    const id = setInterval(tick, 30_000)
    const onVisible = () => { if (document.visibilityState === 'visible') tick() }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])
  const [data, setData] = useState<ApiResponse | null>(initialData ?? null)
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const skipFirstFetchRef = useRef(!!initialData)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [aiPickNonce, setAiPickNonce] = useState(0)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date((initialDate ?? toLocalDateStr(new Date())) + 'T12:00:00')
    return toLocalDateStr(new Date(d.getFullYear(), d.getMonth(), 1, 12))
  })

  const fetchData = useCallback(async (d: string, l: Lang) => {
    abortRef.current?.abort()
    const ctrl = new AbortController(); abortRef.current = ctrl
    setLoading(true)
    try {
      const res = await fetch(`/api/lottery?date=${d}&lang=${l}`, { signal: ctrl.signal, cache: 'no-store' })
      const json: ApiResponse = await res.json()
      if (abortRef.current === ctrl) {
        setData(groupCode && json.data ? {
          ...json,
          data: {
            ...json.data,
            groups: json.data.groups.filter(group => group.group_code === groupCode),
          },
        } : json)
      }
    } catch (e: unknown) {
      if (abortRef.current === ctrl && (e as Error).name !== 'AbortError') {
        setData({ success: false, error: t.loadFail })
      }
    } finally {
      if (abortRef.current === ctrl) {
        abortRef.current = null
        setLoading(false)
      }
    }
  }, [groupCode, t.loadFail])

  useEffect(() => {
    if (skipFirstFetchRef.current) { skipFirstFetchRef.current = false; return }
    fetchData(date, lang)
  }, [date, lang, fetchData])

  const isToday = date === today
  const groups = data?.data?.groups ?? []
  const activeGroupCode = groupCode ?? pathname.match(/^\/lottery\/group\/([^/]+)/)?.[1] ?? 'all'
  const allGroupsHref = groupCode
    ? lotteryDatePath(date, langPrefix)
    : pathname.startsWith('/lottery/') && !pathname.startsWith('/lottery/group/')
    ? lotteryDatePath(date, langPrefix)
    : langPrefix || '/'
  const visibleGroups = groupCode ? groups.filter(group => group.group_code === groupCode) : groups
  const normalizedSearchQuery = normalizeSearchText(searchQuery)
  const displayedGroups = useMemo(() => {
    if (!normalizedSearchQuery) return visibleGroups

    return visibleGroups
      .map(group => {
        const groupMatches = normalizeSearchText(group.group_name).includes(normalizedSearchQuery)
        const markets = groupMatches
          ? group.markets
          : group.markets.filter(market => normalizeSearchText(market.market_name).includes(normalizedSearchQuery))

        return { ...group, markets }
      })
      .filter(group => group.markets.length > 0)
  }, [normalizedSearchQuery, visibleGroups])
  const totalMarkets = displayedGroups.reduce((s, g) => s + g.markets.length, 0)
  const resultCount = displayedGroups.reduce(
    (s, g) => s + g.markets.filter(m => m.result?.result_number && !m.result.result_number.no_result).length,
    0,
  )
  const aiPick = useMemo(() => {
    if (groupCode) return null
    const markets = visibleGroups.flatMap(group => group.markets.map(market => ({ group, market })))
    if (markets.length === 0) return null
    const next = seededRandom(`${date}-${lang}-${aiPickNonce}-huay-ai`)
    const selected = markets[Math.floor(next() * markets.length)]
    const groupMeta = metaFor(selected.group.group_code)
    return {
      group: selected.group,
      market: selected.market,
      meta: groupMeta,
      top3: randomDigits(next, 3),
      top2: randomDigits(next, 2),
      bottom2: randomDigits(next, 2),
    }
  }, [aiPickNonce, date, groupCode, lang, visibleGroups])

  const calendar = useMemo(() => {
    const base = new Date(calendarMonth + 'T12:00:00')
    const year = base.getFullYear()
    const month = base.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (string | null)[] = Array(firstDay).fill(null)

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(toLocalDateStr(new Date(year, month, day, 12)))
    }

    while (cells.length % 7 !== 0) cells.push(null)

    return {
      cells,
      title: `${DATE_LABELS[lang].monthsLong[month]} ${DATE_LABELS[lang].buddhistYear ? year + 543 : year}`,
      canGoNext: addMonths(calendarMonth, 1) <= toLocalDateStr(new Date(new Date(today + 'T12:00:00').getFullYear(), new Date(today + 'T12:00:00').getMonth(), 1, 12)),
    }
  }, [calendarMonth, lang, today])

  const openCalendar = useCallback(() => {
    const d = new Date(date + 'T12:00:00')
    setCalendarMonth(toLocalDateStr(new Date(d.getFullYear(), d.getMonth(), 1, 12)))
    setDatePickerOpen(open => !open)
  }, [date])

  const closeCalendar = useCallback(() => {
    setDatePickerOpen(false)
  }, [])

  const dateDisplay = shortDate(date, lang)
  const previousDate = addDays(date, -1)
  const nextDate = addDays(date, 1)
  const dateHref = (value: string) => groupCode ? `${langPrefix}/lottery/group/${groupCode}/${value}` : lotteryDatePath(value, langPrefix)
  const pageHeading = groupName ? PAGE_HEADING[lang].group(groupName) : PAGE_HEADING[lang].all

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <header className="site-header">
        <div className="site-header-inner">
          {/* Top tier: brand + utilities */}
          <div className="header-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setMenuOpen(true)}
                aria-label={t.menu}
              >
                <Menu size={16} />
              </button>
              <Link href={langPrefix || '/'} className="header-brand" aria-label={t.brand}>
              <div className="header-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Huay Update" width={1024} height={1024} decoding="async" />
              </div>
              <div className="header-brand-text">
                <div className="header-brand-name font-th">{t.brand}</div>
                <span className="header-brand-tag">{t.tagline}</span>
              </div>
            </Link>
            </div>

            <div className="header-actions">
              <LangSwitcher lang={lang} onChange={changeLang} />
              <button
                type="button"
                className="icon-btn"
                onClick={() => fetchData(date, lang)}
                aria-label="Refresh"
              >
                <RefreshCw size={14} className={loading ? 'spinning' : ''} />
              </button>
            </div>
          </div>

          {/* Bottom tier: nav tabs + date picker */}
          <div className="header-row-2">
            <div className="group-tab-row">
              <Link
                href={allGroupsHref}
                className={`group-tab gt-thai ${activeGroupCode === 'all' ? 'active' : ''}`}
                style={activeGroupCode === 'all' ? { color: '#d4af37' } : {}}
              >
                <LayoutGrid size={13} /> {t.all}
              </Link>
              {GROUP_NAV.map(g => {
                const m = metaFor(g.code)
                const isActive = activeGroupCode === g.code
                return (
                  <Link key={g.code}
                    href={`${langPrefix}/lottery/group/${g.code}/${date}`}
                    className={`group-tab ${m.cls} ${isActive ? 'active' : ''}`}
                    style={isActive ? { color: m.color } : {}}
                  >
                    <span style={{ color: isActive ? m.color : undefined }}>{m.icon}</span>
                {t[g.labelKey as keyof Pick<Dict, 'lotteryThai' | 'lotteryForeign' | 'lotteryStock' | 'lotteryDaily'>]}
              </Link>
                )
              })}
            </div>

            <div className="date-group">
              <Link className="date-nav-btn" href={dateHref(previousDate)} aria-label={t.previousDayResults}>
                <ChevronLeft size={14} />
              </Link>
              <button type="button" onClick={openCalendar} className="date-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>{dateDisplay}</span>
              </button>
              {isToday ? (
                <button className="date-nav-btn" disabled aria-label={t.noNextDayResults}>
                  <ChevronRight size={14} />
                </button>
              ) : (
                <Link className="date-nav-btn" href={dateHref(nextDate)} aria-label={t.nextDayResults}>
                  <ChevronRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}>
          <aside className="menu-drawer" onClick={e => e.stopPropagation()}>
            <div className="menu-drawer-head">
              <span>{t.menu}</span>
              <button type="button" className="icon-btn" onClick={() => setMenuOpen(false)} aria-label={t.close}>
                <X size={16} />
              </button>
            </div>
            <nav className="menu-drawer-list">
              <Link href={`${langPrefix}/guide`} className="menu-drawer-item" onClick={() => setMenuOpen(false)}>
                <Compass size={18} /> <span>{t.menuGuide}</span>
              </Link>
              <Link href={`${langPrefix}/lucky-numbers`} className="menu-drawer-item" onClick={() => setMenuOpen(false)}>
                <Sparkles size={18} /> <span>{t.menuLuckyNumbers}</span>
              </Link>
              <Link href={`${langPrefix}/lottery-formula`} className="menu-drawer-item" onClick={() => setMenuOpen(false)}>
                <Calculator size={18} /> <span>{t.menuLotteryFormula}</span>
              </Link>
              <a href="https://zrate.io/" target="_blank" rel="noopener noreferrer" className="menu-drawer-item" onClick={() => setMenuOpen(false)}>
                <CircleDollarSign size={18} /> <span>{t.menuExchangeRate}</span>
              </a>
              <div className="menu-drawer-section-title">{MENU_TOPIC_TITLE[lang]}</div>
              {Object.keys(lotterySeoPages).map(slug => {
                const topic = getLotterySeoPage(slug, lang)
                return topic ? (
                  <Link
                    key={slug}
                    href={`${langPrefix}/lottery/${slug}`}
                    className="menu-drawer-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FileText size={18} /> <span>{topic.h1}</span>
                  </Link>
                ) : null
              })}
            </nav>
          </aside>
        </div>
      )}

      {breadcrumbs}

      {datePickerOpen && (
        <div className="calendar-overlay" onClick={closeCalendar}>
          <div className="calendar-popover" onClick={e => e.stopPropagation()}>
            <div className="calendar-head">
              <button type="button" className="date-nav-btn" onClick={() => setCalendarMonth(m => addMonths(m, -1))}>
                <ChevronLeft size={14} />
              </button>
              <div className="calendar-title">{calendar.title}</div>
              <button
                type="button"
                className="date-nav-btn"
                onClick={() => setCalendarMonth(m => addMonths(m, 1))}
                disabled={!calendar.canGoNext}
              >
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="calendar-grid calendar-weekdays">
              {DATE_LABELS[lang].weekdaysShort.map(day => (
                <div key={day}>{day}</div>
              ))}
            </div>
            <div className="calendar-grid">
              {calendar.cells.map((cell, index) => {
                const disabled = !cell || cell > today
                return disabled ? (
                  <button
                    key={cell ?? `blank-${index}`}
                    type="button"
                    className="calendar-day disabled"
                    disabled
                  >
                    {cell ? new Date(cell + 'T12:00:00').getDate() : ''}
                  </button>
                ) : (
                  <Link
                    key={cell}
                    className={`calendar-day ${cell === date ? 'active' : ''}`}
                    href={dateHref(cell)}
                    onClick={closeCalendar}
                    aria-label={t.viewDateResults.replace('{date}', fullDate(cell, lang))}
                  >
                    {new Date(cell + 'T12:00:00').getDate()}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* BODY */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 16px', flex: 1, width: '100%' }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h1 className="font-th" style={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.1 }}>
              {pageHeading}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginTop: 3 }}>📅 {fullDate(date, lang)}</p>
          </div>
          {loading ? (
            <div className="skeleton" style={{ width: 112, height: 28, borderRadius: 20, flexShrink: 0 }} />
          ) : totalMarkets > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 20, flexShrink: 0,
              background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.18)',
              fontSize: '0.875rem', fontWeight: 500, color: 'var(--green)',
            }}>
              <div className="pulse-dot" style={{ background: 'var(--green)' }} />
              {resultCount} / {totalMarkets} {t.hasResult}
            </div>
          )}
        </div>

        {!groupCode && (
          <div className="market-ticker" aria-label="Huay Update live ticker">
            <div className="market-ticker-track">
              {[...MARKET_TICKER_COPY[lang], ...MARKET_TICKER_COPY[lang]].map((item, index) => (
                <span key={`${item}-${index}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {!loading && aiPick && (
          <section className="ai-daily-pick" style={{ '--ai-pick-color': aiPick.meta.color } as CSSProperties & Record<'--ai-pick-color', string>}>
            <div className="ai-daily-pick-orbit" aria-hidden="true" />
            <div className="ai-daily-pick-main">
              <div className="ai-daily-pick-logo">
                {aiPick.market.market_logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={aiPick.market.market_logo} alt="" loading="lazy" decoding="async" />
                ) : (
                  <span>{emojiForGroup(aiPick.group.group_code)}</span>
                )}
              </div>
              <div className="ai-daily-pick-copy">
                <p>
                  <Sparkles size={15} />
                  <span>{AI_PICK_COPY[lang].kicker}</span>
                </p>
                <h2>{AI_PICK_COPY[lang].title}</h2>
                <strong>{aiPick.market.market_name}</strong>
                <span>{aiPick.group.group_name} · {AI_PICK_COPY[lang].subtitle}</span>
              </div>
            </div>
            <div className="ai-daily-pick-numbers" aria-label={AI_PICK_COPY[lang].title}>
              <div>
                <span>{AI_PICK_COPY[lang].top3}</span>
                <strong>{aiPick.top3}</strong>
              </div>
              <div>
                <span>{AI_PICK_COPY[lang].top2}</span>
                <strong>{aiPick.top2}</strong>
              </div>
              <div>
                <span>{AI_PICK_COPY[lang].bottom2}</span>
                <strong>{aiPick.bottom2}</strong>
              </div>
            </div>
            <div className="ai-daily-pick-actions">
              <button type="button" onClick={() => setAiPickNonce(value => value + 1)}>
                <Sparkles size={15} />
                <span>{AI_PICK_COPY[lang].refresh}</span>
              </button>
              <Link href={`${langPrefix}${marketPath(aiPick.market.market_id, aiPick.market.market_name, lang)}`}>
                {AI_PICK_COPY[lang].view}
              </Link>
              <small>{AI_PICK_COPY[lang].note}</small>
            </div>
          </section>
        )}

        {data?.success && visibleGroups.length > 0 && (
          <div className="market-search-section">
            <label className="market-search-field">
              <Search size={16} />
              <input
                className="market-search-input"
                type="search"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder={t.searchLotteryPlaceholder}
                aria-label={t.searchLottery}
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="market-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label={t.clearSearch}
                >
                  <X size={14} />
                </button>
              )}
            </label>
          </div>
        )}

        {loading && (
          <ResultsSkeleton />
        )}

        {!loading && data && !data.success && (
          <div style={{ padding: '40px 24px', textAlign: 'center', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16 }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>⚠️</div>
            <p className="font-th" style={{ color: '#f87171' }}>{data.error ?? data.message ?? t.loadFail}</p>
          </div>
        )}

        {!loading && data?.success && visibleGroups.length === 0 && (
          <div style={{ padding: '64px 24px', textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18 }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
            <p className="font-th" style={{ fontSize: '1.05rem', color: 'var(--text-2)' }}>
              {groupCode ? t.noGroupResult.replace('{group}', groupName ?? t.lotteryGroupFallback) : t.notFound}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginTop: 6 }}>
              {groupCode ? t.tryPreviousDraw : t.tryOther}
            </p>
          </div>
        )}

        {!loading && data?.success && visibleGroups.length > 0 && displayedGroups.length === 0 && (
          <div style={{ padding: '48px 24px', textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🔍</div>
            <p className="font-th" style={{ fontSize: '1.05rem', color: 'var(--text-2)' }}>
              {t.noSearchResults}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginTop: 6 }}>
              {searchQuery}
            </p>
          </div>
        )}

        {!loading && data?.success && displayedGroups.map(g => {
          const m = metaFor(g.group_code)
          return (
            <div key={g.group_code} style={{ marginBottom: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', borderRadius: 12,
                  background: `linear-gradient(135deg, ${m.color}18, ${m.color}06)`,
                  border: `1px solid ${m.color}40`,
                }}>
                  <h3 className="font-th" style={{
                    fontSize: '1.5rem', fontWeight: 700,
                    lineHeight: 1,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span>{emojiForGroup(g.group_code)}</span>
                    <span style={{ color: m.color }}>{g.group_name}</span>
                  </h3>
                </div>
                <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${m.color}50, transparent)`, borderRadius: 1 }} />
                <span style={{
                  fontSize: '0.95rem', color: m.color, fontFamily: 'Kanit,sans-serif', fontWeight: 600,
                  padding: '4px 10px', borderRadius: 8,
                  background: `${m.color}12`, border: `1px solid ${m.color}30`,
                }}>
                  {g.markets.filter(mk => mk.result?.result_number && !mk.result.result_number.no_result).length}/{g.markets.length}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
                {(() => { const palette = paletteFor(g.group_code); return g.markets.map((mk, idx) => (
                  <MarketCard key={mk.market_id} market={mk} accentColor={m.color} accentHighlight={palette[idx % palette.length]} index={idx} t={t} lang={lang} langPrefix={langPrefix} />
                )) })()}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

/* ─── Language Switcher (single button + popover) ─── */
function LangSwitcher({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const languageHref = useCallback((nextLang: Lang) => {
    const pathWithoutLang = pathname.replace(/^\/(th|en|la|kh|zh)(?=\/|$)/, '') || '/'
    const prefix = `/${nextLang}`
    if (
      /^\/lottery\/\d{4}-\d{2}-\d{2}$/.test(pathWithoutLang) ||
      /^\/lottery\/group\/[^/]+(?:\/\d{4}-\d{2}-\d{2})?$/.test(pathWithoutLang) ||
      /^\/market\/[^/]+$/.test(pathWithoutLang)
    ) {
      return `${prefix}${pathWithoutLang}`
    }
    if (pathWithoutLang === '/') return prefix
    return prefix
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={wrapRef} style={{ position: 'relative', marginLeft: 'auto' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 10px', borderRadius: 8,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          color: 'var(--text-2)', cursor: 'pointer',
          fontSize: '0.875rem', fontWeight: 600,
          fontFamily: 'Sarabun,sans-serif',
        }}
      >
        <span style={{ fontSize: '1rem' }}>{LANG_FLAG[lang]}</span>
        <span>{LANG_LABEL[lang]}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div role="listbox" style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 60,
          minWidth: 160,
          background: 'rgba(15,15,25,0.98)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--border)', borderRadius: 10,
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          animation: 'fadeIn 0.12s ease',
        }}>
          {LANGS.map(l => (
            <Link
              key={l}
              role="option"
              aria-selected={l === lang}
              href={languageHref(l)}
              onClick={() => { onChange(l); setOpen(false) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', textAlign: 'left',
                background: l === lang ? 'rgba(212,175,55,0.12)' : 'transparent',
                color: l === lang ? '#f5d060' : 'var(--text-2)',
                border: 'none', borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                fontSize: '0.95rem', fontWeight: 600,
                fontFamily: 'Sarabun,sans-serif',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { if (l !== lang) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (l !== lang) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: '1.1rem' }}>{LANG_FLAG[l]}</span>
              <span style={{ flex: 1 }}>{LANG_LABEL[l]}</span>
              {l === lang && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Market Card ─── */
function ResultsSkeleton() {
  return (
    <div aria-hidden="true">
      {Array.from({ length: 3 }).map((_, groupIndex) => (
        <div key={groupIndex} style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div className="skeleton" style={{ width: 168, height: 42, borderRadius: 12 }} />
            <div className="skeleton" style={{ flex: 1, height: 2, borderRadius: 1 }} />
            <div className="skeleton" style={{ width: 54, height: 30, borderRadius: 8 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {Array.from({ length: 6 }).map((__, cardIndex) => (
              <div
                key={cardIndex}
                style={{
                  minHeight: 166,
                  borderRadius: 14,
                  padding: '14px 16px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="skeleton" style={{ width: '68%', height: 16, borderRadius: 6, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: 74, height: 13, borderRadius: 6 }} />
                  </div>
                  <div className="skeleton" style={{ width: 92, height: 26, borderRadius: 8, flexShrink: 0 }} />
                </div>

                <div className="skeleton" style={{ height: 40, borderRadius: 9, marginBottom: 12 }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  <div className="skeleton" style={{ height: 78, borderRadius: 10 }} />
                  <div className="skeleton" style={{ height: 78, borderRadius: 10 }} />
                  <div className="skeleton" style={{ height: 78, borderRadius: 10 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function MarketCard({ market, accentColor, accentHighlight, index, t, lang, langPrefix }: { market: Market; accentColor: string; accentHighlight: string; index: number; t: Dict; lang: Lang; langPrefix: string }) {
  const r = market.result
  const rn = r?.result_number
  const noResult = rn?.no_result === true
  const hasResult = !!rn && !noResult
  const top3 = r?.result_top_3 || rn?.top_3 || ''
  const top2 = r?.result_top_2 || rn?.top_2 || ''
  const bottom2 = r?.result_bottom_2 || rn?.bottom_2 || ''
  const firstPrize = r?.first_prize || rn?.first_prize || ''
  const historyHref = `${langPrefix}${marketPath(market.market_id, market.market_name, lang)}`

  return (
    <Link
      href={historyHref}
      aria-label={`${t.viewHistory} ${market.market_name}`}
      title={t.viewHistory}
      style={{
        background: hasResult
          ? `linear-gradient(135deg, ${accentColor}0e 0%, rgba(8,8,16,0.95) 70%)`
          : 'var(--bg-card)',
        border: `1px solid ${hasResult ? accentColor + '25' : 'var(--border)'}`,
        borderRadius: 14, padding: '14px 16px',
        animation: `slideUp 0.3s ease ${index * 0.02}s both`,
        position: 'relative', overflow: 'hidden',
        textAlign: 'left', width: '100%', color: 'inherit',
        transition: 'all 0.18s ease',
        display: 'flex', flexDirection: 'column',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = `0 6px 20px ${accentColor}18`
        el.style.borderColor = accentColor + '45'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
        el.style.borderColor = hasResult ? accentColor + '25' : 'var(--border)'
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute', top: 10, right: 10, zIndex: 2,
          width: 30, height: 30, borderRadius: 8,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: 0,
          background: `${accentColor}14`,
          border: `1px solid ${accentColor}35`,
          color: accentColor,
          fontSize: '1rem',
        }}
      >
        🕘
      </span>
      {/* header: logo + name + time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingRight: 38 }}>
        {market.market_logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={market.market_logo} alt="" loading="lazy" decoding="async" style={{
            width: 36, height: 36, borderRadius: 9, objectFit: 'cover',
            border: '1px solid var(--border)', flexShrink: 0,
          }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="font-th" style={{
            fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{market.market_name}</div>
          {r?.result_at && (
            <div style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginTop: 3 }}>
              {fmtTime(r.result_at, lang)} {t.hourSuffix}
            </div>
          )}
        </div>
      </div>

      {/* body */}
      {noResult ? (
        <div style={{
          padding: '16px 10px', textAlign: 'center',
          color: '#f87171', fontSize: '0.95rem', fontFamily: 'Kanit,sans-serif', fontWeight: 600,
          background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10,
          marginTop: 'auto',
        }}>
          {rn?.label ?? t.noResult}
        </div>
      ) : hasResult ? (
        <div style={{ marginTop: 'auto' }}>
          {firstPrize && firstPrize.length > 3 && (
            <div style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8,
              padding: '8px 12px', marginBottom: 12,
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 9,
            }}>
              <span style={{
                fontSize: '0.875rem', color: 'var(--text-3)', fontFamily: 'Kanit,sans-serif',
                fontWeight: 600, letterSpacing: '0.06em',
              }}>{t.firstPrize}</span>
              <span style={{
                fontFamily: 'Kanit,sans-serif', fontWeight: 700, fontSize: '1.15rem',
                letterSpacing: '0.06em',
                background: `linear-gradient(130deg, #f5d060, ${accentColor})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                // filter removed,
              }}>{firstPrize}</span>
            </div>
          )}

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            alignItems: 'stretch', gap: 8,
          }}>
            <NumberCell label={t.top3} value={top3} accentColor={accentColor} accentHighlight={accentHighlight} />
            <NumberCell label={t.top2Short} value={top2} accentColor={accentColor} accentHighlight={accentHighlight} />
            <NumberCell label={t.bottom2Short} value={bottom2} accentColor={accentColor} accentHighlight={accentHighlight} />
          </div>
        </div>
      ) : (
        <div style={{
          fontSize: '0.95rem', color: 'var(--text-3)',
          fontStyle: 'italic', padding: '18px 4px', textAlign: 'center',
          marginTop: 'auto',
        }}>— {t.notYet} —</div>
      )}
    </Link>
  )
}

function NumberCell({ label, value, accentColor, accentHighlight, variant }: {
  label: string; value: string; accentColor: string; accentHighlight: string; variant?: 'primary'
}) {
  const isPrimary = variant === 'primary'
  return (
    <div style={{
      padding: '10px 8px 12px',
      background: isPrimary ? `${accentColor}1f` : `${accentColor}0c`,
      border: `1px solid ${isPrimary ? accentColor + '55' : accentColor + '25'}`,
      borderRadius: 10,
      textAlign: 'center',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      minHeight: 78,
    }}>
      <div style={{
        fontSize: '0.875rem', color: 'var(--text-3)', fontFamily: 'Kanit,sans-serif',
        fontWeight: 600, letterSpacing: '0.06em',
      }}>{label}</div>
      <div style={{
        fontFamily: 'Kanit,sans-serif',
        fontWeight: 800,
        fontSize: '1.6rem',
        lineHeight: 1, letterSpacing: '0.05em',
        background: `linear-gradient(130deg, ${accentHighlight}, ${accentColor})`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        // filter removed,
      }}>{value || '—'}</div>
    </div>
  )
}
