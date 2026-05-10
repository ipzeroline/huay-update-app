import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/app/breadcrumbs'
import LotteryApp from '@/app/lottery-client'
import LotterySeoContent, { faqJsonLd } from '@/app/lottery-seo-content'
import { fetchLotteryByDate, todayBangkok, type LotteryByDateResponse } from '@/lib/lottery-api'
import { DICT, LANG_LOCALE, type Lang } from '@/lib/i18n'
import {
  absoluteUrl,
  baseOpenGraph,
  baseTwitter,
  breadcrumbJsonLd,
  formatSeoDate,
  getLotteryGroup,
  isIsoDate,
  isSeoLang,
  languageAlternates,
  localizedLotteryGroupDescription,
  localizedLotteryGroupTitle,
  lotteryGroupName,
  localizedPath,
  siteKeywords,
  siteName,
} from '@/lib/seo'

export const revalidate = 60

type PageProps = {
  params: Promise<{ lang: string; groupCode: string; date: string }>
}

function groupDatePath(groupCode: string, date: string) {
  return `/lottery/group/${groupCode}/${date}`
}

function isFutureDate(date: string): boolean {
  return date > todayBangkok()
}

function drawDateTitle(title: string, date: string, lang: Lang) {
  if (lang === 'en') return `${title} for ${formatSeoDate(date, lang)}`
  if (lang === 'la') return `${title} ງວດວັນທີ ${formatSeoDate(date, lang)}`
  if (lang === 'kh') return `${title} ថ្ងៃទី ${formatSeoDate(date, lang)}`
  if (lang === 'zh') return `${title} ${formatSeoDate(date, lang)}`
  return `${title} งวดวันที่ ${formatSeoDate(date, lang)}`
}

function drawDateDescription(description: string, date: string, lang: Lang) {
  if (lang === 'en') return `${description} for ${formatSeoDate(date, lang)}.`
  if (lang === 'la') return `${description} ສໍາລັບງວດວັນທີ ${formatSeoDate(date, lang)}`
  if (lang === 'kh') return `${description} សម្រាប់ថ្ងៃទី ${formatSeoDate(date, lang)}`
  if (lang === 'zh') return `${description} 日期：${formatSeoDate(date, lang)}。`
  return `${description} สำหรับงวดวันที่ ${formatSeoDate(date, lang)}`
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, groupCode, date } = await params
  const group = getLotteryGroup(groupCode)
  if (!isSeoLang(lang) || !group || !isIsoDate(date) || isFutureDate(date)) {
    return { title: 'Not found', robots: { index: false, follow: false } }
  }

  const path = localizedPath(groupDatePath(groupCode, date), lang)
  const title = drawDateTitle(localizedLotteryGroupTitle(groupCode, lang), date, lang)
  const description = drawDateDescription(localizedLotteryGroupDescription(groupCode, lang), date, lang)
  return {
    title,
    description,
    keywords: [...siteKeywords, ...group.keywords],
    alternates: { canonical: path, languages: languageAlternates(groupDatePath(groupCode, date)) },
    openGraph: baseOpenGraph(path, title, description),
    twitter: baseTwitter(title, description),
    robots: { index: true, follow: true },
  }
}

export default async function LangLotteryGroupDatePage({ params }: PageProps) {
  const { lang, groupCode, date } = await params
  if (!isSeoLang(lang) || !isIsoDate(date) || isFutureDate(date)) notFound()
  const currentLang = lang as Lang
  const groupMeta = getLotteryGroup(groupCode)
  if (!groupMeta) notFound()
  const groupName = lotteryGroupName(groupCode, currentLang)

  const t = DICT[currentLang]
  let initialData: LotteryByDateResponse | null = null
  try {
    const response = await fetchLotteryByDate(date, currentLang)
    initialData = {
      ...response,
      data: response.data ? {
        ...response.data,
        groups: response.data.groups.filter(group => group.group_code === groupCode),
      } : response.data,
    }
  } catch {
    initialData = null
  }

  const groups = initialData?.data?.groups ?? []
  const allMarkets = groups.flatMap(group => group.markets)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: drawDateTitle(localizedLotteryGroupTitle(groupCode, currentLang), date, currentLang),
    url: absoluteUrl(localizedPath(groupDatePath(groupCode, date), currentLang)),
    inLanguage: LANG_LOCALE[currentLang],
    description: drawDateDescription(localizedLotteryGroupDescription(groupCode, currentLang), date, currentLang),
    isPartOf: { '@type': 'WebSite', name: siteName, url: absoluteUrl('/'), alternateName: 'ตรวจหวย' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allMarkets.length,
      itemListElement: allMarkets.map((market, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: market.market_name,
        item: {
          '@type': 'Thing',
          name: market.market_name,
          identifier: market.market_id,
          description: market.result?.result_number?.no_result
            ? t.noResult
            : `${t.top3} ${market.result?.result_top_3 ?? '-'} · ${t.top2} ${market.result?.result_top_2 ?? '-'} · ${t.bottom2} ${market.result?.result_bottom_2 ?? '-'}`,
        },
      })),
    },
  }
  const breadcrumbLd = breadcrumbJsonLd([
    { name: t.home, item: localizedPath('/', currentLang) },
    { name: groupName, item: localizedPath(`/lottery/group/${groupCode}`, currentLang) },
    { name: formatSeoDate(date, currentLang), item: localizedPath(groupDatePath(groupCode, date), currentLang) },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(currentLang)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Breadcrumbs items={[
        { href: localizedPath('/', currentLang), label: t.home },
        { href: localizedPath(`/lottery/group/${groupCode}`, currentLang), label: groupName },
        { label: formatSeoDate(date, currentLang) },
      ]} />
      <LotteryApp
        initialData={initialData}
        initialDate={date}
        initialLang={currentLang}
        groupCode={groupCode}
        groupName={groupName}
        langPrefix={`/${currentLang}`}
      />
      <LotterySeoContent currentDate={date} lang={currentLang} markets={allMarkets} />
    </>
  )
}
