import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/app/breadcrumbs'
import LangSwitcher from '@/app/lang-switcher'
import { fetchLotteryByDate, todayBangkok, type Group } from '@/lib/lottery-api'
import { LANG_LOCALE, type Lang } from '@/lib/i18n'
import {
  absoluteUrl,
  baseOpenGraph,
  baseTwitter,
  breadcrumbJsonLd,
  isSeoLang,
  languageAlternates,
  localizedPath,
  lotteryGroupName,
  lotteryGroups,
  siteKeywords,
  siteName,
} from '@/lib/seo'

export const revalidate = 3600

type PageProps = {
  params: Promise<{ lang: string }>
}

type GuideSection = {
  heading: string
  body: string
}

type FaqItem = {
  question: string
  answer: string
}

type GuideCopy = {
  home: string
  metaTitle: string
  metaDescription: string
  kicker: string
  title: string
  lead: string
  todayResults: string
  formula: string
  summaryLabel: string
  summaryTitle: string
  summaryBody: string
  groupsTitle: string
  marketsTitle: string
  marketsFallback: string
  noMarkets: string
  guideTitle: string
  categoryIntro: string
  categoryCta: string
  sections: GuideSection[]
  faqTitle: string
  faq: FaqItem[]
}

const pagePath = '/guide'

