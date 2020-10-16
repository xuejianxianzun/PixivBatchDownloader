import { EVT } from '../EVT'
import { UgoiraInfo } from '../CrawlResult'

declare const zip: any

// 从 zip 提取图片数据
class ExtractImage {
  constructor() {
    this.loadWorkerJS()
  }

  private async loadWorkerJS() {
    if ('zip' in window === false) {
      return
    }

    // 添加 zip 的 worker 文件
    let zipWorker = await fetch(chrome.extension.getURL('lib/z-worker.js'))
    const zipWorkerBolb = await zipWorker.blob()
    const zipWorkerUrl = URL.createObjectURL(zipWorkerBolb)
    zip.workerScripts = {
      inflater: [zipWorkerUrl],
    }
  }

  // 解压 zip 文件，把里面的图片转换成 DataURL
  public async extractImageAsDataURL(
    zipFile: any,
    ugoiraInfo: UgoiraInfo,
  ): Promise<string[]> {
    return new Promise(function (resolve, reject) {
      zip.createReader(
        new zip.BlobReader(zipFile),
        (zipReader: any) => {
          // 读取成功时的回调函数，files 保存了文件列表的信息
          zipReader.getEntries((files: object[]) => {
            // 创建数组，长度与文件数量一致
            const imgFile: string[] = new Array(files.length)
            // 获取每个文件的数据。因为这个操作是异步的，所以必须检查图片数量
            files.forEach((file: any) => {
              file.getData(
                new zip.Data64URIWriter(ugoiraInfo.mime_type),
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
                },
              )
            })
          })
        },
        (message: any) => {
          EVT.fire(EVT.list.readZipError)
          reject(new Error('ReadZIP error: ' + message))
        },
      )
    })
  }
}

const extractImage = new ExtractImage()
export { extractImage }
