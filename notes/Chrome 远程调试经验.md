# Chrome 远程调试经验

记录用 Chrome DevTools Protocol（CDP）连接**正在使用的浏览器**做真机调试的方法与坑。

备注：
- 这个文档是在该仓库作者的电脑上测试、编写的，环境是 Windows 11、Chrome 浏览器，编写此文档的智能体是 WorkBuddy。
- 如果有下面提到的配置脚本，则需要严格遵守此文档的说明；有新的经验、踩坑的话也可以更新此文档。
- 在其他人的电脑上，情况可能不同，也没有下面提到的配套脚本，此时该文档仅供参考。

配套脚本在 `~/.workbuddy/skills/browser-layout-probe/`（2026-10-24 已按本文重写，旧的 `cdp-daemon.mjs` / `cdp-cli.mjs` 已删除）：

- `cdp-attach.mjs` —— 命令行入口（列表 / 选页执行 / 新开标签 / 关闭标签 / 状态 / 停止会话）
- `cdp-session.mjs` —— 常驻会话服务（复用一条已授权的连接）
- `cdp-lib.mjs` —— 两者共用的 CDP 底层

会话默认监听 `127.0.0.1:9339`（可用 `--listen` 改；CLI 用环境变量 `CDP_LISTEN=<端口>` 指定）。

零依赖，只用 Node 22+ 内置的 `fetch` / `WebSocket`，不需要装 Playwright / Puppeteer。

## 一、怎么开启

### 推荐：Chrome 自带的远程调试开关

1. 地址栏打开 `chrome://inspect/#remote-debugging`
2. 勾选 **"Allow remote debugging for this browser instance"**
3. 显示 `Server running at: 127.0.0.1:9222` 即成功

优点：不用重启浏览器，**profile 不变**，所以登录态、扩展、用户脚本注入的 DOM 全都在 —— 这是调试扩展类项目的关键。

> 🔴 Chrome **136 起**，当 `--user-data-dir` 是**平台默认目录**时，`--remote-debugging-port`
> 会被**静默忽略**（安全变更），端口根本不会开。所以「先 taskkill 掉 Chrome、再用命令行带端口
> 启动」这条路对**日常 profile 无效**。命令行方式仍然适用于独立 profile 的无人值守自动化。

### 这个端点和传统端点不一样

| | 传统 `--remote-debugging-port` | `chrome://inspect` 开关 |
| --- | --- | --- |
| `GET /json/version`、`/json/list` | ✅ 有 | ❌ **全部 404** |
| browser 级 WebSocket | `/devtools/browser/<uuid>` | `ws://127.0.0.1:9222/devtools/browser`（**没有 uuid**） |
| 列标签页 | `/json/list` | `Target.getTargets`，字段名是 **`targetInfos`**（不是 `targets`） |
| 在页面执行 | 各 target 自己的 ws | `Target.attachToTarget({flatten:true})` 拿 `sessionId`，之后每条命令都要带上它 |

⚠️ 本机脚本只实现**新式端点**（`chrome://inspect` 开关 + `ws://127.0.0.1:9222/devtools/browser`）；传统 `--remote-debugging-port` 的 `/json/list` 那套没有实现。

> ⚠️ 最容易误判的一点：**`/json/version` 返回 404 不代表端口被别的程序占用** ——
> 新式端点本来就不提供 HTTP 发现接口。要判断「是不是 Chrome 的端点」，只能去连那条
> WebSocket，再用 `Browser.getVersion` 确认。

## 二、授权弹窗：用常驻会话解决

🔴 **每个「调试服务周期」的第一条连接会弹一次「是否允许远程调试？」**（开关被关闭再打开、
或浏览器重启后，周期重新开始 → 又要授权一次）。

在周期内，**后续新建的连接不再弹框**（2026-10-13 实测：授权后新开一条 WebSocket，
2 秒即连接成功、无任何弹框）。即便如此，**仍推荐只连一次并保持长连接**——
一次连接长期复用更快，target 级会话还能缓存：

```bash
# 第 1 步：建立会话（此时 Chrome 会弹一次授权框，点「允许」）
node cdp-session.mjs --port=9222 --listen=9339

# 之后随便跑多少次，都不会再弹
node cdp-attach.mjs --list --match=pixiv.net
node cdp-attach.mjs expr.js --match=pixiv.net/artworks --pick=0

# 全部调试结束后再断开
node cdp-attach.mjs --stop-session
```

