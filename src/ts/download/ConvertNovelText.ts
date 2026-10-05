import browser from 'webextension-polyfill'
import { EVT } from '../EVT'
import { log } from '../Log'
import { lang } from '../Language'
import { Tools } from '../Tools'
import { settings, SettingChangeData } from '../setting/Settings'
import { IDData } from '../store/StoreType'
import { ChineseLang } from '../utils/ChineseLang'

/** 小说正文的简繁转换方向 */
type ConvertMode = 'none' | 'cn2tw' | 'tw2cn'

/** 需要加载 opencc 的转换方向 */
type LoadedMode = Exclude<ConvertMode, 'none'>

const workerFile = 'lib/opencc.worker.js'

/**
 * 转换方向对应的 opencc 字典文件、以及传给 opencc 的转换配置。
 *
 * 简 -> 繁输出到 twp（台湾繁体，并转换台湾常用词）。
 * 繁 -> 简必须从 twp 输入，否则「軟體」「記憶體」「資訊」等台湾用词
 * 会被转成「软体」「记忆体」「资讯」这样的错误简体词。
 */
const modeConfig = {
  cn2tw: {
    file: 'lib/opencc-cn2t.js',
    option: { from: 'cn', to: 'twp' },
  },
  tw2cn: {
    file: 'lib/opencc-t2cn.js',
    option: { from: 'twp', to: 'cn' },
  },
} as const

/**
 * 转换小说正文的用字（简体中文与繁体中文互换）。
 *
 * 字典文件体积较大（简转繁约 1 MB，繁转简约 100 KB），所以不在页面里预先加载，
 * 而是在用户启用或切换转换方向时才加载，并在 worker 里执行转换，避免阻塞主线程。
 *
 * 转换的范围是小说正文、元数据里的标题与简介、系列的设定资料；不转换文件名。
 *
 * ⚠️ 只对中文内容生效，而且必须是「与目标用字相反」的中文：日语等其他语言要跳过，
 * 原文已经是目标用字的（开启了简转繁、但原文就是繁体）也要跳过，
 * 无法判断字形的（语言标签为空、或 zh 这样没有次标签的）同样跳过。详见 needConvert()。
 */
class ConvertNovelText {
  private worker: Worker | null = null
  private workerMode: LoadedMode | null = null
  private loading: Promise<void> | null = null
  /** 正在加载的字典文件对应的方向。切换方向时要等上一次加载结束，否则会用到错方向的字典 */
  private loadingMode: LoadedMode | null = null
  /** 自增 id，用于区分并发的转换请求 */
  private messageId = 0

