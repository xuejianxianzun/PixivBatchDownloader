import { ArtworkData, NovelData } from './crawl/CrawlResult'
import { lang } from './Lang'
import { pageType } from './PageType'
import { WorkTypeString, Result } from './store/StoreType'
import { Utils } from './utils/Utils'

type artworkDataTagsItem = {
  tag: string
  locked: boolean
  deletable: boolean
  userId: string
  romaji: string
  translation?:
    | {
        en: string
      }
    | undefined
  userName: string
}

type novelDataTagsItem = {
  tag: string
  locked: boolean
  deletable: boolean
  userId: string
  userName: string
}

class Tools {
  // 把结果中的动图排列到最前面
  static sortUgoiraFirst(a: Result, b: Result) {
    if (a.type === 2 && b.type !== 2) {
      return -1
    } else if (a.type === 2 && b.type === 2) {
      return 0
    } else {
      return 1
    }
  }

  // 根据 tag 判断是否是 R-18(G) 作品
  static isR18OrR18G(tags: string | string[]) {
    const str: string = Array.isArray(tags) ? tags.toString() : tags

    return (
      str.includes('R-18') ||
      str.includes('R-18G') ||
      str.includes('R18') ||
      str.includes('R18G')
    )
  }

  // 在不同的页面类型里，尝试从 url 中获取 tag
  static getTagFromURL(url: string = location.href) {
    const nowURL = new URL(url)

    // 2 用户作品列表页
    if (/\/users\/\d+/.test(url) && !url.includes('/bookmarks')) {
      // 匹配 pathname 里用户 id 之后的字符
      const test = nowURL.pathname.match(/\/users\/\d+(\/.+)/)
      if (test && test.length === 2) {
        const str = test[1]
        // 如果用户 id 之后的字符多于一个路径，则把最后一个路径作为 tag，示例
        // https://www.pixiv.net/users/2188232/illustrations/ghostblade
        const array = str.split('/')
        // ["", "illustrations", "ghostblade"]
        if (array.length > 2) {
          return decodeURIComponent(array[array.length - 1])
        }
      }
    }

    // 4 旧版收藏页面
    if (nowURL.pathname === '/bookmark.php') {
      if (parseInt(Utils.getURLSearchField(nowURL.href, 'untagged')) === 1) {
        // 旧版 “未分类” tag 是个特殊标记
        // https://www.pixiv.net/bookmark.php?untagged=1
        return '未分類'
      }
    }

    // 4 新版收藏页面
    if (nowURL.pathname.includes('/bookmarks/')) {
      // 新版收藏页 url，tag 在路径末端，如
      // https://www.pixiv.net/users/9460149/bookmarks/artworks/R-18
      // https://www.pixiv.net/users/9460149/bookmarks/novels/R-18
      const test = /\/bookmarks\/\w*\/(.[^\/|^\?|^&]*)/.exec(nowURL.pathname)
      if (test !== null && test.length > 1 && !!test[1]) {
        return decodeURIComponent(test[1])
      }
    }

    // 5 搜索页面
    if (nowURL.pathname.includes('/tags/')) {
      return decodeURIComponent(nowURL.pathname.split('tags/')[1].split('/')[0])
    }

    // 默认情况，从查询字符串里获取，如下网址
    // https://www.pixiv.net/bookmark.php?tag=R-18
    return decodeURIComponent(Utils.getURLSearchField(nowURL.href, 'tag'))
  }

  /**从 url 里获取 artworks id。如果查找不到 id 会返回空字符串 */
  static getIllustId(url?: string) {
    if (pageType.type === pageType.list.Unlisted) {
      return Utils.getURLPathField(window.location.pathname, 'unlisted')
    }

    const str = url || window.location.href

    let test: RegExpExecArray | null = null

    if (str.includes('/artworks/')) {
      // 新版 url
      test = /artworks\/(\d*\d)/.exec(str)
    } else if (str.includes('illust_id')) {
      // 传统 url
      test = /illust_id=(\d*\d)/.exec(str)
    }

    if (test && test.length > 1) {
      return test[1]
    } else {
      return ''
    }
  }

