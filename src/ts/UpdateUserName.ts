import { log } from './Log'
import { Tools } from './Tools'
import { setSetting, settings } from './setting/Settings'

class UpdateUserName {
  constructor() {
    window.setTimeout(() => {
      this.checkNeedUpdate()
    }, 2000)
  }

  private startKey = 'updateUserNameStart'
  private finishKey = 'updateUserNameFinish'
  // 更新间隔为一天
  private interval = 24 * 60 * 60 * 1000

  private checkNeedUpdate() {
    // 如果从未更新过，则开始更新
    const start = Number.parseInt(localStorage.getItem(this.startKey) || '0')
    if (!start) {
      return this.update()
    }

    // 如果有上次开始更新的时间，则检查结束时间
    const end = Number.parseInt(localStorage.getItem(this.finishKey) || '0')
    const now = new Date().getTime()
    if (!end) {
      // 如果没有结束时间，并且距离上次开始时间已经过去了半小时，则视为上次更新异常终止
      // 需要再次开始更新
      if (now - start < 30 * 60 * 1000) {
        return this.update()
      }
      // 如果距离上次更新还没过去半小时，则什么都不做。目前来看 300 个画师可以在 10 分钟之内更新完成。
    } else {
      if (end > start) {
        // 如果结束时间大于开始时间，说明上次更新已完成
        // 检查距离上次结束时间是否已经过去了一天，如果过去了一天，则开始更新
        if (now - end > this.interval) {
          return this.update()
        }
      } else {
        // 反之，如果结束时间小于开始时间，说明开始过新的更新，那么判断距离新的更新是否已经过去了半小时
        // 如果过去了半小时，说明上次更新异常终止
        if (now - start < 30 * 60 * 1000) {
          return this.update()
        }
      }
    }
  }

  private async update() {
    log.log('开始更新画师名称')
    localStorage.setItem(this.startKey, new Date().getTime().toString())

    // 在检查过程中，如果请求出错（通常是画师 403 或 404 了），则会显示对应的日志进行提示
    // 不过不会自动删除对应的画师。如需删除需要手动操作
    // pixiv 里用户 403 的错误文本是："找不到该用户"
    // pixiv 里用户 404 的错误文本是："抱歉，您当前所寻找的个用户已经离开了pixiv, 或者这ID不存在。"
    let change1 = 0
    for (const item of settings.DoNotDownloadLastFewImagesList) {
      try {
        const name = await Tools.getUserName(item.uid)
        if (name && name !== item.user) {
          log.warning(`${item.user} -> ${name}`)

          item.user = name
          change1 = change1 + 1
        }
      } catch (error) {
        log.error(error as string)
      }
    }
    if (change1) {
      setSetting(
        'DoNotDownloadLastFewImagesList',
        settings.DoNotDownloadLastFewImagesList
      )
    }

    let change2 = 0
    for (const item of settings.blockTagsForSpecificUserList) {
      try {
        const name = await Tools.getUserName(item.uid)
        if (name && name !== item.user) {
          log.warning(`${item.user} -> ${name}`)

          item.user = name
          change2 = change1 + 1
        }
      } catch (error) {
        log.error(error as string)
      }
    }
    if (change2) {
      setSetting(
        'blockTagsForSpecificUserList',
        settings.blockTagsForSpecificUserList
      )
    }

    localStorage.setItem(this.finishKey, new Date().getTime().toString())
    log.success(`画师名称更新完成`)
    const count = change1 + change2
    if (count > 0) {
      log.log(`本次更新中有 ${count} 个画师名字发生变化，已更新`, 2)
    }
  }
}

new UpdateUserName()
