/**
 * 持续监控作品收藏数量（每 30 分钟遍历一次，共 48 轮 = 24 小时）
 *
 * 用途：把一批刚发表的作品放在一起跟踪 24 小时，得到每个作品完整的收藏增长曲线。
 * 相比「追踪 24 小时真实收藏数量的脚本.js」（只取 24 小时那一个点），这个脚本每 30 分钟采样一次，
 * 一共 48 个采样点，可以直接看出增长速度随时间的变化，用来校准 notes/日均收藏数量的压制曲线.md。
 *
 * 用法：
 *   1. 在 pixiv.net 的页面里按 F12 打开控制台，把本文件全部内容粘贴进去、回车。
 *   2. 在弹出的面板里选择数据源 JSON（一个数组，每个作品一份数据，例如抓取结果的导出文件）。
 *   3. 脚本记录开始时间，**立即执行第一轮遍历**，之后每 30 分钟一轮。
 *   4. 累计执行完 49 轮（第一轮立即执行 + 后面的 48 个间隔 = 24 小时）后自动导出结果 JSON、停止任务、弹窗提醒。
 *
 * 每一轮开始时都会输出「本轮开始时间」和「距上一轮开始过去了多少分钟」，用来检查定时器有没有被浏览器延长
 * （页面在后台时定时器会被降频，间隔会明显大于 30 分钟）。结束时也会在弹窗里汇总这些间隔。
 *
 * 每轮遍历的规则：
 *   - 依次请求所有作品，相邻两个请求之间间隔 2.5 秒。
 *   - 遇到 HTTP 429：等待 4 分钟，然后重试刚才那个请求，再继续遍历。
 *   - 遇到「作品已被删除/不可见」这类错误（HTTP 404、410，或者接口返回 error）：不重试，
 *     并把这个作品从结果队列里删除，以后不再处理它。
 *   - 遇到网络错误、HTTP 5xx、响应不是合法 JSON：**不删除作品**，只记日志、下一轮再试。
 *     （这类错误往往是临时的，删掉就会永久丢掉这个作品的曲线，所以保留更安全。）
 *
 * 数据源格式：数组，每个作品一份数据，例如：
 *   [{ idNum: 150228389, id: '150228389_p0', date: '2026-09-28T14:53:00+00:00', ... }]
 *   - 作品 id 取 idNum；如果没有这个字段，就从 id（形如 150228389_p0）里去掉页码后缀。
 *   - 发表时间取 date / uploadDate / createDate 里第一个有值的；如果都没有，会在第一次成功
 *     抓取后用接口返回的 createDate 补上。
 *
 * ⚠️ 追踪期间不要关闭这个标签页、不要让电脑睡眠。后台标签页的定时器会被浏览器降频。
 * ⚠️ 请求总量 = 作品数 × 48，请先估算一下（例如 300 个作品就是 14400 次请求）。
 * 控制台里可以用 window.pbdBmkMonitor 查看队列、手动导出或停止。
 */
