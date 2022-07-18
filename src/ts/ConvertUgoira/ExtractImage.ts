import { EVT } from '../EVT'
import { UgoiraInfo } from '../crawl/CrawlResult'
import { Utils } from '../utils/Utils'

declare const zip: any

interface ExtractImageData {
  buffer: ArrayBuffer
  img: HTMLImageElement
}

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
    let zipWorker = await fetch(chrome.runtime.getURL('lib/z-worker.js'))
    const zipWorkerBolb = await zipWorker.blob()
    const zipWorkerUrl = URL.createObjectURL(zipWorkerBolb)
    zip.workerScripts = {
      inflater: [zipWorkerUrl],
    }
  }

  // 解压 zip 文件，把里面的图片转换成 DataURL
  public async extractImageAsDataURL(
    zipFile: any,
    ugoiraInfo: UgoiraInfo
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
                }
              )
            })
          })
        },
        (message: any) => {
          EVT.fire('readZipError')
          reject(new Error('ReadZIP error: ' + message))
        }
      )
    })
  }

  public async extractImage(zipFile: ArrayBuffer, indexList: number[]): Promise<ExtractImageData[]> {
    return new Promise(async (resolve, reject) => {
      const result: ExtractImageData[] = []
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
        // slice 方法的 end 不会包含在结果里
        const buffer = zipFile.slice(start, end)
        const blob = new Blob([buffer], {
          type: 'image/jpeg',
        })
        const url = URL.createObjectURL(blob)
        const img = await Utils.loadImg(url)
        result.push({
          buffer: buffer,
          img: img,
        })
        ++i
      }
      resolve(result)
    })
  }

  /** 查找类似于 000000.jpg 的标记，返回它后面的位置的下标  
   * 
   * @param zipFile  Zip 文件的内容
   * @param existingIndexList  可选传入一个已存在的索引列表。如果传入，那么这个方法在搜索 zip 文件里的图片时，不会查找已有索引的部分（也就是不会重复查找文件的前半部分），只会查找没有索引的部分
   * @returns number[] 返回一个索引列表的数组
   * 
  */
  // zip 文件结尾有 000000.jpgPK 这样的标记，需要排除，因为这是 zip 的文件目录，不是图片
  public getJPGContentIndex(zipFile: ArrayBuffer, existingIndexList?: number[]) {
    let indexList: number[] = []
    if (existingIndexList && existingIndexList.length > 0) {
      indexList = existingIndexList
    }

    // 每次查找时，开始的位置
    let offset = 0
    // 循环的次数
    let loopTimes = 0

    // console.time('getJPGContentIndex')
    while (true) {
      // 如果当前偏移量的后面有已经查找到的索引，就不必重复查找了
      // 跳过这次循环，下次直接从已有的索引后面开始查找
      if (
        indexList[loopTimes] !== undefined &&
        offset < indexList[loopTimes]
      ) {
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

      // 查找以 0 开头，长度为 10，以 jpg 结束的值的索引
      const index = data.findIndex((val, index2, array) => {
        // 0 j p g P
        if (
          val === 48 &&
          array[index2 + 7] === 106 &&
          array[index2 + 8] === 112 &&
          array[index2 + 9] === 103 &&
          array[index2 + 10] !== 80
        ) {
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
    // console.timeEnd('getJPGContentIndex')
  }
}

const extractImage = new ExtractImage()
export { extractImage }
