import type { Lang } from '@/lib/i18n'

type SeoPageCopy = {
  title: string
  description: string
  h1: string
  intro: string
  sections: { heading: string; body: string }[]
  faq: { question: string; answer: string }[]
  keywords: string[]
}

export type LotterySeoSlug = keyof typeof lotterySeoPages

export const lotterySeoPages = {
  hanoi: {
    th: {
      title: 'ผลหวยฮานอยวันนี้ หวยฮานอย VIP ปกติ พิเศษ ย้อนหลัง',
      description: 'ตรวจผลหวยฮานอยวันนี้ ครบทั้งฮานอย VIP ฮานอยปกติ ฮานอยพิเศษ ฮานอย HD ฮานอย TV และผลย้อนหลัง อัปเดตรวดเร็วที่ Huay Update',
      h1: 'ผลหวยฮานอยวันนี้ ครบทุกตลาด',
      intro: 'หน้ารวมข้อมูลหวยฮานอยสำหรับผู้ที่ต้องการตรวจผลรายวันและผลย้อนหลังในที่เดียว ครอบคลุมตลาดฮานอยหลักที่มีการออกรางวัลหลายรอบในแต่ละวัน',
      sections: [
        { heading: 'หวยฮานอยคืออะไร', body: 'หวยฮานอยเป็นกลุ่มหวยต่างประเทศที่ได้รับความนิยมสูง มีหลายตลาด เช่น ฮานอย VIP ฮานอยปกติ ฮานอยพิเศษ ฮานอย HD ฮานอย TV และฮานอยอาเซียน แต่ละตลาดอาจมีเวลาออกผลและรูปแบบเลขที่แสดงต่างกัน' },
        { heading: 'ดูผลหวยฮานอยย้อนหลัง', body: 'Huay Update แสดงผลย้อนหลังแยกตามวันที่และแยกตามตลาด ช่วยให้ตรวจสอบเลข 3 ตัวบน 2 ตัวบน และ 2 ตัวล่างได้สะดวกโดยไม่ต้องค้นหาหลายหน้า' },
        { heading: 'วิธีตรวจผลให้แม่นยำ', body: 'เลือกวันที่ที่ต้องการตรวจ จากนั้นเปิดตลาดฮานอยที่ต้องการดูรายละเอียด หากตลาดใดยังไม่ออกผล ระบบจะแสดงสถานะว่ายังไม่มีผลหรือไม่มีการออกรางวัลตามข้อมูลล่าสุด' },
      ],
      faq: [
        { question: 'ผลหวยฮานอยอัปเดตเมื่อไหร่', answer: 'ระบบจะแสดงผลเมื่อมีข้อมูลล่าสุดจากแต่ละตลาดหวยฮานอย และอัปเดตเป็นระยะตามรอบผลรางวัล' },
        { question: 'มีหวยฮานอยประเภทไหนบ้าง', answer: 'มีหลายตลาด เช่น ฮานอย VIP ฮานอยปกติ ฮานอยพิเศษ ฮานอย HD ฮานอย TV ฮานอยสตาร์ และฮานอยอาเซียน ตามข้อมูลที่ระบบรองรับ' },
        { question: 'ดูผลหวยฮานอยย้อนหลังได้ไหม', answer: 'ดูได้ โดยเลือกวันที่ย้อนหลังหรือเปิดหน้าตลาดหวยฮานอยแต่ละรายการเพื่อดูประวัติผลรางวัล' },
      ],
      keywords: ['ผลหวยฮานอย', 'หวยฮานอยวันนี้', 'ฮานอย VIP', 'ฮานอยย้อนหลัง'],
    },
    en: {
      title: 'Hanoi lottery results today, VIP, regular, special and history',
      description: 'Check Hanoi lottery results today, including Hanoi VIP, regular, special, HD, TV and historical results on Huay Update.',
      h1: 'Hanoi Lottery Results Today',
      intro: 'This page explains Hanoi lottery result pages for users who want daily results and history in one place, covering the main Hanoi markets available on Huay Update.',
      sections: [
        { heading: 'What is Hanoi lottery', body: 'Hanoi lottery refers to a group of Vietnam-related lottery markets such as Hanoi VIP, regular Hanoi, special Hanoi, Hanoi HD, Hanoi TV and Hanoi ASEAN. Each market can have its own draw time and result format.' },
        { heading: 'Hanoi lottery history', body: 'Huay Update organizes historical results by date and by market, making it easier to review 3 top, 2 top and 2 bottom results without jumping between many pages.' },
        { heading: 'How to check results', body: 'Select the date you want to check, then open the Hanoi market page for full details. If a market has not been updated yet, the page will show the latest available status.' },
      ],
      faq: [
        { question: 'When are Hanoi lottery results updated', answer: 'Results are updated when fresh data is available for each Hanoi market and refreshed throughout the draw schedule.' },
        { question: 'Which Hanoi markets are included', answer: 'The site can include Hanoi VIP, regular Hanoi, special Hanoi, Hanoi HD, Hanoi TV, Hanoi Star and Hanoi ASEAN depending on available data.' },
        { question: 'Can I view Hanoi lottery history', answer: 'Yes. Use date pages or individual market pages to review past Hanoi lottery results.' },
      ],
      keywords: ['Hanoi lottery results', 'Hanoi lottery today', 'Hanoi VIP', 'Hanoi history'],
    },
    la: {
      title: 'ຜົນຫວຍຮານອຍມື້ນີ້ VIP ປົກກະຕິ ພິເສດ ແລະຍ້ອນຫຼັງ',
      description: 'ກວດຜົນຫວຍຮານອຍມື້ນີ້ ຮວມຮານອຍ VIP ປົກກະຕິ ພິເສດ HD TV ແລະຜົນຍ້ອນຫຼັງທີ່ Huay Update.',
      h1: 'ຜົນຫວຍຮານອຍມື້ນີ້',
      intro: 'ໜ້ານີ້ຮວມຂໍ້ມູນຫວຍຮານອຍສໍາລັບການກວດຜົນລາຍວັນ ແລະຜົນຍ້ອນຫຼັງໃນບ່ອນດຽວ.',
      sections: [
        { heading: 'ຫວຍຮານອຍແມ່ນຫຍັງ', body: 'ຫວຍຮານອຍແມ່ນກຸ່ມຫວຍຕ່າງປະເທດທີ່ມີຫຼາຍຕະຫຼາດ ເຊັ່ນ VIP ປົກກະຕິ ພິເສດ HD TV ແລະອາຊຽນ.' },
        { heading: 'ເບິ່ງຜົນຍ້ອນຫຼັງ', body: 'Huay Update ຈັດຜົນຍ້ອນຫຼັງຕາມວັນທີ ແລະຕາມຕະຫຼາດ ເພື່ອໃຫ້ກວດເລກ 3 ໂຕເທິງ 2 ໂຕເທິງ ແລະ 2 ໂຕລຸ່ມໄດ້ງ່າຍ.' },
        { heading: 'ວິທີກວດຜົນ', body: 'ເລືອກວັນທີ ແລ້ວເປີດຕະຫຼາດຮານອຍທີ່ຕ້ອງການ ຖ້າຍັງບໍ່ມີຜົນ ລະບົບຈະສະແດງສະຖານະລ່າສຸດ.' },
      ],
      faq: [
        { question: 'ຜົນຫວຍຮານອຍອັບເດດເມື່ອໃດ', answer: 'ອັບເດດເມື່ອມີຂໍ້ມູນໃໝ່ຂອງແຕ່ລະຕະຫຼາດ.' },
        { question: 'ມີຕະຫຼາດຮານອຍໃດແດ່', answer: 'ອາດມີ VIP ປົກກະຕິ ພິເສດ HD TV Star ແລະອາຊຽນຕາມຂໍ້ມູນທີ່ຮອງຮັບ.' },
        { question: 'ເບິ່ງຜົນຍ້ອນຫຼັງໄດ້ບໍ', answer: 'ໄດ້ ໂດຍເລືອກວັນທີຍ້ອນຫຼັງ ຫຼືເປີດໜ້າຕະຫຼາດແຕ່ລະລາຍການ.' },
      ],
      keywords: ['ຜົນຫວຍຮານອຍ', 'ຫວຍຮານອຍມື້ນີ້', 'Hanoi VIP'],
    },
    kh: {
      title: 'លទ្ធផលឆ្នោតហាណូយថ្ងៃនេះ VIP ធម្មតា ពិសេស និងប្រវត្តិ',
      description: 'ពិនិត្យលទ្ធផលឆ្នោតហាណូយថ្ងៃនេះ រួមមាន Hanoi VIP ធម្មតា ពិសេស HD TV និងលទ្ធផលย้อนหลังនៅ Huay Update។',
      h1: 'លទ្ធផលឆ្នោតហាណូយថ្ងៃនេះ',
      intro: 'ទំព័រនេះប្រមូលព័ត៌មានឆ្នោតហាណូយសម្រាប់ការពិនិត្យលទ្ធផលប្រចាំថ្ងៃ និងលទ្ធផលย้อนหลังនៅកន្លែងតែមួយ។',
      sections: [
        { heading: 'ឆ្នោតហាណូយជាអ្វី', body: 'ឆ្នោតហាណូយគឺជាក្រុមឆ្នោតបរទេសដែលមានទីផ្សារច្រើន ដូចជា Hanoi VIP ធម្មតា ពិសេស HD TV និង ASEAN។' },
        { heading: 'មើលលទ្ធផលย้อนหลัง', body: 'Huay Update រៀបចំលទ្ធផលតាមថ្ងៃ និងតាមទីផ្សារ ដើម្បីឱ្យពិនិត្យលេខ 3 លើ 2 លើ និង 2 ក្រោមបានងាយស្រួល។' },
        { heading: 'របៀបពិនិត្យលទ្ធផល', body: 'ជ្រើសរើសថ្ងៃ បន្ទាប់មកបើកទីផ្សារហាណូយដែលត្រូវការ។ ប្រសិនបើមិនទាន់មានលទ្ធផល ប្រព័ន្ធនឹងបង្ហាញស្ថានភាពចុងក្រោយ។' },
      ],
      faq: [
        { question: 'លទ្ធផលហាណូយអាប់ដេតពេលណា', answer: 'លទ្ធផលត្រូវបានអាប់ដេតនៅពេលមានទិន្នន័យថ្មីសម្រាប់ទីផ្សារនីមួយៗ។' },
        { question: 'មានទីផ្សារហាណូយអ្វីខ្លះ', answer: 'អាចមាន Hanoi VIP ធម្មតា ពិសេស HD TV Star និង ASEAN អាស្រ័យលើទិន្នន័យដែលមាន។' },
        { question: 'អាចមើលលទ្ធផលย้อนหลังបានទេ', answer: 'បាន។ ប្រើទំព័រថ្ងៃ ឬទំព័រទីផ្សារនីមួយៗសម្រាប់មើលប្រវត្តិ។' },
      ],
      keywords: ['លទ្ធផលឆ្នោតហាណូយ', 'Hanoi lottery', 'Hanoi VIP'],
    },
    zh: {
      title: '今日河内彩票开奖结果 VIP 普通 特别及历史记录',
      description: '在 Huay Update 查看今日河内彩票开奖结果，包括河内 VIP、普通、特别、HD、TV 及历史结果。',
      h1: '今日河内彩票开奖结果',
      intro: '本页汇总河内彩票的每日结果和历史记录，方便用户在一个页面查看 Huay Update 支持的主要河内彩票市场。',
      sections: [
        { heading: '什么是河内彩票', body: '河内彩票是越南相关彩票市场的统称，例如河内 VIP、普通河内、特别河内、河内 HD、河内 TV 和河内 ASEAN。不同市场可能有不同的开奖时间和结果格式。' },
        { heading: '河内彩票历史结果', body: 'Huay Update 按日期和市场整理历史结果，方便查看前三位、前两位和后两位结果。' },
        { heading: '如何查看结果', body: '选择要查询的日期，然后打开对应的河内市场页面查看详情。如果某个市场尚未更新，页面会显示当前最新状态。' },
      ],
      faq: [
        { question: '河内彩票结果什么时候更新', answer: '当各个河内市场有最新数据时，系统会按开奖时间更新结果。' },
        { question: '包含哪些河内市场', answer: '根据可用数据，可能包含 Hanoi VIP、普通 Hanoi、特别 Hanoi、Hanoi HD、Hanoi TV、Hanoi Star 和 Hanoi ASEAN。' },
        { question: '可以查看河内彩票历史记录吗', answer: '可以。可使用日期页面或单个市场页面查看过去的河内彩票结果。' },
      ],
      keywords: ['河内彩票开奖结果', '今日河内彩票', 'Hanoi VIP', '河内彩票历史'],
    },
  },
  lao: makeSimplePage('หวยลาว', 'Lao lottery', 'ຫວຍລາວ', 'ឆ្នោតឡាវ', '老挝彩票', ['หวยลาว', 'ลาว TV', 'ลาวประตูชัย', 'ลาวสันติภาพ']),
  thai: makeSimplePage('หวยไทย', 'Thai lottery', 'ຫວຍໄທ', 'ឆ្នោតថៃ', '泰国彩票', ['หวยไทย', 'ตรวจหวยรัฐบาล', 'สลากกินแบ่งรัฐบาล']),
  stock: makeSimplePage('หวยหุ้น', 'stock lottery', 'ຫວຍຫຸ້ນ', 'ឆ្នោតហ៊ុន', '股票彩票', ['หวยหุ้น', 'หุ้นดาวโจนส์', 'นิเคอิ', 'ฮั่งเส็ง']),
  daily: makeSimplePage('หวยรายวัน', 'daily lottery', 'ຫວຍລາຍວັນ', 'ឆ្នោតប្រចាំថ្ងៃ', '每日彩票', ['หวยรายวัน', 'ผลหวยวันนี้', 'หวยออกทุกวัน']),
  foreign: makeSimplePage('หวยต่างประเทศ', 'international lottery', 'ຫວຍຕ່າງປະເທດ', 'ឆ្នោតបរទេស', '国外彩票', ['หวยต่างประเทศ', 'หวยฮานอย', 'หวยลาว', 'หวยมาเลเซีย']),
} satisfies Record<string, Record<Lang, SeoPageCopy>>

