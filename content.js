/*
 * project: Pixiv Batch Downloader
 * author:  xuejianxianzun 雪见仙尊
 * license: GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
 * install: https://chrome.google.com/webstore/detail/pixiv-batch-downloader/hfgoikdmppghehigkckknikdgdcjbfpl
 * E-mail:  xuejianxianzun@gmail.com
 * Github： https://github.com/xuejianxianzun/PixivBatchDownloader
 * blog:    https://saber.love/pixiv
 * QQ 群:    499873152
 */

'use strict'

// 检测脚本版，使二者同时只运行一个
if (window.sessionStorage.getItem('xz_pixiv_userscript')) {
  throw new Error('userscript ver is running')
} else {
  // 标注自己
  window.sessionStorage.setItem('xz_pixiv_extension', '1')
}

let outputInfo // 输出信息的区域

let quietDownload = true // 是否快速下载。当可以下载时自动开始下载（无需点击下载按钮）

const downloadThreadDeauflt = 6 // 同时下载的线程数，可以通过设置 downloadThread 修改

let multipleDownNumber = 0 // 设置多图作品下载前几张图片。0为不限制，全部下载。改为1则只下载第一张。这是因为有时候多p作品会导致要下载的图片过多，此时可以设置只下载前几张，减少下载量

let displayCover = true // 是否显示tag搜索页里面的封面图片。如果tag搜索页的图片数量太多，那么加载封面图可能要很久，并且可能因为占用大量带宽导致抓取中断。这种情况下可以将此参数改为false，不加载封面图。

const fileNameLength = 200 // 文件名的最大长度，超出将会截断。如果文件的保存路径过长可能会保存失败，此时可以把这个数值改小些。

const viewerEnable = true // 是否启用看图模式

let xzSetting // 保存的设置

let locUrl = '' // 页面的url

let pageType // 页面类型

let oldPageType // 上一个页面类型

let tagMode // pageType 2 里，是否带 tag

let worksType // pageType 2 里的页面类型

let offsetNumber = 0 // 要去掉的作品数量

const onceRequest = 100 // 每次请求多少个数量

let type2IdList = [] // 储存 pageType 2 的 id 列表

let imgInfo = [] // 储存图片信息，其中可能会有空值，如 [] 和 ''

let illustUrlList = [] // 储存要下载的作品的页面url

const imgList = [] // 储存 tag 搜索页的所有作品

let ajaxForIllustThreads = 5 // 抓取页面时的并发连接数

const ajaxForIllustDelay = 100 // 抓取页面的并发请求每个间隔多少毫秒

let ajaxThreadsFinished = 0 // 统计有几个并发线程完成所有请求。统计的是并发数（ ajaxForIllustThreads ）而非请求数

let testSuffixFinished = true // 检查图片后缀名正确性的函数是否执行完毕

let testSuffixNo = 0 // 检查图片后缀名函数的计数

let nowTips = '' // 输出顶部提示

let baseUrl = '' // 列表页url规则

let startpageNo = 1 // 列表页开始抓取时的页码

let listPageFinished = 0 // 记录一共抓取了多少列表页

let tagPageFinished = 0 // 记录 tag 搜索页本次任务已经抓取了多少页

let wantPage // 要抓取几页

let quick = false // 快速下载当前页面，这个只在作品页内直接下载时使用

let interrupt = false // 是否中断正在进行的任务，目前仅在 tag 搜索页使用

let allowWork = true // 当前是否允许展开工作（如果有未完成的任务则应为 false

let notNeedTag = [] // 要排除的tag的列表

let needTag = [] // 必须包含的tag的列表

let notdownType = '' // 设置不要下载的作品类型

let isSetFilterWh = false // 是否设置了筛选宽高

let filterWh = {
  // 宽高条件
  andOr: '&',
  width: 0,
  height: 0
}

let isSetFilterBmk = false // 是否设置了筛选收藏数

let filterBmk = 0 // 要求收藏达到指定数量

let partNumber = 10 // 保存不同排行榜的列表数量

let requsetNumber = 0 // 要下载多少个作品

let maxNum = 0 // 最多允许获取多少数量，在相关作品、相似作品、大家/关注的新作品页面使用

let listIsNew = false // 列表页加载模式是否是新版

let tagSearchDataSelector = '' // tag 搜索页，储存作品信息的元素

const tagSearchListWrap = '.x7wiBV0' //  tag 搜索页，储存作品列表的元素

let tagSearchListSelector = '' // tag 搜索页，直接选择作品的选择器

const tagSearchMultipleSelector = '._3b8AXEx' // 多图作品的选择器

const tagSearchGifSelector = '.AGgsUWZ' // 动图作品的选择器

let tagSearchNewHtml = '' // tag 搜索页作品的html

// tag 搜索页作品的html中的多图标识
const xzMultipleHtml = `<div class="${tagSearchMultipleSelector.replace(
  '.',
  ''
)}"><span><span class="XPwdj2F"></span>xz_pageCount</span></div>`

// tag 搜索页作品的html中的动图标识
const xzGifHtml = `<div class="${tagSearchGifSelector.replace('.', '')}"></div>`

