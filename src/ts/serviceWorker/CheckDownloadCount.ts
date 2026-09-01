import browser from 'webextension-polyfill'

export interface Msg {
  message: 'highDownloadCountWarning'
  data: { count: number }
}

interface LastCheckData {
  time: number
}

// 这是一个 SW 脚本
// 每隔 24 小时查询一次下载记录数量，如果超过指定数量则向 Content Script 发送提示消息
// 不过 SW 被回收时不会检查，所以检查间隔经常会超过 24 小时
// 已知问题：查询下载记录时，Chrome 可以查询所有下载记录，但 Firefox 只会从活跃的下载记录里查询。
// 如果一些下载记录的时间较久，且文件已经不存在，那么 Firefox 通常不会返回它们，所以下载器查询不到这些记录
// 这意味着在 Firefox 上，查询结果的数量比实际数量少
// Firefox Android 不支持 downloads.search 方法（MDN 兼容性表中已标记为不支持，调用时会抛出 "Not implemented" 错误）
// 所以在 Firefox Android 上会跳过此检查，该提醒功能不可用，但不影响下载
const lastCheckKey = 'lastDownloadCountCheck'
const limit = 2000
const interval = 24 * 60 * 60 * 1000

// SW 每次启动时读取上一次检查到时间戳，如果超过 24 小时未检查则进行检查
setTimeout(async () => {
  const lastCheck = await loadLastCheckTime()
  const now = Date.now()

  if (!lastCheck || now - lastCheck.time > interval) {
    await queryDownloadCount()
  }
}, 5000)

// 检查下载记录数量是否超过指定值
async function queryDownloadCount() {
  try {
    const items = await browser.downloads.search({
      limit,
    })

    if (items.length >= limit) {
      await sendWarningToAllTabs()
    }

    // 无论是否触发警告，都保存本次检查时间戳
    await saveLastCheckTime()
  } catch (error) {
    // Firefox Android 不支持 downloads.search，调用时会抛出 "Not implemented" 错误
    // 此时跳过此检查，并保存检查时间戳，避免每次后台启动都重复报错
    if (error instanceof Error && error.message.includes('Not implemented')) {
      await saveLastCheckTime()
      return
    }
    console.error('检查下载记录数量时出错', error)
  }
}

// 保存本次检查时间戳到 storage.local
async function saveLastCheckTime() {
  await browser.storage.local.set({
    [lastCheckKey]: {
      time: Date.now(),
    },
  })
}

// 从 storage.local 读取上次检查时间戳
async function loadLastCheckTime(): Promise<LastCheckData | null> {
  const result = (await browser.storage.local.get(lastCheckKey)) as Record<
    string,
    LastCheckData
  >
  return result[lastCheckKey] || null
}

// 向前台标签页发送消息
async function sendWarningToAllTabs() {
  const message: Msg = {
    message: 'highDownloadCountWarning',
    data: { count: limit },
  }

  const tabs = await browser.tabs.query({
    url: 'https://*.pixiv.net/*',
  })
  for (const tab of tabs) {
    if (tab.id !== undefined) {
      try {
        browser.tabs.sendMessage(tab.id, message)
      } catch (_) {
        // 该标签页没有监听器（未注入 content script），忽略
      }
    }
  }
}