const GUIDE_COPY: Record<Lang, GuideCopy> = {
  th: {
    home: 'หน้าแรก',
    metaTitle: 'แนวทางหวยครบทุกหวย | หวยไทย หวยลาว ฮานอย หวยหุ้น รายวัน',
    metaDescription: 'แนวทางตรวจหวยและอ่านผลหวยครบทุกประเภท ทั้งหวยไทย หวยลาว หวยฮานอย หวยต่างประเทศ หวยหุ้น และหวยรายวัน พร้อมวิธีดูผลย้อนหลังอย่างเหมาะกับ SEO',
    kicker: 'แนวทางตรวจหวย',
    title: 'แนวทางหวยครบทุกหวย',
    lead: 'รวมวิธีอ่านผลหวยและแนวทางติดตามผลรางวัลสำหรับทุกหมวดใน Huay Update ทั้งหวยไทย หวยต่างประเทศ หวยลาว หวยฮานอย หวยหุ้น และหวยรายวัน โดยเน้นข้อมูลผลรางวัลจริงและผลย้อนหลัง',
    todayResults: 'ตรวจผลหวยวันนี้',
    formula: 'สูตรคำนวณหวย',
    summaryLabel: 'Huay Update Guide',
    summaryTitle: 'หน้าเดียวสำหรับเริ่มดูผลหวยทุกประเภท',
    summaryBody: 'เลือกหมวดหวยที่ต้องการ ดูรายชื่อตลาดหวยทั้งหมด แล้วเปิดหน้าผลล่าสุดหรือผลย้อนหลังตามวันที่ได้ทันที',
    groupsTitle: 'หมวดหวยทั้งหมด',
    marketsTitle: 'รายชื่อตลาดหวยในระบบ',
    marketsFallback: 'ตลาดหวย',
    noMarkets: 'กำลังอัปเดตรายชื่อตลาดหวย',
    guideTitle: 'วิธีใช้แนวทางหวยให้ครบและปลอดภัย',
    categoryIntro: 'ดูผลล่าสุดและผลย้อนหลังของ',
    categoryCta: 'เปิดดูผล',
    sections: [
      { heading: 'หวยไทย', body: 'หวยไทยเหมาะสำหรับตรวจรางวัลสลากกินแบ่งรัฐบาลและเลขรางวัลสำคัญ เช่น รางวัลที่ 1 เลขหน้า เลขท้าย และเลขท้าย 2 ตัว ควรตรวจตามงวดวันที่และเทียบกับประกาศผลอย่างเป็นทางการ' },
      { heading: 'หวยลาวและหวยต่างประเทศ', body: 'หวยลาว หวยฮานอย และหวยต่างประเทศมีหลายตลาดและอาจมีเวลาออกผลต่างกัน การดูผลควรแยกตามชื่อตลาด เช่น ลาว TV ลาวประตูชัย ฮานอย VIP ฮานอยพิเศษ หรือฮานอยปกติ' },
      { heading: 'หวยหุ้น', body: 'หวยหุ้นมักอ้างอิงตลาดหุ้นหรือดัชนีที่เกี่ยวข้อง ควรตรวจเลข 3 ตัวบน 2 ตัวบน และ 2 ตัวล่างจากหน้าตลาดหวยหุ้นแต่ละรายการ พร้อมดูประวัติย้อนหลังเพื่อเปรียบเทียบข้อมูล' },
      { heading: 'หวยรายวัน', body: 'หวยรายวันออกผลบ่อย เหมาะกับการติดตามแบบปฏิทินรายวัน เลือกวันที่ที่ต้องการแล้วตรวจทุกตลาดในวันเดียว ช่วยลดการสับสนระหว่างงวดเก่าและงวดใหม่' },
      { heading: 'ผลหวยย้อนหลัง', body: 'หน้าผลย้อนหลังช่วยดูข้อมูลตามวันที่และตามตลาดหวย ใช้สำหรับตรวจซ้ำ จดสถิติส่วนตัว และเปรียบเทียบรูปแบบเลขเดิม โดยไม่ควรใช้เป็นการรับประกันผลในอนาคต' },
      { heading: 'แนวทางเลขอย่างรับผิดชอบ', body: 'แนวทางหวยควรใช้เพื่อจัดระเบียบข้อมูลและความบันเทิงเท่านั้น ผลหวยเป็นเหตุการณ์สุ่ม ควรกำหนดงบประมาณ ตรวจผลจากข้อมูลล่าสุด และหลีกเลี่ยงการเชื่อคำชี้นำที่รับประกันผล' },
    ],
    faqTitle: 'คำถามที่พบบ่อย',
    faq: [
      { question: 'หน้าแนวทางรวมหวยอะไรบ้าง', answer: 'รวมหมวดหวยไทย หวยต่างประเทศ หวยลาว หวยฮานอย หวยหุ้น และหวยรายวันที่ระบบ Huay Update มีข้อมูลผลรางวัล' },
      { question: 'ดูผลหวยย้อนหลังได้ไหม', answer: 'ดูได้ทั้งตามวันที่ ตามหมวดหวย และตามตลาดหวยแต่ละรายการจากลิงก์ในหน้านี้' },
      { question: 'แนวทางหวยรับประกันผลหรือไม่', answer: 'ไม่รับประกันผลรางวัล ข้อมูลในหน้านี้ช่วยอธิบายวิธีตรวจและจัดระเบียบผลหวยเท่านั้น' },
    ],
  },
  en: {
    home: 'Home',
    metaTitle: 'Complete Lottery Guide | Thai, Lao, Hanoi, Stock and Daily Lottery',
    metaDescription: 'A complete guide to checking Thai lottery, Lao lottery, Hanoi lottery, international lottery, stock lottery and daily lottery results with history links.',
    kicker: 'Lottery result guide',
    title: 'Complete Lottery Guide',
    lead: 'A practical guide to reading lottery results across Huay Update, covering Thai lottery, international lottery, Lao lottery, Hanoi lottery, stock lottery and daily lottery with result history.',
    todayResults: 'Check today results',
    formula: 'Lottery formula',
    summaryLabel: 'Huay Update Guide',
    summaryTitle: 'One starting page for every lottery type',
    summaryBody: 'Choose a lottery category, scan all available markets, then open latest results or historical results by date.',
    groupsTitle: 'All lottery categories',
    marketsTitle: 'Available lottery markets',
    marketsFallback: 'Lottery markets',
    noMarkets: 'Market list is being updated',
    guideTitle: 'How to use lottery guides responsibly',
    categoryIntro: 'View latest and historical results for',
    categoryCta: 'Open results',
    sections: [
      { heading: 'Thai Lottery', body: 'Thai lottery results are best checked by draw date and official prize type, including first prize and key ending numbers. Always compare the date before reviewing the numbers.' },
      { heading: 'Lao and International Lottery', body: 'Lao, Hanoi and other international lottery markets can have different draw times. Check by market name, such as Lao TV, Lao Patuxay, Hanoi VIP, special Hanoi or regular Hanoi.' },
      { heading: 'Stock Lottery', body: 'Stock lottery markets are usually linked to stock exchanges or market indexes. Review 3 top, 2 top and 2 bottom results on each market page, then compare them with history if needed.' },
      { heading: 'Daily Lottery', body: 'Daily lottery markets draw frequently, so a date-based view helps keep old and new results separate while letting you check every market for the selected day.' },
      { heading: 'Lottery History', body: 'Historical result pages help you recheck numbers by date and by market. They are useful for personal notes and comparison, but they do not predict future outcomes.' },
      { heading: 'Responsible Number Notes', body: 'Use lottery guides to organize information and for entertainment. Lottery results are random, so set limits, check fresh data and avoid claims that guarantee a result.' },
    ],
    faqTitle: 'Frequently Asked Questions',
    faq: [
      { question: 'What lottery types are included', answer: 'The guide covers Thai lottery, international lottery, Lao lottery, Hanoi lottery, stock lottery and daily markets available on Huay Update.' },
      { question: 'Can I view lottery history', answer: 'Yes. You can open history by date, category or individual market from the links on this page.' },
      { question: 'Does this guide guarantee lottery results', answer: 'No. It explains how to check and organize lottery results, without any prize guarantee.' },
    ],
  },
  la: {
    home: 'ໜ້າຫຼັກ',
    metaTitle: 'ແນວທາງຫວຍຄົບທຸກປະເພດ | ຫວຍໄທ ລາວ ຮານອຍ ຫຸ້ນ ລາຍວັນ',
    metaDescription: 'ແນວທາງກວດຜົນຫວຍຄົບທຸກປະເພດ ລວມຫວຍໄທ ຫວຍລາວ ຮານອຍ ຫວຍຫຸ້ນ ແລະຫວຍລາຍວັນ ພ້ອມຜົນຍ້ອນຫຼັງ',
    kicker: 'ແນວທາງກວດຫວຍ',
    title: 'ແນວທາງຫວຍຄົບທຸກປະເພດ',
    lead: 'ຄູ່ມືອ່ານຜົນຫວຍໃນ Huay Update ຄອບຄຸມຫວຍໄທ ຫວຍຕ່າງປະເທດ ຫວຍລາວ ຮານອຍ ຫວຍຫຸ້ນ ແລະຫວຍລາຍວັນ',
    todayResults: 'ກວດຜົນຫວຍມື້ນີ້',
    formula: 'ສູດຄຳນວນຫວຍ',
    summaryLabel: 'Huay Update Guide',
    summaryTitle: 'ໜ້າເລີ່ມຕົ້ນສຳລັບຫວຍທຸກປະເພດ',
    summaryBody: 'ເລືອກໝວດຫວຍ ເບິ່ງລາຍຊື່ຕະຫຼາດຫວຍ ແລ້ວເປີດຜົນລ່າສຸດ ຫຼື ຜົນຍ້ອນຫຼັງຕາມວັນທີ',
    groupsTitle: 'ໝວດຫວຍທັງໝົດ',
    marketsTitle: 'ລາຍຊື່ຕະຫຼາດຫວຍໃນລະບົບ',
    marketsFallback: 'ຕະຫຼາດຫວຍ',
    noMarkets: 'ກຳລັງອັບເດດລາຍຊື່ຕະຫຼາດຫວຍ',
    guideTitle: 'ວິທີໃຊ້ແນວທາງຫວຍຢ່າງຮັບຜິດຊອບ',
    categoryIntro: 'ເບິ່ງຜົນລ່າສຸດ ແລະຜົນຍ້ອນຫຼັງຂອງ',
    categoryCta: 'ເປີດຜົນ',
    sections: [
      { heading: 'ຫວຍໄທ', body: 'ຫວຍໄທຄວນກວດຕາມງວດວັນທີ ແລະປະເພດລາງວັນສຳຄັນ ເຊັ່ນ ລາງວັນທີ 1 ແລະເລກທ້າຍ 2 ໂຕ' },
      { heading: 'ຫວຍລາວ ແລະຫວຍຕ່າງປະເທດ', body: 'ຫວຍລາວ ຮານອຍ ແລະຫວຍຕ່າງປະເທດມີຫຼາຍຕະຫຼາດ ແລະເວລາອອກຜົນອາດຕ່າງກັນ ຄວນກວດແຍກຕາມຊື່ຕະຫຼາດ' },
      { heading: 'ຫວຍຫຸ້ນ', body: 'ຫວຍຫຸ້ນມັກກ່ຽວຂ້ອງກັບຕະຫຼາດຫຸ້ນ ຫຼືດັດຊະນີ ກວດ 3 ໂຕເທິງ 2 ໂຕເທິງ ແລະ 2 ໂຕລຸ່ມໃນໜ້າຕະຫຼາດແຕ່ລະລາຍການ' },
      { heading: 'ຫວຍລາຍວັນ', body: 'ຫວຍລາຍວັນອອກຜົນບ່ອຍ ການເລືອກວັນທີຈະຊ່ວຍແຍກຜົນເກົ່າ ແລະຜົນໃໝ່ໄດ້ຊັດເຈນ' },
      { heading: 'ຜົນຫວຍຍ້ອນຫຼັງ', body: 'ໜ້າຜົນຍ້ອນຫຼັງຊ່ວຍກວດຊ້ຳຕາມວັນທີ ແລະຕາມຕະຫຼາດ ເໝາະສຳລັບບັນທຶກສ່ວນຕົວ ແຕ່ບໍ່ແມ່ນການທຳນາຍ' },
      { heading: 'ໃຊ້ແນວທາງຢ່າງຮັບຜິດຊອບ', body: 'ແນວທາງຫວຍເໝາະສຳລັບຈັດລະບຽບຂໍ້ມູນ ແລະຄວາມບັນເທີງ ຜົນຫວຍເປັນການສຸ່ມ ບໍ່ຄວນເຊື່ອການຮັບປະກັນຜົນ' },
    ],
    faqTitle: 'ຄໍາຖາມທີ່ພົບເລື້ອຍ',
    faq: [
      { question: 'ໜ້າແນວທາງລວມຫວຍຫຍັງແດ່', answer: 'ລວມຫວຍໄທ ຫວຍຕ່າງປະເທດ ຫວຍລາວ ຮານອຍ ຫວຍຫຸ້ນ ແລະຫວຍລາຍວັນທີ່ມີຂໍ້ມູນໃນ Huay Update' },
      { question: 'ເບິ່ງຜົນຍ້ອນຫຼັງໄດ້ບໍ', answer: 'ໄດ້ ທັງຕາມວັນທີ ຕາມໝວດ ແລະຕາມຕະຫຼາດຫວຍແຕ່ລະລາຍການ' },
      { question: 'ແນວທາງຮັບປະກັນຜົນບໍ', answer: 'ບໍ່ຮັບປະກັນ ໜ້ານີ້ຊ່ວຍອະທິບາຍວິທີກວດ ແລະຈັດລະບຽບຜົນຫວຍເທົ່ານັ້ນ' },
    ],
  },
  kh: {
    home: 'ទំព័រដើម',
    metaTitle: 'មគ្គុទ្ទេសក៍ឆ្នោតគ្រប់ប្រភេទ | ថៃ ឡាវ ហាណូយ ហ៊ុន ប្រចាំថ្ងៃ',
    metaDescription: 'មគ្គុទ្ទេសក៍ពិនិត្យលទ្ធផលឆ្នោតគ្រប់ប្រភេទ រួមមានឆ្នោតថៃ ឡាវ ហាណូយ ឆ្នោតបរទេស ឆ្នោតហ៊ុន និងឆ្នោតប្រចាំថ្ងៃ ជាមួយប្រវត្តិលទ្ធផល',
    kicker: 'មគ្គុទ្ទេសក៍លទ្ធផលឆ្នោត',
    title: 'មគ្គុទ្ទេសក៍ឆ្នោតគ្រប់ប្រភេទ',
    lead: 'វិធីអានលទ្ធផលឆ្នោតនៅ Huay Update សម្រាប់ឆ្នោតថៃ ឆ្នោតបរទេស ឆ្នោតឡាវ ហាណូយ ឆ្នោតហ៊ុន និងឆ្នោតប្រចាំថ្ងៃ ជាមួយទំព័រប្រវត្តិលទ្ធផល',
    todayResults: 'ពិនិត្យលទ្ធផលថ្ងៃនេះ',
    formula: 'រូបមន្តគណនាឆ្នោត',
    summaryLabel: 'Huay Update Guide',
    summaryTitle: 'ទំព័រចាប់ផ្តើមសម្រាប់ឆ្នោតគ្រប់ប្រភេទ',
    summaryBody: 'ជ្រើសប្រភេទឆ្នោត មើលបញ្ជីទីផ្សារទាំងអស់ បន្ទាប់មកបើកលទ្ធផលថ្មី ឬប្រវត្តិតាមថ្ងៃ',
    groupsTitle: 'ប្រភេទឆ្នោតទាំងអស់',
    marketsTitle: 'ទីផ្សារឆ្នោតក្នុងប្រព័ន្ធ',
    marketsFallback: 'ទីផ្សារឆ្នោត',
    noMarkets: 'កំពុងធ្វើបច្ចុប្បន្នភាពបញ្ជីទីផ្សារ',
    guideTitle: 'របៀបប្រើមគ្គុទ្ទេសក៍ដោយទំនួលខុសត្រូវ',
    categoryIntro: 'មើលលទ្ធផលថ្មី និងប្រវត្តិសម្រាប់',
    categoryCta: 'បើកលទ្ធផល',
    sections: [
      { heading: 'ឆ្នោតថៃ', body: 'ឆ្នោតថៃគួរត្រួតពិនិត្យតាមថ្ងៃចេញឆ្នោត និងប្រភេទរង្វាន់សំខាន់ៗ ដូចជារង្វាន់ទី 1 និងលេខចុងក្រោយ' },
      { heading: 'ឆ្នោតឡាវ និងឆ្នោតបរទេស', body: 'ឆ្នោតឡាវ ហាណូយ និងឆ្នោតបរទេសមានទីផ្សារច្រើន ហើយម៉ោងចេញលទ្ធផលអាចខុសគ្នា។ គួរពិនិត្យតាមឈ្មោះទីផ្សារនីមួយៗ' },
      { heading: 'ឆ្នោតហ៊ុន', body: 'ឆ្នោតហ៊ុនជាធម្មតាពាក់ព័ន្ធនឹងទីផ្សារហ៊ុន ឬសន្ទស្សន៍។ ពិនិត្យលេខ 3 ខ្ទង់លើ 2 ខ្ទង់លើ និង 2 ខ្ទង់ក្រោមនៅទំព័រទីផ្សារនីមួយៗ' },
      { heading: 'ឆ្នោតប្រចាំថ្ងៃ', body: 'ឆ្នោតប្រចាំថ្ងៃចេញលទ្ធផលញឹកញាប់។ ការជ្រើសថ្ងៃជួយបំបែកលទ្ធផលចាស់ និងថ្មីឱ្យច្បាស់' },
      { heading: 'ប្រវត្តិលទ្ធផលឆ្នោត', body: 'ទំព័រប្រវត្តិជួយពិនិត្យឡើងវិញតាមថ្ងៃ និងតាមទីផ្សារ សម្រាប់កំណត់ត្រាផ្ទាល់ខ្លួន ប៉ុន្តែមិនមែនជាការទស្សន៍ទាយអនាគត' },
      { heading: 'ការកត់ត្រាលេខដោយទំនួលខុសត្រូវ', body: 'ប្រើមគ្គុទ្ទេសក៍សម្រាប់រៀបចំព័ត៌មាន និងការកម្សាន្ត។ លទ្ធផលឆ្នោតមានភាពចៃដន្យ ហើយមិនគួរជឿការធានាលទ្ធផល' },
    ],
    faqTitle: 'សំណួរដែលសួរញឹកញាប់',
    faq: [
      { question: 'ទំព័រនេះរួមបញ្ចូលឆ្នោតអ្វីខ្លះ', answer: 'រួមមានឆ្នោតថៃ ឆ្នោតបរទេស ឆ្នោតឡាវ ហាណូយ ឆ្នោតហ៊ុន និងទីផ្សារប្រចាំថ្ងៃដែលមាននៅ Huay Update' },
      { question: 'អាចមើលប្រវត្តិលទ្ធផលបានទេ', answer: 'បាន។ អាចបើកតាមថ្ងៃ តាមប្រភេទ ឬតាមទីផ្សារនីមួយៗពីតំណនៅទំព័រនេះ' },
      { question: 'មគ្គុទ្ទេសក៍នេះធានាលទ្ធផលទេ', answer: 'មិនធានា។ ទំព័រនេះពន្យល់របៀបពិនិត្យ និងរៀបចំលទ្ធផលឆ្នោតប៉ុណ្ណោះ' },
    ],
  },
  zh: {
    home: '首页',
    metaTitle: '完整彩票指南 | 泰国、老挝、河内、股票和每日彩票',
    metaDescription: '完整的彩票开奖结果指南，涵盖泰国彩票、老挝彩票、河内彩票、国外彩票、股票彩票和每日彩票，并提供历史结果链接。',
    kicker: '彩票结果指南',
    title: '完整彩票指南',
    lead: '了解如何在 Huay Update 查看泰国彩票、国外彩票、老挝彩票、河内彩票、股票彩票和每日彩票结果，并按日期查看历史记录。',
    todayResults: '查看今日结果',
    formula: '彩票公式',
    summaryLabel: 'Huay Update Guide',
    summaryTitle: '所有彩票类型的入口页',
    summaryBody: '选择彩票分类，浏览所有可用市场，然后按日期打开最新结果或历史结果。',
    groupsTitle: '全部彩票分类',
    marketsTitle: '系统内彩票市场',
    marketsFallback: '彩票市场',
    noMarkets: '彩票市场列表正在更新',
    guideTitle: '如何负责任地使用彩票指南',
    categoryIntro: '查看最新和历史结果：',
    categoryCta: '打开结果',
    sections: [
      { heading: '泰国彩票', body: '泰国彩票适合按开奖日期和奖项类型查看，包括一等奖和重要尾号。查看号码前应先确认开奖日期。' },
      { heading: '老挝和国外彩票', body: '老挝、河内及其他国外彩票有多个市场，开奖时间可能不同。请按市场名称查看，如老挝 TV、老挝凯旋门、河内 VIP 或河内特别版。' },
      { heading: '股票彩票', body: '股票彩票通常与股票市场或指数相关。可在各市场页面查看前三位、前两位和后两位结果，并按历史记录比较。' },
      { heading: '每日彩票', body: '每日彩票开奖频繁，按日期查看可以清楚区分旧结果和新结果，并检查所选日期的所有市场。' },
      { heading: '彩票历史结果', body: '历史结果页面可按日期和市场复查号码，适合个人记录和比较，但不能预测未来结果。' },
      { heading: '负责任的号码记录', body: '彩票指南仅用于整理信息和娱乐。彩票结果具有随机性，应设置限制，查看最新数据，并避免相信保证中奖的说法。' },
    ],
    faqTitle: '常见问题',
    faq: [
      { question: '本指南包含哪些彩票类型', answer: '包含 Huay Update 上的泰国彩票、国外彩票、老挝彩票、河内彩票、股票彩票和每日彩票市场。' },
      { question: '可以查看历史结果吗', answer: '可以。你可以通过本页链接按日期、分类或单个市场查看历史结果。' },
      { question: '本指南保证开奖结果吗', answer: '不保证。本页只说明如何查看和整理彩票结果。' },
    ],
  },
}

