import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/site-url'
import { LANG_LOCALE, type Lang } from '@/lib/i18n'

export const seoLangs: Lang[] = ['th', 'en', 'la', 'kh', 'zh']
export const siteName = 'Huay Update'
export const siteTitle = 'ตรวจหวย Huay Update | ผลหวยไทย ต่างประเทศ หุ้น รายวัน ล่าสุดวันนี้'
export const siteDescription = 'ตรวจผลหวยวันนี้ ครบทุกประเภท หวยไทย หวยลาว หวยหุ้น ฮานอย อัปเดตรวดเร็ว ดูย้อนหลังได้ทันที ที่ huayupdate.live'
export const siteKeywords = [
  'ตรวจหวย',
  'ผลหวย',
  'หวยไทย',
  'หวยต่างประเทศ',
  'หวยหุ้น',
  'หวยรายวัน',
  'สลากกินแบ่งรัฐบาล',
  'หวยลาว',
  'หวยฮานอย',
]

export const lotteryGroups = [
  {
    code: 'lotto-thai',
    name: 'หวยไทย',
    title: 'ผลหวยไทยล่าสุด',
    description: 'ตรวจผลหวยไทยล่าสุดและผลย้อนหลัง พร้อมเลขรางวัลสำคัญตามวันที่ อัปเดตผลหวยไทยในหน้าเดียว',
    keywords: ['ผลหวยไทย', 'ตรวจหวยไทย', 'สลากกินแบ่งรัฐบาล', 'หวยไทยย้อนหลัง'],
  },
  {
    code: 'lotto-foreign',
    name: 'หวยต่างประเทศ',
    title: 'ผลหวยต่างประเทศล่าสุด',
    description: 'รวมผลหวยต่างประเทศล่าสุดและย้อนหลังตามวันที่ ตรวจผลหวยลาว หวยฮานอย และตลาดหวยต่างประเทศที่มีข้อมูลในระบบ',
    keywords: ['ผลหวยต่างประเทศ', 'หวยลาว', 'หวยฮานอย', 'หวยต่างประเทศย้อนหลัง'],
  },
  {
    code: 'lotto-stock',
    name: 'หวยหุ้น',
    title: 'ผลหวยหุ้นล่าสุด',
    description: 'ตรวจผลหวยหุ้นล่าสุดและย้อนหลัง แยกตามวันที่ พร้อมเลข 3 ตัวบน 2 ตัวบน และ 2 ตัวล่างของตลาดหวยหุ้น',
    keywords: ['ผลหวยหุ้น', 'หวยหุ้นวันนี้', 'หวยหุ้นย้อนหลัง', 'ตรวจหวยหุ้น'],
  },
  {
    code: 'lotto-daily',
    name: 'หวยรายวัน',
    title: 'ผลหวยรายวันล่าสุด',
    description: 'รวมผลหวยรายวันล่าสุดและย้อนหลังตามวันที่ ตรวจผลหวยที่ออกประจำวันได้จากหน้าเดียว',
    keywords: ['ผลหวยรายวัน', 'หวยรายวันวันนี้', 'หวยรายวันย้อนหลัง', 'ตรวจหวยรายวัน'],
  },
] as const

export type LotteryGroupCode = typeof lotteryGroups[number]['code']

export function getLotteryGroup(code: string) {
  return lotteryGroups.find(group => group.code === code)
}

export function absoluteUrl(path = '/'): string {
  const siteUrl = getSiteUrl().replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${siteUrl}${normalizedPath}`
}

export function isSeoLang(value: string): value is Lang {
  return (seoLangs as string[]).includes(value)
}

export function localizedPath(path: string, lang: Lang): string {
  const normalizedPath = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  return `/${lang}${normalizedPath}`
}

export function languageAlternates(path: string): NonNullable<Metadata['alternates']>['languages'] {
  return {
    'x-default': localizedPath(path, 'th'),
    ...Object.fromEntries(
      seoLangs.map(lang => [LANG_LOCALE[lang], localizedPath(path, lang)]),
    ),
  }
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T12:00:00`)
  return !Number.isNaN(date.getTime()) && value === date.toISOString().slice(0, 10)
}

