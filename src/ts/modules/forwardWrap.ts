import { ForwardRequest, ForwardResponse } from '../forward.d'

async function forwardWrap(url: string) {
  return new Promise<Blob>(async (resolve) => {
    chrome.runtime.onMessage.addListener((msg: ForwardResponse) => {
      console.log(msg)
      if (msg.msg === 'forward response') {
        resolve(msg.data)
      }
    })

    const req: ForwardRequest = {
      msg: 'forward',
      url: url
    }
    chrome.runtime.sendMessage(req)
  })
}

export { forwardWrap }