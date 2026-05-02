import Link from 'next/link'
import Breadcrumbs from '@/app/breadcrumbs'
import { todayBangkok } from '@/lib/lottery-api'
import type { Lang } from '@/lib/i18n'
import { formatSeoDate, localizedPath, lotteryGroups } from '@/lib/seo'
import { getLotterySeoPage, lotterySeoPages, type LotterySeoSlug } from '@/lib/lottery-seo-pages'

export default function LotteryTopicPage({ lang, slug }: { lang: Lang; slug: LotterySeoSlug }) {
  const page = getLotterySeoPage(slug, lang)
  if (!page) return null

  const today = todayBangkok()
  const siblingPages = Object.keys(lotterySeoPages).filter(item => item !== slug)

  return (
    <main className="lottery-topic-page">
      <Breadcrumbs items={[
        { href: localizedPath('/', lang), label: lang === 'en' ? 'Home' : 'หน้าแรก' },
        { label: page.h1 },
      ]} />

      <section className="lottery-topic-hero">
        <div>
          <p className="lottery-topic-kicker">Huay Update</p>
          <h1>{page.h1}</h1>
          <p>{page.intro}</p>
          <div className="lottery-topic-actions">
            <Link href={localizedPath(`/lottery/${today}`, lang)}>
              {lang === 'en' ? 'Check today results' : 'ตรวจผลหวยวันนี้'}
            </Link>
            <Link href={localizedPath('/', lang)}>
              {lang === 'en' ? 'All lottery results' : 'ผลหวยทั้งหมด'}
            </Link>
          </div>
        </div>
        <aside>
          <span>{formatSeoDate(today, lang)}</span>
          <strong>{page.title}</strong>
        </aside>
      </section>

      <section className="lottery-topic-grid">
        {page.sections.map(section => (
          <article key={section.heading} className="lottery-topic-card">
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>

      <section className="lottery-topic-links" aria-label="ลิงก์ผลหวยที่เกี่ยวข้อง">
        <div>
          <h2>{lang === 'en' ? 'Related categories' : 'ประเภทหวยที่เกี่ยวข้อง'}</h2>
          <div>
            {lotteryGroups.map(group => (
              <Link key={group.code} href={localizedPath(`/lottery/group/${group.code}`, lang)}>
                {group.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2>{lang === 'en' ? 'More SEO pages' : 'หน้าข้อมูลหวยเพิ่มเติม'}</h2>
          <div>
            {siblingPages.map(item => {
              const sibling = getLotterySeoPage(item, lang)
              return sibling ? (
                <Link key={item} href={localizedPath(`/lottery/${item}`, lang)}>
                  {sibling.h1}
                </Link>
              ) : null
            })}
          </div>
        </div>
      </section>

      <section className="lottery-topic-faq">
        <h2>{lang === 'en' ? 'Frequently Asked Questions' : 'คำถามที่พบบ่อย'}</h2>
        <div>
          {page.faq.map(item => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
