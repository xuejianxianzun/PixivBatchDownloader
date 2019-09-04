// 设置 referer
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    let setReferer = false
    for (let i = 0; i < details.requestHeaders!.length; ++i) {
      if (details.requestHeaders![i].name === 'Referer') {
        setReferer = true
        details.requestHeaders![i].value = 'https://www.pixiv.net'
        break
      }
    }
    if (!setReferer) {
      details.requestHeaders!.push({
        name: 'Referer',
        value: 'https://www.pixiv.net'
      })
    }
    return {
      requestHeaders: details.requestHeaders
    }
  },
  {
    urls: ['*://*.pixiv.net/*', '*://*.pximg.net/*']
  },
  ['blocking', 'requestHeaders']
)

// 当点击扩展图标时，切换显示/隐藏下载面板
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({ active: true }, result => {
    if (
      result[0].url!.includes('pixiv.net') ||
      result[0].url!.includes('pixivision.net')
    ) {
      // 当前标签是 p 站页面，则打开下载面板
      chrome.tabs.sendMessage(tab.id!, {
        msg: 'click_icon'
      })
    } else {
      // 如果当前标签不是 p 站页面，则跳转到 p 站
      chrome.tabs.create({ url: 'https://www.pixiv.net/' })
    }
  })
})

// 因为下载完成的顺序和发送顺序可能不一致，所以需要存储任务的数据
let donwloadListData: DonwloadListData = {}
// 接收下载请求
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.msg === 'send_download') {
    // 开始下载
    chrome.downloads.download(
      {
        url: msg.fileUrl,
        filename: msg.fileName,
        conflictAction: 'overwrite',
        saveAs: false
      },
      id => {
        // 成功建立下载任务时，返回下载项的 id
        donwloadListData[id] = {
          no: msg.no,
          url: msg.fileUrl,
          thisIndex: msg.thisIndex,
          tabid: sender.tab!.id!
        }
      }
    )
  }
})

// 监听下载事件
chrome.downloads.onChanged.addListener(function(detail) {
  // 下载完成后
  if (detail.state !== undefined && detail.state.current === 'complete') {
    // 根据 detail.id 取出保存的信息
    const msg = 'downloaded'
    const data = donwloadListData[detail.id]
    if (!data) return
    chrome.tabs.sendMessage(data.tabid, { msg, data })
  }
})