const safeFileNameRule = new RegExp(/\\|\/|:|\?|"|<|'|>|\*|\||~|\u200b|\.$/g) // 安全的文件名

const safeFolderRule = new RegExp(/\\|:|\?|"|<|'|>|\*|\||~|\u200b|\.$/g) // 文件夹名，允许斜线 /

let rightButton // 右侧按钮

let centerWrap // 中间设置面板

let centerBtnWrap // 中间插入按钮的区域

const xzBlue = '#0ea8ef'
const xzGreen = '#14ad27'
const xzRed = '#f33939'
let downloadBarList // 下载队列的dom元素

let downloadThread // 下载线程

let downloadA // 下载用的a标签

let downloadStarted = false // 下载是否已经开始

let downloaded = 0 // 已下载的文件

let downloadStop = false // 是否停止下载

let downloadPause = false // 是否暂停下载

let oldTitle = document.title // 原始 title，需要加下载状态时使用

let titleTimer // 修改 title 的定时器
let clickTime = 0 // 点击下载按钮的时间戳

let timeDelay = 0 // 延迟点击的时间

const timeInterval = 400 // 为了不会漏下图，设置的两次点击之间的间隔时间。下载图片的速度越快，此处的值就需要越大。默认的400是比较大的，如果下载速度慢，可以尝试改成300/200。

let downRelated = false // 下载相关作品（作品页内的）

let viewerWarpper // 图片列表的容器

let viewerUl // 图片列表的 ul 元素

let myViewer // 查看器

let quickBookmarkElement // 快速收藏的元素

let downloadGifBtn // 下载 gif 的按钮

let gifImgList // 储存 gif 图片列表的元素

let zipFile = null // 获取的 zip 文件

let fileNumber = 0 // 动图压缩包里有多少个文件

let gifSrc = '' // 动图源文件 url

let gifMimeType = '' // 图片 mime type

let gifDelay // 动图帧延迟

let xzForm // 设置面板的表单

let xzTipEl // 用于显示提示的元素

let pageInfo = {} // 储存页面上可以用作文件名的信息

let puser = '' // 页面上的画师名

let optionAreaShow = true // 是否显示选项区域

let delWork = false // 是否处于删除作品状态

let onlyDownBmk = false // 是否只下载收藏的作品

let ratioType = '0' // 宽高比例的类型

const pauseStartDealy = 2500 // 点击暂停后，一定时间后才允许点击开始下载按钮

let canStartTime = 0 // 在此时间之后允许点击开始下载按钮

// 多语言配置
const userLang = document.documentElement.lang // 获取语言选项

let langType // 语言类型

switch (userLang) {
  case 'zh':
  case 'zh-CN':
  case 'zh-Hans':
    langType = 0 // 设置为简体中文
    break

  case 'ja':
    langType = 1 // 设置为日语
    break

  case 'zh-Hant':
  case 'zh-tw':
  case 'zh-TW':
    langType = 3 // 设置为繁体中文
    break

  default:
    langType = 2 // 设置为英语
    break
}

// 储存语言配置。日文和英文目前是机翻，欢迎对翻译进行完善
const xzLang = {
  // 在属性名前面加上下划线，和文本内容做出区别。{}表示需要进行替换的部分
  _过滤作品类型的按钮: [
    '排除指定类型的作品',
    'タイプでフィルタリングする',
    'Filter by works type',
    '排除指定類型的作品'
  ],
  _过滤作品类型的按钮Title: [
    '在下载前，您可以设置想要排除的作品类型。',
    'ダウンロードする前に、除外するタイプを設定することができます。',
    'Before downloading, you can set the type you want to exclude.',
    '在下載前，您可以設定想要排除的作品類型'
  ],
  _过滤作品类型的弹出框文字: [
    '请输入数字来设置下载时要排除的作品类型。\n如需多选，将多个数字连写即可\n如果什么都不输入，那么将不排除任何作品\n1: 排除单图\n2: 排除多图\n3: 排除动图\n4: 排除已经收藏的作品',
    'ダウンロード時に除外するタイプを設定する番号を入力してください。\nさまざまなオプションが必要な場合は、それを連続して入力することができます。\n1.単一の画像の作品を除外する\n2.複数の画像の作品を除外する\n3.うごイラの作品を除外する\n4: ブックマーク',
    'Please enter a number to set the type of you want to excluded when downloading.\nIf you need multiple choice, you can enter continuously.\n1: one-images works\n2.multiple-images works\n3.animat works\n4.bookmarked works',
    '請輸入數字來設定下載時要排除的作品類型。\n如需多選，將多個數字連寫即可\n如果什麼都不輸入，那麼將不排除任何作品\n1: 排除單圖\n2: 排除多圖\n3: 排除動圖\n4: 排除已經收藏的作品'
  ],
  _只下载已收藏: [
    '只下载已收藏',
    'ブックマークのみをダウンロードする',
    'Download only bookmarked works',
    '只下載已收藏'
  ],
  _只下载已收藏的提示: [
    '只下载已经收藏的作品',
    '既に収集された作品のみをダウンロードする',
    'Download only bookmarked works',
    '只下載已經收藏的作品'
  ],
  _设置作品类型: [
    '设置作品类型',
    'ダウンロードする作品のタイプを設定する',
    'Set the type of work',
    '設定作品類型'
  ],
  _设置作品类型的提示Center: [
    '下载哪些类型的作品',
    'ダウンロードする作品の種類',
    'Which types of works to download',
    '下載哪些類型的作品'
  ],
  _多p下载前几张: [
    '多图作品设置',
    'マルチピクチャワーク設定',
    'Multiple images work setting',
    '多圖作品設定'
  ],
  _多p下载前几张提示: [
    '如果数字大于 0，多图作品只会下载前几张图片。（按照设置的数量）',
    '数字が0より大きい場合、マルチピクチャは最初のいくつかのイメージのみをダウンロードします。 （設定数に応じて）',
    'If the number is greater than 0, the multiple images work will only download the first few images. (according to the number of settings)',
    '如果數字大於 0，多圖作品只會下載前幾張圖片。（依照設定的數量）'
  ],
  _排除tag的按钮文字: [
    '设置作品不能包含的tag',
    '作品に含まれていないタグを設定する',
    'Set the tag that the work can not contain',
    '設定作品不能包含的tag'
  ],
  _不能含有tag: [
    '不能含有 tag&nbsp;',
    '指定したタグを除外する',
    'Exclude specified tag',
    '不能含有 tag&nbsp;'
  ],
  _排除tag的按钮Title: [
    '在下载前，您可以设置想要排除的tag',
    'ダウンロードする前に、除外するタグを設定できます',
    'Before downloading, you can set the tag you want to exclude',
    '在下載前，您可以設定想要排除的tag'
  ],
  _排除tag的提示文字: [
    '您可在下载前设置要排除的tag，这样在下载时将不会下载含有这些tag的作品。区分大小写；如需排除多个tag，请使用英文逗号分隔。请注意要排除的tag的优先级大于要包含的tag的优先级。',
    "ダウンロードする前に、除外するタグを設定できます。ケースセンシティブ；複数のタグを設定する必要がある場合は、','を分けて使用できます。除外されたタグは、含まれているタグよりも優先されます",
    "Before downloading, you can set the tag you want to exclude. Case sensitive; If you need to set multiple tags, you can use ',' separated. The excluded tag takes precedence over the included tag",
    '您可在下載前設定要排除的tag，這樣在下載時將不會下載含有這些tag的作品。區分大小寫；如需排除多個tag，請使用英文逗號分隔。請注意要排除的tag的優先等級大於要包含的tag的優先等級。'
  ],
  _设置了排除tag之后的提示: [
    '本次任务设置了排除的tag:',
    'このタスクはタグを除外します：',
    'This task excludes tag:',
    '本次工作設定了排除的tag:'
  ],
  _必须tag的按钮文字: [
    '设置作品必须包含的tag',
    '作品に含める必要があるタグを設定する',
    'Set the tag that the work must contain',
    '設定作品必須包含的tag'
  ],
  _必须含有tag: [
    '必须含有 tag&nbsp;',
    'タグを含める必要があります',
    'Must contain tag',
    '必須含有 tag&nbsp;'
  ],
  _必须tag的按钮Title: [
    '在下载前，您可以设置必须包含的tag。',
    'ダウンロードする前に、含まれなければならないタグを設定することができます',
    'Before downloading, you can set the tag that must be included',
    '在下載前，您可以設定必須包含的tag。'
  ],
  _必须tag的提示文字: [
    '您可在下载前设置作品里必须包含的tag，区分大小写；如需包含多个tag，请使用英文逗号分隔。',
    "ダウンロードする前に、含まれなければならないタグを設定することができます。ケースセンシティブ；複数のタグを設定する必要がある場合は、','を分けて使用できます。",
    "Before downloading, you can set the tag that must be included. Case sensitive; If you need to set multiple tags, you can use ',' separated. ",
    '您可在下載前設定作品裡必須包含的tag，區分大小寫；如需包含多個tag，請使用英文逗號分隔。'
  ],
  _设置了必须tag之后的提示: [
    '本次任务设置了必须的tag：',
    'このタスクは、必要なタグを設定します：',
    'This task set the necessary tag: ',
    '本次工作設定了必須的tag：'
  ],
  _筛选宽高的按钮文字: [
    '设置宽高条件',
    '幅と高さの条件を設定する',
    'Set the width and height',
    '設定寬高條件'
  ],
  _筛选宽高的按钮Title: [
    '在下载前，您可以设置要下载的图片的宽高条件。',
    'ダウンロードする前に、ダウンロードする写真の幅と高さの条件を設定できます。',
    'Before downloading, you can set the width and height conditions of the pictures you want to download.',
    '在下載前，您可以設定要下載的圖片的寬高條件。'
  ],
  _设置宽高比例: [
    '设置宽高比例',
    '縦横比を設定する',
    'Set the aspect ratio',
    '設定寬高比例'
  ],
  _设置宽高比例Title: [
    '设置宽高比例，也可以手动输入宽高比',
    '縦横比を設定するか、手動で縦横比を入力します',
    'Set the aspect ratio, or manually enter the aspect ratio',
    '設定寬高比，也可以手動輸入寬高比'
  ],
  _不限制: ['不限制', '無制限', 'not limited', '不限制'],
  _横图: ['横图', '横方向の絵', 'Horizontal picture', '橫圖'],
  _竖图: ['竖图', '縦方向の絵', 'Vertical picture', '豎圖'],
  _输入宽高比: ['宽高比 >=', '縦横比 >=', 'Aspect ratio >=', '寬高比 >='],
  _设置了宽高比之后的提示: [
    '本次任务设置了宽高比：{}',
    'このタスクは縦横比を設定します：{}',
    'This task sets the aspect ratio: {}',
    '本次工作設定了寬高比：{}'
  ],
  _宽高比必须是数字: [
    '宽高比必须是数字',
    '縦横比は数値でなければなりません',
    'The aspect ratio must be a number',
    '寬高比必須是數字'
  ],
  _筛选宽高的提示文字: [
    '请输入最小宽度和最小高度，不会下载不符合要求的图片。',
    '最小幅と最小高さを入力してください。要件を満たしていない画像はダウンロードされません。',
    'Please enter the minimum width and minimum height. Will not download images that do not meet the requirements',
    '請輸入最小寬度和最小高度，不會下載不符合要求的圖片。'
  ],
  _本次输入的数值无效: [
    '本次输入的数值无效',
    '無効な入力',
    'Invalid input',
    '本次輸入的數值無效'
  ],
  _设置成功: [
    '设置成功',
    'セットアップが正常に完了しました',
    'Set up successfully',
    '設定成功'
  ],
  _设置了筛选宽高之后的提示文字p1: [
    '本次任务设置了过滤宽高条件:宽度>=',
    'この作業では、フィルターの幅と高さの条件を設定します。幅≥',
    'This task sets the filter width and height conditions. Width ≥',
    '本次工作設定了篩選寬高條件:寬度>='
  ],
  _或者: [' 或者 ', ' または ', ' or ', ' 或是 '],
  _并且: [' 并且 ', ' そして ', ' and ', ' 並且 '],
  _高度设置: ['高度>=', '高さ≥', 'height ≥', '高度>='],
  _个数: [
    '设置作品数量',
    '作品数を設定する',
    'Set the number of works',
    '設定作品數量'
  ],
  _页数: [
    '设置页面数量',
    'ページ数を設定する',
    'Set the number of pages',
    '設定頁面數量'
  ],
  _页数提示: [
    '请输入要获取的页数',
    '取得するページ数を入力してください',
    'Please enter the number of pages to get',
    '請輸入要取得的頁數'
  ],
  _筛选收藏数的按钮文字: [
    '设置收藏数量',
    'お気に入りの数を設定する',
    'Set the bookmarkCount conditions',
    '設定收藏數量'
  ],
  _筛选收藏数的按钮Title: [
    '在下载前，您可以设置对收藏数量的要求。',
    'ダウンロードする前に、お気に入り数の要件を設定することができます。',
    'Before downloading, You can set the requirements for the number of bookmarks.',
    '在下載前，您可以設定對收藏數量的要求。'
  ],
  _筛选收藏数Center: [
    '设置收藏数量',
    'ブックマークの数を設定する',
    'Set the number of bookmarks',
    '設定收藏數量'
  ],
  _筛选收藏数的提示Center: [
    '如果作品的收藏数小于设置的数字，作品不会被下载。',
    '作品のブックマークの数が設定された数よりも少ない場合、作品はダウンロードされません。',
    'If the number of bookmarks of the work is less than the set number, the work will not be downloaded.',
    '如果作品的收藏數小於設定的數字，作品不會被下載。'
  ],
  _筛选收藏数的提示文字: [
    '请输入一个数字，如果作品的收藏数小于这个数字，作品不会被下载。',
    '数字を入力してください。 作品のブックマークの数がこの数より少ない場合、作品はダウンロードされません。',
    'Please enter a number. If the number of bookmarks of the work is less than this number, the work will not be downloaded.',
    '請輸入一個數字，如果作品的收藏數小於這個數字，作品不會被下載。'
  ],
  _设置了筛选收藏数之后的提示文字: [
    '本次任务设置了收藏数条件:收藏数>=',
    'このタスクは、お気に入りの数を設定します。条件：お気に入りの数≥',
    'This task sets the number of bookmarks condition: number of bookmarks ≥',
    '本次工作設定了收藏數條件:收藏數>='
  ],
  _本次任务已全部完成: [
    '本次任务已全部完成。',
    'このタスクは完了しました。',
    'This task has been completed.',
    '本次工作已全部完成'
  ],
  _当前任务尚未完成1: [
    '当前任务尚未完成，请等到提示完成之后再设置新的任务。',
    '現在のタスクはまだ完了していません。お待ちください。',
    'The current task has not yet completed, please wait.',
    '目前工作尚未完成，請等到提示完成之後再設定新的工作。'
  ],
  _checkWantPageRule1Arg2: [
    '参数不合法，本次操作已取消。<br>',
    'パラメータは有効ではありません。この操作はキャンセルされました。<br>',
    'Parameter is not legal, this operation has been canceled.<br>',
    '參數不合法，本次動作已取消。<br>'
  ],
  _checkWantPageRule1Arg3: [
    '任务开始<br>本次任务条件: 从本页开始下载-num-个作品',
    'タスクが開始されます。<br>このタスク条件：このページから-num-枚の作品をダウンロード。',
    'Task starts. <br>This task condition: Download -num- works from this page.',
    '工作開始<br>本次工作條件: 從本頁開始下載-num-個作品'
  ],
  _checkWantPageRule1Arg4: [
    '任务开始<br>本次任务条件: 向下获取所有作品',
    'タスクが開始されます。<br>このタスク条件：このページからすべての作品をダウンロードする。',
    'Task starts. <br>This task condition: download all the work from this page.',
    '工作開始<br>本次工作條件: 向下取得所有作品'
  ],
  _checkWantPageRule1Arg5: [
    '从本页开始下载<br>如果不限制下载的页数，请不要修改此默认值。<br>如果要限制下载的页数，请输入从1开始的数字，1为仅下载本页。',
    'このページからダウンロードする<br>ダウンロードしたページ数を制限しない場合は、デフォルト値のままにしておきます。<br>ダウンロードするページ数を設定する場合は、1から始まる番号を入力します。 現在のページは1です。',
    'Download from this page<br>If you do not limit the number of pages downloaded, leave the default value.<br>If you want to set the number of pages to download, enter a number starting at 1. This page is 1.',
    '從本頁開始下載<br>如果不限制下載的頁數，請不要變更此預設值。<br>如果要限制下載的頁數，請輸入從1開始的數字，1為僅下載本頁。'
  ],
  _checkWantPageRule1Arg8: [
    '从本页开始下载<br>如果要限制下载的页数，请输入从1开始的数字，1为仅下载本页。',
    'このページからダウンロードする<br>ダウンロードするページ数を設定する場合は、1から始まる番号を入力します。 現在のページは1です。',
    'Download from this page<br>If you want to set the number of pages to download, enter a number starting at 1. This page is 1.',
    '從本頁開始下載<br>如果要限制下載的頁數，請輸入從1開始的數字，1為僅下載本頁。'
  ],
  _checkWantPageRule1Arg6: [
    '任务开始<br>本次任务条件: 从本页开始下载-num-页',
    'タスクが開始されます。<br>このタスク条件：現在のページから-num-ページ',
    'Task starts. <br>This task condition: download -num- pages from the current page',
    '工作開始<br>本次工作條件: 從本頁開始下載-num-頁'
  ],
  _checkWantPageRule1Arg7: [
    '任务开始<br>本次任务条件: 下载所有页面',
    'タスクが開始されます。<br>このタスク条件：すべてのページをダウンロード',
    'Task starts. <br>This task condition: download all pages',
    '工作開始<br>本次工作條件: 下載所有頁面'
  ],
  _checkWantPageRule1Arg9: [
    '任务开始<br>本次任务条件: 下载 -num- 个相关作品',
    'タスクが開始されます。<br>このタスク条件：関連作品 -num- 点をダウンロードする。',
    'Task starts. <br>This task condition: download -num- related works.',
    '工作開始<br>本次工作條件: 下載 -num- 個相關作品'
  ],
  _checkWantPageRule1Arg10: [
    '任务开始<br>本次任务条件: 下载所有相关作品',
    'タスクが開始されます。<br>このタスク条件：関連作品をすべてダウンロード。',
    'Task starts. <br>This task condition: download all related works.',
    '工作開始<br>本次工作條件: 下載所有相關作品'
  ],
  _请输入最低收藏数和要抓取的页数: [
    '请输入最低收藏数和要抓取的页数，用英文逗号分开。\n类似于下面的形式: \n1000,1000',
    "お気に入りの最小数とクロールするページ数を，','で区切って入力してください。\n例えば：\n1000,1000",
    "Please enter the minimum number of bookmarks, and the number of pages to be crawled, separated by ','.\nE.g:\n1000,1000",
    '請輸入最低收藏數和要擷取的頁數，用英文逗號分開。\n類似於下面的形式: \n1000,1000'
  ],
  _参数不合法1: [
    '参数不合法，请稍后重试。',
    'パラメータが有効ではありません。後でやり直してください。',
    'Parameter is not legal, please try again later.',
    '參數不合法，請稍後重試。'
  ],
  _tag搜索任务开始: [
    '任务开始<br>本次任务条件: 收藏数不低于{}，向下抓取{}页',
    'タスクが開始されます。<br>このタスク条件：ブックマークの数は{}ページ以上で、{}ページがクロールされます。',
    'Task starts. <br>This task condition: the number of bookmarks is not less than {}, {} pages down to crawl.',
    '工作開始<br>本次工作條件: 收藏數不低於{}，向下擷取{}頁'
  ],
  _wantPage弹出框文字PageType10: [
    '您想要下载多少页？请输入数字。\r\n当前模式下，列表页的页数最多只有',
    'ダウンロードしたいページ数を入力してください。 \r\n最大値：',
    'Please enter the number of pages you want to download.\r\n The maximum value is ',
    '您想要下載多少頁？請輸入數字。\r\n目前模式下，清單頁的頁數最多只有'
  ],
  _输入超过了最大值: [
    '您输入的数字超过了最大值',
    '入力した番号が最大値を超えています',
    'The number you entered exceeds the maximum',
    '您輸入的數字超過了最大值'
  ],
  _多图作品下载张数: [
    '多图作品将下载前{}张图片',
    '2枚以上の作品，最初の{}枚の写真をダウンロードする',
    'Multi-artwork will download the first {} pictures',
    '多圖作品將下載前{}張圖片'
  ],
  _任务开始1: [
    '任务开始<br>本次任务条件: 从本页开始下载{}页',
    'タスクが開始されます。<br>このタスク条件：このページから{}ページをダウンロードする',
    'Task starts. <br>This task condition: download {} pages from this page',
    '工作開始<br>本次工作條件: 從本頁開始下載{}頁'
  ],
  _任务开始0: [
    '任务开始',
    'タスクが開始されます。',
    'Task starts.',
    '工作開始'
  ],
  _checkNotdownTypeResult1弹窗: [
    '由于您排除了所有作品类型，本次任务已取消。',
    'すべての種類の作業を除外したため、タスクはキャンセルされました。',
    'Because you excluded all types of work, the task was canceled.',
    '由於您排除了所有作品類型，本次工作已取消。'
  ],
  _checkNotdownTypeResult1Html: [
    '排除作品类型的设置有误，任务取消!',
    '作業タイプの除外にエラー設定がありました。 タスクがキャンセルされました。',
    'There was an error setting for the exclusion of the work type. Task canceled.',
    '排除作品類型的設定有誤，工作取消!'
  ],
  _checkNotdownTypeResult2弹窗: [
    '由于作品类型的设置有误，本次任务已取消。',
    '除外タイプを設定する際にエラーが発生しました。 タスクがキャンセルされました。',
    'There was an error setting for the exclusion of the work type. Task canceled.',
    '由於作品類型的設定有誤，本次工作已取消。'
  ],
  _checkNotdownTypeResult3Html: [
    '本次任务设置了排除作品类型:',
    'このダウンロードでは、このタイプの作品は除外されます：',
    'This task excludes these types of works:',
    '本次工作設定了排除作品類型:'
  ],
  _单图: ['单图 ', '1枚の作品', 'one images', '單圖 '],
  _多图: ['多图 ', '2枚以上の作品', 'multiple images', '多圖 '],
  _动图: ['动图 ', 'うごイラ', 'GIF', '動圖 '],
  _tag搜索页已抓取多少页: [
    '已抓取本次任务第{}/{}页，当前加载到第{}页',
    '{}/{}ページをクロールしています。 現在のページ番号は{}ページです',
    'Has been crawling {} / {} pages. The current page number is page {}',
    '已擷取本次工作第{}/{}頁，目前載入到第{}頁'
  ],
  _tag搜索页任务完成1: [
    '本次任务完成。当前有{}张作品。',
    'この作業は完了です。 今は{}枚の作品があります。',
    'This task is completed. There are now {} works.',
    '本次工作完成。目前有{}張作品。'
  ],
  _tag搜索页任务完成2: [
    '已抓取本tag的所有页面，本次任务完成。当前有{}张作品。',
    'この作業は完了です。 今は{}枚の作品があります。',
    'This task is completed. There are now {} works.',
    '已擷取本tag的所有頁面，本次工作完成。目前有{}張作品。'
  ],
  _tag搜索页中断: [
    '当前任务已中断!<br>当前有{}张作品。',
    '現在のタスクが中断されました。<br>今は{}枚の作品があります。',
    'The current task has been interrupted.<br> There are now {} works.',
    '目前工作已中斷!<br>目前有{}張作品。'
  ],
  _排行榜进度: [
    '已抓取本页面第{}部分',
    'このページの第{}部がクロールされました',
    'Part {} of this page has been crawled',
    '已擷取本頁面第{}部分'
  ],
  _相关作品抓取完毕: [
    '相关作品抓取完毕。包含有{}张作品，开始获取作品信息。',
    '関連作品はクロールされました。 {}作品を含み、その作品に関する情報の取得を開始します。',
    'The related works have been crawled. Contains {} works and starts getting information about the work.',
    '相關作品擷取完畢。包含有{}張作品，開始取得作品資訊。'
  ],
  _排行榜任务完成: [
    '本页面抓取完毕。当前有{}张作品，开始获取作品信息。',
    'このページはクロールされ、{}個の作品があります。 詳細は作品を入手し始める。',
    'This page is crawled and now has {} works. Start getting the works for more information.',
    '本頁面擷取完畢。目前有{}張作品，開始取得作品資訊。'
  ],
  _列表页获取完成2: [
    '列表页获取完成。<br>当前有{}张作品，开始获取作品信息。',
    'リストページがクロールされます。<br>{}個の作品があります。 詳細は作品を入手し始める。',
    'The list page gets done. <br>Now has {} works. Start getting the works for more information.',
    '清單頁取得完成。<br>目前有{}張作品，開始取得作品資訊。'
  ],
  _列表页抓取进度: [
    '已抓取列表页{}个页面',
    '{}のリストページを取得しました',
    'Has acquired {} list pages',
    '已擷取清單頁{}個頁面'
  ],
  _列表页抓取完成: [
    '列表页面抓取完成，开始获取图片网址',
    'リストページがクロールされ、画像URLの取得が開始されます',
    'The list page is crawled and starts to get the image URL',
    '清單頁面擷取完成，開始取得圖片網址'
  ],
  _列表页抓取结果为零: [
    '抓取完毕，但没有找到符合筛选条件的作品。',
    'クロールは終了しましたが、フィルタ条件に一致する作品が見つかりませんでした。',
    'Crawl finished but did not find works that match the filter criteria.',
    '擷取完畢，但沒有找到符合篩選條件的作品。'
  ],
  _排行榜列表页抓取遇到404: [
    '本页面抓取完成。当前有{}张作品，开始获取作品信息。',
    'このページはクロールされます、{}個の作品があります。 詳細は作品を入手して始める。',
    'This page is crawled. Now has {} works. Start getting the works for more information.',
    '本頁面擷取完成。目前有{}張作品，開始取得作品資訊。'
  ],
  _当前任务尚未完成2: [
    '当前任务尚未完成，请等待完成后再下载。',
    '現在のタスクはまだ完了していません',
    'The current task has not yet been completed',
    '目前工作尚未完成，請等待完成後再下載。'
  ],
  _列表抓取完成开始获取作品页: [
    '当前列表中有{}张作品，开始获取作品信息',
    '{}個の作品があります。 詳細は作品を入手し始める。',
    'Now has {} works. Start getting the works for more information.',
    '目前清單中有{}張作品，開始取得作品資訊'
  ],
  _开始获取作品页面: [
    '<br>开始获取作品页面',
    '<br>作品ページの取得を開始する',
    '<br>Start getting the works page',
    '<br>開始取得作品頁面'
  ],
  _无权访问1: [
    '无权访问{}，抓取中断。',
    'アクセス{}、中断はありません。',
    'No access {}, interruption.',
    '無權造訪{}，擷取中斷。'
  ],
  _无权访问2: [
    '无权访问{}，跳过该作品。',
    'アクセス{}、無視する。',
    'No access {}, skip.',
    '無權造訪{}，跳過該作品。'
  ],
  _作品页状态码0: [
    '请求的url不可访问',
    '要求されたURLにアクセスできません',
    'The requested url is not accessible',
    '要求的url無法造訪'
  ],
  _作品页状态码400: [
    '该作品已被删除',
    '作品は削除されました',
    'The work has been deleted',
    '該作品已被刪除'
  ],
  _作品页状态码403: [
    '无权访问请求的url 403',
    'リクエストされたURLにアクセスできない 403',
    'Have no access to the requested url 403',
    '無權造訪要求的url 403'
  ],
  _作品页状态码404: [
    '404 not found',
    '404 not found',
    '404 not found',
    '404 not found'
  ],
  _抓取图片网址的数量: [
    '已获取{}个图片网址',
    '{}つの画像URLを取得',
    'Get {} image URLs',
    '已取得{}個圖片網址'
  ],
  _正在抓取: [
    '正在抓取，请等待……',
    '取得中、しばらくお待ちください...',
    'Getting, please wait...',
    '正在擷取，請等待……'
  ],
  _获取全部书签作品: [
    '获取全部书签作品，时间可能比较长，请耐心等待。',
    'ブックマークしたすべての作品を入手すると、時間がかかることがあります。お待ちください。',
    'Get all bookmarked works, the time may be longer, please wait.',
    '取得全部書籤作品，時間可能比較長，請耐心等待。'
  ],
  _抓取图片网址遇到中断: [
    '当前任务已中断!',
    '現在のタスクが中断されました。',
    'The current task has been interrupted.',
    '目前工作已中斷!'
  ],
  _收起下载按钮: [
    '收起下载按钮',
    'ダウンロードボタンを非表示にする',
    '',
    '摺疊下載按鈕'
  ],
  _展开下载按钮: [
    '展开下载按钮',
    'ダウンロードボタンを表示',
    '',
    '展開下載按鈕'
  ],
  _展开收起下载按钮Title: [
    '展开/收起下载按钮',
    'ダウンロードボタンを表示/非表示',
    'Show / hide download button',
    '展開/摺疊下載按鈕'
  ],
  _关闭: ['关闭', 'クローズ', 'close', '關閉'],
  _输出信息: ['输出信息', '出力情報', 'Output information', '輸出資訊'],
  _复制: ['复制', 'コピー', 'Copy', '複製'],
  _已复制到剪贴板: [
    '已复制到剪贴板，可直接粘贴',
    'クリップボードにコピーされました',
    'Has been copied to the clipboard',
    '已複製至剪貼簿，可直接貼上'
  ],
  _下载设置: [
    '下载设置',
    '設定をダウンロードする',
    'Download settings',
    '下載設定'
  ],
  _隐藏: ['隐藏', '隠された', 'hide', '隱藏'],
  _收起展开设置项: [
    '收起/展开设置项',
    '設定の折りたたみ/展開',
    'Collapse/expand settings',
    '摺疊/展開設定項目'
  ],
  _github: [
    'Github 页面，欢迎 star',
    'Githubのページ、starをクリックしてください',
    'Github page, if you like, please star it',
    'Github 頁面，歡迎 star'
  ],
  _wiki: [
    '使用说明',
    '使用説明書',
    'Wiki',
    'Wiki'
  ],
  _快捷键切换显示隐藏: [
    '使用 Alt + X，可以显示和隐藏下载面板',
    'Alt + Xを使用してダウンロードパネルを表示および非表示にする',
    'Use Alt + X to show and hide the download panel',
    '使用 Alt + X，可以顯示和隱藏下載面板'
  ],
  _设置命名规则3: [
    '共抓取到 {} 个图片',
    '合計 {} 枚の画像を取得し',
    'Grab a total of {} pictures',
    '共擷取到 {} 個圖片'
  ],
  _设置文件名: [
    '设置命名规则',
    '命名規則を設定する',
    'Set naming rules',
    '設定命名規則'
  ],
  _设置文件夹名的提示: [
    `可以使用 '/' 建立文件夹<br>示例：{p_title}/{user}/{id}`,
    `フォルダは '/'で作成できます<br>例：{p_title}/{user}/{id}`,
    `You can create a folder with '/'<br>Example：{p_title}/{user}/{id}`,
    `可以使用 '/' 建立資料夾<br>範例：{p_title}/{user}/{id}`
  ],
  _添加字段名称: [
    '添加字段名称',
    'フィールド名を追加',
    'Add field name',
    '添加字段名稱'
  ],
  _添加字段名称提示: [
    '例如，在用户名前面添加“user_”标记',
    'たとえば、ユーザー名の前に "user_"タグを追加します。',
    'For example, add the "user_" tag in front of the username',
    '例如，在用户名前面添加“user_”标记'
  ],
  _查看标记的含义: [
    '查看标记的含义',
    'タグの意味を表示する',
    'View the meaning of the tag',
    '檢視標記的意義'
  ],
  _可用标记1: [
    '默认文件名，如 44920385_p0',
    'デフォルトのファイル名，例 44920385_p0',
    'Default file name, for example 44920385_p0',
    '預設檔案名稱，如 44920385_p0'
  ],
  _可用标记9: [
    '数字 id，如 44920385',
    '44920385 などの番号 ID',
    'Number id, for example 44920385',
    '數字 id，如 44920385'
  ],
  _可用标记10: [
    '图片在作品内的序号，如 0、1、2、3……',
    '0、1、2、3など、作品の写真のシリアル番号。',
    'The serial number of the picture in the work, such as 0, 1, 2, 3...',
    '圖片在作品內的序號，如 0、1、2、3……'
  ],
  _可用标记2: ['作品标题', '作品のタイトル', 'works title', '作品標題'],
  _可用标记3: [
    '作品的 tag 列表',
    '作品の tags',
    'Tags of works',
    '作品的 tag 清單'
  ],
  _可用标记4: ['画师名字', 'アーティスト名', 'Artist name', '畫師名稱'],
  _可用标记6: ['画师 id', 'アーティスト ID', 'Artist id', '畫師 id'],
  _可用标记7: ['宽度和高度', '幅と高さ', 'width and height', '寬度和高度'],
  _可用标记8: [
    'bookmark-count，作品的收藏数。把它放在最前面就可以让下载后的文件按收藏数排序。',
    'bookmark-count，作品のコレクション数のコレクション数は。',
    'bookmark-count.',
    'bookmark-count，作品的收藏數。將它放在最前面就可以讓下載後的檔案依收藏數排序。'
  ],
  _可用标记5: [
    '您可以使用多个标记；建议在不同标记之间添加分割用的字符。示例：{id}-{userid}-{px}<br>* 在某些情况下，会有一些标记不可用。',
    '複数のタグを使用することができ；異なるタグ間に別の文字を追加することができます。例：{id}-{userid}-{px}<br>* 場合によっては、一部のタグが利用できず。',
    'You can use multiple tags, and you can add a separate character between different tags. Example: {id}-{userid}-{px}<br>* In some cases, some tags will not be available.',
    '您可以使用多個標記；建議在不同標記之間加入分隔用的字元。範例：{id}-{userid}-{px}<br>* 在某些情況下，會有一些標記不可用。'
  ],
  _文件夹标记PUser: [
    '当前页面的画师名字',
    'アーティスト名',
    'Artist name of this page',
    '目前頁面的畫師名稱'
  ],
  _文件夹标记PUid: [
    '当前页面的画师id',
    'アーティストID',
    'Artist id of this page',
    '目前頁面的畫師id'
  ],
  _文件夹标记PTag: [
    '当前页面的 tag',
    '現在のタグ',
    'Current tag',
    '目前頁面的 tag'
  ],
  _文件夹标记PTitle: [
    '当前页面的标题',
    'ページのタイトル',
    'The title of this page',
    '目前頁面的標題'
  ],
  _预览文件名: [
    '预览文件名',
    'ファイル名のプレビュー',
    'Preview file name',
    '預覽檔案名稱'
  ],
  _设置下载线程: [
    '设置下载线程',
    'ダウンロードスレッドを設定する',
    'Set the download thread',
    '設定下載執行緒'
  ],
  _线程数字: [
    '可以输入 1-10 之间的数字，设置同时下载的数量',
    '同時ダウンロード数を設定するには、1〜10の数値を入力します',
    'You can enter a number between 1-10 to set the number of concurrent downloads',
    '可以輸入 1-10 之間的數字，設定同時下載的數量'
  ],
  _下载按钮1: ['开始下载', 'start download', 'start download', '開始下載'],
  _下载按钮2: ['暂停下载', 'pause download', 'pause download', '暫停下載'],
  _下载按钮3: ['停止下载', 'stop download', 'stop download', '停止下載'],
  _下载按钮4: ['复制url', 'copy urls', 'copy urls', '複製url'],
  _当前状态: ['当前状态 ', '現在の状態 ', 'Now state ', '目前狀態 '],
  _未开始下载: [
    '未开始下载',
    'まだダウンロードを開始していません',
    'Not yet started downloading',
    '未開始下載'
  ],
  _下载进度: [
    '下载进度：',
    'ダウンロードの進捗状況：',
    'Download progress: ',
    '下載進度：'
  ],
  _下载线程: ['下载线程：', 'スレッド：', 'Thread: ', '下載執行緒：'],
  _查看下载说明: [
    '查看下载说明',
    '指示の表示',
    'View instructions',
    '檢視下載說明'
  ],
  _下载说明: [
    '下载的文件保存在浏览器的下载目录里。<br>.ugoira 后缀名的文件是动态图的源文件，可以使用软件 <a href="https://en.bandisoft.com/honeyview/" target="_blank">HoneyView</a> 查看。<br>请不要在浏览器的下载选项里选中\'总是询问每个文件的保存位置\'。<br>如果作品标题或tag里含有不能做文件名的字符，会被替换成下划线_。<br>如果下载进度卡住不动了，您可以先点击“暂停下载”按钮，之后点击“开始下载”按钮，尝试继续下载。<br><b>如果下载后的文件名异常，请禁用其他有下载功能的浏览器扩展。</b><br>QQ群：499873152',
    'ダウンロードしたファイルは、ブラウザのダウンロードディレクトリに保存されます。<br>.ugoiraサフィックスファイルは、動的グラフのソースファイルです，ソフトウェア <a href="https://en.bandisoft.com/honeyview/" target="_blank">HoneyView</a> を使用して表示することができます。<br>ダウンロードの進行状況が継続できない場合は、[ダウンロードの一時停止]ボタンをクリックし、[ダウンロードの開始]ボタンをクリックしてダウンロードを続行します。<br><b>ダウンロード後のファイル名が異常な場合は、ダウンロード機能を持つ他のブラウザ拡張機能を無効にしてください。</b>',
    'The downloaded file is saved in the browser`s download directory.<br>The .ugoira suffix file is the source file for the dynamic graph, Can be viewed using the software <a href="https://en.bandisoft.com/honeyview/" target="_blank">HoneyView</a>.<br>If the download progress is stuck, you can click the "Pause Download" button and then click the "Start Download" button to try to continue the download.<br><b>If the file name after downloading is abnormal, disable other browser extensions that have download capabilities.</b>',
    '下載的檔案儲存在瀏覽器的下載目錄裡。<br>.ugoira 尾碼的檔案是動態圖的原始檔，可以使用軟體 <a href="https://en.bandisoft.com/honeyview/" target="_blank">HoneyView</a> 檢視。<br>請不要在瀏覽器的下載選項裡選取\'總是詢問每個檔案的儲存位置\'。<br>如果作品標題或tag裡含有不能做檔名的字元，會被取代為下劃線_。<br>如果下載進度卡住不動了，您可以先點選“暫停下載”按鈕，之後點選“開始下載”按鈕，嘗試繼續下載。<br><b>如果下載後的檔案名稱異常，請停用其他有下載功能的瀏覽器擴充功能。</b>'
  ],
  _正在下载中: ['正在下载中', 'ダウンロード中', 'downloading', '正在下載'],
  _下载完毕: [
    '下载完毕!',
    'ダウンロードが完了しました',
    'Download finished',
    '下載完畢!'
  ],
  _已暂停: [
    '下载已暂停',
    'ダウンロードは一時停止中です',
    'Download is paused',
    '下載已暫停'
  ],
  _已停止: [
    '下载已停止',
    'ダウンロードが停止しました',
    'Download stopped',
    '下載已停止'
  ],
  _已下载: ['已下载', 'downloaded', 'downloaded', '已下載'],
  _获取图片网址完毕: [
    '获取完毕，共{}个图片地址',
    '合計{}個の画像URLを取得する',
    'Get a total of {} image url',
    '取得完畢，共{}個圖片網址'
  ],
  _没有符合条件的作品: [
    '没有符合条件的作品!任务结束。',
    '基準を満たす作品はありません！タスクは終了します。',
    'There are no works that meet the criteria! The task ends.',
    '沒有符合條件的作品!工作結束。'
  ],
  _没有符合条件的作品弹窗: [
    '抓取完毕!没有符合条件的作品!',
    'クロールが終了しました！基準を満たす作品はありません',
    'Crawl finished! There are no works that meet the criteria! ',
    '擷取完畢!沒有符合條件的作品!'
  ],
  _抓取完毕: [
    '抓取完毕!',
    'クロールが終了しました！',
    'Crawl finished!',
    '擷取完畢!'
  ],
  _快速下载本页: [
    '快速下载本页作品',
    'この作品をすばやくダウンロードする',
    'Download this work quickly',
    '快速下載本頁作品'
  ],
  _转换为GIF: ['转换为 GIF', 'GIFに変換する', 'Convert to GIF', '轉換為 GIF'],
  _准备转换: [
    '准备转换',
    '変換する準備ができました',
    'Ready to convert',
    '準備轉換'
  ],
  _转换中请等待: [
    '转换中，请等待……',
    '変換ではお待ちください...',
    'In the conversion, please wait...',
    '轉換中，請稍候……'
  ],
  _转换完成: ['转换完成', '変換完了', 'Conversion completed', '轉換完成'],
  _从本页开始下载: [
    '从本页开始下载作品',
    'このページからダウンロードできます',
    'Download works from this page',
    '從本頁開始下載作品'
  ],
  _请留意文件夹命名: [
    '请留意文件夹命名',
    'フォルダの命名に注意してください',
    'Please pay attention to folder naming',
    '請留意資料夾命名'
  ],
  _下载相关作品: [
    '下载相关作品',
    '関連作品をダウンロードする',
    'Download the related works',
    '下載相關作品'
  ],
  _相关作品大于0: [
    ' （下载相关作品必须大于 0）',
    ' （ダウンロードする関連作品の数は0より大きくなければならない）',
    '  (Download related works must be greater than 0)',
    ' （下載相關作品必須大於 0）'
  ],
  _下载作品: [
    '下载作品',
    'イメージをダウンロード',
    'Download works',
    '下載作品'
  ],
  _下载响应作品: [
    '下载响应作品',
    'イメージレスポンスの作品をダウンロードする',
    'Download the responses illustration',
    '下載回應作品'
  ],
  _下载该tag中的作品: [
    '下载该tag中的作品',
    'タグの作品をダウンロードする',
    'Download the work in the tag',
    '下載該tag中的作品'
  ],
  _下载书签: [
    '下载书签中的作品',
    'ブックマークされた作品をダウンロードする',
    'Download the works in this bookmark',
    '下載書籤中的作品'
  ],
  _默认下载多页: [
    ', 如有多页，默认会下载全部。',
    '複数のページがある場合、デフォルトでダウンロードされます。',
    ', If there are multiple pages, the default will be downloaded.',
    ', 如有多頁，預設會下載全部。'
  ],
  _调整完毕: [
    '调整完毕，当前有{}张作品。',
    '調整が完了し、今、{}の作品があります。',
    'The adjustment is complete and now has {} works.',
    '調整完畢，目前有{}張作品。'
  ],
  _开始筛选: [
    '开始筛选',
    'スクリーニングを開始',
    'Start screening',
    '開始篩選'
  ],
  _开始筛选Title: [
    '按照设定来筛选当前tag里的作品。如果多次筛选，页码会一直累加。',
    '現在のタグで作品をフィルタリングする。複数回フィルタリングすると、ページ番号は常に累積されます。',
    'Filter the work in the current tag. If you filter multiple times, the page number will increase.',
    '按照設定來篩選當前tag裡的作品。如果多次篩選，頁碼會一直累加。'
  ],
  _在结果中筛选: [
    '在结果中筛选',
    '結果のフィルタリング',
    'Filter in results',
    '在結果中篩選'
  ],
  _在结果中筛选Title: [
    '如果本页筛选后作品太多，可以提高收藏数的要求，在结果中筛选。达不到要求的会被隐藏而不是删除。所以您可以反复进行筛选。被隐藏的项目不会被下载。',
    'あなたは何度も選別することができて、要求の作品が隠されて、それからダウンロードされません。',
    'You can make multiple screening , fail to meet the required works will be hidden, and will not be downloaded.',
    '如果本頁篩選後作品太多，可以提高收藏數的要求，在結果中篩選。達不到要求的會被隱藏而不是刪除。所以您可以反覆進行篩選。被隱藏的項目不會被下載。'
  ],
  _在结果中筛选弹窗: [
    '将在当前作品列表中再次过滤，请输入要求的最低收藏数: ',
    '現在の作品リストで再度フィルタリングされます。要求された作品の最小数を入力してください',
    'Will be filtered again in the current list of works. Please enter the required minimum number of bookmarks:',
    '將在目前作品清單中再次篩選，請輸入要求的最低收藏數:'
  ],
  _下载当前作品: [
    '下载当前作品',
    '現在の作品をダウンロードする',
    'Download the current work',
    '下載目前作品'
  ],
  _下载当前作品Title: [
    '下载当前列表里的所有作品',
    '現在のリストにあるすべての作品をダウンロードする',
    'Download all the works in the current list',
    '下載目前清單裡的所有作品'
  ],
  _中断当前任务: [
    '中断当前任务',
    '現在のタスクを中断する',
    'Interrupt the current task',
    '中斷目前工作'
  ],
  _中断当前任务Title: [
    '筛选时中断之后可以继续执行。',
    'ふるい分け作品で中断され、その後引き続き実行可能です。',
    'In the screening works when the break, then you can continue to perform.',
    '篩選時中斷之後可以繼續執行。'
  ],
  _当前任务已中断: [
    '当前任务已中断!',
    '現在のタスクが中断されました',
    'The current task has been interrupted',
    '目前工作已中斷!'
  ],
  _下载时排除tag: [
    '下载时排除tag',
    'ダウンロード時にタグを除外する',
    'Exclude tags when downloading',
    '下載時排除tag'
  ],
  _清除多图作品: [
    '清除多图作品',
    '複数の作品を削除する',
    'Remove multi-drawing works',
    '清除多圖作品'
  ],
  _清除多图作品Title: [
    '如果不需要可以清除多图作品',
    '必要がない場合は、複数のグラフを削除することができます',
    'If you do not need it, you can delete multiple graphs',
    '如果不需要可以清除多圖作品'
  ],
  _清除动图作品: [
    '清除动图作品',
    'うごイラ作品を削除する',
    'Remove animat work',
    '清除動圖作品'
  ],
  _清除动图作品Title: [
    '如果不需要可以清除动图作品',
    '必要がない場合は、うごイラを削除することができます',
    'If you do not need it, you can delete the animat work',
    '如果不需要可以清除動圖作品'
  ],
  _手动删除作品: [
    '手动删除作品',
    '作品を手動で削除する',
    'Manually delete the work',
    '手動刪除作品'
  ],
  _手动删除作品Title: [
    '可以在下载前手动删除不需要的作品',
    'ダウンロードする前に不要な作品を手動で削除することができます',
    'You can manually delete unwanted work before downloading',
    '可以在下載前手動刪除不需要的作品'
  ],
  _退出手动删除: [
    '退出手动删除',
    '削除モードを終了する',
    'Exit manually delete',
    '結束手動刪除'
  ],
  _下载本页作品: [
    '下载本页作品',
    'このページをダウンロードする',
    'Download this page works',
    '下載本頁作品'
  ],
  _下载本页作品Title: [
    '下载本页列表中的所有作品',
    'このページをダウンロードする',
    'Download this page works',
    '下載本頁清單中的所有作品'
  ],
  _已清除多图作品: [
    '已清除多图作品',
    'マルチマップ作品を削除しました',
    'Has deleted the multi-map works',
    '已清除多圖作品'
  ],
  _已清除动图作品: [
    '已清除动图作品',
    'うごイラが削除されました',
    'Dynamic work has been removed',
    '已清除動圖作品'
  ],
  _下载本排行榜作品: [
    '下载本排行榜作品',
    'このリストの作品をダウンロードする',
    'Download the works in this list',
    '下載本排行榜作品'
  ],
  _下载本排行榜作品Title: [
    '下载本排行榜的所有作品，包括现在尚未加载出来的。',
    'まだ読み込まれていないものを含めて、このリストの作品をダウンロードする',
    'Download all of the works in this list, including those that are not yet loaded.',
    '下載本排行榜的所有作品，包括現在尚未載入出來的。'
  ],
  _下载该页面的图片: [
    '下载该页面的图片',
    'ページの画像をダウンロードする',
    'Download the picture of the page',
    '下載該頁面的圖片'
  ],
  _下载该专辑的图片: [
    '下载该专辑的图片',
    'アルバムの画像をダウンロードする',
    'Download the album`s picture',
    '下載該專輯的圖片'
  ],
  _下载相似图片: [
    '下载相似图片',
    '類似の作品をダウンロードする',
    'Download similar works',
    '下載相似圖片'
  ],
  _要获取的作品个数: [
    '您想要获取多少个作品？（注意是个数而不是页数）\r\n请输入数字，最大值为',
    'いくつの作品をダウンロードしたいですか？ （ページ数ではなく作品数に注意してください）\r\n数値を入力してください。最大値は',
    'How many works do you want to download? (Note that the number of works rather than the number of pages)\r\nPlease enter a number, max ',
    '您想要取得多少個作品？（注意是個數而不是頁數）\r\n請輸入數字，最大值為'
  ],
  _要获取的作品个数2: [
    '您想要获取多少个作品？',
    'いくつの作品をダウンロードしたいですか？',
    'How many works do you want to download?',
    '您想要取得多少個作品？'
  ],
  _数字提示1: [
    '-1, 或者大于 0',
    '-1、または0より大きい',
    '-1, or greater than 0',
    '-1, 或是大於 0'
  ],
  _超过最大值: [
    '您输入的数字超过了最大值',
    '入力した番号が最大値を超えています',
    'The number you entered exceeds the maximum',
    '您輸入的數字超過了最大值'
  ],
  _下载大家的新作品: [
    '下载大家的新作品',
    'みんなの新作をダウンロードする',
    'Download everyone`s new work',
    '下載大家的新作品'
  ],
  _屏蔽设定: ['屏蔽設定', 'ミュート設定', 'Mute settings', '封鎖設定'],
  _举报: ['举报', '報告', 'Report', '回報'],
  _输入id进行下载: [
    '输入id进行下载',
    'IDでダウンロード',
    'Download by ID',
    '輸入id進行下載'
  ],
  _输入id进行下载的提示文字: [
    '请输入作品id。如果有多个id，则以换行分割（即每行一个id）',
    'イラストレーターIDを入力してください。 複数のidがある場合は、1行に1つのidを付けます。',
    'Please enter the illustration id. If there is more than one id, one id per line.',
    '請輸入作品id。如果有多個id，則以換行分隔（即每行一個id）'
  ],
  _开始下载: [
    '开始下载',
    'ダウンロードを開始する',
    'Start download',
    '開始下載'
  ],
  _开始抓取: ['开始抓取', 'クロールを開始する', 'Start crawling', '開始擷取'],
  _添加tag: [
    '给未分类作品添加 tag',
    '未分類の作品にタグを追加',
    'Add tag to unclassified work',
    '給未分類作品添加 tag'
  ],
  _id不合法: [
    'id不合法，操作取消。',
    'idが不正な、操作はキャンセルされます。',
    'id is illegal, the operation is canceled.',
    'id不合法，動作取消。'
  ],
  _快速收藏: [
    '快速收藏',
    'クイックブックマーク',
    'Quick bookmarks',
    '快速收藏'
  ],
  _显示: ['显示', '表示', 'display', '顯示'],
  _是否显示封面: [
    '是否显示封面',
    'カバーを表示するかどうか',
    'Whether to display the cover',
    '是否顯示封面'
  ],
  _显示封面的提示: [
    '如果搜索结果数量很多，封面图数量也会很多。如果加载大量的封面图，会占用很多网络资源，也可能导致任务异常中断。如果遇到了这种情况，取消选中这个按钮。',
    '検索結果の数が多い場合は、表紙画像の数が多くなります。 大量の表紙画像を読み込むと、ネットワークリソースが膨大になり、異常なタスクの中断を引き起こす可能性があります。 このような場合は、このボタンのチェックを外す。',
    'If the number of search results is large, the number of cover images will be many. If you load a large number of cover images, it will take up a lot of network resources, and it may cause abnormal interruption of tasks. If this happens, uncheck the button.',
    '如果搜尋結果數量很多，封面圖數量也會很多。如果載入大量的封面圖，會占用很多網路資源，也可能導致工作異常中斷。如果遇到了這種情況，取消選取這個按鈕。'
  ],
  _启用: ['启用', '有効にする', 'Enable', '啟用'],
  _是否快速下载: [
    '是否快速下载',
    'すぐにダウンロードするかどうか',
    'Whether to download quickly',
    '是否快速下載'
  ],
  _快速下载的提示: [
    '当“开始下载”状态可用时，自动开始下载，不需要点击下载按钮。',
    '「ダウンロードを開始する」ステータスが利用可能になると、ダウンロードは自動的に開始され、ダウンロードボタンをクリックする必要はありません。',
    'When the &quot;Start Downloa&quot; status is available, the download starts automatically and no need to click the download button.',
    '當“開始下載”狀態可用時，自動開始下載，不需要點選下載按鈕。'
  ]
}

// xianzun_lang_translate 翻译
function xzlt (name, ...arg) {
  let content = xzLang[name][langType]
  arg.forEach(val => (content = content.replace('{}', val)))
  return content
}

// 添加 css 样式
async function appendStyle (params) {
  const styleFile = await fetch(chrome.extension.getURL('xzstyle.css'))
  const styleContent = await styleFile.text()
  const styleE = document.createElement('style')
  document.body.appendChild(styleE)
  styleE.textContent = styleContent
}

// 快速收藏
function quickBookmark () {
  const tt = getToken()

  if (!tt) {
    // 如果获取不到 token，则不展开本工具的快速收藏功能
    return false
  }

  // 本函数一直运行。因为切换作品（pushstate）时，不能准确的知道 toolbar 何时更新，所以只能不断检测
  setTimeout(() => {
    quickBookmark()
  }, 300)

  // 因为 p 站改版 class 经常变，所以从父元素查找，父元素的 class 变化没那么频繁
  const toolbarParent = document.querySelectorAll('main > section')

  let toolbar // 作品下方的工具栏
  for (const el of toolbarParent) {
    if (el.querySelector('div>section')) {
      toolbar = el.querySelector('div>section')
      break
    }
  }

  if (toolbar) {
    quickBookmarkElement = document.querySelector('#quickBookmarkEl')

    // 如果没有 quick 元素则添加
    if (!quickBookmarkElement) {
      // 创建快速收藏元素
      quickBookmarkElement = document.createElement('a')
      quickBookmarkElement.id = 'quickBookmarkEl'
      quickBookmarkElement.innerHTML = '✩'
      quickBookmarkElement.href = 'javascript:void(0)'
      quickBookmarkElement.title = xzlt('_快速收藏')
      toolbar.insertBefore(quickBookmarkElement, toolbar.childNodes[3])
      // 隐藏原来的收藏按钮并检测收藏状态
      toolbar.childNodes[2].style.display = 'none'
      const heart = toolbar.childNodes[2].querySelector('svg')
      if (window.getComputedStyle(heart)['fill'] === 'rgb(255, 64, 96)') {
        // 如果已经收藏过了
        quickBookmarkEnd()
      } else {
        quickBookmarkElement.addEventListener('click', () => {
          document.querySelector('._35vRH4a').click() // 自动点赞
          // 储存 tag
          const tagElements = document.querySelectorAll('._1LEXQ_3 li')
          const tagArray = Array.from(tagElements).map(el => {
            const nowA = el.querySelector('a')
            if (nowA) {
              let nowTag = nowA.textContent
              // 对于原创作品，非日文的页面上只显示了用户语言的“原创”，替换成日文 tag “オリジナル”。
              if (
                nowTag === '原创' ||
                nowTag === 'Original' ||
                nowTag === '창작'
              ) {
                nowTag = 'オリジナル'
              }
              return nowTag
            }
          })
          const tagString = encodeURI(tagArray.join(' '))

          // 调用添加收藏的 api
          addBookmark(getIllustId(), tagString, tt)
            .then(response => response.json())
            .then(data => {
              if (data.error !== undefined && data.error === false) {
                quickBookmarkEnd()
              }
            })
        })
      }
    } else {
      // 如果有 quick 元素，什么都不做
      return false
    }
  }
}

// 如果这个作品已收藏
function quickBookmarkEnd () {
  quickBookmarkElement.style.color = '#FF4060'
  quickBookmarkElement.href = `/bookmark_add.php?type=illust&illust_id=${getIllustId()}`
}

// 获取 token
function getToken () {
  // 从含有 globalInitData 信息的脚本里，匹配 token 字符串
  const regToken = document.head.innerHTML.match(/token: "(\w+)"/)
  if (regToken && regToken.length > 0) {
    return regToken[1]
  }

  // 从保存 token 的 input 获取
  if (document.querySelector('input[name="tt"]')) {
    return document.querySelector('input[name="tt"]').value
  }

  return false
}

// 添加收藏
function addBookmark (id, tags, tt, hide) {
  if (!hide) {
    // 公开作品
    hide = 0
  } else {
    // 非公开作品
    hide = 1
  }

  return fetch('https://www.pixiv.net/rpc/index.php', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    credentials: 'same-origin', // 附带 cookie
    body: `mode=save_illust_bookmark&illust_id=${id}&restrict=${hide}&comment=&tags=${tags}&tt=${tt}`
  })
}

// 获取未分类书签的 tag 信息
function getInfoFromBookmark (url) {
  return fetch(url, {
    credentials: 'same-origin'
  })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        if (response.status === 403) {
          console.log('permission denied')
          document.getElementById(
            'add_tag_btn'
          ).textContent = `× permission denied`
        }
        return Promise.reject(new Error(response.status))
      }
    })
    .then(data => {
      const works = data.body.works
      const result = []

      if (works.length > 0 && works[0].bookmarkData) {
        // 判断作品的 bookmarkData，如果为假说明这是在别人的收藏页面，不再获取数据。
        works.forEach(data => {
          result.push({
            id: data.id,
            tags: encodeURI(data.tags.join(' ')),
            restrict: data.bookmarkData.private
          })
        })
      }

      return result
    })
}