  /**从 url 里获取 novel id。如果查找不到 id 会返回空字符串 */
  // https://www.pixiv.net/novel/show.php?id=12771688
  static getNovelId(url?: string) {
    if (pageType.type === pageType.list.Unlisted) {
      return Utils.getURLPathField(window.location.pathname, 'unlisted')
    }

    const str = url || window.location.href
    let result = ''

    const test = str.match(/novel\/show.php\?id=(\d*)?/)
    if (test && test.length > 1) {
      result = test[1]
    }

    return result
  }

  /**从 DOM 元素中获取作品的 id
   *
   * 如果查找不到 id 会返回空字符串
   */
  static findWorkIdFromElement(
    el: HTMLElement,
    type: 'illusts' | 'novels' = 'illusts'
  ): string {
    let a: HTMLAnchorElement
    if (el.nodeName === 'A') {
      a = el as HTMLAnchorElement
    } else {
      if (type === 'illusts') {
        a = el.querySelector('a[href*="/artworks/"]') as HTMLAnchorElement
      } else {
        a = el.querySelector('a[href*="/novel/show"]') as HTMLAnchorElement
      }
    }
    if (!a) {
      return ''
    }
    if (type === 'illusts') {
      return this.getIllustId(a.href)
    } else {
      return this.getNovelId(a.href)
    }
  }

  // 获取当前页面的用户 id
  // 这是一个不够可靠的 api
  // 测试：在 https://www.pixiv.net/artworks/79399027 获取 userId ，正确的结果应该是 13895186
  static getUserId() {
    const newRegExp = /\/users\/(\d+)/ // 获取 /users/ 后面连续的数字部分，也就是用户的 id

    // 列表页里从 url 中获取
    const test4 = newRegExp.exec(location.pathname)
    if (!!test4 && test4.length > 1 && !!test4[1]) {
      return test4[1]
    }

    // 获取包含用户 id 的元素，注意这些选择器可能会变，需要进行检查
    const testA: HTMLAnchorElement | null =
      document.querySelector('aside a') || document.querySelector('nav a')
    // 第一个元素是作品页内，作品下方的作者头像区域的 a 标签
    // 第一个元素是作品页内，页面右侧作者信息区域的 a 标签
    // 第二个元素是用户主页或列表页里，“主页”按钮的 a 标签
    if (testA && testA.href) {
      const test5 = newRegExp.exec(testA.href)
      if (!!test5 && test5.length > 1 && !!test5[1]) {
        return test5[1]
      }
    }

    // 从旧版页面的 head 元素的 script 脚本内容里匹配这一部分
    // pixiv.context.user.id = "<userid>"
    const test1 = /user.id = "(\d*)"/.exec(document.head.innerHTML)
    if (test1 && test1.length > 0) {
      return test1[1]
    }

    // 从旧版页面的 head 元素的 script 脚本内容里匹配这一部分
    // pixiv.context.userId = "<userid>"
    const test2 = /userId = "(\d*)"/.exec(document.head.innerHTML)
    if (test2 && test2.length > 0) {
      return test2[1]
    }

    // 最后从 body 里匹配
    // Warning ：这有可能会匹配到错误的（其他）用户 id！
    const test3 = newRegExp.exec(document.body.innerHTML)
    if (test3) {
      return test3[1]
    }

    // 如果都没有获取到
    throw new Error('getUserId failed!')
  }

  // 将元素插入到 Pixiv 页面顶部
  /*
  newindex-inner 是在未登录时的用户作品列表页面使用的
  layout-body 是在未登录时的搜索页使用的
  */
  static insertToHead<T extends Element>(el: T): T {
    if (document.body) {
      document.body.insertAdjacentElement('afterbegin', el)
    } else {
      ;(
        document.querySelector('.newindex-inner')! ||
        document.querySelector('.layout-body')!
      ).insertAdjacentElement('beforebegin', el)
    }
    return el
  }

  // 寻找 slot，本程序使用的 slot 都要有 data-name 属性
  static findSlot(name: string) {
    const slot = document.querySelector(`slot[data-name=${name}]`)
    if (!slot) {
      throw new Error(`No such slot: ${name}`)
    }
    return slot
  }

