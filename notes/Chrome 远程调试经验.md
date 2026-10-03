# Chrome 远程调试经验

记录用 Chrome DevTools Protocol（CDP）连接**正在使用的浏览器**做真机调试的方法与坑。

配套脚本在 `~/.workbuddy/skills/browser-layout-probe/`：

- `cdp-attach.mjs` —— 命令行入口（列标签页 / 执行表达式）
- `cdp-session.mjs` —— 常驻会话服务（复用一条已授权的连接）
- `cdp-lib.mjs` —— 两者共用的 CDP 底层

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

脚本会自动判断属于哪一种。

> ⚠️ 最容易误判的一点：**`/json/version` 返回 404 不代表端口被别的程序占用** ——
> 新式端点本来就不提供 HTTP 发现接口。要判断「是不是 Chrome 的端点」，只能去连那条
> WebSocket，再用 `Browser.getVersion` 确认。

## 二、授权弹窗：用常驻会话解决

🔴 **Chrome 每建立一条 browser 级 WebSocket 连接，就弹一次「是否允许远程调试？」**。
如果每个命令都新开连接，用户就要反复手动放行。

对策：只连一次并保持长连接 —— 本地起一个转发服务，之后所有命令共用它。

```bash
# 第 1 步：建立会话（此时 Chrome 会弹一次授权框，点「允许」）
node cdp-session.mjs --port=9222 --listen=9339

# 之后随便跑多少次，都不会再弹
node cdp-attach.mjs --list --match=pixiv.net
node cdp-attach.mjs expr.js --match=pixiv.net/artworks --pick=0

# 全部调试结束后再断开
node cdp-attach.mjs --stop-session
```

`cdp-attach.mjs` 检测到会话不存在时也会**自动拉起**一个，所以多数情况直接跑命令就行。

> ⚠️ **启动方式很重要**：如果用「命令结束后即回收」的方式（例如某次临时 shell 里 detached
> spawn）启动，前台命令一结束，守护进程就跟着没了 —— 下一次又会从零开始，白白再弹一次授权。
> 用终端工具的**后台任务**方式启动才能跨命令存活。这点在本机实测确认过。

会话还顺带解决了另一件事：**target 级会话会被缓存复用**，不必反复 `attachToTarget`。

## 三、命令速查

```bash
node cdp-attach.mjs --list                              # 列标签页
node cdp-attach.mjs expr.js --match=<子串> --pick=N     # 按 URL/title 选页执行
node cdp-attach.mjs expr.js --new=<url>                 # 新开标签页（不打扰当前页面）
  --ua=mobile --width=394 --height=854 --dsf=3          #   模拟 iPhone 环境
  --wait-for=<选择器> --wait-timeout=25000              #   等元素出现（等脚本注入完）
  --close                                               #   跑完关闭新标签页
node cdp-attach.mjs --close-match=<子串>                # 批量关标签页（清理遗留）
node cdp-attach.mjs --stop-session                      # 断开会话
```

`expr.js` 必须是 async IIFE，以 `return JSON.stringify(...)` 结束。

⚠️ **默认不导航**。`--navigate` 会改掉用户正在看的页面，只在明确需要时用。

## 四、踩过的坑

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

## 六、安全

🔒 调试端点等同于「本机任意程序可完全控制浏览器」。不用时 `--stop-session` 断开，
并在 `chrome://inspect` 里取消勾选。
