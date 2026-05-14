import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/app/breadcrumbs'
import LangSwitcher from '@/app/lang-switcher'
import { fetchLotteryByDate, todayBangkok, type Group } from '@/lib/lottery-api'
import { LANG_LOCALE, type Lang } from '@/lib/i18n'
import { localizedMarketPath } from '@/lib/market-url'
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
import LuckyNumbersClient, { type LuckyNumberRow } from './lucky-numbers-client'

export const revalidate = 3600

type PageProps = {
  params: Promise<{ lang: string }>
}

type ArticleSection = {
  heading: string
  body: string
}

type FaqItem = {
  question: string
  answer: string
}

type LuckyCopy = {
  home: string
  metaTitle: string
  metaDescription: string
  kicker: string
  title: string
  lead: string
  todayResults: string
  guide: string
  summaryLabel: string
  summaryTitle: string
  summaryBody: string
  articleTitle: string
  articleSections: ArticleSection[]
  faqTitle: string
  faq: FaqItem[]
  table: {
    all: string
    randomAgain: string
    tableTitle: string
    category: string
    lottery: string
    top3: string
    top2: string
    bottom2: string
    highlight: string
    pair: string
    history: string
    empty: string
  }
}

const pagePath = '/lucky-numbers'

const LUCKY_COPY: Record<Lang, LuckyCopy> = {
  th: {
    home: 'หน้าแรก',
    metaTitle: 'เลขเด็ด สุ่มเลขหวยทุกประเภท | Huay Update',
    metaDescription: 'สุ่มเลขเด็ดหวยทุกประเภทในรูปแบบตาราง ครบทั้งหวยไทย หวยลาว หวยฮานอย หวยหุ้น หวยต่างประเทศ และหวยรายวัน พร้อมแนวทางอ่านเลขและบทความ SEO',
    kicker: 'เลขเด็ดวันนี้',
    title: 'เลขเด็ด สุ่มเลขหวยทุกประเภท',
    lead: 'สุ่มเลขหวยสำหรับทุกหมวดและทุกตลาดในระบบ Huay Update แสดงเป็นตารางอ่านง่าย พร้อมเลข 3 ตัวบน 2 ตัวบน 2 ตัวล่าง เลขเด่น และเลขจับคู่ ใช้เป็นแนวทางบันทึกส่วนตัวเท่านั้น',
    todayResults: 'ตรวจผลหวยวันนี้',
    guide: 'อ่านแนวทางหวย',
    summaryLabel: 'Lucky Numbers',
    summaryTitle: 'สุ่มเลขครบทุกหวยในหน้าเดียว',
    summaryBody: 'ตารางนี้สร้างเลขแนวทางสำหรับแต่ละตลาดหวย สามารถกดสุ่มใหม่และเปิดดูประวัติผลของตลาดนั้นได้ทันที',
    articleTitle: 'บทความเลขเด็ดและแนวทางสุ่มเลขหวย',
    articleSections: [
      { heading: 'เลขเด็ดคืออะไร', body: 'เลขเด็ดคือชุดตัวเลขที่ผู้ใช้นำไปจดเป็นแนวทางก่อนตรวจผลหวย โดยอาจมาจากการสุ่ม การดูสถิติย้อนหลัง หรือการจัดชุดเลขส่วนตัว หน้าเลขเด็ดของ Huay Update ออกแบบให้ดูครบทุกหวยและแยกตามประเภทอย่างชัดเจน' },
      { heading: 'สุ่มเลขหวยไทย หวยลาว และหวยฮานอย', body: 'หวยไทย หวยลาว และหวยฮานอยมีรูปแบบการตรวจผลที่นิยมดูเลข 3 ตัวบน 2 ตัวบน และ 2 ตัวล่าง การสุ่มเลขแยกตามตลาดช่วยให้ผู้ใช้ไม่สับสนระหว่างชื่อหวยและงวดที่ต้องการติดตาม' },
      { heading: 'สุ่มเลขหวยหุ้นและหวยรายวัน', body: 'หวยหุ้นและหวยรายวันมีหลายตลาดและออกผลต่างเวลากัน ตารางเลขเด็ดจึงจัดแยกตามประเภทหวยและชื่อตลาด เพื่อให้เปิดดูผลย้อนหลังหรือผลล่าสุดของแต่ละตลาดได้ง่าย' },
      { heading: 'ใช้เลขเด็ดอย่างรับผิดชอบ', body: 'เลขสุ่มเป็นเพียงแนวทางเพื่อความบันเทิงและการจัดระเบียบข้อมูล ผลหวยเป็นเหตุการณ์สุ่ม ไม่มีสูตรหรือเลขเด็ดใดรับประกันผลรางวัล ควรตรวจข้อมูลล่าสุดและกำหนดขอบเขตการใช้งานเสมอ' },
    ],
    faqTitle: 'คำถามที่พบบ่อย',
    faq: [
      { question: 'เลขเด็ดในหน้านี้ครอบคลุมหวยอะไรบ้าง', answer: 'ครอบคลุมตลาดหวยที่ระบบมีข้อมูล เช่น หวยไทย หวยลาว หวยฮานอย หวยต่างประเทศ หวยหุ้น และหวยรายวัน' },
      { question: 'กดสุ่มเลขใหม่ได้ไหม', answer: 'ได้ สามารถกดปุ่มสุ่มใหม่เพื่อสร้างเลข 3 ตัวบน 2 ตัวบน 2 ตัวล่าง เลขเด่น และเลขจับคู่ชุดใหม่' },
      { question: 'เลขเด็ดรับประกันถูกรางวัลหรือไม่', answer: 'ไม่รับประกัน เลขทั้งหมดเป็นเลขสุ่มสำหรับจดแนวทางและใช้เพื่อความบันเทิงเท่านั้น' },
    ],
    table: {
      all: 'ทั้งหมด',
      randomAgain: 'สุ่มใหม่',
      tableTitle: 'ตารางสุ่มเลขหวยทุกประเภท',
      category: 'ประเภทหวย',
      lottery: 'ชื่อหวย',
      top3: '3 ตัวบน',
      top2: '2 ตัวบน',
      bottom2: '2 ตัวล่าง',
      highlight: 'เลขเด่น',
      pair: 'เลขจับคู่',
      history: 'ผลย้อนหลัง',
      empty: 'กำลังอัปเดตรายการหวย',
    },
  },
  en: {
    home: 'Home',
    metaTitle: 'Lucky Numbers Generator for Every Lottery Type | Huay Update',
    metaDescription: 'Generate lucky lottery numbers in a table for Thai lottery, Lao lottery, Hanoi lottery, stock lottery, international lottery and daily lottery, with SEO guide content.',
    kicker: 'Lucky numbers today',
    title: 'Lucky Numbers Generator for Every Lottery Type',
    lead: 'Generate lottery number ideas for every category and market on Huay Update, shown in a clear table with 3 top, 2 top, 2 bottom, highlight digit and paired number for personal notes only.',
    todayResults: 'Check today results',
    guide: 'Read lottery guide',
    summaryLabel: 'Lucky Numbers',
    summaryTitle: 'Every lottery market in one table',
    summaryBody: 'The table creates number ideas for each lottery market. You can generate a fresh set and open the market history right away.',
    articleTitle: 'Lucky number guide and lottery number ideas',
    articleSections: [
      { heading: 'What are lucky numbers', body: 'Lucky numbers are number ideas people save before checking lottery results. They may come from random generation, result history or personal notes. This page organizes them by lottery type and market.' },
      { heading: 'Thai, Lao and Hanoi lottery numbers', body: 'Thai, Lao and Hanoi lottery users often check 3 top, 2 top and 2 bottom formats. Generating numbers by market keeps each lottery name and draw path clear.' },
      { heading: 'Stock and daily lottery numbers', body: 'Stock lottery and daily lottery categories include many markets with different draw schedules. A table grouped by type makes it easier to compare numbers and open result history.' },
      { heading: 'Use lucky numbers responsibly', body: 'Generated numbers are only for entertainment and personal organization. Lottery results are random, and no lucky number or formula can guarantee a prize.' },
    ],
    faqTitle: 'Frequently Asked Questions',
    faq: [
      { question: 'Which lottery types are included', answer: 'The table covers available markets such as Thai lottery, Lao lottery, Hanoi lottery, international lottery, stock lottery and daily lottery.' },
      { question: 'Can I generate new numbers', answer: 'Yes. Use the random button to create a fresh set of 3 top, 2 top, 2 bottom, highlight digit and paired number.' },
      { question: 'Do lucky numbers guarantee a prize', answer: 'No. All numbers are generated for entertainment and personal notes only.' },
    ],
    table: {
      all: 'All',
      randomAgain: 'Generate again',
      tableTitle: 'Lucky number table for every lottery type',
      category: 'Category',
      lottery: 'Lottery',
      top3: '3 Top',
      top2: '2 Top',
      bottom2: '2 Bottom',
      highlight: 'Highlight',
      pair: 'Pair',
      history: 'History',
      empty: 'Lottery list is being updated',
    },
  },
  la: {
    home: 'ໜ້າຫຼັກ',
    metaTitle: 'ເລກເດັດ ສຸ່ມເລກຫວຍທຸກປະເພດ | Huay Update',
    metaDescription: 'ສຸ່ມເລກເດັດຫວຍທຸກປະເພດໃນຮູບແບບຕາຕະລາງ ລວມຫວຍໄທ ຫວຍລາວ ຮານອຍ ຫວຍຫຸ້ນ ແລະຫວຍລາຍວັນ',
    kicker: 'ເລກເດັດມື້ນີ້',
    title: 'ເລກເດັດ ສຸ່ມເລກຫວຍທຸກປະເພດ',
    lead: 'ສຸ່ມແນວທາງເລກຫວຍສຳລັບທຸກໝວດ ແລະທຸກຕະຫຼາດໃນ Huay Update ພ້ອມ 3 ໂຕເທິງ 2 ໂຕເທິງ 2 ໂຕລຸ່ມ ເລກເດັ່ນ ແລະເລກຈັບຄູ່',
    todayResults: 'ກວດຜົນຫວຍມື້ນີ້',
    guide: 'ອ່ານແນວທາງຫວຍ',
    summaryLabel: 'Lucky Numbers',
    summaryTitle: 'ສຸ່ມເລກຄົບທຸກຫວຍໃນໜ້າດຽວ',
    summaryBody: 'ຕາຕະລາງສ້າງເລກແນວທາງໃຫ້ແຕ່ລະຕະຫຼາດ ກົດສຸ່ມໃໝ່ ແລະເປີດປະຫວັດຜົນໄດ້ທັນທີ',
    articleTitle: 'ບົດຄວາມເລກເດັດ ແລະແນວທາງສຸ່ມເລກ',
    articleSections: [
      { heading: 'ເລກເດັດແມ່ນຫຍັງ', body: 'ເລກເດັດແມ່ນຊຸດເລກທີ່ໃຊ້ຈົດເປັນແນວທາງກ່ອນກວດຜົນ ອາດມາຈາກການສຸ່ມ ຜົນຍ້ອນຫຼັງ ຫຼືບັນທຶກສ່ວນຕົວ' },
      { heading: 'ສຸ່ມເລກຫວຍໄທ ຫວຍລາວ ແລະຮານອຍ', body: 'ຫວຍໄທ ຫວຍລາວ ແລະຮານອຍນິຍົມກວດ 3 ໂຕເທິງ 2 ໂຕເທິງ ແລະ 2 ໂຕລຸ່ມ ການແຍກຕາມຕະຫຼາດຊ່ວຍໃຫ້ດູງ່າຍ' },
      { heading: 'ສຸ່ມເລກຫວຍຫຸ້ນ ແລະຫວຍລາຍວັນ', body: 'ຫວຍຫຸ້ນ ແລະຫວຍລາຍວັນມີຫຼາຍຕະຫຼາດ ຕາຕະລາງຈຶ່ງຊ່ວຍແຍກປະເພດ ແລະເປີດເບິ່ງຜົນຍ້ອນຫຼັງໄດ້ສະດວກ' },
      { heading: 'ໃຊ້ເລກເດັດຢ່າງຮັບຜິດຊອບ', body: 'ເລກສຸ່ມເປັນແນວທາງເພື່ອຄວາມບັນເທີງ ຜົນຫວຍເປັນການສຸ່ມ ບໍ່ມີເລກໃດຮັບປະກັນລາງວັນ' },
    ],
    faqTitle: 'ຄໍາຖາມທີ່ພົບເລື້ອຍ',
    faq: [
      { question: 'ເລກເດັດໜ້ານີ້ຄອບຄຸມຫວຍຫຍັງແດ່', answer: 'ຄອບຄຸມຕະຫຼາດຫວຍທີ່ມີຂໍ້ມູນໃນລະບົບ ເຊັ່ນ ຫວຍໄທ ຫວຍລາວ ຮານອຍ ຫວຍຫຸ້ນ ແລະຫວຍລາຍວັນ' },
      { question: 'ກົດສຸ່ມເລກໃໝ່ໄດ້ບໍ', answer: 'ໄດ້ ກົດປຸ່ມສຸ່ມໃໝ່ເພື່ອສ້າງຊຸດເລກໃໝ່' },
      { question: 'ເລກເດັດຮັບປະກັນລາງວັນບໍ', answer: 'ບໍ່ຮັບປະກັນ ເລກທັງໝົດເປັນເລກສຸ່ມເພື່ອຄວາມບັນເທີງ' },
    ],
    table: {
      all: 'ທັງໝົດ',
      randomAgain: 'ສຸ່ມໃໝ່',
      tableTitle: 'ຕາຕະລາງສຸ່ມເລກຫວຍທຸກປະເພດ',
      category: 'ປະເພດຫວຍ',
      lottery: 'ຊື່ຫວຍ',
      top3: '3 ໂຕເທິງ',
      top2: '2 ໂຕເທິງ',
      bottom2: '2 ໂຕລຸ່ມ',
      highlight: 'ເລກເດັ່ນ',
      pair: 'ເລກຈັບຄູ່',
      history: 'ຜົນຍ້ອນຫຼັງ',
      empty: 'ກຳລັງອັບເດດລາຍການຫວຍ',
    },
  },
  kh: {
    home: 'ទំព័រដើម',
    metaTitle: 'លេខសំណាង សម្រាប់ឆ្នោតគ្រប់ប្រភេទ | Huay Update',
    metaDescription: 'បង្កើតលេខសំណាងសម្រាប់ឆ្នោតគ្រប់ប្រភេទជាតារាង រួមមានឆ្នោតថៃ ឡាវ ហាណូយ ឆ្នោតហ៊ុន បរទេស និងប្រចាំថ្ងៃ',
    kicker: 'លេខសំណាងថ្ងៃនេះ',
    title: 'លេខសំណាង សម្រាប់ឆ្នោតគ្រប់ប្រភេទ',
    lead: 'បង្កើតគំនិតលេខសម្រាប់គ្រប់ប្រភេទ និងទីផ្សារនៅ Huay Update ជាតារាងងាយអាន មាន 3 ខ្ទង់លើ 2 ខ្ទង់លើ 2 ខ្ទង់ក្រោម លេខសំខាន់ និងលេខគូ សម្រាប់កំណត់ត្រាផ្ទាល់ខ្លួនប៉ុណ្ណោះ',
    todayResults: 'ពិនិត្យលទ្ធផលថ្ងៃនេះ',
    guide: 'អានមគ្គុទ្ទេសក៍ឆ្នោត',
    summaryLabel: 'Lucky Numbers',
    summaryTitle: 'លេខសំណាងគ្រប់ឆ្នោតក្នុងទំព័រតែមួយ',
    summaryBody: 'តារាងបង្កើតលេខសម្រាប់ទីផ្សារនីមួយៗ អាចបង្កើតថ្មី និងបើកប្រវត្តិលទ្ធផលបានភ្លាមៗ',
    articleTitle: 'អត្ថបទលេខសំណាង និងគំនិតលេខឆ្នោត',
    articleSections: [
      { heading: 'លេខសំណាងគឺជាអ្វី', body: 'លេខសំណាងគឺជាសំណុំលេខដែលអ្នកប្រើកត់ទុកជាគំនិតមុនពិនិត្យលទ្ធផល អាចមកពីការបង្កើតចៃដន្យ ប្រវត្តិលទ្ធផល ឬកំណត់ត្រាផ្ទាល់ខ្លួន' },
      { heading: 'លេខឆ្នោតថៃ ឡាវ និងហាណូយ', body: 'ឆ្នោតថៃ ឡាវ និងហាណូយភាគច្រើនពិនិត្យទម្រង់ 3 ខ្ទង់លើ 2 ខ្ទង់លើ និង 2 ខ្ទង់ក្រោម។ ការបែងចែកតាមទីផ្សារជួយឱ្យមើលងាយ' },
      { heading: 'លេខឆ្នោតហ៊ុន និងប្រចាំថ្ងៃ', body: 'ឆ្នោតហ៊ុន និងឆ្នោតប្រចាំថ្ងៃមានទីផ្សារច្រើន និងពេលចេញលទ្ធផលខុសគ្នា តារាងនេះជួយបែងចែកប្រភេទ និងបើកប្រវត្តិបានងាយ' },
      { heading: 'ប្រើលេខសំណាងដោយទំនួលខុសត្រូវ', body: 'លេខដែលបង្កើតឡើងគឺសម្រាប់ការកម្សាន្ត និងការរៀបចំព័ត៌មានប៉ុណ្ណោះ។ លទ្ធផលឆ្នោតមានភាពចៃដន្យ ហើយមិនមានលេខណាធានារង្វាន់ទេ' },
    ],
    faqTitle: 'សំណួរដែលសួរញឹកញាប់',
    faq: [
      { question: 'ទំព័រនេះរួមបញ្ចូលឆ្នោតអ្វីខ្លះ', answer: 'រួមបញ្ចូលទីផ្សារដែលមាននៅក្នុងប្រព័ន្ធ ដូចជា ឆ្នោតថៃ ឡាវ ហាណូយ ឆ្នោតបរទេស ឆ្នោតហ៊ុន និងប្រចាំថ្ងៃ' },
      { question: 'អាចបង្កើតលេខថ្មីបានទេ', answer: 'បាន។ ចុចប៊ូតុងបង្កើតថ្មី ដើម្បីទទួលបានលេខសំណុំថ្មី' },
      { question: 'លេខសំណាងធានារង្វាន់ទេ', answer: 'មិនធានា។ លេខទាំងអស់បង្កើតសម្រាប់ការកម្សាន្ត និងកំណត់ត្រាផ្ទាល់ខ្លួនប៉ុណ្ណោះ' },
    ],
    table: {
      all: 'ទាំងអស់',
      randomAgain: 'បង្កើតថ្មី',
      tableTitle: 'តារាងលេខសំណាងសម្រាប់ឆ្នោតគ្រប់ប្រភេទ',
      category: 'ប្រភេទ',
      lottery: 'ឆ្នោត',
      top3: '3 ខ្ទង់លើ',
      top2: '2 ខ្ទង់លើ',
      bottom2: '2 ខ្ទង់ក្រោម',
      highlight: 'លេខសំខាន់',
      pair: 'លេខគូ',
      history: 'ប្រវត្តិ',
      empty: 'កំពុងធ្វើបច្ចុប្បន្នភាពបញ្ជីឆ្នោត',
    },
  },
  zh: {
    home: '首页',
    metaTitle: '幸运号码生成器，覆盖所有彩票类型 | Huay Update',
    metaDescription: '以表格形式生成所有彩票类型的幸运号码，涵盖泰国、老挝、河内、股票、国外和每日彩票，并提供 SEO 指南内容。',
    kicker: '今日幸运号码',
    title: '所有彩票类型幸运号码生成器',
    lead: '为 Huay Update 上的每个分类和市场生成号码想法，以表格显示前三位、前两位、后两位、重点数字和配对号码，仅供个人记录使用。',
    todayResults: '查看今日结果',
    guide: '阅读彩票指南',
    summaryLabel: 'Lucky Numbers',
    summaryTitle: '一个表格覆盖所有彩票市场',
    summaryBody: '表格为每个彩票市场生成号码想法，可重新生成并立即打开该市场的历史结果。',
    articleTitle: '幸运号码和彩票号码思路指南',
    articleSections: [
      { heading: '什么是幸运号码', body: '幸运号码是用户在查看开奖结果前记录的号码思路，可能来自随机生成、历史结果或个人记录。本页按彩票类型和市场整理。' },
      { heading: '泰国、老挝和河内彩票号码', body: '泰国、老挝和河内彩票常查看前三位、前两位和后两位。按市场生成号码可以避免混淆彩票名称和开奖路径。' },
      { heading: '股票彩票和每日彩票号码', body: '股票彩票和每日彩票包含多个市场，开奖时间不同。按类型分组的表格更便于比较号码并打开历史结果。' },
      { heading: '负责任地使用幸运号码', body: '生成号码仅用于娱乐和个人整理。彩票结果具有随机性，任何幸运号码或公式都不能保证中奖。' },
    ],
    faqTitle: '常见问题',
    faq: [
      { question: '包含哪些彩票类型', answer: '表格包含可用市场，如泰国彩票、老挝彩票、河内彩票、国外彩票、股票彩票和每日彩票。' },
      { question: '可以生成新的号码吗', answer: '可以。点击重新生成按钮即可获得新的前三位、前两位、后两位、重点数字和配对号码。' },
      { question: '幸运号码保证中奖吗', answer: '不保证。所有号码仅供娱乐和个人记录使用。' },
    ],
    table: {
      all: '全部',
      randomAgain: '重新生成',
      tableTitle: '所有彩票类型幸运号码表',
      category: '分类',
      lottery: '彩票',
      top3: '前三位',
      top2: '前两位',
      bottom2: '后两位',
      highlight: '重点数字',
      pair: '配对号码',
      history: '历史',
      empty: '彩票列表正在更新',
    },
  },
}

