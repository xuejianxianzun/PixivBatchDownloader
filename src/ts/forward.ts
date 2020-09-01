import { ForwardRequest, ForwardResponse } from './forward.d'

chrome.runtime.onMessage.addListener(async (msg: ForwardRequest, sender) => {
  if (msg.msg !== 'forward') {
    return
  }

  const tabId = sender!.tab!.id!

  const r = await fetch(msg.url)
  const b = await r.blob()

  const response: ForwardResponse = {
    msg: 'forward response',
    data: b
  }
  chrome.tabs.sendMessage(tabId, response)
})