  // 使用指定的插槽
  static useSlot(name: string, element: string | HTMLElement) {
    const slot = this.findSlot(name)

    if (typeof element === 'string') {
      // 插入字符串形式的元素
      // 这里不直接使用 insertAdjacentElement 是为了可以返回生成的元素
      const wrap = document.createElement('div')
      wrap.innerHTML = element
      const el = wrap.children[0]
      slot.appendChild(el)
      return el
    } else {
      // 插入 html 元素
      slot.appendChild(element)
      return element
    }
  }

  // 清空指定的插槽
  static clearSlot(name: string) {
    this.findSlot(name).innerHTML = ''
  }

  // 创建下载面板上的通用按钮
  // 注意 textFlag 和 titleFlag 必须是 LangText 里存在的属性，这是为了能根据语言设置动态切换文本
  // 如果 text 和 title 是直接设置的字符串，那么不应该使用这个方法设置，而是由调用者自行设置
  static addBtn(
    slot: string,
    bg: string = '',
    textFlag: string = '',
    titleFlag: string = ''
  ) {
    const e = document.createElement('button')
    e.type = 'button'
    e.style.backgroundColor = bg
    textFlag && e.setAttribute('data-xztext', textFlag)
    titleFlag && e.setAttribute('data-xztitle', titleFlag)

    this.useSlot(slot, e)
    lang.register(e)
    return e
  }

  /**获取页面标题 */
  // 删除了下载器在标题上添加的状态
  static getPageTitle() {
    let result = document.title
      .replace(/\[(↑|→|▶|↓|║|■|✓| )\]/, '')
      .replace(/^ (\d+) /, '')

    // 如果开头有空格则去掉空格
    if (result.startsWith(' ')) {
      result = result.replace(/ */, '')
    }

    return result
  }

  // 自定义的类型保护
  /**判断 Tags 类型 */
  static isArtworkTags(
    data: artworkDataTagsItem | novelDataTagsItem
  ): data is artworkDataTagsItem {
    return (<artworkDataTagsItem>data).translation !== undefined
  }

  /**判断作品数据是图像作品还是小说作品 */
  static isArtworkData(data: ArtworkData | NovelData): data is ArtworkData {
    return (<ArtworkData>data).body.illustType !== undefined
  }

  /**从作品数据里提取出 tag 列表
   *
   * 可选参数 type:
   *
   * 'origin' 默认值，获取原版 tag
   *
   * 'transl' 获取翻译后的 tag。只有图片作品有翻译，小说作品的 tag 没有翻译。如果某个 tag 没有翻译，则会保存它的原版 tag
   *
   * 'both' 同时获取原版 tag 和翻译后的 tag。此时可能会有重复的值，所以返回值做了去重处理。
   */
  static extractTags(
    data: ArtworkData | NovelData,
    type: 'origin' | 'transl' | 'both' = 'origin'
  ) {
    const tags: string[] = []
    const tagsTransl: string[] = []

    const tagArr: artworkDataTagsItem[] | novelDataTagsItem[] =
      data.body.tags.tags

    for (const tagData of tagArr) {
      // 添加原版 tag
      tags.push(tagData.tag)

      // 添加翻译的 tag
      if (this.isArtworkTags(tagData)) {
        if (tagData.translation && tagData.translation.en) {
          // 不管是什么语种的翻译结果，都保存在 en 属性里
          tagsTransl.push(tagData.translation.en)
        } else {
          // 如果没有翻译，则把原 tag 保存到翻译里
          tagsTransl.push(tagData.tag)
        }
      } else {
        // 没有翻译
        tagsTransl.push(tagData.tag)
      }
    }

    if (type === 'origin') {
      return tags
    } else if (type === 'transl') {
      return Array.from(new Set(tagsTransl))
    } else {
      return Array.from(new Set(tags.concat(tagsTransl)))
    }
  }

