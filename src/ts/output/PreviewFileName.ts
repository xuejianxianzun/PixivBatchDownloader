import { store } from '../store/Store'
import { EVT } from '../EVT'
import { fileName } from '../FileName'
import { lang } from '../Lang'
import { Config } from '../config/Config'
import { toast } from '../Toast'
import { Tools } from '../Tools'
import { Colors } from '../config/Colors'

// 预览文件名
class PreviewFileName {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.previewFileName, () => {
      this.previewFileName()
    })

    const prevBtn = Tools.addBtn('namingBtns', Colors.bgGreen, '_预览文件名')

    prevBtn.addEventListener(
      'click',
      () => {
        EVT.fire('previewFileName')
      },
      false
    )

    prevBtn.style.display = 'none'

    window.addEventListener(EVT.list.crawlStart, () => {
      prevBtn.style.display = 'none'
    })

    window.addEventListener(EVT.list.readyDownload, () => {
      prevBtn.style.display = 'flex'
    })
  }

  private previewFileName() {
    if (store.result.length === 0) {
      return toast.error(lang.transl('_没有可用的抓取结果'))
    }

    // 使用数组储存和拼接字符串，提高性能
    const resultArr: string[] = []
    let result = ''

    const length = store.result.length
    if (length < Config.outputMax) {
      // 输出结果，添加 html 标签
      for (let i = 0; i < length; i++) {
        const data = store.result[i]

        // 生成文件名，并为文件名添加颜色显示
        // 只有当文件数量少于限制值时才添加颜色。这是因为添加颜色会导致生成的 HTML 元素数量增多，渲染和复制时的资源占用增多
        const part = fileName.createFileName(data).split('/')
        const length = part.length
        for (let i = 0; i < length; i++) {
          const str = part[i]
          if (i < length - 1) {
            // 如果不是最后一项，说明是文件夹名，添加特定的颜色
            part[i] = `<span class="colorFolder">${str}</span>`
          } else {
            // 最后一项是文件名，设置为黑色
            part[i] = `<span class="color000">${str}</span>`
          }
        }
        const fullNameHtml = part.join('/')

        if (data.type !== 3) {
          // 对于图片作品，在文件名前面显示默认文件名
          // 默认文件名有两种选择，一种是使用 url 里的文件名，一种是使用 data.id。这里使用前者，方便用户用其他下载软件下载后，复制输出的内容制作重命名脚本
          const defaultName = data.original.replace(/.*\//, '')
          const nowResult = `<p class="result"><span class="color999">${defaultName}</span>: ${fullNameHtml}</p>`
          resultArr.push(nowResult)
        } else {
          // 小说作品不显示原文件名（因为没有此数据）
          const nowResult = `<p class="result">${fullNameHtml}</p>`
          resultArr.push(nowResult)
        }
      }

      result = resultArr.join('')
    } else {
      // 不生成 html 标签，只生成纯文本，保存为 txt 文件
      for (let i = 0; i < length; i++) {
        const data = store.result[i]
        const fullName = fileName.createFileName(data)

        if (data.type !== 3) {
          // 图片作品，在文件名前面显示文件 url 里的文件名
          let defaultName = data.original.replace(/.*\//, '')
          resultArr.push(`${defaultName}: ${fullName}`)
        } else {
          // 小说作品不显示原文件名（因为没有此数据）
          resultArr.push(fullName)
        }
      }

      result = resultArr.join('\n')
    }

    EVT.fire('output', {
      content: result,
      title: '_预览文件名',
    })
  }
}

new PreviewFileName()
