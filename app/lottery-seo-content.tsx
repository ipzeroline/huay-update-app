import Link from 'next/link'
import { formatSeoDate, localizedPath, lotteryGroups } from '@/lib/seo'
import type { Lang } from '@/lib/i18n'
import { getLotterySeoPage, lotterySeoPages } from '@/lib/lottery-seo-pages'

type SeoMarketLink = {
  market_id: number
  market_name: string
}

export const LOTTERY_FAQS = [
  {
    question: 'ตรวจหวย Huay Update อัปเดตผลเมื่อไหร่',
    answer: 'ระบบจะแสดงผลหวยตามวันที่เลือก และอัปเดตข้อมูลเป็นระยะเมื่อมีผลออกจากแหล่งข้อมูลของแต่ละตลาดหวย',
  },
  {
    question: 'ดูผลหวยย้อนหลังได้อย่างไร',
    answer: 'เลือกวันที่จากปฏิทิน หรือกดลิงก์ผลหวยย้อนหลังด้านล่างเพื่อเปิดหน้าผลหวยรายวันย้อนหลัง',
  },
  {
    question: 'มีผลหวยประเภทไหนบ้าง',
    answer: 'หน้าเว็บรวมผลหวยหลายกลุ่ม เช่น หวยไทย หวยต่างประเทศ หวยหุ้น และหวยรายวันที่มีข้อมูลในระบบ',
  },
  {
    question: 'เลขที่แสดงมีอะไรบ้าง',
    answer: 'แต่ละตลาดหวยจะแสดงเลขรางวัลตามข้อมูลที่มี เช่น 3 ตัวบน 2 ตัวบน 2 ตัวล่าง หรือรางวัลที่ 1 สำหรับบางตลาด',
  },
]