  /**转换 thumb url
   *
   * 因为现在 pixiv 的多图作品的数据里，thumb url 只是第一张图的，后面的图片没有 thumb url 数据
   *
   * 此方法使用另一套缩略图 url，这样所有的图片都能够获得可用的缩略图 url
   */
  // 现在的多图作品，有些是所有图片都有 250px 的缩略图，此时作品数据里的 thubm url 含有 img-master，例如：
  // https://i.pximg.net/c/250x250_80_a2/img-master/img/2021/11/28/18/30/25/94433369_p0_square1200.jpg
  // 有些作品的 thumb url 里是 custom-thumb，例如：
  // https://i.pximg.net/c/250x250_80_a2/custom-thumb/img/2021/03/03/06/29/53/88179809_p0_custom1200.jpg
  // 这种只有第一张图有缩略图，后面的图片没有缩略图。对于这种情况，将其替换成所有图片都有缩略图的 url。（即第一种 url）
  static convertArtworkThumbURL(thumbURL: string, no: number | string) {
    return thumbURL
      .replace('250x250_80_a2/custom-thumb', '250x250_80_a2/img-master')
      .replace('custom1200', 'square1200')
      .replace('p0', 'p' + no)
  }

  static readonly convertThumbURLReg = /img\/(.*)_.*1200/

  static convertThumbURLTo540px(url: string) {
    // 'https://i.pximg.net/c/250x250_80_a2/custom-thumb/img/2021/10/26/00/00/08/93686259_p0_custom1200.jpg'
    // 'https://i.pximg.net/c/250x250_80_a2/img-master/img/2019/06/23/17/29/27/75369283_square1200.jpg'
    // 排行榜页面的图片 URL 如：
    // 'https://i.pximg.net/c/240x480/img-master/img/2022/08/01/17/59/39/100156836_p0_master1200.jpg'
    const test = url.match(this.convertThumbURLReg)
    if (!test || !test[1]) {
      return url
    }
    // '2021/10/26/00/00/08/93686259_p0'
    // '2019/06/23/17/29/27/75369283'
    const array = test[1].split('/')
    const id_index = array.pop()
    const datetime = array.join('/')
    return `https://i.pximg.net/c/540x540_70/img-master/img/${datetime}/${id_index}_master1200.jpg`
  }

  // 旧版本的 Result 数据中没有 index 属性，使用此方法进行兼容性处理
  static getResultIndex(data: Result) {
    if (data.type === 0 || data.type === 1) {
      // 插画和漫画，从 id 里取出序号
      return parseInt(/\d*$/.exec(data.id)![0])
    } else {
      // 其他作品类型只有 1 个文件所以值为 0
      return 0
    }
  }

  static isPremium() {
    // 在 body 的一个 script 标签里包含有当前用户是否是会员的信息
    // premium: 'yes'
    // premium: 'no'
    const test = document.body.innerHTML.match(/premium: '(\w+)'/)
    if (test && test.length > 1) {
      return test[1] === 'yes'
    }

    return false
  }

  // 在小说页面，以及某些特定页面里，不启用"显示更大的缩略图"和“横图占用二倍宽度”功能
  static notEnabledShowLargerThumb() {
    if (
      window.location.pathname.includes('/novel') ||
      window.location.pathname.includes('/ranking_area') ||
      window.location.hostname.includes('pixivision.net')
    ) {
      return true
    }
    return false
  }

  // 传入作品 id，生成作品页面的超链接
  /**
   *
   * @param id 作品 id
   * @param artwork true 图像作品； false 小说作品。默认为图像作品
   * @returns 超链接（A 标签）
   */
  static createWorkLink(id: number | string, artwork = true) {
    const idNum = typeof id === 'number' ? id : Number.parseInt(id)
    const href = `https://www.pixiv.net/${artwork ? 'i' : 'n'}/${idNum}`
    return `<a href="${href}" target="_blank">${id}</a>`
  }

