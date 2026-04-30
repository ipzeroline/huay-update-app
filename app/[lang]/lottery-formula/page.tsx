import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calculator, ChevronLeft } from 'lucide-react'
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
  siteKeywords,
  siteName,
} from '@/lib/seo'

export const revalidate = 3600

type PageProps = {
  params: Promise<{ lang: string }>
}

type FormulaItem = {
  title: string
  steps: string[]
  exampleLabel: string
  example: string
  tone: 'gold' | 'blue' | 'green' | 'purple'
}

type FormulaCopy = {
  home: string
  metaTitle: string
  metaDescription: string
  kicker: string
  title: string
  lead: string
  back: string
  noteTitle: string
  note: string
  formulas: FormulaItem[]
}

const pagePath = '/lottery-formula'

const FORMULA_COPY: Record<Lang, FormulaCopy> = {
  th: {
    home: 'หน้าแรก',
    metaTitle: 'สูตรคำนวณหวย | Huay Update',
    metaDescription: 'รวมสูตรคำนวณหวยจากผลย้อนหลัง สำหรับจดแนวทางเลขและเปรียบเทียบสถิติส่วนตัว พร้อมตัวอย่างการคำนวณ',
    kicker: 'แนวทางเชิงตัวเลข',
    title: 'สูตรคำนวณหวย',
    lead: 'รวมวิธีจัดชุดตัวเลขจากผลย้อนหลัง สำหรับจดแนวทางและเปรียบเทียบสถิติส่วนตัว โดยไม่รับประกันผลรางวัล',
    back: 'กลับหน้าตรวจหวย',
    noteTitle: 'ข้อควรรู้',
    note: 'ผลหวยเป็นเหตุการณ์สุ่ม สูตรเหล่านี้เหมาะสำหรับจัดระเบียบแนวคิดและใช้เพื่อความบันเทิงเท่านั้น',
    formulas: [
      {
        title: 'สูตรกลับเลข',
        steps: ['เลือกเลข 2 หรือ 3 ตัวจากงวดล่าสุด', 'สลับตำแหน่งตัวเลขเพื่อสร้างชุดใหม่', 'คัดเฉพาะชุดที่ไม่ซ้ำกับบันทึกเดิม'],
        exampleLabel: 'ตัวอย่าง',
        example: '68 -> 86, 368 -> 386 / 638 / 863',
        tone: 'gold',
      },
      {
        title: 'สูตรบวกแต้ม',
        steps: ['นำเลขแต่ละหลักมาบวกกัน', 'ใช้หลักหน่วยของผลรวมเป็นเลขแต้ม', 'จับคู่เลขแต้มกับเลขเดิมเพื่อหาเลขชุด'],
        exampleLabel: 'ตัวอย่าง',
        example: '6 + 8 = 14 -> แต้ม 4 -> 64 / 84 / 44',
        tone: 'blue',
      },
      {
        title: 'สูตรเดินหน้า-ถอยหลัง',
        steps: ['เพิ่มหรือลดเลขแต่ละหลักทีละ 1', 'เก็บชุดเลขที่ยังอยู่ในช่วง 0-9', 'เทียบกับเลขเด่นที่จดไว้ในงวดก่อน'],
        exampleLabel: 'ตัวอย่าง',
        example: '68 -> 57 / 67 / 69 / 79',
        tone: 'green',
      },
      {
        title: 'สูตรชนเลขเด่น',
        steps: ['เลือกเลขเด่นจาก 3-5 งวดย้อนหลัง', 'นับความถี่ของเลขแต่ละตัว', 'จับคู่เลขที่พบซ้ำกับสูตรอื่นเพื่อกรองชุดเลข'],
        exampleLabel: 'ตัวอย่าง',
        example: 'เด่น 4, 8 -> ชนกับแต้ม 4 -> 48 / 84 / 44',
        tone: 'purple',
      },
    ],
  },
  en: {
    home: 'Home',
    metaTitle: 'Lottery Formula | Huay Update',
    metaDescription: 'Simple lottery-number formulas for organizing number ideas from past results, with examples for personal notes.',
    kicker: 'Number notes',
    title: 'Lottery Formula',
    lead: 'Simple ways to arrange number sets from past results for personal tracking and comparison, without any prize guarantee.',
    back: 'Back to results',
    noteTitle: 'Reminder',
    note: 'Lottery results are random. These formulas are only for organizing ideas and entertainment.',
    formulas: [
      {
        title: 'Reverse Number',
        steps: ['Choose a 2 or 3 digit result', 'Swap digit positions to create new sets', 'Keep only sets that do not duplicate your notes'],
        exampleLabel: 'Example',
        example: '68 -> 86, 368 -> 386 / 638 / 863',
        tone: 'gold',
      },
      {
        title: 'Point Sum',
        steps: ['Add each digit together', 'Use the ones digit of the sum as the point', 'Pair that point with the original digits'],
        exampleLabel: 'Example',
        example: '6 + 8 = 14 -> point 4 -> 64 / 84 / 44',
        tone: 'blue',
      },
      {
        title: 'Forward and Back',
        steps: ['Move each digit up or down by 1', 'Keep sets that stay within 0-9', 'Compare them with your highlighted numbers'],
        exampleLabel: 'Example',
        example: '68 -> 57 / 67 / 69 / 79',
        tone: 'green',
      },
      {
        title: 'Number Match',
        steps: ['Pick highlighted digits from the last 3-5 draws', 'Count how often each digit appears', 'Match repeated digits with another formula'],
        exampleLabel: 'Example',
        example: 'Highlights 4, 8 -> point 4 -> 48 / 84 / 44',
        tone: 'purple',
      },
    ],
  },
  la: {
    home: 'ໜ້າຫຼັກ',
    metaTitle: 'ສູດຄຳນວນຫວຍ | Huay Update',
    metaDescription: 'ລວມສູດຄຳນວນຫວຍຈາກຜົນຍ້ອນຫຼັງ ສຳລັບຈົດແນວທາງເລກ ແລະ ປຽບທຽບສະຖິຕິສ່ວນຕົວ',
    kicker: 'ແນວທາງຕົວເລກ',
    title: 'ສູດຄຳນວນຫວຍ',
    lead: 'ວິທີຈັດຊຸດຕົວເລກຈາກຜົນຍ້ອນຫຼັງ ເພື່ອຈົດແນວທາງ ແລະ ປຽບທຽບສະຖິຕິສ່ວນຕົວ ໂດຍບໍ່ຮັບປະກັນຜົນ',
    back: 'ກັບໄປໜ້າກວດຫວຍ',
    noteTitle: 'ຂໍ້ຄວນຮູ້',
    note: 'ຜົນຫວຍເປັນເຫດການສຸ່ມ ສູດເຫຼົ່ານີ້ເໝາະສຳລັບຈັດລະບຽບແນວຄິດ ແລະ ໃຊ້ເພື່ອຄວາມບັນເທີງເທົ່ານັ້ນ',
    formulas: [
      {
        title: 'ສູດກັບເລກ',
        steps: ['ເລືອກເລກ 2 ຫຼື 3 ໂຕຈາກງວດລ່າສຸດ', 'ສະຫຼັບຕຳແໜ່ງຕົວເລກເພື່ອສ້າງຊຸດໃໝ່', 'ເກັບສະເພາະຊຸດທີ່ບໍ່ຊ້ຳກັບບັນທຶກເກົ່າ'],
        exampleLabel: 'ຕົວຢ່າງ',
        example: '68 -> 86, 368 -> 386 / 638 / 863',
        tone: 'gold',
      },
      {
        title: 'ສູດບວກແຕ້ມ',
        steps: ['ນຳເລກແຕ່ລະຫຼັກມາບວກກັນ', 'ໃຊ້ຫຼັກໜ່ວຍຂອງຜົນບວກເປັນເລກແຕ້ມ', 'ຈັບຄູ່ເລກແຕ້ມກັບເລກເດີມ'],
        exampleLabel: 'ຕົວຢ່າງ',
        example: '6 + 8 = 14 -> ແຕ້ມ 4 -> 64 / 84 / 44',
        tone: 'blue',
      },
      {
        title: 'ສູດເດີນໜ້າ-ຖອຍຫຼັງ',
        steps: ['ເພີ່ມ ຫຼື ຫຼຸດເລກແຕ່ລະຫຼັກທີລະ 1', 'ເກັບຊຸດເລກທີ່ຢູ່ໃນຊ່ວງ 0-9', 'ປຽບທຽບກັບເລກເດັ່ນທີ່ຈົດໄວ້'],
        exampleLabel: 'ຕົວຢ່າງ',
        example: '68 -> 57 / 67 / 69 / 79',
        tone: 'green',
      },
      {
        title: 'ສູດຊົນເລກເດັ່ນ',
        steps: ['ເລືອກເລກເດັ່ນຈາກ 3-5 ງວດຍ້ອນຫຼັງ', 'ນັບຄວາມຖີ່ຂອງເລກແຕ່ລະໂຕ', 'ຈັບຄູ່ເລກທີ່ພົບຊ້ຳກັບສູດອື່ນ'],
        exampleLabel: 'ຕົວຢ່າງ',
        example: 'ເດັ່ນ 4, 8 -> ແຕ້ມ 4 -> 48 / 84 / 44',
        tone: 'purple',
      },
    ],
  },
  kh: {
    home: 'ទំព័រដើម',
    metaTitle: 'រូបមន្តគណនាឆ្នោត | Huay Update',
    metaDescription: 'រូបមន្តគណនាលេខឆ្នោតពីលទ្ធផលចាស់ សម្រាប់កត់ត្រាគំនិត និងប្រៀបធៀបស្ថិតិផ្ទាល់ខ្លួន',
    kicker: 'ការកត់ត្រាលេខ',
    title: 'រូបមន្តគណនាឆ្នោត',
    lead: 'វិធីរៀបចំសំណុំលេខពីលទ្ធផលចាស់ សម្រាប់កត់ត្រា និងប្រៀបធៀបស្ថិតិផ្ទាល់ខ្លួន ដោយមិនធានាលទ្ធផលរង្វាន់',
    back: 'ត្រឡប់ទៅលទ្ធផល',
    noteTitle: 'ចំណាំ',
    note: 'លទ្ធផលឆ្នោតជាព្រឹត្តិការណ៍ចៃដន្យ។ រូបមន្តទាំងនេះសម្រាប់រៀបចំគំនិត និងការកម្សាន្តប៉ុណ្ណោះ',
    formulas: [
      {
        title: 'រូបមន្តបញ្ច្រាសលេខ',
        steps: ['ជ្រើសលេខ 2 ឬ 3 ខ្ទង់ពីលទ្ធផលថ្មី', 'ប្តូរទីតាំងខ្ទង់លេខដើម្បីបង្កើតសំណុំថ្មី', 'រក្សាទុកតែសំណុំដែលមិនស្ទួនក្នុងកំណត់ត្រា'],
        exampleLabel: 'ឧទាហរណ៍',
        example: '68 -> 86, 368 -> 386 / 638 / 863',
        tone: 'gold',
      },
      {
        title: 'រូបមន្តបូកពិន្ទុ',
        steps: ['បូកខ្ទង់លេខនីមួយៗចូលគ្នា', 'ប្រើខ្ទង់រាយនៃផលបូកជាលេខពិន្ទុ', 'ផ្គូផ្គងលេខពិន្ទុជាមួយលេខដើម'],
        exampleLabel: 'ឧទាហរណ៍',
        example: '6 + 8 = 14 -> ពិន្ទុ 4 -> 64 / 84 / 44',
        tone: 'blue',
      },
      {
        title: 'រូបមន្តទៅមុខ-ថយក្រោយ',
        steps: ['បន្ថែម ឬ បន្ថយខ្ទង់នីមួយៗ 1', 'រក្សាសំណុំលេខដែលនៅចន្លោះ 0-9', 'ប្រៀបធៀបជាមួយលេខដែលបានកត់ទុក'],
        exampleLabel: 'ឧទាហរណ៍',
        example: '68 -> 57 / 67 / 69 / 79',
        tone: 'green',
      },
      {
        title: 'រូបមន្តផ្គូផ្គងលេខសំខាន់',
        steps: ['ជ្រើសលេខសំខាន់ពី 3-5 លទ្ធផលចាស់', 'រាប់ភាពញឹកញាប់នៃលេខនីមួយៗ', 'ផ្គូផ្គងលេខដែលកើតឡើងម្តងទៀតជាមួយរូបមន្តផ្សេង'],
        exampleLabel: 'ឧទាហរណ៍',
        example: 'លេខសំខាន់ 4, 8 -> ពិន្ទុ 4 -> 48 / 84 / 44',
        tone: 'purple',
      },
    ],
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  if (!isSeoLang(lang)) {
    return {
      title: 'Not found',
      robots: { index: false, follow: false },
    }
  }

  const copy = FORMULA_COPY[lang]
  const canonical = localizedPath(pagePath, lang)

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    keywords: [...siteKeywords, copy.title, 'สูตรหวย', 'สูตรคำนวณเลข'],
    alternates: {
      canonical,
      languages: languageAlternates(pagePath),
    },
    openGraph: baseOpenGraph(canonical, copy.metaTitle, copy.metaDescription),
    twitter: baseTwitter(copy.metaTitle, copy.metaDescription),
    robots: { index: true, follow: true },
  }
}

