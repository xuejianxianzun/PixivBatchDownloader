// 定时抓取当前页面的作品的数据，获取其发表后经过的时间和收藏数量

// 一小时的毫秒数
const oneHour = 1 * 60 * 60 * 1000

// 每次抓取的间隔时间（等同于每小时抓取几次）
const delay = oneHour / 4

// 从地址栏获取作品 id
function getIllustId() {
  const test = /artworks\/(\d*\d)/.exec(location.href)
  if (test && test.length > 1) {
    return test[1]
  }

  return alert('getIllustId failed')
}

function getBMK() {
  const id = getIllustId()
  const url = `https://www.pixiv.net/ajax/illust/${id}`
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'get',
      credentials: 'same-origin',
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          // 第一种异常，请求成功但状态不对
          reject({
            status: response.status,
            statusText: response.statusText,
          })
        }
      })
      .then((data) => {
        // 计算发表之后经过了多少小时
        const nowTime = new Date().getTime()
        const createTime = new Date(data.body.createDate).getTime()
        // 计算小时数，保留小数点后 1 位
        const hourResult =
          Math.round(((nowTime - createTime) / oneHour) * 10) / 10

        const bmk = data.body.bookmarkCount
        console.log('hour', hourResult, 'bmk', bmk)
        resolve(bmk)
      })
      .catch((error) => {
        // 第二种异常，请求失败
        reject(error)
      })
  })
}

// 立刻抓取一次
getBMK()

// 定时抓取
setInterval(() => {
  getBMK()
}, delay)
