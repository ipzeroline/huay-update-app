import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/app/breadcrumbs'
import { MarketDetailPanel } from '@/app/market-detail-view'
import LotterySeoContent, { faqJsonLd } from '@/app/lottery-seo-content'
import { fetchMarketResults, isHiddenLotteryMarket, todayBangkok, type MarketResult } from '@/lib/lottery-api'
import { LANG_LOCALE, type Lang } from '@/lib/i18n'
import LangSwitcher from '@/app/lang-switcher'
import {
  absoluteUrl,
  baseOpenGraph,
  baseTwitter,
  breadcrumbJsonLd,
  formatSeoDate,
  isSeoLang,
  languageAlternates,
  localizedPath,
  siteKeywords,
  siteName,
} from '@/lib/seo' 
import { DICT } from '@/lib/i18n'

export const revalidate = 60
const HISTORY_PAGE_SIZE = 20

type PageProps = {
  params: Promise<{ lang: string; id: string }>
  searchParams?: Promise<{ page?: string | string[] }>
}

function marketPath(id: string) {
  return `/market/${id}`
}

function parseHistoryPage(page: string | string[] | undefined) {
  const value = Array.isArray(page) ? page[0] : page
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

function historyPagePath(id: string, lang: Lang, page: number) {
  const path = localizedPath(marketPath(id), lang)
  return page > 1 ? `${path}?page=${page}` : path
}

function resultSummary(result: MarketResult | null, lang: Lang) {
  const t = DICT[lang]
  if (!result?.result_number || result.result_number.no_result) return t.notYet
  const top3 = result.result_top_3 || result.result_number.top_3 || '-'
  const top2 = result.result_top_2 || result.result_number.top_2 || '-'
  const bottom2 = result.result_bottom_2 || result.result_number.bottom_2 || '-'
  return `${t.top3} ${top3} · ${t.top2} ${top2} · ${t.bottom2} ${bottom2}`
}

function marketHistoryTitle(marketName: string, lang: Lang) {
  if (lang === 'en') return `${marketName} latest results and history`
  if (lang === 'la') return `ຜົນ${marketName}ລ່າສຸດ ແລະຍ້ອນຫຼັງ`
  if (lang === 'kh') return `លទ្ធផល${marketName}ថ្មី និងប្រវត្តិ`
  if (lang === 'zh') return `${marketName}最新结果和历史记录`
  return `ผล${marketName}ล่าสุดและย้อนหลัง`
}

function marketHistoryDescription(marketName: string, groupName: string | undefined, lang: Lang) {
  if (lang === 'en') return `Check latest ${marketName} lottery results and history${groupName ? ` from ${groupName}` : ''}.`
  if (lang === 'la') return `ກວດຜົນ${marketName}ລ່າສຸດ ແລະຜົນຍ້ອນຫຼັງ${groupName ? `ຂອງ ${groupName}` : ''}`
  if (lang === 'kh') return `ពិនិត្យលទ្ធផល${marketName}ថ្មី និងប្រវត្តិ${groupName ? `របស់ ${groupName}` : ''}`
  if (lang === 'zh') return `查看${marketName}最新彩票结果和历史记录${groupName ? `，分类：${groupName}` : ''}。`
  return `ตรวจผล${marketName}ล่าสุด พร้อมผลย้อนหลัง${groupName ? `ของ ${groupName}` : ''}`
}

function compactMarketName(marketName: string) {
  return marketName.replace(/\s+/g, '')
}

function marketSeoKeywords(marketName: string, lang: Lang) {
  const compactName = compactMarketName(marketName)
  if (lang !== 'th') {
    return uniqueKeywords([
      `${marketName} latest result`,
      `${marketName} history`,
      `${marketName} lottery prediction`,
      `${marketName} number analysis`,
    ])
  }

  return uniqueKeywords([
    `ผล${marketName}`,
    `ผล${compactName}`,
    `${marketName}ย้อนหลัง`,
    `${compactName}ย้อนหลัง`,
    `ตรวจ${marketName}`,
    `ตรวจ${compactName}`,
    `เลข${marketName}เด็ดงวดนี้`,
    `เลข${compactName}เด็ดงวดนี้`,
    `เลข${marketName}ที่จะออกงวดนี้`,
    `เลข${compactName}ที่จะออกงวดนี้`,
    `เลขเด็ด${marketName}`,
    `เลขเด็ด${compactName}`,
    `แนวทาง${marketName}`,
    `สูตรคำนวณ${marketName}`,
    `วิเคราะห์${marketName}`,
    `สถิติ${marketName}`,
    `${marketName} 3 ตัวบน`,
    `${marketName} 2 ตัวบน`,
    `${marketName} 2 ตัวล่าง`,
  ])
}

function uniqueKeywords(keywords: string[]) {
  return [...new Set(keywords.filter(Boolean))]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, id } = await params
  if (!isSeoLang(lang)) return { title: 'Not found', robots: { index: false, follow: false } }

  try {
    const detail = await fetchMarketResults(id, lang)
    const market = detail.data?.market
    if (!market) throw new Error('Market not found')
    if (isHiddenLotteryMarket(market)) {
      return { title: 'Not found', robots: { index: false, follow: false } }
    }

    const title = marketHistoryTitle(market.name, lang)
    const description = marketHistoryDescription(market.name, undefined, lang)
    const path = localizedPath(marketPath(id), lang)

    return {
      title,
      description,
      keywords: [...siteKeywords, ...marketSeoKeywords(market.name, lang as Lang)],
      alternates: { canonical: path, languages: languageAlternates(marketPath(id)) },
      openGraph: baseOpenGraph(path, title, description),
      twitter: baseTwitter(title, description),
      robots: { index: true, follow: true },
    }
  } catch {
    return { title: lang === 'zh' ? '彩票历史结果' : 'ผลหวยย้อนหลัง', description: lang === 'zh' ? '查看最新彩票结果和历史记录' : 'ตรวจผลหวยล่าสุดและย้อนหลัง', robots: { index: true, follow: true } }
  }
}

