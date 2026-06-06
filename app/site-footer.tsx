'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isLang, type Lang } from '@/lib/i18n'
import { lotteryGroups, siteDescription, siteName } from '@/lib/seo'

const contactEmail = 'funmask101@gmail.com'

const footerCopy: Record<Lang, {
  description: string
  note: string
  lotteryTypes: string
  siteInfo: string
  contact: string
  team: string
  email: string
  policyLinks: { href: string; label: string }[]
  groupLabels: Record<string, string>
}> = {
  th: {
    description: siteDescription,
    note: 'ข้อมูลผลรางวัลใช้เพื่อการตรวจสอบและอ้างอิงเท่านั้น กรุณาตรวจสอบกับแหล่งประกาศผลอย่างเป็นทางการอีกครั้ง',
    lotteryTypes: 'ประเภทหวย',
    siteInfo: 'ข้อมูลเว็บไซต์',
    contact: 'ติดต่อทีมงาน',
    team: 'ทีมงาน Huay Update',
    email: 'อีเมล',
    policyLinks: [
      { href: '/th', label: 'หน้าแรก' },
      { href: '/th/about', label: 'เกี่ยวกับเรา' },
      { href: '/th/policy', label: 'นโยบาย' },
      { href: '/th/lottery-formula', label: 'สูตรคำนวณหวย' },
      { href: '/th/blog', label: 'บทความ' },
      { href: '/th/blog/แหล่งข้อมูลผลหวย-ความน่าเชื่อถือ', label: 'แหล่งข้อมูล' },
      { href: '/th/blog/เล่นหวยอย่างมีสติ', label: 'เล่นอย่างมีสติ' },
      { href: '/sitemap.xml', label: 'Sitemap' },
    ],
    groupLabels: {
      'lotto-thai': 'หวยไทย',
      'lotto-foreign': 'หวยต่างประเทศ',
      'lotto-stock': 'หวยหุ้น',
      'lotto-daily': 'หวยรายวัน',
    },
  },
  en: {
    description: 'Check today lottery results across Thai lottery, Lao lottery, stock lottery, Hanoi lottery, and daily markets with quick updates and result history.',
    note: 'Lottery result data is provided for checking and reference only. Please verify again with official result sources.',
    lotteryTypes: 'Lottery Types',
    siteInfo: 'Website Info',
    contact: 'Contact the Team',
    team: 'Huay Update Team',
    email: 'Email',
    policyLinks: [
      { href: '/en', label: 'Home' },
      { href: '/en/about', label: 'About Us' },
      { href: '/en/policy', label: 'Policy' },
      { href: '/en/lottery-formula', label: 'Lottery Formula' },
      { href: '/en/blog', label: 'Blog' },
      { href: '/en/blog/our-data-sources', label: 'Data Sources' },
      { href: '/en/blog/responsible-play', label: 'Responsible Play' },
      { href: '/sitemap.xml', label: 'Sitemap' },
    ],
    groupLabels: {
      'lotto-thai': 'Thai Lottery',
      'lotto-foreign': 'Foreign Lottery',
      'lotto-stock': 'Stock Lottery',
      'lotto-daily': 'Daily Lottery',
    },
  },
  la: {
    description: 'ກວດຜົນຫວຍມື້ນີ້ຄົບທຸກປະເພດ ຫວຍໄທ ຫວຍລາວ ຫວຍຫຸ້ນ ຫວຍຮານອຍ ອັບເດດໄວ ແລະເບິ່ງຜົນຍ້ອນຫຼັງໄດ້.',
    note: 'ຂໍ້ມູນຜົນຫວຍໃຊ້ເພື່ອການກວດສອບ ແລະອ້າງອີງເທົ່ານັ້ນ ກະລຸນາກວດກັບແຫຼ່ງປະກາດຜົນທາງການອີກຄັ້ງ.',
    lotteryTypes: 'ປະເພດຫວຍ',
    siteInfo: 'ຂໍ້ມູນເວັບໄຊ',
    contact: 'ຕິດຕໍ່ທີມງານ',
    team: 'ທີມງານ Huay Update',
    email: 'ອີເມວ',
    policyLinks: [
      { href: '/la', label: 'ໜ້າຫຼັກ' },
      { href: '/la/about', label: 'ກ່ຽວກັບເຮົາ' },
      { href: '/la/policy', label: 'ນະໂຍບາຍ' },
      { href: '/la/lottery-formula', label: 'ສູດຄຳນວນຫວຍ' },
      { href: '/la/blog', label: 'ບົດຄວາມ' },
      { href: '/la/blog/our-data-sources', label: 'ແຫຼ່ງຂໍ້ມູນ' },
      { href: '/la/blog/responsible-play', label: 'ຫຼິ້ນຢ່າງມີສະຕິ' },
      { href: '/sitemap.xml', label: 'Sitemap' },
    ],
    groupLabels: {
      'lotto-thai': 'ຫວຍໄທ',
      'lotto-foreign': 'ຫວຍຕ່າງປະເທດ',
      'lotto-stock': 'ຫວຍຫຸ້ນ',
      'lotto-daily': 'ຫວຍລາຍວັນ',
    },
  },
  kh: {
    description: 'ពិនិត្យលទ្ធផលឆ្នោតថ្ងៃនេះគ្រប់ប្រភេទ រួមមានឆ្នោតថៃ ឆ្នោតឡាវ ឆ្នោតហ៊ុន ឆ្នោតហាណូយ អាប់ដេតរហ័ស និងមើលប្រវត្តិលទ្ធផលបាន.',
    note: 'ទិន្នន័យលទ្ធផលឆ្នោតផ្តល់សម្រាប់ការត្រួតពិនិត្យ និងយោងប៉ុណ្ណោះ សូមផ្ទៀងផ្ទាត់ម្តងទៀតជាមួយប្រភពផ្លូវការ.',
    lotteryTypes: 'ប្រភេទឆ្នោត',
    siteInfo: 'ព័ត៌មានគេហទំព័រ',
    contact: 'ទាក់ទងក្រុមការងារ',
    team: 'ក្រុមការងារ Huay Update',
    email: 'អ៊ីមែល',
    policyLinks: [
      { href: '/kh', label: 'ទំព័រដើម' },
      { href: '/kh/about', label: 'អំពីយើង' },
      { href: '/kh/policy', label: 'គោលការណ៍' },
      { href: '/kh/lottery-formula', label: 'រូបមន្តគណនាឆ្នោត' },
      { href: '/kh/blog', label: 'អត្ថបទ' },
      { href: '/kh/blog/our-data-sources', label: 'ប្រភពទិន្នន័យ' },
      { href: '/kh/blog/responsible-play', label: 'លេងដោយមានស្មារតី' },
      { href: '/sitemap.xml', label: 'Sitemap' },
    ],
    groupLabels: {
      'lotto-thai': 'ឆ្នោតថៃ',
      'lotto-foreign': 'ឆ្នោតបរទេស',
      'lotto-stock': 'ឆ្នោតហ៊ុន',
      'lotto-daily': 'ឆ្នោតប្រចាំថ្ងៃ',
    },
  },
  zh: {
    description: '查看今日各类彩票开奖结果，包括泰国彩票、老挝彩票、股票彩票、河内彩票和每日市场，更新快速并支持历史记录。',
    note: '彩票结果数据仅供查询和参考，请再次以官方开奖来源为准。',
    lotteryTypes: '彩票分类',
    siteInfo: '网站信息',
    contact: '联系团队',
    team: 'Huay Update 团队',
    email: '电子邮件',
    policyLinks: [
      { href: '/zh', label: '首页' },
      { href: '/zh/about', label: '关于我们' },
      { href: '/zh/policy', label: '政策' },
      { href: '/zh/lottery-formula', label: '彩票公式' },
      { href: '/zh/blog', label: '博客' },
      { href: '/zh/blog/our-data-sources', label: '数据来源' },
      { href: '/zh/blog/responsible-play', label: '负责任娱乐' },
      { href: '/sitemap.xml', label: 'Sitemap' },
    ],
    groupLabels: {
      'lotto-thai': '泰国彩票',
      'lotto-foreign': '国外彩票',
      'lotto-stock': '股票彩票',
      'lotto-daily': '每日彩票',
    },
  },
}