// 准备添加 tag
async function readyAddTag () {
  // 公开的未分类收藏
  const api1 = `https://www.pixiv.net/ajax/user/${getUserId()}/illusts/bookmarks?tag=${encodeURI(
    '未分類'
  )}&offset=0&limit=999999&rest=show&rdm=${Math.random()}`
  // 非公开的未分类收藏
  const api2 = `https://www.pixiv.net/ajax/user/${getUserId()}/illusts/bookmarks?tag=${encodeURI(
    '未分類'
  )}&offset=0&limit=999999&rest=hide&rdm=${Math.random()}`

  let addList = [] // 需要添加的作品列表
  const index = 0 // 索引
  const addTagBtn = document.getElementById('add_tag_btn')

  addList = addList.concat(await getInfoFromBookmark(api1))
  addList = addList.concat(await getInfoFromBookmark(api2))
  if (addList.length === 0) {
    addTagBtn.textContent = `√ no need`
    return false
  } else {
    addTag(index, addList, getToken(), addTagBtn)
  }
}

// 给未分类作品添加 tag
function addTag (index, addList, tt, addTagBtn) {
  setTimeout(() => {
    if (index < addList.length) {
      addBookmark(
        addList[index].id,
        addList[index].tags,
        tt,
        addList[index].restrict
      )
      index++
      addTagBtn.textContent = `${index} / ${addList.length}`
      // 继续添加下一个
      addTag(index, addList, tt, addTagBtn)
    } else {
      addTagBtn.textContent = `√ complete`
    }
  }, 100)
}

// 初始化动图
function initGif () {
  // 切换作品时，重置动图信息
  gifSrc = ''
  gifDelay = undefined
  gifMimeType = ''
  zipFile = null // 获取的 zip 文件
  fileNumber = 0 // 动图压缩包里有多少个文件
  gifImgList.innerHTML = '' // 清空图片列表
  downloadGifBtn.style.display = 'inline-block' // 显示动图转换按钮

  // 获取 gif 信息
  fetch('https://www.pixiv.net/ajax/illust/' + getIllustId() + '/ugoira_meta', {
    method: 'get',
    credentials: 'same-origin' // 附带 cookie
  })
    .then(response => response.json())
    .then(data => {
      const thisOneData = data.body
      gifSrc = thisOneData.originalSrc
      fileNumber = thisOneData.frames.length
      gifDelay = thisOneData.frames[0].delay
      gifMimeType = thisOneData.mimeType
    })
}

// 检查是否可以开始转换 gif
function checkCanConvert () {
  if (!gifSrc || !zipFile) {
    setTimeout(() => {
      checkCanConvert()
    }, 1000)
    return false
  } else {
    startconvert()
  }
}

// 开始转换
async function startconvert () {
  addOutputInfo('<br>' + xzlt('_转换中请等待'))
  let worker = await fetch(chrome.extension.getURL('lib/z-worker.js'))
  worker = await worker.blob()
  // inflater 需要 url 形式，所以生成其 blob url
  const inflater = URL.createObjectURL(worker)
  zip.workerScripts = {
    inflater: [inflater]
  }
  readZip()
}

// 读取 zip 文件
function readZip () {
  zip.createReader(
    new zip.BlobReader(zipFile),
    zipReader => {
      // 读取成功时的回调函数，files 为文件列表
      zipReader.getEntries(files => {
        fileNumber = files.length
        files.forEach(file => {
          // 获取每个文件的数据，在 BlobWriter 里设置 mime type，回调函数返回 blob 数据
          file.getData(new zip.BlobWriter(gifMimeType), data =>
            addImgList(URL.createObjectURL(data))
          )
        })
      })
    },
    message => {
      console.log('readZIP error: ' + message)
      addOutputInfo('error: convert to gif failed.')
    }
  )
}

// 输出 zip 里的图片
function addImgList (url) {
  const newImg = new Image()

  newImg.onload = () => {
    fileNumber--
    if (fileNumber === 0) {
      // 所有图片都加载完成后
      renderGif()
    }
  }

  newImg.src = url
  gifImgList.appendChild(newImg)
}

// 渲染 gif
async function renderGif () {
  console.log('renderGIF')

  let worker = await fetch(chrome.extension.getURL('lib/gif.worker.js'))
  worker = await worker.blob()
  const workerUrl = URL.createObjectURL(worker)

  // 配置 gif.js
  // 如果 workers 大于1，合成的 gif 有可能会抖动
  var gif = new GIF({
    workers: 4,
    quality: 10,
    workerScript: workerUrl
  })

  // 添加图片
  const imgs = gifImgList.querySelectorAll('img')
  imgs.forEach(element => {
    gif.addFrame(element, {
      delay: gifDelay
    })
  })
  console.time('gif')

  // 绑定渲染完成事件
  gif.on('finished', blob => {
    console.timeEnd('gif') // 显示渲染用了多久

    downloadA = document.querySelector('.download_a')
    downloadA.href = URL.createObjectURL(blob)
    downloadA.setAttribute('download', getIllustId() + '.gif')
    downloadA.click()
    changeTitle('√')
    addOutputInfo('<br>' + xzlt('_转换完成'))
  })

  // 开始渲染
  gif.render()
}

// 初始化图片查看器
function initViewer () {
  if (!viewerEnable) {
    return false
  }

  // 检查图片查看器元素是否已经生成
  if (!document.getElementById('viewerWarpper')) {
    createViewer()
    return false
  } else {
    // 更新数据
    updateViewer()
  }
}

// 创建图片查看器 html 元素，并绑定一些事件，这个函数只会执行一次
function createViewer () {
  if (!document.querySelector('main figcaption')) {
    // 等到作品主体部分的元素生成之后再创建查看器
    setTimeout(() => {
      createViewer()
    }, 200)
    return false
  }

  // 查看器图片列表元素的结构： div#viewerWarpper > ul > li > img
  viewerWarpper = document.createElement('div')
  viewerWarpper.id = 'viewerWarpper'
  viewerUl = document.createElement('ul')
  viewerWarpper.appendChild(viewerUl)
  document
    .querySelector('main figcaption')
    .insertAdjacentElement('beforebegin', viewerWarpper)

  // 图片查看器显示之后
  viewerUl.addEventListener('shown', () => {
    // 显示相关元素
    showViewerOther()

    // 点击 1：1 按钮时，全屏查看
    document
      .querySelector('.viewer-one-to-one')
      .addEventListener('click', () => {
        hideViewerOther() // 隐藏查看器的其他元素
        launchFullScreen(document.body) // 进入全屏

        // 使图片居中显示，必须加延迟
        setTimeout(() => {
          setViewerCenter()
        }, 100)
      })
  })

  // 全屏状态下，查看和切换图片时，显示比例始终为 100%
  viewerUl.addEventListener('view', () => {
    if (isFullscreen()) {
      setTimeout(() => {
        // 通过点击 1:1 按钮，调整为100%并居中。这里必须要加延时，否则点击的时候图片还是旧的
        document.querySelector('.viewer-one-to-one').click()
      }, 50)
    }
  })

  // 隐藏查看器时，如果还处于全屏，则退出全屏
  viewerUl.addEventListener('hidden', () => {
    if (isFullscreen()) {
      exitFullscreen()
    }
  })

  // esc 退出图片查看器
  document.addEventListener('keyup', event => {
    const e = event || window.event
    if (e.keyCode === 27) {
      // 按下 esc
      // 如果非全屏，且查看器已经打开，则退出查看器
      if (!isFullscreen() && viewerIsShow()) {
        document.querySelector('.viewer-close').click()
      }
    }
  })

  updateViewer()
}

// 根据作品信息，更新图片查看器配置
function updateViewer () {
  viewerWarpper.style.display = 'none' // 先隐藏 viewerWarpper

  // 获取作品信息
  fetch('https://www.pixiv.net/ajax/illust/' + getIllustId(), {
    method: 'get',
    credentials: 'same-origin' // 附带 cookie
  })
    .then(response => response.json())
    .then(data => {
      // 保存当前页面的画师名
      const thisOneData = data.body
      puser = thisOneData.userName

      // 判断是不是动图
      if (thisOneData.illustType === 2) {
        initGif()
      }

      // 更新图片查看器
      if (thisOneData.illustType === 0 || thisOneData.illustType === 1) {
        // 插画或漫画，0 插画 1 漫画 2 动图（ 1 的如 68430279 ）
        if (thisOneData.pageCount > 1) {
          // 有多张图片时，创建缩略图
          const { thumb, original } = thisOneData.urls
          viewerUl.innerHTML = new Array(parseInt(thisOneData.pageCount))
            .fill(1)
            .reduce((html, now, index) => {
              return (html += `<li><img src="${thumb.replace(
                'p0',
                'p' + index
              )}" data-src="${original.replace('p0', 'p' + index)}"></li>`)
            }, '')

          // 数据更新后，显示 viewerWarpper
          viewerWarpper.style.display = 'block'

          // 销毁看图组件
          if (myViewer) {
            myViewer.destroy()
          }

          // 重新配置看图组件
          myViewer = new Viewer(viewerUl, {
            toolbar: {
              zoomIn: 0,
              zoomOut: 0,
              oneToOne: 1,
              reset: 0,
              prev: 1,
              play: {
                show: 0,
                size: 'large'
              },
              next: 1,
              rotateLeft: 0,
              rotateRight: 0,
              flipHorizontal: 0,
              flipVertical: 0
            },

            url (image) {
              return image.getAttribute('data-src')
            },

            viewed (event) {
              // 当图片显示完成（加载完成）后，预加载下一张图片
              const ev = event || window.event
              let index = ev.detail.index

              if (index < thisOneData.pageCount - 1) {
                index++
              }

              const nextImg = original.replace('p0', 'p' + index)
              const img = new Image()
              img.src = nextImg
            },

            // 取消一些动画，比如切换图片时，图片从小变大出现的动画
            transition: false,
            // 取消键盘支持，主要是用键盘左右方向键切换的话，会和 pixiv 页面产生冲突。（pixiv 页面上，左右方向键会切换作品）
            keyboard: false,
            // 不显示 title（图片名和宽高信息）
            title: false,
            // 不显示缩放比例
            tooltip: false
          })

          // 预加载第一张图片
          {
            const img = new Image()
            img.src = original
          }
        }
      }
    })
}

// 隐藏查看器的其他元素
function hideViewerOther () {
  document.querySelector('.viewer-container').classList.add('black-background')
  document.querySelector('.viewer-close').style.display = 'none' // 隐藏底部的其他元素，仍然显示左右切换按钮

  document.querySelector('.viewer-one-to-one').style.display = 'none'
  document.querySelector('.viewer-navbar').style.display = 'none'
}

// 显示查看器的其他元素
function showViewerOther () {
  document
    .querySelector('.viewer-container')
    .classList.remove('black-background')
  document.querySelector('.viewer-close').style.display = 'block'
  document.querySelector('.viewer-one-to-one').style.display = 'block'
  document.querySelector('.viewer-navbar').style.display = 'block'
}