const SEO_COPY: Record<Lang, {
  aria: string
  introTitle: (date: string) => string
  intro: string
  typeTitle: string
  historyTitle: string
  topicTitle: string
  marketTitle: string
  marketLink: (name: string) => string
  faqTitle: string
  bottomTitle: string
  bottomIntro: string
  supportedTitle: string
  stockTitle: string
  stockText: string
  aseanTitle: string
  aseanText: string
  whyTitle: string
  whyText: string
  groupLabels: Record<string, string>
  faqs: typeof LOTTERY_FAQS
}> = {
  th: {
    aria: 'ข้อมูลตรวจหวยและผลหวยย้อนหลัง',
    introTitle: date => `ตรวจหวยย้อนหลังและผลหวยประจำวันที่ ${date}`,
    intro: 'Huay Update รวมผลหวยตามวันที่ ทั้งหวยไทย หวยต่างประเทศ หวยหุ้น และหวยรายวัน เพื่อให้ตรวจผลรางวัลได้จากหน้าเดียว พร้อมลิงก์ย้อนหลังแยกตามวันที่สำหรับค้นหาง่าย',
    typeTitle: 'เลือกดูตามประเภทหวย',
    historyTitle: 'ผลหวยย้อนหลัง',
    topicTitle: 'หน้าข้อมูลหวยเฉพาะ',
    marketTitle: 'ผลหวยแยกตามตลาด',
    marketLink: name => `ผล${name}ย้อนหลัง`,
    faqTitle: 'คำถามที่พบบ่อย',
    bottomTitle: 'ตรวจหวย Huay Update — ผลหวยล่าสุดวันนี้ ครบทุกประเภท',
    bottomIntro: 'รวมผลหวยล่าสุดครบทุกประเภท ทั้งหวยไทย หวยหุ้น และหวยต่างประเทศ อัปเดตรวดเร็ว แม่นยำ ทุกวัน ที่นี่ที่เดียว',
    supportedTitle: 'ผลหวยที่รองรับทั้งหมด',
    stockTitle: 'หวยหุ้นไทยและต่างประเทศ',
    stockText: 'ติดตามผลหวยหุ้นนิเคอิ ฮั่งเส็ง ดาวโจนส์ และหุ้นอื่นๆ ทั้งรอบเช้าและรอบบ่าย พร้อมผล 3 ตัวบน 2 ตัวบน และ 2 ตัวล่าง',
    aseanTitle: 'หวยลาวและหวยอาเซียน',
    aseanText: 'ครอบคลุมหวยลาว TV ลาวประตูชัย ลาวสันติภาพ ฮานอยอาเซียน และหวยรายวันอื่นๆ อีกมากมาย',
    whyTitle: 'ทำไมต้องตรวจหวยที่ Huay Update?',
    whyText: 'เราอัปเดตผลหวยอย่างรวดเร็ว ครอบคลุมมากกว่า 14 ประเภทต่อวัน ใช้งานง่ายผ่านมือถือและคอมพิวเตอร์ ไม่ต้องสมัครสมาชิก เข้าดูได้ทันที',
    groupLabels: { 'lotto-thai': 'ผลหวยไทยล่าสุด', 'lotto-foreign': 'ผลหวยต่างประเทศล่าสุด', 'lotto-stock': 'ผลหวยหุ้นล่าสุด', 'lotto-daily': 'ผลหวยรายวันล่าสุด' },
    faqs: LOTTERY_FAQS,
  },
  en: {
    aria: 'Lottery results and history information',
    introTitle: date => `Lottery history and daily results for ${date}`,
    intro: 'Huay Update collects lottery results by date across Thai lottery, foreign lottery, stock lottery and daily lottery, with date-based history links for quick lookup.',
    typeTitle: 'Browse by lottery type',
    historyTitle: 'Lottery history',
    topicTitle: 'Lottery guide pages',
    marketTitle: 'Results by market',
    marketLink: name => `${name} history`,
    faqTitle: 'Frequently Asked Questions',
    bottomTitle: 'Huay Update lottery results today',
    bottomIntro: 'Check latest lottery results across Thai, stock and foreign lottery markets with fast daily updates in one place.',
    supportedTitle: 'Supported lottery results',
    stockTitle: 'Thai and international stock lottery',
    stockText: 'Follow Nikkei, Hang Seng, Dow Jones and other stock lottery results for morning and afternoon rounds, including 3 top, 2 top and 2 bottom.',
    aseanTitle: 'Lao and ASEAN lottery',
    aseanText: 'Covers Lao TV, Lao Pratu Chai, Lao Santiphap, Hanoi ASEAN and many daily lottery markets.',
    whyTitle: 'Why check results on Huay Update?',
    whyText: 'We update results quickly, cover many lottery types each day, and make results easy to browse on mobile and desktop without an account.',
    groupLabels: { 'lotto-thai': 'Latest Thai Lottery Results', 'lotto-foreign': 'Latest Foreign Lottery Results', 'lotto-stock': 'Latest Stock Lottery Results', 'lotto-daily': 'Latest Daily Lottery Results' },
    faqs: [
      { question: 'When does Huay Update update results?', answer: 'Results appear by selected date and refresh when new data is available from each lottery market.' },
      { question: 'How can I view history?', answer: 'Choose a date from the calendar or use the history links below to open past daily result pages.' },
      { question: 'Which lottery types are included?', answer: 'The site includes several groups such as Thai lottery, foreign lottery, stock lottery and daily lottery markets.' },
      { question: 'What numbers are shown?', answer: 'Each market displays available fields such as 3 top, 2 top, 2 bottom or first prize for some markets.' },
    ],
  },
  la: {
    aria: 'ຂໍ້ມູນກວດຫວຍ ແລະຜົນຍ້ອນຫຼັງ',
    introTitle: date => `ກວດຫວຍຍ້ອນຫຼັງ ແລະຜົນປະຈຳວັນ ${date}`,
    intro: 'Huay Update ຮວມຜົນຫວຍຕາມວັນທີ ທັງຫວຍໄທ ຫວຍຕ່າງປະເທດ ຫວຍຫຸ້ນ ແລະຫວຍລາຍວັນ ພ້ອມລິ້ງຍ້ອນຫຼັງຕາມວັນທີ.',
    typeTitle: 'ເລືອກຕາມປະເພດຫວຍ',
    historyTitle: 'ຜົນຫວຍຍ້ອນຫຼັງ',
    topicTitle: 'ໜ້າຂໍ້ມູນຫວຍ',
    marketTitle: 'ຜົນຫວຍແຍກຕາມຕະຫຼາດ',
    marketLink: name => `ຜົນ${name}ຍ້ອນຫຼັງ`,
    faqTitle: 'ຄໍາຖາມທີ່ພົບເລື້ອຍ',
    bottomTitle: 'ກວດຫວຍ Huay Update ຜົນຫວຍມື້ນີ້',
    bottomIntro: 'ຮວມຜົນຫວຍລ່າສຸດຄົບຫຼາຍປະເພດ ອັບເດດໄວ ແລະກວດງ່າຍໃນບ່ອນດຽວ.',
    supportedTitle: 'ຜົນຫວຍທີ່ຮອງຮັບ',
    stockTitle: 'ຫວຍຫຸ້ນໄທ ແລະຕ່າງປະເທດ',
    stockText: 'ຕິດຕາມຜົນຫວຍຫຸ້ນ Nikkei Hang Seng Dow Jones ແລະຫຸ້ນອື່ນໆ ພ້ອມເລກ 3 ໂຕເທິງ 2 ໂຕເທິງ 2 ໂຕລຸ່ມ.',
    aseanTitle: 'ຫວຍລາວ ແລະຫວຍອາຊຽນ',
    aseanText: 'ຄອບຄຸມຫວຍລາວ TV ລາວປະຕູໄຊ ລາວສັນຕິພາບ Hanoi ASEAN ແລະຫວຍລາຍວັນອື່ນໆ.',
    whyTitle: 'ເປັນຫຍັງຕ້ອງກວດຫວຍທີ່ Huay Update?',
    whyText: 'ອັບເດດຜົນໄວ ຮອງຮັບຫຼາຍປະເພດຕໍ່ມື້ ໃຊ້ງານງ່າຍທັງມືຖື ແລະຄອມພິວເຕີ ບໍ່ຕ້ອງສະໝັກ.',
    groupLabels: { 'lotto-thai': 'ຜົນຫວຍໄທລ່າສຸດ', 'lotto-foreign': 'ຜົນຫວຍຕ່າງປະເທດລ່າສຸດ', 'lotto-stock': 'ຜົນຫວຍຫຸ້ນລ່າສຸດ', 'lotto-daily': 'ຜົນຫວຍລາຍວັນລ່າສຸດ' },
    faqs: [
      { question: 'Huay Update ອັບເດດຜົນເມື່ອໃດ', answer: 'ລະບົບຈະສະແດງຜົນຕາມວັນທີ ແລະອັບເດດເມື່ອມີຂໍ້ມູນໃໝ່.' },
      { question: 'ເບິ່ງຜົນຍ້ອນຫຼັງໄດ້ແນວໃດ', answer: 'ເລືອກວັນທີຈາກປະຕິທິນ ຫຼືກົດລິ້ງຜົນຍ້ອນຫຼັງດ້ານລຸ່ມ.' },
      { question: 'ມີຫວຍປະເພດໃດແດ່', answer: 'ມີຫຼາຍກຸ່ມ ເຊັ່ນ ຫວຍໄທ ຫວຍຕ່າງປະເທດ ຫວຍຫຸ້ນ ແລະຫວຍລາຍວັນ.' },
      { question: 'ສະແດງເລກຫຍັງແດ່', answer: 'ແຕ່ລະຕະຫຼາດສະແດງເລກຕາມຂໍ້ມູນທີ່ມີ ເຊັ່ນ 3 ໂຕເທິງ 2 ໂຕເທິງ 2 ໂຕລຸ່ມ.' },
    ],
  },
  kh: {
    aria: 'ព័ត៌មានលទ្ធផលឆ្នោត និងប្រវត្តិ',
    introTitle: date => `លទ្ធផលឆ្នោតย้อนหลัง និងប្រចាំថ្ងៃ ${date}`,
    intro: 'Huay Update ប្រមូលលទ្ធផលឆ្នោតតាមថ្ងៃ រួមមានឆ្នោតថៃ បរទេស ហ៊ុន និងប្រចាំថ្ងៃ ដើម្បីពិនិត្យបានងាយនៅកន្លែងតែមួយ។',
    typeTitle: 'មើលតាមប្រភេទឆ្នោត',
    historyTitle: 'លទ្ធផលឆ្នោតย้อนหลัง',
    topicTitle: 'ទំព័រព័ត៌មានឆ្នោត',
    marketTitle: 'លទ្ធផលតាមទីផ្សារ',
    marketLink: name => `ប្រវត្តិ${name}`,
    faqTitle: 'សំណួរដែលសួរញឹកញាប់',
    bottomTitle: 'លទ្ធផលឆ្នោត Huay Update ថ្ងៃនេះ',
    bottomIntro: 'ពិនិត្យលទ្ធផលឆ្នោតថ្មីៗគ្រប់ប្រភេទ អាប់ដេតរហ័ស និងងាយស្រួលនៅកន្លែងតែមួយ។',
    supportedTitle: 'លទ្ធផលដែលគាំទ្រ',
    stockTitle: 'ឆ្នោតហ៊ុនថៃ និងអន្តរជាតិ',
    stockText: 'តាមដាន Nikkei Hang Seng Dow Jones និងហ៊ុនផ្សេងៗ រួមមាន 3 លើ 2 លើ និង 2 ក្រោម។',
    aseanTitle: 'ឆ្នោតឡាវ និង ASEAN',
    aseanText: 'គាំទ្រ Lao TV, Lao Pratu Chai, Lao Santiphap, Hanoi ASEAN និងទីផ្សារប្រចាំថ្ងៃផ្សេងៗ។',
    whyTitle: 'ហេតុអ្វីត្រូវពិនិត្យនៅ Huay Update?',
    whyText: 'អាប់ដេតលឿន គាំទ្រច្រើនប្រភេទក្នុងមួយថ្ងៃ និងប្រើងាយលើទូរស័ព្ទ ឬកុំព្យូទ័រ ដោយមិនចាំបាច់មានគណនី។',
    groupLabels: { 'lotto-thai': 'លទ្ធផលឆ្នោតថៃថ្មី', 'lotto-foreign': 'លទ្ធផលឆ្នោតបរទេសថ្មី', 'lotto-stock': 'លទ្ធផលឆ្នោតហ៊ុនថ្មី', 'lotto-daily': 'លទ្ធផលឆ្នោតប្រចាំថ្ងៃថ្មី' },
    faqs: [
      { question: 'Huay Update អាប់ដេតពេលណា', answer: 'ប្រព័ន្ធបង្ហាញលទ្ធផលតាមថ្ងៃ និងអាប់ដេតនៅពេលមានទិន្នន័យថ្មីពីទីផ្សារនីមួយៗ។' },
      { question: 'មើលប្រវត្តិបានដូចម្តេច', answer: 'ជ្រើសថ្ងៃពីប្រតិទិន ឬប្រើតំណប្រវត្តិខាងក្រោម។' },
      { question: 'មានឆ្នោតប្រភេទណាខ្លះ', answer: 'មានឆ្នោតថៃ បរទេស ហ៊ុន និងប្រចាំថ្ងៃដែលមានទិន្នន័យក្នុងប្រព័ន្ធ។' },
      { question: 'បង្ហាញលេខអ្វីខ្លះ', answer: 'ទីផ្សារនីមួយៗបង្ហាញលេខដែលមាន ដូចជា 3 លើ 2 លើ 2 ក្រោម ឬរង្វាន់ទី១។' },
    ],
  },
  zh: {
    aria: '彩票结果和历史信息',
    introTitle: date => `${date} 彩票历史和每日开奖结果`,
    intro: 'Huay Update 按日期汇总泰国彩票、国外彩票、股票彩票和每日彩票结果，并提供按日期查看历史结果的链接。',
    typeTitle: '按彩票类型查看',
    historyTitle: '彩票历史结果',
    topicTitle: '彩票信息页面',
    marketTitle: '按市场查看结果',
    marketLink: name => `${name}历史结果`,
    faqTitle: '常见问题',
    bottomTitle: 'Huay Update 今日彩票开奖结果',
    bottomIntro: '在一个页面查看泰国彩票、股票彩票和国外彩票的最新结果，更新快速，方便每天查询。',
    supportedTitle: '支持的彩票结果',
    stockTitle: '泰国及国际股票彩票',
    stockText: '跟踪日经、恒生、道琼斯及其他股票彩票的上午和下午结果，包括前三位、前两位和后两位。',
    aseanTitle: '老挝和 ASEAN 彩票',
    aseanText: '覆盖 Lao TV、Lao Pratu Chai、Lao Santiphap、Hanoi ASEAN 以及更多每日彩票市场。',
    whyTitle: '为什么在 Huay Update 查彩票？',
    whyText: '结果更新快速，每天覆盖多种彩票类型，手机和电脑都易于使用，无需注册即可查看。',
    groupLabels: { 'lotto-thai': '最新泰国彩票结果', 'lotto-foreign': '最新国外彩票结果', 'lotto-stock': '最新股票彩票结果', 'lotto-daily': '最新每日彩票结果' },
    faqs: [
      { question: 'Huay Update 什么时候更新结果？', answer: '系统会按所选日期显示结果，并在各彩票市场有新数据时更新。' },
      { question: '如何查看历史结果？', answer: '可以从日历选择日期，或点击下方历史结果链接打开过去的每日结果页面。' },
      { question: '包含哪些彩票类型？', answer: '网站包含泰国彩票、国外彩票、股票彩票和每日彩票等多个分类。' },
      { question: '显示哪些号码？', answer: '每个市场会根据可用数据显示前三位、前两位、后两位，部分市场也会显示一等奖。' },
    ],
  },
}

