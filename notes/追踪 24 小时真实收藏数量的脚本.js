/**
 * 追踪作品「发表满 24 小时时的真实收藏数量」
 *
 * 目的：配合 notes/日均收藏数量的压制曲线.md —— 把脚本预测的日均收藏数量和 24 小时后的真实值对比，
 * 用来校准压制曲线（这条曲线目前是经验值，没有真实数据支撑）。
 *
 * 用法：
 *   1. 在 pixiv.net 的页面里按 F12 打开控制台，把本文件全部内容粘贴进去、回车。
 *   2. 在弹出的面板里选择抓取结果导出的 JSON（例如 result-total 593.json）。
 *   3. 脚本立刻建立任务队列并开始追踪（每 10 秒检查一次），达到 24 小时的作品会被逐个抓取。
 *   4. 任务队列清空后自动下载结果 JSON，并弹窗提醒。
 *
 * 说明：
 *   - 数据源是抓取结果导出的 JSON（每个文件一条记录，同一作品的多图会重复出现，所以按 idNum 去重）。
 *   - 只处理「运行脚本时发表时长不足 24 小时」的作品，即还没达到 24 小时、还能观察到 24 小时时刻的作品。
 *   - ⚠️ 追踪期间不要关闭这个标签页，也不要让电脑睡眠。后台标签页的定时器会被浏览器降频（可能晚一点抓取），
 *     所以结果里记录了实际抓取时的发表时长，便于事后判断误差。
 *   - ⚠️ 页面刷新会丢失内存里的队列，所以队列会同步存到 localStorage；重新运行脚本时会询问是否继续。
 *   - 控制台里可以用 window.pbdBmk24 查看队列、手动导出或停止。
 */