(() => {
  // ==================== 配置 ====================

  const CONFIG = {
    /** 每轮遍历之间的间隔（分钟）。间隔是指「上一轮开始」到「这一轮开始」的时间 */
    roundIntervalMinutes: 30,
    /** 同一轮里相邻两个请求之间的间隔（毫秒） */
    requestGapMs: 2500,
    /** 遇到 429 时，等待多久再重试刚才那个请求（毫秒） */
    retry429WaitMs: 4 * 60 * 1000,
    /** 同一个作品在同一轮里最多重试几次 429（超过就跳过它，下一轮再试，避免整轮卡死） */
    maxRetry429: 5,
    /** 累计执行多少轮后结束。第 1 轮在脚本运行时立即执行，所以 49 轮 = 48 个 30 分钟间隔 = 24 小时 */
    totalRounds: 49,
    /** 断点续跑用的 localStorage 键名 */
    saveKey: 'pbd-bmk-monitor',
  }

  // ==================== 小工具 ====================

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  /** 保留 2 位小数 */
  const round2 = (num) => Math.round(num * 100) / 100

  const log = (...args) => console.log('%c[收藏监控]', 'color:#185fa5', ...args)

  const stamp = () => new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)

  /** 计算某个时间到现在经过了多少小时 */
  const hoursSince = (date) => (Date.now() - new Date(date).getTime()) / 3600000

  const timeText = (date) =>
    date ? new Date(date).toLocaleTimeString('zh-CN', { hour12: false }) : '—'

  // ==================== 状态 ====================

  /** 结果队列：{ id, createDate, checks: [] } */
  let queue = []
  /** 被删除的作品（作品可能已被删除或不可见），只用于记录和日志 */
  let removed = []
  /** 脚本开始运行的时间 */
  let startTime = null
  /** 已完成的轮数 */
  let rounds = 0
  /** 正在执行某一轮遍历 */
  let running = false
  /** 是否已结束 */
  let finished = false
  /** 数据源文件名 */
  let sourceName = ''
  /** 下一轮的定时器 */
  let roundTimer = null
  /** 刷新面板的定时器 */
  let panelTimer = null
  /** 下一轮开始的时刻 */
  let nextRoundAt = null
  /** 上一次遍历开始的时刻（毫秒时间戳），用来算两次遍历之间隔了多少分钟 */
  let lastRoundStart = null
  /** 每次遍历与上一次遍历之间的间隔（分钟）。用来检查定时器有没有被浏览器延长 */
  let roundGaps = []

  // ==================== 建立结果队列 ====================

  /** 把数据源转换成结果队列（按作品 id 去重，检查结果数组默认是空的） */
  const buildQueue = (data) => {
    if (!Array.isArray(data)) {
      throw new Error('数据源的顶层不是数组')
    }
    const map = new Map()
    let noDate = 0
    for (const item of data) {
      // 作品 id：优先取 idNum，否则从文件名 id（形如 150228389_p0）里去掉页码后缀
      const id = String(item.idNum ?? item.id ?? '').replace(/_p\d+$/, '')
      if (!id || map.has(id)) {
        continue
      }
      // 发表时间：不同导出格式里的字段名不一样
      const createDate =
        item.date ||
        item.uploadDate ||
        item.createDate ||
        (item.novelMeta && item.novelMeta.createDate) ||
        null
      if (!createDate) {
        noDate++
      }
      map.set(id, {
        id,
        createDate,
        checks: [],
      })
    }
    return { queue: [...map.values()], noDate, total: data.length }
  }

  // ==================== 抓取 ====================

  /** 获取作品数据（ArtworkData.body）
   *
   * 抛出的错误上会带这些标记：
   * - kind: 'rate-limit' 表示 429，需要等待后重试
   * - kind: 'server' 表示服务端返回了错误状态码或 error
   * - kind: 'network' 表示请求本身失败（断网等）
   * - removeWork: true 表示这个作品应该被移出队列（已被删除或不可见） */
  const fetchWork = async (id) => {
    const url = `https://www.pixiv.net/ajax/illust/${id}?time=${Date.now()}`

    let response
    try {
      response = await fetch(url)
    } catch (err) {
      const error = new Error(
        '网络错误：' + (err && err.message ? err.message : err)
      )
      error.kind = 'network'
      throw error
    }

    if (response.status === 429) {
      const error = new Error('HTTP 429：请求过于频繁')
      error.kind = 'rate-limit'
      throw error
    }

    if (!response.ok) {
      const error = new Error('HTTP ' + response.status)
      error.kind = 'server'
      // 404 / 410：作品已经被删除；403 可能是被限制访问，先不删（下一轮再试）
      error.removeWork = response.status === 404 || response.status === 410
      throw error
    }

    let data
    try {
      data = await response.json()
    } catch (err) {
      const error = new Error('响应不是合法的 JSON')
      error.kind = 'server'
      throw error
    }

    if (data.error) {
      const error = new Error(data.message || '接口返回了 error')
      error.kind = 'server'
      // 接口明确说这个作品有问题（不存在、不公开等）
      error.removeWork = true
      throw error
    }

    return data.body
  }

  /** 把一个作品移出结果队列，并记录原因 */
  const removeItem = (item, reason) => {
    queue = queue.filter((one) => one !== item)
    removed.push({
      id: item.id,
      createDate: item.createDate,
      checkCount: item.checks.length,
      reason,
      removedAt: new Date().toISOString(),
    })
    log(`🗑️ 已从队列删除 ${item.id}（${reason}）`)
  }

  /** 请求一个作品并记录检查结果 */
  const checkWork = async (item) => {
    for (let attempt = 0; ; attempt++) {
      try {
        const body = await fetchWork(item.id)

        // 数据源里没有发表时间时，用接口返回的补上（保存下来，后面各轮都能用）
        if (!item.createDate && body.createDate) {
          item.createDate = body.createDate
        }

        const hours =
          hoursSince(item.createDate) // 数据源和接口都没有发表时间时会是 NaN
        item.checks.push({
          time: new Date().toISOString(),
          hoursSincePublish: Number.isFinite(hours) ? round2(hours) : null,
          bookmarkCount: body.bookmarkCount,
        })
        return
      } catch (err) {
        if (err.kind === 'rate-limit') {
          if (attempt < CONFIG.maxRetry429) {
            log(
              `⏳ ${item.id} 遇到 429，等待 ${CONFIG.retry429WaitMs / 60000} 分钟后重试（第 ${attempt + 1} 次）`
            )
            await sleep(CONFIG.retry429WaitMs)
            continue
          }
          log(`⚠️ ${item.id} 连续 ${CONFIG.maxRetry429} 次 429，本轮跳过它，下一轮再试`)
          return
        }

        if (err.removeWork) {
          removeItem(item, err.message)
          return
        }

        // 网络错误、5xx、JSON 解析失败等：不删除作品，下一轮再试
        log(`⚠️ ${item.id} 本轮抓取失败（${err.message}），下一轮再试`)
        return
      }
    }
  }

  // ==================== 遍历 ====================

  /** 执行一轮遍历 */
  const runRound = async () => {
    if (running || finished) {
      return
    }
    running = true
    nextRoundAt = null
    const roundNo = rounds + 1
    const roundStart = Date.now()
    // 记录本次遍历开始的时间，并输出「距上一次遍历开始过了多少分钟」，
    // 用来检查定时器有没有被浏览器延长（页面在后台时定时器会被降频）
    let gapText = '这是第一次遍历'
    if (lastRoundStart !== null) {
      const gapMinutes = round2((roundStart - lastRoundStart) / 60000)
      roundGaps.push(gapMinutes)
      gapText = `距上次遍历开始 ${gapMinutes} 分钟`
    }
    lastRoundStart = roundStart
    log(
      `▶️ 第 ${roundNo}/${CONFIG.totalRounds} 轮开始于 ${timeText(new Date(roundStart))}，${gapText}，共 ${queue.length} 个作品（预计需要 ${Math.ceil((queue.length * CONFIG.requestGapMs) / 60000)} 分钟）`
    )
    updatePanel()

    // 用快照遍历：遍历过程中可能因为作品被删除而改变 queue
    const list = [...queue]
    for (const item of list) {
      if (finished) {
        break
      }
      // 这个作品可能在本次遍历里已经被删掉了
      if (!queue.includes(item)) {
        continue
      }
      await checkWork(item)
      await sleep(CONFIG.requestGapMs)
    }

    if (finished) {
      return
    }

    rounds++
    running = false
    log(
      `✅ 第 ${roundNo} 轮完成，用时 ${round2((Date.now() - roundStart) / 60000)} 分钟，队列还剩 ${queue.length} 个作品`
    )
    save()
    updatePanel()

    // 队列空了就不用再等了
    if (queue.length === 0) {
      log('⚠️ 结果队列已经空了，提前结束')
      finish('结果队列已经为空')
      return
    }

    if (rounds >= CONFIG.totalRounds) {
      finish()
      return
    }

    // 按「上一轮开始的时刻 + 间隔」来安排下一轮，这样各轮的开始时刻是等间隔的
    const nextAt = roundStart + CONFIG.roundIntervalMinutes * 60 * 1000
    const delay = Math.max(nextAt - Date.now(), 0)
    if (delay === 0) {
      log('⚠️ 上一轮用时超过了间隔时间，立刻开始下一轮')
    }
    nextRoundAt = new Date(nextAt)
    roundTimer = setTimeout(runRound, delay)
    updatePanel()
  }

  // ==================== 结束 ====================

  /** 汇总各次遍历之间的间隔，用来检查定时器是否被浏览器延长 */
  const getGapSummary = () => {
    if (roundGaps.length === 0) {
      return '还没有两次遍历，无法比较'
    }
    const min = Math.min(...roundGaps)
    const max = Math.max(...roundGaps)
    const avg = round2(
      roundGaps.reduce((sum, one) => sum + one, 0) / roundGaps.length
    )
    return `最小 ${min} 分钟 / 最大 ${max} 分钟 / 平均 ${avg} 分钟（共 ${roundGaps.length} 次，完整数据见 window.pbdBmkMonitor.roundGaps）`
  }

  /** 结束：停止定时器、导出结果、弹窗提醒 */
  const finish = (reason = '') => {
    if (finished) {
      return
    }
    finished = true
    running = false
    if (roundTimer) {
      clearTimeout(roundTimer)
      roundTimer = null
    }
    if (panelTimer) {
      clearInterval(panelTimer)
      panelTimer = null
    }
    clearSaved()
    updatePanel()

    exportResults()

    const message =
      `监控完成：共执行 ${rounds} 轮，结果队列 ${queue.length} 个作品，` +
      `删除 ${removed.length} 个作品。\n` +
      `开始时间：${startTime ? startTime.toLocaleString('zh-CN') : '—'}\n` +
      `遍历间隔：${getGapSummary()}\n` +
      (reason ? `（${reason}）\n` : '') +
      `结果文件已开始下载。`
    log(message)
    alert(message)
  }

  /** 把结果队列导出为 JSON 文件 */
  const exportResults = () => {
    const blob = new Blob([JSON.stringify(queue, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `pbd-bmk-monitor-${stamp()}.json`
    document.body.append(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 10000)
    log(`结果已导出：${queue.length} 个作品、共 ${rounds} 轮采样`)
  }

  /** 手动停止（不导出） */
  const stop = () => {
    if (roundTimer) {
      clearTimeout(roundTimer)
      roundTimer = null
    }
    if (panelTimer) {
      clearInterval(panelTimer)
      panelTimer = null
    }
    running = false
    log('已停止。可以用 window.pbdBmkMonitor.exportNow() 导出当前结果')
  }

  // ==================== 断点续跑 ====================

  const save = () => {
    try {
      localStorage.setItem(
        CONFIG.saveKey,
        JSON.stringify({
          queue,
          removed,
          startTime: startTime ? startTime.toISOString() : null,
          lastRoundStart,
          roundGaps,
          rounds,
          sourceName,
          savedAt: Date.now(),
        })
      )
    } catch (err) {
      log('⚠️ 保存断点数据失败（可能是数据太大超出 localStorage 容量），刷新页面后会丢失进度')
    }
  }

  const load = () => {
    try {
      const raw = localStorage.getItem(CONFIG.saveKey)
      return raw ? JSON.parse(raw) : null
    } catch (err) {
      return null
    }
  }

  const clearSaved = () => {
    try {
      localStorage.removeItem(CONFIG.saveKey)
    } catch (err) {
      // 忽略
    }
  }

  // ==================== 界面 ====================

  let panelMessage = null

  /** 刷新面板上的进度文字 */
  const updatePanel = () => {
    if (!panelMessage) {
      return
    }
    if (finished) {
      panelMessage.innerHTML = `✅ 已结束：${rounds} 轮，队列 ${queue.length} 个作品，结果文件已下载`
      return
    }
    const used = startTime ? round2((Date.now() - startTime.getTime()) / 3600000) : 0
    const samples = queue.reduce((sum, item) => sum + item.checks.length, 0)
    const lastGap = roundGaps.length
      ? `上次间隔 ${roundGaps[roundGaps.length - 1]} 分钟`
      : '还未比较过间隔'
    panelMessage.innerHTML =
      `已完成 <b>${rounds}</b> / ${CONFIG.totalRounds} 轮 ｜ 队列 <b>${queue.length}</b> 个 ｜ 已删除 ${removed.length} 个<br>` +
      `已运行 ${used} 小时 ｜ 采样 ${samples} 次 ｜ ${lastGap}<br>` +
      (running
        ? `正在遍历…（${timeText(lastRoundStart ? new Date(lastRoundStart) : startTime)} 开始）`
        : nextRoundAt
          ? `下一轮：${timeText(nextRoundAt)}`
          : '等待中…') +
      `<br><span style="color:#888">请勿关闭此标签页（每 ${CONFIG.roundIntervalMinutes} 分钟一轮）</span>`
  }

  /** 显示选文件的面板 */
  const buildPanel = () => {
    const old = document.getElementById('pbdBmkMonitorPanel')
    if (old) {
      old.remove()
    }
    const box = document.createElement('div')
    box.id = 'pbdBmkMonitorPanel'
    box.style.cssText =
      'position:fixed;top:10px;right:10px;z-index:999999;background:#fff;color:#222;' +
      'border:1px solid #ccc;border-radius:8px;padding:10px 12px;font:12px/1.7 sans-serif;' +
      'box-shadow:0 2px 10px rgba(0,0,0,.18);max-width:320px'
    const title = document.createElement('div')
    title.style.cssText = 'font-weight:bold;margin-bottom:6px'
    title.textContent = '持续监控作品收藏数量'
    panelMessage = document.createElement('div')
    panelMessage.style.cssText = 'margin-bottom:8px;color:#444'
    panelMessage.textContent = '请选择数据源 JSON 文件'
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.onchange = async () => {
      const file = input.files && input.files[0]
      if (!file) {
        return
      }
      panelMessage.textContent = '正在读取文件…'
      try {
        const data = JSON.parse(await file.text())
        start(data, file.name)
      } catch (err) {
        panelMessage.textContent = '读取失败：' + (err && err.message)
        alert('读取数据源失败：' + (err && err.message ? err.message : err))
      }
    }
    box.append(title, panelMessage, input)
    document.body.append(box)
  }

  // ==================== 启动 ====================

  /** 用数据源开始监控 */
  const start = (data, fileName = '') => {
    const built = buildQueue(data)
    queue = built.queue
    removed = []
    rounds = 0
    finished = false
    sourceName = fileName
    startTime = new Date()

    log(
      `数据源共 ${built.total} 条数据，得到 ${queue.length} 个作品（按 id 去重）` +
        (built.noDate ? `，其中 ${built.noDate} 个没有发表时间，会在第一次抓取后补上` : '')
    )
    log(`开始运行时间：${startTime.toLocaleString('zh-CN')}`)
    log(
      `计划：每 ${CONFIG.roundIntervalMinutes} 分钟一轮，共 ${CONFIG.totalRounds} 轮，` +
        `预计请求 ${queue.length * CONFIG.totalRounds} 次`
    )

    if (queue.length === 0) {
      clearSaved()
      updatePanel()
      alert('数据源里没有可用的作品（缺少 id 或数据为空），无法开始监控。')
      return
    }

    save()
    updatePanel()
    if (panelTimer) {
      clearInterval(panelTimer)
    }
    panelTimer = setInterval(updatePanel, 20000)

    // 立即执行第一轮遍历；后面的轮次在这一轮结束时按「本轮开始时刻 + 间隔」安排
    log('立即执行第一轮遍历')
    runRound()
  }

  /** 继续上次未完成的监控 */
  const resume = (saved) => {
    queue = saved.queue || []
    removed = saved.removed || []
    rounds = saved.rounds || 0
    sourceName = saved.sourceName || ''
    startTime = saved.startTime ? new Date(saved.startTime) : new Date()
    lastRoundStart = typeof saved.lastRoundStart === 'number' ? saved.lastRoundStart : null
    roundGaps = saved.roundGaps || []
    finished = false
    log(
      `继续上次的监控：已完成 ${rounds} 轮、队列 ${queue.length} 个作品（开始时间 ${startTime.toLocaleString('zh-CN')}）`
    )
    buildPanel()
    updatePanel()
    if (panelTimer) {
      clearInterval(panelTimer)
    }
    panelTimer = setInterval(updatePanel, 20000)
    // 继续时按「上一轮开始时刻 + 间隔」来安排，保证仍然是约 30 分钟一轮
    const nextAt = startTime.getTime() + rounds * CONFIG.roundIntervalMinutes * 60 * 1000
    const delay = Math.max(nextAt - Date.now(), 0)
    nextRoundAt = new Date(Date.now() + delay)
    roundTimer = setTimeout(runRound, delay)
    log(`下一轮遍历将在 ${timeText(nextRoundAt)} 开始`)
  }

  window.pbdBmkMonitor = {
    start: buildPanel, // 重新选数据源
    stop, // 停止定时器
    exportNow: exportResults, // 立刻导出当前结果
    clearSaved, // 清掉断点续跑的数据
    get queue() {
      return queue
    },
    get removed() {
      return removed
    },
    get rounds() {
      return rounds
    },
    /** 各次遍历与上一次之间的间隔（分钟），用来检查定时器是否被延长 */
    get roundGaps() {
      return roundGaps
    },
  }

  // 如果有上次未完成的监控，先问是否继续
  const saved = load()
  if (saved && (saved.queue || []).length) {
    const yes = confirm(
      `发现上次未完成的监控（已完成 ${saved.rounds || 0} 轮，队列 ${
        (saved.queue || []).length
      } 个作品）。\n\n点「确定」继续上次的监控；点「取消」忽略它、重新选数据源。`
    )
    if (yes) {
      resume(saved)
      return
    }
    clearSaved()
  }
  buildPanel()
})()
