export type Lang = 'th' | 'en' | 'la' | 'kh' | 'zh'
export const LANGS: Lang[] = ['th', 'en', 'la', 'kh', 'zh']
export const LANG_LABEL: Record<Lang, string> = {
  th: 'ไทย', en: 'English', la: 'ລາວ', kh: 'ខ្មែរ', zh: '中文',
}
export const LANG_FLAG: Record<Lang, string> = {
  th: '🇹🇭', en: '🇬🇧', la: '🇱🇦', kh: '🇰🇭', zh: '🇨🇳',
}
export const LANG_LOCALE: Record<Lang, string> = {
  th: 'th-TH', en: 'en-US', la: 'lo-LA', kh: 'km-KH', zh: 'zh-CN',
}

export interface Dict {
  brand: string
  tagline: string
  home: string
  todayResults: string
  all: string
  hasResult: string
  notFound: string
  tryOther: string
  loadFail: string
  firstPrize: string
  top3: string
  top2: string
  bottom2: string
  top3Short: string
  top2Short: string
  bottom2Short: string
  noResult: string
  notYet: string
  latest: string
  history: string
  historyDate: string
  page: string
  previousPage: string
  nextPage: string
  draws: string
  hourSuffix: string
  language: string
  menu: string
  menuGuide: string
  menuLuckyNumbers: string
  menuArticles: string
  menuLotteryFormula: string
  searchLottery: string
  searchLotteryPlaceholder: string
  clearSearch: string
  noSearchResults: string
  lotteryThai: string
  lotteryForeign: string
  lotteryStock: string
  lotteryDaily: string
  lotteryGroupFallback: string
  noGroupResult: string
  tryPreviousDraw: string
  previousDayResults: string
  nextDayResults: string
  noNextDayResults: string
  viewDateResults: string
  viewHistory: string
  addToHomeScreen: string
  hideAddToHomeScreen: string
  installApp: string
  close: string
  iosInstallStepShare: string
  iosInstallStepAddToHome: string
  iosInstallStepConfirm: string
  androidInstallStepMenu: string
  androidInstallStepInstall: string
}