(() => {
  // ==================== 配置 ====================

  const CONFIG = {
    /** 定时器间隔（秒） */
    tickSeconds: 10,
    /** 相邻两个 API 请求之间的间隔（毫秒），避免请求过密被 Pixiv 限制 */
    fetchGapMs: 800,
    /** 单个作品抓取失败后的最大重试次数，超过后记入结果队列并标记失败 */
    maxRetry: 5,
    /** 追踪到发表满多少小时 */
    trackHours: 24,
    /** 断点续跑用的 localStorage 键名 */
    saveKey: 'pbd-bmk24-tracking',
  }

  /** 压制曲线的参数，与 src/ts/filter/Filter.ts 的 checkBMK() 保持一致 */
  const CURVE = {
    /** 曲线起点（小时）：发表不足这个时长的一律按这个时长计算 */
    minHours: 2,
    /** 曲线终点（小时）：达到这个时长后不再压制 */
    limitHours: 24,
    /** 倍率下限（发表不足 minHours 时使用） */
    minRatio: 8,
    /** 倍率上限（发表达到 limitHours 时使用，等于不压制） */
    normalRatio: 24,
  }

  // ==================== 压制曲线（与 Filter.checkBMK 一致） ====================

  /** 计算某个发表时长（小时）对应的「2 小时刻度」。不足 2 小时按 2 小时，向上取整到 2 的倍数 */
  const getHourScale = (hours) => {
    const scale = Math.ceil(hours / 2) * 2
    return Math.min(Math.max(scale, CURVE.minHours), CONFIG.trackHours)
  }

  /** 计算某个发表时长（小时）对应的倍率：2 小时为 12，到 24 小时线性增加到 24 */
  const getRatio = (hours) => {
    const x = Math.min(
      (hours - CURVE.minHours) / (CURVE.limitHours - CURVE.minHours),
      1
    )
    return CURVE.minRatio + (CURVE.normalRatio - CURVE.minRatio) * x
  }

  /** 计算日均收藏数量 = 收藏数量 × 倍率 ÷ 发表小时数（不足 2 小时按 2 小时算） */
  const getDailyAverage = (bmk, hours) => {
    const h = Math.max(hours, CURVE.minHours)
    return (bmk * getRatio(h)) / h
  }

  // ==================== 小工具 ====================

  /** 计算某个时间到现在经过了多少小时 */
  const hoursSince = (date) => (Date.now() - new Date(date).getTime()) / 3600000

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  /** 保留 2 位小数（避免出现 3.3000000000000003 这种数字） */
  const round2 = (num) => Math.round(num * 100) / 100

  const log = (...args) => console.log('%c[24h 追踪]', 'color:#1f9c6b', ...args)

  /** 生成文件名里的时间戳 */
  const stamp = () =>
    new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)

  // ==================== 状态 ====================

  /** 任务队列：还没到 24 小时的作品 */
  let tasks = []
  /** 结果队列：已经拿到 24 小时真实收藏数量的作品 */
  let results = []
  /** 定时器 */
  let timer = null
  /** 上一次抓取还没结束时，跳过这一轮，避免重复抓取 */
  let busy = false
  /** 是否已结束 */
  let finished = false
  /** 数据源文件名，仅用于记录 */
  let sourceName = ''

  // ==================== 建立队列 ====================

  /** 把抓取结果的原始数组转换成任务队列（按 idNum 去重，只保留发表不足 24 小时的作品） */
  const buildTasks = (data) => {
    if (!Array.isArray(data)) {
      throw new Error('数据源的顶层不是数组')
    }

    // 每个文件一条记录，同一作品的多图会出现多次，所以按 idNum 去重（保留第一条）
    const works = new Map()
    for (const item of data) {
      // idNum 是作品 id。如果没有这个字段，就从文件 id（形如 150228389_p0）里去掉页码后缀
      const id = String(item.idNum ?? item.id ?? '').replace(/_p\d+$/, '')
      if (!id || works.has(id)) {
        continue
      }
      const createDate = item.date || item.uploadDate
      if (!createDate) {
        continue
      }
      works.set(id, {
        id,
        createDate,
        bookmarkCount: typeof item.bmk === 'number' ? item.bmk : null,
        type: item.type,
        pageCount: item.pageCount,
        title: item.title,
        user: item.user,
      })
    }

    const taskQueue = []
    let skipped = 0
    for (const work of works.values()) {
      const hours = hoursSince(work.createDate)
      // 只处理还没到 24 小时的作品（已经超过 24 小时的没法再观察它的 24 小时时刻）
      if (!(hours < CONFIG.trackHours)) {
        skipped++
        continue
      }
      // 时间刻度：按 2 小时为粒度处理（与文档里的表一致）
      const hourScale = getHourScale(hours)
      taskQueue.push({
        id: work.id,
        createDate: work.createDate,
        /** 运行脚本时的发表时长（小时，原始值，便于事后核对） */
        elapsedHours: round2(hours),
        /** 时间刻度：发表时长按 2 小时粒度处理后的值（2、4、…、24） */
        hourScale,
        /** 运行脚本时的收藏数量（来自抓取结果） */
        bookmarkCount: work.bookmarkCount,
        /** 预测的日均收藏数量 = 收藏数量 × 倍率(刻度) ÷ 刻度 */
        predictedDailyAverage: round2(
          getDailyAverage(work.bookmarkCount ?? 0, hourScale)
        ),
        /** 对照：不压制时的日均收藏数量 = 收藏数量 × 24 ÷ 发表小时数 */
        naiveDailyAverage: round2(
          ((work.bookmarkCount ?? 0) * 24) / Math.max(hours, 0.01)
        ),
        // 下面几个字段只为了方便查看结果
        type: work.type,
        pageCount: work.pageCount,
        title: work.title,
        user: work.user,
        /** 建立任务的时刻 */
        queuedAt: new Date().toISOString(),
      })
    }

    // 按发表时间从早到晚排序，先处理快要到 24 小时的
    taskQueue.sort((a, b) => new Date(a.createDate) - new Date(b.createDate))

    return { taskQueue, total: works.size, skipped }
  }

  // ==================== 抓取 ====================

  /** 获取作品数据（ArtworkData），返回其中的 body */
  const fetchWork = async (id) => {
    const url = `https://www.pixiv.net/ajax/illust/${id}?time=${Date.now()}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('HTTP ' + response.status)
    }
    const data = await response.json()
    if (data.error) {
      throw new Error(data.message || '接口返回了 error')
    }
    return data.body
  }

  /** 定时器：每次找出已经到 24 小时的作品，抓取它们的收藏数量，并移动到结果队列 */
  const tick = async () => {
    if (busy || finished) {
      return
    }

    const due = tasks.filter(
      (task) => hoursSince(task.createDate) >= CONFIG.trackHours
    )

    if (due.length === 0) {
      updatePanel()
      return
    }

    busy = true
    log(`有 ${due.length} 个作品已达到 ${CONFIG.trackHours} 小时，开始抓取`)
    for (const task of due) {
      const hours = hoursSince(task.createDate)
      try {
        const body = await fetchWork(task.id)
        task.bookmarkCount24h = body.bookmarkCount
        task.hoursAtCapture = round2(hours)
        task.capturedAt = new Date().toISOString()
        // 补充接口返回的一些信息，便于核对
        task.illustTitle = body.illustTitle
        task.illustType = body.illustType
        task.pageCountFromApi = body.pageCount
        task.userId = body.userId
        // 从任务队列移动到结果队列
        tasks = tasks.filter((item) => item !== task)
        results.push(task)
        log(
          `✅ ${task.id} 已记录：24 小时真实收藏数 ${body.bookmarkCount}（实际抓取于 ${task.hoursAtCapture} 小时；预测 ${task.predictedDailyAverage}）`
        )
      } catch (err) {
        task.retry = (task.retry || 0) + 1
        task.lastError = String(err && err.message ? err.message : err)
        if (task.retry > CONFIG.maxRetry) {
          task.failed = true
          tasks = tasks.filter((item) => item !== task)
          results.push(task)
          log(`❌ ${task.id} 重试 ${task.retry} 次仍失败（${task.lastError}），已记入结果并标记失败`)
        } else {
          log(
            `⚠️ ${task.id} 抓取失败（第 ${task.retry} 次）：${task.lastError}，下次再试`
          )
        }
      }
      save()
      updatePanel()
      await sleep(CONFIG.fetchGapMs)
    }
    busy = false

    // 任务队列空了就说明执行完毕
    if (tasks.length === 0) {
      finish()
    }
  }

  // ==================== 结束 ====================

  /** 结束：清除定时器、导出结果、弹窗提醒 */
  const finish = () => {
    if (finished) {
      return
    }
    finished = true
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    clearSaved()
    updatePanel()
    exportResults()
    const ok = results.filter((item) => typeof item.bookmarkCount24h === 'number').length
    const failed = results.filter((item) => item.failed).length
    const message = `追踪完成：共 ${results.length} 个作品，成功取得 24 小时收藏数量的有 ${ok} 个${
      failed ? `，失败 ${failed} 个` : ''
    }。\n结果文件已开始下载。`
    log(message)
    alert(message)
  }

  /** 把结果队列导出为 JSON 文件 */
  const exportResults = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `pbd-bmk24-${stamp()}.json`
    document.body.append(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 10000)
    log(`结果已导出，共 ${results.length} 条`)
  }

  /** 手动停止（不导出） */
  const stop = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    log('已停止定时器。可以调用 window.pbdBmk24.exportNow() 导出当前结果')
  }

  // ==================== 断点续跑（防止刷新/卡死导致白跑一晚） ====================

  const save = () => {
    try {
      localStorage.setItem(
        CONFIG.saveKey,
        JSON.stringify({ tasks, results, sourceName, savedAt: Date.now() })
      )
    } catch (err) {
      // localStorage 写满时忽略即可
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
      panelMessage.innerHTML = `✅ 已完成：结果队列 ${results.length} 条，结果文件已下载`
      return
    }
    // 找出下一个要到期的作品
    const next = tasks[0]
    let nextText = '任务队列为空'
    if (next) {
      const left = CONFIG.trackHours - hoursSince(next.createDate)
      nextText =
        left > 0
          ? `下一个到期：${next.id}（还有 ${round2(left)} 小时）`
          : `正在抓取：${next.id}`
    }
    panelMessage.innerHTML =
      `任务队列 <b>${tasks.length}</b> ｜ 结果队列 <b>${results.length}</b><br>` +
      `${nextText}<br>` +
      `<span style="color:#888">请勿关闭此标签页（每 ${CONFIG.tickSeconds} 秒检查一次）</span>`
  }

  /** 显示选文件的面板 */
  const buildPanel = () => {
    const old = document.getElementById('pbdBmk24Panel')
    if (old) {
      old.remove()
    }
    const box = document.createElement('div')
    box.id = 'pbdBmk24Panel'
    box.style.cssText =
      'position:fixed;top:10px;right:10px;z-index:999999;background:#fff;color:#222;' +
      'border:1px solid #ccc;border-radius:8px;padding:10px 12px;font:12px/1.7 sans-serif;' +
      'box-shadow:0 2px 10px rgba(0,0,0,.18);max-width:300px'
    const title = document.createElement('div')
    title.style.cssText = 'font-weight:bold;margin-bottom:6px'
    title.textContent = '追踪 24 小时真实收藏数量'
    panelMessage = document.createElement('div')
    panelMessage.style.cssText = 'margin-bottom:8px;color:#444'
    panelMessage.textContent = '请选择抓取结果导出的 JSON 文件'
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

  /** 用数据源开始追踪 */
  const start = (data, fileName = '') => {
    const { taskQueue, total, skipped } = buildTasks(data)
    sourceName = fileName
    tasks = taskQueue
    results = []
    finished = false
    log(
      `数据源共 ${total} 个作品，其中发表不足 ${CONFIG.trackHours} 小时的有 ${tasks.length} 个（跳过 ${skipped} 个）`
    )
    if (tasks.length === 0) {
      clearSaved()
      updatePanel()
      alert(
        `数据源里没有「发表不足 ${CONFIG.trackHours} 小时」的作品，任务队列为空，无法追踪。\n（共 ${total} 个作品，全部已超过 ${CONFIG.trackHours} 小时）`
      )
      return
    }
    save()
    updatePanel()
    if (timer) {
      clearInterval(timer)
    }
    // 先立刻检查一次（可能有刚好到期的），再启动定时器
    tick()
    timer = setInterval(tick, CONFIG.tickSeconds * 1000)
    log(`已启动定时器，每 ${CONFIG.tickSeconds} 秒检查一次`)
  }

  /** 继续上次未完成的追踪 */
  const resume = (saved) => {
    tasks = saved.tasks || []
    results = saved.results || []
    sourceName = saved.sourceName || ''
    finished = false
    log(
      `继续上次的追踪：任务队列 ${tasks.length} 个，结果队列 ${results.length} 个（数据源：${sourceName}）`
    )
    buildPanel()
    updatePanel()
    tick()
    timer = setInterval(tick, CONFIG.tickSeconds * 1000)
  }

  window.pbdBmk24 = {
    start: buildPanel, // 重新选数据源
    stop, // 停止定时器
    exportNow: exportResults, // 立刻导出当前结果
    clearSaved, // 清掉断点续跑的数据
    get tasks() {
      return tasks
    },
    get results() {
      return results
    },
  }

  // 如果有上次未完成的追踪，先问是否继续
  const saved = load()
  if (saved && ((saved.tasks || []).length || (saved.results || []).length)) {
    const yes = confirm(
      `发现上次未完成的追踪（任务队列 ${(saved.tasks || []).length} 个，结果队列 ${
        (saved.results || []).length
      } 个）。\n\n点「确定」继续上次的追踪；点「取消」忽略它、重新选数据源。`
    )
    if (yes) {
      resume(saved)
      return
    }
    clearSaved()
  }
  buildPanel()
})()
