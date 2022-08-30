interface ListData {
  id: number
  time: number
  callback: Function | null
}

class SetTimeoutWorker {
  constructor() {
    this.createWorker()
  }

  private worker?: Worker

  private async createWorker() {
    return new Promise(async (resolve) => {
      const jsURL = chrome.runtime.getURL('js/setTimeout.worker.js')
      const req = await fetch(jsURL)
      const blob = await req.blob()
      const blobURL = URL.createObjectURL(blob)
      this.worker = new Worker(blobURL)

      this.worker.addEventListener('message', (ev) => {
        const id = ev.data.id as number
        if (this.list[id].callback !== null) {
          this.list[id].callback!()
          this.clear(id)
        }
      })

      resolve(this.worker)
    })
  }

  private list: ListData[] = []

  private timerId = 0

  public set(callback: Function, time: number) {
    const data = {
      id: this.timerId,
      time,
      callback,
    }
    this.list.push(data)
    this.timerId++

    this.worker?.postMessage({
      id: data.id,
      time,
    })

    return data.id
  }

  public clear(id: number) {
    this.list[id].callback = null
  }
}

const setTimeoutWorker = new SetTimeoutWorker()
export { setTimeoutWorker }