export default async function LangMarketPage({ params, searchParams }: PageProps) {
  const { lang, id } = await params
  const { page } = (await searchParams) ?? {}
  if (!isSeoLang(lang)) notFound()
  const currentLang = lang as Lang
  const historyPage = parseHistoryPage(page)
  let detail
  try {
    detail = await fetchMarketResults(id, currentLang, { page: historyPage, limit: HISTORY_PAGE_SIZE })
  } catch {
    notFound()
  }

  const market = detail.data?.market
  if (!market) notFound()
  if (isHiddenLotteryMarket(market)) notFound()

  const analysisDetail = await fetchMarketResults(id, currentLang, { page: 1, limit: 80 }).catch(() => null)

  const history = detail.data?.history ?? []
  const pagination = detail.data?.pagination
  const historyPositionOffset = pagination
    ? (Math.max(1, pagination.page) - 1) * pagination.limit
    : (historyPage - 1) * HISTORY_PAGE_SIZE
  const t = DICT[currentLang]
  const title = marketHistoryTitle(market.name, currentLang)
  const description = marketHistoryDescription(market.name, market.group_name, currentLang)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    url: absoluteUrl(localizedPath(marketPath(id), currentLang)),
    inLanguage: LANG_LOCALE[currentLang],
    description,
    isPartOf: { '@type': 'WebSite', name: siteName, url: absoluteUrl('/'), alternateName: 'ตรวจหวย' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: pagination?.total ?? history.length,
      itemListElement: history.map((result, index) => ({
        '@type': 'ListItem',
        position: historyPositionOffset + index + 1,
        name: `${market.name} ${formatSeoDate(result.draw_date, currentLang)}`,
        description: resultSummary(result, currentLang),
      })),
    },
  }
  const breadcrumbLd = breadcrumbJsonLd([
    { name: t.home, item: localizedPath('/', currentLang) },
    { name: market.group_name },
    { name: market.name, item: localizedPath(marketPath(id), currentLang) },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(currentLang)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="breadcrumbs-row">
        <Breadcrumbs items={[
          { href: localizedPath('/', currentLang), label: t.home },
          { label: market.group_name },
          { label: market.name },
        ]} />
        <LangSwitcher lang={currentLang} />
      </div>

      <main className="market-page">
        <MarketDetailPanel
          market={{
            market_id: market.id,
            market_name: title,
            market_logo: market.logo,
          }}
          detail={detail}
          accentColor="#d4af37"
          accentHighlight="#f5d060"
          t={t}
          lang={currentLang}
          backHref={localizedPath('/', currentLang)}
          historyPage={historyPage}
          historyPageHref={(page) => historyPagePath(id, currentLang, page)}
          analysisHistory={analysisDetail?.data?.history}
        />
        <MarketSeoContent marketName={market.name} groupName={market.group_name} lang={currentLang} />
      </main>

      <LotterySeoContent currentDate={todayBangkok()} lang={currentLang} />
    </>
  )
}

function MarketSeoContent({ marketName, groupName, lang }: { marketName: string; groupName: string; lang: Lang }) {
  const compactName = compactMarketName(marketName)
  const keywords = marketSeoKeywords(marketName, 'th').slice(6)

  if (lang !== 'th') {
    return (
      <section className="market-seo-content" aria-label={`${marketName} lottery analysis`}>
        <h2>{marketName} latest results, statistics, and number analysis</h2>
        <p>
          Follow the latest {marketName} result with recent history, top 3, top 2, bottom 2,
          repeated pairs, frequency charts, and statistical number ideas for personal tracking.
        </p>
      </section>
    )
  }

  return (
    <section className="market-seo-content" aria-label={`ข้อมูล SEO ${marketName}`}>
      <div className="market-seo-copy">
        <h2>เลข{compactName}เด็ดงวดนี้ พร้อมสถิติย้อนหลัง</h2>
        <p>
          หน้านี้รวมผล{marketName}ล่าสุด ผลย้อนหลัง และแนวทางเลขเด็ด{marketName}
          สำหรับคนที่ต้องการดูสถิติก่อนเลือกเลขงวดนี้ ทั้ง 3 ตัวบน 2 ตัวบน และ 2 ตัวล่าง
          โดยระบบช่วยสรุปความถี่เลขเด่น คู่เลขที่ออกซ้ำ และกราฟแนวโน้มจากข้อมูลย้อนหลังของ{groupName}
        </p>

        <h3>เลข{compactName}ที่จะออกงวดนี้ ดูจากอะไร</h3>
        <p>
          การวิเคราะห์เลข{marketName}ที่จะออกงวดนี้ใช้ข้อมูลย้อนหลังหลายงวดมาจัดกลุ่มเลขเด่น
          เปรียบเทียบเลขที่กลับมาออกซ้ำ และคำนวณชุดเลขตามสถิติ เพื่อใช้เป็นแนวทางประกอบการตัดสินใจเท่านั้น
          ผลหวยยังเป็นการสุ่ม ไม่มีสูตรใดรับประกันผลรางวัลได้
        </p>
      </div>

      <div className="market-seo-keywords" aria-label={`คำค้นหา ${marketName}`}>
        {keywords.map(keyword => (
          <span key={keyword}>{keyword}</span>
        ))}
      </div>
    </section>
  )
}