function langFromPath(pathname: string | null): Lang {
  const firstSegment = pathname?.split('/').filter(Boolean)[0]
  return isLang(firstSegment) ? firstSegment : 'th'
}

export default function SiteFooter() {
  const pathname = usePathname()
  const lang = langFromPath(pathname)
  const copy = footerCopy[lang]
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link href={`/${lang}`} className="site-footer-logo" aria-label={siteName}>
            <Image src="/logo.png" alt="" width={40} height={40} />
            <span>{siteName}</span>
          </Link>
          <p>{copy.description}</p>
          <p className="site-footer-note">
            {copy.note}
          </p>
        </div>

        <nav className="site-footer-nav" aria-label={copy.lotteryTypes}>
          <h2>{copy.lotteryTypes}</h2>
          <div>
            {lotteryGroups.map(group => (
              <Link key={group.code} href={`/${lang}/lottery/group/${group.code}`}>
                {copy.groupLabels[group.code] ?? group.name}
              </Link>
            ))}
          </div>
        </nav>

        <nav className="site-footer-nav" aria-label={copy.siteInfo}>
          <h2>{copy.siteInfo}</h2>
          <div>
            {copy.policyLinks.map(link => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <section className="site-footer-nav" aria-label={copy.contact}>
          <h2>{copy.contact}</h2>
          <div>
            <span className="site-footer-text">{copy.team}</span>
            <a href={`mailto:${contactEmail}`}>{copy.email}: {contactEmail}</a>
          </div>
        </section>
      </div>

      <div className="site-footer-bottom">
        <span>© {year} {siteName}. All rights reserved.</span>
        <span>huayupdate.live</span>
      </div>
    </footer>
  )
}