function addDays(date: string, amount: number): string {
  const d = new Date(`${date}T12:00:00`)
  d.setDate(d.getDate() + amount)
  return d.toISOString().slice(0, 10)
}

export function recentLotteryDates(currentDate: string, total = 14): string[] {
  return Array.from({ length: total }, (_, index) => addDays(currentDate, -index))
}

export function faqJsonLd(lang: Lang = 'th') {
  const faqs = SEO_COPY[lang].faqs
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export default function LotterySeoContent({
  currentDate,
  lang = 'th',
  markets = [],
}: {
  currentDate: string
  lang?: Lang
  markets?: SeoMarketLink[]
}) {
  const dates = recentLotteryDates(currentDate)
  const href = (path: string) => localizedPath(path, lang)
  const visibleMarkets = markets.slice(0, 24)
  const copy = SEO_COPY[lang]
  const formattedCurrentDate = formatSeoDate(currentDate, lang)

  return (
    <section className="seo-section" aria-label={copy.aria}>
      <div className="seo-inner">
        <div className="seo-copy">
          <h2>{copy.introTitle(formattedCurrentDate)}</h2>
          <p>{copy.intro}</p>
        </div>

        <div className="seo-link-block">
          <h2>{copy.typeTitle}</h2>
          <div className="seo-date-links">
            {lotteryGroups.map(group => (
              <Link key={group.code} href={href(`/lottery/group/${group.code}`)} className="seo-date-link">
                {copy.groupLabels[group.code] ?? group.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="seo-link-block">
          <h2>{copy.historyTitle}</h2>
          <div className="seo-date-links">
            {dates.map(date => (
              <Link key={date} href={href(`/lottery/${date}`)} className="seo-date-link">
                {formatSeoDate(date, lang)}
              </Link>
            ))}
          </div>
        </div>

        <div className="seo-link-block">
          <h2>{copy.topicTitle}</h2>
          <div className="seo-date-links">
            {Object.keys(lotterySeoPages).map(slug => {
              const page = getLotterySeoPage(slug, lang)
              return page ? (
                <Link key={slug} href={href(`/lottery/${slug}`)} className="seo-date-link">
                  {page.h1}
                </Link>
              ) : null
            })}
          </div>
        </div>

        {visibleMarkets.length > 0 && (
          <div className="seo-link-block">
            <h2>{copy.marketTitle}</h2>
            <div className="seo-date-links">
              {visibleMarkets.map(market => (
                <Link key={market.market_id} href={href(`/market/${market.market_id}`)} className="seo-date-link">
                  {copy.marketLink(market.market_name)}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="seo-faq">
          <h2>{copy.faqTitle}</h2>
          <div className="seo-faq-grid">
            {copy.faqs.map(item => (
              <article key={item.question} className="seo-faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="seo-copy">
          <h2>{copy.bottomTitle}</h2>
          <p>{copy.bottomIntro}</p>

          <h2>{copy.supportedTitle}</h2>

          <h3>{copy.stockTitle}</h3>
          <p>{copy.stockText}</p>

          <h3>{copy.aseanTitle}</h3>
          <p>{copy.aseanText}</p>

          <h2>{copy.whyTitle}</h2>
          <p>{copy.whyText}</p>
        </div>
      </div>
    </section>
  )
}