// 在图片100%显示时，使其居中
function setViewerCenter () {
  // 获取图片宽高
  const imgInfo = document.querySelector('.viewer-title').textContent

  // 如果图片尚未加载出来的话，就没有内容，就过一会儿再执行
  if (!imgInfo) {
    setTimeout(() => {
      setViewerCenter()
    }, 200)
    return false
  }

  const [imgWidth, imgHeight] = /\d{1,5} × \d{1,5}/
    .exec(imgInfo)[0]
    .split(' × ')
  // > '66360324_p5_master1200.jpg (919 × 1300)'
  // < ["919", "1300"]

  myViewer.zoomTo(1)

  // 获取网页宽高
  const htmlWidth = document.documentElement.clientWidth
  const htmlHeight = document.documentElement.clientHeight

  // 设置边距
  const setWidth = (htmlWidth - imgWidth) / 2
  let setHeight = (htmlHeight - imgHeight) / 2

  // 当图片高度大于浏览器窗口高度时，居顶显示而不是居中
  if (setHeight < 0) {
    setHeight = 0
  }

  myViewer.moveTo(setWidth, setHeight)
}

// 进入全屏
function launchFullScreen (element) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  }
}

// 退出全屏
function exitFullscreen () {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozExitFullScreen) {
    document.mozExitFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
}

// 判断是否处于全屏状态
function isFullscreen () {
  return (
    document.fullscreenElement ||
    document.msFullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    false
  )
}

// 判断看图器是否处于显示状态
function viewerIsShow () {
  const viewerContainer = document.querySelector('.viewer-container')

  if (viewerContainer) {
    return viewerContainer.classList.contains('viewer-in')
  } else {
    return false
  }
}

// 检测全屏状态变化，目前有兼容性问题（这里也相当于绑定了按 esc 退出的事件）
['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange'].forEach(
  arg => {
    document.addEventListener(arg, () => {
      if (!isFullscreen()) {
        // 退出全屏
        showViewerOther()
      }
    })
  }
)

// 修改title
function changeTitle (string) {
  // 工作时，本工具的状态会以 [string] 形式添加到 title 最前面，并闪烁提醒
  /*
  0 复原，目前未使用
  ↑ 抓取中
  → 等待下一步操作（tag搜索页）
  ▶  准备下载
  ↓ 下载中
  ║ 下载暂停
  ■ 下载停止
  √ 下载完毕
  */
  if (string === '0') {
    clearInterval(titleTimer)
    document.title = oldTitle
    return false
  }

  // 如果当前title里没有本脚本的提醒，就存储当前title为旧title
  if (document.title.startsWith('[') === false) {
    oldTitle = document.title
  }

  const newTitle = `[${string}] ${oldTitle}`
  document.title = newTitle

  // 当可以执行下一步操作时，闪烁提醒
  if (string === '▶' || string === '→') {
    titleTimer = setInterval(function () {
      if (document.title.includes(string)) {
        document.title = newTitle.replace(string, ' ')
      } else {
        document.title = newTitle
      }
    }, 500)
  } else {
    clearInterval(titleTimer)
  }
}

// 创建用于输出信息的区域
function insertOutputInfo () {
  if (document.getElementById('outputInfo') === null) {
    outputInfo = document.createElement('div')
    outputInfo.id = 'outputInfo'
    insertToHead(outputInfo)
  }
}

// 增加输出信息
function addOutputInfo (val) {
  if (!outputInfo) {
    insertOutputInfo()
  }
  outputInfo.innerHTML += val
}

// 获取排除类型
function getNotDownType () {
  return Array.from(document.body.querySelectorAll('.xzFormP5 input')).reduce(
    (result, el, index) => {
      if (el.checked === false) {
        return (result += index + 1)
      } else {
        return result
      }
    },
    ''
  )
}

// 检查排除作品类型的参数是否合法
function checkNotDownType () {
  notdownType = getNotDownType()

  // 如果全部排除则取消任务
  if (notdownType.includes('123')) {
    // notdownType 的结果是顺序的，所以可以直接查找 123
    window.alert(xzlt('_checkNotdownTypeResult1弹窗'))
    addOutputInfo('<br>' + xzlt('_checkNotdownTypeResult1Html') + '<br><br>')
    return false
  }

  // 排除了至少一种时，显示提示
  if (
    notdownType.includes('1') ||
    notdownType.includes('2') ||
    notdownType.includes('3')
  ) {
    addOutputInfo(
      '<br>' +
        xzlt('_checkNotdownTypeResult3Html') +
        notdownType
          .replace('1', xzlt('_单图'))
          .replace('2', xzlt('_多图'))
          .replace('3', xzlt('_动图'))
    )
  }
}

// 检查作品是否符合【排除作品类型】和【只下载书签作品】的条件，符合条件的话会把 url 添加到作品列表里
function checkNotDownTypeResult (string, url, bookmarked) {
  // 如果设置了只下载书签作品
  if (onlyDownBmk) {
    if (!bookmarked) {
      return false
    }
  }

  if (string.includes('multiple')) {
    // 如果是多图并且没有排除多图
    if (!notdownType.includes('2')) {
      illustUrlList.push(url)
    }
  } else if (string.includes('ugoku-illust')) {
    // 如果是动图并且没有排除动图
    if (!notdownType.includes('3')) {
      illustUrlList.push(url)
    }
  } else {
    // 如果是单图并且没有排除单图（包括 mode=big ）
    if (!notdownType.includes('1')) {
      illustUrlList.push(url)
    }
  }
}

// 检查是否设置了多图作品的张数限制
function checkMultipleDownNumber () {
  const checkResult = checkNumberGreater0(xzForm.setPNo.value)

  if (checkResult) {
    multipleDownNumber = parseInt(checkResult.value)
    addOutputInfo('<br>' + xzlt('_多图作品下载张数', multipleDownNumber))
  } else {
    multipleDownNumber = 0
  }
}

// 将元素插入到页面顶部。大部分页面使用 header，文章页使用 root。因为在文章页执行脚本时，可能获取不到 header
function insertToHead (el) {
  (
    document.querySelector('#root>*') || document.querySelector('header')
  ).insertAdjacentElement('beforebegin', el)
}

// 获取要排除的tag
function getNotNeedTag () {
  const tempNotNeedTag = xzForm.setTagNotNeed.value

  // 如果没有设置 tag，则重置
  if (tempNotNeedTag === '') {
    notNeedTag = []
  } else {
    notNeedTag = tempNotNeedTag.split(',')

    // 如果用户在末尾也输入了逗号，则会产生一个空值，去掉它
    if (notNeedTag[notNeedTag.length - 1] === '') {
      notNeedTag.pop()
    }

    addOutputInfo(
      '<br>' + xzlt('_设置了排除tag之后的提示') + notNeedTag.join(',')
    )
  }
}

// 获取必须包含的tag
function getNeedTag () {
  const tempNeedTag = xzForm.setTagNeed.value

  // 如果没有设置 tag，则重置
  if (tempNeedTag === '') {
    needTag = []
  } else {
    needTag = tempNeedTag.split(',')

    // 如果用户在末尾也输入了逗号，则会产生一个空值，去掉它
    if (needTag[needTag.length - 1] === '') {
      needTag.pop()
    }

    addOutputInfo('<br>' + xzlt('_设置了必须tag之后的提示') + needTag.join(','))
  }
}

// 检查过滤宽高的设置
function checkSetWh () {
  const checkResultWidth = checkNumberGreater0(xzForm.setWidth.value)
  const checkResultHeight = checkNumberGreater0(xzForm.setHeight.value)

  // 宽高只要有一个条件大于 0 即可
  if (checkResultWidth || checkResultHeight) {
    isSetFilterWh = true
    filterWh = {
      andOr: xzForm.setWidthAndOr.value,
      width: checkResultWidth ? checkResultWidth.value : 0,
      height: checkResultHeight ? checkResultHeight.value : 0
    }
  } else {
    isSetFilterWh = false
  }

  if (isSetFilterWh) {
    const andOr = filterWh.andOr
    addOutputInfo(
      '<br>' +
        xzlt('_设置了筛选宽高之后的提示文字p1') +
        filterWh.width +
        andOr.replace('|', xzlt('_或者')).replace('&', xzlt('_并且')) +
        xzlt('_高度设置') +
        filterWh.height
    )
  }
}

// 检查作品是否符合过滤宽高的条件
function checkSetWhok (width, height) {
  if (isSetFilterWh) {
    // 如果宽高都小于要求的宽高
    if (width < filterWh.width && height < filterWh.height) {
      return false
    } else {
      if (filterWh.andOr === '|') {
        // 判断or的情况
        if (width >= filterWh.width || height >= filterWh.height) {
          return true
        } else {
          return false
        }
      } else if (filterWh.andOr === '&') {
        // 判断and的情况
        if (width >= filterWh.width && height >= filterWh.height) {
          return true
        } else {
          return false
        }
      }
    }
  } else {
    return true
  }
}

// 检查作品是否符合过滤收藏数的条件
function checkSetBmk () {
  const checkResult = checkNumberGreater0(xzForm.setFavNum.value, '=0')

  if (checkResult) {
    filterBmk = checkResult.value
    isSetFilterBmk = true
  } else {
    isSetFilterBmk = false
    addOutputInfo('<br>' + xzlt('_参数不合法1'))
    return false
  }

  if (isSetFilterBmk && filterBmk > 0 && pageType !== 5) {
    addOutputInfo('<br>' + xzlt('_设置了筛选收藏数之后的提示文字') + filterBmk)
  }

  return true
}

// 检查是否设置了只下载书签作品
function checkOnlyBmk () {
  onlyDownBmk = xzForm.setOnlyBmk.checked
  if (onlyDownBmk) {
    addOutputInfo('<br>' + xzlt('_只下载已收藏的提示'))
  }
}

// 检查输入的参数是否有效，要求大于 0 的数字
function checkNumberGreater0 (arg, mode) {
  if (arg === null || arg === '') {
    return false
  }

  arg = parseInt(arg)

  let minNum = 0
  if (mode === '=0') {
    // 允许最小为0
    minNum = -1
  }

  if (isNaN(arg) || arg <= minNum) {
    // window.alert(xzlt('_本次输入的数值无效'));
    return false
  } else {
    return {
      value: arg
    }
  }
}

// 使用无刷新加载的页面需要监听 url 的改变，在这里监听页面的切换
const element = document.createElement('script')
element.setAttribute('type', 'text/javascript')
element.innerHTML = `
let _wr = function (type) {
  let orig = history[type];
  return function () {
    let rv = orig.apply(this, arguments);
    let e = new Event(type);
    e.arguments = arguments;
    window.dispatchEvent(e);
    return rv;
  };
};
history.pushState = _wr('pushState');
history.replaceState = _wr('replaceState');
`
document.head.appendChild(element)

// 最多有多少页，在 pageType 10 使用
function setMaxNum () {
  // 其实这个条件和条件 2 在一定程度上是重合的，所以这个必须放在前面
  if (locUrl.includes('bookmark_new_illust')) {
    maxNum = 100 // 关注的人的新作品（包含普通版和 r18 版）的最大页数都是 100
  } else if (locUrl.includes('new_illust.php')) {
    maxNum = 1000 // 大家的新作品（普通版）的最大页数是 1000
  } else if (locUrl.includes('new_illust_r18.php')) {
    maxNum = 500 // 大家的的新作品（r18版）的最大页数是 500
  }
}

// 设置要下载的个数
function setRequsetNum () {
  maxNum = 500 // 设置最大允许获取多少个作品。相似作品的这个数字是可以改的，可以比 500 更大，这里只是一个预设值。

  const result = checkNumberGreater0(xzForm.setWantPage.value)

  if (result) {
    requsetNumber = result.value

    if (requsetNumber > maxNum) {
      // 如果超出最大值就按最大值处理
      requsetNumber = maxNum
    }
  } else {
    window.alert(xzlt('_参数不合法1'))
    return false
  }
}

// 获取作品页信息出错时的处理
function illustError (url) {
  if (pageType === 1 && !downRelated) {
    addOutputInfo('<br>' + xzlt('_无权访问1', url) + '<br>')
    // 在作品页内下载时，设置的wantPage其实是作品数
    if (wantPage > 0) {
      wantPage--
    }
    // 在作品页内下载时，如果出现了无法访问的作品时，就获取不到接下来的作品了，直接结束。
    allowWork = true
    allWorkFinished()
  } else {
    addOutputInfo('<br>' + xzlt('_无权访问2', url) + '<br>')
    // 跳过当前作品
    if (illustUrlList.length > 0) {
      // 如果存在下一个作品，则
      getIllustPage(illustUrlList[0])
    } else {
      // 没有剩余作品
      ajaxThreadsFinished++
      if (ajaxThreadsFinished === ajaxForIllustThreads) {
        // 如果所有并发请求都执行完毕，复位
        ajaxThreadsFinished = 0
        allowWork = true
        allWorkFinished()
      }
    }
  }
}

// 检查用户输入的页数设置，并返回提示信息
function checkWantPageInput (errorTip, start1Tip, start2Tip) {
  const temp = parseInt(xzForm.setWantPage.value)

  // 如果比 1 小，并且不是 -1，则不通过
  if ((parseInt(temp) < 1 && temp !== -1) || isNaN(temp)) {
    // 比 1 小的数里，只允许 -1 , 0 也不行
    addOutputInfo(errorTip)
    return false
  }

  if (parseInt(temp) >= 1) {
    wantPage = temp
    addOutputInfo(start1Tip.replace('-num-', wantPage))
    return true
  } else if (temp === -1) {
    wantPage = temp
    addOutputInfo(start2Tip)
    return true
  }
}

// 获取宽高比的设置
function getRatioSetting () {
  ratioType = xzForm.ratio.value

  // 不限制
  if (ratioType === '0') {
    return false
  }

  // 由用户输入
  if (ratioType === '3') {
    ratioType = parseFloat(xzForm.userRatio.value)
    if (isNaN(ratioType)) {
      window.alert(xzlt('_宽高比必须是数字'))
      ratioType = '0'
      xzForm.ratio.value = ratioType
      return false
    }
  }

  if (ratioType === '1') {
    addOutputInfo('<br>' + xzlt('_设置了宽高比之后的提示', xzlt('_横图')))
  } else if (ratioType === '2') {
    addOutputInfo('<br>' + xzlt('_设置了宽高比之后的提示', xzlt('_竖图')))
  } else {
    addOutputInfo(
      '<br>' + xzlt('_设置了宽高比之后的提示', xzlt('_输入宽高比') + ratioType)
    )
  }

  return true
}

// 检查作品是否符合宽高比条件
function checkRatio (width, height) {
  if (ratioType === '0') {
    return true
  } else if (ratioType === '1') {
    return width / height > 1
  } else if (ratioType === '2') {
    return width / height < 1
  } else {
    return width / height >= ratioType
  }
}

// 根据对象的属性排序。排序的内容虽然有时可能是字符串，但是需要根据数字来排序
function sortByProperty (propertyName) {
  return function (object1, object2) {
    const value1 = parseInt(object1[propertyName])
    const value2 = parseInt(object2[propertyName])

    // 倒序排列
    if (value2 < value1) {
      return -1
    } else if (value2 > value1) {
      return 1
    } else {
      return 0
    }
  }
}

// 对结果列表进行排序，按收藏数从高到低显示
function listSort () {
  imgList.sort(sortByProperty('num'))
  const listWrap = document.querySelector(tagSearchListWrap)
  listWrap.innerHTML = ''
  imgList.forEach(data => {
    listWrap.insertAdjacentHTML('beforeend', data.e)
  })
}

// tag搜索页的筛选任务执行完毕
function tagSearchPageFinished () {
  allowWork = true
  // listPage_finished=0;
  // 不注释掉上一句的话，每次添加筛选任务都是从当前页开始，而不是一直往后累计
  tagPageFinished = 0 // 重置已抓取的页面数量

  listSort()
  changeTitle('→')
}

// 获取 tag 搜索列表里的可见作品
function visibleList () {
  const list = document.querySelectorAll(tagSearchListSelector)
  return Array.from(list).filter(el => {
    return el.style.display !== 'none'
  })
}

// 获取当前页面的页码，在 tag 搜索页和 大家/关注的新作品页面使用
function getNowPageNo () {
  // 如果显示有页码，以当前页的页码为起始页码
  if (document.querySelector('.page-list .current')) {
    startpageNo = parseInt(
      document.querySelector('.page-list .current').textContent
    )
  } else {
    // 否则认为只有1页
    startpageNo = 1
  }

  listPageFinished = 0
}

// 实现 DOM 元素的 remove() 方法
[window.HTMLCollection, window.NodeList].forEach(arg => {
  arg.prototype.remove = function () {
    if (Reflect.has(this, 'length')) {
      // 如果有 length 属性则循环删除。HTMLCollection 需要转化为数组才能使用 forEach，NodeList 不需要转化就可以使用
      Array.from(this).forEach(el => el.parentNode.removeChild(el))
    } else {
      // 没有 length 属性的，不能使用 forEach，直接删除（querySelector、getElementById 没有 length 属性）
      this.parentNode.removeChild(this)
    }
  }
})

// 实现 DOM 元素的 toggle 方法，但仅支持 block 和 none 切换
function toggle (el) {
  el.style.display = el.style.display === 'block' ? 'none' : 'block'
}

// 显示调整后，列表里的作品数量。仅在 tag 搜索页和发现页面中使用
function outputNowResult () {
  addOutputInfo(xzlt('_调整完毕', visibleList().length) + '<br>')
}

// 添加图片信息。某些参数允许传空值
function addImgInfo (
  id,
  imgUrl,
  title,
  nowAllTag,
  user,
  userid,
  fullWidth,
  fullHeight,
  ext,
  bmk
) {
  imgInfo.push({
    id: id,
    url: imgUrl,
    title: title,
    tags: nowAllTag,
    user: user,
    userid: userid,
    fullWidth: fullWidth,
    fullHeight: fullHeight,
    ext: ext,
    bmk: bmk
  })
}

// 启动抓取
function startGet () {
  if (!allowWork || downloadStarted) {
    window.alert(xzlt('_当前任务尚未完成1'))
    return false
  }

  insertOutputInfo()
  document.querySelector('.download_panel').style.display = 'none'

  // 设置要获取的作品数或页数
  if (pageType === 1) {
    // 作品页内
    if (quick) {
      // 快速下载
      wantPage = 1
    } else {
      // 检查下载页数的设置
      let result = false
      if (!downRelated) {
        result = checkWantPageInput(
          xzlt('_checkWantPageRule1Arg2'),
          xzlt('_checkWantPageRule1Arg3'),
          xzlt('_checkWantPageRule1Arg4')
        )
      } else {
        // 相关作品的提示
        result = checkWantPageInput(
          xzlt('_checkWantPageRule1Arg2'),
          xzlt('_checkWantPageRule1Arg9'),
          xzlt('_checkWantPageRule1Arg10')
        )
      }

      if (!result) {
        return false
      }
    }
  } else if (pageType === 2) {
    // 画师主页，作品列表页，tag 列表页，收藏页，自己的收藏
    const result = checkWantPageInput(
      xzlt('_checkWantPageRule1Arg2'),
      xzlt('_checkWantPageRule1Arg6'),
      xzlt('_checkWantPageRule1Arg7')
    )

    if (!result) {
      return false
    }
  } else if (pageType === 5) {
    // tag 搜索页
    document.querySelectorAll('._premium-lead-popular-d-body').remove() // 去除热门作品一栏

    const result = checkWantPageInput(
      xzlt('_checkWantPageRule1Arg2'),
      '',
      xzlt('_checkWantPageRule1Arg7')
    )

    if (!result) {
      return false
    }

    if (wantPage === -1) {
      wantPage = 1000 // tag 搜索页最多只能获取一千页
    }

    // 提示设置的收藏数，这里没有检查是否合法，下面再检查
    addOutputInfo(
      xzlt('_tag搜索任务开始', parseInt(xzForm.setFavNum.value), wantPage)
    )

    // 如果是首次抓取，则移除当前列表。之后会把抓取结果放进来
    if (!listPageFinished) {
      document.querySelectorAll(tagSearchListSelector).remove()
    }
  } else if (pageType === 10) {
    // 大家/关注的新作品
    const result = checkNumberGreater0(xzForm.setWantPage.value)

    if (!result) {
      window.alert(xzlt('_参数不合法1'))
      return false
    } else if (result.value > maxNum) {
      window.alert(xzlt('_输入超过了最大值') + maxNum)
      return false
    } else {
      wantPage = result.value
      addOutputInfo(xzlt('_任务开始1', wantPage))
    }
  }

  // 排行榜页面
  if (pageType === 7) {
    listPageFinished = 0
  }

  // 检查是否设置了收藏数要求
  if (!checkSetBmk()) {
    return false
  }

  // 在非 tag 搜索页里，进行一些检查。tag 搜索页里这些设置此时无法生效,所以放在后面开始下载时再检查
  if (pageType !== 5) {
    // 检查是否设置了多图作品的张数限制
    checkMultipleDownNumber()

    // 获取必须包含的tag
    getNeedTag()

    // 获取要排除的tag
    getNotNeedTag()
  }

  // 检查是否设置了只下载书签作品
  checkOnlyBmk()

  // 检查排除作品类型的设置
  if (checkNotDownType() === false) {
    return false
  }

  // 检查是否设置了宽高条件
  checkSetWh()

  // 检查宽高比设置
  getRatioSetting()

  // 重置下载状态
  resetResult()

  // 开始执行时，标记任务状态，当前任务结束后才能再启动新任务
  allowWork = false

  // 保存当前的输出信息，新信息将追加在后面
  nowTips = outputInfo.innerHTML

  if (pageType === 0) {
    // 在主页通过id抓取时，不需要获取列表页，直接完成
    outputInfo.innerHTML = nowTips + xzlt('_开始获取作品页面')
    getListUrlFinished()
  } else if (pageType === 1) {
    // 下载相关作品
    if (downRelated) {
      getListPage()
    } else {
      // 开始获取图片。因为新版作品页切换作品不需要刷新页面了，所以要传递实时的url。
      getIllustPage(window.location.href)
    }
  } else if (pageType === 2) {
    readyGetListPage()
  } else if (pageType === 6) {
    // 地区排行榜
    getListPage2()
  } else {
    // 普通的开始获取列表页
    getListPage()
  }
}

// 接收 id 列表，然后拼接出作品页面的 url，储存起来
function addIllustUrlList (arr) {
  arr.forEach(data => {
    illustUrlList.push(
      'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + data
    )
  })
}

