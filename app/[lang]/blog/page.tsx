import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/app/breadcrumbs'
import LangSwitcher from '@/app/lang-switcher'
import Adsterra300x250 from '@/components/Adsterra300x250'
import AdsterraNative from '@/components/AdsterraNative'
import { getAllArticles } from '@/lib/blog-articles'
import { type Lang } from '@/lib/i18n'
import {
  absoluteUrl,
  baseOpenGraph,
  baseTwitter,
  breadcrumbJsonLd,
  isSeoLang,
  localizedPath,
  siteName,
} from '@/lib/seo'

export const revalidate = 604800

const pagePath = '/blog'

const LIST_COPY: Record<Lang, { home: string; title: string; description: string }> = {
  th: { home: 'หน้าแรก', title: 'บทความหวย', description: 'รวมบทความเกี่ยวกับหวยทุกประเภท หวยลาว หวยฮานอย หวยไทย และตารางเวลาออกผล' },
  en: { home: 'Home', title: 'Lottery Articles', description: 'Articles about lottery types — Lao, Hanoi, Thai lottery, and result time tables.' },
  la: { home: 'ໜ້າຫຼັກ', title: 'ບົດຄວາມຫວຍ', description: 'ຮວມບົດຄວາມກ່ຽວກັບຫວຍທຸກປະເພດ' },
  kh: { home: 'ទំព័រដើម', title: 'អត្ថបទឆ្នោត', description: 'អត្ថបទអំពីឆ្នោតគ្រប់ប្រភេទ' },
  zh: { home: '首页', title: '彩票文章', description: '关于各类彩票的文章' },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  if (!isSeoLang(lang)) return { title: 'Not found', robots: { index: false, follow: false } }
  const copy = LIST_COPY[lang]
  const canonical = localizedPath(pagePath, lang)
  const title = `${copy.title} | ${siteName}`
  return {
    title,
    description: copy.description,
    alternates: { canonical },
    openGraph: baseOpenGraph(canonical, title, copy.description),
    twitter: baseTwitter(title, copy.description),
    robots: lang === 'th' ? { index: true, follow: true } : { index: false, follow: true },
  }
}

type PageProps = { params: Promise<{ lang: string }> }

export default async function BlogListPage({ params }: PageProps) {
  const { lang } = await params
  if (!isSeoLang(lang)) notFound()
  const currentLang = lang as Lang
  const copy = LIST_COPY[currentLang]
  const articles = getAllArticles()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: copy.title,
    url: absoluteUrl(localizedPath(pagePath, currentLang)),
    inLanguage: 'th-TH',
    description: copy.description,
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: absoluteUrl('/'),
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: articles.length,
      itemListElement: articles.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(localizedPath(`/blog/${a.slug}`, currentLang)),
        name: a.title,
      })),
    },
  }

  const breadcrumbLd = breadcrumbJsonLd([
    { name: copy.home, item: localizedPath('/', currentLang) },
    { name: copy.title, item: localizedPath(pagePath, currentLang) },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="breadcrumbs-row">
        <Breadcrumbs items={[
          { href: localizedPath('/', currentLang), label: copy.home },
          { label: copy.title },
        ]} />
        <LangSwitcher lang={currentLang} />
      </div>

      <main className="lottery-topic-page">
        <section className="lottery-topic-hero">
          <div>
            <p className="lottery-topic-kicker">Huay Update</p>
            <h1>{copy.title}</h1>
            <p>{copy.description}</p>
          </div>
        </section>

        <Adsterra300x250 />

        <section className="lottery-topic-grid" style={{ marginTop: 12 }}>
          {articles.map(article => (
            <Link
              key={article.slug}
              href={localizedPath(`/blog/${article.slug}`, currentLang)}
              className="blog-card"
              style={{ textDecoration: 'none' }}
            >
              <article className="lottery-topic-card">
                <h2>{article.title}</h2>
                <p>{article.description}</p>
                <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.82rem', color: 'var(--text-3)',
                  }}>
                    {new Date(article.date).toLocaleDateString('th-TH', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                  <span style={{
                    fontSize: '0.78rem', color: 'var(--gold-light)',
                    padding: '2px 8px', borderRadius: 999,
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.18)',
                  }}>
                    {article.category}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </section>

        <AdsterraNative />
      </main>
    </>
  )
}
