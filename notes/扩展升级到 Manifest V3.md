# 扩展升级到 Manifest V3

这次更新主要修改了 `manifest.json` 文件和 `src/ts/background.ts`。花费的时间比我预想的长很多，主要是 background 脚本转变为 Service worker，因为一些特性的变化，踩了不少坑才适配完成。

迁移时的参考文档： https://developer.chrome.com/docs/extensions/mv3/mv3-migration-checklist/

## 使用 declarative_net_request 取代了 webRequest

以前的 webRequest 是编程式的方法，需要写代码来拦截请求、修改请求。现在的 declarative_net_request 是声明式的方法，只需要在 `manifest.json` 中声明要修改的请求，以及要执行的操作。对于很多常见的场景，使用 declarative_net_request 更加简便。

此外，使用 declarative_net_request 可以更好的保护隐私（因为扩展程序不能获取到请求的内容），同时提高性能（请求没有被扩展程序的代码拦截）。

## 使用 Service worker 取代了后台脚本

Service worker 相比以前的 background script，最重要的区别是它不是持久存在的。也就是说它在空闲时会被销毁。

一般会有两种操作激活 Service worker ：1 点击图标 2 向后台发送下载。抓取时是不需要 Service worker 工作的。

以前后台脚本存行过程中使用的数据是保存到 JS 变量里的，但是如果 Service worker 被销毁，数据也就没有了，所以现在我不得不把数据保存到 `chrome.storage.local`。（这使得下载器添加了一项新的权限请求：`storage`）

`chrome.storage.local` 的存取都是异步的，这一点需要注意。

## 升级了 @types/chrome 包的版本

因为之前安装的 @types/chrome 版本不支持 Manifest V3，所以升级了它的版本。

## 其他修改

从 V2 迁移到 V3 的过程中还有其他一些修改。具体情况请查看这次提交与上次提交的差别。

## 未按照规范修改的地方

迁移指南里说：您是否在内容脚本中发出 CORS 请求？将这些请求移至后台 service worker。

但是，下载器需要在前台下载文件（文件是跨域的）。我不打算把文件的下载移到后台 worker，因为前台需要显示下载进度（下载进度需要高频率刷新），如果把请求放到后台，那么就需要后台**频繁的**向前台发送消息来传递进度。根据我以前的测试，在后台频繁发送多个消息时，传递到前台的延迟时间比较大，甚至有可能达到 1 秒以上。所以这个地方没有修改。

此外，Service Workers 不支持 `XMLHttpRequest`，只能使用 `fetch()`，这也导致很难计算下载进度。

# Service Workers 的回收时间

1. 新安装此扩展，之后什么都不做，等待 30 秒后 Service Workers 被回收。
2. 点击扩展图标使其激活，存活时间也是 30 秒。
3. 打开 pixiv 页面使其激活，然后什么都不做（或者关闭 pixiv 页面），大约 5- 6 分钟后 Service Workers 被回收。
4. 打开 pixiv，并进行一次简单的下载，之后 Service Workers 在经过 1 小时后仍然未被回收（不清楚等多久会回收）。（但是几天后我再次观察，有时 20 分钟左右就会被回收，我很疑惑）
5. 下载一半暂停，表现同上。

抓取作品时不会唤醒 SW，因为此时没有向后台发送消息。下载时会唤醒 SW。

# 迁移过程中的踩坑

## chrome.scripting.executeScript 不能修改页面里的变量 

`chrome.scripting.executeScript` 这个 API 不能可靠的修改扩展所在页面的 JS 变量环境。

根据目前的测试，一部分变量可以修改，另一部分不可以。

例如：使用 `chrome.scripting.executeScript` 执行 `supportListenHistory` 函数：

```js
chrome.scripting.executeScript(
{
  target: {
    tabId: sender.tab!.id!,
    allFrames: true
  },
  func: supportListenHistory,
},
```

`supportListenHistory` 函数的内容：

```js
window.name = '1234'

window.xianzun = 'xianzun'

window.history.forward = function(){
  console.log('forward')
}
```