  constructor() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail?.data as SettingChangeData
      if (data?.name !== 'convertNovelText') {
        return
      }
      // 用户启用或切换了转换方向时，加载对应的字典文件
      this.prepare().catch(() => {})
    })
  }

  /**
   * 判断是否需要转换用字。
   *
   * 必须同时满足两个条件，否则跳过：
   *
   * 1. 内容是中文。opencc 的字典是为中文准备的，如果对日语执行转换，会把日语汉字
   *    改成中文的写法，例如「図書館」变成「図书馆」、「携帯電話」变成「携帯电话」，
   *    这是错的。pixiv 上的小说绝大多数是日语，所以这个判断不能省略。
   * 2. 内容的用字与转换的目标用字相反。原文已经是目标用字时不需要转换：
   *    开启了「简体转繁体」、但原文本来就是繁体，转换后并不会产生更好的结果，
   *    反而可能把地区用词改掉（如繁转简会把「軟體」变成「软体」）。
   *
   * 无法判断时也跳过：语言标签为空、或者是 zh 这样没有次标签的标签时，
   * 并不知道它是不是中文，而把非中文内容丢进 opencc 会破坏文本。
   *
   * ⚠️ `EPUBSetting.applyNovelTextConvert()` 的判断必须与此保持一致，
   * 否则会出现「正文没转换、但语言标签却变了」的情况。
   */
  private needConvert(language?: string): boolean {
    const mode = settings.convertNovelText
    if (mode === 'none') {
      return false
    }
    const script = ChineseLang.getScript(language)
    // 对于非中文、未知（语言标签为空）的内容，跳过转换
    if (script === 'notChinese' || script === 'unknown') {
      return false
    }
    return mode === 'cn2tw' ? script !== 'traditional' : script !== 'simplified'
  }

  /** 转换开始前输出日志。不需要转换时不输出 */
  public logStart(idData: IDData, language?: string) {
    const mode = settings.convertNovelText
    if (mode === 'none' || !this.needConvert(language)) {
      return
    }
    const direction = lang.transl(
      mode === 'cn2tw' ? '_简体转繁体' : '_繁体转简体'
    )
    log.log(
      lang.transl(
        '_转换这篇小说的语言',
        direction,
        Tools.createWorkLinkByIDData(idData)
      )
    )
  }

  /**
   * 转换小说文本。
   * language 是这份内容原本的语言标签，用于判断是否需要转换；不需要转换时原样返回。
   * 转换失败时也返回原文，不中断下载。
   */
  public async convert(content: string, language?: string): Promise<string> {
    const mode = settings.convertNovelText
    if (mode === 'none' || !content || !this.needConvert(language)) {
      return content
    }

    try {
      await this.prepare()
      return await this.convertInWorker(content, mode)
    } catch (error) {
      log.error(
        lang.transl(
          '_转换小说的语言失败',
          lang.transl(mode === 'cn2tw' ? '_简体转繁体' : '_繁体转简体')
        )
      )
      return content
    }
  }

  /** 确保当前转换方向对应的 worker 已经就绪 */
  private async prepare(): Promise<void> {
    const mode = settings.convertNovelText
    if (mode === 'none') {
      this.destroy()
      return
    }

    if (this.worker && this.workerMode === mode) {
      return
    }

    // 避免并发时重复加载。如果正在加载的是另一个方向的字典（用户快速切换了方向），
    // 必须等它结束再重新加载，否则会拿到错方向的字典
    if (this.loading) {
      if (this.loadingMode === mode) {
        return this.loading
      }
      await this.loading
      if (this.worker && this.workerMode === mode) {
        return
      }
    }

    this.loadingMode = mode
    this.loading = this.createWorker(mode)
    try {
      await this.loading
    } finally {
      this.loading = null
      this.loadingMode = null
    }
  }

  private async createWorker(mode: LoadedMode): Promise<void> {
    this.destroy()

    const config = modeConfig[mode]
    const [libRes, workerRes] = await Promise.all([
      fetch(browser.runtime.getURL(config.file)),
      fetch(browser.runtime.getURL(workerFile)),
    ])
    if (!libRes.ok || !workerRes.ok) {
      throw new Error(`Failed to load ${config.file}`)
    }
    const [libText, workerText] = await Promise.all([
      libRes.text(),
      workerRes.text(),
    ])

    // 把 opencc 的 UMD 文件和 worker 脚本合并成一个 blob
    const url = URL.createObjectURL(
      new Blob([libText, '\n', workerText], {
        type: 'application/javascript',
      })
    )
    const worker = new Worker(url)
    URL.revokeObjectURL(url)
    worker.onerror = (ev) => {
      console.error('[ConvertNovelText] worker error:', ev.message)
    }
    this.worker = worker
    this.workerMode = mode
  }

  private convertInWorker(text: string, mode: LoadedMode): Promise<string> {
    return new Promise((resolve, reject) => {
      const worker = this.worker
      if (!worker) {
        reject(new Error('opencc worker is not ready'))
        return
      }

      const id = ++this.messageId
      const timeoutId = window.setTimeout(() => {
        worker.removeEventListener('message', handler)
        reject(new Error('Convert novel text timeout'))
      }, 120000)

      const handler = (ev: MessageEvent) => {
        if (ev.data?.id !== id) {
          return
        }
        window.clearTimeout(timeoutId)
        worker.removeEventListener('message', handler)
        if (ev.data.error) {
          reject(new Error(ev.data.error))
        } else if (typeof ev.data.result !== 'string') {
          console.error('[ConvertNovelText] invalid worker response:', ev.data)
          reject(new Error('Invalid opencc worker response'))
        } else {
          resolve(ev.data.result)
        }
      }
      worker.addEventListener('message', handler)

      worker.postMessage({ id, mode: modeConfig[mode].option, text })
    })
  }

  private destroy() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
      this.workerMode = null
    }
  }
}

const convertNovelText = new ConvertNovelText()
export { convertNovelText }