function makeSimplePage(thName: string, enName: string, laName: string, khName: string, zhName: string, keywords: string[]) {
  return {
    th: {
      title: `ผล${thName}วันนี้และย้อนหลัง`,
      description: `ตรวจผล${thName}วันนี้และผลย้อนหลัง อัปเดตรวดเร็ว ดูเลขสำคัญครบในหน้าเดียวที่ Huay Update`,
      h1: `ผล${thName}วันนี้และย้อนหลัง`,
      intro: `หน้ารวมข้อมูล${thName}สำหรับผู้ที่ต้องการตรวจผลล่าสุดและผลย้อนหลัง พร้อมลิงก์ไปหน้าผลรายวันและหน้าตลาดหวยที่เกี่ยวข้อง`,
      sections: [
        { heading: `${thName}คืออะไร`, body: `${thName}เป็นหนึ่งในหมวดผลหวยที่ผู้ใช้ค้นหาบ่อย โดย Huay Update จัดข้อมูลตามวันที่และตามตลาดเพื่อให้ตรวจผลได้รวดเร็ว` },
        { heading: `ตรวจผล${thName}ย้อนหลัง`, body: `สามารถเลือกวันที่ย้อนหลังเพื่อดูผลรางวัลในแต่ละงวด และเปิดหน้าตลาดหวยแต่ละรายการเพื่อดูประวัติผลแบบต่อเนื่อง` },
        { heading: `ข้อมูลที่แสดง`, body: `ระบบแสดงเลขตามข้อมูลที่มี เช่น 3 ตัวบน 2 ตัวบน 2 ตัวล่าง หรือรางวัลสำคัญของตลาดนั้น พร้อมสถานะเมื่อยังไม่มีผล` },
      ],
      faq: [
        { question: `ผล${thName}อัปเดตเมื่อไหร่`, answer: `ผลจะอัปเดตเมื่อมีข้อมูลล่าสุดจากตลาด${thName}ที่ระบบรองรับ` },
        { question: `ดูผล${thName}ย้อนหลังได้ไหม`, answer: `ดูได้จากหน้าวันที่ย้อนหลังหรือหน้าตลาดหวยแต่ละรายการ` },
        { question: `ต้องสมัครสมาชิกก่อนตรวจผลไหม`, answer: `ไม่ต้องสมัครสมาชิก สามารถเปิดดูผลหวยได้ทันที` },
      ],
      keywords,
    },
    en: {
      title: `${capitalize(enName)} results today and history`,
      description: `Check ${enName} results today and historical results on Huay Update, with key numbers organized by date and market.`,
      h1: `${capitalize(enName)} Results Today and History`,
      intro: `This page summarizes ${enName} information for users who want latest results, historical results and links to related market pages.`,
      sections: [
        { heading: `What is ${enName}`, body: `${capitalize(enName)} is one of the lottery result categories available on Huay Update, organized by date and market for easier checking.` },
        { heading: `Historical results`, body: `Use past date pages or individual market pages to review previous draw results and compare number history.` },
        { heading: `Displayed result data`, body: `The site shows available result fields such as 3 top, 2 top, 2 bottom or the main prize, plus status messages when results are not yet available.` },
      ],
      faq: [
        { question: `When are ${enName} results updated`, answer: `Results are refreshed when new data is available for supported markets.` },
        { question: `Can I view ${enName} history`, answer: `Yes. Use date pages or market detail pages to view historical results.` },
        { question: `Do I need an account`, answer: `No account is required to check lottery results.` },
      ],
      keywords,
    },
    la: {
      title: `ຜົນ${laName}ມື້ນີ້ ແລະຍ້ອນຫຼັງ`,
      description: `ກວດຜົນ${laName}ມື້ນີ້ ແລະຜົນຍ້ອນຫຼັງທີ່ Huay Update.`,
      h1: `ຜົນ${laName}ມື້ນີ້`,
      intro: `ໜ້ານີ້ຮວມຂໍ້ມູນ${laName} ສໍາລັບການກວດຜົນລ່າສຸດ ແລະຜົນຍ້ອນຫຼັງ.`,
      sections: [
        { heading: `${laName}ແມ່ນຫຍັງ`, body: `${laName}ແມ່ນໝວດຜົນຫວຍທີ່ Huay Update ຈັດຕາມວັນທີ ແລະຕາມຕະຫຼາດ.` },
        { heading: `ເບິ່ງຜົນຍ້ອນຫຼັງ`, body: `ສາມາດເລືອກວັນທີຍ້ອນຫຼັງ ຫຼືເປີດໜ້າຕະຫຼາດເພື່ອເບິ່ງປະຫວັດຜົນ.` },
        { heading: `ຂໍ້ມູນທີ່ສະແດງ`, body: `ສະແດງເລກ 3 ໂຕເທິງ 2 ໂຕເທິງ 2 ໂຕລຸ່ມ ຫຼືຂໍ້ມູນສໍາຄັນຕາມຕະຫຼາດ.` },
      ],
      faq: [
        { question: `ຜົນ${laName}ອັບເດດເມື່ອໃດ`, answer: `ອັບເດດເມື່ອມີຂໍ້ມູນໃໝ່ຈາກຕະຫຼາດທີ່ຮອງຮັບ.` },
        { question: `ເບິ່ງຍ້ອນຫຼັງໄດ້ບໍ`, answer: `ໄດ້ ໂດຍເລືອກວັນທີ ຫຼືໜ້າຕະຫຼາດ.` },
        { question: `ຕ້ອງສະໝັກສະມາຊິກບໍ`, answer: `ບໍ່ຈໍາເປັນ ສາມາດເບິ່ງຜົນໄດ້ທັນທີ.` },
      ],
      keywords,
    },
    kh: {
      title: `លទ្ធផល${khName}ថ្ងៃនេះ និងប្រវត្តិ`,
      description: `ពិនិត្យលទ្ធផល${khName}ថ្ងៃនេះ និងលទ្ធផលย้อนหลังនៅ Huay Update។`,
      h1: `លទ្ធផល${khName}ថ្ងៃនេះ`,
      intro: `ទំព័រនេះប្រមូលព័ត៌មាន${khName} សម្រាប់ការពិនិត្យលទ្ធផលថ្មី និងលទ្ធផលย้อนหลัง។`,
      sections: [
        { heading: `${khName}ជាអ្វី`, body: `${khName}គឺជាប្រភេទលទ្ធផលឆ្នោតដែល Huay Update រៀបចំតាមថ្ងៃ និងតាមទីផ្សារ។` },
        { heading: `មើលលទ្ធផលย้อนหลัง`, body: `អាចជ្រើសរើសថ្ងៃចាស់ ឬបើកទំព័រទីផ្សារនីមួយៗដើម្បីមើលប្រវត្តិលទ្ធផល។` },
        { heading: `ទិន្នន័យដែលបង្ហាញ`, body: `បង្ហាញលេខ 3 លើ 2 លើ 2 ក្រោម ឬរង្វាន់សំខាន់ៗតាមទីផ្សារ។` },
      ],
      faq: [
        { question: `លទ្ធផល${khName}អាប់ដេតពេលណា`, answer: `អាប់ដេតនៅពេលមានទិន្នន័យថ្មីពីទីផ្សារដែលគាំទ្រ។` },
        { question: `អាចមើលប្រវត្តិបានទេ`, answer: `បាន តាមទំព័រថ្ងៃ ឬទំព័រទីផ្សារ។` },
        { question: `ត្រូវការគណនីទេ`, answer: `មិនចាំបាច់មានគណនីទេ។` },
      ],
      keywords,
    },
    zh: {
      title: `今日${zhName}结果和历史记录`,
      description: `在 Huay Update 查看今日${zhName}结果和历史结果，按日期与市场整理关键号码。`,
      h1: `今日${zhName}结果`,
      intro: `本页汇总${zhName}信息，适合查看最新结果、历史记录以及相关彩票市场页面。`,
      sections: [
        { heading: `${zhName}是什么`, body: `${zhName}是 Huay Update 支持的彩票结果分类之一，按日期和市场整理，方便快速查询。` },
        { heading: `查看历史结果`, body: `可以选择过去日期，或打开单个市场页面查看连续的历史开奖结果。` },
        { heading: `显示的数据`, body: `网站会根据可用数据展示前三位、前两位、后两位或主要奖项，并在尚无结果时显示状态。` },
      ],
      faq: [
        { question: `${zhName}结果什么时候更新`, answer: `当支持的市场有最新数据时，结果会进行更新。` },
        { question: `可以查看${zhName}历史记录吗`, answer: `可以，可通过日期页面或市场详情页查看历史结果。` },
        { question: `查看结果需要注册吗`, answer: `不需要注册，可以直接查看彩票结果。` },
      ],
      keywords,
    },
  } satisfies Record<Lang, SeoPageCopy>
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getLotterySeoPage(slug: string, lang: Lang) {
  return lotterySeoPages[slug as LotterySeoSlug]?.[lang]
}

export function isLotterySeoSlug(slug: string): slug is LotterySeoSlug {
  return slug in lotterySeoPages
}