// 获取作品列表页
function getListPage () {
  changeTitle('↑')
  let url = ''
  if (downRelated) {
    // 下载相关作品时
    url =
      'https://www.pixiv.net/ajax/illust/' +
      getIllustId() +
      '/recommend/init?limit=18'
    // 最后的 18 是预加载首屏的多少个作品的信息，和本次下载并没有关系
  } else if (pageType === 9) {
    // 相似作品页面
    const id = getIllustId() // 作品页的url需要实时获取
    url =
      '/rpc/recommender.php?type=illust&sample_illusts=' +
      id +
      '&num_recommendations=' +
      requsetNumber // 获取相似的作品
  } else if (pageType === 11) {
    // 在发现页面，仅下载已有部分，所以不需要去获取列表页
    const nowIllust = document.querySelectorAll('.QBU8zAz>a') // 获取已有作品
    // 拼接作品的 url
    Array.from(nowIllust).forEach(el => {
      // discovery 列表的 url 是有额外后缀的，需要去掉
      illustUrlList.push(el.href.split('&uarea')[0])
    })
    addOutputInfo('<br>' + xzlt('_列表页获取完成2', illustUrlList.length))
    getListUrlFinished()
    return false
  } else {
    url = baseUrl + (startpageNo + listPageFinished)
  }
  // 发起请求，获取列表页
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.text()
      } else {
        return Promise.reject(new Error(response.status))
      }
    })
    .then(data => {
      listPageFinished++
      let listPageDocument
      // 解析网页内容。排行榜和相似作品、相关作品，直接获取 json 数据，不需要这样处理
      if (pageType !== 7 && pageType !== 9 && !downRelated) {
        listPageDocument = new window.DOMParser().parseFromString(
          data,
          'text/html'
        )
      }

      if (downRelated) {
        // 相关作品
        const recommendData = JSON.parse(data).body.recommendMethods
        let recommendIdList = Object.keys(recommendData)
        // wantPage 可能是 -1 或者大于 0 的数字。当设置了下载个数时，进行裁剪
        if (wantPage !== -1) {
          recommendIdList = recommendIdList.reverse().slice(0, wantPage)
        }
        addIllustUrlList(recommendIdList) // 拼接作品的url

        addOutputInfo('<br>' + xzlt('_相关作品抓取完毕', illustUrlList.length))
        getListUrlFinished()
      } else if (pageType === 5) {
        // tag 搜索页
        tagPageFinished++
        let thisOneInfo = listPageDocument
          .querySelector(tagSearchDataSelector)
          .getAttribute('data-items') // 保存本页的作品信息

        thisOneInfo = JSON.parse(thisOneInfo) // 转化为数组

        // 删除广告信息。有段时间作品列表里会混杂广告，现在不知道还有没有
        thisOneInfo.forEach((val, index, array) => {
          if (val.isAdContainer) {
            array.splice(index, 1)
          }
        })

        displayCover = xzForm.setDisplayCover.checked
        const listWrap = document.querySelector(tagSearchListWrap)

        // 在这里进行一些检查
        for (const data of thisOneInfo) {
          // 检查收藏设置
          const shoucang = data['bookmarkCount']
          if (shoucang < filterBmk) {
            continue
          }

          // 检查宽高设置和宽高比设置
          const tureWidth = parseInt(data['width'])
          const tureHeight = parseInt(data['height'])
          if (
            !checkSetWhok(tureWidth, tureHeight) ||
            !checkRatio(tureWidth, tureHeight)
          ) {
            continue
          }

          // 检查只下载书签作品的设置
          const isBookmarked = data['isBookmarked']
          if (onlyDownBmk) {
            if (!isBookmarked) {
              continue
            }
          }

          // 检查排除类型设置
          const pageCount = parseInt(data['pageCount']) // 包含的图片数量
          const illustType = data['illustType'] // 作品类型 0 插画 1 漫画 2 动图
          let nowType = '1' // 我定义的类型 1 单图 2 多图 3 动图
          // 多图
          if (pageCount > 1) {
            nowType = '2'
          }
          // 动图
          if (illustType === '2') {
            nowType = '3'
          }
          // 如果这个作品的类型被排除了
          if (notdownType.includes(nowType)) {
            continue
          }

          // 检查通过后,拼接每个作品的html
          let newHtml = tagSearchNewHtml
          if (isBookmarked) {
            newHtml = newHtml.replace(/xz_isBookmarked/g, 'on')
          }

          if (pageCount > 1) {
            newHtml = newHtml.replace('<!--xz_multiple_html-->', xzMultipleHtml)
          }

          if (illustType === '2') {
            newHtml = newHtml.replace('<!--xz_gif_html-->', xzGifHtml)
          }

          newHtml = newHtml
            .replace(/xz_illustId/g, data['illustId'])
            .replace(/xz_pageCount/g, data['pageCount'])

          if (displayCover) {
            newHtml = newHtml.replace(/xz_url/g, data['url'])
          } else {
            newHtml = newHtml.replace(/xz_url/g, '')
          }

          newHtml = newHtml
            .replace(/xz_illustTitle/g, data['illustTitle'])
            .replace(/xz_userId/g, data['userId'])
            .replace(/xzUserName/g, data['userName'])
            .replace(/xz_userImage/g, data['userImage'])
            .replace(/xz_bookmarkCount/g, data['bookmarkCount']) // 设置宽高

          const maxWidth = '198'
          const maxHeight = '198'

          if (tureWidth >= tureHeight) {
            newHtml = newHtml
              .replace(/xz_width/g, maxWidth)
              .replace(/xz_height/g, 'auto')
          } else {
            newHtml = newHtml
              .replace(/xz_width/g, 'auto')
              .replace(/xz_height/g, maxHeight)
          }

          imgList.push({
            id: data['illustId'],
            e: newHtml,
            num: Number(shoucang)
          })
          listWrap.insertAdjacentHTML('beforeend', newHtml)
        }

        outputInfo.innerHTML =
          nowTips +
          '<br>' +
          xzlt(
            '_tag搜索页已抓取多少页',
            tagPageFinished,
            wantPage,
            startpageNo + listPageFinished - 1
          )

        // 每抓取完一页，判断任务状态
        if (tagPageFinished === wantPage) {
          // 抓取完了指定的页数
          allowWork = true
          addOutputInfo(
            '<br>' +
              xzlt(
                '_tag搜索页任务完成1',
                document.querySelectorAll(tagSearchListSelector).length
              ) +
              '<br><br>'
          )
          tagSearchPageFinished()
          return false
        } else if (!listPageDocument.querySelector('.next ._button')) {
          // 到最后一页了,已抓取本 tag 的所有页面
          allowWork = true
          addOutputInfo(
            '<br>' +
              xzlt(
                '_tag搜索页任务完成2',
                document.querySelectorAll(tagSearchListSelector).length
              ) +
              '<br><br>'
          )
          tagSearchPageFinished()
          return false
        } else if (interrupt) {
          // 任务被用户中断
          addOutputInfo(
            '<br>' +
              xzlt(
                '_tag搜索页中断',
                document.querySelectorAll(tagSearchListSelector).length
              ) +
              '<br><br>'
          )
          interrupt = false
          tagSearchPageFinished()
          return false
        } else {
          getListPage()
        }
      } else if (pageType === 7) {
        // 排行榜
        const contents = JSON.parse(data).contents // 取出作品信息列表
        contents.forEach(data => {
          let nowClass = ''
          const pageCount = parseInt(data.illust_page_count) // 包含的图片数量

          // 多图
          if (pageCount > 1) {
            nowClass = 'multiple'
          }

          // 作品类型 0 插画 1 漫画 2 动图
          if (data.illust_type === '2') {
            nowClass = 'ugoku-illust'
          }

          const nowHref =
            'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' +
            data.illust_id
          const bookmarked = data.is_bookmarked
          checkNotDownTypeResult(nowClass, nowHref, bookmarked)
        })
        outputInfo.innerHTML =
          nowTips + '<br>' + xzlt('_排行榜进度', listPageFinished)

        if (listPageFinished === partNumber) {
          addOutputInfo('<br>' + xzlt('_排行榜任务完成', illustUrlList.length))
          getListUrlFinished()
        } else {
          getListPage()
        }
      } else if (pageType === 9) {
        // 添加收藏后的相似作品
        const illustList = JSON.parse(data).recommendations // 取出id列表
        addIllustUrlList(illustList) // 拼接作品的url

        addOutputInfo('<br>' + xzlt('_列表页获取完成2', illustUrlList.length))
        getListUrlFinished()
      } else {
        // 不要把下一行的 if 和上一行的 else 合并
        if (pageType === 10 && listIsNew === true) {
          // 关注的新作品 列表改成和 tag 搜索页一样的了
          let thisOneInfo = listPageDocument
            .querySelector(tagSearchDataSelector)
            .getAttribute('data-items') // 保存本页的作品信息

          thisOneInfo = JSON.parse(thisOneInfo) // 转化为数组

          thisOneInfo.forEach(data => {
            let nowClass = ''
            let bookmarked
            const nowHref =
              'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' +
              data['illustId']
            const pageCount = parseInt(data['pageCount']) // 包含的图片数量

            // 多图
            if (pageCount > 1) {
              nowClass = 'multiple'
            }

            // 作品类型 0 插画 1 漫画 2 动图
            const illustType = data['illustType']

            // 动图
            if (illustType === '2') {
              nowClass = 'ugoku-illust'
            }

            // 是否已收藏
            if (data['isBookmarked']) {
              bookmarked = true
            }

            checkNotDownTypeResult(nowClass, nowHref, bookmarked)
          })
        } else {
          // 比较传统的列表页，作品是直接包含在页面里的
          const allPicArea = listPageDocument.querySelectorAll(
            '._image-items .image-item'
          )

          for (const el of allPicArea) {
            // 如果这个作品被删除、或非公开，则去掉它
            if (el.querySelector('.title').getAttribute('title') === '-----') {
              continue
            }
            // 进行检查，保存符合条件的作品页 url
            const nowClass = el.querySelector('a').getAttribute('class')
            const nowHref = el.querySelector('a').getAttribute('href')
            const bookmarked = el
              .querySelector('._one-click-bookmark')
              .classList.contains('on')
            checkNotDownTypeResult(nowClass, nowHref, bookmarked)
          }
        }

        outputInfo.innerHTML =
          nowTips + '<br>' + xzlt('_列表页抓取进度', listPageFinished) // 判断任务状态

        // 如果没有下一页的按钮或者抓取完指定页面
        if (
          !listPageDocument.querySelector('.next ._button') ||
          listPageFinished === wantPage
        ) {
          allowWork = true
          listPageFinished = 0
          addOutputInfo('<br>' + xzlt('_列表页抓取完成'))

          // 没有符合条件的作品
          if (illustUrlList.length === 0) {
            addOutputInfo('<br>' + xzlt('_列表页抓取结果为零'))
            return false
          }

          getListUrlFinished()
        } else {
          // 继续抓取
          getListPage()
        }
      }
    })
    .catch(error => {
      console.log(error)
      // error 的 message 属性是请求出错时的状态码
      if (error.message === '404') {
        // 排行榜
        if (pageType === 7) {
          // 如果发生了404错误，则中断抓取，直接下载已有部分。（因为可能确实没有下一部分了。预设的最大页数可能不符合当前情况
          console.log('404错误，直接下载已有部分')
          addOutputInfo(
            '<br>' +
              xzlt('_排行榜列表页抓取遇到404', illustUrlList.length) +
              '<br><br>'
          )
          getListUrlFinished()
        }
      }
    })
}

// 第二个获取列表的函数，仅在 tag 搜索页和地区排行榜使用（不发送请求，而是从当前列表页直接获取所有内容页的列表）
function getListPage2 () {
  changeTitle('↑')

  // tag搜索页
  if (pageType === 5) {
    if (!allowWork) {
      window.alert(xzlt('_当前任务尚未完成2'))
      return false
    }

    if (visibleList().length === 0) {
      return false
    }

    if (interrupt) {
      interrupt = false
    }

    illustUrlList = []
    resetResult()

    // 因为tag搜索页里的下载按钮是从这里开始执行，所以有些检查在这里进行
    // 这里有一些检查是之前在 startGet 里检查过的，这里再检查一次，以应对用户中途修改设置的情况

    // 检查排除作品类型的设置
    if (checkNotDownType() === false) {
      return false
    }

    // 检查是否设置了宽高条件
    checkSetWh()

    // 检查宽高比设置
    getRatioSetting()

    // 检查是否设置了只下载书签作品
    checkOnlyBmk()

    // 检查是否设置了多图作品的张数限制
    checkMultipleDownNumber()

    // 获取必须包含的tag
    getNeedTag()

    // 获取要排除的tag
    getNotNeedTag()

    // 下载时，只下载可见的作品，不下载隐藏起来的作品
    const allPicArea = visibleList()

    // tag 搜索页里，标识作品类型的 class 与其他页面不同，所以在这里转换成能被接下来的函数识别的字符
    for (const el of allPicArea) {
      let nowClass = ''
      if (el.querySelector(tagSearchMultipleSelector)) {
        nowClass = 'multiple'
      } else if (el.querySelector(tagSearchGifSelector)) {
        nowClass = 'ugoku-illust'
      }

      const nowHref = el.querySelector('a').href
      const bookmarked = el
        .querySelector('._one-click-bookmark')
        .classList.contains('on')

      checkNotDownTypeResult(nowClass, nowHref, bookmarked)
    }
  }

  // 地区排行榜
  if (pageType === 6) {
    const allPicArea = document.querySelectorAll(
      '.ranking-item>.work_wrapper>a'
    )
    allPicArea.forEach(el => {
      const nowClass = el.getAttribute('class')
      const nowHref = el.href
      const bookmarked = el
        .querySelector('._one-click-bookmark')
        .classList.contains('on')
      checkNotDownTypeResult(nowClass, nowHref, bookmarked)
    })
  }

  allowWork = false
  addOutputInfo(
    '<br>' + xzlt('_列表抓取完成开始获取作品页', illustUrlList.length)
  )

  if (illustUrlList.length <= 0) {
    addOutputInfo('<br>' + xzlt('_参数不合法1'))
  }

  getListUrlFinished()
}

// 从 url 里获取作品id，可以传参，无参数则使用当前页面的 url 匹配
function getIllustId (url) {
  const str = url || window.location.search
  return /illust_id=(\d*\d)/.exec(str)[1]
}

// 获取用户id
function getUserId () {
  let userId = ''

  // 首先尝试从 url 中获取
  const test = /(\?|&)id=(\d{1,9})/.exec(window.location.search)
  if (test) {
    userId = test[2]
  } else if (document.querySelector('.user-name')) {
    // 从旧版页面的头像获取（在书签页面使用）
    userId = /\?id=(\d{1,9})/.exec(document.querySelector('.user-name').href)[1]
  } else {
    // 从新版页面的头像获取，因为经常改版，不得已改成从源码匹配了
    userId = /member\.php\?id=(\d{1,9})/.exec(
      document.getElementById('root').innerHTML
    )[1]
  }

  return userId
}

// 获取用户名称
// 测试用户 https://www.pixiv.net/member.php?id=2793583 他的用户名比较特殊
function getUserName () {
  let result = ''

  if (pageType === 1) {
    // 内容页
    result = puser
  } else {
    // 画师作品列表页
    const titleContent = document.querySelector('meta[property="og:title"]')
      .content // リング@「 シスコン 」 [pixiv]
    result = titleContent
      .substr(0, titleContent.length - 7)
      .replace(/ {1,9}$/, '') // 有时候末尾会有空格，要去掉
  }

  return result
}

// 从 url 中获取指定的查询条件
function getQuery (input, query) {
  const arr1 = input.split('?')
  let queryPart = []
  const result = {}

  if (arr1.length > 1) {
    queryPart = arr1[1]
  } else {
    return false
  }

  queryPart = queryPart.split('&')
  queryPart.forEach(el => {
    const arr2 = el.split('=')

    if (arr2.length > 0) {
      result[arr2[0]] = arr2[1]
    }
  })
  return result[query]
}

// 在 pageType 2 使用，准备获取作品列表页
function readyGetListPage () {
  // 每次开始时重置一些条件
  offsetNumber = 0
  type2IdList = []
  worksType = 0
  // works_type:
  // 0 插画和漫画全都要，但是不带 tag
  // 4 插画和漫画全都要，带 tag
  // 1 只要插画
  // 2 只要漫画
  // 3 书签作品

  // 是否是 tag 模式
  tagMode = !!getQuery(locUrl, 'tag')

  // 每页个数
  let onceNumber = 48 // 新版每页 48 个作品（因为新版不显示无法访问的作品，所以有时候一页不足这个数量）
  // 旧版每页 20 个作品
  if (document.querySelector('.user-name')) {
    onceNumber = 20
  }

  // 如果前面有页数，就去掉前面页数的作品数量。即：从本页开始下载
  const nowPage = getQuery(locUrl, 'p') // 判断当前处于第几页
  if (nowPage) {
    offsetNumber = (nowPage - 1) * onceNumber
  }
  if (offsetNumber < 0) {
    offsetNumber = 0
  }

  // 根据页数设置，计算要下载的个数
  requsetNumber = 0
  if (wantPage === -1) {
    requsetNumber = 9999999
  } else {
    requsetNumber = onceNumber * wantPage
  }

  // 根据不同的页面类型，选择不同的 API 来获取 id 列表
  let apiUrl = `https://www.pixiv.net/ajax/user/${getUserId()}/profile/all`

  if (locUrl.includes('member.php?id=')) {
    // 画师资料页主页，采用默认设置即可，无需进行处理
  } else if (/member_illust\.php\?.*id=/.test(locUrl)) {
    // 作品列表页
    if (getQuery(locUrl, 'type') === 'illust') {
      // 插画分类
      worksType = 1

      // 带 tag
      if (tagMode) {
        apiUrl = `https://www.pixiv.net/ajax/user/${getUserId()}/illusts/tag?tag=${getQuery(
          locUrl,
          'tag'
        )}&offset=${offsetNumber}&limit=${requsetNumber}`
      }
    } else if (getQuery(locUrl, 'type') === 'manga') {
      // 漫画分类
      worksType = 2

      // 带 tag
      if (tagMode) {
        apiUrl = `https://www.pixiv.net/ajax/user/${getUserId()}/manga/tag?tag=${getQuery(
          locUrl,
          'tag'
        )}&offset=${offsetNumber}&limit=${requsetNumber}`
      }
    } else if (tagMode) {
      // url 里没有插画也没有漫画，但是有 tag，则是在资料页首页点击了 tag，需要同时获取插画和漫画
      worksType = 4
      apiUrl = `https://www.pixiv.net/ajax/user/${getUserId()}/illustmanga/tag?tag=${getQuery(
        locUrl,
        'tag'
      )}&offset=${offsetNumber}&limit=${requsetNumber}`
    }
  } else if (locUrl.includes('bookmark.php')) {
    // 书签页面，需要多次循环获取
    worksType = 3
    let restMode = 'show' // 判断是公开收藏还是非公开收藏

    if (getQuery(locUrl, 'rest') === 'hide') {
      restMode = 'hide'
    }

    let nowTag = '' // 要使用的tag

    // 设置“未分类”页面的 tag
    if (parseInt(getQuery(locUrl, 'untagged')) === 1) {
      nowTag = encodeURI('未分類')
    }

    // 如果有 tag
    if (tagMode) {
      nowTag = getQuery(locUrl, 'tag')
    }

    apiUrl = `https://www.pixiv.net/ajax/user/${getUserId()}/illusts/bookmarks?tag=${nowTag}&offset=${offsetNumber}&limit=${onceRequest}&rest=${restMode}`
  } else {
    // 不进行抓取
    allowWork = true
    return false
  }

  changeTitle('↑')
  getListPage3(apiUrl)
  addOutputInfo('<br>' + xzlt('_正在抓取'))

  if (worksType === 3 && wantPage === -1) {
    addOutputInfo('<br>' + xzlt('_获取全部书签作品'))
  }
}

// 在 pageType 2 中，获取作品列表页
function getListPage3 (url) {
  let bmkGetEnd = false // 书签作品是否获取完毕

  fetch(url, {
    credentials: 'same-origin'
  })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        return Promise.reject(new Error(response.status))
      }
    })
    .then(data => {
      // 获取非书签页面的作品（插画、漫画、或者全部）
      if (worksType !== 3) {
        if (!tagMode) {
          // 不带 tag
          // https://www.pixiv.net/ajax/user/27517/profile/all
          if (worksType === 0) {
            // 获取全部插画和漫画
            type2IdList = type2IdList
              .concat(Object.keys(data.body.illusts))
              .concat(Object.keys(data.body.manga))
          } else if (worksType === 1 || worksType === 5) {
            // 插画 或 动图
            type2IdList = type2IdList.concat(Object.keys(data.body.illusts))
          } else if (worksType === 2) {
            // 漫画
            type2IdList = type2IdList.concat(Object.keys(data.body.manga))
          }
        } else {
          // 带 tag 的话
          if (worksType === 1 || worksType === 2 || worksType === 4) {
            // 插画、漫画、或者全都要并带 tag ，数据结构都一样
            // https://www.pixiv.net/ajax/user/27517/illusts/tag?tag=%E5%A5%B3%E3%81%AE%E5%AD%90&offset=0&limit=9999999
            // https://www.pixiv.net/ajax/user/27517/manga/tag?tag=%E5%A5%B3%E3%81%AE%E5%AD%90&offset=0&limit=9999999
            // https://www.pixiv.net/ajax/user/544479/illustmanga/tag?tag=%E6%9D%B1%E9%A2%A8%E8%B0%B7%E6%97%A9%E8%8B%97&offset=0&limit=9999999
            const works = data.body.works
            works.forEach(data => type2IdList.push(data.id))
          } else if (worksType === 5) {
            // 动图
            type2IdList = type2IdList.concat(Object.keys(data.body.illusts))
          }
        }
      } else {
        // 书签页面的作品
        // https://www.pixiv.net/ajax/user/9460149/illusts/bookmarks?tag=&offset=0&limit=100&rest=show
        // https://www.pixiv.net/ajax/user/9460149/illusts/bookmarks?tag=推荐&offset=0&limit=100&rest=show
        const works = data.body.works

        // 获取数量超出实际存在数量，works 长度会是 0，代表后面没有更多页面了
        if (works.length === 0 || type2IdList.length >= requsetNumber) {
          bmkGetEnd = true // 书签页获取完毕
        } else {
          works.forEach(data => type2IdList.push(data.id))
        }
      }

      if (type2IdList.length > 0) {
        if (
          worksType === 0 ||
          (worksType === 1 && !tagMode) ||
          (worksType === 2 && !tagMode)
        ) {
          // 非书签页，并且非 tag 页
          // 在获取全部作品时（即使用默认的 api 时），由于 API 里不能设置 requset_number，所以要在这里处理。

          // 把 id 从小到大排序
          // 转换成数字
          type2IdList = type2IdList.map(id => {
            return parseInt(id)
          })
          // 升序排列
          type2IdList.sort(function (x, y) {
            return x - y
          })

          // 删除后面的 id（删除不需要的近期作品）
          type2IdList.splice(
            type2IdList.length - offsetNumber,
            type2IdList.length
          )
        }

        // 获取完毕后，对 id 列表进行处理。不需要重复调用本函数的情况
        if (worksType !== 3 || bmkGetEnd) {
          // 删除多余的作品
          if (type2IdList.length > requsetNumber) {
            if (worksType !== 3) {
              // 删除前面部分
              type2IdList.splice(0, type2IdList.length - requsetNumber)
            } else {
              // 书签作品需要删除后面部分
              type2IdList.splice(requsetNumber, type2IdList.length)
              // 书签页面的 api 没有考虑页面上的排序顺序。获取到的 id 列表是按收藏顺序由最近到最早排列的
            }
          }

          // 重置之前的结果
          illustUrlList = []
          addIllustUrlList(type2IdList) // 拼接作品的url

          addOutputInfo(
            '<br>' + xzlt('_列表抓取完成开始获取作品页', illustUrlList.length)
          )
          getListUrlFinished()
        } else if (worksType === 3 && !bmkGetEnd) {
          // 如果是书签页，且没有获取完毕，则重复执行
          offsetNumber += onceRequest // 每次增加偏移量，并获取之后固定数量
          url = url.replace(/offset=\d*\d?/, `offset=${offsetNumber}`)
          getListPage3(url)
        }
      } else {
        addOutputInfo('<br>' + xzlt('_列表页抓取结果为零'))
        allowWork = true
        return false
      }
    })
    .catch(error => console.log(error))
}

// 作品列表获取完毕，开始抓取作品内容页
function getListUrlFinished () {
  nowTips = outputInfo.innerHTML

  if (illustUrlList.length < ajaxForIllustThreads) {
    ajaxForIllustThreads = illustUrlList.length
  }

  for (let i = 0; i < ajaxForIllustThreads; i++) {
    setTimeout(getIllustPage(illustUrlList[0]), i * ajaxForIllustDelay)
  }
}