export const DICT: Record<Lang, Dict> = {
  th: {
    brand: 'ตรวจหวย',
    tagline: 'ผลรางวัลตามวันที่',
    home: 'หน้าแรก',
    todayResults: '🎰 ผลหวยประจำวัน',
    all: 'ทั้งหมด',
    hasResult: 'มีผล',
    notFound: 'ไม่พบข้อมูล',
    tryOther: 'ลองเปลี่ยนวันที่หรือกลุ่มหวยอื่น',
    loadFail: 'โหลดข้อมูลไม่สำเร็จ',
    firstPrize: 'รางวัลที่ 1',
    top3: '3 ตัวบน',
    top2: '2 ตัวบน',
    bottom2: '2 ตัวล่าง',
    top3Short: '3 บน',
    top2Short: '2 บน',
    bottom2Short: '2 ล่าง',
    noResult: 'งดออกผล',
    notYet: 'ยังไม่มีผล',
    latest: 'งวดล่าสุด',
    history: 'ผลย้อนหลัง',
    historyDate: 'งวดวันที่',
    page: 'หน้า',
    previousPage: 'ก่อนหน้า',
    nextPage: 'ถัดไป',
    draws: 'งวด',
    hourSuffix: 'น.',
    language: 'ภาษา',
    menu: 'เมนู',
    menuGuide: 'แนวทาง',
    menuLuckyNumbers: 'เลขเด็ด',
    menuArticles: 'บทความ',
    menuLotteryFormula: 'สูตรคำนวณหวย',
    searchLottery: 'ค้นหาชื่อหวย',
    searchLotteryPlaceholder: 'ค้นหาชื่อหวย เช่น ฮานอย ลาว หุ้น',
    clearSearch: 'ล้างคำค้นหา',
    noSearchResults: 'ไม่พบชื่อหวยที่ค้นหา',
    lotteryThai: 'หวยไทย',
    lotteryForeign: 'หวยต่างประเทศ',
    lotteryStock: 'หวยหุ้น',
    lotteryDaily: 'หวยรายวัน',
    lotteryGroupFallback: 'หวยกลุ่มนี้',
    noGroupResult: 'ไม่พบผล{group}ในงวดนี้',
    tryPreviousDraw: 'ลองเลือกงวดก่อนหน้า หรือเปลี่ยนวันที่จากปฏิทินด้านบน',
    previousDayResults: 'ดูผลหวยวันก่อนหน้า',
    nextDayResults: 'ดูผลหวยวันถัดไป',
    noNextDayResults: 'ยังไม่มีผลหวยวันถัดไป',
    viewDateResults: 'ดูผลหวยวันที่ {date}',
    viewHistory: 'ดูผลย้อนหลัง',
    addToHomeScreen: 'เพิ่มลงหน้าจอหลัก',
    hideAddToHomeScreen: 'ซ่อนปุ่มเพิ่มลงหน้าจอหลัก',
    installApp: 'ติดตั้งแอป',
    close: 'ปิด',
    iosInstallStepShare: 'แตะปุ่ม Share ใน Safari',
    iosInstallStepAddToHome: 'เลือก Add to Home Screen',
    iosInstallStepConfirm: 'แตะ Add เพื่อวางไอคอนบนหน้าจอหลัก',
    androidInstallStepMenu: 'เปิดเมนูของเบราว์เซอร์',
    androidInstallStepInstall: 'เลือก Install app หรือ Add to Home screen',
  },
  en: {
    brand: 'Lottery Check',
    tagline: 'Results by date',
    home: 'Home',
    todayResults: '🎰 Today\'s Results',
    all: 'All',
    hasResult: 'results',
    notFound: 'No data',
    tryOther: 'Try another date or group',
    loadFail: 'Failed to load',
    firstPrize: '1st Prize',
    top3: '3 Top',
    top2: '2 Top',
    bottom2: '2 Bottom',
    top3Short: '3 Top',
    top2Short: '2 Top',
    bottom2Short: '2 Bot',
    noResult: 'No draw',
    notYet: 'Not yet',
    latest: 'Latest draw',
    history: 'History',
    historyDate: 'Draw date',
    page: 'Page',
    previousPage: 'Previous',
    nextPage: 'Next',
    draws: 'draws',
    hourSuffix: '',
    language: 'Language',
    menu: 'Menu',
    menuGuide: 'Guide',
    menuLuckyNumbers: 'Lucky Numbers',
    menuArticles: 'Articles',
    menuLotteryFormula: 'Lottery Formula',
    searchLottery: 'Search lottery name',
    searchLotteryPlaceholder: 'Search lottery name, e.g. Hanoi, Lao, stock',
    clearSearch: 'Clear search',
    noSearchResults: 'No lottery name found',
    lotteryThai: 'Thai Lottery',
    lotteryForeign: 'Foreign Lottery',
    lotteryStock: 'Stock Lottery',
    lotteryDaily: 'Daily Lottery',
    lotteryGroupFallback: 'this lottery group',
    noGroupResult: 'No {group} results for this draw',
    tryPreviousDraw: 'Try a previous draw or choose another date from the calendar',
    previousDayResults: 'View previous day results',
    nextDayResults: 'View next day results',
    noNextDayResults: 'No next day results yet',
    viewDateResults: 'View lottery results for {date}',
    viewHistory: 'View history',
    addToHomeScreen: 'Add to Home Screen',
    hideAddToHomeScreen: 'Hide Add to Home Screen button',
    installApp: 'Install app',
    close: 'Close',
    iosInstallStepShare: 'Tap the Share button in Safari',
    iosInstallStepAddToHome: 'Choose Add to Home Screen',
    iosInstallStepConfirm: 'Tap Add to place the icon on your Home Screen',
    androidInstallStepMenu: 'Open your browser menu',
    androidInstallStepInstall: 'Choose Install app or Add to Home screen',
  },
  la: {
    brand: 'ກວດຫວຍ',
    tagline: 'ຜົນຫວຍຕາມວັນທີ',
    home: 'ໜ້າຫຼັກ',
    todayResults: '🎰 ຜົນຫວຍປະຈຳວັນ',
    all: 'ທັງໝົດ',
    hasResult: 'ມີຜົນ',
    notFound: 'ບໍ່ພົບຂໍ້ມູນ',
    tryOther: 'ລອງປ່ຽນວັນທີ ຫຼື ກຸ່ມອື່ນ',
    loadFail: 'ໂຫຼດຂໍ້ມູນບໍ່ສຳເລັດ',
    firstPrize: 'ລາງວັນທີ 1',
    top3: '3 ໂຕເທິງ',
    top2: '2 ໂຕເທິງ',
    bottom2: '2 ໂຕລຸ່ມ',
    top3Short: '3 ເທິງ',
    top2Short: '2 ເທິງ',
    bottom2Short: '2 ລຸ່ມ',
    noResult: 'ງົດອອກຜົນ',
    notYet: 'ຍັງບໍ່ມີຜົນ',
    latest: 'ງວດລ່າສຸດ',
    history: 'ຜົນຍ້ອນຫຼັງ',
    historyDate: 'ວັນທີອອກ',
    page: 'ໜ້າ',
    previousPage: 'ກ່ອນໜ້າ',
    nextPage: 'ຖັດໄປ',
    draws: 'ງວດ',
    hourSuffix: 'ໂມງ',
    language: 'ພາສາ',
    menu: 'ເມນູ',
    menuGuide: 'ແນວທາງ',
    menuLuckyNumbers: 'ເລກເດັດ',
    menuArticles: 'ບົດຄວາມ',
    menuLotteryFormula: 'ສູດຄຳນວນຫວຍ',
    searchLottery: 'ຄົ້ນຫາຊື່ຫວຍ',
    searchLotteryPlaceholder: 'ຄົ້ນຫາຊື່ຫວຍ ເຊັ່ນ ຮານອຍ ລາວ ຫຸ້ນ',
    clearSearch: 'ລ້າງຄຳຄົ້ນຫາ',
    noSearchResults: 'ບໍ່ພົບຊື່ຫວຍທີ່ຄົ້ນຫາ',
    lotteryThai: 'ຫວຍໄທ',
    lotteryForeign: 'ຫວຍຕ່າງປະເທດ',
    lotteryStock: 'ຫວຍຫຸ້ນ',
    lotteryDaily: 'ຫວຍລາຍວັນ',
    lotteryGroupFallback: 'ກຸ່ມຫວຍນີ້',
    noGroupResult: 'ບໍ່ພົບຜົນ{group}ໃນງວດນີ້',
    tryPreviousDraw: 'ລອງເລືອກງວດກ່ອນໜ້າ ຫຼືປ່ຽນວັນທີຈາກປະຕິທິນດ້ານເທິງ',
    previousDayResults: 'ເບິ່ງຜົນຫວຍມື້ກ່ອນ',
    nextDayResults: 'ເບິ່ງຜົນຫວຍມື້ຖັດໄປ',
    noNextDayResults: 'ຍັງບໍ່ມີຜົນຫວຍມື້ຖັດໄປ',
    viewDateResults: 'ເບິ່ງຜົນຫວຍວັນທີ {date}',
    viewHistory: 'ເບິ່ງຜົນຍ້ອນຫຼັງ',
    addToHomeScreen: 'ເພີ່ມໄປໜ້າຈໍຫຼັກ',
    hideAddToHomeScreen: 'ເຊື່ອງປຸ່ມເພີ່ມໄປໜ້າຈໍຫຼັກ',
    installApp: 'ຕິດຕັ້ງແອັບ',
    close: 'ປິດ',
    iosInstallStepShare: 'ແຕະປຸ່ມ Share ໃນ Safari',
    iosInstallStepAddToHome: 'ເລືອກ Add to Home Screen',
    iosInstallStepConfirm: 'ແຕະ Add ເພື່ອວາງໄອຄອນເທິງໜ້າຈໍຫຼັກ',
    androidInstallStepMenu: 'ເປີດເມນູຂອງບຣາວເຊີ',
    androidInstallStepInstall: 'ເລືອກ Install app ຫຼື Add to Home screen',
  },
  kh: {
    brand: 'ឆែកឆ្នោត',
    tagline: 'លទ្ធផលតាមថ្ងៃ',
    home: 'ទំព័រដើម',
    todayResults: '🎰 លទ្ធផលឆ្នោតប្រចាំថ្ងៃ',
    all: 'ទាំងអស់',
    hasResult: 'មានលទ្ធផល',
    notFound: 'រកមិនឃើញទិន្នន័យ',
    tryOther: 'សូមសាកល្បងថ្ងៃ ឬ ក្រុមផ្សេង',
    loadFail: 'បរាជ័យក្នុងការផ្ទុក',
    firstPrize: 'រង្វាន់ទី១',
    top3: 'លេខ៣ខាងលើ',
    top2: 'លេខ២ខាងលើ',
    bottom2: 'លេខ២ខាងក្រោម',
    top3Short: '៣លើ',
    top2Short: '២លើ',
    bottom2Short: '២ក្រោម',
    noResult: 'ឈប់ប្រកាស',
    notYet: 'មិនទាន់មានលទ្ធផល',
    latest: 'ឆ្នោតថ្មីបំផុត',
    history: 'លទ្ធផលអតីតកាល',
    historyDate: 'ថ្ងៃចេញ',
    page: 'ទំព័រ',
    previousPage: 'មុន',
    nextPage: 'បន្ទាប់',
    draws: 'ដង',
    hourSuffix: 'ម៉ោង',
    language: 'ភាសា',
    menu: 'ម៉ឺនុយ',
    menuGuide: 'ការណែនាំ',
    menuLuckyNumbers: 'លេខសំណាង',
    menuArticles: 'អត្ថបទ',
    menuLotteryFormula: 'រូបមន្តគណនាឆ្នោត',
    searchLottery: 'ស្វែងរកឈ្មោះឆ្នោត',
    searchLotteryPlaceholder: 'ស្វែងរកឈ្មោះឆ្នោត ដូចជា Hanoi, Lao, stock',
    clearSearch: 'សម្អាតការស្វែងរក',
    noSearchResults: 'រកមិនឃើញឈ្មោះឆ្នោត',
    lotteryThai: 'ឆ្នោតថៃ',
    lotteryForeign: 'ឆ្នោតបរទេស',
    lotteryStock: 'ឆ្នោតហ៊ុន',
    lotteryDaily: 'ឆ្នោតប្រចាំថ្ងៃ',
    lotteryGroupFallback: 'ក្រុមឆ្នោតនេះ',
    noGroupResult: 'រកមិនឃើញលទ្ធផល{group}សម្រាប់ជុំនេះ',
    tryPreviousDraw: 'សូមសាកល្បងជុំមុន ឬប្តូរថ្ងៃពីប្រតិទិនខាងលើ',
    previousDayResults: 'មើលលទ្ធផលឆ្នោតថ្ងៃមុន',
    nextDayResults: 'មើលលទ្ធផលឆ្នោតថ្ងៃបន្ទាប់',
    noNextDayResults: 'មិនទាន់មានលទ្ធផលថ្ងៃបន្ទាប់',
    viewDateResults: 'មើលលទ្ធផលឆ្នោតថ្ងៃទី {date}',
    viewHistory: 'មើលប្រវត្តិ',
    addToHomeScreen: 'បន្ថែមទៅអេក្រង់ដើម',
    hideAddToHomeScreen: 'លាក់ប៊ូតុងបន្ថែមទៅអេក្រង់ដើម',
    installApp: 'ដំឡើងកម្មវិធី',
    close: 'បិទ',
    iosInstallStepShare: 'ចុចប៊ូតុង Share ក្នុង Safari',
    iosInstallStepAddToHome: 'ជ្រើស Add to Home Screen',
    iosInstallStepConfirm: 'ចុច Add ដើម្បីដាក់រូបតំណាងលើអេក្រង់ដើម',
    androidInstallStepMenu: 'បើកម៉ឺនុយរបស់កម្មវិធីរុករក',
    androidInstallStepInstall: 'ជ្រើស Install app ឬ Add to Home screen',
  },
  zh: {
    brand: '查彩票',
    tagline: '按日期查看开奖结果',
    home: '首页',
    todayResults: '🎰 今日开奖结果',
    all: '全部',
    hasResult: '已有结果',
    notFound: '未找到数据',
    tryOther: '请尝试其他日期或彩票分类',
    loadFail: '加载失败',
    firstPrize: '一等奖',
    top3: '前三位',
    top2: '前两位',
    bottom2: '后两位',
    top3Short: '前三',
    top2Short: '前二',
    bottom2Short: '后二',
    noResult: '暂停开奖',
    notYet: '尚无结果',
    latest: '最新期',
    history: '历史结果',
    historyDate: '开奖日期',
    page: '页面',
    previousPage: '上一页',
    nextPage: '下一页',
    draws: '期',
    hourSuffix: '',
    language: '语言',
    menu: '菜单',
    menuGuide: '指南',
    menuLuckyNumbers: '幸运号码',
    menuArticles: '文章',
    menuLotteryFormula: '彩票公式',
    searchLottery: '搜索彩票名称',
    searchLotteryPlaceholder: '搜索彩票名称，例如 Hanoi、Lao、stock',
    clearSearch: '清除搜索',
    noSearchResults: '未找到匹配的彩票名称',
    lotteryThai: '泰国彩票',
    lotteryForeign: '国外彩票',
    lotteryStock: '股票彩票',
    lotteryDaily: '每日彩票',
    lotteryGroupFallback: '此彩票分类',
    noGroupResult: '本期未找到{group}结果',
    tryPreviousDraw: '请尝试上一期，或从上方日历选择其他日期',
    previousDayResults: '查看前一天开奖结果',
    nextDayResults: '查看后一天开奖结果',
    noNextDayResults: '后一天开奖结果尚未开放',
    viewDateResults: '查看 {date} 彩票开奖结果',
    viewHistory: '查看历史',
    addToHomeScreen: '添加到主屏幕',
    hideAddToHomeScreen: '隐藏添加到主屏幕按钮',
    installApp: '安装应用',
    close: '关闭',
    iosInstallStepShare: '在 Safari 中点击分享按钮',
    iosInstallStepAddToHome: '选择添加到主屏幕',
    iosInstallStepConfirm: '点击添加，将图标放到主屏幕',
    androidInstallStepMenu: '打开浏览器菜单',
    androidInstallStepInstall: '选择安装应用或添加到主屏幕',
  },
}

export function isLang(v: unknown): v is Lang {
  return typeof v === 'string' && (LANGS as string[]).includes(v)
}
