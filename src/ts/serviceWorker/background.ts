import './ManageFollowing'
import './CheckDownloadCount'
import {
  DonwloadListData,
  DonwloadSuccessData,
  SendToBackEndData,
} from '../download/DownloadType'
import browser from 'webextension-polyfill'
import { Config } from '../Config'

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

// 存储每个下载任务的数据。浏览器保存文件期间 service worker 可能被回收，所以需要持久化它以便在下载事件触发时恢复。
let dlData: DonwloadListData = {}

type batchNoType = { [key: string]: number }
type idListType = { [key: string]: string[] }

/** 使用每个标签页的 tabId 作为索引，储存此标签页里当前下载任务的编号。用来判断不同批次的下载 */
let batchNo: batchNoType = {}

/** 使用每个标签页的 tabId 作为索引，储存此标签页发送到 SW 的每个下载请求的作品 id，用来判断重复的任务 */
let idList: idListType = {}

// batchNo、idList 和 dlData 需要持久化存储。浏览器关闭后可以清空它们，因为前台下载任务已经结束。
// service worker 被回收后会从存储恢复这些数据，既能避免重复建立下载项，也能在浏览器完成下载后向前台回传结果。

async function setData(data: { [key: string]: any }) {
  return browser.storage.local.set(data)
}

/** 每次 service worker 启动后，恢复下载任务的临时数据 */
let restoreDownloadDataPromise: Promise<void> | undefined

/** 从持久化存储恢复下载任务的临时数据 */
function restoreDownloadData() {
  if (!restoreDownloadDataPromise) {
    restoreDownloadDataPromise = browser.storage.local
      .get(['batchNo', 'idList', 'dlData'])
      .then((data) => {
        batchNo = (data.batchNo as batchNoType) || {}
        idList = (data.idList as idListType) || {}
        dlData = (data.dlData as DonwloadListData) || {}
      })
  }
  return restoreDownloadDataPromise
}

/** 按顺序持久化下载任务数据，避免多个下载事件互相覆盖 */
let saveDLDataChain: Promise<void> = Promise.resolve()

/** 持久化当前的下载任务数据 */
function saveDLData() {
  const save = () =>
    setData({ dlData }).catch((error) => {
      console.error('保存下载任务数据失败', error)
    })
  saveDLDataChain = saveDLDataChain.then(save, save)
  return saveDLDataChain
}

/** 释放失败任务的去重记录，不影响新批次中相同作品的请求。 */
async function releaseDownloadId(data: DonwloadSuccessData) {
  if (batchNo[data.tabId] !== data.taskBatch) {
    return
  }
  const ids = idList[data.tabId]
  const index = ids?.indexOf(data.id) ?? -1
  if (index < 0) {
    return
  }
  ids.splice(index, 1)
  await setData({ idList }).catch((error) => {
    console.error('保存下载任务记录失败', error)
  })
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
    return false
  }

  await restoreDownloadData()

  const tabId = sender.tab!.id!
  // 当存在同名文件时，默认覆写，但前台也可以指定处理方式
  const conflictAction = msg.conflictAction || 'overwrite'

  // 下载作品的文件
  if (msg.msg === 'save_work_file') {
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

      const data: DonwloadSuccessData = {
        blobURLFront: msg.blobURL,
        blobURLBack: '',
        id: msg.id,
        tabId,
        taskBatch: msg.taskBatch,
        uuid: false,
      }
      try {
        const url = await getFileURL(msg)
        data.blobURLBack = url.startsWith('blob:') ? url : ''
        const id = await browser.downloads.download({
          url,
          filename: msg.fileName,
          conflictAction,
          saveAs: false,
        })
        // 建立下载项不代表保存完成，继续等待 onChanged 返回结果。
        dlData[id] = data
        await saveDLData()
      } catch (error) {
        console.error('建立浏览器下载任务失败', error)
        revokeBlobURL(data.blobURLFront)
        revokeBlobURL(data.blobURLBack)
        await releaseDownloadId(data)
        const runtimeError =
          error instanceof Error ? error.message : String(error)
        await browser.tabs
          .sendMessage(tabId, {
            msg: 'download_err',
            data,
            err: runtimeError,
            runtimeError,
            saveRequestFailed: true,
          })
          .catch((error) => {
            console.error('回发下载失败消息失败', error)
          })
      }
    }
  }

  // 有些文件本身不在抓取结果 store.result 里，所以也不会出现在下载进度条上
  // 对于这些文件直接下载，不需要返回下载结果
  if (
    msg.msg === 'no_reply' ||
    msg.msg === 'save_description_file' ||
    msg.msg === 'save_novel_cover_file' ||
    msg.msg === 'save_novel_embedded_image' ||
    msg.msg === 'save_novel_series_file'
  ) {
    const _url = await getFileURL(msg)
    const id = await browser.downloads.download({
      url: _url,
      filename: msg.fileName,
      conflictAction,
      saveAs: false,
    })
    dlData[id] = {
      blobURLFront: msg.blobURL,
      blobURLBack: _url.startsWith('blob:') ? _url : '',
      id: msg.id,
      taskBatch: msg.taskBatch,
      tabId: tabId,
      uuid: false,
      noReply: true,
    }
    await saveDLData()
  }

  // 使用 a.download 来下载文件时，不调用 downloads API，并且直接返回下载成功的模拟数据
  if (msg.msg === 'save_work_file_a_download') {
    const tabId = sender.tab!.id!
    const data = {
      msg: 'downloaded',
      data: {
        url: '',
        id: msg.id,
        taskBatch: msg.taskBatch,
        tabId,
        uuid: false,
      },
      err: '',
    }
    browser.tabs.sendMessage(tabId, data).catch((error) => {
      console.error('回发 downloaded 消息失败', error)
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

  return false
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
// Firefox Android 不支持 downloads API（注册监听器时会抛出 "Not implemented" 错误），所以不注册该监听器
if (!Config.downloadsAPIDisabled) {
  browser.downloads.onChanged.addListener(async function (detail) {
    await restoreDownloadData()
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

        _dlData.browserSetFilename = changedName
      }

      if (detail.state && detail.state.current === 'complete') {
        msg = 'downloaded'
      }

      if (detail.error && detail.error.current) {
        msg = 'download_err'
        err = detail.error.current
        // 当保存一个文件出错时，从任务记录列表里删除它，以便前台重试下载
        await releaseDownloadId(_dlData)
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
      }

      await saveDLData()
    }
  })
}

// 清除不需要的数据，避免数据体积越来越大
async function clearData() {
  await restoreDownloadData()
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