async function getLuckyGroups(lang: Lang): Promise<Group[]> {
  const today = todayBangkok()
  const dates = luckySourceDates(today)
  const responses = await Promise.allSettled(dates.map(date => fetchLotteryByDate(date, lang)))
  const groupMap = new Map<string, Group>()

  responses.forEach(response => {
    if (response.status !== 'fulfilled') return
    response.value.data?.groups.forEach(group => {
      const existing = groupMap.get(group.group_code)
      if (!existing) {
        groupMap.set(group.group_code, { ...group, markets: [...group.markets] })
        return
      }

      const marketIds = new Set(existing.markets.map(market => market.market_id))
      group.markets.forEach(market => {
        if (!marketIds.has(market.market_id)) {
          existing.markets.push(market)
          marketIds.add(market.market_id)
        }
      })
    })
  })

  const preferredOrder = new Map<string, number>(lotteryGroups.map((group, index) => [group.code, index]))
  return Array.from(groupMap.values()).sort((a, b) => (
    (preferredOrder.get(a.group_code) ?? 99) - (preferredOrder.get(b.group_code) ?? 99)
  ))
}

function seededNumber(seed: string) {
  let hash = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return () => {
    hash += 0x6D2B79F5
    let t = hash
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function digits(next: () => number, length: number) {
  return Array.from({ length }, () => Math.floor(next() * 10)).join('')
}

function addDays(date: string, amount: number): string {
  const d = new Date(`${date}T12:00:00`)
  d.setDate(d.getDate() + amount)
  return d.toISOString().slice(0, 10)
}

function addMonths(date: string, amount: number): string {
  const d = new Date(`${date}T12:00:00`)
  d.setMonth(d.getMonth() + amount)
  return d.toISOString().slice(0, 10)
}

function monthDrawDates(date: string) {
  const d = new Date(`${date}T12:00:00`)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return [`${year}-${month}-01`, `${year}-${month}-16`]
}

function luckySourceDates(today: string) {
  const dates = [
    ...Array.from({ length: 15 }, (_, index) => addDays(today, -index)),
    ...monthDrawDates(today),
    ...monthDrawDates(addMonths(today, -1)),
    ...monthDrawDates(addMonths(today, -2)),
  ]
  return Array.from(new Set(dates)).filter(date => date <= today)
}

function fallbackLogo(groupCode: string) {
  const labels: Record<string, string> = {
    'lotto-thai': 'TH',
    'lotto-foreign': 'FX',
    'lotto-stock': 'ST',
    'lotto-daily': 'DY',
  }
  const colors: Record<string, [string, string]> = {
    'lotto-thai': ['#f5d060', '#6b4a00'],
    'lotto-foreign': ['#60a5fa', '#102a55'],
    'lotto-stock': ['#4ade80', '#0f3b24'],
    'lotto-daily': ['#a78bfa', '#2b1b5a'],
  }
  const label = labels[groupCode] ?? 'HU'
  const [start, end] = colors[groupCode] ?? ['#d4af37', '#2a1c00']
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><rect width="72" height="72" rx="18" fill="${end}"/><circle cx="22" cy="18" r="24" fill="${start}" opacity=".28"/><text x="36" y="43" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="${start}">${label}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function logoSrc(...values: Array<unknown>) {
  const value = values.find((item): item is string => typeof item === 'string' && item.trim().length > 0)
  return value?.trim()
}

function marketLogo(market: Record<string, unknown>, groupCode: string) {
  return logoSrc(
    market.market_logo,
    market.market_icon,
    market.logo,
    market.icon,
    market.image,
    market.market_image,
  ) ?? fallbackLogo(groupCode)
}

function fallbackRow(groupCode: string, lang: Lang, date: string): LuckyNumberRow {
  const next = seededNumber(`${date}-${lang}-${groupCode}`)
  const groupName = lotteryGroupName(groupCode, lang)
  const highlight = String(Math.floor(next() * 10))
  return {
    id: groupCode,
    groupCode,
    groupName,
    marketName: groupName,
    marketLogo: fallbackLogo(groupCode),
    marketHref: localizedPath(`/lottery/group/${groupCode}`, lang),
    top3: digits(next, 3),
    top2: digits(next, 2),
    bottom2: digits(next, 2),
    highlight,
    pair: `${highlight}${Math.floor(next() * 10)}`,
  }
}

function fallbackRows(lang: Lang, date: string): LuckyNumberRow[] {
  return lotteryGroups.map(group => fallbackRow(group.code, lang, date))
}

function buildLuckyRows(groups: Group[], lang: Lang, date: string): LuckyNumberRow[] {
  const rows = groups.flatMap(group => group.markets.map(market => {
    const next = seededNumber(`${date}-${lang}-${group.group_code}-${market.market_id}`)
    const highlight = String(Math.floor(next() * 10))
    return {
      id: String(market.market_id),
      groupCode: group.group_code,
      groupName: group.group_name || lotteryGroupName(group.group_code, lang),
      marketName: market.market_name,
      marketLogo: marketLogo(market as unknown as Record<string, unknown>, group.group_code),
      marketHref: localizedMarketPath(market.market_id, market.market_name, lang),
      top3: digits(next, 3),
      top2: digits(next, 2),
      bottom2: digits(next, 2),
      highlight,
      pair: `${highlight}${Math.floor(next() * 10)}`,
    }
  }))
  if (rows.length === 0) return fallbackRows(lang, date)

  const presentGroupCodes = new Set(rows.map(row => row.groupCode))
  const missingGroupRows = lotteryGroups
    .filter(group => !presentGroupCodes.has(group.code))
    .map(group => fallbackRow(group.code, lang, date))

  return [...rows, ...missingGroupRows]
}

function faqJsonLd(copy: LuckyCopy) {
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

  const copy = LUCKY_COPY[lang]
  const canonical = localizedPath(pagePath, lang)

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    keywords: [
      ...siteKeywords,
      'เลขเด็ด',
      'สุ่มเลขหวย',
      'เลขเด็ดวันนี้',
      'lucky numbers',
      'lottery number generator',
      copy.title,
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

export default async function LuckyNumbersPage({ params }: PageProps) {
  const { lang } = await params
  if (!isSeoLang(lang)) notFound()

  const currentLang = lang as Lang
  const copy = LUCKY_COPY[currentLang]
  const canonical = localizedPath(pagePath, currentLang)
  const today = todayBangkok()
  const groups = await getLuckyGroups(currentLang)
  const rows = buildLuckyRows(groups, currentLang, today)
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

      <main className="lottery-topic-page lucky-page">
        <section className="lottery-topic-hero">
          <div>
            <p className="lottery-topic-kicker">{copy.kicker}</p>
            <h1>{copy.title}</h1>
            <p>{copy.lead}</p>
            <div className="lottery-topic-actions">
              <Link href={localizedPath(`/lottery/${today}`, currentLang)}>
                {copy.todayResults}
              </Link>
              <Link href={localizedPath('/guide', currentLang)}>
                {copy.guide}
              </Link>
            </div>
          </div>
          <aside>
            <span>{copy.summaryLabel}</span>
            <strong>{copy.summaryTitle}</strong>
            <p>{copy.summaryBody}</p>
          </aside>
        </section>

        <LuckyNumbersClient lang={currentLang} rows={rows} copy={copy.table} />

        <section className="lottery-topic-grid lucky-article-grid" aria-label={copy.articleTitle}>
          {copy.articleSections.map(section => (
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
