import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'
import { fetchLotteryByDate, todayBangkok } from '@/lib/lottery-api'
import { localizedMarketPath } from '@/lib/market-url'
import { localizedPath, lotteryGroups, seoLangs } from '@/lib/seo'
import { getAllArticles } from '@/lib/blog-articles'
import { lotterySeoPages } from '@/lib/lottery-seo-pages'

function addDays(date: string, amount: number): string {
  const d = new Date(`${date}T12:00:00`)
  d.setDate(d.getDate() + amount)
  return d.toISOString().slice(0, 10)
}

const STATIC_LASTMOD = new Date('2026-05-01T00:00:00+07:00')

// ── Sitemap Index ──────────────────────────────────────────────
export async function generateSitemaps() {
  return [
    { id: 'daily' },
    { id: 'markets' },
    { id: 'groups' },
    { id: 'static' },
  ]
}

export default async function sitemap({
  id,
}: {
  id: string
}): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl().replace(/\/$/, '')
  const today = todayBangkok()
  const groupToday = new Date(`${today}T12:00:00+07:00`)
  const dailyDates = Array.from({ length: 90 }, (_, i) => addDays(today, -i))

  switch (id) {
    // ── daily: date-based lottery pages (90 days × 5 langs) ──
    case 'daily': {
      const urls: MetadataRoute.Sitemap = []
      for (const lang of seoLangs) {
        const isPrimary = lang === 'th'
        for (const date of dailyDates) {
          const lastmod = new Date(`${date}T12:00:00+07:00`)
          urls.push({
            url: `${siteUrl}${localizedPath(`/lottery/${date}`, lang)}`,
            lastModified: lastmod,
            changeFrequency: 'daily',
            priority: isPrimary ? (date === today ? 0.95 : 0.8) : 0.68,
          })
          // group × date variants
          for (const group of lotteryGroups) {
            urls.push({
              url: `${siteUrl}${localizedPath(`/lottery/group/${group.code}/${date}`, lang)}`,
              lastModified: lastmod,
              changeFrequency: 'daily',
              priority: isPrimary ? 0.72 : 0.58,
            })
          }
        }
      }
      return urls
    }

    // ── markets: individual market detail pages ─────────────────
    case 'markets': {
      const urls: MetadataRoute.Sitemap = []
      try {
        const response = await fetchLotteryByDate(today, 'th')
        const markets = response.data?.groups.flatMap(g => g.markets) ?? []
        for (const lang of seoLangs) {
          const isPrimary = lang === 'th'
          for (const market of markets) {
            const lastResultDate = market.result?.draw_date
            urls.push({
              url: `${siteUrl}${localizedMarketPath(market.market_id, market.market_name, lang)}`,
              lastModified: lastResultDate
                ? new Date(`${lastResultDate}T12:00:00+07:00`)
                : groupToday,
              changeFrequency: 'daily',
              priority: isPrimary ? 0.82 : 0.66,
            })
          }
        }
      } catch { /* skip market URLs if API fails */ }
      return urls
    }

    // ── groups: home + group index + group×date ──────────────
    case 'groups': {
      const urls: MetadataRoute.Sitemap = []
      for (const lang of seoLangs) {
        const isPrimary = lang === 'th'
        // home page
        urls.push({
          url: `${siteUrl}${localizedPath('/', lang)}`,
          lastModified: groupToday,
          changeFrequency: 'hourly',
          priority: isPrimary ? 0.98 : 0.86,
        })
        // group index pages
        for (const group of lotteryGroups) {
          urls.push({
            url: `${siteUrl}${localizedPath(`/lottery/group/${group.code}`, lang)}`,
            lastModified: groupToday,
            changeFrequency: 'hourly',
            priority: isPrimary ? 0.9 : 0.76,
          })
        }
      }
      return urls
    }

    // ── static: guide, formula, lucky-numbers, topic/SEO pages ──
    case 'static': {
      const urls: MetadataRoute.Sitemap = []
      for (const lang of seoLangs) {
        const isPrimary = lang === 'th'
        urls.push(
          {
            url: `${siteUrl}${localizedPath('/guide', lang)}`,
            lastModified: STATIC_LASTMOD,
            changeFrequency: 'weekly',
            priority: isPrimary ? 0.8 : 0.66,
          },
          {
            url: `${siteUrl}${localizedPath('/lottery-formula', lang)}`,
            lastModified: STATIC_LASTMOD,
            changeFrequency: 'monthly',
            priority: isPrimary ? 0.72 : 0.58,
          },
          {
            url: `${siteUrl}${localizedPath('/lucky-numbers', lang)}`,
            lastModified: groupToday,
            changeFrequency: 'daily',
            priority: isPrimary ? 0.78 : 0.64,
          },
        )
        // topic/SEO pages
        for (const slug of Object.keys(lotterySeoPages)) {
          urls.push({
            url: `${siteUrl}${localizedPath(`/lottery/${slug}`, lang)}`,
            lastModified: STATIC_LASTMOD,
            changeFrequency: 'weekly',
            priority: isPrimary ? 0.78 : 0.64,
          })
        }
        // blog listing + articles
        urls.push({
          url: `${siteUrl}${localizedPath('/blog', lang)}`,
          lastModified: STATIC_LASTMOD,
          changeFrequency: 'weekly',
          priority: isPrimary ? 0.76 : 0.62,
        })
        for (const article of getAllArticles()) {
          urls.push({
            url: `${siteUrl}${localizedPath(`/blog/${article.slug}`, lang)}`,
            lastModified: new Date(`${article.date}T12:00:00+07:00`),
            changeFrequency: 'monthly',
            priority: isPrimary ? 0.7 : 0.56,
          })
        }
      }
      return urls
    }

    default:
      return []
  }
}
