/// <reference path = "./content.d.ts" />
/// <reference path = "../../node_modules/viewerjs/types/index.d.ts" />

/*
 * project: Pixiv Batch Downloader
 * author:  xuejianxianzun; 雪见仙尊
 * license: GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
 * Github： https://github.com/xuejianxianzun/PixivBatchDownloader
 * Releases: https://github.com/xuejianxianzun/PixivBatchDownloader/releases
 * Wiki:    https://github.com/xuejianxianzun/PixivBatchDownloader/wiki
 * Website: https://pixiv.download/
 * E-mail:  xuejianxianzun@gmail.com
 * QQ group:499873152
 */

// 储存一些页面信息
class PageInfoClass implements PageInfo {
  public p_title: string = ''
  public p_user: string = ''
  public p_uid: string = ''
  public p_tag: string = ''
}

// 按钮颜色
enum Color {
  blue = '#0ea8ef',
  green = '#14ad27',
  red = '#f33939'
}

const xzBlue: Color = Color.blue

const xzGreen: Color = Color.green

const xzRed: Color = Color.red

const illustTypes = ['illustration', 'manga', 'ugoira'] // 作品类型 0 插画 1 漫画 2 动图

let outputArea: HTMLDivElement // 输出信息的区域

const downloadThreadDeauflt: number = 5 // 同时下载的线程数，可以通过设置 downloadThread 修改

let imgNumberPerWork: number = 0 // 每个作品下载几张图片。0为不限制，全部下载。改为1则只下载第一张。这是因为有时候多p作品会导致要下载的图片过多，此时可以设置只下载前几张，减少下载量

let displayCover: boolean = true // 是否显示tag搜索页里面的封面图片。如果tag搜索页的图片数量太多，那么加载封面图可能要很久，并且可能因为占用大量带宽导致抓取中断。这种情况下可以将此参数改为false，不加载封面图。

let xzSetting: XzSetting // 保存的设置

let locUrl: string = '' // 页面的url

let pageType: number // 页面类型

let oldPageType: number // 上一个页面类型

let hasTag: boolean = false // pageType 2 里，是否带 tag

let type2ListType: number // pageType 2 里的页面类型，都是列表页

let offsetNumber: number = 0 // 要去掉的作品数量

const onceRequest: number = 100 // 每次请求多少个数量

let type2IdList: string[] = [] // 储存 pageType 2 的 id 列表

let imgInfo: ImgInfo[] = [] // 储存图片信息

let downloadedList: number[] = [] // 标记已完成的完成的下载任务

let illustUrlList: string[] = [] // 储存要下载的作品的页面url

let rankList: RankList = {} // 储存作品在排行榜中的排名

const tagSearchResult: TagSearchResult[] = [] // 储存 tag 搜索页符合条件的所有作品

let ajaxForIllustThreads: number = 6 // 抓取页面时的并发连接数

let ajaxThreadsFinished: number = 0 // 统计有几个并发线程完成所有请求。统计的是并发数（ ajaxForIllustThreads ）而非请求数

let testSuffixFinished: boolean = true // 检查图片后缀名正确性的函数是否执行完毕

let testSuffixNo: number = 0 // 检查图片后缀名函数的计数

let nowTips: string = '' // 输出顶部提示

let baseUrl: string = '' // 列表页url规则

let startpageNo: number = 1 // 列表页开始抓取时的页码

let listPageFinished: number = 0 // 记录一共抓取了多少列表页

let tagPageFinished: number = 0 // 记录 tag 搜索页本次任务已经抓取了多少页

let wantPage: number = 0 // 要抓取几页

let quickDownload: boolean = false // 快速下载当前作品，这个只在作品页内直接下载时使用

let interrupt: boolean = false // 是否中断正在进行的任务，目前仅在 tag 搜索页使用

let allowWork: boolean = true // 当前是否允许展开工作（如果有未完成的任务则应为 false

let notNeedTag: string[] = [] // 要排除的tag的列表

let needTag: string[] = [] // 必须包含的tag的列表

let notdownType: string = '' // 设置不要下载的作品类型

let isSetFilterWh: boolean = false // 是否设置了筛选宽高

// 宽高条件
let filterWh = {
  andOr: '&',
  width: 0,
  height: 0
}

let isSetFilterBmk: boolean = false // 是否设置了筛选收藏数

let filterBmk: number = 0 // 要求收藏达到指定数量

let partNumber: number = 10 // 保存不同排行榜的列表数量

let requsetNumber: number = 0 // 要下载多少个作品

let maxNum: number = 0 // 最多允许获取多少数量，在相关作品、相似作品、大家/关注的新作品页面使用

let debut: boolean = false // 只下载首次登场的作品

let listIsNewMode: boolean = false // 列表页加载模式是否是新版

let tagSearchDataSelector: string = '' // tag 搜索页，储存作品信息的元素

const tagSearchListWrap: string = '.x7wiBV0' //  tag 搜索页，储存作品列表的元素

let tagSearchListSelector: string = '' // tag 搜索页，直接选择作品的选择器

const tagSearchMultipleSelector: string = '._3b8AXEx' // 作品选择器

const tagSearchUgoiraSelector: string = '.AGgsUWZ' // 动图作品的选择器

let tagSearchNewHtml: string = '' // tag 搜索页作品的html

// tag 搜索页作品的html中的多图标识
const xzMultipleHtml: string = `<div class="${tagSearchMultipleSelector.replace(
  '.',
  ''
)}"><span><span class="XPwdj2F"></span>xz_pageCount</span></div>`

// tag 搜索页作品的html中的动图标识
const xzUgoiraHtml: string = `<div class="${tagSearchUgoiraSelector.replace(
  '.',
  ''
)}"></div>`

let gifWorkerUrl: string = ''

let rightButton: HTMLDivElement = document.createElement('div') // 右侧按钮

let centerPanel: HTMLDivElement = document.createElement('div') // 中间设置面板

let centerBtnWrap: HTMLDivElement // 中间插入按钮的区域

let downloadBarList: NodeListOf<HTMLDivElement> // 下载队列的dom元素

let downloadThread: number // 下载线程

let downloadStarted: boolean = false // 下载是否已经开始

let downloaded: number = 0 // 已下载的文件

let downloadStop: boolean = false // 是否停止下载

let downloadPause: boolean = false // 是否暂停下载

let reTryTimer: number = 0 // 重试下载的定时器

let titleTimer: number // 修改 title 的定时器

let downloadTime: number = 0 // 向浏览器发送下载任务的时间戳

const timeInterval: number = 200 // 设置向浏览器发送下载任务的间隔时间。如果在很短时间内让浏览器建立大量下载任务，有一些下载任务就会丢失，所以设置这个参数。

let downRelated: boolean = false // 是否下载相关作品（作品页内的）

/*
-1 抓取新作品
0 不设置抓取方向
1 抓取旧作品
*/
let downDirection: number = 0 // 抓取方向，在作品页内指示抓取新作品还是旧作品

let downRecommended: boolean = false // 是否下载推荐作品（收藏页面下方）

let viewerWarpper: HTMLDivElement // 图片列表的容器

let viewerUl: HTMLUListElement // 图片列表的 ul 元素

let myViewer: Viewer // 查看器

let quickBookmarkEl: HTMLAnchorElement // 快速收藏的元素

let xzForm: XzForm // 设置面板的表单

let xzTipEl: HTMLDivElement // 用于显示提示的元素

// 储存页面上可以用作文件名的信息
let pageInfo: PageInfo = new PageInfoClass()

let onlyDownBmk: boolean = false // 是否只下载收藏的作品

let ratioType: string = '0' // 宽高比例的类型

// 用正则过滤不安全的字符，（Chrome 和 Windows 不允许做文件名的字符）
// 安全的文件名
const safeFileName = new RegExp(
  /[\u0001-\u001f\u007f-\u009f\u00ad\u0600-\u0605\u061c\u06dd\u070f\u08e2\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u206f\ufdd0-\ufdef\ufeff\ufff9-\ufffb\ufffe\uffff\\\/:\?"<>\*\|~]/g
)
// 安全的文件夹名，允许斜线 /
const safeFolderName = new RegExp(
  /[\u0001-\u001f\u007f-\u009f\u00ad\u0600-\u0605\u061c\u06dd\u070f\u08e2\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u206f\ufdd0-\ufdef\ufeff\ufff9-\ufffb\ufffe\uffff\\:\?"<>\*\|~]/g
)

let canStartTime: number = 0 // 在此时间之后允许点击开始下载按钮

let langType: number // 语言类型

// 处理和脚本版的冲突
function checkConflict(): void {
  // 标注自己
  window.sessionStorage.setItem('xz_pixiv_extension', '1')
  // 把脚本版的标记设置为 0，这样脚本版就不会运行
  window.sessionStorage.setItem('xz_pixiv_userscript', '0')
}

// 设置语言类型
function setLangType() {
  const userLang = document.documentElement.lang // 获取语言标识

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
}

// xianzun_lang_translate 翻译
function xzlt(name: keyof typeof xzLang, ...arg: string[]) {
  let content = xzLang[name][langType]
  arg.forEach(val => (content = content.replace('{}', val)))
  return content
}

// 添加 css 样式
async function addStyle() {
  // 把 css 样式的文本插入到页面里
  const add = function(text: string) {
    const styleE = document.createElement('style')
    styleE.textContent = text
    document.body.appendChild(styleE)
  }
  // 加载 viewerjs 的样式，不需要同步加载
  fetch(chrome.extension.getURL('style/viewer.min.css'))
    .then(res => {
      return res.text()
    })
    .then(text => {
      add(text)
    })

  // 加载本程序的样式，需要同步加载，之后再创建下载器的 DOM 元素
  const styleFile = await fetch(chrome.extension.getURL('style/xzstyle.css'))
  const styleContent = await styleFile.text()
  add(styleContent)
}

// 添加 js 文件
async function addJs() {
  // 添加 zip 的 worker
  let zipWorker = await fetch(chrome.extension.getURL('lib/z-worker.js'))
  const zipWorkerBolb = await zipWorker.blob()
  const zipWorkerUrl = URL.createObjectURL(zipWorkerBolb)
  if (zip) {
    zip.workerScripts = {
      inflater: [zipWorkerUrl]
    }
  }
  // 添加 gif 的 worker
  let gifWorker = await fetch(chrome.extension.getURL('lib/gif.worker.js'))
  const gifWorkerBolb = await gifWorker.blob()
  gifWorkerUrl = URL.createObjectURL(gifWorkerBolb)
}

// 显示最近更新
function showWhatIsNew(tag: keyof typeof xzLang) {
  if (!window.location.host.includes('pixiv.net')) {
    return false
  }
  if (!window.localStorage.getItem(tag)) {
    const whatIsNewHtml = `
<div class="xz_new">
  <p class="title">Pixiv Batch Downloader ${xzlt('_最近更新')}</p>
  <p class="content">${xzlt(tag)}</p>
  <button class="btn">${xzlt('_确定')}</button>
</div>`
    document.body.insertAdjacentHTML('afterbegin', whatIsNewHtml)
    const whatIsNewEl = document.querySelector('.xz_new')!
    whatIsNewEl.querySelector('.btn')!.addEventListener('click', () => {
      window.localStorage.setItem(tag, '1')
      whatIsNewEl.parentNode!.removeChild(whatIsNewEl)
    })
  }
}

// 检查新版本
async function update() {
  // 显示更新按钮
  const show = function() {
    const updateIco = document.querySelector(
      '.centerWrap_top_btn.update'
    )! as HTMLAnchorElement
    updateIco.style.display = 'inline-block'
  }

  // 读取上一次检查的时间，如果超过一小时则检查 GitHub 上的信息
  const lastTime = localStorage.getItem('xzUpdateTime')
  if (!lastTime || new Date().getTime() - parseInt(lastTime) > 60 * 60 * 1000) {
    // 获取最新的 releases 信息
    const latest = await fetch(
      'https://api.github.com/repos/xuejianxianzun/PixivBatchDownloader/releases/latest'
    )
    const latestJson = await latest.json()
    const latestVer = latestJson.name
    // 保存 GitHub 上的版本信息
    localStorage.setItem('xzGithubVer', latestVer)
    // 保存本次检查的时间戳
    localStorage.setItem('xzUpdateTime', new Date().getTime().toString())
  }

  // 获取本地扩展的版本号
  const manifest = await fetch(chrome.extension.getURL('manifest.json'))
  const manifestJson = await manifest.json()
  const manifestVer = manifestJson.version
  // 比较大小
  const latestVer = localStorage.getItem('xzGithubVer')
  if (latestVer && manifestVer < latestVer) {
    show()
  }
}

// 获取 token
function getToken() {
  // 从含有 globalInitData 信息的脚本里，匹配 token 字符串
  const regToken = document.head.innerHTML.match(/token: "(\w+)"/)
  if (regToken && regToken.length > 0) {
    return regToken[1]
  }

  // 从保存 token 的 input 获取
  const tokenInput: HTMLInputElement = document.querySelector(
    'input[name="tt"]'
  ) as HTMLInputElement
  if (tokenInput) {
    return tokenInput.value
  }

  return ''
}

// 快速收藏
function quickBookmark() {
  const tt = getToken()

  if (!tt) {
    // 如果获取不到 token，则不展开本程序的快速收藏功能
    return false
  }

  // 因为切换作品（pushstate）时，不能准确的知道 toolbar 何时更新，所以只能不断检测
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
    quickBookmarkEl = document.querySelector(
      '#quickBookmarkEl'
    ) as HTMLAnchorElement

    // 如果没有 quick 元素则添加
    if (!quickBookmarkEl) {
      // 创建快速收藏元素
      quickBookmarkEl = document.createElement('a')
      quickBookmarkEl.id = 'quickBookmarkEl'
      quickBookmarkEl.innerHTML = '✩'
      quickBookmarkEl.href = 'javascript:void(0)'
      quickBookmarkEl.title = xzlt('_快速收藏')
      toolbar.insertBefore(quickBookmarkEl, toolbar.childNodes[3])
      // 隐藏原来的收藏按钮并检测收藏状态
      const orgIcon = toolbar.childNodes[2] as HTMLDivElement
      orgIcon.style.display = 'none'
      const heart = orgIcon.querySelector('svg')!
      if (window.getComputedStyle(heart)['fill'] === 'rgb(255, 64, 96)') {
        // 如果已经收藏过了
        quickBookmarkEnd()
      } else {
        // 准备快速收藏
        readyQuickBookmark()
      }
    } else {
      // 如果有 quick 元素，什么都不做
      return false
    }
  }
}

// 准备快速收藏
function readyQuickBookmark() {
  quickBookmarkEl.addEventListener('click', () => {
    ;(document.querySelector('._35vRH4a')! as HTMLButtonElement).click() // 自动点赞
    // 储存 tag
    const tagElements = document.querySelectorAll('._1LEXQ_3 li')
    const tagArray = Array.from(tagElements).map(el => {
      const nowA = el.querySelector('a')
      if (nowA) {
        let nowTag = nowA.textContent
        // 对于原创作品，非日文的页面上只显示了用户语言的“原创”，替换成日文 tag “オリジナル”。
        if (nowTag === '原创' || nowTag === 'Original' || nowTag === '창작') {
          nowTag = 'オリジナル'
        }
        return nowTag
      }
    })
    const tagString = encodeURI(tagArray.join(' '))

    // 调用添加收藏的 api
    addBookmark(getIllustId(), tagString, getToken(), false)
      .then(response => response.json())
      .then(data => {
        if (data.error !== undefined && data.error === false) {
          quickBookmarkEnd()
        }
      })
  })
}

// 如果这个作品已收藏，则改变样式
function quickBookmarkEnd() {
  quickBookmarkEl.style.color = '#FF4060'
  quickBookmarkEl.href = `/bookmark_add.php?type=illust&illust_id=${getIllustId()}`
}

// 添加收藏
async function addBookmark(
  id: string,
  tags: string,
  tt: string,
  hide: boolean
) {
  let restrict: number
  if (!hide) {
    // 公开作品
    restrict = 0
  } else {
    // 非公开作品
    restrict = 1
  }

  return fetch('https://www.pixiv.net/rpc/index.php', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    credentials: 'same-origin', // 附带 cookie
    body: `mode=save_illust_bookmark&illust_id=${id}&restrict=${restrict}&comment=&tags=${tags}&tt=${tt}`
  })
}