// 抓取作品内容页
function getIllustPage (url) {
  /*
  url参数为完整的作品 url，或者不包含根路径的作品 url，如：
  https://www.pixiv.net/member_illust.php?mode=medium&illust_id=65546468
  /member_illust.php?mode=medium&illust_id=65546468
  */
  changeTitle('↑')
  illustUrlList.shift() // 有时并未使用illust_url_list，但对空数组进行shift()是合法的

  // 判断任务是否已中断，目前只在tag搜索页有用到
  if (interrupt) {
    allowWork = true
    return false
  }

  // 快速下载时在这里提示一次
  if (quick) {
    addOutputInfo('<br>' + xzlt('_开始获取作品页面'))
    nowTips = outputInfo.innerHTML
  }

  url = 'https://www.pixiv.net/ajax/illust/' + getIllustId(url) // 取出作品id，拼接出作品页api

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        return Promise.reject(new Error(response.status))
      }
    })
    .then(data => {
      // 这里需要再判断一次中断情况，因为ajax执行完毕是需要时间的
      if (interrupt) {
        allowWork = true
        return false
      }

      // 预设及获取图片信息
      const jsInfo = data.body
      const id = jsInfo.illustId
      const fullWidth = parseInt(jsInfo.width) // 原图宽度
      const fullHeight = parseInt(jsInfo.height) // 原图高度
      const title = jsInfo.illustTitle
      const userid = jsInfo.userId // 画师id
      let user = jsInfo.userName // 画师名字，如果这里获取不到，下面从 tag 尝试获取
      const nowAllTagInfo = jsInfo.tags.tags // tag列表
      let nowAllTag = []

      if (nowAllTagInfo.length > 0) {
        if (!user) {
          user = nowAllTagInfo[0].userName ? nowAllTagInfo[0].userName : '' // 这里从第一个tag里取出画师名字，如果没有 tag 那就获取不到画师名
        }

        nowAllTag = nowAllTagInfo.map(info => {
          return info.tag
        })
      }

      const bmk = jsInfo.bookmarkCount // 收藏数
      let ext = '' // 扩展名
      let imgUrl = ''
      const whCheckResult = checkSetWhok(fullWidth, fullHeight) // 检查宽高设置
      const ratioCheckResult = checkRatio(fullWidth, fullHeight) // 检查宽高比设置

      // 检查收藏数要求
      let bmkCheckResult = true
      if (isSetFilterBmk) {
        if (bmk < filterBmk) {
          bmkCheckResult = false
        }
      }

      // 检查只下载书签作品的要求
      let checkBookmarkResult = true
      if (onlyDownBmk) {
        if (jsInfo.bookmarkData === null) {
          // 没有收藏这个作品
          checkBookmarkResult = false // 检查不通过
        }
      }

      // 检查要排除的 tag 其实 pageType === 9 的时候在获取作品列表时就能获得tag列表，但为了统一，也在这里检查
      let tagCheckResult // 储存 tag 检查结果

      // 检查要排除的 tag，只要作品包含其中一个就结束
      let tagNotNeedIsFound = false
      if (notNeedTag.length > 0) {
        // 如果设置了过滤tag
        for (const tag of nowAllTag) {
          if (tagNotNeedIsFound) {
            break
          }
          for (const notNeed of notNeedTag) {
            if (tag === notNeed) {
              tagNotNeedIsFound = true
              break
            }
          }
        }
      }

      // 检查必须包含的tag，如果有多个，需要全部包含
      if (!tagNotNeedIsFound) {
        // 如果没有匹配到要排除的tag
        if (needTag.length > 0) {
          // 如果设置了必须包含的tag
          let tagNeedIsFound = false
          let tagNeedMatched = 0

          for (const tag of nowAllTag) {
            for (const need of needTag) {
              if (tag === need) {
                tagNeedMatched++
              }
            }
          }

          // 如果全部匹配
          if (tagNeedMatched === needTag.length) {
            tagNeedIsFound = true
          }
          tagCheckResult = tagNeedIsFound
        } else {
          // 如果没有设置必须包含的tag，则通过
          tagCheckResult = true
        }
      } else {
        // 如果匹配到了要排除的tag，则不予通过
        tagCheckResult = false
      }

      // 总检查,要求上面条件全部通过
      const totalCheck =
        tagCheckResult &&
        checkBookmarkResult &&
        whCheckResult &&
        ratioCheckResult &&
        bmkCheckResult

      // 作品类型：
      // 1 单图
      // 2 多图
      // 3 动图
      let thisIllustType

      if (jsInfo.illustType === 0 || jsInfo.illustType === 1) {
        // 单图或多图，0 插画 1 漫画 2 动图（ 1 的如 68430279 ）
        if (jsInfo.pageCount === 1) {
          // 单图
          thisIllustType = 1
        } else if (jsInfo.pageCount > 1) {
          // 多图
          thisIllustType = 2
        }
      } else if (jsInfo.illustType === 2) {
        // 动图
        thisIllustType = 3
      }

      // 结合作品类型处理作品
      if (thisIllustType === 1 && totalCheck) {
        // 如果是单图
        if (!notdownType.includes('1')) {
          // 如果没有排除单图
          imgUrl = jsInfo.urls.original
          ext = imgUrl.split('.')
          ext = ext[ext.length - 1] // 扩展名

          addImgInfo(
            id + '_p0',
            imgUrl,
            title,
            nowAllTag,
            user,
            userid,
            fullWidth,
            fullHeight,
            ext,
            bmk
          )
          outputImgNum()
        }
      } else if (thisIllustType !== 1 && totalCheck) {
        // 单图以外的情况
        if (thisIllustType === 3) {
          // 如果是动图
          if (!notdownType.includes('3')) {
            // 如果没有排除动图
            // 动图的最终url如：
            // https://i.pximg.net/img-zip-ugoira/img/2018/04/25/21/27/44/68401493_ugoira1920x1080.zip
            imgUrl = jsInfo.urls.original
              .replace('img-original', 'img-zip-ugoira')
              .replace('ugoira0', 'ugoira1920x1080')
              .replace('jpg', 'zip')
              .replace('png', 'zip')
            ext = 'ugoira' // 扩展名

            addImgInfo(
              id,
              imgUrl,
              title,
              nowAllTag,
              user,
              userid,
              fullWidth,
              fullHeight,
              ext,
              bmk
            )
            outputImgNum()
          }
        } else {
          // 多图作品
          if (!notdownType.includes('2')) {
            // 如果没有排除多图
            let pNo = jsInfo.pageCount // P数
            // 检查是否需要修改下载的张数。有效值为大于0并不大于总p数，否则下载所有张数
            if (multipleDownNumber > 0 && multipleDownNumber <= pNo) {
              pNo = multipleDownNumber
            }

            // 获取多p作品的原图页面
            imgUrl = jsInfo.urls.original
            ext = imgUrl.split('.')
            ext = ext[ext.length - 1]

            for (let i = 0; i < pNo; i++) {
              const nowUrl = imgUrl.replace('p0', 'p' + i) // 拼接出每张图片的url

              addImgInfo(
                id + '_p' + i,
                nowUrl,
                title,
                nowAllTag,
                user,
                userid,
                fullWidth,
                fullHeight,
                ext,
                bmk
              )
            }
            outputImgNum()
          }
        }
      }

      // 在作品页内下载时，设置的 wantPage 其实是作品数
      if (pageType === 1 && !downRelated) {
        if (wantPage > 0) {
          wantPage--
        }

        if (wantPage === -1 || wantPage > 0) {
          // 应该继续下载时，检查是否有下一个作品
          // 在所有不为 null 的里面（可能有1-3个），取出key比当前作品 id 小的那一个，就是下一个
          const userIllust = jsInfo.userIllusts
          let nextId

          for (const val of Object.values(userIllust)) {
            if (val && val.illustId < id) {
              nextId = val.illustId
              break
            }
          }

          if (nextId) {
            getIllustPage(
              'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' +
                nextId
            )
          } else {
            // 没有剩余作品
            allowWork = true
            allWorkFinished()
          }
        } else {
          // 没有剩余作品
          allowWork = true
          allWorkFinished()
        }
      } else {
        if (illustUrlList.length > 0) {
          // 如果存在下一个作品，则
          getIllustPage(illustUrlList[0])
        } else {
          // 没有剩余作品
          ajaxThreadsFinished++
          if (ajaxThreadsFinished === ajaxForIllustThreads) {
            // 如果所有并发请求都执行完毕则复位
            ajaxThreadsFinished = 0

            allowWork = true
            allWorkFinished()
          }
        }
      }
    })
    .catch(error => {
      console.log(error)
      illustError(url)
      // error 的 message 属性是请求出错时的状态码
      const status = parseInt(error.message)
      switch (status) {
        case 0:
          console.log(xzlt('_作品页状态码0'))
          break

        case 400:
          console.log(xzlt('_作品页状态码400'))
          break

        case 403:
          console.log(xzlt('_作品页状态码403'))
          break

        case 404:
          console.log(xzlt('_作品页状态码404') + ' ' + url)
          break

        default:
          break
      }
    })
}

// 测试图片 url 是否正确的函数。对于 mode=big 的作品和 pixivision ，可以拼接出图片url，只是后缀都是jpg的，所以要测试实际上是jpg还是png
function testExtName (url, length, imgInfoData) {
  testSuffixFinished = false // 初步获取到的后缀名都是jpg的

  let ext = ''
  const testImg = new Image()
  testImg.src = url

  testImg.onload = () => nextStep(true)

  testImg.onerror = () => nextStep(false)

  function nextStep (bool) {
    if (bool) {
      ext = 'jpg'
    } else {
      url = url.replace('.jpg', '.png')
      ext = 'png'
    }

    addImgInfo(
      imgInfoData.id,
      url,
      imgInfoData.title,
      imgInfoData.tags,
      imgInfoData.user,
      imgInfoData.userid,
      imgInfoData.fullWidth,
      imgInfoData.fullHeight,
      ext,
      ''
    )
    outputImgNum()

    if (length !== undefined) {
      // length参数只有在 pixivision 才会传入
      testSuffixNo++
      if (testSuffixNo === length) {
        // 如果所有请求都执行完毕
        allWorkFinished()
      }
    }

    testSuffixFinished = true
  }
}

// mode=big 类型在 pc 端可能已经消失了，但是移动端查看大图还是big https://www.pixiv.net/member_illust.php?mode=big&illust_id=66745241

// 抓取完毕
function allWorkFinished () {
  // 检查快速下载状态
  quietDownload = xzForm.setQuietDownload.checked

  // 检查后缀名的任务是否全部完成
  if (testSuffixFinished) {
    downRelated = false // 解除下载相关作品的标记

    // 在画师的列表页里
    if (pageType === 2) {
      if (!locUrl.includes('bookmark.php')) {
        // 如果是其他列表页，把作品数据按 id 倒序排列，id 大的在前面，这样可以先下载最新作品，后下载早期作品
        imgInfo.sort(sortByProperty('id'))
      } else {
        // 如果是书签页，把作品数据反转，这样可以先下载收藏时间早的，后下载收藏时间近的
        imgInfo.reverse()
      }
      // 注意这里如果在控制台打印 imgInfo 的话，可能看到修改前后的数据是一样的，因为 imgInfo 引用的地址没变，实际上数据修改成功了。如果想要看到不同的数据，可以将 imgInfo 用扩展运算符解开之后再修改。
    }

    addOutputInfo('<br>' + xzlt('_获取图片网址完毕', imgInfo.length) + '<br>')

    if (imgInfo.length === 0) {
      addOutputInfo(xzlt('_没有符合条件的作品') + '<br><br>')
      window.alert(xzlt('_没有符合条件的作品弹窗'))
      allowWork = true
      return false
    }

    addOutputInfo(xzlt('_抓取完毕') + '<br><br>')

    if (!quietDownload && !quick) {
      changeTitle('▶')
    }

    nowTips = outputInfo.innerHTML

    resetDownloadPanel() // 重置下载面板
    document.querySelector('.download_panel').style.display = 'block' // 显示下载面板

    if (!quick) {
      centerWrapShow()
    }

    // 快速下载时点击下载按钮
    if (quick || quietDownload) {
      setTimeout(function () {
        document.querySelector('.startDownload').click()
      }, 200)
    }
  } else {
    // 如果没有完成，则延迟一段时间后再执行
    setTimeout(function () {
      allWorkFinished()
    }, 1000)
  }
}

// 在抓取图片网址时，输出提示
function outputImgNum () {
  outputInfo.innerHTML =
    nowTips + '<br>' + xzlt('_抓取图片网址的数量', imgInfo.length)

  // 如果任务中断
  if (interrupt) {
    addOutputInfo('<br>' + xzlt('_抓取图片网址遇到中断') + '<br><br>')
  }
}

// 添加右侧下载按钮
function addRightButton () {
  rightButton = document.createElement('div')
  rightButton.textContent = '↓'
  rightButton.id = 'rightButton'
  document.body.appendChild(rightButton) // 绑定切换右侧按钮显示的事件

  rightButton.addEventListener(
    'click',
    () => {
      centerWrapShow()
    },
    false
  )
}

// 显示提示。参数 arg 指示鼠标是移入还是移出，并包含鼠标位置
function xzTip (arg) {
  const tipText = this.dataset.tip

  if (!tipText) {
    return false
  }

  if (arg.type === 1) {
    xzTipEl.innerHTML = tipText
    xzTipEl.style.left = arg.x + 30 + 'px'
    xzTipEl.style.top = arg.y - 30 + 'px'
    xzTipEl.style.display = 'block'
  } else if (arg.type === 0) {
    xzTipEl.style.display = 'none'
  }
}

// 添加中间面板
function addCenterWarps () {
  // 添加输出 url 列表、文件名列表的面板
  const outputInfoWrap = document.createElement('div')
  document.body.appendChild(outputInfoWrap)
  outputInfoWrap.outerHTML = `
    <div class="outputInfoWrap">
    <div class="outputUrlClose" title="${xzlt('_关闭')}">X</div>
    <div class="outputUrlTitle">${xzlt('_输出信息')}</div>
    <div class="outputInfoContent"></div>
    <div class="outputUrlFooter">
    <div class="outputUrlCopy" title="">${xzlt('_复制')}</div>
    </div>
    </div>
    `
  // 绑定关闭输出区域的事件
  document.querySelector('.outputUrlClose').addEventListener('click', () => {
    document.querySelector('.outputInfoWrap').style.display = 'none'
  })
  // 绑定复制输出内容的事件
  document.querySelector('.outputUrlCopy').addEventListener('click', () => {
    const range = document.createRange()
    range.selectNodeContents(document.querySelector('.outputInfoContent'))
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)
    document.execCommand('copy')

    // 改变提示文字
    document.querySelector('.outputUrlCopy').textContent = xzlt(
      '_已复制到剪贴板'
    )
    setTimeout(() => {
      window.getSelection().removeAllRanges()
      document.querySelector('.outputUrlCopy').textContent = xzlt('_复制')
    }, 1000)
  })

  // 添加下载面板
  centerWrap = document.createElement('div')
  document.body.appendChild(centerWrap)
  centerWrap.outerHTML = `
    <div class="XZTipEl"></div>
    <div class="centerWrap">
    <div class="centerWrap_head">
    <span class="centerWrap_title xz_blue"> ${xzlt('_下载设置')}</span>
    <div class="btns">
    <a class="xztip centerWrap_top_btn wiki_url" data-tip="${xzlt(
      '_wiki'
    )}" href="https://github.com/xuejianxianzun/PixivBatchDownloader/wiki" target="_blank"><img src="${chrome.extension.getURL('images/wiki.png')}" /></a>
    <a class="xztip centerWrap_top_btn" data-tip="${xzlt(
      '_github'
    )}" href="https://github.com/xuejianxianzun/PixivBatchDownloader" target="_blank"><img src="${chrome.extension.getURL('images/github-logo.png')}" /></a>
      <div class="xztip centerWrap_top_btn centerWrap_toogle_option" data-tip="${xzlt(
      '_收起展开设置项'
    )}">▲</div>
      <div class="xztip centerWrap_top_btn centerWrap_close" data-tip="${xzlt(
      '_快捷键切换显示隐藏'
    )}">X</div>
    </div>
    </div>
    <div class="centerWrap_con">
    <form class="xzForm">
    <div class="xz_option_area">
    <p class="xzFormP1">
    <span class="setWantPageWrap">
    <span class="xztip settingNameStyle1 setWantPageTip1" data-tip="" style="margin-right: 0px;">${xzlt(
    '_页数'
  )}</span><span class="gray1" style="margin-right: 10px;"> ? </span>
    <input type="text" name="setWantPage" class="setinput_style1 xz_blue setWantPage">&nbsp;&nbsp;&nbsp;
    <span class="setWantPageTip2 gray1">-1 或者大于 0 的数字</span>
    </span>
    </p>
    <p class="xzFormP2">
    <span class="xztip settingNameStyle1" data-tip="${xzlt(
    '_筛选收藏数的提示Center'
  )}">${xzlt('_筛选收藏数Center')}<span class="gray1"> ? </span></span>
    <input type="text" name="setFavNum" class="setinput_style1 xz_blue" value="0">&nbsp;&nbsp;&nbsp;&nbsp;
    </p>
    <p class="xzFormP3">
    <span class="xztip settingNameStyle1" data-tip="${xzlt(
    '_多p下载前几张提示'
  )}">${xzlt('_多p下载前几张')}<span class="gray1"> ? </span></span>
    <input type="text" name="setPNo" class="setinput_style1 xz_blue" value="${multipleDownNumber}">
    </p>
    <p class="xzFormP4">
    <span class="xztip settingNameStyle1" data-tip="${xzlt(
    '_筛选宽高的按钮Title'
  )} ${xzlt('_筛选宽高的提示文字')}">${xzlt(
  '_筛选宽高的按钮文字'
)}<span class="gray1"> ? </span></span>
    <input type="text" name="setWidth" class="setinput_style1 xz_blue" value="0">
    <input type="radio" name="setWidthAndOr" id="setWidth_AndOr1" value="&" checked> <label for="setWidth_AndOr1">and&nbsp;</label>
    <input type="radio" name="setWidthAndOr" id="setWidth_AndOr2" value="|"> <label for="setWidth_AndOr2">or&nbsp;</label>
    <input type="text" name="setHeight" class="setinput_style1 xz_blue" value="0">
    </p>
    <p class="xzFormP13">
    <span class="xztip settingNameStyle1" data-tip="${xzlt(
    '_设置宽高比例Title'
  )}">${xzlt('_设置宽高比例')}<span class="gray1"> ? </span></span>
    <input type="radio" name="ratio" id="ratio0" value="0" checked> <label for="ratio0"> ${xzlt(
    '_不限制'
  )}&nbsp; </label>
    <input type="radio" name="ratio" id="ratio1" value="1"> <label for="ratio1"> ${xzlt(
    '_横图'
  )}&nbsp; </label>
    <input type="radio" name="ratio" id="ratio2" value="2"> <label for="ratio2"> ${xzlt(
    '_竖图'
  )}&nbsp; </label>
    <input type="radio" name="ratio" id="ratio3" value="3"> <label for="ratio3"> ${xzlt(
    '_输入宽高比'
  )}<input type="text" name="userRatio" class="setinput_style1 xz_blue" value="1.4"></label>
    </p>
    <p class="xzFormP5">
    <span class="xztip settingNameStyle1" data-tip="${xzlt(
    '_设置作品类型的提示Center'
  )}">${xzlt('_设置作品类型')}<span class="gray1"> ? </span></span>
    <label for="setWorkType1"><input type="checkbox" name="setWorkType1" id="setWorkType1" checked> ${xzlt(
    '_单图'
  )}&nbsp;</label>
    <label for="setWorkType2"><input type="checkbox" name="setWorkType2" id="setWorkType2" checked> ${xzlt(
    '_多图'
  )}&nbsp;</label>
    <label for="setWorkType3"><input type="checkbox" name="setWorkType3" id="setWorkType3" checked> ${xzlt(
    '_动图'
  )}&nbsp;</label>
    </p>
    <p class="xzFormP11">
    <span class="xztip settingNameStyle1" data-tip="${xzlt(
    '_只下载已收藏的提示'
  )}">${xzlt('_只下载已收藏')}<span class="gray1"> ? </span></span>
    <label for="setOnlyBmk"><input type="checkbox" name="setOnlyBmk" id="setOnlyBmk"> ${xzlt(
    '_启用'
  )}</label>
    </p>
    <p class="xzFormP6">
    <span class="xztip settingNameStyle1" data-tip="${xzlt(
    '_必须tag的提示文字'
  )}">${xzlt('_必须含有tag')}<span class="gray1"> ? </span></span>
    <input type="text" name="setTagNeed" class="setinput_style1 xz_blue setinput_tag">
    </p>
    <p class="xzFormP7">
    <span class="xztip settingNameStyle1" data-tip="${xzlt(
    '_排除tag的提示文字'
  )}">${xzlt('_不能含有tag')}<span class="gray1"> ? </span></span>
    <input type="text" name="setTagNotNeed" class="setinput_style1 xz_blue setinput_tag">
    </p>
    <p class="xzFormP9" style="display:none;">
    <span class="xztip settingNameStyle1" data-tip="${xzlt(
    '_显示封面的提示'
  )}">${xzlt('_是否显示封面')}<span class="gray1"> ? </span></span>
    <label for="setDisplayCover"><input type="checkbox" name="setDisplayCover" id="setDisplayCover" checked> ${xzlt(
    '_显示'
  )}</label>
    </p>
    <p class="xzFormP8">
    <span class="xztip settingNameStyle1" data-tip="${xzlt(
    '_快速下载的提示'
  )}">${xzlt('_是否快速下载')}<span class="gray1"> ? </span></span>
    <label for="setQuietDownload"><input type="checkbox" name="setQuietDownload" id="setQuietDownload"> ${xzlt(
    '_启用'
  )}</label>
    </p>
    </div>
    <div class="centerWrap_btns centerWrap_btns_free">

    </div>
    <p> ${xzlt(
    '_设置命名规则3',
    '<span class="fwb xz_blue imgNum">0</span>'
  )}</p>
    <p>
    <span class="xztip settingNameStyle1" data-tip="${xzlt(
    '_线程数字'
  )}">${xzlt('_设置下载线程')}<span class="gray1"> ? </span></span>
    <input type="text" name="setThread" class="setinput_style1 xz_blue" value="${downloadThreadDeauflt}">
    </p>
    <p>
    <span class="xztip settingNameStyle1" data-tip="${xzlt(
    '_设置文件夹名的提示'
  )}">${xzlt('_设置文件名')}<span class="gray1"> ? </span></span>
    <input type="text" name="fileNameRule" class="setinput_style1 xz_blue fileNameRule" value="{id}">
    &nbsp;&nbsp;
    <select name="pageInfoSelect">
    </select>
    &nbsp;&nbsp;
    <select name="fileNameSelect">
      <option value="default">…</option>
      <option value="{id}">{id}</option>
      <option value="{title}">{title}</option>
      <option value="{tags}">{tags}</option>
      <option value="{user}">{user}</option>
      <option value="{userid}">{userid}</option>
      <option value="{px}">{px}</option>
      <option value="{bmk}">{bmk}</option>
      <option value="{id_num}">{id_num}</option>
      <option value="{p_num}">{p_num}</option>
      </select>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <span class="gray1 showFileNameTip"> ${xzlt('_查看标记的含义')}</span>
    </p>
    <p class="fileNameTip tip">
    ${xzlt('_设置文件夹名的提示').replace('<br>', '. ')}
    <br>
    <span class="xz_blue">{p_user}</span>
    ${xzlt('_文件夹标记PUser')}
    <br>
    <span class="xz_blue">{p_uid}</span>
    ${xzlt('_文件夹标记PUid')}
    <br>
    <span class="xz_blue">{p_tag}</span>
    ${xzlt('_文件夹标记PTag')}
    <br>
    <span class="xz_blue">{p_title}</span>
    ${xzlt('_文件夹标记PTitle')}
    <br>
    <span class="xz_blue">{id}</span>
    ${xzlt('_可用标记1')}
    <br>
    <span class="xz_blue">{title}</span>
    ${xzlt('_可用标记2')}
    <br>
    <span class="xz_blue">{tags}</span>
    ${xzlt('_可用标记3')}
    <br>
    <span class="xz_blue">{user}</span>
    ${xzlt('_可用标记4')}
    <br>
    <span class="xz_blue">{userid}</span>
    ${xzlt('_可用标记6')}
    <br>
    <span class="xz_blue">{px}</span>
    ${xzlt('_可用标记7')}
    <br>
    <span class="xz_blue">{bmk}</span>
    ${xzlt('_可用标记8')}
    <br>
    <span class="xz_blue">{id_num}</span>
    ${xzlt('_可用标记9')}
    <br>
    <span class="xz_blue">{p_num}</span>
    ${xzlt('_可用标记10')}
    <br>
    ${xzlt('_可用标记5')}
    </p>
    <p class="xzFormP10">
    <span class="xztip settingNameStyle1" data-tip="${xzlt(
    '_添加字段名称提示'
  )}">${xzlt('_添加字段名称')}<span class="gray1"> ? </span></span>
    <label for="setTagNameToFileName"><input type="checkbox" name="setTagNameToFileName" id="setTagNameToFileName" checked> ${xzlt(
    '_启用'
  )}</label>
    &nbsp;&nbsp;&nbsp;
    <span class="gray1 showFileNameResult"> ${xzlt('_预览文件名')}</span>
    </p>
    </form>
    <div class="download_panel">
    <div class="centerWrap_btns">
    <div class="startDownload" style="background:${xzBlue};"> ${xzlt(
  '_下载按钮1'
)}</div>
    <div class="pauseDownload" style="background:#e49d00;"> ${xzlt(
    '_下载按钮2'
  )}</div>
    <div class="stopDownload" style="background:${xzRed};"> ${xzlt(
  '_下载按钮3'
)}</div>
    <div class="copyUrl" style="background:${xzGreen};"> ${xzlt(
  '_下载按钮4'
)}</div>
    </div>
    <div class="centerWrap_down_tips">
    <p>
    ${xzlt('_当前状态')}
    <span class="down_status xz_blue"> ${xzlt('_未开始下载')}</span>
    </p>
    <div>
    ${xzlt('_下载进度')}
    <div class="right1">
    <div class="progressBar progressBar1">
    <div class="progress progress1"></div>
    </div>
    <div class="progressTip progressTip1">
    <span class="downloaded">0</span>
    /
    <span class="imgNum">0</span>
    </div>
    </div>
    </div>
    </div>
    <div class="centerWrap_down_list">
    <p> ${xzlt('_下载线程')}</p>
    <ul>
    <li class="downloadBar">
    <div class="progressBar progressBar2">
    <div class="progress progress2"></div>
    </div>
    <div class="progressTip progressTip2">
    <span class="download_fileName"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${xzlt(
    '_已下载'
  )}&nbsp;&nbsp;<span class="loaded">0/0</span>KB
    </div>
    </li>
    </ul>
    </div>
    </div>
    <a class="download_a" download=""></a>
    <p class="gray1 showDownTip"> ${xzlt('_查看下载说明')} <a class="xztip centerWrap_top_btn wiki2" href="https://github.com/xuejianxianzun/PixivBatchDownloader/wiki" target="_blank"><img src="${chrome.extension.getURL('images/wiki.png')}" /> ${xzlt('_wiki')}</a></p>
    <p class="downTip tip"> ${xzlt('_下载说明')}</p>
    </div>
    `
  centerBtnWrap = document.querySelector('.centerWrap_btns_free')
  centerWrap = document.querySelector('.centerWrap')
  xzForm = document.querySelector('.xzForm')

  // 绑定下载面板的事件
  document
    .querySelector('.centerWrap_close')
    .addEventListener('click', centerWrapHide)
  document
    .querySelector('.showFileNameResult')
    .addEventListener('click', () => showOutputInfoWrap('name'))
  document
    .querySelector('.showFileNameTip')
    .addEventListener('click', () =>
      toggle(document.querySelector('.fileNameTip'))
    )
  document
    .querySelector('.showDownTip')
    .addEventListener('click', () => toggle(document.querySelector('.downTip')))
  document
    .querySelector('.centerWrap_toogle_option')
    .addEventListener('click', toggleOptionArea)

  // 显示提示
  xzTipEl = document.querySelector('.XZTipEl')
  const xztips = document.querySelectorAll('.xztip')
  for (const el of xztips) {
    for (const ev of ['mouseenter', 'mouseleave']) {
      el.addEventListener(ev, event => {
        const e = event || window.event
        xzTip.call(el, {
          type: ev === 'mouseenter' ? 1 : 0,
          x: e.clientX,
          y: e.clientY
        })
      })
    }
  }

  // 输入框获得焦点时自动选择文本（文件名输入框例外）
  const centerInputs = xzForm.querySelectorAll('input[type=text]')
  for (const el of centerInputs) {
    if (el.name !== 'fileNameRule') {
      el.addEventListener('focus', function () {
        this.select()
      })
    }
  }

  // 添加文件名下拉框选项
  appendValueToInput(xzForm.pageInfoSelect, xzForm.fileNameRule)
  appendValueToInput(xzForm.fileNameSelect, xzForm.fileNameRule)

  // 绑定开始下载按钮的事件
  document.querySelector('.startDownload').addEventListener('click', () => {
    // 如果正在下载中，或无图片，则不予处理
    if (downloadStarted || imgInfo.length === 0) {
      return false
    }

    // 检查是否是可以下载的时间
    const time1 = new Date().getTime() - canStartTime

    // 时间未到
    if (time1 < 0) {
      setTimeout(() => {
        document.querySelector('.startDownload').click() // 到时间了再点击开始按钮
      }, Math.abs(time1))
      return false
    }

    // 重置一些条件

    // 检查下载线程设置
    const setThread = parseInt(xzForm.setThread.value)
    if (setThread < 1 || setThread > 10 || isNaN(setThread)) {
      downloadThread = downloadThreadDeauflt // 重设为默认值
    } else {
      downloadThread = setThread // 设置为用户输入的值
    }

    // 检查下载线程数
    if (imgInfo.length < downloadThread) {
      downloadThread = imgInfo.length
    }

    // 显示下载队列
    const centerWrapDownList = document.querySelector('.centerWrap_down_list')
    centerWrapDownList.style.display = 'block'

    // 如果下载线程数量发生变化，重设下载进度条的数量
    const downloadBar = document.querySelectorAll('.downloadBar')
    if (downloadBar.length !== downloadThread) {
      let result = ''

      for (let i = 0; i < downloadThread; i++) {
        result += downloadBar[0].outerHTML
      }

      centerWrapDownList.innerHTML = result
    }

    downloadBarList = document.querySelectorAll('.downloadBar')
    downloadStarted = true

    // 如果没有暂停，则重新下载，否则继续下载
    if (!downloadPause) {
      resetDownloadPanel()
    }
    downloadPause = false
    downloadStop = false

    addOutputInfo('<br>' + xzlt('_正在下载中') + '<br>')

    // tag 搜索页按收藏数从高到低下载
    if (pageType === 5) {
      imgInfo.sort(sortByProperty('bmk'))
    }

    // 启动或继续下载，建立并发下载线程
    for (let i = 0; i < downloadThread; i++) {
      if (i + downloaded < imgInfo.length) {
        setTimeout(function () {
          startDownload(i + downloaded, i)
        }, 100 * (i + 1))
      }
    }

    document.querySelector('.down_status').textContent = xzlt('_正在下载中')
    downloadA = document.querySelector('.download_a')
  })

  // 暂停下载按钮
  document.querySelector('.pauseDownload').addEventListener('click', () => {
    if (imgInfo.length === 0) {
      return false
    }

    // 停止的优先级高于暂停。点击停止可以取消暂停状态，但点击暂停不能取消停止状态
    if (downloadStop === true) {
      return false
    }

    if (downloadPause === false) {
      // 如果正在下载中
      if (downloadStarted) {
        downloadPause = true // 发出暂停信号

        downloadStarted = false
        canStartTime = new Date().getTime() + pauseStartDealy // 设置延迟一定时间后才允许继续下载

        document.querySelector(
          '.down_status'
        ).innerHTML = `<span style="color:#f00">${xzlt('_已暂停')}</span>`
        addOutputInfo(xzlt('_已暂停') + '<br><br>')
      } else {
        // 不在下载中的话不允许启用暂停功能
        return false
      }
    }
  })

  // 停止下载按钮
  document.querySelector('.stopDownload').addEventListener('click', () => {
    if (imgInfo.length === 0) {
      return false
    }

    if (downloadStop === false) {
      downloadStop = true
      downloadStarted = false
      canStartTime = new Date().getTime() + pauseStartDealy // 设置延迟一定时间后才允许继续下载

      document.querySelector(
        '.down_status'
      ).innerHTML = `<span style="color:#f00">${xzlt('_已停止')}</span>`
      addOutputInfo(xzlt('_已停止') + '<br><br>')
      downloadPause = false
    }
  })

  // 复制url按钮
  document
    .querySelector('.copyUrl')
    .addEventListener('click', () => showOutputInfoWrap('url'))
}

