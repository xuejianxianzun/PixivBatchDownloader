// 设置 referer
browser.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    let setReferer = false
    for (let i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name === 'Referer') {
        setReferer = true
        details.requestHeaders[i].value = 'https://www.pixiv.net'
        break
      }
    }
    if (!setReferer) {
      details.requestHeaders.push({
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
browser.browserAction.onClicked.addListener(function (tab) {
  browser.tabs.sendMessage(tab.id, {
    msg: 'click_icon'
  })
})

// 因为下载完成的顺序和发送顺序可能不一致，所以需要存储当前进行下载的任务的数据
const donwloadBarCurreData = {}

// 接收下载请求
browser.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.msg === 'send_download') {
    // 保存当前任务数据。下载完成后，这个数据会保存在 donwloadBarCurreData 里
    const data = {
      no: msg.no,
      url: msg.fileUrl,
      tabid: sender.tab.id
    }

    // 开始下载
    browser.downloads
      .download({
        url: msg.fileUrl,
        filename: msg.fileName,
        conflictAction: 'overwrite',
        saveAs: false
      })
      .then(r => {
        // r 是下载任务的的 download id
        donwloadBarCurreData[r] = data
      })
      .catch(err => {
        console.log(err)
        URL.revokeObjectURL(msg.fileUrl)
        browser.tabs.sendMessage(sender.tab.id, {
          msg: 'download_err',
          no: msg.no
        })
      })
  }
})

// 监听下载事件
browser.downloads.onChanged.addListener(function (detail) {
  // 下载完成后
  if (detail.state !== undefined && detail.state.current === 'complete') {
    // 根据 detail.id 取出保存的信息
    const msg = 'downloaded'
    const data = donwloadBarCurreData[detail.id]
    if (!data) return
    browser.tabs.sendMessage(data.tabid, { msg, data })
  }
})