⚠️ `cdp-attach.mjs` **不会**自动拉起会话（本机实测：detached spawn 会随前台命令一起被回收，
等于每次都重新授权）。没有会话时它会直接打印启动命令，照抄即可。

> ⚠️ **启动方式很重要**：如果用「命令结束后即回收」的方式（例如某次临时 shell 里 detached
> spawn）启动，前台命令一结束，守护进程就跟着没了 —— 下一次又会从零开始，白白再弹一次授权。
> 用终端工具的**后台任务**方式启动才能跨命令存活。这点在本机实测确认过。

会话还顺带解决了另一件事：**target 级会话会被缓存复用**，不必反复 `attachToTarget`。

### 🔴 但「重开 / 关闭过开关」之后，旧连接一定作废

在 `chrome://inspect` 里把开关关掉再打开，**Chrome 会直接把那条 WebSocket 关掉**，
缓存的所有 target 会话随之失效。此时：

- 会话进程还在，看上去一切正常（早期版本的 `/status` 甚至照样返回 200 —— 会**谎报健康**）；
- 但真正发命令会**挂到超时**才报失败，错误信息还很含糊。

现在脚本已经能处理这种情况（每条 WebSocket 上挂了 close 监听）：连接一旦断开就标记失效，
命令**立即失败**而不是空等超时，下次请求时自动重连，`/status` 也会做真实探活
（`connected` 字段反映真实状态）。

不过有一条**绕不过去**：

> **开关被关掉再打开（或浏览器重启）后，需要重新授权。** —— 关掉开关本身就可能清掉
> 「授权记忆」（实测：开关切换后的重连会再次弹框），这是 Chrome 的安全策略，无法跳过。

所以实际效果是：**在一个周期内**（开关没被动过、浏览器没重启），无论跑多少次命令、
甚至连接断开后重连，**都只授权一次**；只要开关被切换过（或浏览器重启过），授权就要再来一次。
因此调试期间尽量不要去动那个开关。

## 三、命令速查

```bash
node cdp-attach.mjs --list [--match=<子串>] [--all] [--json]   # 列标签页（含 context / 窗口 / 屏幕坐标）
node cdp-attach.mjs expr.js --match=<子串> [--pick=N]          # 按 URL/title 选页执行
node cdp-attach.mjs expr.js --target=<id前缀>                  # 直接指定 target
node cdp-attach.mjs --eval="<表达式>" --match=<子串>           # 不写文件，直接执行一小段表达式
node cdp-attach.mjs expr.js --new=<url>                        # 新开标签页（不打扰当前页面）
  --window=<windowId> | --context=<browserContextId>           #   开在指定窗口/ profile
  --ua=mobile [--width=394 --height=854 --dsf=3]               #   模拟 iPhone（导航前设置；只写 --ua=mobile 时默认 394x854@3x）
  --wait-for=<选择器> --wait-timeout=25000                     #   等元素出现（等脚本注入完）
  --close                                                      #   跑完关闭新标签页
node cdp-attach.mjs --close-match=<子串>                       # 批量关标签页（清理遗留）
node cdp-attach.mjs --status                                   # 会话健康
node cdp-attach.mjs --stop-session                             # 断开会话
```

`expr.js` 必须是 async IIFE，以 `return JSON.stringify(...)` 结束；返回字符串时原样打印，其它类型打印 JSON。

⚠️ **默认不导航**。`--navigate=<url>` 会改掉用户正在看的页面，只在明确需要时用。

⚠️ `--new` 想开在**指定窗口**时要传 `--window=<windowId>`（或 `--context=<browserContextId>`）：
脚本会找该窗口里的 `chrome://` 页面用 `window.open` 开标签；找不到时会退回 `Target.createTarget`
（会落在主屏窗口）。

## 四、踩过的坑

### 多 profile 会共享同一个浏览器进程（Chrome 154 实测）

同一台机器上开多个 Chrome profile（不同个人资料的窗口）时，新版 Chrome 可能把它们**托管在
同一个浏览器进程**里（实测：两个 profile 各有独立窗口、头像/资料路径都不同，但只有一个不带
`--type=` 的 `chrome.exe` 进程；两个窗口的标签页都出现在同一个 9222 的 `Target.getTargets` 里）。

