import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/app/breadcrumbs'
import LangSwitcher from '@/app/lang-switcher'
import { type Lang } from '@/lib/i18n'
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

const pagePath = '/policy'

type PolicyCopy = {
  home: string
  metaTitle: string
  metaDescription: string
  title: string
  sections: { heading: string; body: string }[]
}

const POLICY_COPY: Record<Lang, PolicyCopy> = {
  th: {
    home: 'หน้าแรก',
    metaTitle: `นโยบายและข้อจำกัดความรับผิดชอบ | ${siteName}`,
    metaDescription: `นโยบายความเป็นส่วนตัวและข้อจำกัดความรับผิดชอบของ ${siteName} — ข้อมูลผลหวยใช้เพื่อการตรวจสอบและอ้างอิงเท่านั้น`,
    title: 'นโยบายและข้อจำกัดความรับผิดชอบ',
    sections: [
      {
        heading: 'ข้อจำกัดความรับผิดชอบ',
        body: `ข้อมูลผลหวยที่แสดงบน ${siteName} ใช้เพื่อการตรวจสอบและอ้างอิงเท่านั้น เราไม่รับประกันความถูกต้อง ครบถ้วน หรือทันเวลาของข้อมูล ผู้ใช้ควรตรวจสอบผลกับแหล่งประกาศผลอย่างเป็นทางการของแต่ละตลาดหวยอีกครั้ง ${siteName} ไม่มีส่วนเกี่ยวข้องกับการรับแทงหวย การพนัน หรือกิจกรรมที่ผิดกฎหมายใดๆ`,
      },
      {
        heading: 'การใช้ข้อมูลอย่างรับผิดชอบ',
        body: 'เลขเด็ด แนวทาง และบทวิเคราะห์ที่แสดงบนเว็บไซต์เป็นเพียงการนำเสนอข้อมูลทางสถิติเพื่อการบันทึกและความบันเทิงเท่านั้น ผลหวยเป็นเหตุการณ์สุ่ม ไม่มีสูตรหรือเลขใดที่สามารถรับประกันผลรางวัลได้ ผู้ใช้ควรใช้วิจารณญาณและเล่นอย่างมีสติ',
      },
      {
        heading: 'แหล่งที่มาของข้อมูล',
        body: 'ข้อมูลผลหวยในระบบได้มาจากผู้ให้บริการ API บุคคลที่สาม ซึ่งรวบรวมข้อมูลจากแหล่งประกาศผลอย่างเป็นทางการ เราไม่สามารถรับประกันความถูกต้องสมบูรณ์ของข้อมูลต้นทางได้ หากพบข้อมูลไม่ถูกต้องกรุณาติดต่อเราทางอีเมล',
      },
      {
        heading: 'ลิขสิทธิ์',
        body: `เนื้อหา โลโก้ และเครื่องหมายการค้าทั้งหมดบน ${siteName} เป็นทรัพย์สินทางปัญญาของเจ้าของที่เกี่ยวข้อง การทำซ้ำ ดัดแปลง หรือเผยแพร่เนื้อหาเพื่อการพาณิชย์โดยไม่ได้รับอนุญาตเป็นสิ่งต้องห้าม`,
      },
      {
        heading: 'การเปลี่ยนแปลงนโยบาย',
        body: 'เราอาจปรับปรุงนโยบายนี้เป็นครั้งคราว โดยจะประกาศให้ทราบผ่านทางเว็บไซต์ การใช้งานเว็บไซต์ต่อหลังจากมีการเปลี่ยนแปลงนโยบายถือว่าผู้ใช้ยอมรับนโยบายที่ปรับปรุงแล้ว',
      },
      {
        heading: 'ติดต่อ',
        body: 'หากมีคำถามเกี่ยวกับนโยบายนี้ กรุณาติดต่อเราที่ funmask101@gmail.com',
      },
    ],
  },
  en: {
    home: 'Home',
    metaTitle: `Policy & Disclaimer | ${siteName}`,
    metaDescription: `Privacy policy and disclaimer for ${siteName} — lottery result data is for checking and reference only.`,
    title: 'Policy & Disclaimer',
    sections: [
      {
        heading: 'Disclaimer',
        body: `Lottery result data displayed on ${siteName} is for checking and reference only. We do not guarantee the accuracy, completeness, or timeliness of the information. Users should verify results against official announcement sources for each lottery market. ${siteName} is not involved in lottery betting, gambling, or any illegal activities.`,
      },
      {
        heading: 'Responsible Use',
        body: 'Lucky numbers, guides, and analysis shown on the website are statistical presentations for personal record-keeping and entertainment only. Lottery results are random events — no formula or number can guarantee a prize. Users should exercise judgment and play responsibly.',
      },
      {
        heading: 'Data Sources',
        body: 'Lottery result data in the system comes from third-party API providers that collect information from official announcement sources. We cannot guarantee the complete accuracy of the source data. If you find incorrect information, please contact us by email.',
      },
      {
        heading: 'Copyright',
        body: `All content, logos, and trademarks on ${siteName} are the intellectual property of their respective owners. Reproduction, modification, or distribution of content for commercial purposes without permission is prohibited.`,
      },
      {
        heading: 'Policy Changes',
        body: 'We may update this policy from time to time. Changes will be posted on the website. Continued use of the website after policy changes constitutes acceptance of the updated policy.',
      },
      {
        heading: 'Contact',
        body: 'If you have questions about this policy, please contact us at funmask101@gmail.com.',
      },
    ],
  },
  la: {
    home: 'ໜ້າຫຼັກ',
    metaTitle: `ນະໂຍບາຍ ແລະຂໍ້ຈຳກັດ | ${siteName}`,
    metaDescription: `ນະໂຍບາຍ ແລະຂໍ້ຈຳກັດຄວາມຮັບຜິດຊອບຂອງ ${siteName}`,
    title: 'ນະໂຍບາຍ ແລະຂໍ້ຈຳກັດຄວາມຮັບຜິດຊອບ',
    sections: [
      {
        heading: 'ຂໍ້ຈຳກັດຄວາມຮັບຜິດຊອບ',
        body: `ຂໍ້ມູນຜົນຫວຍທີ່ສະແດງເທິງ ${siteName} ໃຊ້ເພື່ອການກວດສອບ ແລະອ້າງອີງເທົ່ານັ້ນ ກະລຸນາກວດກັບແຫຼ່ງປະກາດຜົນທາງການອີກຄັ້ງ`,
      },
      {
        heading: 'ການໃຊ້ຢ່າງຮັບຜິດຊອບ',
        body: 'ເລກເດັດ ແນວທາງ ແລະບົດວິເຄາະເປັນພຽງການນຳສະເໜີຂໍ້ມູນສະຖິຕິເພື່ອບັນທຶກ ແລະຄວາມບັນເທີງ ຜົນຫວຍເປັນເຫດການສຸ່ມ ບໍ່ມີສູດໃດຮັບປະກັນຜົນໄດ້',
      },
      {
        heading: 'ແຫຼ່ງຂໍ້ມູນ',
        body: 'ຂໍ້ມູນຜົນຫວຍມາຈາກຜູ້ໃຫ້ບໍລິການ API ບຸກຄົນທີສາມ ເຊິ່ງຮວບຮວມຈາກແຫຼ່ງທາງການ ຫາກພົບຂໍ້ມູນຜິດພາດກະລຸນາຕິດຕໍ່ເຮົາ',
      },
      {
        heading: 'ລິຂະສິດ',
        body: `ເນື້ອຫາ ໂລໂກ້ ແລະເຄື່ອງໝາຍການຄ້າທັງໝົດເທິງ ${siteName} ເປັນຊັບສິນທາງປັນຍາຂອງເຈົ້າຂອງທີ່ກ່ຽວຂ້ອງ`,
      },
      {
        heading: 'ການປ່ຽນແປງນະໂຍບາຍ',
        body: 'ເຮົາອາດປັບປຸງນະໂຍບາຍນີ້ເປັນບາງຄັ້ງ ການໃຊ້ງານຕໍ່ຖືວ່າຍອມຮັບນະໂຍບາຍທີ່ປັບປຸງແລ້ວ',
      },
      {
        heading: 'ຕິດຕໍ່',
        body: 'ຫາກມີຄຳຖາມກ່ຽວກັບນະໂຍບາຍນີ້ ຕິດຕໍ່ funmask101@gmail.com',
      },
    ],
  },
  kh: {
    home: 'ទំព័រដើម',
    metaTitle: `គោលការណ៍ និងការមិនទទួលខុសត្រូវ | ${siteName}`,
    metaDescription: `គោលការណ៍ និងការមិនទទួលខុសត្រូវរបស់ ${siteName}`,
    title: 'គោលការណ៍ និងការមិនទទួលខុសត្រូវ',
    sections: [
      {
        heading: 'ការមិនទទួលខុសត្រូវ',
        body: `ទិន្នន័យលទ្ធផលឆ្នោតនៅលើ ${siteName} គឺសម្រាប់ការត្រួតពិនិត្យ និងយោងប៉ុណ្ណោះ សូមផ្ទៀងផ្ទាត់ជាមួយប្រភពផ្លូវការម្តងទៀត`,
      },
      {
        heading: 'ការប្រើប្រាស់ដោយទំនួលខុសត្រូវ',
        body: 'លេខសំណាង មគ្គុទ្ទេសក៍ និងការវិភាគគឺសម្រាប់កំណត់ត្រា និងការកម្សាន្តប៉ុណ្ណោះ លទ្ធផលឆ្នោតជាព្រឹត្តិការណ៍ចៃដន្យ',
      },
      {
        heading: 'ប្រភពទិន្នន័យ',
        body: 'ទិន្នន័យបានមកពីអ្នកផ្តល់សេវា API ភាគីទីបី ប្រសិនបើមានទិន្នន័យមិនត្រឹមត្រូវ សូមទាក់ទងមកយើង',
      },
      {
        heading: 'រក្សាសិទ្ធិ',
        body: `មាតិកា និមិត្តសញ្ញា និងពាណិជ្ជសញ្ញាទាំងអស់នៅលើ ${siteName} ជាកម្មសិទ្ធិរបស់ម្ចាស់កម្មសិទ្ធិរៀងៗខ្លួន`,
      },
      {
        heading: 'ការផ្លាស់ប្តូរគោលការណ៍',
        body: 'យើងអាចធ្វើបច្ចុប្បន្នភាពគោលការណ៍នេះ ការប្រើប្រាស់បន្តមានន័យថាអ្នកទទួលយកការផ្លាស់ប្តូរ',
      },
      {
        heading: 'ទំនាក់ទំនង',
        body: 'ប្រសិនបើមានចម្ងល់ សូមទាក់ទង funmask101@gmail.com',
      },
    ],
  },
  zh: {
    home: '首页',
    metaTitle: `政策与免责声明 | ${siteName}`,
    metaDescription: `${siteName} 的隐私政策与免责声明 — 彩票结果数据仅供查询和参考。`,
    title: '政策与免责声明',
    sections: [
      {
        heading: '免责声明',
        body: `${siteName} 显示的彩票结果数据仅供查询和参考。我们不保证信息的准确性、完整性或及时性。用户应通过各彩票市场的官方公布来源再次核实结果。${siteName} 不涉及彩票投注、赌博或任何非法活动。`,
      },
      {
        heading: '负责任使用',
        body: '网站显示的幸运号码、指南和分析仅为个人记录和娱乐的统计展示。彩票结果是随机事件 — 没有任何公式或号码可以保证中奖。用户应自行判断并负责任地使用。',
      },
      {
        heading: '数据来源',
        body: '系统中的彩票结果数据来自第三方 API 提供商，该提供商从官方公布来源收集信息。如果发现信息错误，请通过电子邮件联系我们。',
      },
      {
        heading: '版权',
        body: `${siteName} 上的所有内容、标志和商标均为各自所有者的知识产权。未经许可，禁止复制、修改或分发内容用于商业目的。`,
      },
      {
        heading: '政策变更',
        body: '我们可能不时更新此政策。变更将在网站上公布。政策变更后继续使用网站即表示接受更新后的政策。',
      },
      {
        heading: '联系方式',
        body: '如果您对本政策有疑问，请联系我们：funmask101@gmail.com。',
      },
    ],
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  if (!isSeoLang(lang)) return { title: 'Not found', robots: { index: false, follow: false } }
  const copy = POLICY_COPY[lang]
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

export default async function PolicyPage({ params }: PageProps) {
  const { lang } = await params
  if (!isSeoLang(lang)) notFound()
  const currentLang = lang as Lang
  const copy = POLICY_COPY[currentLang]

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
          </div>
          <aside>
            <span>{siteName}</span>
            <strong>{copy.metaTitle}</strong>
          </aside>
        </section>

        <section className="lottery-topic-grid">
          {copy.sections.map(section => (
            <article key={section.heading} className="lottery-topic-card">
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  )
}
