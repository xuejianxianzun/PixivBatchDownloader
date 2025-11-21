import './ManageFollowing'
import { DonwloadListData, SendToBackEndData } from './download/DownloadType.d'
import browser from 'webextension-polyfill'

// 当点击扩展图标时，显示/隐藏下载面板
browser.action.onClicked.addListener(function (tab) {
  // 如果在本程序没有权限的页面上点击扩展图标，url 始终是 undefined，此时不发送消息
  if (!tab.url) {
    return
  }

  browser.tabs.sendMessage(tab.id!, {
    msg: 'click_icon',
  })
})

// 当扩展被安装、被更新、或者浏览器升级时，初始化数据
browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({ batchNo: {}, idList: {} })
})

// 存储每个下载任务的数据，这是因为下载完成的顺序和前台发送的顺序可能不一致，所以需要把数据保存起来以供使用
const dlData: DonwloadListData = {}
// 当浏览器开始下载一个由前台传递的文件时，会把一些数据保存到 dlData 里
// 当浏览器把这个文件下载完毕之后，从 dlData 里取出保存的数据
// 注意：虽然 Service worker 被回收时，变量也会被清空，但是这对于 dlData 的使用没有影响
// 只要在 Service worker 被回收之前，浏览器把传递给它的下载任务全部下载完了，dlData 里保存的数据也就不再需要使用了，所以即使此时被清空了也无所谓。
// 如果浏览器还没有把传递给它的下载任务全部下载完成，Service worker 就已经被回收，那么会有影响（文件下载完成之后找不到之前保存的数据了）。但是理论上，浏览器正在执行下载任务时这个 Service worker 不会被回收，所以不会发生下载完成前就被回收的情况。

type batchNoType = { [key: string]: number }
type idListType = { [key: string]: string[] }

// 使用每个页面的 tabId 作为索引，储存此页面里当前下载任务的编号。用来判断不同批次的下载
let batchNo: batchNoType = {}

// 使用每个页面的 tabId 作为索引，储存此页面里所发送的下载请求的作品 id 列表，用来判断重复的任务
let idList: idListType = {}

// batchNo 和 idList 需要持久化存储（但是当浏览器关闭并重新启动时可以清空，因为此时前台的下载任务必然和浏览器关闭之前的不是同一批了，所以旧的数据已经没用了）
// 如果不进行持久化存储，如果前台任务处于下载途中，后台 SW 被回收了，那么变量也会被清除。之后前台传递过来的可能还是同一批下载里的任务，但是后台却丢失了记录。这可能会导致下载出现重复文件等异常。
// 实际上，下载时后台 SW 会持续存在很长时间，不会轻易被回收的。持久化存储只是为了以防万一

async function setData(data: { [key: string]: any }) {
  return browser.storage.local.set(data)
}

// 类型守卫，这是为了通过类型检查，所以只要求有 msg 属性
// 如果检查了其他属性，那么对于只有 msg 属性的简单消息就会不通过。所以不检查其他属性
function isMsg(msg: any): msg is SendToBackEndData {
  return !!msg.msg
}

browser.runtime.onMessage.addListener(async function (
  msg: unknown,
  sender: browser.Runtime.MessageSender
) {
  // msg 是 SendToBackEndData 类型，但是 webextension-polyfill 的 msg 是 unknown，
  // 不能直接在上面设置类型为 msg: SendToBackEndData，否则会报错。因此需要使用类型守卫，真麻烦
  if (!isMsg(msg)) {
    console.warn('收到了无效的消息:', msg)
    return
  }
  // console.log(msg)
  const tabId = sender.tab!.id!

  // 下载作品的文件
  if (msg.msg === 'save_work_file') {
    // 当处于初始状态时，或者变量被回收了，就从存储中读取数据储存在变量中
    // 之后每当要使用这两个数据时，从变量读取，而不是从存储中获得。这样就解决了数据不同步的问题，而且性能更高
    if (Object.keys(batchNo).length === 0) {
      const data = await browser.storage.local.get(['batchNo', 'idList'])
      batchNo = data.batchNo as batchNoType
      idList = data.idList as idListType
    }

    // 如果开始了新一批的下载，重设批次编号，并清空下载索引
    if (batchNo[tabId] !== msg.taskBatch) {
      batchNo[tabId] = msg.taskBatch
      idList[tabId] = []
      setData({ batchNo, idList })
      // 这里存储数据时不需要使用 await，因为后面使用的是全局变量，所以不需要关心存储数据的同步问题
    }

    // 检查任务是否重复，不重复则下载
    if (!idList[tabId].includes(msg.id)) {
      // 储存该任务的索引
      idList[tabId].push(msg.id)
      setData({ idList })

      // 开始下载
      const _url = await getFileURL(msg)
      browser.downloads
        .download({
          url: _url,
          filename: msg.fileName,
          conflictAction: 'overwrite',
          saveAs: false,
        })
        .then((id) => {
          // id 是新建立的下载项的 id，使用它作为 key 保存数据
          dlData[id] = {
            blobURLFront: msg.blobURL,
            blobURLBack: _url.startsWith('blob:') ? _url : '',
            id: msg.id,
            tabId: tabId,
            uuid: false,
          }
        })
    }
  }

  // 使用 a.download 来下载文件时，不调用 downloads API，并且直接返回下载成功的模拟数据
  if (msg.msg === 'save_work_file_a_download') {
    const tabId = sender.tab!.id!
    const data = {
      msg: 'downloaded',
      data: {
        url: '',
        id: msg.id,
        tabId,
        uuid: false,
      },
      err: '',
    }
    browser.tabs.sendMessage(tabId, data)
  }

  // 有些文件属于某个抓取结果的附加项，本身不在抓取结果 store.result 里，所以也没有它的进度条
  // 对于这些文件直接下载，不需要返回下载结果
  if (
    msg.msg === 'save_description_file' ||
    msg.msg === 'save_novel_cover_file' ||
    msg.msg === 'save_novel_embedded_image'
  ) {
    const _url = await getFileURL(msg)
    browser.downloads
      .download({
        url: _url,
        filename: msg.fileName,
        conflictAction: 'overwrite',
        saveAs: false,
      })
      .then((id) => {
        dlData[id] = {
          blobURLFront: msg.blobURL,
          blobURLBack: _url.startsWith('blob:') ? _url : '',
          id: msg.id,
          tabId: tabId,
          uuid: false,
          noReply: true,
        }
      })
  }

  if (msg.msg === 'clearDownloadsTempData') {
    if (sender.tab?.id) {
      const tabId = sender.tab.id
      delete idList[tabId]
      delete batchNo[tabId]

      setData({ batchNo, idList })
    }
  }
})

