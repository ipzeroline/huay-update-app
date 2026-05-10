import Link from 'next/link'
import Breadcrumbs from '@/app/breadcrumbs'
import { todayBangkok } from '@/lib/lottery-api'
import type { Lang } from '@/lib/i18n'
import { formatSeoDate, localizedPath, lotteryGroups } from '@/lib/seo'
import { getLotterySeoPage, lotterySeoPages, type LotterySeoSlug } from '@/lib/lottery-seo-pages'

const topicCopy: Record<Lang, {
  home: string
  todayResults: string
  allResults: string
  relatedLinks: string
  relatedCategories: string
  morePages: string
  faq: string
  groupLabels: Record<string, string>
}> = {
  th: {
    home: 'หน้าแรก',
    todayResults: 'ตรวจผลหวยวันนี้',
    allResults: 'ผลหวยทั้งหมด',
    relatedLinks: 'ลิงก์ผลหวยที่เกี่ยวข้อง',
    relatedCategories: 'ประเภทหวยที่เกี่ยวข้อง',
    morePages: 'หน้าข้อมูลหวยเพิ่มเติม',
    faq: 'คำถามที่พบบ่อย',
    groupLabels: { 'lotto-thai': 'หวยไทย', 'lotto-foreign': 'หวยต่างประเทศ', 'lotto-stock': 'หวยหุ้น', 'lotto-daily': 'หวยรายวัน' },
  },
  en: {
    home: 'Home',
    todayResults: 'Check today results',
    allResults: 'All lottery results',
    relatedLinks: 'Related lottery links',
    relatedCategories: 'Related categories',
    morePages: 'More SEO pages',
    faq: 'Frequently Asked Questions',
    groupLabels: { 'lotto-thai': 'Thai Lottery', 'lotto-foreign': 'Foreign Lottery', 'lotto-stock': 'Stock Lottery', 'lotto-daily': 'Daily Lottery' },
  },
  la: {
    home: 'ໜ້າຫຼັກ',
    todayResults: 'ກວດຜົນຫວຍມື້ນີ້',
    allResults: 'ຜົນຫວຍທັງໝົດ',
    relatedLinks: 'ລິ້ງຜົນຫວຍທີ່ກ່ຽວຂ້ອງ',
    relatedCategories: 'ປະເພດຫວຍທີ່ກ່ຽວຂ້ອງ',
    morePages: 'ໜ້າຂໍ້ມູນຫວຍເພີ່ມເຕີມ',
    faq: 'ຄໍາຖາມທີ່ພົບເລື້ອຍ',
    groupLabels: { 'lotto-thai': 'ຫວຍໄທ', 'lotto-foreign': 'ຫວຍຕ່າງປະເທດ', 'lotto-stock': 'ຫວຍຫຸ້ນ', 'lotto-daily': 'ຫວຍລາຍວັນ' },
  },
  kh: {
    home: 'ទំព័រដើម',
    todayResults: 'ពិនិត្យលទ្ធផលថ្ងៃនេះ',
    allResults: 'លទ្ធផលឆ្នោតទាំងអស់',
    relatedLinks: 'តំណលទ្ធផលឆ្នោតពាក់ព័ន្ធ',
    relatedCategories: 'ប្រភេទពាក់ព័ន្ធ',
    morePages: 'ទំព័រព័ត៌មានបន្ថែម',
    faq: 'សំណួរដែលសួរញឹកញាប់',
    groupLabels: { 'lotto-thai': 'ឆ្នោតថៃ', 'lotto-foreign': 'ឆ្នោតបរទេស', 'lotto-stock': 'ឆ្នោតហ៊ុន', 'lotto-daily': 'ឆ្នោតប្រចាំថ្ងៃ' },
  },
  zh: {
    home: '首页',
    todayResults: '查看今日结果',
    allResults: '全部彩票结果',
    relatedLinks: '相关彩票链接',
    relatedCategories: '相关分类',
    morePages: '更多彩票信息页',
    faq: '常见问题',
    groupLabels: { 'lotto-thai': '泰国彩票', 'lotto-foreign': '国外彩票', 'lotto-stock': '股票彩票', 'lotto-daily': '每日彩票' },
  },
}

export default function LotteryTopicPage({ lang, slug }: { lang: Lang; slug: LotterySeoSlug }) {
  const page = getLotterySeoPage(slug, lang)
  if (!page) return null

  const today = todayBangkok()
  const copy = topicCopy[lang]
  const siblingPages = Object.keys(lotterySeoPages).filter(item => item !== slug)

  return (
    <main className="lottery-topic-page">
      <Breadcrumbs items={[
        { href: localizedPath('/', lang), label: copy.home },
        { label: page.h1 },
      ]} />

      <section className="lottery-topic-hero">
        <div>
          <p className="lottery-topic-kicker">Huay Update</p>
          <h1>{page.h1}</h1>
          <p>{page.intro}</p>
          <div className="lottery-topic-actions">
            <Link href={localizedPath(`/lottery/${today}`, lang)}>
              {copy.todayResults}
            </Link>
            <Link href={localizedPath('/', lang)}>
              {copy.allResults}
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

      <section className="lottery-topic-links" aria-label={copy.relatedLinks}>
        <div>
          <h2>{copy.relatedCategories}</h2>
          <div>
            {lotteryGroups.map(group => (
              <Link key={group.code} href={localizedPath(`/lottery/group/${group.code}`, lang)}>
                {copy.groupLabels[group.code] ?? group.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2>{copy.morePages}</h2>
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
        <h2>{copy.faq}</h2>
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