// 向中间面板添加按钮
function addCenterButton (tag = 'div', bg = xzBlue, text = '', attr = []) {
  const e = document.createElement(tag)
  e.style.backgroundColor = bg
  e.textContent = text

  for (const [key, value] of attr) {
    e.setAttribute(key, value)
  }

  centerBtnWrap.appendChild(e)
  return e
}

// 重置下载面板的信息
function resetDownloadPanel () {
  downloaded = 0
  document.querySelector('.downloaded').textContent = downloaded

  for (const el of document.querySelectorAll('.imgNum')) {
    el.textContent = imgInfo.length
  }

  for (const el of document.querySelectorAll('.download_fileName')) {
    el.textContent = ''
  }

  for (const el of document.querySelectorAll('.loaded')) {
    el.textContent = '0/0'
  }

  for (const el of document.querySelectorAll('.progress')) {
    el.style.width = '0%'
  }
}

// 把下拉框的选择项插入到文本框里
function appendValueToInput (form, to) {
  form.addEventListener('change', function () {
    if (this.value === 'default') {
      return false
    } else {
      // 把选择项插入到光标位置,并设置新的光标位置
      const position = to.selectionStart
      to.value =
        to.value.substr(0, position) +
        this.value +
        to.value.substr(position, to.value.length)
      to.selectionStart = position + this.value.length
      to.selectionEnd = position + this.value.length
      to.focus() // 保存命名规则

      saveXzSetting('userSetName', to.value)
    }
  })
}

// 显示中间区域
function centerWrapShow () {
  centerWrap.style.display = 'block'
  rightButton.style.display = 'none'
}

// 隐藏中间区域
function centerWrapHide () {
  centerWrap.style.display = 'none'
  rightButton.style.display = 'block'
  document.querySelector('.outputInfoWrap').style.display = 'none'
}

// 收起展开选项设置区域
function toggleOptionArea () {
  optionAreaShow = !optionAreaShow
  const xzOptionArea = document.querySelectorAll('.xz_option_area')

  for (const iterator of xzOptionArea) {
    iterator.style.display = optionAreaShow ? 'block' : 'none'
  }

  document.querySelector('.centerWrap_toogle_option').innerHTML = optionAreaShow
    ? '▲'
    : '▼'
}

// 使用快捷键 Alt + x 切换显示隐藏
window.addEventListener(
  'keydown',
  event => {
    const e = event || window.event
    if (e.altKey && e.keyCode === 88) {
      const nowDisplay = centerWrap.style.display
      if (nowDisplay === 'block') {
        centerWrapHide()
      } else {
        centerWrapShow()
      }
    }
  },
  false
)

// 读取储存的设置
function readXzSetting () {
  xzSetting = window.localStorage.getItem('xzSetting')

  if (!xzSetting) {
    // 设置为默认值。必须和排除的 tag 是字符串类型
    xzSetting = {
      multipleDownNumber: 0,
      notdownType: '',
      needTag: '',
      notNeedTag: '',
      displayCover: true,
      quietDownload: true,
      downloadThread: 6,
      userSetName: '{id}',
      tagNameToFileName: true
    }
  } else {
    xzSetting = JSON.parse(xzSetting)
  }

  // 设置多图设置
  const setPNoInput = xzForm.setPNo
  setPNoInput.value = xzSetting.multipleDownNumber

  // 保存多图设置
  setPNoInput.addEventListener('change', function () {
    if (parseInt(this.value) >= 0) {
      saveXzSetting('multipleDownNumber', this.value)
    }
  })

  // 设置排除类型
  xzSetting.notdownType = xzSetting.notdownType.replace('4', '') // 某次升级取消了4，但如果旧版本留下了4就会导致问题，所以手动去掉。

  for (let index = 0; index < xzSetting.notdownType.length; index++) {
    xzForm['setWorkType' + xzSetting.notdownType[index]].checked = false
  }

  // 保存排除类型
  for (let index = 1; index < 4; index++) {
    xzForm['setWorkType' + index].addEventListener('click', () => {
      saveXzSetting('notdownType', getNotDownType())
    })
  }

  // 设置必须的 tag
  const setTagNeedInput = xzForm.setTagNeed
  setTagNeedInput.value = xzSetting.needTag // 保存必须的 tag设置

  setTagNeedInput.addEventListener('change', function () {
    saveXzSetting('needTag', this.value)
  })

  // 设置排除的 tag
  const setTagNotNeedInput = xzForm.setTagNotNeed
  setTagNotNeedInput.value = xzSetting.notNeedTag // 保存排除的 tag设置

  setTagNotNeedInput.addEventListener('change', function () {
    saveXzSetting('notNeedTag', this.value)
  })

  // 设置是否显示封面
  const setDisplayCoverInput = xzForm.setDisplayCover
  setDisplayCoverInput.checked = xzSetting.displayCover // 保存封面选项

  setDisplayCoverInput.addEventListener('click', function () {
    saveXzSetting('displayCover', this.checked)
  })

  // 设置快速下载
  const setQuietDownloadInput = xzForm.setQuietDownload
  setQuietDownloadInput.checked = xzSetting.quietDownload // 保存快速下载

  setQuietDownloadInput.addEventListener('click', function () {
    saveXzSetting('quietDownload', this.checked)
  })

  // 设置下载线程
  const setThreadInput = xzForm.setThread
  setThreadInput.value = xzSetting.downloadThread // 保存下载线程

  setThreadInput.addEventListener('change', function () {
    if (this.value > 0 && this.value <= 10) {
      saveXzSetting('downloadThread', this.value)
    }
  })

  // 设置文件命名规则
  const fileNameRuleInput = xzForm.fileNameRule

  // pixivision 里，文件名只有 id 标记会生效，所以把文件名部分替换成 id
  if (pageType === 8) {
    fileNameRuleInput.value = '{p_title}/{id}'
  } else {
    fileNameRuleInput.value = xzSetting.userSetName
  }

  // 保存文件命名规则
  fileNameRuleInput.addEventListener('change', function () {
    if (this.value !== '') {
      saveXzSetting('userSetName', this.value)
    } else {
      // 把下拉框恢复默认值
      xzForm.fileNameSelect.value = xzForm.fileNameSelect.children[0].value
    }
  })

  // 是否添加字段名称
  const setTagNameToFileNameInput = xzForm.setTagNameToFileName
  setTagNameToFileNameInput.checked = xzSetting.tagNameToFileName

  setTagNameToFileNameInput.addEventListener('click', function () {
    saveXzSetting('tagNameToFileName', this.checked)
  })
}

// 储存设置
function saveXzSetting (key, value) {
  xzSetting[key] = value
  window.localStorage.setItem('xzSetting', JSON.stringify(xzSetting))
}

// 隐藏不需要的选项。在某些页面里，隐藏一些选项。
function hideNotNeedOption (no) {
  for (const num of no) {
    document.querySelector('.xzFormP' + num).style.display = 'none'
  }
}

// 清除多图作品
function clearMultiple () {
  addCenterButton('div', xzRed, xzlt('_清除多图作品'), [
    ['title', xzlt('_清除多图作品Title')]
  ]).addEventListener(
    'click',
    () => {
      centerWrapHide()
      const allPicArea = document.querySelectorAll(tagSearchListSelector)
      allPicArea.forEach(el => {
        if (el.querySelector(tagSearchMultipleSelector)) {
          el.remove()
        }
      })
      outputNowResult()
    },
    false
  )
}

// 清除动图作品
function clearUgoku () {
  addCenterButton('div', xzRed, xzlt('_清除动图作品'), [
    ['title', xzlt('_清除动图作品Title')]
  ]).addEventListener(
    'click',
    () => {
      centerWrapHide()
      const allPicArea = document.querySelectorAll(tagSearchListSelector)
      allPicArea.forEach(el => {
        if (el.querySelector(tagSearchGifSelector)) {
          el.remove()
        }
      })
      outputNowResult()
    },
    false
  )
}

// 手动删除作品
function deleteByClick () {
  addCenterButton('div', xzRed, xzlt('_手动删除作品'), [
    ['title', xzlt('_手动删除作品Title')]
  ]).addEventListener('click', function () {
    delWork = !delWork // 给作品绑定删除属性

    document.querySelectorAll(tagSearchListSelector).forEach(el => {
      el.onclick = function (e) {
        if (delWork) {
          (e || window.event).preventDefault()
          this.remove()

          if (allowWork) {
            outputNowResult()
          }

          return false
        }
      }
    })

    if (delWork) {
      this.textContent = xzlt('_退出手动删除')
      setTimeout(() => {
        centerWrapHide()
      }, 300)
    } else {
      this.textContent = xzlt('_手动删除作品')
    }
  })
}

// 生成输出区域的内容，按 type 不同，输出 url 或者 文件名
function showOutputInfoWrap (type) {
  if (imgInfo.length === 0) {
    return false
  }

  let result = ''

  if (type === 'url') {
    // 拷贝图片 url
    result = imgInfo.reduce((total, now) => {
      return (total += now.url + '<br>')
    }, result)
  } else if (type === 'name') {
    // 预览和拷贝图片名
    result = imgInfo.reduce((total, now) => {
      return (total +=
        now.id + '.' + now.ext + ': ' + getFileName(now) + '<br>') // 在每个文件名前面加上它的原本的名字，方便用来做重命名
    }, result)
  } else {
    return false
  }

  document.querySelector('.outputInfoContent').innerHTML = result
  document.querySelector('.outputInfoWrap').style.display = 'block'
}

// 生成文件名，传入参数为图片信息
function getFileName (data) {
  let result = xzForm.fileNameRule.value
  // 为空时使用 {id}
  result = result || '{id}' // 生成文件名
  // 将序号部分格式化成 3 位数字。p 站投稿一次最多 200 张
  // data.id = data.id.replace(/(\d.*p)(\d.*)/,  (...str)=> {
  //  return str[1] + str[2].padStart(3, '0');
  // });

  // 储存每个文件名标记的配置
  const cfg = [
    {
      name: '{p_user}',
      // 标记
      value: Object.prototype.hasOwnProperty.call(pageInfo, 'p_user')
        ? getUserName()
        : '',
      // 值
      prefix: '',
      // 添加在前面的字段名称
      safe: false
      // 是否是安全的文件名。如果包含有一些特殊字符，就不安全，要进行替换
    },
    {
      name: '{p_uid}',
      value: Object.prototype.hasOwnProperty.call(pageInfo, 'p_uid')
        ? getUserId()
        : '',
      prefix: '',
      safe: true
    },
    {
      name: '{p_title}',
      value: document.title
        .replace(/\[(0|↑|→|▶|↓|║|■|√| )\] /, '')
        .replace(/^\(\d.*\) /, ''),
      // 去掉标题上的下载状态、消息数量提示
      prefix: '',
      safe: false
    },
    {
      name: '{p_tag}',
      value: pageInfo.p_tag ? pageInfo.p_tag : '',
      prefix: '',
      safe: false
    },
    {
      name: '{id}',
      value: data.id,
      prefix: '',
      safe: true
    },
    {
      name: '{id_num}',
      value: parseInt(data.id),
      prefix: '',
      safe: true
    },
    {
      name: '{p_num}',
      value: parseInt(/\d*$/.exec(data.id)),
      prefix: '',
      safe: true
    },
    {
      name: '{title}',
      value: data.title,
      prefix: 'title_',
      safe: false
    },
    {
      name: '{user}',
      value: data.user,
      prefix: 'user_',
      safe: false
    },
    {
      name: '{userid}',
      value: data.userid,
      prefix: 'uid_',
      safe: true
    },
    {
      name: '{px}',
      value: (function () {
        if (result.includes('{px}') && data.fullWidth !== undefined) {
          return data.fullWidth + 'x' + data.fullHeight
        } else {
          return ''
        }
      })(),
      prefix: '',
      safe: true
    },
    {
      name: '{tags}',
      value: data.tags.join(','),
      prefix: 'tags_',
      safe: false
    },
    {
      name: '{bmk}',
      value: data.bmk,
      prefix: 'bmk_',
      safe: false
    }
  ]

  for (const item of cfg) {
    if (result.includes(item.name)) {
      if (item.value !== '' && item.value !== null) {
        // 只有当标记有值时才继续操作. 所以没有值的标记会原样保留
        let once = String(item.value)
        // 添加字段名称
        if (xzForm.setTagNameToFileName.checked) {
          once = item.prefix + once
        }

        if (!item.safe) {
          once = once.replace(safeFileNameRule, '_')
        }

        result = result.replace(new RegExp(item.name, 'g'), once) // 将标记替换成最终值，如果有重复的标记，全部替换
      }
    }
  }

  // 处理空值，不能做文件夹名的字符，连续的 '//'。 有时候两个斜线中间的字段是空值，最后就变成两个斜线挨在一起了
  result = result
    .replace(/undefined/g, '')
    .replace(safeFolderRule, '_')
    .replace(/\/{2,9}/, '/')

  // 去掉头尾的 /
  if (result.startsWith('/')) {
    result = result.replace('/', '')
  }
  if (result.endsWith('/')) {
    result = result.substr(0, result.length - 1)
  }

  // 处理文件名长度 这里有个问题，因为无法预知浏览器下载文件夹的长度，所以只能预先设置一个预设值
  result = result.substr(0, fileNameLength)

  // 处理后缀名
  result += '.' + data.ext
  // 动图，在最后一个斜杠 / 后添加前缀
  if (data.ext === 'ugoira') {
    const index = result.lastIndexOf('/')
    result =
      result.substr(0, index + 1) +
      'open_with_HoneyView-' +
      result.substr(index + 1, result.length)
  }

  // 快速下载时，如果只有一个文件，则不建立文件夹
  if (quick && imgInfo.length === 1) {
    const index = result.lastIndexOf('/')
    result = result.substr(index + 1, result.length)
  }

  return result
}

// 开始下载。参数是下载序号、要使用的下载栏的序号
function startDownload (downloadNo, downloadBarNo) {
  changeTitle('↓') // 获取文件名

  const fullFileName = getFileName(imgInfo[downloadNo])
  downloadBarList[downloadBarNo].querySelector(
    '.download_fileName'
  ).textContent = fullFileName
  // 下载图片
  const xhr = new XMLHttpRequest()
  xhr.open('GET', imgInfo[downloadNo].url, true)
  xhr.responseType = 'blob'
  xhr.timeout = 180000
  // 显示下载进度
  xhr.addEventListener('progress', function (e) {
    if (downloadPause || downloadStop) {
      return false
    }

    e = e || window.event
    const loaded = parseInt(e.loaded / 1000)
    const total = parseInt(e.total / 1000)
    downloadBarList[downloadBarNo].querySelector('.loaded').textContent =
      loaded + '/' + total
    downloadBarList[downloadBarNo].querySelector('.progress').style.width =
      (loaded / total) * 100 + '%'
  })
  // 图片下载完成
  xhr.addEventListener('loadend', function () {
    if (downloadPause || downloadStop) {
      return false
    }

    const blobUrl = URL.createObjectURL(xhr.response)
    // 控制点击下载按钮的时间间隔大于0.5秒
    if (new Date().getTime() - clickTime > timeInterval) {
      clickTime = new Date().getTime()
      browserDownload(blobUrl, fullFileName, downloadBarNo)
    } else {
      timeDelay += timeInterval
      setTimeout(() => {
        browserDownload(blobUrl, fullFileName, downloadBarNo)
      }, timeDelay)
    }
  })
  xhr.send()
}

// 下载到硬盘
function browserDownload (blobUrl, fullFileName, downloadBarNo) {
  if (new Date().getTime() - clickTime < timeInterval) {
    // console.count('+1s'); // 此句输出加时的次数
    setTimeout(() => {
      browserDownload(blobUrl, fullFileName, downloadBarNo)
    }, timeInterval) // 虽然设置了两次点击间隔不得小于time_interval，但实际执行过程中仍然有可能比time_interval小。间隔太小的话就会导致漏下。当间隔过小时补上延迟

    return false
  }

  // 向浏览器发送下载请求
  chrome.runtime.sendMessage({
    msg: 'send_download',
    fileUrl: blobUrl,
    fileName: fullFileName,
    no: downloadBarNo
  })
}

// 监听后台发送的消息
chrome.runtime.onMessage.addListener(function (msg) {
  // msg:{msg : 'downloaded', data: {no: 0, url: "blob:https://www.pixiv.net/a4743ebd-987f-484f-b73e-0229931849c1", tabid: 19} }
  if (msg.msg === 'downloaded') {
    // 扩展下载完成之后
    afterDownload(msg.data.no)
    // 这个 blobUrl 是在前台页面创建的，也要在前台页面撤销，后台页面不能撤销它
    URL.revokeObjectURL(msg.data.url)
  } else if (msg.msg === 'click_icon') {
    // 点击图标
    if (centerWrap.style.display === 'block') {
      centerWrapHide()
    } else {
      centerWrapShow()
    }
  } else if (msg.msg === 'download_err') {
    console.log('download_err')
  }
})

// 下载之后
function afterDownload (downloadBarNo) {
  // 计算延迟时间
  clickTime = new Date().getTime()
  timeDelay -= timeInterval

  // 因为有多个线程，所以有可能把 timeDelay 减小到 0 以下，这里做限制
  if (timeDelay < 0) {
    timeDelay += timeInterval
  }

  // 显示进度信息
  downloaded++
  document.querySelector('.downloaded').textContent = downloaded
  document.querySelector('.progress1').style.width =
    (downloaded / imgInfo.length) * 100 + '%'

  if (downloaded === imgInfo.length) {
    // 如果所有文件都下载完毕
    downloadStarted = false
    quick = false
    downloadStop = false
    downloadPause = false
    downloaded = 0
    document.querySelector('.down_status').textContent = xzlt('_下载完毕')
    addOutputInfo(xzlt('_下载完毕') + '<br><br>')
    changeTitle('√')
  } else {
    // 如果没有全部下载完毕
    // 如果已经暂停下载
    if (downloadPause) {
      downloadStarted = false
      quick = false
      changeTitle('║')
      return false
    } // 如果已经停止下载

    if (downloadStop) {
      downloadStarted = false
      quick = false
      changeTitle('■')
      return false
    } // 继续添加任务

    if (downloaded + downloadThread - 1 < imgInfo.length) {
      // 如果已完成的数量 加上 线程中未完成的数量，仍然没有达到文件总数
      startDownload(downloaded + downloadThread - 1, downloadBarNo) // 这里需要减一，就是downloaded本次自增的数字，否则会跳一个序号
    }
  }
}