export default async function LotteryFormulaPage({ params }: PageProps) {
  const { lang } = await params
  if (!isSeoLang(lang)) notFound()

  const currentLang = lang as Lang
  const copy = FORMULA_COPY[currentLang]
  const canonical = localizedPath(pagePath, currentLang)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: copy.metaTitle,
    url: absoluteUrl(canonical),
    inLanguage: LANG_LOCALE[currentLang],
    description: copy.metaDescription,
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: absoluteUrl('/'),
      alternateName: 'ตรวจหวย',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="breadcrumbs-row">
        <Breadcrumbs items={[
          { href: localizedPath('/', currentLang), label: copy.home },
          { label: copy.title },
        ]} />
        <LangSwitcher lang={currentLang} />
      </div>

      <main className="formula-page">
        <section className="formula-hero">
          <Link href={localizedPath('/', currentLang)} className="formula-back">
            <ChevronLeft size={16} />
            <span>{copy.back}</span>
          </Link>
          <div className="formula-kicker">
            <Calculator size={18} />
            <span>{copy.kicker}</span>
          </div>
          <h1>{copy.title}</h1>
          <p>{copy.lead}</p>
        </section>

        <section className="formula-grid" aria-label={copy.title}>
          {copy.formulas.map((formula, index) => (
            <article key={formula.title} className={`formula-card tone-${formula.tone}`}>
              <div className="formula-card-index">{String(index + 1).padStart(2, '0')}</div>
              <h2>{formula.title}</h2>
              <ol>
                {formula.steps.map(step => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <div className="formula-example">
                <span>{formula.exampleLabel}</span>
                <strong>{formula.example}</strong>
              </div>
            </article>
          ))}
        </section>

        <aside className="formula-note">
          <h2>{copy.noteTitle}</h2>
          <p>{copy.note}</p>
        </aside>
      </main>
    </>
  )
}
