import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Breadcrumbs from '@/app/breadcrumbs'
import LangSwitcher from '@/app/lang-switcher'
import Adsterra300x250 from '@/components/Adsterra300x250'
import AdsterraNative from '@/components/AdsterraNative'
import { extractFaq, getArticle, getRelatedArticles } from '@/lib/blog-articles'
import { LANG_LOCALE, type Lang } from '@/lib/i18n'
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

type PageProps = { params: Promise<{ lang: string; slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isSeoLang(lang)) return { title: 'Not found', robots: { index: false, follow: false } }

  const article = getArticle(decodeURIComponent(slug))
  if (!article) return { title: 'Not found', robots: { index: false, follow: false } }

  const path = localizedPath(`/blog/${article.slug}`, lang)
  const title = `${article.title} | ${siteName}`

  return {
    title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: path },
    openGraph: baseOpenGraph(path, title, article.description),
    twitter: baseTwitter(title, article.description),
    // index เฉพาะภาษาไทยเท่านั้น
    robots: lang === 'th' ? { index: true, follow: true } : { index: false, follow: true },
  }
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { lang, slug } = await params
  if (!isSeoLang(lang)) notFound()

  const article = getArticle(decodeURIComponent(slug))
  if (!article) notFound()

  const currentLang = lang as Lang
  const related = getRelatedArticles(article.slug)
  const articleUrl = absoluteUrl(localizedPath(`/blog/${article.slug}`, currentLang))
  const faqs = extractFaq(article.content)

  // ── Article JSON-LD ──
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    inLanguage: 'th-TH',
    datePublished: article.date,
    dateModified: article.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    author: { '@type': 'Organization', name: siteName },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo.png'),
      },
    },
  }

  // ── FAQPage JSON-LD (extracted from article content) ──
  const faqLd = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null

  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'หน้าแรก', item: localizedPath('/', currentLang) },
    { name: 'บทความ', item: localizedPath('/blog', currentLang) },
    { name: article.title, item: localizedPath(`/blog/${article.slug}`, currentLang) },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="breadcrumbs-row">
        <Breadcrumbs items={[
          { href: localizedPath('/', currentLang), label: 'หน้าแรก' },
          { href: localizedPath('/blog', currentLang), label: 'บทความ' },
          { label: article.title },
        ]} />
        <LangSwitcher lang={currentLang} />
      </div>

      <main className="lottery-topic-page">
        <article
          className="blog-article"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <Adsterra300x250 />

        {related.length > 0 && (
          <section className="lottery-topic-links" style={{ marginTop: 24 }} aria-label="บทความที่เกี่ยวข้อง">
            <div>
              <h2>บทความที่เกี่ยวข้อง</h2>
              <div>
                {related.map(r => (
                  <Link key={r.slug} href={localizedPath(`/blog/${r.slug}`, currentLang)}>
                    {r.title}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2>บทความทั้งหมด</h2>
              <div>
                <Link href={localizedPath('/blog', currentLang)}>
                  ดูบทความทั้งหมด
                </Link>
              </div>
            </div>
          </section>
        )}

        <AdsterraNative />
      </main>
    </>
  )
}