// 清空图片信息并重置输出区域，在重复抓取时使用
function resetResult () {
  imgInfo = []
  centerWrapHide()
  document.querySelector('.outputInfoContent').innerHTML = ''
  downloadStarted = false
  downloadPause = false
  downloadStop = false
}

// 根据页面类型，在设置页数的地方显示对应的提示
function changeWantPage () {
  const setWantPageWrap = document.querySelector('.setWantPageWrap')
  const setWantPage = setWantPageWrap.querySelector('.setWantPage')
  const setWantPageTip1 = setWantPageWrap.querySelector('.setWantPageTip1')
  const setWantPageTip2 = setWantPageWrap.querySelector('.setWantPageTip2')

  switch (pageType) {
    case 0:
      setWantPageWrap.style.display = 'none'
      break

    case 1:
      wantPage = -1
      setWantPageTip1.textContent = xzlt('_个数')
      setWantPageTip1.dataset.tip =
        xzlt('_checkWantPageRule1Arg5') + '<br>' + xzlt('_相关作品大于0')
      setWantPageTip2.textContent = xzlt('_数字提示1')
      setWantPage.value = wantPage
      break

    case 5:
      wantPage = 1000
      setWantPageTip1.textContent = xzlt('_页数')
      setWantPageTip1.dataset.tip = xzlt('_要获取的作品个数2')
      setWantPageTip2.textContent = '-1 - 1000'
      setWantPage.value = wantPage
      break

    case 6:
      setWantPageWrap.style.display = 'none'
      break

    case 7:
      setWantPageWrap.style.display = 'none'
      break

    case 8:
      setWantPageWrap.style.display = 'none'
      break

    case 9:
      wantPage = 100
      setWantPageTip1.textContent = xzlt('_个数')
      setWantPageTip1.dataset.tip = xzlt('_要获取的作品个数2')
      setWantPageTip2.textContent = '1 - 500'
      setWantPage.value = wantPage
      break

    case 10:
      wantPage = 10
      setWantPageTip1.textContent = xzlt('_页数')
      setWantPageTip1.dataset.tip = xzlt('_checkWantPageRule1Arg8')
      setMaxNum()
      setWantPageTip2.textContent = `1 - ${maxNum}`
      setWantPage.value = wantPage
      break

    case 11:
      setWantPageWrap.style.display = 'none'
      break

    default:
      wantPage = -1
      setWantPageTip1.textContent = xzlt('_页数')
      setWantPageTip1.dataset.tip = xzlt('_checkWantPageRule1Arg5')
      setWantPageTip2.textContent = xzlt('_数字提示1')
      setWantPage.value = wantPage
      break
  }
}

// 获取当前页面的一些信息，用于文件名中
function getPageInfo () {
  const pageInfoSelect = xzForm.pageInfoSelect // 添加文件夹可以使用的标记

  pageInfo = {}
  pageInfo.p_title = '' // 所有页面都可以使用 p_title

  // 只有 1 和 2 可以使用画师信息
  if (pageType === 1 || pageType === 2) {
    const addTagBtn = document.getElementById('add_tag_btn') // 一些信息可能需要从 dom 取得，在这里直接执行可能会出错，所以先留空

    if (!locUrl.includes('bookmark.php')) {
      // 不是书签页
      pageInfo.p_user = ''
      pageInfo.p_uid = ''

      if (addTagBtn) {
        addTagBtn.style.display = 'none'
      }
    } else {
      if (addTagBtn) {
        addTagBtn.style.display = 'inline-block'
      }
    }

    // 如果有 tag 则追加 tag
    if (getQuery(locUrl, 'tag')) {
      pageInfo.p_tag = decodeURIComponent(getQuery(locUrl, 'tag'))
    }
  } else if (pageType === 5) {
    pageInfo.p_tag = decodeURIComponent(getQuery(locUrl, 'word'))
  }

  // 添加下拉选项
  pageInfoSelect.innerHTML = ''
  pageInfoSelect.insertAdjacentHTML(
    'beforeend',
    '<option value="default">…</option>'
  )
  for (const key of Object.keys(pageInfo)) {
    const optionHtml = `<option value="{${key}}">{${key}}</option>`
    pageInfoSelect.insertAdjacentHTML('beforeend', optionHtml)
  }
}

// 判断 pageType
function checkPageType () {
  oldPageType = pageType
  locUrl = window.location.href

  if (
    window.location.hostname === 'www.pixiv.net' &&
    window.location.pathname === '/'
  ) {
    pageType = 0
  } else if (
    locUrl.includes('illust_id') &&
    !locUrl.includes('mode=manga') &&
    !locUrl.includes('bookmark_detail') &&
    !locUrl.includes('bookmark_add') &&
    !locUrl.includes('response.php')
  ) {
    pageType = 1
  } else if (
    !locUrl.includes('mode=manga&illust_id') &&
    (/member_illust\.php\?.*id=/.test(locUrl) ||
      locUrl.includes('member.php?id=') ||
      locUrl.includes('bookmark.php'))
  ) {
    pageType = 2
  } else if (locUrl.includes('search.php?')) {
    pageType = 5
  } else if (
    locUrl.includes('ranking_area.php') &&
    locUrl !== 'https://www.pixiv.net/ranking_area.php'
  ) {
    pageType = 6
  } else if (window.location.pathname === '/ranking.php') {
    pageType = 7
  } else if (
    locUrl.includes('https://www.pixivision.net') &&
    locUrl.includes('/a/')
  ) {
    pageType = 8
  } else if (
    locUrl.includes('bookmark_add.php?id=') ||
    locUrl.includes('bookmark_detail.php?illust_id=')
  ) {
    pageType = 9
  } else if (
    locUrl.includes('bookmark_new_illust') ||
    locUrl.includes('new_illust.php') ||
    locUrl.includes('new_illust_r18.php')
  ) {
    pageType = 10
  } else if (window.location.pathname === '/discovery') {
    pageType = 11
  } else {
    pageType = undefined
  }
  return pageType
}

// 当 pageType 为 1 时执行
function pageType1 () {
  // 在右侧创建快速下载按钮
  const quickDownBtn = document.createElement('div')
  quickDownBtn.id = 'quick_down_btn'
  quickDownBtn.textContent = '↓'
  quickDownBtn.setAttribute('title', xzlt('_快速下载本页'))
  document.body.appendChild(quickDownBtn)
  quickDownBtn.addEventListener(
    'click',
    () => {
      quick = true
      startGet()
    },
    false
  )

  addCenterButton('div', xzBlue, xzlt('_从本页开始下载')).addEventListener(
    'click',
    startGet
  )

  const downXgBtn = addCenterButton('div', xzBlue, xzlt('_下载相关作品'))
  downXgBtn.addEventListener(
    'click',
    () => {
      downRelated = true
      startGet()
    },
    false
  )

  downloadGifBtn = addCenterButton('div', xzGreen, xzlt('_转换为GIF'))
  downloadGifBtn.style.display = 'none'
  downloadGifBtn.addEventListener(
    'click',
    () => {
      centerWrapHide() // 下载动图

      fetch(gifSrc)
        .then(res => res.blob())
        .then(data => {
          zipFile = data
        })
      changeTitle('↑')
      addOutputInfo('<br>' + xzlt('_准备转换'))
      checkCanConvert()
    },
    false
  )
  quickBookmark()
  initViewer() // 创建 gif 图片列表

  gifImgList = document.createElement('div')
  gifImgList.style.display = 'none'
  document.body.appendChild(gifImgList)
}

// 当 pageType 为 2 时执行
function pageType2 () {
  addCenterButton('div', xzBlue, xzlt('_开始抓取'), [
    ['title', xzlt('_开始抓取') + xzlt('_默认下载多页')]
  ]).addEventListener('click', startGet) // 在书签页面隐藏只要书签选项

  if (locUrl.includes('bookmark.php')) {
    hideNotNeedOption([11])
  }

  // 删除快速下载按钮
  const quickDownBtn = document.getElementById('quick_down_btn')
  if (quickDownBtn) {
    quickDownBtn.remove()
  }

  // 如果存在 token，则添加“添加 tag”按钮
  if (getToken()) {
    const addTagBtn = addCenterButton('div', xzBlue, xzlt('_添加tag'), [
      ['title', xzlt('_添加tag')]
    ])
    addTagBtn.id = 'add_tag_btn'

    if (!locUrl.includes('bookmark.php')) {
      addTagBtn.style.display = 'none'
    }

    addTagBtn.addEventListener('click', readyAddTag)
  }
}

// init
async function init () {
  await appendStyle()
  addRightButton()
  addCenterWarps()
  changeWantPage()
  readXzSetting()
  getPageInfo()

  // pageType 1 和 2 都是无刷新加载，所以会进行一些相同的处理
  if (pageType === 1 || pageType === 2) {
    // pushState 判断从列表页进入作品页的情况，popstate 判断从作品页退回列表页的情况
    ['pushState', 'popstate'].forEach(item => {
      window.addEventListener(item, () => {
        // 当页面切换时，判断新页面的类型
        checkPageType()
        changeWantPage()
        getPageInfo()

        // 切换页面时，清空输出区域
        if (outputInfo) {
          outputInfo.innerHTML = ''
        }

        // 在作品页里调用图片查看器
        if (pageType === 1) {
          initViewer()
        }

        // 当新旧页面的 pageType 不相同的时候
        if (oldPageType !== pageType) {
          centerBtnWrap.innerHTML = '' // 清空原有的下载按钮
          wantPage = undefined // 重置页数/个数设置

          if (pageType === 1) {
            // 从 2 进入 1
            pageType1()
          } else if (pageType === 2) {
            // 从 1 进入 2
            pageType2()
          }
        }
      })
    })
  }

  if (pageType === 0) {
    // 0.index 首页
    // https://www.pixiv.net/

    // 用于输入id的输入框
    const downIdInput = document.createElement('textarea')
    downIdInput.id = 'down_id_input'
    downIdInput.setAttribute('placeholder', xzlt('_输入id进行下载的提示文字'))
    insertToHead(downIdInput)
    downIdInput.addEventListener('change', () => {
      // 当输入框内容改变时检测，非空值时显示下载面板
      if (downIdInput.value !== '') {
        downIdButton.dataset.ready = 'true'
        centerWrapShow()
        downIdButton.textContent = xzlt('_开始抓取')
      } else {
        downIdButton.dataset.ready = 'false'
        centerWrapHide()
        downIdButton.textContent = xzlt('_输入id进行下载')
      }
    })

    let idValue = []

    const downIdButton = addCenterButton(
      'div',
      xzBlue,
      xzlt('_输入id进行下载'),
      [['id', 'down_id_button']]
    )
    downIdButton.dataset.ready = 'false' // 是否准备好了
    downIdButton.addEventListener(
      'click',
      () => {
        illustUrlList = [] // 每次开始下载前重置作品的url列表

        if (downIdButton.dataset.ready === 'false') {
          // 还没准备好
          downIdInput.style.display = 'block'
          centerWrapHide()
          document.documentElement.scrollTop = 0
        } else {
          // 检查 id
          idValue = downIdInput.value.split('\n')
          idValue.forEach(id => {
            const nowId = parseInt(id)
            // 如果 id 不是数字，或者处于非法区间
            if (isNaN(nowId) || nowId < 22 || nowId > 99999999) {
              illustUrlList = [] // 清空结果
              window.alert(xzlt('_id不合法'))
              return false
            } else {
              addIllustUrlList([id]) // 拼接作品的url
            }
          })
          addOutputInfo(xzlt('_任务开始0'))
          startGet()
        }
      },
      false
    )
  }

  if (pageType === 1) {
    // 1. illust 作品页
    // https://www.pixiv.net/member_illust.php?mode=medium&illust_id=75896706

    pageType1()
  } else if (pageType === 2) {
    // 2. user_page 用户的列表页、书签页
    // https://www.pixiv.net/member.php?id=7210261
    // https://www.pixiv.net/member_illust.php?id=7210261&type=illust&tag=初音ミク
    // https://www.pixiv.net/bookmark.php?id=7210261&rest=show
    // https://www.pixiv.net/bookmark.php

    pageType2()
  } else if (pageType === 5) {
    // 5. tag 搜索页
    // https://www.pixiv.net/search.php?s_mode=s_tag&word=Fate%2FGrandOrder

    tagSearchDataSelector = '#js-mount-point-search-result-list'
    tagSearchListSelector = '.JoCpVnw'

    // 因为 tag 搜索页新版的作品不是直接输出到页面里,但我们需要呈现 html ,所以需要模拟生成的元素
    tagSearchNewHtml = `
    <div class="JoCpVnw">
    <figure class="mSh0kS-" style="width: 200px; max-height: 288px;">
    <div class="_3IpHIQ_">
    <a href="/member_illust.php?mode=medium&illust_id=xz_illustId" rel="noopener" class="PKslhVT">
    <!--xz_multiple_html-->
    <img alt="" class="_1hsIS11" width="xz_width" height="xz_height" src="xz_url">
    <!--xz_gif_html-->
    </a>
    <div class="thumbnail-menu">
    <div class="_one-click-bookmark js-click-trackable xz_isBookmarked" data-click-category="abtest_www_one_click_bookmark" data-click-action="illust" data-click-label="xz_illustId" data-type="illust" data-id="xz_illustId" title="添加收藏" style="position: static;"></div>
    <div class="_balloon-menu-opener">
    <div class="opener"></div>
    <section class="_balloon-menu-popup">
    <ul class="_balloon-menu-closer menu">
    <li>
    <span class="item">${xzlt('_屏蔽设定')}</span>
    </li>
    <li>
    <a class="item" target="_blank" href="/illust_infomsg.php?illust_id=xz_illustId">${xzlt(
    '_举报'
  )}</a>
    </li>
    </ul>
    </section>
    </div>
    </div>
    </div>
    <figcaption class="_3HwPt89">
    <ul>
    <li class="QBU8zAz">
    <a href="/member_illust.php?mode=medium&illust_id=xz_illustId" title="xz_illustTitle">xz_illustTitle</a>
    </li>
    <li>
    <a href="/member_illust.php?id=xz_userId" target="_blank" title="xzUserName" class="js-click-trackable ui-profile-popup _2wIynyg" data-click-category="recommend 20130415-0531" data-click-action="ClickToMember" data-click-label="" data-user_id="xz_userId" data-user_name="xzUserName">
    <span class="_3KDKjXM">
    <div class="" style="background: url(xz_userImage) center top / cover no-repeat; width: 16px; height: 16px;"></div>
    </span>
    <span class="lPoWus1">xzUserName</span>
    </a>
    </li>
    <li style="position: relative;">
    <ul class="count-list">
    <li>
    <a href="/bookmark_detail.php?illust_id=xz_illustId" class="_ui-tooltip bookmark-count"> <i class="_icon sprites-bookmark-badge"></i>xz_bookmarkCount</a>
    </li>
    </ul>
    </li>
    </ul>
    </figcaption>
    </figure>
    </div>
    `
    baseUrl = locUrl.split('&p=')[0] + '&p='
    getNowPageNo()
    document.getElementById('js-react-search-mid').style.minHeight = 'auto' // 这部分的高度改成 auto 以免搜索时会有空白区域
    xzForm.setFavNum.value = 1000 // tag 搜索页默认收藏数设置为 1000
    document.querySelector('.xzFormP9').style.display = 'block' // 显示“是否显示封面图”的选项

    // 添加快速筛选功能
    const nowTag = document
      .querySelector('.column-title a')
      .textContent.split(' ')[0]
    const favNums = [
      '100users入り',
      '500users入り',
      '1000users入り',
      '3000users入り',
      '5000users入り',
      '10000users入り',
      '20000users入り',
      '30000users入り',
      '50000users入り'
    ] // 200 和 2000 的因为数量太少，不添加。40000 的也少
    const fastScreenArea = document.createElement('div')
    fastScreenArea.className = 'fastScreenArea'
    const insetParent = document.querySelector('._unit')
    insetParent.insertBefore(
      fastScreenArea,
      insetParent.querySelector('#js-react-search-top')
    )

    let searchMode = '' // 判断当前搜索模式，默认的“全部”模式不需要做处理

    if (locUrl.includes('&mode=r18')) {
      searchMode = '&mode=r18'
    } else if (locUrl.includes('&mode=safe')) {
      searchMode = '&mode=safe'
    }

    let orderMode = '' // 判断当前排序方式

    if (locUrl.includes('&order=date_d')) {
      // 按最新排序
      orderMode = '&order=date_d'
    } else if (locUrl.includes('&order=date')) {
      // 按旧排序
      orderMode = '&order=date'
    }

    fastScreenArea.innerHTML = favNums.reduce((result, cur) => {
      return (result += `<a href="https://www.pixiv.net/search.php?s_mode=s_tag${searchMode}${orderMode}&word=${nowTag}%20${cur}">${cur}</a>`)
    }, '')

    // 添加下载面板的按钮
    addCenterButton('div', xzGreen, xzlt('_开始筛选'), [
      ['title', xzlt('_开始筛选Title')]
    ]).addEventListener(
      'click',
      () => {
        if (interrupt) {
          interrupt = false
        }

        startGet()
      },
      false
    )

    addCenterButton('div', xzGreen, xzlt('_在结果中筛选'), [
      ['title', xzlt('_在结果中筛选Title')]
    ]).addEventListener(
      'click',
      () => {
        const allPicArea = document.querySelectorAll(tagSearchListSelector)
        let wantFavoriteNumber2 = window.prompt(
          xzlt('_在结果中筛选弹窗'),
          '2000'
        )

        if (!wantFavoriteNumber2) {
          return false
        } else if (
          isNaN(Number(wantFavoriteNumber2)) ||
          ~~Number(wantFavoriteNumber2) <= 0
        ) {
          window.alert(xzlt('_参数不合法1'))
          return false
        } else {
          wantFavoriteNumber2 = ~~Number(wantFavoriteNumber2)
        }

        allPicArea.forEach(el => {
          if (
            parseInt(el.querySelector('._ui-tooltip').textContent) <
            wantFavoriteNumber2
          ) {
            // 必须限制序号0，不然对图片的回应数也会连起来
            el.style.display = 'none' // 这里把结果中不符合二次过滤隐藏掉，而非删除
          } else {
            el.style.display = 'inline-flex'
          }
        })
        outputNowResult()
        centerWrapHide()
      },
      false
    )

    addCenterButton('div', xzRed, xzlt('_中断当前任务'), [
      ['title', xzlt('_中断当前任务Title')]
    ]).addEventListener(
      'click',
      () => {
        interrupt = true

        if (!allowWork) {
          addOutputInfo('<br>' + xzlt('_当前任务已中断') + '<br><br>')
          allowWork = true
        }

        centerWrapHide()
      },
      false
    )

    clearMultiple()

    clearUgoku()

    deleteByClick()

    addCenterButton('div', xzBlue, xzlt('_下载当前作品'), [
      ['title', xzlt('_下载当前作品Title')]
    ]).addEventListener('click', getListPage2)
  } else if (pageType === 6) {
    // 6. ranking_area 地区排行榜
    // https://www.pixiv.net/ranking_area.php?type=detail&no=0

    addCenterButton('div', xzBlue, xzlt('_下载本页作品'), [
      ['title', xzlt('_下载本页作品Title')]
    ]).addEventListener('click', startGet)
  } else if (pageType === 7) {
    // 7. ranking 排行榜
    // https://www.pixiv.net/ranking.php

    if (window.location.search === '') {
      // 直接获取json数据
      baseUrl = locUrl + '?format=json&p='
    } else {
      baseUrl = locUrl + '&format=json&p='
    }

    startpageNo = 1 // 从第一页（部分）开始抓取

    listPageFinished = 0 // 已经向下抓取了几页（部分）

    // 设置页数。排行榜页面一页有50张作品，当页面到达底部时会加载下一页
    if (baseUrl.includes('r18g')) {
      // r18g 只有1个榜单，固定1页
      partNumber = 1
    } else if (baseUrl.includes('_r18')) {
      // r18 模式，这里的6是最大值，有的排行榜并没有6页
      partNumber = 6
    } else {
      // 普通模式，这里的10也是最大值。如果实际没有10页，则在检测到404页面的时候停止抓取下一页
      partNumber = 10
    }

    addCenterButton('div', xzBlue, xzlt('_下载本排行榜作品'), [
      ['title', xzlt('_下载本排行榜作品Title')]
    ]).addEventListener('click', startGet)
  } else if (pageType === 8) {
    // 8. pixivision
    // https://www.pixivision.net/zh/a/3190

    const type = document
      .querySelector('a[data-gtm-action=ClickCategory]')
      .getAttribute('data-gtm-label')

    if (type === 'illustration' || type === 'manga' || type === 'cosplay') {
      // 在插画、漫画、cosplay类型的页面上创建下载功能
      addCenterButton(
        'div',
        xzBlue,
        xzlt('_下载该页面的图片')
      ).addEventListener(
        'click',
        () => {
          resetResult()
          insertOutputInfo()
          changeTitle('↑')

          let imageList = []

          if (type === 'illustration') {
            // 针对不同类型的页面，使用不同的选择器
            imageList = document.querySelectorAll('.am__work__main img')
            const urls = Array.from(imageList).map(el => {
              return el.src
                .replace('c/768x1200_80/img-master', 'img-original')
                .replace('_master1200', '')
            })
            testSuffixNo = 0
            urls.forEach((url, index) => {
              let id = url.split('/')
              id = id[id.length - 1].split('.')[0] // 取出作品 id

              setTimeout(
                testExtName(url, urls.length, {
                  id: id,
                  title: '',
                  tags: [],
                  user: '',
                  userid: '',
                  fullWidth: '',
                  fullHeight: ''
                }),
                index * ajaxForIllustDelay
              )
            })
          } else {
            if (type === 'manga') {
              imageList = document.querySelectorAll('.am__work__illust')
            } else if (type === 'cosplay') {
              imageList = document.querySelectorAll(
                '.fab__image-block__image img'
              )
            }

            // 把图片url添加进数组
            Array.from(imageList).forEach(el => {
              const imgUrl = el.src
              if (
                imgUrl !==
                'https://i.pximg.net/imgaz/upload/20170407/256097898.jpg'
              ) {
                // 跳过Cure的logo图片
                let id = imgUrl.split('/')
                id = id[id.length - 1].split('.')[0] // 作品id

                let ext = imgUrl.split('.')
                ext = ext[ext.length - 1] // 扩展名

                addImgInfo(id, imgUrl, '', [], '', '', '', '', ext, '')
              }
            })
            allWorkFinished()
          }
        },
        false
      )
    }

    hideNotNeedOption([1, 2, 3, 4, 5, 6, 7, 11, 13])
  } else if (pageType === 9) {
    // 9. bookmark_add
    // https://www.pixiv.net/bookmark_detail.php?illust_id=63148723

    addCenterButton('div', xzBlue, xzlt('_下载相似图片'), [
      ['title', xzlt('_下载相似图片')]
    ]).addEventListener(
      'click',
      () => {
        setRequsetNum()

        if (requsetNumber > 0) {
          startGet()
        }
      },
      false
    )
  } else if (pageType === 10) {
    // 10. new_illust 关注的人的新作品 以及 大家的新作品
    // https://www.pixiv.net/bookmark_new_illust.php
    // https://www.pixiv.net/new_illust.php

    if (locUrl.includes('/bookmark_new_illust')) {
      listIsNew = true
      tagSearchDataSelector = '#js-mount-point-latest-following' // 在 关注的人 里使用

      tagSearchListSelector = '.JoCpVnw'
    }

    // 列表页url规则
    if (!locUrl.includes('type=')) {
      // 如果没有type标志，说明是在“综合”分类的第一页，手动加上分类
      baseUrl = locUrl + '?type=all'.split('&p=')[0] + '&p='
    } else {
      baseUrl = locUrl.split('&p=')[0] + '&p='
    }

    setMaxNum() // 页数上限
    getNowPageNo()

    addCenterButton('div', xzBlue, xzlt('_从本页开始下载'), [
      ['title', xzlt('_下载大家的新作品')]
    ]).addEventListener('click', startGet)
  } else if (pageType === 11) {
    // 11.discover 发现
    // https://www.pixiv.net/discovery

    tagSearchListSelector = '._2RNjBox' // 发现页面的作品列表

    addCenterButton('div', xzBlue, xzlt('_下载当前作品'), [
      ['title', xzlt('_下载当前作品Title')]
    ]).addEventListener('click', startGet)

    clearMultiple()

    clearUgoku()

    deleteByClick()
  }
}

// 检查启动条件
if (checkPageType() !== undefined) {
  init()
}
