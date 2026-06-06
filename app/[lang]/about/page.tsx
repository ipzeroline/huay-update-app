import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/app/breadcrumbs'
import LangSwitcher from '@/app/lang-switcher'
import { LANG_LOCALE, type Lang } from '@/lib/i18n'
import {
  absoluteUrl,
  baseOpenGraph,
  baseTwitter,
  isSeoLang,
  languageAlternates,
  localizedPath,
  siteName,
} from '@/lib/seo'

export const revalidate = 604800 // 1 week

const pagePath = '/about'

type AboutCopy = {
  home: string
  metaTitle: string
  metaDescription: string
  title: string
  lead: string
  whatTitle: string
  whatBody: string
  howTitle: string
  howBody: string
  sourceTitle: string
  sourceBody: string
  contactTitle: string
  contactBody: string
}

const ABOUT_COPY: Record<Lang, AboutCopy> = {
  th: {
    home: 'หน้าแรก',
    metaTitle: `เกี่ยวกับเรา | ${siteName}`,
    metaDescription: `เกี่ยวกับ ${siteName} — บริการตรวจผลหวยและรวมผลรางวัลครบทุกประเภท หวยไทย หวยลาว หวยฮานอย หวยหุ้น และหวยรายวัน`,
    title: 'เกี่ยวกับเรา',
    lead: `Huay Update คือบริการตรวจผลหวยและรวมผลรางวัลที่รวบรวมข้อมูลจากหลายตลาดหวยมาแสดงในหน้าเดียว โดยเน้นความรวดเร็ว ครอบคลุม และใช้งานง่าย`,
    whatTitle: 'Huay Update คืออะไร',
    whatBody: `Huay Update เป็นเว็บไซต์ที่รวบรวมผลหวยจากหลากหลายตลาดมาแสดงในที่เดียว ครอบคลุมทั้งหวยไทย หวยต่างประเทศ หวยหุ้น และหวยรายวัน โดยระบบจะดึงข้อมูลผลรางวัลมาอัปเดตอัตโนมัติ ทำให้คุณสามารถตรวจผลหวยย้อนหลังได้ทันทีหลังจากที่แต่ละตลาดประกาศผล`,
    howTitle: 'วิธีใช้งาน',
    howBody: 'เลือกวันที่ต้องการตรวจผลหวยจากปฏิทิน หรือเลือกประเภทหวยจากแท็บด้านบน ระบบจะแสดงผลหวยทั้งหมดของวันนั้น พร้อมข้อมูล 3 ตัวบน 2 ตัวบน 2 ตัวล่าง และรางวัลอื่นๆ ตามที่แต่ละตลาดมี สำหรับดูผลย้อนหลังก็เพียงเลือกวันที่ต้องการ',
    sourceTitle: 'แหล่งที่มาของข้อมูล',
    sourceBody: 'ข้อมูลผลหวยในระบบได้มาจากการเชื่อมต่อกับผู้ให้บริการข้อมูลหวย (API provider) ซึ่งรวบรวมผลจากแหล่งประกาศผลอย่างเป็นทางการของแต่ละตลาด ระบบของเราจะดึงข้อมูลเป็นระยะเพื่อให้ผลหวยเป็นปัจจุบันมากที่สุด',
    contactTitle: 'ติดต่อทีมงาน',
    contactBody: 'หากพบปัญหาการใช้งาน ข้อมูลไม่ถูกต้อง หรือมีข้อเสนอแนะ สามารถติดต่อทีมงาน Huay Update ได้ทางอีเมล funmask101@gmail.com เรายินดีรับฟังความคิดเห็นและปรับปรุงบริการให้ดีขึ้น',
  },
  en: {
    home: 'Home',
    metaTitle: `About Us | ${siteName}`,
    metaDescription: `About ${siteName} — a lottery result checking service covering Thai lottery, Lao lottery, Hanoi lottery, stock lottery, and daily lottery markets.`,
    title: 'About Us',
    lead: `Huay Update is a lottery result checking service that collects data from many lottery markets into one page — fast, comprehensive, and easy to use.`,
    whatTitle: 'What is Huay Update',
    whatBody: `Huay Update is a website that gathers lottery results from a wide range of markets in one place — covering Thai lottery, foreign lottery, stock lottery, and daily lottery. The system fetches result data automatically, letting you check lottery history as soon as each market announces its results.`,
    howTitle: 'How to use',
    howBody: 'Choose a date from the calendar or select a lottery type from the tabs at the top. The system shows all lottery results for that day, including 3 top, 2 top, 2 bottom, and other prizes as available per market. For past results, simply select the date you need.',
    sourceTitle: 'Data sources',
    sourceBody: 'Lottery result data in the system comes from a lottery data API provider that collects results from official announcement sources for each market. Our system fetches data periodically to keep results as current as possible.',
    contactTitle: 'Contact the team',
    contactBody: 'If you encounter issues, incorrect data, or have suggestions, contact the Huay Update team at funmask101@gmail.com. We welcome feedback and work to improve the service.',
  },
  la: {
    home: 'ໜ້າຫຼັກ',
    metaTitle: `ກ່ຽວກັບເຮົາ | ${siteName}`,
    metaDescription: `ກ່ຽວກັບ ${siteName} — ບໍລິການກວດຜົນຫວຍ ແລະຮວມຜົນລາງວັນຄົບທຸກປະເພດ ຫວຍໄທ ຫວຍລາວ ຮານອຍ ຫວຍຫຸ້ນ ແລະຫວຍລາຍວັນ`,
    title: 'ກ່ຽວກັບເຮົາ',
    lead: `Huay Update ແມ່ນບໍລິການກວດຜົນຫວຍ ແລະຮວມຜົນລາງວັນທີ່ເກັບກຳຂໍ້ມູນຈາກຫຼາຍຕະຫຼາດມາສະແດງໃນໜ້າດຽວ`,
    whatTitle: 'Huay Update ແມ່ນຫຍັງ',
    whatBody: `Huay Update ແມ່ນເວັບໄຊທີ່ຮວບຮວມຜົນຫວຍຈາກຫຼາຍຕະຫຼາດມາສະແດງໃນບ່ອນດຽວ ຄອບຄຸມຫວຍໄທ ຫວຍຕ່າງປະເທດ ຫວຍຫຸ້ນ ແລະຫວຍລາຍວັນ ລະບົບຈະດຶງຂໍ້ມູນຜົນມາອັບເດດອັດຕະໂນມັດ`,
    howTitle: 'ວິທີໃຊ້',
    howBody: 'ເລືອກວັນທີຈາກປະຕິທິນ ຫຼືເລືອກປະເພດຫວຍຈາກແຖບດ້ານເທິງ ລະບົບຈະສະແດງຜົນຫວຍທັງໝົດຂອງມື້ນັ້ນ ພ້ອມເລກ 3 ໂຕເທິງ 2 ໂຕເທິງ 2 ໂຕລຸ່ມ ແລະລາງວັນອື່ນໆ',
    sourceTitle: 'ແຫຼ່ງຂໍ້ມູນ',
    sourceBody: 'ຂໍ້ມູນຜົນຫວຍໃນລະບົບມາຈາກຜູ້ໃຫ້ບໍລິການ API ຂໍ້ມູນຫວຍ ເຊິ່ງຮວບຮວມຜົນຈາກແຫຼ່ງປະກາດຜົນທາງການຂອງແຕ່ລະຕະຫຼາດ',
    contactTitle: 'ຕິດຕໍ່ທີມງານ',
    contactBody: 'ຫາກພົບບັນຫາ ຂໍ້ມູນບໍ່ຖືກຕ້ອງ ຫຼືມີຂໍ້ສະເໜີແນະ ສາມາດຕິດຕໍ່ Huay Update ໄດ້ທີ່ funmask101@gmail.com',
  },
  kh: {
    home: 'ទំព័រដើម',
    metaTitle: `អំពីយើង | ${siteName}`,
    metaDescription: `អំពី ${siteName} — សេវាត្រួតពិនិត្យលទ្ធផលឆ្នោតគ្រប់ប្រភេទ រួមមានឆ្នោតថៃ ឆ្នោតឡាវ ឆ្នោតហាណូយ ឆ្នោតហ៊ុន និងឆ្នោតប្រចាំថ្ងៃ`,
    title: 'អំពីយើង',
    lead: `Huay Update គឺជាសេវាត្រួតពិនិត្យលទ្ធផលឆ្នោត និងប្រមូលផ្តុំលទ្ធផលពីទីផ្សារជាច្រើនមកបង្ហាញក្នុងទំព័រតែមួយ`,
    whatTitle: 'Huay Update ជាអ្វី',
    whatBody: `Huay Update ជាគេហទំព័រប្រមូលផ្តុំលទ្ធផលឆ្នោតពីទីផ្សារជាច្រើនមកបង្ហាញក្នុងកន្លែងតែមួយ គ្របដណ្តប់ឆ្នោតថៃ ឆ្នោតបរទេស ឆ្នោតហ៊ុន និងឆ្នោតប្រចាំថ្ងៃ ប្រព័ន្ធនឹងទាញយកទិន្នន័យមកធ្វើបច្ចុប្បន្នភាពដោយស្វ័យប្រវត្តិ`,
    howTitle: 'របៀបប្រើ',
    howBody: 'ជ្រើសកាលបរិច្ឆេទពីប្រតិទិន ឬជ្រើសប្រភេទឆ្នោតពីផ្ទាំងខាងលើ ប្រព័ន្ធនឹងបង្ហាញលទ្ធផលឆ្នោតទាំងអស់នៃថ្ងៃនោះ ជាមួយលេខ 3 ខ្ទង់លើ 2 ខ្ទង់លើ 2 ខ្ទង់ក្រោម និងរង្វាន់ផ្សេងៗ',
    sourceTitle: 'ប្រភពទិន្នន័យ',
    sourceBody: 'ទិន្នន័យលទ្ធផលឆ្នោតក្នុងប្រព័ន្ធបានមកពីអ្នកផ្តល់សេវា API ទិន្នន័យឆ្នោត ដែលប្រមូលផ្តុំលទ្ធផលពីប្រភពផ្លូវការនៃទីផ្សារនីមួយៗ',
    contactTitle: 'ទាក់ទងក្រុមការងារ',
    contactBody: 'ប្រសិនបើមានបញ្ហា ទិន្នន័យមិនត្រឹមត្រូវ ឬមានសំណូមពរ សូមទាក់ទង Huay Update តាម funmask101@gmail.com',
  },
  zh: {
    home: '首页',
    metaTitle: `关于我们 | ${siteName}`,
    metaDescription: `关于 ${siteName} — 彩票结果查询服务，涵盖泰国彩票、老挝彩票、河内彩票、股票彩票和每日彩票市场。`,
    title: '关于我们',
    lead: `Huay Update 是一个彩票结果查询服务，将多个彩票市场的数据汇集到一个页面 — 快速、全面、易于使用。`,
    whatTitle: 'Huay Update 是什么',
    whatBody: `Huay Update 是一个将众多市场的彩票结果汇聚到一个地方的网站，涵盖泰国彩票、国外彩票、股票彩票和每日彩票。系统会自动获取结果数据，让您在每个市场公布结果后即可查看彩票历史。`,
    howTitle: '如何使用',
    howBody: '从日历中选择日期，或从顶部标签页选择彩票类型。系统将显示当天的所有彩票结果，包括前三位、前两位、后两位和各市场提供的其他奖项。查看历史结果仅需选择所需日期。',
    sourceTitle: '数据来源',
    sourceBody: '系统中的彩票结果数据来自彩票数据 API 提供商，该提供商从各市场的官方公布来源收集结果。我们的系统定期获取数据，以保持结果尽可能最新。',
    contactTitle: '联系团队',
    contactBody: '如果遇到问题、数据错误或有建议，请联系 Huay Update 团队：funmask101@gmail.com。我们欢迎反馈并持续改进服务。',
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  if (!isSeoLang(lang)) return { title: 'Not found', robots: { index: false, follow: false } }
  const copy = ABOUT_COPY[lang]
  const canonical = localizedPath(pagePath, lang)
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: { canonical, languages: languageAlternates(pagePath) },
    openGraph: baseOpenGraph(canonical, copy.metaTitle, copy.metaDescription),
    twitter: baseTwitter(copy.metaTitle, copy.metaDescription),
    robots: { index: true, follow: true },
  }
}

type PageProps = { params: Promise<{ lang: string }> }

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params
  if (!isSeoLang(lang)) notFound()
  const currentLang = lang as Lang
  const copy = ABOUT_COPY[currentLang]

  return (
    <>
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
            <p className="lottery-topic-kicker">{siteName}</p>
            <h1>{copy.title}</h1>
            <p>{copy.lead}</p>
          </div>
          <aside>
            <span>{siteName}</span>
            <strong>{copy.title}</strong>
            <p>{copy.metaDescription}</p>
          </aside>
        </section>

        <section className="lottery-topic-grid">
          <article className="lottery-topic-card">
            <h2>{copy.whatTitle}</h2>
            <p>{copy.whatBody}</p>
          </article>
          <article className="lottery-topic-card">
            <h2>{copy.howTitle}</h2>
            <p>{copy.howBody}</p>
          </article>
          <article className="lottery-topic-card">
            <h2>{copy.sourceTitle}</h2>
            <p>{copy.sourceBody}</p>
          </article>
          <article className="lottery-topic-card">
            <h2>{copy.contactTitle}</h2>
            <p>{copy.contactBody}</p>
          </article>
        </section>
      </main>
    </>
  )
}