export function formatSeoDate(date: string, lang: Lang = 'th'): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString(LANG_LOCALE[lang], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatThaiShortSeoDate(date: string): string {
  const d = new Date(`${date}T12:00:00`)
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  return `${d.getDate()} ${months[d.getMonth()]} ${String(d.getFullYear() + 543).slice(-2)}`
}

export function lotteryPageTitle(date: string, lang: Lang = 'th'): string {
  if (lang === 'en') return `Lottery results for ${formatSeoDate(date, lang)}`
  if (lang === 'la') return `ຜົນຫວຍວັນທີ ${formatSeoDate(date, lang)}`
  if (lang === 'kh') return `លទ្ធផលឆ្នោតថ្ងៃទី ${formatSeoDate(date, lang)}`
  if (lang === 'zh') return `${formatSeoDate(date, lang)} 彩票开奖结果`
  return `ผลหวยวันนี้ ${formatThaiShortSeoDate(date)} ครบทุกประเภท | ${siteName}`
}

export function lotteryPageDescription(date: string, lang: Lang = 'th'): string {
  if (lang === 'en') return `Check lottery results for ${formatSeoDate(date, lang)}, including Thai lottery, foreign lottery, stock lottery, daily lottery, 3 top, 2 top, and 2 bottom results.`
  if (lang === 'la') return `ກວດຜົນຫວຍວັນທີ ${formatSeoDate(date, lang)} ລວມຫວຍໄທ ຫວຍຕ່າງປະເທດ ຫວຍຫຸ້ນ ແລະຫວຍລາຍວັນ`
  if (lang === 'kh') return `ពិនិត្យលទ្ធផលឆ្នោតថ្ងៃទី ${formatSeoDate(date, lang)} រួមមានឆ្នោតថៃ ឆ្នោតបរទេស ឆ្នោតហ៊ុន និងឆ្នោតប្រចាំថ្ងៃ`
  if (lang === 'zh') return `查看 ${formatSeoDate(date, lang)} 彩票开奖结果，包括泰国彩票、国外彩票、股票彩票、每日彩票、前三位、前两位和后两位结果。`
  return siteDescription
}

export function lotteryGroupTitle(code: string): string {
  return getLotteryGroup(code)?.title ?? 'ผลหวยล่าสุด'
}

export function lotteryGroupDescription(code: string): string {
  return getLotteryGroup(code)?.description ?? siteDescription
}

export function lotteryGroupName(code: string, lang: Lang = 'th'): string {
  const labels: Record<Lang, Record<string, string>> = {
    th: {
      'lotto-thai': 'หวยไทย',
      'lotto-foreign': 'หวยต่างประเทศ',
      'lotto-stock': 'หวยหุ้น',
      'lotto-daily': 'หวยรายวัน',
    },
    en: {
      'lotto-thai': 'Thai Lottery',
      'lotto-foreign': 'Foreign Lottery',
      'lotto-stock': 'Stock Lottery',
      'lotto-daily': 'Daily Lottery',
    },
    la: {
      'lotto-thai': 'ຫວຍໄທ',
      'lotto-foreign': 'ຫວຍຕ່າງປະເທດ',
      'lotto-stock': 'ຫວຍຫຸ້ນ',
      'lotto-daily': 'ຫວຍລາຍວັນ',
    },
    kh: {
      'lotto-thai': 'ឆ្នោតថៃ',
      'lotto-foreign': 'ឆ្នោតបរទេស',
      'lotto-stock': 'ឆ្នោតហ៊ុន',
      'lotto-daily': 'ឆ្នោតប្រចាំថ្ងៃ',
    },
    zh: {
      'lotto-thai': '泰国彩票',
      'lotto-foreign': '国外彩票',
      'lotto-stock': '股票彩票',
      'lotto-daily': '每日彩票',
    },
  }
  return labels[lang][code] ?? getLotteryGroup(code)?.name ?? code
}

export function localizedLotteryGroupTitle(code: string, lang: Lang = 'th'): string {
  const name = lotteryGroupName(code, lang)
  if (lang === 'en') return `Latest ${name} Results`
  if (lang === 'la') return `ຜົນ${name}ລ່າສຸດ`
  if (lang === 'kh') return `លទ្ធផល${name}ថ្មីបំផុត`
  if (lang === 'zh') return `最新${name}结果`
  return getLotteryGroup(code)?.title ?? 'ผลหวยล่าสุด'
}

export function localizedLotteryGroupDescription(code: string, lang: Lang = 'th'): string {
  const name = lotteryGroupName(code, lang)
  if (lang === 'en') return `Check latest ${name} results and history by date, with important lottery numbers in one place.`
  if (lang === 'la') return `ກວດຜົນ${name}ລ່າສຸດ ແລະຜົນຍ້ອນຫຼັງຕາມວັນທີ ພ້ອມເລກສໍາຄັນໃນໜ້າດຽວ.`
  if (lang === 'kh') return `ពិនិត្យលទ្ធផល${name}ថ្មី និងប្រវត្តិតាមថ្ងៃ ជាមួយលេខសំខាន់ៗនៅកន្លែងតែមួយ។`
  if (lang === 'zh') return `按日期查看最新${name}结果和历史记录，在一个页面查看重要号码。`
  return getLotteryGroup(code)?.description ?? siteDescription
}

export function baseOpenGraph(path: string, title: string, description: string): Metadata['openGraph'] {
  return {
    type: 'website',
    locale: 'th_TH',
    url: absoluteUrl(path),
    siteName,
    title: title.includes(siteName) ? title : `${title} | ${siteName}`,
    description,
    images: [{ url: absoluteUrl('/og-image.png'), width: 1200, height: 630, alt: 'ผลหวยวันนี้ Huay Update' }],
  }
}

export function baseTwitter(title: string, description: string): Metadata['twitter'] {
  return {
    card: 'summary_large_image',
    title: title.includes(siteName) ? title : `${title} | ${siteName}`,
    description,
    images: [absoluteUrl('/og-image.png')],
  }
}

export function breadcrumbJsonLd(items: { name: string; item?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.item ? { item: absoluteUrl(item.item) } : {}),
    })),
  }
}