const isFirefox = navigator.userAgent.includes('Firefox')

async function getFileURL(msg: SendToBackEndData) {
  // 在 Chrome 的隐私窗口里，使用 dataURL
  if (msg.dataURL) {
    return msg.dataURL
  }

  // 在 Firefox 里，使用 blob 并生成 blob URL
  if (isFirefox && msg.blob) {
    return URL.createObjectURL(msg.blob)
  }

  // 在 Chrome 的正常窗口里，使用 blob URL
  if (msg.blobURL) {
    return msg.blobURL
  }

  console.error('没有找到可用的下载 URL 或数据')
  return ''
}

function revokeBlobURL(url?: string) {
  if (url && url.startsWith('blob:')) {
    if (
      typeof URL !== 'undefined' &&
      typeof URL.revokeObjectURL === 'function'
    ) {
      URL.revokeObjectURL(url)
    }
  }
}

// 判断文件名是否变成了 UUID 格式。因为文件名处于整个绝对路径的中间，所以没加首尾标记 ^ $
const UUIDRegexp =
  /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/

// 监听下载变化事件
// 每个下载会触发两次 onChanged 事件
browser.downloads.onChanged.addListener(async function (detail) {
  // 根据 detail.id 取出保存的数据
  const _dlData = dlData[detail.id]
  if (_dlData) {
    let msg = ''
    let err = ''

    // 判断当前文件名是否正常。下载时必定会有一次 detail.filename.current 有值
    if (detail.filename && detail.filename.current) {
      const changedName = detail.filename.current
      if (changedName.match(UUIDRegexp) !== null) {
        // 文件名是 UUID
        _dlData.uuid = true
      }
    }

    if (detail.state && detail.state.current === 'complete') {
      msg = 'downloaded'
    }

    if (detail.error && detail.error.current) {
      msg = 'download_err'
      err = detail.error.current
      // 当保存一个文件出错时，从任务记录列表里删除它，以便前台重试下载
      const idIndex = idList[_dlData.tabId].findIndex(
        (val) => val === _dlData.id
      )
      idList[_dlData.tabId][idIndex] = ''
      setData({ idList })
    }

    if (msg) {
      // 返回信息
      if (!_dlData.noReply) {
        browser.tabs.sendMessage(_dlData.tabId, { msg, data: _dlData, err })
      }

      // 吊销前后台生成的 blob URL
      revokeBlobURL(_dlData?.blobURLFront)
      revokeBlobURL(_dlData?.blobURLBack)
      // 删除保存的数据
      delete dlData[detail.id]
      dlData[detail.id] = null
    }
  }
})

// 清除不需要的数据，避免数据体积越来越大
async function clearData() {
  for (const key of Object.keys(idList)) {
    const tabId = parseInt(key)
    try {
      await browser.tabs.get(tabId)
    } catch (error) {
      // 如果建立下载任务的标签页已经不存在，则会触发错误，如：
      // Unchecked runtime.lastError: No tab with id: 1943988409.
      // 此时删除对应的数据
      delete idList[tabId]
      delete batchNo[tabId]
    }
  }

  setData({ batchNo, idList })
}

setInterval(() => {
  clearData()
}, 3600000)