推论：

- 「两个窗口互相影响」的调试开关 / 端口 / 「被自动测试软件控制」横幅，都是**进程级共享**的
  —— 不是两个实例在互相同步；
- **但 profile 之间仍可区分**：非主 profile 的页面在 `Target.getTargets` 里带有**独立的
  `browserContextId`**（主 profile 的页面是 default context）。据此可以精确筛选某个 profile
  的页面；⚠️ 但 `Target.createTarget({url, browserContextId})` 对 profile 级 context **不可用**
  （实测报 `Failed to find browser context with id`）；要开在指定窗口，用该窗口的 WebUI 页面
  `window.open`（`cdp-attach.mjs --new --window=` 已封装）；
- ⚠️ `Target.getBrowserContexts` **不会列出**这些 profile 级 context（返回空数组），
  别用它判断，直接读每个 target 的 `browserContextId` 字段。

### 怎么分辨「窗口属于哪个 profile / 哪块屏幕」

- **屏幕**：`Browser.getWindowForTarget` 返回窗口 `bounds` 坐标（多屏布局里副屏可能是负坐标）。
- **窗口号**：同一个 `windowId` 的标签页属于同一个窗口。
- **调试服务挂在哪个进程**：`netstat -ano` 找 `ESTABLISHED` 行（⚠️ 本机实测**没有 LISTENING
  行**，`Get-NetTCPConnection -State Listen` 也查不到——别被误导），得 PID →
  `Win32_Process.CommandLine` 的 `--profile-directory`。
- **用户刚操作过哪个页面**：读页面的 `performance.timeOrigin`（= 页面创建/刷新时间）。

### 必须排除 `devtools://` 窗口

DevTools 自己的窗口 title 会伪装成 `DevTools - www.pixiv.net/artworks/...`，
`--match=pixiv` 很容易误选中它。脚本已默认过滤。

### 调试移动端：设备模拟是「逐标签页」生效的

- DevTools 里点设备模拟按钮，只对那个标签页有效；
- 很多站点/脚本靠 **UA** 判断移动端（本项目是 `navigator.userAgent.includes('Mobile')`），
  不是靠视口宽度。

⇒ 用 `--new` 开的标签页默认是桌面模式，必须显式 `--ua=mobile --width=394 ...` 才能复现。
而且 **UA / 视口必须在导航之前设置**（用 `Network.setUserAgentOverride` +
`Emulation.setDeviceMetricsOverride`），否则用户脚本会先跑完，移动端分支判断就错了。

### CDP 请求必须带超时兜底

页面**正在导航**或**执行上下文刚被销毁**时，某些域的请求**永远不返回**。
没有超时就会把整个会话挂住，表现为脚本卡死、只能 SIGTERM。

两条对策：

1. `Cdp.send()` 默认 30s 超时（可用参数关掉）；
2. 轮询等待选择器（`--wait-for`）时，**每次 evaluate 单独兜 3s 超时并吞掉异常**继续下一轮。

### 🔴 共用一条 WebSocket 时，不能给每个会话设置 `ws.onmessage = ...`

新式端点下所有 target 共用同一条 browser 连接。若每个会话对象都在构造时
直接赋值 `ws.onmessage`，**后建的会覆盖先建的**，于是 browser 级命令的响应被吞掉。

症状很有迷惑性：**第一次 `--list` 正常，跑过一次 exec 之后 `--list` 就废了。**
对策：每条 WebSocket 只注册一个 listener，按消息里的 `sessionId` 分发到对应的会话对象。

同理，会话级对象的 `dispose()` **绝不能 `ws.close()`** —— 那条连接属于 browser，
关掉等于把整条链路掐断，所有会话一起失效。只有 browser 级对象才拥有连接。

### 记得回收临时标签页

异常中断（超时被杀）很容易留下 `about:blank`。用 `--close` 或事后 `--close-match=blank` 清理。

### 改完 `dist/` 后让 Chrome 重载未打包扩展

⚠️ **最容易踩的坑：重载的 profile 和你检查的页面不是同一个。**