// 获取未分类书签的 tag 信息
function getInfoFromBookmark(url: string) {
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
          )!.textContent = `× permission denied`
        }
        throw new Error(response.status.toString())
      }
    })
    .then(data => {
      const works = data.body.works
      const result: BookmarkResult[] = []

      if (works.length > 0 && works[0].bookmarkData) {
        // 判断作品的 bookmarkData，如果为假说明这是在别人的收藏页面，不再获取数据。
        works.forEach((data: BookmarkData) => {
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
async function readyAddTag() {
  // 公开的未分类收藏
  const show = `https://www.pixiv.net/ajax/user/${getUserId()}/illusts/bookmarks?tag=${encodeURI(
    '未分類'
  )}&offset=0&limit=999999&rest=show&rdm=${Math.random()}`
  // 非公开的未分类收藏
  const hide = `https://www.pixiv.net/ajax/user/${getUserId()}/illusts/bookmarks?tag=${encodeURI(
    '未分類'
  )}&offset=0&limit=999999&rest=hide&rdm=${Math.random()}`

  let addList: BookmarkResult[] = [] // 需要添加 tag 的作品列表
  const addTagBtn = document.getElementById('add_tag_btn')!

  addList = addList.concat(await getInfoFromBookmark(show))
  addList = addList.concat(await getInfoFromBookmark(hide))
  if (addList.length === 0) {
    addTagBtn.textContent = `√ no need`
    return false
  } else {
    // 控制添加 tag 任务的并行数量，防止并发数太多导致网络阻塞
    const tt = getToken()
    addTag(0, addList, tt, addTagBtn)
  }
}

// 给未分类作品添加 tag
async function addTag(
  index: number,
  addList: BookmarkResult[],
  tt: string,
  addTagBtn: HTMLElement
) {
  const item: BookmarkResult = addList[index] as BookmarkResult
  await addBookmark(item.id, item.tags, tt, item.restrict)
  if (index < addList.length - 1) {
    index++
    addTagBtn.textContent = `${index} / ${addList.length}`
    // 继续添加下一个
    addTag(index, addList, tt, addTagBtn)
  } else {
    addTagBtn.textContent = `√ complete`
  }
}

// 解压 zip 文件
async function readZip(
  zipFile: any,
  ugoiraInfo: UgoiraInfo
): Promise<string[]> {
  return new Promise(function(resolve, reject) {
    zip.createReader(
      new zip.BlobReader(zipFile),
      (zipReader: any) => {
        // 读取成功时的回调函数，files 保存了文件列表的信息
        zipReader.getEntries((files: object[]) => {
          // 创建数组，长度与文件数量一致
          const imgFile = new Array(files.length)
          // 获取每个文件的数据。因为这个操作是异步的，所以必须检查图片数量
          files.forEach((file: any) => {
            file.getData(
              new zip.Data64URIWriter(ugoiraInfo.mimeType),
              (data: string) => {
                const fileNo = parseInt(file.filename)
                imgFile[fileNo] = data
                // 把图片按原编号存入对应的位置。这是因为我怀疑有时候 zip.Data64URIWriter 的回调顺序不一致，直接 push 可能导致图片的顺序乱掉
                for (let i = 0; i < imgFile.length; i++) {
                  // 检测到空值说明没有添加完毕，退出循环
                  if (!imgFile[i]) {
                    break
                  }
                  // 如果检查到最后一项，说明添加完毕
                  if (i === imgFile.length - 1) {
                    resolve(imgFile)
                  }
                }
              }
            )
          })
        })
      },
      (message: any) => {
        addOutputInfo('error: readZIP error.')
        reject(new Error('readZIP error: ' + message))
      }
    )
  })
}

// 添加每一帧的数据
async function getFrameData(
  imgFile: string[],
  type: string = 'webm'
): Promise<HTMLCanvasElement[] | HTMLImageElement[]> {
  const resultList = new Array(imgFile.length)
  return new Promise(function(resolve, reject) {
    const drawImg = function(index: number) {
      const img = new Image()

      img.onload = function(event) {
        // 处理视频
        if (type === 'webm') {
          const xzCanvas = document.createElement('canvas')
          const ctx = xzCanvas.getContext('2d')!
          xzCanvas.width = img.width
          xzCanvas.height = img.height
          ctx.drawImage(img, 0, 0)
          resultList[index] = xzCanvas
        }
        // 处理 gif
        if (type === 'gif') {
          resultList[index] = img
        }

        // 继续下一个
        if (index < imgFile.length - 1) {
          index++
          drawImg(index)
        } else {
          resolve(resultList)
        }
      }

      img.src = imgFile[index]
    }

    // onload 完成时的顺序和添加事件时的顺序不一致，为了避免图片顺序乱掉，这里逐个添加每个图片
    drawImg(0)
  })
}

// 编码视频
async function encodeVideo(encoder: any) {
  return new Promise(function(resolve, reject) {
    encoder.compile(false, function(video: Blob) {
      resolve(video)
    })
  })
}

// 初始化图片查看器
function newViewer(pageCount: number, firsturl: string) {
  // 因为选项里的 size 是枚举类型，所以在这里也要定义一个枚举
  enum ToolbarButtonSize {
    Small = 'small',
    Medium = 'medium',
    Large = 'large'
  }

  myViewer = new Viewer(viewerUl, {
    toolbar: {
      zoomIn: 0,
      zoomOut: 0,
      oneToOne: 1,
      reset: 0,
      prev: 1,
      play: {
        show: 0,
        size: ToolbarButtonSize.Large
      },
      next: 1,
      rotateLeft: 0,
      rotateRight: 0,
      flipHorizontal: 0,
      flipVertical: 0
    },

    url(image: HTMLImageElement) {
      return image.dataset.src!
    },

    viewed(event) {
      // 当图片显示完成（加载完成）后，预加载下一张图片
      const ev = event || window.event
      let index = ev.detail.index

      if (index < pageCount - 1) {
        index++
      }

      const nextImg = firsturl.replace('p0', 'p' + index)
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
}

// 初始化图片查看器
function initViewer() {
  // 检查图片查看器元素是否已经生成
  if (!document.getElementById('viewerWarpper')) {
    createViewer()
    return false
  } else {
    // 更新数据
    updateViewer()
  }
}

// 创建图片查看器 html 元素，并绑定一些事件，这个函数只会在初始化时执行一次
function createViewer() {
  if (!document.querySelector('main figcaption')) {
    // 等到作品主体部分的元素生成之后再创建查看器
    setTimeout(() => {
      createViewer()
    }, 300)
    return false
  }

  // 查看器图片列表元素的结构： div#viewerWarpper > ul > li > img
  viewerWarpper = document.createElement('div')
  viewerWarpper.id = 'viewerWarpper'
  viewerUl = document.createElement('ul')
  viewerWarpper.appendChild(viewerUl)
  document
    .querySelector('main figcaption')!
    .insertAdjacentElement('beforebegin', viewerWarpper)

  // 图片查看器显示之后
  viewerUl.addEventListener('shown', () => {
    // 显示相关元素
    showViewerOther()

    // 点击 1：1 按钮时，全屏查看
    document
      .querySelector('.viewer-one-to-one')!
      .addEventListener('click', () => {
        hideViewerOther() // 隐藏查看器的其他元素
        // 进入全屏
        document.body.requestFullscreen()

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
        ;(document.querySelector('.viewer-one-to-one') as HTMLLIElement).click()
      }, 50)
    }
  })

  // 隐藏查看器时，如果还处于全屏，则退出全屏
  viewerUl.addEventListener('hidden', () => {
    if (isFullscreen()) {
      document.exitFullscreen()
    }
  })

  // esc 退出图片查看器
  document.addEventListener('keyup', event => {
    const e = event || window.event
    if (e.keyCode === 27) {
      // 按下 esc
      // 如果非全屏，且查看器已经打开，则退出查看器
      if (!isFullscreen() && viewerIsShow()) {
        ;(document.querySelector('.viewer-close') as HTMLDivElement).click()
      }
    }
  })

  void [
    'fullscreenchange',
    'webkitfullscreenchange',
    'mozfullscreenchange'
  ].forEach(arg => {
    // 检测全屏状态变化，目前有兼容性问题（这里也相当于绑定了按 esc 退出的事件）
    document.addEventListener(arg, () => {
      // 退出全屏
      if (!isFullscreen()) {
        showViewerOther()
      }
    })
  })

  updateViewer()
}

// 根据作品信息，更新图片查看器配置。每当页面更新时执行一次
function updateViewer() {
  viewerWarpper.style.display = 'none' // 先隐藏 viewerWarpper

  // 获取作品信息
  fetch('https://www.pixiv.net/ajax/illust/' + getIllustId(), {
    method: 'get',
    credentials: 'same-origin' // 附带 cookie
  })
    .then(response => response.json())
    .then((data: IllustData) => {
      const thisOneData = data.body
      pageInfo.p_user = thisOneData.userName
      pageInfo.p_uid = thisOneData.userId
      // 更新图片查看器
      if (thisOneData.illustType === 0 || thisOneData.illustType === 1) {
        // 插画或漫画
        if (thisOneData.pageCount > 1) {
          // 有多张图片时，创建缩略图
          const { thumb, original } = thisOneData.urls
          viewerUl.innerHTML = new Array(thisOneData.pageCount)
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
          newViewer(thisOneData.pageCount, original)

          // 预加载第一张图片
          const img = new Image()
          img.src = original
        }
      }
    })
}

// 隐藏查看器的其他元素
function hideViewerOther() {
  document.querySelector('.viewer-container')!.classList.add('black-background')
  // 隐藏底部的其他元素，仍然显示左右切换按钮
  const close = document.querySelector('.viewer-close') as HTMLDivElement
  const oneToOne = document.querySelector(
    '.viewer-one-to-one'
  ) as HTMLDivElement
  const navbar = document.querySelector('.viewer-navbar') as HTMLDivElement
  for (const element of [close, oneToOne, navbar]) {
    element.style.display = 'none'
  }
}

// 显示查看器的其他元素
function showViewerOther() {
  document
    .querySelector('.viewer-container')!
    .classList.remove('black-background')
  // 显示底部隐藏的元素
  const close = document.querySelector('.viewer-close') as HTMLDivElement
  const oneToOne = document.querySelector(
    '.viewer-one-to-one'
  ) as HTMLDivElement
  const navbar = document.querySelector('.viewer-navbar') as HTMLDivElement
  for (const element of [close, oneToOne, navbar]) {
    element.style.display = 'block'
  }
}

// 在图片100%显示时，使其居中
function setViewerCenter() {
  // 获取图片宽高
  const imgInfo = document.querySelector('.viewer-title')!.textContent

  // 如果图片尚未加载出来的话，就没有内容，就过一会儿再执行
  if (!imgInfo) {
    setTimeout(() => {
      setViewerCenter()
    }, 200)
    return false
  }

  const [imgWidth, imgHeight] = /\d{1,5} × \d{1,5}/
    .exec(imgInfo)![0]
    .split(' × ')
  // > '66360324_p5_master1200.jpg (919 × 1300)'
  // < ["919", "1300"]

  myViewer.zoomTo(1)

  // 获取网页宽高
  const htmlWidth = document.documentElement.clientWidth
  const htmlHeight = document.documentElement.clientHeight

  // 设置边距
  const setWidth = (htmlWidth - parseInt(imgWidth)) / 2
  let setHeight = (htmlHeight - parseInt(imgHeight)) / 2

  // 当图片高度大于浏览器窗口高度时，居顶显示而不是居中
  if (setHeight < 0) {
    setHeight = 0
  }

  myViewer.moveTo(setWidth, setHeight)
}

// 判断是否处于全屏状态
function isFullscreen() {
  return !!document.fullscreenElement
}

// 判断看图器是否处于显示状态
function viewerIsShow() {
  const viewerContainer = document.querySelector('.viewer-container')

  if (viewerContainer) {
    return viewerContainer.classList.contains('viewer-in')
  } else {
    return false
  }
}

// 检查标题里有没有包含本程序定义的状态字符
function titleHasStatus(status: string = '') {
  const titleStatus = [
    '[0]',
    '[↑]',
    '[→]',
    '[▶]',
    '[↓]',
    '[║]',
    '[■]',
    '[√]',
    '[ ]'
  ]

  if (!status) {
    // 没有传递 status，则检查所有标记
    for (const str of titleStatus) {
      if (document.title.includes(str)) {
        return true
      }
    }
  } else {
    // 检查指定标记
    return document.title.includes(status)
  }

  return false
}

// 重设 title
function resetTitle() {
  clearInterval(titleTimer)
  // 储存标题的 mete 元素。在某些页面不存在，有时也与实际上的标题不一致。
  const ogTitle = document.querySelector(
    'meta[property="og:title"]'
  )! as HTMLMetaElement
  // 无刷新自动加载的页面里，og:title 标签是最早更新标题的，内容也一致。
  if (ogTitle && (pageType == 1 || pageType === 2)) {
    document.title = ogTitle.content
  } else {
    // 如果当前 title 里有状态提醒，则设置为状态后面的文字
    if (titleHasStatus()) {
      const index = document.title.indexOf(']')
      document.title = document.title.substr(index + 1, document.title.length)
    }
  }
}

// 修改title
function changeTitle(string: string) {
  // 工作时，本程序的状态会以 [string] 形式添加到 title 最前面，并闪烁提醒
  /*
  0 不显示在标题上，它是把标题复原的信号
  ↑ 抓取中
  → 等待下一步操作（tag搜索页）
  ▶  准备下载
  ↓ 下载中
  ║ 下载暂停
  ■ 下载停止
  √ 下载完毕
  */

  // 重设 title
  if (string === '0') {
    resetTitle()
    return
  }

  const status = `[${string}]`
  // 如果 title 里没有状态，就添加状态
  if (!titleHasStatus()) {
    document.title = `${status} ${document.title}`
  } else {
    // 如果已经有状态了，则替换为新当前传入的状态
    document.title = document.title.replace(/\[.?\]/, status)
  }

  // 当需要执行下一步操作时，闪烁提醒
  if (string === '▶' || string === '→') {
    titleTimer = setInterval(function() {
      if (titleHasStatus(status)) {
        document.title = document.title.replace(status, '[ ]')
      } else {
        document.title = document.title.replace('[ ]', status)
      }
    }, 500)
  } else {
    clearInterval(titleTimer)
  }
}

// 将元素插入到页面顶部
/*
大部分页面使用 header，文章页使用 root。因为在文章页执行时，可能获取不到 header.
newindex-inner 是在未登录时的画师作品列表页面使用的
layout-body 是在未登录时的 tag 搜索页使用的
*/
function insertToHead(el: Element) {
  ;(
    document.querySelector('#root>*') ||
    document.querySelector('header')! ||
    document.querySelector('.newindex-inner')! ||
    document.querySelector('.layout-body')!
  ).insertAdjacentElement('beforebegin', el)
}

// 创建用于输出信息的区域
function insertOutputInfo() {
  if (document.getElementById('outputArea') === null) {
    outputArea = document.createElement('div')
    outputArea.id = 'outputArea'
    insertToHead(outputArea)
  }
}

// 添加输出信息
function addOutputInfo(val: string) {
  if (!outputArea) {
    insertOutputInfo()
  }
  outputArea.innerHTML += val
}

// 检查输入的参数是否有效，要求大于 0 的数字
function checkNumberGreater0(arg: string) {
  let thisArg = parseInt(arg)
  // 空值会是 NaN
  if (!isNaN(thisArg) && thisArg > 0) {
    // 符合条件
    return {
      result: true,
      value: thisArg
    }
  }
  // 不符合条件
  return {
    result: false,
    value: 0
  }
}

// 获取排除类型
function getNotDownType() {
  return Array.from(xzForm.querySelectorAll('.xzFormP5 input')).reduce(
    (result, el, index) => {
      const thisElement = el as HTMLInputElement
      if (thisElement.checked === false) {
        return (result += index)
      } else {
        return result
      }
    },
    ''
  )
}

// 检查排除作品类型的参数是否合法
function checkNotDownType() {
  notdownType = getNotDownType()

  // 如果全部排除则取消任务
  if (notdownType.includes('012')) {
    // notdownType 的结果是顺序的，所以可以直接查找 012
    window.alert(xzlt('_checkNotdownTypeResult1弹窗'))
    addOutputInfo('<br>' + xzlt('_checkNotdownTypeResult1Html') + '<br><br>')
    return false
  }

  // 排除了至少一种时，显示提示
  if (
    notdownType.includes('0') ||
    notdownType.includes('1') ||
    notdownType.includes('2')
  ) {
    addOutputInfo(
      '<br>' +
        xzlt('_checkNotdownTypeResult3Html') +
        notdownType
          .replace('0', xzlt('_插画'))
          .replace('1', xzlt('_漫画'))
          .replace('2', xzlt('_动图'))
    )
  }
}

// 检查是否设置了作品张数限制
function checkImgDownloadNumber() {
  const checkResult = checkNumberGreater0(xzForm.setPNo.value)

  if (checkResult.result) {
    imgNumberPerWork = checkResult.value
    addOutputInfo('<br>' + xzlt('_作品张数提醒', imgNumberPerWork.toString()))
  } else {
    imgNumberPerWork = 0
  }
}

// 获取要排除的tag
function getNotNeedTag() {
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
function getNeedTag() {
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

// 检查作品是否符合排除 tag 的条件, 只要作品包含其中一个就排除。返回值表示是否要排除这个作品。
function checkNotNeedTag(tags: string[]) {
  let result = false

  // 如果设置了排除 tag
  if (notNeedTag.length > 0) {
    for (const tag of tags) {
      if (result) {
        break
      }
      for (const notNeed of notNeedTag) {
        if (tag.toLowerCase() === notNeed.toLowerCase()) {
          result = true
          break
        }
      }
    }
  }

  return result
}

// 检查作品是否符合包含 tag 的条件, 如果设置了多个 tag，需要作品里全部包含。返回值表示是否保留这个作品。
function checkNeedTag(tags: string[]) {
  let result = false

  // 如果设置了必须的 tag
  if (needTag.length > 0) {
    let tagNeedMatched = 0
    const tempTags = new Set()
    // 如果不区分大小写的话，Fate/grandorder 和 Fate/GrandOrder 会被算作符合两个 tag，所以用 Set 结构去重。测试 id 51811780
    for (const tag of tags) {
      tempTags.add(tag.toLowerCase())
    }

    for (const tag of tempTags) {
      for (const need of needTag) {
        if (tag === need.toLowerCase()) {
          tagNeedMatched++
          break
        }
      }
    }

    // 如果全部匹配
    if (tagNeedMatched >= needTag.length) {
      result = true
    }
  } else {
    result = true
  }

  return result
}

// 检查过滤宽高的设置
function checkSetWh() {
  const checkResultWidth = checkNumberGreater0(xzForm.setWidth.value)
  const checkResultHeight = checkNumberGreater0(xzForm.setHeight.value)

  // 宽高只要有一个条件大于 0 即可
  if (checkResultWidth.value > 0 || checkResultHeight.value > 0) {
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
function checkSetWhok(width: number, height: number) {
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

// 检查是否设置了收藏数要求
function checkSetBmk() {
  const checkResult = checkNumberGreater0(xzForm.setFavNum.value)

  if (checkResult.result) {
    isSetFilterBmk = checkResult.result
    filterBmk = checkResult.value
    if (pageType !== 5) {
      addOutputInfo(
        '<br>' + xzlt('_设置了筛选收藏数之后的提示文字') + filterBmk
      )
    }
  }

  return true
}

// 检查是否设置了只下载书签作品
function checkOnlyBmk() {
  onlyDownBmk = xzForm.setOnlyBmk.checked
  if (onlyDownBmk) {
    addOutputInfo('<br>' + xzlt('_只下载已收藏的提示'))
  }
}

// 检查作品是否符合【只下载书签作品】的条件,返回值 true 表示包含这个作品
function checkOnlyDownBmk(bookmarked: boolean) {
  // 如果设置了只下载书签作品
  if (onlyDownBmk) {
    if (!bookmarked) {
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}

// 检查用户输入的页数设置，并返回提示信息
function checkWantPageInput(
  errorTip: string,
  start1Tip: string,
  start2Tip: string
) {
  const temp = parseInt(xzForm.setWantPage.value)

  // 如果比 1 小，并且不是 -1，则不通过
  if ((temp < 1 && temp !== -1) || isNaN(temp)) {
    // 比 1 小的数里，只允许 -1 , 0 也不行
    addOutputInfo(errorTip)
    return false
  }

  if (temp >= 1) {
    wantPage = temp
    addOutputInfo(start1Tip.replace('-num-', wantPage.toString()))
    return true
  } else if (temp === -1) {
    wantPage = temp
    addOutputInfo(start2Tip)
    return true
  }

  return false
}

// 获取宽高比的设置
function getRatioSetting() {
  ratioType = xzForm.ratio.value

  // 不限制
  if (ratioType === '0') {
    return false
  }

  // 由用户输入
  if (ratioType === '3') {
    const typeNum = parseFloat(xzForm.userRatio.value)
    if (isNaN(typeNum)) {
      ratioType = '0'
      xzForm.ratio.value = ratioType
      window.alert(xzlt('_宽高比必须是数字'))
      return false
    }
  }

  if (ratioType === '1') {
    addOutputInfo('<br>' + xzlt('_设置了宽高比之后的提示', xzlt('_横图')))
  } else if (ratioType === '2') {
    addOutputInfo('<br>' + xzlt('_设置了宽高比之后的提示', xzlt('_竖图')))
  } else {
    addOutputInfo(
      '<br>' +
        xzlt(
          '_设置了宽高比之后的提示',
          xzlt('_输入宽高比') + xzForm.userRatio.value
        )
    )
  }

  return true
}

// 检查作品是否符合宽高比条件
function checkRatio(width: number, height: number) {
  if (ratioType === '0') {
    return true
  } else if (ratioType === '1') {
    return width / height > 1
  } else if (ratioType === '2') {
    return width / height < 1
  } else {
    return width / height >= parseFloat(xzForm.userRatio.value)
  }
}

// 设置要下载的个数
function setRequsetNum() {
  maxNum = 500 // 设置最大允许获取多少个作品。相似作品的这个数字是可以改的，可以比 500 更大，这里只是一个预设值。

  const result = checkNumberGreater0(xzForm.setWantPage.value)

  if (result.result) {
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

// 设置最多有多少页，在 pageType 10 使用
function setMaxNum() {
  // 其实这个条件和条件 2 在一定程度上是重合的，所以这个必须放在前面
  if (locUrl.includes('bookmark_new_illust')) {
    maxNum = 100 // 关注的人的新作品（包含普通版和 r18 版）的最大页数都是 100
  } else if (locUrl.includes('new_illust.php')) {
    maxNum = 1000 // 大家的新作品（普通版）的最大页数是 1000
  } else if (locUrl.includes('new_illust_r18.php')) {
    maxNum = 500 // 大家的的新作品（r18版）的最大页数是 500
  }
}

// 获取当前页面的页码，在 tag 搜索页和 大家/关注的新作品页面使用
function getNowPageNo() {
  // 如果显示有页码，以当前页的页码为起始页码
  if (document.querySelector('.page-list .current')) {
    startpageNo = parseInt(
      document.querySelector('.page-list .current')!.textContent!
    )
  } else {
    // 否则认为只有1页
    startpageNo = 1
  }

  listPageFinished = 0
}

// 使用无刷新加载的页面需要监听 url 的改变，在这里监听页面的切换
function listenHistory() {
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
}

// 获取作品页信息出错时的处理
function illustError(url: string) {
  if (pageType === 1 && !downRelated) {
    addOutputInfo('<br>' + xzlt('_无权访问1', url) + '<br>')
    // 在作品页内下载时，设置的wantPage其实是作品数
    if (wantPage > 0) {
      wantPage--
    }
    // 在作品页内下载时，如果出现了无法访问的作品时，就获取不到接下来的作品了，直接结束。
    crawFinished()
  } else {
    addOutputInfo('<br>' + xzlt('_无权访问2', url) + '<br>')
    // 跳过当前作品
    if (illustUrlList.length > 0) {
      // 如果存在下一个作品，则
      getIllustData()
    } else {
      // 没有剩余作品
      ajaxThreadsFinished++
      if (ajaxThreadsFinished === ajaxForIllustThreads) {
        // 如果所有并发请求都执行完毕，复位
        ajaxThreadsFinished = 0
        crawFinished()
      }
    }
  }
}

// 根据对象的属性排序
function sortByProperty(propertyName: string) {
  // 排序的内容有时可能是字符串，需要转换成数字排序
  return function(object1: any, object2: any) {
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
function listSort() {
  tagSearchResult.sort(sortByProperty('num'))
  const listWrap = document.querySelector(tagSearchListWrap)!
  listWrap.innerHTML = ''
  tagSearchResult.forEach(data => {
    listWrap.insertAdjacentHTML('beforeend', data.e)
  })
}

// tag搜索页的筛选任务执行完毕
function tagSearchPageFinished() {
  allowWork = true
  tagPageFinished = 0 // 重置已抓取的页面数量
  listSort()
  changeTitle('→')
}

// 获取 tag 搜索列表里的可见作品
function visibleList() {
  const list: NodeListOf<HTMLDivElement> = document.querySelectorAll(
    tagSearchListSelector
  )
  return Array.from(list).filter(el => {
    let element = el as HTMLDivElement
    return element.style.display !== 'none'
  })
}

// 删除 DOM 元素
function removeEl(el: NodeListOf<Element> | HTMLElement) {
  if (Reflect.has(el, 'length')) {
    // 如果有 length 属性则循环删除。
    ;(el as NodeListOf<Element>).forEach(el => el.parentNode!.removeChild(el))
  } else {
    // 没有 length 属性的直接删除（querySelector 的返回值是 HTMLElement）
    ;(el as HTMLElement).parentNode!.removeChild(el as HTMLElement)
  }
}

// 切换显示 DOM 元素
function toggle(el: HTMLElement) {
  el.style.display = el.style.display === 'block' ? 'none' : 'block'
}

// 显示调整后，列表里的作品数量。仅在 tag 搜索页和发现页面中使用
function outputNowResult() {
  addOutputInfo(xzlt('_调整完毕', visibleList().length.toString()) + '<br>')
}

// 添加每个图片的信息。某些参数允许传空值
/*
   id - 图片是 id + 序号，如 44920385_p0。动图只有 id
   url - 图片的 url
   title - 作品的标题
   tags - 作品的 tag 列表
   tagsTranslated - 作品的 tag 列表，附带翻译后的 tag（如果有）
   user - 作品的画师名字
   userid - 作品的画师id
   fullWidth - 图片的宽度
   fullHeight - 图片的高度
   ext - 图片的后缀名
   bmk - 作品的收藏数量
   date - 作品的创建日期，格式为 yyyy-MM-dd。如 2019-08-29
   type - 作品的类型，分为插画/漫画/动图
   rank - 在排行榜页面使用，保存图片的排名
   ugoiraInfo - 当作品是动图时才有值，包含 frames（数组）和 mimeType（string）属性
   */
function addImgInfo(
  id: string,
  url: string,
  title: string,
  tags: string[],
  tagsTranslated: string[],
  user: string,
  userid: string,
  fullWidth: number,
  fullHeight: number,
  ext: string,
  bmk: number,
  date: string,
  type: number,
  rank: string,
  ugoiraInfo: UgoiraInfo
) {
  imgInfo.push({
    id,
    url,
    title,
    tags,
    tagsTranslated,
    user,
    userid,
    fullWidth,
    fullHeight,
    ext,
    bmk,
    date,
    type,
    rank,
    ugoiraInfo
  })
}

// 启动抓取
function startGet() {
  if (!allowWork || downloadStarted) {
    window.alert(xzlt('_当前任务尚未完成1'))
    return false
  }

  insertOutputInfo()

  downloadPanelDisplay('none')

  // 设置要获取的作品数或页数
  if (pageType === 1) {
    // 作品页内
    if (quickDownload) {
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
    let pageTip = xzlt('_checkWantPageRule1Arg7')
    if (downRecommended) {
      pageTip = xzlt('_checkWantPageRule1Arg11')
    }
    const result = checkWantPageInput(
      xzlt('_checkWantPageRule1Arg2'),
      xzlt('_checkWantPageRule1Arg6'),
      pageTip
    )

    if (!result) {
      return false
    }
  } else if (pageType === 5) {
    // tag 搜索页
    // 去除热门作品一栏
    removeEl(document.querySelectorAll('._premium-lead-popular-d-body'))

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
      xzlt('_tag搜索任务开始', xzForm.setFavNum.value, wantPage.toString())
    )

    // 如果是首次抓取，则移除当前列表。之后会把抓取结果放进来
    if (!listPageFinished) {
      removeEl(document.querySelectorAll(tagSearchListSelector))
    }
  } else if (pageType === 7) {
    // 排行榜页面
    listPageFinished = 0
    // 检查下载页数的设置
    let result = checkWantPageInput(
      xzlt('_checkWantPageRule1Arg2'),
      xzlt('_checkWantPageRule1Arg12'),
      xzlt('_checkWantPageRule1Arg4')
    )
    if (!result) {
      return false
    }

    // 如果设置的作品个数是 -1，则设置为下载所有作品
    if (wantPage === -1) {
      wantPage = 500
    }
  } else if (pageType === 10) {
    // 大家/关注的新作品
    const result = checkNumberGreater0(xzForm.setWantPage.value)

    if (!result.result) {
      window.alert(xzlt('_参数不合法1'))
      return false
    } else if (result.value > maxNum) {
      window.alert(xzlt('_输入超过了最大值') + maxNum)
      return false
    } else {
      wantPage = result.value
      addOutputInfo(xzlt('_任务开始1', wantPage.toString()))
    }
  }

  // 检查是否设置了收藏数要求
  if (!checkSetBmk()) {
    return false
  }

  // 检查是否设置了作品张数限制
  checkImgDownloadNumber()

  // 获取必须包含的tag
  getNeedTag()

  // 获取要排除的tag
  getNotNeedTag()

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

  // 检查是否设置了只下载首次登场
  if (debut) {
    addOutputInfo('<br>' + xzlt('_抓取首次登场的作品Title'))
  }

  // 重置下载状态
  resetResult()

  // 开始执行时，标记任务状态，当前任务结束后才能再启动新任务
  allowWork = false

  // 保存当前的输出信息，新信息将追加在后面
  nowTips = outputArea.innerHTML

  if (pageType === 0) {
    // 在主页通过id抓取时，不需要获取列表页，直接完成
    outputArea.innerHTML = nowTips + xzlt('_开始获取作品页面')
    getListUrlFinished()
  } else if (pageType === 1) {
    // 下载相关作品
    if (downRelated) {
      getListPage()
    } else {
      // 开始获取图片。因为新版作品页切换作品不需要刷新页面了，所以要传递实时的url。
      getIllustData(window.location.href)
    }
  } else if (pageType === 2) {
    if (downRecommended) {
      getRecommendedList()
    } else {
      readyGetListPage()
    }
  } else if (pageType === 6) {
    // 地区排行榜
    getListPage2()
  } else {
    // 普通的开始获取列表页
    getListPage()
  }
}

// 接收 id 列表，然后拼接出作品页面的 url，储存起来。有的地方是直接添加作品页面的 url，就不需要调用这个方法
function addIllustUrlList(arr: string[]) {
  arr.forEach(data => {
    illustUrlList.push(
      'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + data
    )
  })
}

// 获取作品列表页
function getListPage() {
  changeTitle('↑')
  let url = ''
  if (downRelated) {
    // 下载相关作品时
    url =
      'https://www.pixiv.net/ajax/illust/' +
      getIllustId() +
      '/recommend/init?limit=18'
    // 最后的 18 是预加载首屏的多少个作品的信息，和下载并没有关系
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
    const nowIllust = document.querySelectorAll('.QBU8zAz>a') as NodeListOf<
      HTMLAnchorElement
    > // 获取已有作品
    // 拼接作品的 url
    Array.from(nowIllust).forEach(el => {
      // discovery 列表的 url 是有额外后缀的，需要去掉
      illustUrlList.push(el.href.split('&uarea')[0])
    })
    addOutputInfo(
      '<br>' + xzlt('_列表页获取完成2', illustUrlList.length.toString())
    )
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
        throw new Error(response.status.toString())
      }
    })
    .then((data: string) => {
      listPageFinished++
      let listPageDocument
      // 解析网页内容。排行榜和相似作品、相关作品，直接获取 json 数据，不需要这样处理
      if (pageType !== 7 && pageType !== 9 && !downRelated) {
        listPageDocument = new (window as any).DOMParser().parseFromString(
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

        addOutputInfo(
          '<br>' + xzlt('_相关作品抓取完毕', illustUrlList.length.toString())
        )
        getListUrlFinished()
      } else if (pageType === 5) {
        // tag 搜索页
        tagPageFinished++

        let thisOneInfo: string = listPageDocument.querySelector(
          tagSearchDataSelector
        ).dataset.items

        // 保存本页的作品信息
        let thisOneData: TagSearchData[] = JSON.parse(thisOneInfo)

        // 删除广告信息。有段时间作品列表里会混杂广告，现在不知道还有没有
        thisOneData.forEach((item, index, array) => {
          if (item.isAdContainer) {
            array.splice(index, 1)
          }
        })

        displayCover = xzForm.setDisplayCover.checked
        const listWrap = document.querySelector(tagSearchListWrap)!

        // 在这里进行一些检查，不符合条件的作品 continue 跳过，符合条件的保留下来
        for (const data of thisOneData) {
          // 检查收藏设置
          const bookmarkCount = data.bookmarkCount
          if (bookmarkCount < filterBmk) {
            continue
          }

          // 检查宽高设置和宽高比设置
          const tureWidth = data.width
          const tureHeight = data.height
          if (
            !checkSetWhok(tureWidth, tureHeight) ||
            !checkRatio(tureWidth, tureHeight)
          ) {
            continue
          }

          // 检查只下载书签作品的设置
          if (!checkOnlyDownBmk(data.isBookmarked)) {
            continue
          }

          // 检查排除类型设置
          if (notdownType.includes(data.illustType)) {
            continue
          }

          // 检查排除的 tag 的设置
          if (checkNotNeedTag(data.tags)) {
            continue
          }

          // 检查必须包含的 tag  的设置
          if (!checkNeedTag(data.tags)) {
            continue
          }

          // 检查通过后,拼接每个作品的html
          let newHtml = tagSearchNewHtml

          newHtml = newHtml.replace('xz_illustType', data.illustType)

          if (data.isBookmarked) {
            newHtml = newHtml.replace(/xz_isBookmarked/g, 'on')
          }

          if (data.pageCount > 1) {
            newHtml = newHtml.replace('<!--xz_multiple_html-->', xzMultipleHtml)
          }

          if (data.illustType === '2') {
            newHtml = newHtml.replace('<!--xz_ugoira_html-->', xzUgoiraHtml)
          }

          newHtml = newHtml
            .replace(/xz_illustId/g, data.illustId)
            .replace(/xz_pageCount/g, data.pageCount.toString())

          if (displayCover) {
            newHtml = newHtml.replace(/xz_url/g, data.url)
          } else {
            newHtml = newHtml.replace(/xz_url/g, '')
          }

          newHtml = newHtml
            .replace(/xz_illustTitle/g, data.illustTitle)
            .replace(/xz_userId/g, data.userId)
            .replace(/xzUserName/g, data.userName)
            .replace(/xz_userImage/g, data.userImage)
            .replace(/xz_bookmarkCount/g, data.bookmarkCount.toString())

          // 设置宽高
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

          tagSearchResult.push({
            id: parseInt(data.illustId),
            e: newHtml,
            num: Number(bookmarkCount)
          })
          listWrap.insertAdjacentHTML('beforeend', newHtml)
        }

        outputArea.innerHTML =
          nowTips +
          '<br>' +
          xzlt(
            '_tag搜索页已抓取多少页',
            tagPageFinished.toString(),
            wantPage.toString(),
            (startpageNo + listPageFinished - 1).toString()
          )

        // 每抓取完一页，判断任务状态
        if (tagPageFinished === wantPage) {
          // 抓取完了指定的页数
          addOutputInfo(
            '<br>' +
              xzlt(
                '_tag搜索页任务完成1',
                document
                  .querySelectorAll(tagSearchListSelector)
                  .length.toString()
              ) +
              '<br><br>'
          )
          tagSearchPageFinished()
          return false
        } else if (!listPageDocument.querySelector('.next ._button')) {
          // 到最后一页了,已抓取本 tag 的所有页面
          addOutputInfo(
            '<br>' +
              xzlt(
                '_tag搜索页任务完成2',
                document
                  .querySelectorAll(tagSearchListSelector)
                  .length.toString()
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
                document
                  .querySelectorAll(tagSearchListSelector)
                  .length.toString()
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
        let complete = false // 如果数量足够，就标记为完成

        const contents = (JSON.parse(data) as Rank).contents // 取出作品信息列表
        for (const data of contents) {
          // 不是下载首次登场作品时，会检查设置的下载数量。下载首次登场作品时不检查。
          if (!debut && data.rank > wantPage) {
            complete = true
            break
          }

          // 目前，数据里并没有包含收藏数量，所以在这里没办法检查收藏数量要求

          // 检查只下载“首次收藏”要求。yes_rank 是昨日排名，如果为 0，则此作品是“首次登场”的作品
          if (debut && data.yes_rank !== 0) {
            continue
          }

          // 检查只下载收藏作品的设置
          if (!checkOnlyDownBmk(data.is_bookmarked)) {
            continue
          }

          // 检查排除类型的设置
          if (notdownType.includes(data.illust_type)) {
            continue
          }

          // 检查排除的 tag 的设置
          if (checkNotNeedTag(data.tags)) {
            continue
          }

          // 检查必须包含的 tag  的设置
          if (!checkNeedTag(data.tags)) {
            continue
          }

          // 检查宽高设置和宽高比设置
          if (
            !checkSetWhok(data.width, data.height) ||
            !checkRatio(data.width, data.height)
          ) {
            continue
          }

          rankList[data.illust_id.toString()] = data.rank.toString()

          addIllustUrlList([data.illust_id.toString()])
        }

        outputArea.innerHTML =
          nowTips + '<br>' + xzlt('_排行榜进度', listPageFinished.toString())

        // 抓取完毕
        if (complete || listPageFinished === partNumber) {
          if (illustUrlList.length === 0) {
            return noResult()
          } else {
            addOutputInfo(
              '<br>' + xzlt('_排行榜任务完成', illustUrlList.length.toString())
            )
            getListUrlFinished()
          }
        } else {
          // 继续抓取
          getListPage()
        }
      } else if (pageType === 9) {
        // 添加收藏后的相似作品
        const illustList = JSON.parse(data).recommendations // 取出id列表
        addIllustUrlList(illustList) // 拼接作品的url

        addOutputInfo(
          '<br>' + xzlt('_列表页获取完成2', illustUrlList.length.toString())
        )
        getListUrlFinished()
      } else {
        // 不要把下一行的 if 和上一行的 else 合并
        if (pageType === 10 && listIsNewMode === true) {
          // 关注的新作品 列表改成和 tag 搜索页一样的了
          let thisOneInfo: string = listPageDocument.querySelector(
            tagSearchDataSelector
          ).dataset.items
          // 保存本页的作品信息
          let thisOneData: TagSearchData[] = JSON.parse(thisOneInfo)

          for (const data of thisOneData) {
            // 检查收藏设置
            // 关注的新作品页面里的 bookmarkCount 都是 0. 这可能是因为该页面不需要展示收藏数，所以就直接设置为 0 了。所以目前这里不能判断收藏数
            // const bookmarkCount = data.bookmarkCount
            // if (bookmarkCount < filterBmk) {
            //   continue
            // }

            // 检查宽高设置和宽高比设置
            const tureWidth = data.width
            const tureHeight = data.height
            if (
              !checkSetWhok(tureWidth, tureHeight) ||
              !checkRatio(tureWidth, tureHeight)
            ) {
              continue
            }

            // 检查只下载书签作品的设置
            if (!checkOnlyDownBmk(data.isBookmarked)) {
              continue
            }

            // 检查排除类型的设置
            if (notdownType.includes(data.illustType)) {
              continue
            }

            // 检查排除的 tag 的设置
            if (checkNotNeedTag(data.tags)) {
              continue
            }

            // 检查必须包含的 tag  的设置
            if (!checkNeedTag(data.tags)) {
              continue
            }

            addIllustUrlList([data.illustId])
          }
        } else {
          // 传统的列表页，作品是直接包含在页面里的
          const allPicArea = listPageDocument.querySelectorAll(
            '._image-items .image-item'
          )

          for (const el of allPicArea) {
            // 如果这个作品被删除、或非公开，则去掉它
            if (el.querySelector('.title').getAttribute('title') === '-----') {
              continue
            }

            const img = el.querySelector('._thumbnail')
            // img.dataset.type 全都是 "illust"，因此不能用来区分作品类型

            // 提取出 tag 列表
            const tags = img.dataset.tags.split(' ')

            // 检查排除的 tag 的设置
            if (checkNotNeedTag(tags)) {
              continue
            }

            // 检查必须包含的 tag  的设置
            if (!checkNeedTag(tags)) {
              continue
            }

            // 检查只下载书签作品的设置
            const bookmarked = el
              .querySelector('._one-click-bookmark')
              .classList.contains('on')
            if (!checkOnlyDownBmk(bookmarked)) {
              continue
            }

            illustUrlList.push(el.querySelector('a').href)
          }
        }

        outputArea.innerHTML =
          nowTips +
          '<br>' +
          xzlt('_列表页抓取进度', listPageFinished.toString()) // 判断任务状态

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
            return noResult()
          } else {
            getListUrlFinished()
          }
        } else {
          // 继续抓取
          getListPage()
        }
      }
    })
    .catch((error: Error) => {
      // error 的 message 属性是请求出错时的状态码
      if (error.message === '404') {
        // 排行榜
        if (pageType === 7) {
          // 如果发生了404错误，则中断抓取，直接下载已有部分。（因为可能确实没有下一部分了。预设的最大页数可能不符合当前情况
          console.log('404错误，直接下载已有部分')
          if (illustUrlList.length === 0) {
            return noResult()
          } else {
            addOutputInfo(
              '<br>' +
                xzlt(
                  '_排行榜列表页抓取遇到404',
                  illustUrlList.length.toString()
                ) +
                '<br><br>'
            )
            getListUrlFinished()
          }
        }
      }
    })
}

// 第二个获取列表的函数，仅在 tag 搜索页和地区排行榜使用（不发送请求，而是从当前列表页直接获取所有内容页的列表）
function getListPage2() {
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

    // 因为 tag 搜索页里的下载按钮是从这里开始执行，所以有些检查在这里进行
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

    // 检查是否设置了作品张数限制
    checkImgDownloadNumber()

    // 获取必须包含的tag
    getNeedTag()

    // 获取要排除的tag
    getNotNeedTag()

    // 下载时，只下载可见的作品，不下载隐藏起来的作品
    const allPicArea = visibleList()

    // tag 搜索页里，标识作品类型的 class 与其他页面不同，所以在这里转换成能被接下来的函数识别的字符
    for (const el of allPicArea) {
      // 检查排除类型设置
      // 在筛选时给作品列表加上了类型标志。如果不筛选而直接下载，是没有标志的，不过不影响判断
      const illustType: string = el.dataset.illustType!
      if (notdownType.includes(illustType)) {
        continue
      }

      // 检查排除类型的设置
      if (notdownType.includes(illustType)) {
        continue
      }

      // 检查只下载书签作品的设置
      const bookmarked = el
        .querySelector('._one-click-bookmark')!
        .classList.contains('on')
      if (!checkOnlyDownBmk(bookmarked)) {
        continue
      }

      illustUrlList.push(el.querySelector('a')!.href)
    }
  }

  // 地区排行榜
  if (pageType === 6) {
    const allPicArea = document.querySelectorAll('.ranking-item>.work_wrapper')

    for (const el of allPicArea) {
      const img = el.querySelector('._thumbnail')! as HTMLImageElement
      // img.dataset.type 全都是 "illust"，因此不能用来区分作品类型

      // 提取出 tag 列表
      const tags = img.dataset.tags!.split(' ')

      // 检查排除的 tag 的设置
      if (checkNotNeedTag(tags)) {
        continue
      }

      // 检查必须包含的 tag  的设置
      if (!checkNeedTag(tags)) {
        continue
      }

      // 检查只下载书签作品的设置
      const bookmarked = el
        .querySelector('._one-click-bookmark')!
        .classList.contains('on')
      if (!checkOnlyDownBmk(bookmarked)) {
        continue
      }

      illustUrlList.push(el.querySelector('a')!.href)
    }
  }

  allowWork = false
  addOutputInfo(
    '<br>' +
      xzlt('_列表抓取完成开始获取作品页', illustUrlList.length.toString())
  )

  if (illustUrlList.length <= 0) {
    return noResult()
  }

  getListUrlFinished()
}

// 从 url 里获取作品id，可以传参，无参数则使用当前页面的 url 匹配
function getIllustId(url?: string) {
  const str = url || window.location.search || locUrl
  if (str.includes('illust_id')) {
    // 传统 url
    return /illust_id=(\d*\d)/.exec(str)![1]
  } else if (str.includes('/artworks/')) {
    // 新版 url
    return /artworks\/(\d*\d)/.exec(str)![1]
  } else {
    // 直接取出 url 中的数字
    return /\d*\d/.exec(locUrl)![0]
  }
}

// 获取用户id
function getUserId() {
  let userId = ''

  // 首先尝试从 url 中获取
  const test = /(\?|&)id=(\d{1,9})/.exec(window.location.search)
  const nameElement = document.querySelector('.user-name')! as HTMLAnchorElement
  if (test) {
    userId = test[2]
  } else if (nameElement) {
    // 从旧版页面的头像获取（在书签页面使用）
    userId = /\?id=(\d{1,9})/.exec(nameElement.href)![1]
  } else {
    // 从新版页面的头像获取，因为经常改版，不得已改成从源码匹配了
    const el =
      document.getElementById('root') || document.getElementById('spa-contents')
    // 在 PC 模式的新版页面使用 root，在手机模式的新版页面使用 spa-contents
    userId = /member\.php\?id=(\d{1,9})/.exec(el!.innerHTML)![1]
  }

  return userId
}

// 从 url 中获取指定的查询条件
function getQuery(url: string, query: string) {
  const result = new URL(url).searchParams.get(query)
  return result || ''
}

// 获取作品列表页前的准备工作，在 pageType 2 使用
function readyGetListPage() {
  // 每次开始时重置一些条件
  offsetNumber = 0
  type2IdList = []
  type2ListType = 0
  // works_type:
  // 0 插画和漫画全都要，但是不带 tag
  // 4 插画和漫画全都要，带 tag
  // 1 只要插画
  // 2 只要漫画
  // 3 书签作品

  // 是否是 tag 模式
  hasTag = !!getQuery(locUrl, 'tag')

  // 每页个数
  let onceNumber = 48 // 新版每页 48 个作品（因为新版不显示无法访问的作品，所以有时候一页不足这个数量）
  // 旧版每页 20 个作品
  if (document.querySelector('.user-name')) {
    onceNumber = 20
  }

  // 如果前面有页数，就去掉前面页数的作品数量。即：从本页开始下载
  const nowPage = getQuery(locUrl, 'p') // 判断当前处于第几页，页码从 1 开始。也可能没有页码
  if (nowPage) {
    offsetNumber = (parseInt(nowPage) - 1) * onceNumber
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
      type2ListType = 1

      // 带 tag
      if (hasTag) {
        apiUrl = `https://www.pixiv.net/ajax/user/${getUserId()}/illusts/tag?tag=${getQuery(
          locUrl,
          'tag'
        )}&offset=${offsetNumber}&limit=${requsetNumber}`
      }
    } else if (getQuery(locUrl, 'type') === 'manga') {
      // 漫画分类
      type2ListType = 2

      // 带 tag
      if (hasTag) {
        apiUrl = `https://www.pixiv.net/ajax/user/${getUserId()}/manga/tag?tag=${getQuery(
          locUrl,
          'tag'
        )}&offset=${offsetNumber}&limit=${requsetNumber}`
      }
    } else if (hasTag) {
      // url 里没有插画也没有漫画，但是有 tag，则是在资料页首页点击了 tag，需要同时获取插画和漫画
      type2ListType = 4
      apiUrl = `https://www.pixiv.net/ajax/user/${getUserId()}/illustmanga/tag?tag=${getQuery(
        locUrl,
        'tag'
      )}&offset=${offsetNumber}&limit=${requsetNumber}`
    }
  } else if (locUrl.includes('bookmark.php')) {
    // 书签页面，需要多次循环获取
    type2ListType = 3
    hasTag = true // 书签页面固定设置为有 tag（虽然有时候并没有带 tag，但数据结构和带 tag 是一样的）
    let restMode = 'show' // 判断是公开收藏还是非公开收藏

    if (getQuery(locUrl, 'rest') === 'hide') {
      restMode = 'hide'
    }

    let nowTag = getQuery(locUrl, 'tag') // 要使用的tag

    // 在“未分类”页面时，设置 tag
    if (parseInt(getQuery(locUrl, 'untagged')) === 1) {
      nowTag = encodeURI('未分類')
    }

    apiUrl = `https://www.pixiv.net/ajax/user/${getUserId()}/illusts/bookmarks?tag=${nowTag}&offset=${offsetNumber}&limit=${onceRequest}&rest=${restMode}`
  } else {
    // 不进行抓取
    allowWork = true
    return false
  }

  changeTitle('↑')
  getType2ListPage(apiUrl)
  addOutputInfo('<br>' + xzlt('_正在抓取'))

  if (type2ListType === 3 && wantPage === -1) {
    addOutputInfo('<br>' + xzlt('_获取全部书签作品'))
  }
}

// 获取作品列表页，在 pageType 2 中使用
function getType2ListPage(url: string) {
  let bmkGetEnd = false // 书签作品是否获取完毕

  fetch(url, {
    credentials: 'same-origin'
  })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(response.status.toString())
      }
    })
    .then((data: Type2ListDataNoTag & Type2ListDataHaveTag) => {
      // 不带 tag，并且也不是书签页面
      if (!hasTag) {
        // 都是使用的这个 tag
        // https://www.pixiv.net/ajax/user/27517/profile/all
        const thisdata: Type2ListDataNoTag = data
        if (type2ListType === 0) {
          // 获取全部插画和漫画
          type2IdList = type2IdList
            .concat(Object.keys(thisdata.body.illusts))
            .concat(Object.keys(thisdata.body.manga))
        } else if (type2ListType === 1) {
          // 插画列表页，包含动图
          type2IdList = type2IdList.concat(Object.keys(thisdata.body.illusts))
        } else if (type2ListType === 2) {
          // 漫画列表页
          type2IdList = type2IdList.concat(Object.keys(thisdata.body.manga))
        }
      } else {
        // 带 tag
        const thisdata: Type2ListDataHaveTag = data
        const works = thisdata.body.works
        // 不是书签页面
        if (type2ListType !== 3) {
          // 插画、漫画、或者全都要并带 tag ，数据结构都一样
          // https://www.pixiv.net/ajax/user/27517/illusts/tag?tag=%E5%A5%B3%E3%81%AE%E5%AD%90&offset=0&limit=9999999
          // https://www.pixiv.net/ajax/user/27517/manga/tag?tag=%E5%A5%B3%E3%81%AE%E5%AD%90&offset=0&limit=9999999
          // https://www.pixiv.net/ajax/user/544479/illustmanga/tag?tag=%E6%9D%B1%E9%A2%A8%E8%B0%B7%E6%97%A9%E8%8B%97&offset=0&limit=9999999
          works.forEach(data => type2IdList.push(data.id))
        } else {
          // 书签页面
          // https://www.pixiv.net/ajax/user/9460149/illusts/bookmarks?tag=&offset=0&limit=100&rest=show
          // https://www.pixiv.net/ajax/user/9460149/illusts/bookmarks?tag=推荐&offset=0&limit=100&rest=show
          // 获取数量超出实际存在数量，works 长度会是 0，代表后面没有更多页面了
          if (works.length === 0 || type2IdList.length >= requsetNumber) {
            bmkGetEnd = true // 书签页获取完毕
          } else {
            works.forEach(data => type2IdList.push(data.id))
          }
        }
      }

      if (type2IdList.length > 0) {
        if (
          type2ListType === 0 ||
          (type2ListType === 1 && !hasTag) ||
          (type2ListType === 2 && !hasTag)
        ) {
          // 非书签页，并且非 tag 页
          // 在获取全部作品时（即使用默认的 api 时），由于 API 里不能设置 requset_number，所以要在这里处理。

          // 把 id 从小到大排序
          let tempList: number[] = []
          // 转换成数字
          tempList = type2IdList.map(id => {
            return parseInt(id)
          })
          // 升序排列
          tempList.sort(function(x, y) {
            return x - y
          })
          // 保存到结果中
          type2IdList = tempList.map(id => {
            return id.toString()
          })
          // 删除后面的 id（删除不需要的近期作品）
          type2IdList.splice(
            type2IdList.length - offsetNumber,
            type2IdList.length
          )
        }

        // 获取完毕后，对 id 列表进行处理。不需要重复调用本函数的情况
        if (type2ListType !== 3 || bmkGetEnd) {
          // 删除多余的作品
          if (type2IdList.length > requsetNumber) {
            if (type2ListType !== 3) {
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
            '<br>' +
              xzlt(
                '_列表抓取完成开始获取作品页',
                illustUrlList.length.toString()
              )
          )
          getListUrlFinished()
        } else if (type2ListType === 3 && !bmkGetEnd) {
          // 如果是书签页，且没有获取完毕，则重复执行
          offsetNumber += onceRequest // 每次增加偏移量，并获取之后固定数量
          url = url.replace(/offset=\d*\d?/, `offset=${offsetNumber}`)
          getType2ListPage(url)
        }
      } else {
        return noResult()
      }
    })
    .catch(error => console.log(error))
}

// 获取作品列表的结果为 0 时输出提示
function noResult() {
  addOutputInfo('<br>' + xzlt('_列表页抓取结果为零') + '<br>')
  allowWork = true
  changeTitle('0')
  return false
}

// 获取书签页面下方的推荐作品列表
function getRecommendedList() {
  // 获取下方已经加载出来的作品
  const elements = document.querySelectorAll(
    '#illust-recommend .image-item'
  ) as NodeListOf<HTMLLIElement>
  if (elements.length === 0) {
    alert('not found!')
    addOutputInfo('<br><br>' + xzlt('_没有符合条件的作品') + '<br><br>')
    allowWork = true
    downRecommended = false
    return false
  }
  // 添加作品列表
  for (const li of elements) {
    const a = li.querySelector('a') as HTMLAnchorElement
    illustUrlList.push(a.href)
  }

  getListUrlFinished()
}

// 作品列表获取完毕，开始抓取作品内容页
function getListUrlFinished() {
  // 列表页获取完毕后，可以在这里重置一些变量
  debut = false

  nowTips = outputArea.innerHTML

  if (illustUrlList.length < ajaxForIllustThreads) {
    ajaxForIllustThreads = illustUrlList.length
  }

  for (let i = 0; i < ajaxForIllustThreads; i++) {
    getIllustData()
  }
}

// 当因为网络问题无法获取作品数据时，重试
function reTryGetIllustData(url: string) {
  setTimeout(() => {
    getIllustData(url)
  }, 2000)
}

// 获取作品的数据
async function getIllustData(url?: string) {
  // url 参数为完整的作品页 url，如：
  // https://www.pixiv.net/member_illust.php?mode=medium&illust_id=65546468
  // 目前，只有在作品页内和重试时，需要显式传递 url。

  changeTitle('↑')

  // 如果没有传递 url，则取出 illustUrlList 的第一项进行抓取
  if (!url) {
    url = illustUrlList.shift()!
  }

  // 判断任务是否已中断，目前只在tag搜索页有用到
  if (interrupt) {
    allowWork = true
    return false
  }

  // 快速下载时在这里提示一次
  if (quickDownload) {
    addOutputInfo('<br>' + xzlt('_开始获取作品页面'))
    nowTips = outputArea.innerHTML
  }

  const usedUrl = 'https://www.pixiv.net/ajax/illust/' + getIllustId(url) // 取出作品id，拼接出作品页api

  // 发起请求
  try {
    const response = await fetch(usedUrl)
    if (response.ok) {
      const data: IllustData = await response.json()

      // 这里需要再判断一次中断情况，因为ajax执行完毕是需要时间的
      if (interrupt) {
        allowWork = true
        return false
      }

      // 预设及获取图片信息
      const jsInfo = data.body
      const id = jsInfo.illustId
      const fullWidth = jsInfo.width // 原图宽度
      const fullHeight = jsInfo.height // 原图高度
      const title = jsInfo.illustTitle // 作品标题
      const userid = jsInfo.userId // 画师id
      let user = jsInfo.userName // 画师名字，如果这里获取不到，下面从 tag 尝试获取
      const nowAllTagInfo = jsInfo.tags.tags // 取出 tag 信息
      const nowAllTag = [] // 保存 tag 列表
      const tagWithTranslation = [] // 保存 tag 列表，附带翻译后的 tag

      if (nowAllTagInfo.length > 0) {
        if (!user) {
          user = nowAllTagInfo[0].userName ? nowAllTagInfo[0].userName : '' // 这里从第一个tag里取出画师名字，如果没有 tag 那就获取不到画师名
        }

        for (const tagData of nowAllTagInfo) {
          nowAllTag.push(tagData.tag)
          tagWithTranslation.push(tagData.tag)
          if (tagData.translation && tagData.translation.en) {
            tagWithTranslation.push(tagData.translation.en)
          }
        }
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
      const checkBookmarkResult = checkOnlyDownBmk(!!jsInfo.bookmarkData)

      // 检查排除类型设置，这里取反
      const notdownTypeResult = !notdownType.includes(
        jsInfo.illustType.toString()
      )

      let tagCheckResult // 储存 tag 检查结果

      // 检查要排除的 tag
      const tagNotNeedIsFound = checkNotNeedTag(nowAllTag)

      // 如果检查排除的 tag，没有匹配到
      if (!tagNotNeedIsFound) {
        // 检查必须包含的 tag
        tagCheckResult = checkNeedTag(nowAllTag)
      } else {
        // 如果匹配到了要排除的tag，则不予通过
        tagCheckResult = false
      }

      // 上面的检查全部通过才可以下载这个作品
      const totalCheck =
        tagCheckResult &&
        checkBookmarkResult &&
        notdownTypeResult &&
        whCheckResult &&
        ratioCheckResult &&
        bmkCheckResult

      // 检查通过
      if (totalCheck) {
        // 获取作品在排行榜上的编号
        let rank = ''
        if (pageType === 7) {
          rank = '#' + rankList[jsInfo.illustId]
        }
        // 储存作品信息
        if (jsInfo.illustType !== 2) {
          // 插画或漫画
          // 检查要下载该作品的前面几张
          let pNo = jsInfo.pageCount
          if (imgNumberPerWork > 0 && imgNumberPerWork <= pNo) {
            pNo = imgNumberPerWork
          }

          // 获取多p作品的原图页面
          imgUrl = jsInfo.urls.original
          const tempExt = imgUrl.split('.')
          ext = tempExt[tempExt.length - 1]

          // 添加作品信息
          for (let i = 0; i < pNo; i++) {
            const nowUrl = imgUrl.replace('p0', 'p' + i) // 拼接出每张图片的url

            addImgInfo(
              id + '_p' + i,
              nowUrl,
              title,
              nowAllTag,
              tagWithTranslation,
              user,
              userid,
              fullWidth,
              fullHeight,
              ext,
              bmk,
              jsInfo.createDate.split('T')[0],
              jsInfo.illustType,
              rank,
              {}
            )
          }
          outputImgNum()
        } else if (jsInfo.illustType === 2) {
          // 动图
          // 获取动图的信息
          const getUgoiraInfo = await fetch(
            `https://www.pixiv.net/ajax/illust/${id}/ugoira_meta`,
            {
              method: 'get',
              credentials: 'same-origin' // 附带 cookie
            }
          )
          const info = await getUgoiraInfo.json()
          // 动图帧延迟数据
          const ugoiraInfo: UgoiraInfo = {
            frames: info.body.frames,
            mimeType: info.body.mime_type
          }

          ext = xzForm.ugoiraSaveAs.value // 扩展名可能是 webm、gif、zip

          addImgInfo(
            id,
            info.body.originalSrc,
            title,
            nowAllTag,
            tagWithTranslation,
            user,
            userid,
            fullWidth,
            fullHeight,
            ext,
            bmk,
            jsInfo.createDate.split('T')[0],
            jsInfo.illustType,
            rank,
            ugoiraInfo
          )
          outputImgNum()
        }
      }

      // 在作品页内下载时，设置的 wantPage 其实是作品数
      if (pageType === 1 && !downRelated) {
        if (wantPage > 0) {
          wantPage--
        }

        if (wantPage === -1 || wantPage > 0) {
          // 应该继续下载时，检查是否有下一个作品
          const userIllust = jsInfo.userIllusts
          let nextId

          // 在所有不为 null 的数据里（可能有1-3个），illustId 比当前 id 大的是新作品, 比当前 id 小的是旧作品
          for (const val of Object.values(userIllust)) {
            if (val) {
              const thisId = parseInt(val.illustId) // 转换成数字进行比较
              if (downDirection === -1 && thisId > parseInt(id)) {
                nextId = val.illustId
                break
              } else if (downDirection === 1 && thisId < parseInt(id)) {
                nextId = val.illustId
                break
              }
            }
          }

          if (nextId) {
            getIllustData(
              'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' +
                nextId
            )
          } else {
            // 没有剩余作品
            crawFinished()
          }
        } else {
          // 没有剩余作品
          crawFinished()
        }
      } else {
        if (illustUrlList.length > 0) {
          // 如果存在下一个作品，则
          getIllustData()
        } else {
          // 没有剩余作品
          ajaxThreadsFinished++
          if (ajaxThreadsFinished === ajaxForIllustThreads) {
            // 如果所有并发请求都执行完毕则复位
            ajaxThreadsFinished = 0

            crawFinished()
          }
        }
      }
    } else {
      illustError(url)
      const status = response.status
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
    }
  } catch (error) {
    console.log(error)
    // 这里预期 catch 的是因网络原因，fetch 出错的情况
    reTryGetIllustData(url)
  }
}

// 测试图片 url 是否正确的函数。pixivision 页面直接获取的图片 url，后缀都是jpg的，所以要测试实际上是jpg还是png
function testExtName(url: string, length: number, imgInfoData: any) {
  testSuffixFinished = false

  let ext = ''
  const testImg = new Image()
  testImg.src = url

  testImg.onload = () => nextStep(true)

  testImg.onerror = () => nextStep(false)

  function nextStep(bool: boolean) {
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
      [],
      imgInfoData.user,
      imgInfoData.userid,
      imgInfoData.fullWidth,
      imgInfoData.fullHeight,
      ext,
      0,
      '',
      0,
      '',
      {}
    )
    outputImgNum()

    if (length !== undefined) {
      testSuffixNo++
      if (testSuffixNo === length) {
        // 如果所有请求都执行完毕
        crawFinished()
      }
    }

    testSuffixFinished = true
  }
}

// 抓取完毕
function crawFinished() {
  allowWork = true

  // 检查快速下载状态
  let autoDownload: boolean = xzForm.setQuietDownload.checked

  // 检查后缀名的任务是否全部完成
  if (testSuffixFinished) {
    downRelated = false // 解除下载相关作品的标记
    downDirection = 0 // 解除下载方向的标记
    downRecommended = false // 解除下载推荐作品的标记

    // tag 搜索页把下载任务按收藏数从高到低下载
    if (pageType === 5) {
      imgInfo.sort(sortByProperty('bmk'))
    }

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

    addOutputInfo(
      '<br>' + xzlt('_获取图片网址完毕', imgInfo.length.toString()) + '<br>'
    )

    if (imgInfo.length === 0) {
      addOutputInfo(xzlt('_没有符合条件的作品') + '<br><br>')
      window.alert(xzlt('_没有符合条件的作品弹窗'))
      allowWork = true
      return false
    }

    addOutputInfo(xzlt('_抓取完毕') + '<br><br>')

    if (!autoDownload && !quickDownload) {
      changeTitle('▶')
    }

    nowTips = outputArea.innerHTML

    resetDownloadPanel() // 重置下载面板

    downloadPanelDisplay('block')

    // 显示下载面板
    if (!quickDownload) {
      centerWrapShow()
    }

    // 视情况自动开始下载
    if (quickDownload || autoDownload) {
      startDownload()
    }
  } else {
    // 如果没有完成，则延迟一段时间后再执行
    setTimeout(function() {
      crawFinished()
    }, 1000)
  }
}

// 在抓取图片网址时，输出提示
function outputImgNum() {
  outputArea.innerHTML =
    nowTips + '<br>' + xzlt('_抓取图片网址的数量', imgInfo.length.toString())

  // 如果任务中断
  if (interrupt) {
    addOutputInfo('<br>' + xzlt('_抓取图片网址遇到中断') + '<br><br>')
  }
}

// 添加右侧下载按钮
function addRightButton() {
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

// 显示中间面板上的提示。参数 arg 指示鼠标是移入还是移出，并包含鼠标位置
function xzTip(this: HTMLElement, arg: XzTipArg) {
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

// 添加输出 url 列表、文件名列表的面板
function addOutPutPanel() {
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
  // 关闭输出区域
  document.querySelector('.outputUrlClose')!.addEventListener('click', () => {
    ;(document.querySelector(
      '.outputInfoWrap'
    )! as HTMLDivElement).style.display = 'none'
  })
  // 复制输出内容
  document.querySelector('.outputUrlCopy')!.addEventListener('click', () => {
    const range = document.createRange()
    range.selectNodeContents(document.querySelector('.outputInfoContent')!)
    window.getSelection()!.removeAllRanges()
    window.getSelection()!.addRange(range)
    document.execCommand('copy')

    // 改变提示文字
    document.querySelector('.outputUrlCopy')!.textContent = xzlt(
      '_已复制到剪贴板'
    )
    setTimeout(() => {
      window.getSelection()!.removeAllRanges()
      document.querySelector('.outputUrlCopy')!.textContent = xzlt('_复制')
    }, 1000)
  })
}

// 添加下载面板
function addDownloadPanel() {
  document.body.appendChild(centerPanel)
  centerPanel.outerHTML = `
      <div class="XZTipEl"></div>
      <div class="centerWrap">
      <div class="centerWrap_head">
      <span class="centerWrap_title xz_blue"> ${xzlt('_下载设置')}</span>
      <div class="btns">
      <a class="xztip centerWrap_top_btn update" data-tip="${xzlt(
        '_newver'
      )}" href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases/latest" target="_blank"><img src="${chrome.extension.getURL(
    'images/update.png'
  )}" /></a>
      <a class="xztip centerWrap_top_btn wiki_url" data-tip="${xzlt(
        '_wiki'
      )}" href="https://github.com/xuejianxianzun/PixivBatchDownloader/wiki" target="_blank"><img src="${chrome.extension.getURL(
    'images/wiki.png'
  )}" /></a>
      <a class="xztip centerWrap_top_btn" data-tip="${xzlt(
        '_github'
      )}" href="https://github.com/xuejianxianzun/PixivBatchDownloader" target="_blank"><img src="${chrome.extension.getURL(
    'images/github-logo.png'
  )}" /></a>
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
      <p class="xzFormP3">
      <span class="xztip settingNameStyle1" data-tip="${xzlt(
        '_多p下载前几张提示'
      )}">${xzlt('_多p下载前几张')}<span class="gray1"> ? </span></span>
      <input type="text" name="setPNo" class="setinput_style1 xz_blue" value="${imgNumberPerWork}">
      </p>
      <p class="xzFormP5">
      <span class="xztip settingNameStyle1" data-tip="${xzlt(
        '_下载作品类型的提示Center'
      )}">${xzlt('_下载作品类型')}<span class="gray1"> ? </span></span>
      <label for="setWorkType0"><input type="checkbox" name="setWorkType0" id="setWorkType0" checked> ${xzlt(
        '_插画'
      )}&nbsp;</label>
      <label for="setWorkType1"><input type="checkbox" name="setWorkType1" id="setWorkType1" checked> ${xzlt(
        '_漫画'
      )}&nbsp;</label>
      <label for="setWorkType2"><input type="checkbox" name="setWorkType2" id="setWorkType2" checked> ${xzlt(
        '_动图'
      )}&nbsp;</label>
      </p>
      <p class="xzFormP12">
      <span class="xztip settingNameStyle1" data-tip="${xzlt(
        '_动图保存格式title'
      )}">${xzlt('_动图保存格式')}<span class="gray1"> ? </span></span>
      <label for="ugoiraSaveAs1"><input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs1" value="webm" checked> ${xzlt(
        '_webmVideo'
      )} &nbsp;</label>
      <label for="ugoiraSaveAs3"><input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs3" value="gif" checked> ${xzlt(
        '_gif'
      )} &nbsp;</label>
      <label for="ugoiraSaveAs2"><input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs2" value="zip"> ${xzlt(
        '_zipFile'
      )} &nbsp;</label>
      </p>
      <p class="xzFormP2">
      <span class="xztip settingNameStyle1" data-tip="${xzlt(
        '_筛选收藏数的提示Center'
      )}">${xzlt('_筛选收藏数Center')}<span class="gray1"> ? </span></span>
      <input type="text" name="setFavNum" class="setinput_style1 xz_blue" value="0">&nbsp;&nbsp;&nbsp;&nbsp;
      </p>
      <p class="xzFormP11">
      <span class="xztip settingNameStyle1" data-tip="${xzlt(
        '_只下载已收藏的提示'
      )}">${xzlt('_只下载已收藏')}<span class="gray1"> ? </span></span>
      <label for="setOnlyBmk"><input type="checkbox" name="setOnlyBmk" id="setOnlyBmk"> ${xzlt(
        '_启用'
      )}</label>
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
      )}">${xzlt('_是否自动下载')}<span class="gray1"> ? </span></span>
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
        <option value="{tags_translate}">{tags_translate}</option>
        <option value="{user}">{user}</option>
        <option value="{userid}">{userid}</option>
        <option value="{type}">{type}</option>
        <option value="{date}">{date}</option>
        <option value="{bmk}">{bmk}</option>
        <option value="{px}">{px}</option>
        <option value="{rank}">{rank}</option>
        <option value="{id_num}">{id_num}</option>
        <option value="{p_num}">{p_num}</option>
        </select>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <span class="gray1 showFileNameTip">？</span>
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
      ${xzlt('_命名标记1')}
      <br>
      <span class="xz_blue">{title}</span>
      ${xzlt('_命名标记2')}
      <br>
      <span class="xz_blue">{tags}</span>
      ${xzlt('_命名标记3')}
      <br>
      <span class="xz_blue">{tags_translate}</span>
      ${xzlt('_命名标记11')}
      <br>
      <span class="xz_blue">{user}</span>
      ${xzlt('_命名标记4')}
      <br>
      <span class="xz_blue">{userid}</span>
      ${xzlt('_命名标记6')}
      <br>
      <span class="xz_blue">{date}</span>
      ${xzlt('_命名标记12')}
      <br>
      <span class="xz_blue">{type}</span>
      ${xzlt('_命名标记14')}
      <br>
      <span class="xz_blue">{bmk}</span>
      ${xzlt('_命名标记8')}
      <br>
      <span class="xz_blue">{px}</span>
      ${xzlt('_命名标记7')}
      <br>
      <span class="xz_blue">{id_num}</span>
      ${xzlt('_命名标记9')}
      <br>
      <span class="xz_blue">{p_num}</span>
      ${xzlt('_命名标记10')}
      <br>
      <span class="xz_blue">{rank}</span>
      ${xzlt('_命名标记13')}
      <br>
      ${xzlt('_命名标记提醒')}
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
      <div class="progressBarWrap">
      <span class="text">${xzlt('_下载进度')}</span>
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
      <p class="gray1"> 
      <span class="showDownTip">${xzlt('_查看下载说明')}</span>
      <a class="xztip centerWrap_top_btn wiki2" href="https://github.com/xuejianxianzun/PixivBatchDownloader/wiki" target="_blank"><img src="${chrome.extension.getURL(
        'images/wiki.png'
      )}" /> ${xzlt('_wiki')}</a></p>
      <p class="downTip tip"> ${xzlt('_下载说明')}</p>
      </div>
      `
  centerBtnWrap = document.querySelector(
    '.centerWrap_btns_free'
  )! as HTMLDivElement
  centerPanel = document.querySelector('.centerWrap')! as HTMLDivElement
  xzForm = document.querySelector('.xzForm')! as XzForm
}

// 显示提示
function bindXzTip() {
  xzTipEl = document.querySelector('.XZTipEl')! as HTMLDivElement
  const xztips = document.querySelectorAll('.xztip') as NodeListOf<HTMLElement>
  for (const el of xztips) {
    for (const ev of ['mouseenter', 'mouseleave']) {
      el.addEventListener(ev, event => {
        const e = (event || window.event) as MouseEvent
        xzTip.call(el, {
          type: ev === 'mouseenter' ? 1 : 0,
          x: e.clientX,
          y: e.clientY
        })
      })
    }
  }
}

// 把下拉框的选择项插入到文本框里
function insertValueToInput(form: HTMLSelectElement, to: HTMLInputElement) {
  form.addEventListener('change', function() {
    if (this.value === 'default') {
      return false
    } else {
      // 把选择项插入到光标位置,并设置新的光标位置
      const position = to.selectionStart!
      to.value =
        to.value.substr(0, position) +
        this.value +
        to.value.substr(position, to.value.length)
      to.selectionStart = position + this.value.length
      to.selectionEnd = position + this.value.length
      to.focus()
      // 保存命名规则
      saveXzSetting('userSetName', to.value)
    }
  })
}

// 向中间面板添加按钮
function addCenterButton(
  tag: string = 'div',
  bg: string = xzBlue,
  text: string = '',
  attr: string[][] = []
) {
  const e = document.createElement(tag)
  e.style.backgroundColor = bg
  e.textContent = text

  for (const [key, value] of attr) {
    e.setAttribute(key, value)
  }

  centerBtnWrap.appendChild(e)
  return e
}

// 绑定中间面板的事件
function downloadPanelEvents() {
  // 关闭中间面板
  document
    .querySelector('.centerWrap_close')!
    .addEventListener('click', centerWrapHide)

  // 使用快捷键 Alt + x 切换中间面板显示隐藏
  window.addEventListener(
    'keydown',
    event => {
      const e = event || window.event
      if (e.altKey && e.keyCode === 88) {
        const nowDisplay = centerPanel.style.display
        if (nowDisplay === 'block') {
          centerWrapHide()
        } else {
          centerWrapShow()
        }
      }
    },
    false
  )

  // 预览文件名
  document
    .querySelector('.showFileNameResult')!
    .addEventListener('click', () => showOutputInfoWrap('name'))

  // 显示 url
  document
    .querySelector('.copyUrl')!
    .addEventListener('click', () => showOutputInfoWrap('url'))

  // 显示命名字段提示
  document
    .querySelector('.showFileNameTip')!
    .addEventListener('click', () =>
      toggle(document.querySelector('.fileNameTip')! as HTMLDivElement)
    )

  // 显示下载说明
  document
    .querySelector('.showDownTip')!
    .addEventListener('click', () =>
      toggle(document.querySelector('.downTip')! as HTMLDivElement)
    )

  // 开始下载按钮
  document.querySelector('.startDownload')!.addEventListener('click', () => {
    startDownload()
  })

  // 暂停下载按钮
  document.querySelector('.pauseDownload')!.addEventListener('click', () => {
    pauseDownload()
  })

  // 停止下载按钮
  document.querySelector('.stopDownload')!.addEventListener('click', () => {
    stopDownload()
  })

  // 给有提示的元素绑定事件
  bindXzTip()

  // 输入框获得焦点时自动选择文本（文件名输入框例外）
  const centerInputs: NodeListOf<HTMLInputElement> = xzForm.querySelectorAll(
    'input[type=text]'
  )
  for (const el of centerInputs) {
    if (el.name !== 'fileNameRule') {
      el.addEventListener('focus', function() {
        this.select()
      })
    }
  }

  // 把下拉框的选择项插入到文本框里
  insertValueToInput(xzForm.pageInfoSelect, xzForm.fileNameRule)
  insertValueToInput(xzForm.fileNameSelect, xzForm.fileNameRule)
}

// 收起展开选项设置区域
function toggleOptionArea(bool: boolean) {
  const xzOptionArea = <HTMLDivElement>(
    document.querySelector('.xz_option_area')!
  )
  xzOptionArea.style.display = bool ? 'block' : 'none'
  document.querySelector('.centerWrap_toogle_option')!.innerHTML = bool
    ? '▲'
    : '▼'
}

// 添加中间面板
function addCenterWarps() {
  addOutPutPanel()
  addDownloadPanel()
  downloadPanelEvents()
}

// 设置允许开始下载的时间
function setStartTime() {
  canStartTime = new Date().getTime() + 500 // 延迟一定时间后才允许继续下载
}

// 开始下载
function startDownload() {
  // 如果正在下载中，或无图片，则不予处理
  if (downloadStarted || imgInfo.length === 0) {
    return false
  }

  // 检查是否到了可以下载的时间
  const time1 = new Date().getTime() - canStartTime
  if (time1 < 0) {
    setTimeout(() => {
      startDownload()
    }, Math.abs(time1))
    return false
  }

  // 如果之前不是暂停状态，则需要重新下载
  if (!downloadPause) {
    resetDownloadPanel()
    // 初始化下载记录
    // 状态：
    // -1 未使用
    // 0 使用中
    // 1 已完成
    downloadedList = new Array(imgInfo.length).fill(-1)
    downloaded = 0
  } else {
    // 继续下载
    // 把“使用中”的下载状态重置为“未使用”
    for (let index = 0; index < downloadedList.length; index++) {
      if (downloadedList[index] === 0) {
        downloadedList[index] = -1
      }
    }
  }

  // 下载线程设置
  const setThread = parseInt(xzForm.setThread.value)
  if (setThread < 1 || setThread > 5 || isNaN(setThread)) {
    downloadThread = downloadThreadDeauflt // 重设为默认值
  } else {
    downloadThread = setThread // 设置为用户输入的值
  }

  // 如果剩余任务数量少于下载线程数
  if (imgInfo.length - downloaded < downloadThread) {
    downloadThread = imgInfo.length - downloaded
  }

  // 重设下载进度条的数量
  const centerWrapDownList = document.querySelector(
    '.centerWrap_down_list'
  ) as HTMLDivElement
  downloadBarList = centerWrapDownList.querySelectorAll('.downloadBar')
  if (downloadBarList.length !== downloadThread) {
    centerWrapDownList.innerHTML = downloadBarList[0].outerHTML.repeat(
      downloadThread
    )
  }
  downloadBarList = centerWrapDownList.querySelectorAll('.downloadBar')
  centerWrapDownList.style.display = 'block'

  // 重置一些条件
  downloadPause = false
  downloadStop = false
  downloadStarted = true
  clearTimeout(reTryTimer)

  // 启动或继续下载，建立并发下载线程
  for (let i = 0; i < downloadThread; i++) {
    downloadFile(i)
  }

  changeDownStatus(xzlt('_正在下载中'))

  addOutputInfo('<br>' + xzlt('_正在下载中') + '<br>')
}

// 提示下载状态
function changeDownStatus(str: string) {
  document.querySelector('.down_status')!.innerHTML = str
}

// 暂停下载
function pauseDownload() {
  clearTimeout(reTryTimer)

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
      quickDownload = false
      setStartTime()
      chrome.runtime.sendMessage({ msg: 'cancel_download' })
      changeTitle('║')
      changeDownStatus(`<span style="color:#f00">${xzlt('_已暂停')}</span>`)
      addOutputInfo(xzlt('_已暂停') + '<br><br>')
    } else {
      // 不在下载中的话不允许启用暂停功能
      return false
    }
  }
}

// 停止下载
function stopDownload() {
  clearTimeout(reTryTimer)

  if (imgInfo.length === 0) {
    return false
  }

  if (downloadStop === false) {
    downloadStop = true
    downloadStarted = false
    quickDownload = false
    setStartTime()
    chrome.runtime.sendMessage({ msg: 'cancel_download' })
    changeTitle('■')
    changeDownStatus(`<span style="color:#f00">${xzlt('_已停止')}</span>`)
    addOutputInfo(xzlt('_已停止') + '<br><br>')
    downloadPause = false
  }
}

// 重试下载
function reTryDownload() {
  // 如果下载已经完成，则不执行操作
  if (downloaded === imgInfo.length) {
    return false
  }
  // 暂停下载并在一定时间后重试下载
  pauseDownload()
  reTryTimer = setTimeout(() => {
    startDownload()
  }, 1000)
}

// 重置下载面板的信息
function resetDownloadPanel() {
  downloaded = 0
  document.querySelector('.downloaded')!.textContent = downloaded.toString()

  for (const el of document.querySelectorAll('.imgNum')) {
    el.textContent = imgInfo.length.toString()
  }

  for (const el of document.querySelectorAll('.download_fileName')) {
    el.textContent = ''
  }

  for (const el of document.querySelectorAll('.loaded')) {
    el.textContent = '0/0'
  }

  for (const el of document.querySelectorAll('.progress')) {
    ;(el as HTMLDivElement).style.width = '0%'
  }
}

// 显示或隐藏下载面板
function downloadPanelDisplay(str: string) {
  const download_panel = document.querySelector(
    '.download_panel'
  ) as HTMLDivElement
  download_panel.style.display = str
}

// 显示中间区域
function centerWrapShow() {
  centerPanel.style.display = 'block'
  rightButton.style.display = 'none'
}

// 隐藏中间区域
function centerWrapHide() {
  centerPanel.style.display = 'none'
  rightButton.style.display = 'block'
  const outputInfoWrap = document.querySelector(
    '.outputInfoWrap'
  )! as HTMLDivElement
  outputInfoWrap.style.display = 'none'
}

// 读取储存的设置
function readXzSetting() {
  xzSetting = JSON.parse(window.localStorage.getItem('xzSetting')!)

  if (!xzSetting) {
    // 设置为默认值。必须和排除的 tag 是字符串类型
    xzSetting = {
      imgNumberPerWork: 0,
      notdownType: '',
      ugoiraSaveAs: 'webm',
      needTag: '',
      notNeedTag: '',
      displayCover: true,
      quietDownload: true,
      downloadThread: downloadThreadDeauflt,
      userSetName: '{id}',
      tagNameToFileName: true,
      showOptions: true
    }
  }

  // 设置作品张数
  const setPNoInput = xzForm.setPNo
  setPNoInput.value = (xzSetting.imgNumberPerWork || 0).toString()

  // 保存作品张数
  setPNoInput.addEventListener('change', function(this: HTMLInputElement) {
    if (parseInt(this.value) >= 0) {
      saveXzSetting('imgNumberPerWork', this.value)
    }
  })

  // 设置排除类型
  xzSetting.notdownType = xzSetting.notdownType.replace(/3|4/g, '')
  // 3 和 4 是旧版本遗留的，需要去掉。现在只有 0 1 2。

  for (let index = 0; index < xzSetting.notdownType.length; index++) {
    let name = 'setWorkType' + xzSetting.notdownType[index]
    ;(xzForm[name] as HTMLInputElement).checked = false
  }

  // 保存排除类型
  for (let index = 0; index < 3; index++) {
    let name = 'setWorkType' + index.toString()
    ;(xzForm[name] as HTMLInputElement).addEventListener('click', () => {
      saveXzSetting('notdownType', getNotDownType())
    })
  }

  // 设置动图格式选项
  xzForm.ugoiraSaveAs.value = xzSetting.ugoiraSaveAs || 'webm'

  // 保存动图格式选项
  for (const input of xzForm.ugoiraSaveAs) {
    input.addEventListener('click', function(this: HTMLInputElement) {
      saveXzSetting('ugoiraSaveAs', this.value)
    })
  }

  // 设置必须的 tag
  const setTagNeedInput = xzForm.setTagNeed
  setTagNeedInput.value = xzSetting.needTag

  // 保存必须的 tag设置
  setTagNeedInput.addEventListener('change', function(this: HTMLInputElement) {
    saveXzSetting('needTag', this.value)
  })

  // 设置排除的 tag
  const setTagNotNeedInput = xzForm.setTagNotNeed
  setTagNotNeedInput.value = xzSetting.notNeedTag

  // 保存排除的 tag设置
  setTagNotNeedInput.addEventListener('change', function(
    this: HTMLInputElement
  ) {
    saveXzSetting('notNeedTag', this.value)
  })

  // 设置是否显示封面
  const setDisplayCoverInput = xzForm.setDisplayCover
  setDisplayCoverInput.checked = xzSetting.displayCover

  // 保存封面选项
  setDisplayCoverInput.addEventListener('click', function(
    this: HTMLInputElement
  ) {
    saveXzSetting('displayCover', this.checked)
  })

  // 设置是否显示选项区域
  const showOptionsBtn = document.querySelector('.centerWrap_toogle_option')!
  let showOptions = true
  if (xzSetting.showOptions !== undefined) {
    showOptions = xzSetting.showOptions
  }
  toggleOptionArea(showOptions)

  // 保存是否显示选项区域
  showOptionsBtn.addEventListener('click', () => {
    showOptions = !showOptions
    toggleOptionArea(showOptions)
    saveXzSetting('showOptions', showOptions)
  })

  // 设置快速下载
  const setQuietDownloadInput = xzForm.setQuietDownload
  setQuietDownloadInput.checked = xzSetting.quietDownload

  // 保存快速下载
  setQuietDownloadInput.addEventListener('click', function(
    this: HTMLInputElement
  ) {
    saveXzSetting('quietDownload', this.checked)
  })

  // 设置下载线程
  const setThreadInput = xzForm.setThread
  setThreadInput.value = xzSetting.downloadThread.toString()

  // 保存下载线程
  setThreadInput.addEventListener('change', function(this: HTMLInputElement) {
    if (parseInt(this.value) > 0 && parseInt(this.value) <= 5) {
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
  fileNameRuleInput.addEventListener('change', function(
    this: HTMLInputElement
  ) {
    if (this.value !== '') {
      saveXzSetting('userSetName', this.value)
    } else {
      // 把下拉框恢复默认值
      xzForm.fileNameSelect.value = (xzForm.fileNameSelect
        .children[0] as HTMLOptionElement).value
    }
  })

  // 是否添加字段名称
  const setTagNameToFileNameInput = xzForm.setTagNameToFileName
  setTagNameToFileNameInput.checked = xzSetting.tagNameToFileName

  setTagNameToFileNameInput.addEventListener('click', function(
    this: HTMLInputElement
  ) {
    saveXzSetting('tagNameToFileName', this.checked)
  })
}

// 储存设置
function saveXzSetting(key: keyof typeof xzSetting, value: any) {
  xzSetting[key] = value
  window.localStorage.setItem('xzSetting', JSON.stringify(xzSetting))
}

// 在某些页面里，隐藏不需要的选项。参数是数组，传递设置项的编号。
function hideNotNeedOption(no: number[]) {
  for (const num of no) {
    const el = document.querySelector(
      '.xzFormP' + num.toString()
    )! as HTMLParagraphElement
    el.style.display = 'none'
  }
}

// 清除多图作品
function clearMultiple() {
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
function clearUgoku() {
  addCenterButton('div', xzRed, xzlt('_清除动图作品'), [
    ['title', xzlt('_清除动图作品Title')]
  ]).addEventListener(
    'click',
    () => {
      centerWrapHide()
      const allPicArea = document.querySelectorAll(tagSearchListSelector)
      allPicArea.forEach(el => {
        if (el.querySelector(tagSearchUgoiraSelector)) {
          el.remove()
        }
      })
      outputNowResult()
    },
    false
  )
}

// 手动删除作品
function manuallyDelete() {
  let delWork: boolean = false // 是否处于删除作品状态

  addCenterButton('div', xzRed, xzlt('_手动删除作品'), [
    ['title', xzlt('_手动删除作品Title')]
  ]).addEventListener('click', function() {
    delWork = !delWork

    // 给作品绑定删除属性
    const listElement: NodeListOf<HTMLDivElement> = document.querySelectorAll(
      tagSearchListSelector
    )
    listElement.forEach(el => {
      el.onclick = function(e) {
        if (delWork) {
          ;(e || window.event).preventDefault()
          removeEl(this as HTMLElement)

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
function showOutputInfoWrap(type: string) {
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
        now.url.replace(/.*\//, '') + ': ' + getFileName(now) + '<br>') // 在每个文件名前面加上它的原本的名字，方便用来做重命名
    }, result)
  } else {
    return false
  }

  document.querySelector('.outputInfoContent')!.innerHTML = result
  ;(document.querySelector('.outputInfoWrap') as HTMLDivElement).style.display =
    'block'
}

// 生成文件名，传入参数为图片信息
function getFileName(data: ImgInfo) {
  let result = xzForm.fileNameRule.value
  // 为空时使用 {id}
  result = result || '{id}' // 生成文件名

  // 储存每个文件名标记的配置
  const cfg = [
    {
      name: '{p_user}',
      // 标记
      value: pageInfo.p_user,
      // 值
      prefix: '',
      // 添加在前面的字段名称
      safe: false
      // 是否是安全的文件名。如果可能包含一些特殊字符，就不安全，要进行替换
    },
    {
      name: '{p_uid}',
      value: pageInfo.p_uid ? getUserId() : '',
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
      value: pageInfo.p_tag,
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
      value: parseInt(/\d*$/.exec(data.id)![0]),
      prefix: '',
      safe: true
    },
    {
      name: '{rank}',
      value: data.rank,
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
      value: (function() {
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
      name: '{tags_translate}',
      value: data.tagsTranslated.join(','),
      prefix: 'tags_',
      safe: false
    },
    {
      name: '{bmk}',
      value: data.bmk,
      prefix: 'bmk_',
      safe: true
    },
    {
      name: '{date}',
      value: data.date,
      prefix: '',
      safe: true
    },
    {
      name: '{type}',
      value: illustTypes[data.type],
      prefix: '',
      safe: true
    }
  ]

  // 把命名规则的标记替换成实际值
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
          once = once.replace(safeFileName, '_').trim()
        }

        result = result.replace(new RegExp(item.name, 'g'), once) // 将标记替换成最终值，如果有重复的标记，全部替换
      }
    }
  }

  // 处理空值，不能做文件夹名的字符，连续的 '//'。 有时候两个斜线中间的字段是空值，最后就变成两个斜线挨在一起了
  result = result
    .replace(/undefined/g, '')
    .replace(safeFolderName, '_')
    .replace(/\/{2,9}/, '/')

  // 替换每层路径头尾的 . 因为 Chrome 不允许头尾使用 .
  let tempArr = result.split('/')
  tempArr.forEach((str, index, arr) => {
    arr[index] = str.replace(/^\./g, '_').replace(/\.$/g, '_')
  })
  result = tempArr.join('/')

  // 去掉头尾的 /
  if (result.startsWith('/')) {
    result = result.replace('/', '')
  }
  if (result.endsWith('/')) {
    result = result.substr(0, result.length - 1)
  }

  // 快速下载时，如果只有一个文件，则不建立文件夹
  if (quickDownload && imgInfo.length === 1) {
    const index = result.lastIndexOf('/')
    result = result.substr(index + 1, result.length)
  }

  // 添加后缀名
  result += '.' + data.ext

  return result
}

// 下载文件。参数是要使用的下载栏的序号
function downloadFile(downloadBarNo: number) {
  // 修改标题
  changeTitle('↓')
  // 获取还未开始下载的文件的索引
  let thisImgInfo: ImgInfo | undefined
  let thisIndex = -1
  for (let index = 0; index < downloadedList.length; index++) {
    if (downloadedList[index] === -1) {
      thisImgInfo = imgInfo[index]
      thisIndex = index
      downloadedList[thisIndex] = 0
      break
    }
  }
  // 如果没有获取到则返回
  if (thisIndex === -1) {
    return false
  }

  // 获取文件名
  let fullFileName = getFileName(thisImgInfo!)

  // 重设当前下载栏的信息
  const loadedBar = downloadBarList[downloadBarNo].querySelector(
    '.loaded'
  ) as HTMLDivElement
  const progressBar = downloadBarList[downloadBarNo].querySelector(
    '.progress'
  ) as HTMLDivElement
  loadedBar.textContent = '0/0'
  progressBar.style.width = '0%'
  downloadBarList[downloadBarNo].querySelector(
    '.download_fileName'
  )!.textContent = fullFileName
  // 下载图片
  const xhr = new XMLHttpRequest()
  xhr.open('GET', thisImgInfo!.url, true)
  xhr.responseType = 'blob'
  // 显示下载进度
  xhr.addEventListener('progress', function(e) {
    if (downloadPause || downloadStop) {
      xhr.abort()
      return false
    }

    e = e || window.event
    const loaded = Math.floor(e.loaded / 1024)
    const total = Math.floor(e.total / 1024)
    loadedBar.textContent = loaded + '/' + total
    progressBar.style.width = (loaded / total) * 100 + '%'
  })
  // 图片下载完成
  xhr.addEventListener('loadend', async function() {
    if (downloadPause || downloadStop) {
      xhr.abort()
      return false
    }

    // 正常下载完毕的状态码是 200
    if (xhr.status !== 200) {
      // 404 时不进行重试，因为重试也依然会是 404
      if (xhr.status === 404) {
        // 输出提示信息
        addOutputInfo(
          `<span style="color:#f00">${xzlt(
            '_file404',
            thisImgInfo!.id
          )}</span><br>`
        )
        // 因为 404 时进度条不会动，所以需要手动设置进度条完成
        progressBar.style.width = '100%'
      } else {
        reTryDownload()
        return false
      }
    }

    let file: Blob = new Blob() // 要下载的文件

    if (xhr.status === 404) {
      // 404 错误时创建 txt 文件，并保存提示信息
      file = new Blob([`${xzlt('_file404', thisImgInfo!.id)}`], {
        type: 'text/plain'
      })
      fullFileName = fullFileName.replace(
        /\.jpg$|\.png$|\.zip$|\.gif$|\.webm$/,
        '.txt'
      )
    } else if (
      (thisImgInfo!.ext === 'webm' || thisImgInfo!.ext === 'gif') &&
      thisImgInfo!.ugoiraInfo.frames
    ) {
      // 将压缩包里的图片转换为 base64 字符串
      const imgFile: string[] = await readZip(
        xhr.response,
        thisImgInfo!.ugoiraInfo
      )

      // 如果需要转换成视频
      if (thisImgInfo!.ext === 'webm') {
        // 创建视频编码器
        const encoder = new Whammy.Video()
        // 生成每一帧的数据
        const canvasData = await getFrameData(imgFile)!
        // 添加帧数据
        for (let index = 0; index < canvasData!.length; index++) {
          const base64 = canvasData![index]
          encoder.add(base64, thisImgInfo!.ugoiraInfo.frames![index].delay)
        }
        // 获取生成的视频
        file = (await encodeVideo(encoder)) as Blob
      }

      // 如果需要转换成动图
      if (thisImgInfo!.ext === 'gif') {
        // 配置 gif.js
        let gif: any = new GIF({
          workers: 4,
          quality: 10,
          workerScript: gifWorkerUrl
        })

        // 生成每一帧的数据
        const imgData = await getFrameData(imgFile, 'gif')
        // 添加帧数据
        for (let index = 0; index < imgData!.length; index++) {
          gif.addFrame(imgData![index], {
            delay: thisImgInfo!.ugoiraInfo.frames![index].delay
          })
        }

        let renderGif = new Promise<Blob>((resolve, reject) => {
          // 绑定渲染完成事件
          gif.on('finished', (blob: Blob) => {
            resolve(blob)
          })
          // 开始渲染
          gif.render()
        })
        file = await renderGif
      }
    } else {
      // 不需要转换
      file = xhr.response
    }

    // 生成下载链接
    const blobUrl = URL.createObjectURL(file)
    // 向浏览器发送下载任务
    browserDownload(blobUrl, fullFileName, downloadBarNo, thisIndex)
  })
  // 捕获错误
  xhr.addEventListener('error', function() {
    // 下载途中突然网络变化导致链接断开、以及超时都会 error，xhr.status 为 0。
    reTryDownload()
    return false
  })
  xhr.send()
}

// 向浏览器发送下载任务
function browserDownload(
  blobUrl: string,
  fullFileName: string,
  downloadBarNo: number,
  thisIndex: number
) {
  // 如果前后两次任务的时间间隔小于 time_interval，则延迟一定时间使间隔达到 time_interval。
  const t = new Date().getTime() - downloadTime
  if (t < timeInterval) {
    setTimeout(() => {
      browserDownload(blobUrl, fullFileName, downloadBarNo, thisIndex)
    }, timeInterval - t)
    return false
  }

  // 如果任务已停止，不会向浏览器发送下载任务
  if (downloadPause || downloadStop) {
    // 释放 bloburl
    URL.revokeObjectURL(blobUrl)
    return false
  }

  downloadTime = new Date().getTime()

  const sendInfo: SendInfo = {
    msg: 'send_download',
    fileUrl: blobUrl,
    fileName: fullFileName,
    no: downloadBarNo,
    thisIndex: thisIndex
  }

  chrome.runtime.sendMessage(sendInfo)
}

// 监听后台发送的消息
chrome.runtime.onMessage.addListener(function(msg) {
  if (msg.msg === 'downloaded') {
    // 下载完成
    afterDownload(msg)
  } else if (msg.msg === 'click_icon') {
    // 点击图标
    if (centerPanel.style.display === 'block') {
      centerWrapHide()
    } else {
      centerWrapShow()
    }
  }
})

// 下载之后
function afterDownload(msg: DownloadedMsg) {
  // 释放 bloburl
  URL.revokeObjectURL(msg.data.url)
  // 更改这个任务状态为“已完成”
  downloadedList[msg.data.thisIndex] = 1
  downloaded++
  // 显示进度信息
  document.querySelector('.downloaded')!.textContent = downloaded.toString()
  const progress1 = document.querySelector('.progress1')! as HTMLDivElement
  progress1.style.width = (downloaded / imgInfo.length) * 100 + '%'

  // 如果所有文件都下载完毕
  if (downloaded === imgInfo.length) {
    downloadStarted = false
    quickDownload = false
    downloadStop = false
    downloadPause = false
    clearTimeout(reTryTimer)
    changeDownStatus(xzlt('_下载完毕'))
    addOutputInfo(xzlt('_下载完毕') + '<br><br>')
    changeTitle('√')
  } else {
    // 如果没有全部下载完毕
    // 如果任务已停止
    if (downloadPause || downloadStop) {
      return false
    }
    // 如果已完成的数量 加上 线程中未完成的数量，仍然没有达到文件总数，继续添加任务
    if (downloaded + downloadThread - 1 < imgInfo.length) {
      downloadFile(msg.data.no)
    }
  }
}

// 清空图片信息并重置输出区域，在重复抓取时使用
function resetResult() {
  imgInfo = []
  downloadedList = []
  rankList = {}
  downloadStarted = false
  downloadPause = false
  downloadStop = false
  changeTitle('0')
  centerWrapHide()
  document.querySelector('.outputInfoContent')!.innerHTML = ''
}

// 根据页面类型，在设置页数的地方显示对应的提示。有些页面里，会隐藏这个选项
function changeWantPage() {
  const setWantPageWrap = document.querySelector('.xzFormP1')!
  const setWantPage = setWantPageWrap.querySelector(
    '.setWantPage'
  )! as HTMLInputElement
  const setWantPageTip1 = setWantPageWrap.querySelector(
    '.setWantPageTip1'
  )! as HTMLSpanElement
  const setWantPageTip2 = setWantPageWrap.querySelector(
    '.setWantPageTip2'
  )! as HTMLSpanElement

  switch (pageType) {
    case 0:
      hideNotNeedOption([1])
      break

    case 1:
      wantPage = -1
      setWantPageTip1.textContent = xzlt('_个数')
      setWantPageTip1.dataset.tip =
        xzlt('_checkWantPageRule1Arg5') + '<br>' + xzlt('_相关作品大于0')
      setWantPageTip2.textContent = xzlt('_数字提示1')
      setWantPage.value = wantPage.toString()
      break

    case 5:
      wantPage = 1000
      setWantPageTip1.textContent = xzlt('_页数')
      setWantPageTip1.dataset.tip = xzlt('_要获取的作品个数2')
      setWantPageTip2.textContent = '-1 - 1000'
      setWantPage.value = wantPage.toString()
      break

    case 6:
      hideNotNeedOption([1])
      break

    case 7:
      wantPage = 500
      setWantPageTip1.textContent = xzlt('_个数')
      setWantPageTip1.dataset.tip = xzlt('_要获取的作品个数2')
      setWantPageTip2.textContent = '1 - 500'
      setWantPage.value = wantPage.toString()
      break

    case 8:
      hideNotNeedOption([1])
      break

    case 9:
      wantPage = 100
      setWantPageTip1.textContent = xzlt('_个数')
      setWantPageTip1.dataset.tip = xzlt('_要获取的作品个数2')
      setWantPageTip2.textContent = '1 - 500'
      setWantPage.value = wantPage.toString()
      break

    case 10:
      wantPage = 10
      setWantPageTip1.textContent = xzlt('_页数')
      setWantPageTip1.dataset.tip = xzlt('_checkWantPageRule1Arg8')
      setMaxNum()
      setWantPageTip2.textContent = `1 - ${maxNum}`
      setWantPage.value = wantPage.toString()
      break

    case 11:
      hideNotNeedOption([1])
      break

    default:
      wantPage = -1
      setWantPageTip1.textContent = xzlt('_页数')
      setWantPageTip1.dataset.tip = xzlt('_checkWantPageRule1Arg5')
      setWantPageTip2.textContent = xzlt('_数字提示1')
      setWantPage.value = wantPage.toString()
      break
  }
}

// 把获取到的页面信息添加到下拉选项里
function pageInfoSelector() {
  const pageInfoSelect = xzForm.pageInfoSelect
  pageInfoSelect.innerHTML = ''
  pageInfoSelect.insertAdjacentHTML(
    'beforeend',
    '<option value="default">…</option>'
  )
  for (const key of Object.keys(pageInfo)) {
    if (pageInfo[key as keyof typeof pageInfo]) {
      const optionHtml = `<option value="{${key}}">{${key}}</option>`
      pageInfoSelect.insertAdjacentHTML('beforeend', optionHtml)
    }
  }
}

// 获取用户信息。可以传入 id，或者自动获取当前页面的用户 id
function getUserInfo(id: string = '') {
  fetch(`https://www.pixiv.net/ajax/user/${id || getUserId()}/profile/top`, {
    method: 'get',
    credentials: 'same-origin'
  })
    .then(response => response.json())
    .then((data: UserProfileTop) => {
      // 设置 pageInfo 的信息
      let useData: { [key: string]: WorksInfo } = {}
      // 如果有插画作品
      if (Object.keys(data.body.illusts).length > 0) {
        useData = data.body.illusts
      } else if (Object.keys(data.body.manga).length > 0) {
        // 如果没有插画作品，则从漫画作品中查找
        useData = data.body.manga
      } else {
        // 查找不到
        pageInfo.p_user = ''
        pageInfo.p_uid = ''
        return false
      }

      let keys = Object.keys(useData)
      let first = useData[keys[0]]
      pageInfo.p_user = first.userName
      pageInfo.p_uid = first.userId
    })
}

// 获取当前页面的一些信息，用于文件名中
function getPageInfo() {
  pageInfo = new PageInfoClass()
  // 所有页面都可以使用 p_title。这里的 1 用作占位符。因无刷新加载时，要等待 DOM 加载，此时获取到的还是旧页面的值，所以只占位。具体的值在生成文件名时获取。
  pageInfo.p_title = '1'

  // 只有 1 和 2 可以使用画师信息
  if (pageType === 1 || pageType === 2) {
    // 先占位
    pageInfo.p_user = '1'
    pageInfo.p_uid = '1'

    // 1 会在 updateViewer 获取作品信息时获取画师信息，2 在这里单独获取用户信息
    if (pageType === 2) {
      getUserInfo()
    }

    // 如果有 tag 则设置 tag。因为 tag 是从 url 判断的，所以不需要占位
    if (getQuery(locUrl, 'tag')) {
      pageInfo.p_tag = decodeURIComponent(getQuery(locUrl, 'tag'))
    }
  } else if (pageType === 5) {
    pageInfo.p_tag = decodeURIComponent(getQuery(locUrl, 'word'))
  }

  // 设置下拉框
  pageInfoSelector()
}

// 判断 pageType
function checkPageType() {
  oldPageType = pageType
  locUrl = window.location.href

  if (
    window.location.hostname === 'www.pixiv.net' &&
    window.location.pathname === '/'
  ) {
    pageType = 0
  } else if (
    (locUrl.includes('illust_id') || locUrl.includes('/artworks/')) &&
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
    pageType = -1
  }
  return pageType
}

// 当 pageType 为 1 时执行
function pageType1() {
  // 在右侧创建快速下载按钮
  const quickDownBtn = document.createElement('div')
  quickDownBtn.id = 'quick_down_btn'
  quickDownBtn.textContent = '↓'
  quickDownBtn.setAttribute('title', xzlt('_快速下载本页'))
  document.body.appendChild(quickDownBtn)
  quickDownBtn.addEventListener(
    'click',
    () => {
      quickDownload = true
      startGet()
    },
    false
  )

  addCenterButton('div', xzBlue, xzlt('_从本页开始抓取new')).addEventListener(
    'click',
    () => {
      downDirection = -1
      startGet()
    }
  )

  addCenterButton('div', xzBlue, xzlt('_从本页开始抓取old')).addEventListener(
    'click',
    () => {
      downDirection = 1
      startGet()
    }
  )

  const downXgBtn = addCenterButton('div', xzBlue, xzlt('_抓取相关作品'))
  downXgBtn.addEventListener(
    'click',
    () => {
      downRelated = true
      startGet()
    },
    false
  )

  quickBookmark()
  initViewer()
}

// 当 pageType 为 2 时执行
function pageType2() {
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

  // 添加下载推荐作品的按钮，只在旧版收藏页面使用
  const columnTitle = document.querySelector('.column-title')
  if (columnTitle) {
    const downRecmdBtn = addCenterButton('div', xzBlue, xzlt('_抓取推荐作品'), [
      ['title', xzlt('_抓取推荐作品Title')]
    ])
    downRecmdBtn.addEventListener(
      'click',
      () => {
        downRecommended = true
        startGet()
      },
      false
    )
  }

  // 如果存在 token，则添加“添加 tag”按钮
  if (getToken()) {
    const addTagBtn = addCenterButton('div', xzGreen, xzlt('_添加tag'), [
      ['title', xzlt('_添加tag')]
    ])
    addTagBtn.id = 'add_tag_btn'

    if (!locUrl.includes('bookmark.php')) {
      addTagBtn.style.display = 'none'
    }

    addTagBtn.addEventListener('click', readyAddTag)
  }
}

// 当页面无刷新切换时，进行一些处理。这里目前只针对 pageType 1 和 2 进行处理，因为它们有一些相同的逻辑
function listenPageSwitch() {
  if (pageType === 1 || pageType === 2) {
    // pushState 判断从列表页进入作品页的情况，popstate 判断从作品页退回列表页的情况
    ;['pushState', 'popstate'].forEach(item => {
      window.addEventListener(item, () => {
        // 当页面切换时，判断新页面的类型
        checkPageType()
        changeWantPage()
        getPageInfo()

        // 切换页面时，清空输出区域
        if (outputArea) {
          outputArea.innerHTML = ''
        }

        // 在作品页里调用图片查看器
        if (pageType === 1) {
          initViewer()
        }

        // 在书签页面的处理
        const isBookmarkPage = locUrl.includes('bookmark.php')
        // 在书签页显示添加 tag 的按钮，其他页面隐藏
        const addTagBtn = document.getElementById('add_tag_btn')
        if (isBookmarkPage && !!addTagBtn) {
          addTagBtn.style.display = 'inline-block'
        } else {
          if (!!addTagBtn) {
            addTagBtn.style.display = 'none'
          }
        }
        // 这里也可以显示隐藏“下载推荐作品”的按钮，但是没必要。因为旧版书签页面的进出都是需要刷新的。

        // 当新旧页面的 pageType 不相同的时候
        if (oldPageType !== pageType) {
          centerBtnWrap.innerHTML = '' // 清空原有的下载按钮
          wantPage = -1 // 重置页数/个数设置

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
}

// 对不同类型的页面执行相应的代码
function allPageType() {
  if (pageType === 0) {
    // 0.index 首页
    // https://www.pixiv.net/

    // 用于输入id的输入框
    const downIdInput = document.createElement('textarea')
    downIdInput.id = 'down_id_input'
    downIdInput.setAttribute('placeholder', xzlt('_输入id进行抓取的提示文字'))
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
        downIdButton.textContent = xzlt('_输入id进行抓取')
      }
    })

    let idValue = []

    const downIdButton = addCenterButton(
      'div',
      xzBlue,
      xzlt('_输入id进行抓取'),
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
  } else if (pageType === 1) {
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
    <div class="JoCpVnw" data-illust-type="xz_illustType">
    <figure class="mSh0kS-" style="width: 200px; max-height: 288px;">
    <div class="_3IpHIQ_">
    <a href="/member_illust.php?mode=medium&illust_id=xz_illustId" rel="noopener" class="PKslhVT">
    <!--xz_multiple_html-->
    <img alt="" class="_1hsIS11" width="xz_width" height="xz_height" src="xz_url">
    <!--xz_ugoira_html-->
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
    document.getElementById('js-react-search-mid')!.style.minHeight = 'auto' // 这部分的高度改成 auto 以免搜索时会有空白区域
    xzForm.setFavNum.value = '1000' // tag 搜索页默认收藏数设置为 1000
    const xzFormP9 = document.querySelector(
      '.xzFormP9'
    )! as HTMLParagraphElement
    xzFormP9.style.display = 'block' // 显示“是否显示封面图”的选项

    // 添加快速筛选功能
    const nowTag = document
      .querySelector('.column-title a')!
      .textContent!.split(' ')[0]
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
    const insetParent = document.querySelector('._unit')! as HTMLDivElement
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
        const allPicArea = document.querySelectorAll(
          tagSearchListSelector
        )! as NodeListOf<HTMLDivElement>

        let wantFavoriteNumber2 = parseInt(
          window.prompt(xzlt('_在结果中筛选弹窗'), '2000')!
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
            parseInt(el.querySelector('._ui-tooltip')!.textContent!) <
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

    manuallyDelete()

    addCenterButton('div', xzBlue, xzlt('_抓取当前作品'), [
      ['title', xzlt('_抓取当前作品Title')]
    ]).addEventListener('click', getListPage2)
  } else if (pageType === 6) {
    // 6. ranking_area 地区排行榜
    // https://www.pixiv.net/ranking_area.php?type=detail&no=0

    addCenterButton('div', xzBlue, xzlt('_抓取本页作品'), [
      ['title', xzlt('_抓取本页作品Title')]
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

    addCenterButton('div', xzBlue, xzlt('_抓取本排行榜作品'), [
      ['title', xzlt('_抓取本排行榜作品Title')]
    ]).addEventListener('click', startGet)

    // 在“今日”页面，添加下载首次登场的作品的按钮
    if (locUrl.includes('mode=daily')) {
      addCenterButton('div', xzBlue, xzlt('_抓取首次登场的作品'), [
        ['title', xzlt('_抓取首次登场的作品Title')]
      ]).addEventListener('click', () => {
        debut = true
        startGet()
      })
    }
  } else if (pageType === 8) {
    // 8. pixivision
    // https://www.pixivision.net/zh/a/3190
    const typeA = document.querySelector(
      'a[data-gtm-action=ClickCategory]'
    )! as HTMLAnchorElement
    const type = typeA.dataset.gtmLabel

    if (type === 'illustration' || type === 'manga' || type === 'cosplay') {
      // 在插画、漫画、cosplay类型的页面上创建下载功能
      addCenterButton(
        'div',
        xzBlue,
        xzlt('_抓取该页面的图片')
      ).addEventListener(
        'click',
        () => {
          resetResult()
          insertOutputInfo()
          changeTitle('↑')

          if (type === 'illustration') {
            // 针对不同类型的页面，使用不同的选择器
            const imageList = document.querySelectorAll(
              '.am__work__main img'
            ) as NodeListOf<HTMLImageElement>
            const urls = Array.from(imageList).map(el => {
              return el.src
                .replace('c/768x1200_80/img-master', 'img-original')
                .replace('_master1200', '')
            })
            testSuffixNo = 0
            urls.forEach(url => {
              let arr = url.split('/')
              const id = arr[arr.length - 1].split('.')[0] // 取出作品 id
              testExtName(url, urls.length, {
                id: id,
                title: '',
                tags: [],
                user: '',
                userid: '',
                fullWidth: '',
                fullHeight: ''
              })
            })
          } else {
            let selector = ''
            if (type === 'manga') {
              selector = '.am__work__illust'
            } else if (type === 'cosplay') {
              selector = '.fab__image-block__image img'
            }

            // 把图片url添加进数组
            const imageList = document.querySelectorAll(selector) as NodeListOf<
              HTMLImageElement
            >
            Array.from(imageList).forEach(el => {
              const imgUrl = el.src
              if (
                imgUrl !==
                'https://i.pximg.net/imgaz/upload/20170407/256097898.jpg'
              ) {
                // 跳过Cure的logo图片
                let arr = imgUrl.split('/')
                const id = arr[arr.length - 1].split('.')[0] // 作品id
                const ext = arr[arr.length - 1] // 扩展名

                addImgInfo(
                  id,
                  imgUrl,
                  '',
                  [],
                  [],
                  '',
                  '',
                  0,
                  0,
                  ext,
                  0,
                  '',
                  0,
                  '',
                  {}
                )
              }
            })
            crawFinished()
          }
        },
        false
      )
    }

    hideNotNeedOption([1, 2, 3, 4, 5, 6, 7, 11, 12, 13])
  } else if (pageType === 9) {
    // 9. bookmark_add
    // https://www.pixiv.net/bookmark_detail.php?illust_id=63148723

    addCenterButton('div', xzBlue, xzlt('_抓取相似图片'), [
      ['title', xzlt('_抓取相似图片')]
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
      listIsNewMode = true
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

    addCenterButton('div', xzBlue, xzlt('_开始抓取'), [
      ['title', xzlt('_下载大家的新作品')]
    ]).addEventListener('click', startGet)
  } else if (pageType === 11) {
    // 11.discover 发现
    // https://www.pixiv.net/discovery

    tagSearchListSelector = '._2RNjBox' // 发现页面的作品列表

    addCenterButton('div', xzBlue, xzlt('_抓取当前作品'), [
      ['title', xzlt('_抓取当前作品Title')]
    ]).addEventListener('click', startGet)

    clearMultiple()

    clearUgoku()

    manuallyDelete()
  }
}

// 光翼展开！
async function expand() {
  checkConflict()
  addJs()
  await addStyle()
  listenHistory()
  setLangType()
  showWhatIsNew('_xzNew270')
  addRightButton()
  addCenterWarps()
  readXzSetting()
  changeWantPage()
  listenPageSwitch()
  getPageInfo()
  allPageType()
  update()
}

// Divine judge！
;-1 !== checkPageType() && expand()
