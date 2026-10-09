import { LangTypesPixiv } from './Language'

/**
 * 小说分类的配置：保存小说的 genre（分类 id）与分类名称的对应关系。
 * 可以使用 Tools.getNovelGenreName 方法获取某个分类在当前页面语言里的名称。
 *
 * 数据来源：notes/小说分类页面里所有分类的的配置.json
 * 详细说明见：notes/小说分类页面里的所有分类.md
 */

/**
 * 小说的 genre 与分类名称的对应关系。
 * key 是分类 id（字符串形式的数字），value 是分类名称。
 *
 * 注意：原始数据里 id 为 '0' 的分类有 3 个（综合、受男性欢迎、受女性欢迎），
 * 它们是从所有原创作品里汇总而来的分类页面，并不是真的有分类 id 为 0。
 * 这里只保留了第一个（综合），因为小说的 genre 为 '0' 时表示它没有分类。
 */
const novelGenreMap = new Map<string, { [key in LangTypesPixiv]: string }>([
  [
    '0',
    {
      'zh-cn': '综合',
      'zh-tw': '綜合',
      en: 'All Genres',
      ja: '総合',
      ko: '종합',
      ms: 'Keseluruhan',
      th: 'ทั้งหมด',
    },
  ],
  [
    '1',
    {
      'zh-cn': '恋爱',
      'zh-tw': '戀愛',
      en: 'Romance',
      ja: '恋愛',
      ko: '연애',
      ms: 'Percintaan',
      th: 'ความรัก',
    },
  ],
  [
    '2',
    {
      'zh-cn': '异世界奇幻',
      'zh-tw': '異世界奇幻',
      en: 'Isekai fantasy',
      ja: '異世界ファンタジー',
      ko: '이세계 판타지',
      ms: 'Fantasi dunia lain',
      th: 'แฟนตาซีต่างโลก',
    },
  ],
  [
    '3',
    {
      'zh-cn': '现代奇幻',
      'zh-tw': '現代奇幻',
      en: 'Contemporary fantasy',
      ja: '現代ファンタジー',
      ko: '현대 판타지',
      ms: 'Fantasi zaman sekarang',
      th: 'แฟนตาซีร่วมสมัย',
    },
  ],
  [
    '4',
    {
      'zh-cn': '悬疑',
      'zh-tw': '懸疑',
      en: 'Mystery',
      ja: 'ミステリー',
      ko: '미스테리',
      ms: 'Misteri',
      th: 'ลึกลับ/สืบสวน',
    },
  ],
  [
    '5',
    {
      'zh-cn': '恐怖',
      'zh-tw': '恐怖',
      en: 'Horror',
      ja: 'ホラー',
      ko: '공포',
      ms: 'Seram',
      th: 'สยองขวัญ',
    },
  ],
  [
    '6',
    {
      'zh-cn': '科幻',
      'zh-tw': '科幻',
      en: 'Sci-fi',
      ja: 'SF',
      ko: 'SF',
      ms: 'Sains Fiksyen',
      th: 'ไซไฟ (Sci-Fi)',
    },
  ],
  [
    '7',
    {
      'zh-cn': '文学',
      'zh-tw': '文學',
      en: 'Literature',
      ja: '文学',
      ko: '문학',
      ms: 'Sastera',
      th: 'วรรณกรรม',
    },
  ],
  [
    '8',
    {
      'zh-cn': '生活・情感',
      'zh-tw': '生活・情感',
      en: 'Drama',
      ja: 'ヒューマンドラマ',
      ko: '휴먼드라마',
      ms: 'Drama',
      th: 'ละคร',
    },
  ],
  [
    '9',
    {
      'zh-cn': '历史・时代',
      'zh-tw': '歷史・時代',
      en: 'Historical pieces',
      ja: '歴史・時代',
      ko: '역사&시대',
      ms: 'Sejarah/Zaman',
      th: 'ประวัติศาสตร์/ยุคสมัย',
    },
  ],
  [
    '10',
    {
      'zh-cn': 'BL',
      'zh-tw': 'BL',
      en: 'BL (yaoi)',
      ja: 'BL',
      ko: 'BL',
      ms: 'BL (yaoi)',
      th: 'วาย/BL (yaoi)',
    },
  ],
  [
    '11',
    {
      'zh-cn': '百合',
      'zh-tw': '百合',
      en: 'Yuri',
      ja: '百合',
      ko: '백합',
      ms: 'Yuri',
      th: 'Yuri',
    },
  ],
  [
    '12',
    {
      'zh-cn': '儿童向',
      'zh-tw': '兒童向',
      en: 'For kids',
      ja: '子供向け',
      ko: '아동용',
      ms: 'Untuk kanak-kanak',
      th: 'สำหรับเด็ก',
    },
  ],
  [
    '13',
    {
      'zh-cn': '散文・诗歌',
      'zh-tw': '散文・詩歌',
      en: 'Poetry',
      ja: '詩',
      ko: '시',
      ms: 'Puisi',
      th: 'บทกวี',
    },
  ],
  [
    '14',
    {
      'zh-cn': '随笔・纪实',
      'zh-tw': '隨筆・紀實',
      en: 'Essays/non-fiction',
      ja: 'エッセイ・ノンフィクション',
      ko: '에세이&논픽션',
      ms: 'Karangan/bukan fiksyen',
      th: 'งานเขียน/Non-fiction',
    },
  ],
  [
    '15',
    {
      'zh-cn': '剧本・台本',
      'zh-tw': '劇本・腳本',
      en: 'Screenplays/scripts',
      ja: 'シナリオ・台本',
      ko: '시나리오&대본',
      ms: 'Senario/Skrip',
      th: 'บทละครและสคริปต์',
    },
  ],
  [
    '16',
    {
      'zh-cn': '评论・感想',
      'zh-tw': '評論・感想',
      en: 'Reviews/opinion pieces',
      ja: '評論・感想',
      ko: '평론&감상',
      ms: 'Ulasan/pendapat',
      th: 'บทวิจารณ์/รีวิว',
    },
  ],
  [
    '17',
    {
      'zh-cn': '其他',
      'zh-tw': '其他',
      en: 'Other',
      ja: 'その他',
      ko: '기타',
      ms: 'Lain-lain',
      th: 'อื่น ๆ',
    },
  ],
])

export { novelGenreMap }