  /**替换 EPUB 文本里的特殊字符和换行符 */
  // 换行符必须放在最后处理，以免其 < 符号被替换
  static replaceEPUBText(str: string) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/&lt;br/g, '<br')
      .replace(/\n/g, '<br/>')
  }

  /** 在 zip 压缩包里查找类似于 000000.jpg 的标记，返回它后面的位置的下标
   *
   * @param zipFile  Zip 文件的内容
   * @param existingIndexList  可选传入一个已存在的索引列表。如果传入，那么这个方法在搜索 zip 文件里的图片时，不会查找已有索引的部分（也就是不会重复查找文件的前半部分），只会查找没有索引的部分
   * @returns number[] 返回一个索引列表的数组
   *
   */
  static getJPGContentIndex(
    zipFile: ArrayBuffer,
    existingIndexList?: number[]
  ) {
    let indexList: number[] = []
    if (existingIndexList && existingIndexList.length > 0) {
      indexList = existingIndexList
    }

    // 每次查找时，开始的位置
    let offset = 0
    // 循环的次数
    let loopTimes = 0
    while (true) {
      // 如果当前偏移量的后面有已经查找到的索引，就不必重复查找了
      // 跳过这次循环，下次直接从已有的索引后面开始查找
      if (indexList[loopTimes] !== undefined && offset < indexList[loopTimes]) {
        offset = indexList[loopTimes]
        ++loopTimes
        continue
      }

      let data: Uint8Array
      if (offset === 0) {
        // 一开始从数据开头查找
        data = new Uint8Array(zipFile)
      } else {
        // 每次查找之后，从上次查找结束的位置开始查找
        // 这样可以避免重复查找前面的数据
        data = new Uint8Array(zipFile, offset)
      }

      // 查找以 jpg 文件名的标记，如 000000.jpg
      // 其实文件内容里也可能会出现符合条件的数据，只是概率很小
      // 有些文件名后面有 PK 标记，如 000000.jpgPK，需要排除，因为这是 zip 的文件目录，不是图片
      const index = data.findIndex((val, index2, array) => {
        // 0 0 0 . j p g P
        if (
          val === 48 &&
          array[index2 + 1] === 48 &&
          array[index2 + 2] === 48 &&
          array[index2 + 6] === 46 &&
          array[index2 + 7] === 106 &&
          array[index2 + 8] === 112 &&
          array[index2 + 9] === 103 &&
          array[index2 + 10] !== 80
        ) {
          // const enc = new TextDecoder('utf-8')
          // const buff = data.slice(index2, index2 + 10)
          // console.log(enc.decode(buff))
          return true
        }
        return false
      })

      if (index !== -1) {
        const fileContentStart = offset + index + 10
        indexList[loopTimes] = fileContentStart
        offset = fileContentStart
        ++loopTimes
      } else {
        return indexList
      }
    }
  }

  /**从 zip 压缩包里提取出图像数据 */
  static async extractImage(
    zipFile: ArrayBuffer,
    indexList: number[],
    target: 'ImageBitmap'
  ): Promise<ImageBitmap[]>

  static async extractImage(
    zipFile: ArrayBuffer,
    indexList: number[],
    target: 'img'
  ): Promise<HTMLImageElement[]>

  static async extractImage(
    zipFile: ArrayBuffer,
    indexList: number[],
    target: 'img' | 'ImageBitmap'
  ) {
    return new Promise(async (resolve, reject) => {
      const result: HTMLImageElement[] | ImageBitmap[] = []
      let i = 0
      for (const index of indexList) {
        // 起始位置
        const start = index
        // 截止下一个文件名之前
        // 删除不需要的数据：
        // 30 字节的是 zip 文件添加的数据，虽然没有实际影响，但还是去掉
        // 10 字节的是下一个 jpg 的文件名
        let end = indexList[i + 1] - 30 - 10
        if (i === indexList.length - 1) {
          // 如果是最后一个 jpg 文件，则截止到 zip 文件的结尾
          // 这导致它会包含 zip 的目录数据，但是不会影响图片的显示
          end = zipFile.byteLength
        }

        const blob = new Blob([zipFile.slice(start, end)], {
          type: 'image/jpeg',
        })
        if (target === 'ImageBitmap') {
          const map = await createImageBitmap(blob)
          ;(result as ImageBitmap[]).push(map)
        } else if (target === 'img') {
          const url = URL.createObjectURL(blob)
          const img = await Utils.loadImg(url)
          ;(result as HTMLImageElement[]).push(img)
        }
        ++i
      }
      resolve(result)
    })
  }

  /**根据 illustType，返回作品类型的描述字符串 */
  // 主要用于储存进 idList
  static getWorkTypeString(
    illustType: 0 | 1 | 2 | 3 | '0' | '1' | '2' | '3'
  ): WorkTypeString {
    switch (parseInt(illustType.toString())) {
      case 0:
        return 'illusts'
      case 1:
        return 'manga'
      case 2:
        return 'ugoira'
      case 3:
        return 'novels'
      default:
        return 'unknown'
    }
  }
}

export { Tools }