执行之后，所有框架里（主页面、本扩展、其他扩展）的 `window.name` 都变了。

但是 `window.xianzun` 和 `window.history.forward` 只在扩展自己的框架里变了，其他所有框架里（包括主页面）都没有生效。

这实在非常坑爹。

下载器遇到的问题是这样的，需要在页面上动态添加 script 标签，修改页面上的变量。以前由于清单系统是 V2，可以这样做：

```js
const s = document.createElement('script')
s.setAttribute('type', 'text/javascript')
s.innerHTML = `
// 省略了一些代码
history.pushState = _wr('pushState');
history.replaceState = _wr('replaceState');
`
document.head.appendChild(s)
```

但是在 V3 里不可以这样。我几经尝试（有一次已经接近成功了），但后来又误入歧途，被 `chrome.scripting.executeScript` 坑了很久很久。解决办法是把要执行的代码保存到 js 文件里，在清单中声明，然后就可以获取它的 url 来使用了：

```js
const s = document.createElement('script')
const url = chrome.runtime.getURL('lib/listen_history_change.js')
s.src = url
document.head.appendChild(s)
```

参考答案：[stackoverflow](https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions)

## 声明 resourceTypes

下载器发送 xhr 请求来加载一张图片，resourceTypes 是 `xmlhttprequest` 还是 `image`？

此时要看发起方是谁，因为发起方是 xhr 请求，所以应该使用 `xmlhttprequest`。

如果是页面上的一个 image 标签加载它的图片，则应该使用 `image`。

```json
[
  {
    "id": 1,
    "priority": 1,
    "action": {
      "type": "modifyHeaders",
      "responseHeaders": [
        {
          "header": "Access-Control-Allow-Origin",
          "operation": "set",
          "value": "*"
        }
      ]
    },
    "condition": {
      "urlFilter": "||pximg.net",
      "resourceTypes": ["xmlhttprequest"]
    }
  },
]
```

文档：[Chrome 扩展里可以使用的 resourceType](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#type-ResourceType)

## chrome.storage 保存和读取数据时的格式是 Map

由于 chrome.storage 保存的数据必须是带有大括号的 Object（可以被 JSON 解析的），所以如果我们有一个对象和数组：

```js
let o = {}
let a = []
```

保存的时候，必须把它们包裹在大括号里：

```js
chrome.storage.local.set({o})
chrome.storage.local.set({a})
```

这就导致了在储存后的数据里，我们实际上要使用的数据被包裹在了对象里，而变量的名称成为了数据的 key：

```js
// o 的储存结果
{
  o:{}
}

// a 的储存结果
{
  a:[]
}
```

所以我们在读取的时候，就需要使用 key 来取出对象里的值，才能使用。

```js
async function getData(key: string) {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (data) => {
      // 注意，返回的 data 是上个代码块里存储之后的结果，我们需要使用 [key] 来取出我们要使用的值
      resolve(data[key])
    })
  })
}

await getData('o')
await getData('a')
```

## chrome.storage 不能用来保存有大量空项目的数组

`background.ts` 里的 `dlBatch` 和 `dlIndex` 变量就是这种数组：

```js
dlBatch = []

// 用 tab.id 作为索引值，保存时间戳
dlBatch[1943987908]  = 1671738924825

dlBatch
// 前面有大量的空数组项
// (1943987909) [空属性 × 1943987908, 1671738924825]
```

在去年我刚尝试升级到 Manifest V3 时好像没有问题，但是现在却出现了问题。

一旦用 `chrome.storage.local.set` 来保存这样的数据，Service Worker 里的代码执行到这里时就会发生异常，好像是卡在了这里，不会执行接下来的代码，而且原本已经注册好的事件监听器也不会再产生反应（这就导致下载卡住了）。而且 Service Worker 会很快被回收（通常只需要几秒）。

在这种异常发生时，Chrome 没有产生报错或者任何提示信息。我折腾了许久才发现是数据结构的原因。

解决思路就是把这两个变量改为键值对映射的对象。