Chrome 会把多个 profile 托管在同一个浏览器进程里，`Target.getTargets` 一次就能列出**所有 profile** 的页面和窗口。
本机实测有两个窗口：主屏窗口 `left≈-7`（`browserContextId=56F9…`）和左侧副屏窗口 `left≈-1470`
（`browserContextId=725C…`），两边都装了同一个扩展（同路径 → 同 id）。
而**扩展的重载是按 profile 生效的**：在 A profile 里 `chrome.runtime.reload()`（或 `Extensions.loadUnpacked`）
不会刷新 B profile 已经注入的 content script。

2026-10-24 就因为这一点误判过「重载成功但页面还是旧脚本」：测试页在主屏窗口，重载的却是另一个 profile；
换成在测试页所在 profile 的扩展 SW 上 `chrome.runtime.reload()` 后立刻生效。

- 先定位：`Target.getTargets` 看页面的 `browserContextId`；`Browser.getWindowForTarget` 看窗口 `bounds`
  （负的 `left` = 左侧副屏）。别凭「我以为在副屏操作」判断。
- 然后在**测试页所在的 profile** 里重载：
  - `chrome.runtime.reload()`：要求该 profile 的扩展 SW target 存在（MV3 的 SW 睡眠后 target 消失，
    命令会报 target 不存在）；
  - 浏览器级 `Extensions.loadUnpacked {"path": "...\\dist"}`：不需要 SW，但同样只作用于某一个 profile，
    而且不保证真的重新注入。
- 重载后**务必验证**：挑一个**本版本才新增**的特征（按钮顺序 / id、新 `symbol`、新文案），
  不要看旧版本就存在的元素。
- 更省事的做法：把测试页开在**同一个 profile**（`Target.createTarget` 支持传 `browserContextId`），
  别在两个窗口/profile 之间来回切。

## 五、诊断手法的经验

这几条和具体项目无关，什么时候都适用：

1. **先做因果对照，再动手改代码。** 临时把可疑的 CSS / JS 改一下，看现象是否随之消失。
   「改回去又复现」才算证明 —— 单向的成功可能只是巧合。
2. **查遮挡用 `elementsFromPoint()` 而不是 `elementFromPoint()`。** 前者返回完整的层叠栈，
   能直接看出「谁压在谁上面」；只拿到最上层元素，看不出被压的是哪一个。
3. **断言必须有反向验证。** 临时把修复去掉，确认断言真的会失败。否则很可能写出恒真的假测试。
4. **复现环境要和真实一致。** 用 jsdom 之类的模拟环境得出的结论，在真机上可能完全相反
   （例如会发现某个组件其实早就存在于 DOM 中）。涉及登录态、扩展、用户脚本的问题，
   只能连真浏览器验证。
5. **原生对话框会冻住页面。** `window.confirm` / `alert` / `beforeunload`（**原生**对话框）
   打开时页面 JS 冻结，`Runtime.evaluate` 全部**超时挂起**（很像死循环，其实是对话框在等点击）。
   - 恢复：`Runtime.terminateExecution` 可直接中断阻塞（2026-10-13 实测有效，之后求值立即恢复）；
     或 `Page.handleJavaScriptDialog {accept}` 主动应答（无对话框时返回 "No dialog is showing"）。
   - 本项目注意：点「开始抓取」时若**已有未下载的抓取结果**，会弹 `confirmRecrawl()` 的
     `window.confirm`（「这个标签页里已经有抓取结果了……」）——自动化测试点击前先处理这个状态，
     别让流程停在对话框上。
   - ⚠️ **在主世界覆盖 `window.confirm` 没用**：扩展的 content script 运行在 **isolated world**，
     它调用的是自己那个 world 里的 `window.confirm`，主世界的赋值影响不到它。
     所以「先覆盖 confirm → 再点击按钮」挡不住对话框（2026-10-14 实测：页面照旧冻结，`Runtime.evaluate`
     30 秒超时）。这类对话框只能用 `Page.handleJavaScriptDialog {accept}` 应答，或让人在浏览器里点。
     同理，想改扩展的设置开关，只能点 DOM（DOM 是共享的，主世界 `element.click()` 有效），
     不能直接改它 world 里的变量。

## 六、安全

🔒 调试端点等同于「本机任意程序可完全控制浏览器」。不用时 `--stop-session` 断开，
并在 `chrome://inspect` 里取消勾选。

## 个性化

有个文档针对该仓库作者的使用环境，做了更个性化的说明。如果 `c:/document/github/本机 Chrome CDP 调试指南.md` 文件存在，则读取该文件里的说明；如果文件不存在则忽略。