async function getGuideGroups(lang: Lang): Promise<Group[]> {
  try {
    const response = await fetchLotteryByDate(todayBangkok(), lang)
    return response.data?.groups ?? []
  } catch {
    return []
  }
}

function faqJsonLd(copy: GuideCopy) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  if (!isSeoLang(lang)) return { title: 'Not found', robots: { index: false, follow: false } }

  const copy = GUIDE_COPY[lang]
  const canonical = localizedPath(pagePath, lang)

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    keywords: [
      ...siteKeywords,
      copy.title,
      'แนวทางหวย',
      'หวยครบทุกหวย',
      'หวยฮานอย',
      'หวยลาว',
      'stock lottery guide',
    ],
    alternates: {
      canonical,
      languages: languageAlternates(pagePath),
    },
    openGraph: baseOpenGraph(canonical, copy.metaTitle, copy.metaDescription),
    twitter: baseTwitter(copy.metaTitle, copy.metaDescription),
    robots: { index: true, follow: true },
  }
}

export default async function GuidePage({ params }: PageProps) {
  const { lang } = await params
  if (!isSeoLang(lang)) notFound()

  const currentLang = lang as Lang
  const copy = GUIDE_COPY[currentLang]
  const groups = await getGuideGroups(currentLang)
  const canonical = localizedPath(pagePath, currentLang)
  const today = todayBangkok()
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
  const breadcrumbs = breadcrumbJsonLd([
    { name: copy.home, item: localizedPath('/', currentLang) },
    { name: copy.title, item: canonical },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(copy)) }} />

      <div className="breadcrumbs-row">
        <Breadcrumbs items={[
          { href: localizedPath('/', currentLang), label: copy.home },
          { label: copy.title },
        ]} />
        <LangSwitcher lang={currentLang} />
      </div>

      <main className="lottery-topic-page guide-page">
        <section className="lottery-topic-hero">
          <div>
            <p className="lottery-topic-kicker">{copy.kicker}</p>
            <h1>{copy.title}</h1>
            <p>{copy.lead}</p>
            <div className="lottery-topic-actions">
              <Link href={localizedPath(`/lottery/${today}`, currentLang)}>
                {copy.todayResults}
              </Link>
              <Link href={localizedPath('/lottery-formula', currentLang)}>
                {copy.formula}
              </Link>
            </div>
          </div>
          <aside>
            <span>{copy.summaryLabel}</span>
            <strong>{copy.summaryTitle}</strong>
            <p>{copy.summaryBody}</p>
          </aside>
        </section>

        <section className="lottery-topic-links guide-category-links" aria-label={copy.groupsTitle}>
          <div>
            <h2>{copy.groupsTitle}</h2>
            <div>
              {lotteryGroups.map(group => {
                const groupName = lotteryGroupName(group.code, currentLang)
                return (
                  <Link key={group.code} href={localizedPath(`/lottery/group/${group.code}`, currentLang)}>
                    {groupName}
                  </Link>
                )
              })}
            </div>
          </div>
          <div>
            <h2>{copy.marketsTitle}</h2>
            <div>
              {groups.length === 0 ? (
                <span className="guide-muted">{copy.noMarkets}</span>
              ) : groups.flatMap(group => group.markets.map(market => (
                <Link key={market.market_id} href={localizedPath(`/market/${market.market_id}`, currentLang)}>
                  {market.market_name || copy.marketsFallback}
                </Link>
              )))}
            </div>
          </div>
        </section>

        <section className="lottery-topic-grid guide-group-grid" aria-label={copy.groupsTitle}>
          {lotteryGroups.map(group => {
            const groupName = lotteryGroupName(group.code, currentLang)
            return (
              <article key={group.code} className="lottery-topic-card">
                <h2>{groupName}</h2>
                <p>{copy.categoryIntro} {groupName}</p>
                <Link href={localizedPath(`/lottery/group/${group.code}`, currentLang)}>
                  {copy.categoryCta}
                </Link>
              </article>
            )
          })}
        </section>

        <section className="lottery-topic-grid guide-section-grid" aria-label={copy.guideTitle}>
          {copy.sections.map(section => (
            <article key={section.heading} className="lottery-topic-card">
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </section>

        <section className="lottery-topic-faq">
          <h2>{copy.faqTitle}</h2>
          <div>
            {copy.faq.map(item => (
              <article key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
