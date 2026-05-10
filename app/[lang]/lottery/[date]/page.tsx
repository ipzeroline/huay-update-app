import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/app/breadcrumbs'
import LotteryApp from '@/app/lottery-client'
import LotterySeoContent, { faqJsonLd } from '@/app/lottery-seo-content'
import LotteryTopicPage from '@/app/lottery-topic-page'
import { fetchLotteryByDate, todayBangkok, type LotteryByDateResponse } from '@/lib/lottery-api'
import { DICT, LANG_LOCALE, type Lang } from '@/lib/i18n'
import { getLotterySeoPage, isLotterySeoSlug } from '@/lib/lottery-seo-pages'
import {
  absoluteUrl,
  baseOpenGraph,
  baseTwitter,
  breadcrumbJsonLd,
  isIsoDate,
  isSeoLang,
  languageAlternates,
  localizedPath,
  lotteryPageDescription,
  lotteryPageTitle,
  siteKeywords,
  siteName,
} from '@/lib/seo'

export const revalidate = 60

type PageProps = {
  params: Promise<{ lang: string; date: string }>
}

function isFutureDate(date: string): boolean {
  return date > todayBangkok()
}

function datePath(date: string) {
  return `/lottery/${date}`
}

function topicPath(slug: string) {
  return `/lottery/${slug}`
}

function faqPageJsonLd(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, date } = await params
  if (!isSeoLang(lang)) {
    return {
      title: 'Not found',
      robots: { index: false, follow: false },
    }
  }

  if (!isIsoDate(date)) {
    const topic = getLotterySeoPage(date, lang)
    if (!topic) {
      return {
        title: 'Not found',
        robots: { index: false, follow: false },
      }
    }

    const path = localizedPath(topicPath(date), lang)
    return {
      title: topic.title,
      description: topic.description,
      keywords: [...siteKeywords, ...topic.keywords],
      alternates: {
        canonical: path,
        languages: languageAlternates(topicPath(date)),
      },
      openGraph: baseOpenGraph(path, topic.title, topic.description),
      twitter: baseTwitter(topic.title, topic.description),
      robots: { index: true, follow: true },
    }
  }

  if (isFutureDate(date)) {
    return {
      title: 'Not found',
      robots: { index: false, follow: false },
    }
  }

  const path = localizedPath(datePath(date), lang)
  const title = lotteryPageTitle(date, lang)
  const description = lotteryPageDescription(date, lang)

  return {
    title: lang === 'th' ? { absolute: title } : title,
    description,
    keywords: siteKeywords,
    alternates: {
      canonical: path,
      languages: languageAlternates(datePath(date)),
    },
    openGraph: baseOpenGraph(path, title, description),
    twitter: baseTwitter(title, description),
    robots: { index: true, follow: true },
  }
}

export default async function LangLotteryDatePage({ params }: PageProps) {
  const { lang, date } = await params
  if (!isSeoLang(lang)) notFound()

  const currentLang = lang as Lang
  const currentDict = DICT[currentLang]
  if (!isIsoDate(date)) {
    if (!isLotterySeoSlug(date)) notFound()
    const topic = getLotterySeoPage(date, currentLang)
    if (!topic) notFound()

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: topic.title,
      description: topic.description,
      inLanguage: LANG_LOCALE[currentLang],
      url: absoluteUrl(localizedPath(topicPath(date), currentLang)),
      publisher: {
        '@type': 'Organization',
        name: siteName,
        url: absoluteUrl('/'),
      },
    }
    const breadcrumbLd = breadcrumbJsonLd([
      { name: currentDict.home, item: localizedPath('/', currentLang) },
      { name: topic.h1, item: localizedPath(topicPath(date), currentLang) },
    ])

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(topic.faq)) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <LotteryTopicPage lang={currentLang} slug={date} />
      </>
    )
  }

  if (isFutureDate(date)) notFound()

  const t = currentDict
  let initialData: LotteryByDateResponse | null = null
  try {
    initialData = await fetchLotteryByDate(date, currentLang)
  } catch {
    initialData = null
  }

  const groups = initialData?.data?.groups ?? []
  const allMarkets = groups.flatMap(g => g.markets)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: lotteryPageTitle(date, currentLang),
    url: absoluteUrl(localizedPath(datePath(date), currentLang)),
    inLanguage: LANG_LOCALE[currentLang],
    description: lotteryPageDescription(date, currentLang),
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: absoluteUrl('/'),
      alternateName: 'ตรวจหวย',
    },
    dateModified: date,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allMarkets.length,
      itemListElement: allMarkets.map((m, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: m.market_name,
        item: {
          '@type': 'Thing',
          name: m.market_name,
          identifier: m.market_id,
          description: m.result?.result_number?.no_result
            ? t.noResult
            : `${t.top3} ${m.result?.result_top_3 ?? '-'} · ${t.top2} ${m.result?.result_top_2 ?? '-'} · ${t.bottom2} ${m.result?.result_bottom_2 ?? '-'}`,
        },
      })),
    },
  }
  const breadcrumbLd = breadcrumbJsonLd([
    { name: t.home, item: localizedPath('/', currentLang) },
    { name: lotteryPageTitle(date, currentLang), item: localizedPath(datePath(date), currentLang) },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(currentLang)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Breadcrumbs items={[
        { href: localizedPath('/', currentLang), label: t.home },
        { label: lotteryPageTitle(date, currentLang) },
      ]} />
      <LotteryApp
        initialData={initialData}
        initialDate={date}
        initialLang={currentLang}
        langPrefix={`/${currentLang}`}
      />
      <LotterySeoContent currentDate={date} lang={currentLang} markets={allMarkets} />
    </>
  )
}
