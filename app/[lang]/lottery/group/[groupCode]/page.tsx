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
  getLotteryGroup,
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
  params: Promise<{ lang: string; groupCode: string }>
}

function groupPath(groupCode: string) {
  return `/lottery/group/${groupCode}`
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, groupCode } = await params
  const group = getLotteryGroup(groupCode)
  if (!isSeoLang(lang) || !group) {
    return { title: 'Not found', robots: { index: false, follow: false } }
  }

  const path = localizedPath(groupPath(groupCode), lang)
  const title = localizedLotteryGroupTitle(groupCode, lang)
  const description = localizedLotteryGroupDescription(groupCode, lang)
  return {
    title,
    description,
    keywords: [...siteKeywords, ...group.keywords],
    alternates: { canonical: path, languages: languageAlternates(groupPath(groupCode)) },
    openGraph: baseOpenGraph(path, title, description),
    twitter: baseTwitter(title, description),
    robots: { index: true, follow: true },
  }
}

export default async function LangLotteryGroupPage({ params }: PageProps) {
  const { lang, groupCode } = await params
  if (!isSeoLang(lang)) notFound()
  const currentLang = lang as Lang
  const groupMeta = getLotteryGroup(groupCode)
  if (!groupMeta) notFound()
  const groupName = lotteryGroupName(groupCode, currentLang)

  const t = DICT[currentLang]
  const date = todayBangkok()
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
    name: localizedLotteryGroupTitle(groupCode, currentLang),
    url: absoluteUrl(localizedPath(groupPath(groupCode), currentLang)),
    inLanguage: LANG_LOCALE[currentLang],
    description: localizedLotteryGroupDescription(groupCode, currentLang),
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
    { name: groupName, item: localizedPath(groupPath(groupCode), currentLang) },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(currentLang)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Breadcrumbs items={[
        { href: localizedPath('/', currentLang), label: t.home },
        { label: groupName },
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
