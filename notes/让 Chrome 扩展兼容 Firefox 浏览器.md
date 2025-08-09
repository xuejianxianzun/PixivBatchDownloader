# 让 Chrome 扩展兼容 Firefox 浏览器

日期：2025-08-09

我要把下载器改成兼容 Firefox 浏览器，做个笔记。

Firefox 浏览器扩展的开发、测试、发布等文档：
https://extensionworkshop.com/documentation/develop/

下面是一些子文档：

移植 Google Chrome 扩展程序：
https://extensionworkshop.com/documentation/develop/porting-a-google-chrome-extension/

发布扩展时，还需要提交源代码和构建流程：
https://extensionworkshop.com/documentation/publish/source-code-submission/

并且测试扩展的步骤也有点麻烦。无语。

## 使用 webextension-polyfill 处理兼容性

Chrome 的扩展程序 API 以 chrome. 开头，Firefox 的扩展程序 API 则是以 browser. 开头。

虽然 Firefox 的文档里说 Firefox 也可以直接使用 chrome.，不过看起来更流行使用 webextension-polyfill 来处理兼容性。这个包提供了 Firefox 所使用的 browser 命名空间，并且当扩展运行在 Chrome 上时，自动换成 chrome 命名空间。

### 安装 webextension-polyfill

```shell
npm i webextension-polyfill
```

### 添加类型指示

在 tsconfig.json 的  compilerOptions.types 里添加 webextension-polyfill，如：

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "sourceMap": true,
    "outDir": "./dist/js",
    "downlevelIteration": true,
    "strict": true,
    "types": ["webextension-polyfill"],
    "allowSyntheticDefaultImports": true
  },
  "include": ["./src/ts/*"],
  "exclude": ["node_modules"]
}
```

### 替换 chrome API

在 ts 文件里使用时，先引入 browser 命名空间，然后把 chrome. API 替换成 browser.，例如：

```ts
import browser from 'webextension-polyfill'

// 旧代码
chrome.runtime.onMessage
// 改为：
browser.runtime.onMessage
```

### 修改过时的代码


由于这个扩展是好几年前开始编写的，当时一些 API 不支持 promise 模式，比如下载文件时，download 方法的第二个参数是回调函数，：

```ts
// 旧代码
chrome.downloads.download({ url },(id) => {})
```

现在已经不推荐这种写法了，因为这个 API 现在会返回 promise，无须传递回调函数。本来不改也没影响，但是 browser 命名空间直接去掉了第二个参数，旧代码会报错，所以必须修改：

```ts
// 新代码
browser.downloads.download({ url })
.then((id) => {})
```

-----------

有些地方的类型可能也需要处理。旧代码的 onMessage 绑定的事件里，msg 可以直接指定类型，如：

```ts
chrome.runtime.onMessage.addListener(function (msg: SendToBackEndData){
  msg.msg
})
```

但是 browser 命名空间更加严格，msg 只能是 unknown，指定为其他类型的话会报错。需要在下面断言，或者做类型守卫：

```ts
browser.runtime.onMessage.addListener(function (msg: unknown){
  // 检查类型
  if (!isSendToBackEndData(msg)) {
    return
  }
  
  // 在上面检查过类型之后，下面的 msg 就会被推断为 SendToBackEndData 类型
  msg.msg
})

// 类型守卫
function isSendToBackEndData(msg: unknown): msg is SendToBackEndData {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    'msg' in msg &&
    'fileUrl' in msg
  )
}
```

变得麻烦了。

### 修改下载方式

提示：如果你的扩展是把文件的原始 URL 发送给浏览器下载的话，不需要看这一部分。

**情况说明：**

这个下载器是在前台页面里下载文件的，下载完之后生成 blob URL 发送给后台脚本，再调用 download API 保存文件。

在 Chrome 里这没问题，但是在 Firefox 里不行。而且也没有错误信息，就单纯是失败，浏览器不会建立下载。

不知道是不是因为后台脚本和前台页面处于不同的环境里，所以后台脚本里无法使用前台生成的 blob URL（但按理说，浏览器是肯定能访问这个 blob URL 的，可能是 Firefox 在后台脚本的机制里做了什么限制）。

由于前台脚本无法直接调用 download API 来尝试让 Firefox 使用前台生成的 blob URL，所以我只能在后台里重新生成 URL。

现在在 Firefox 浏览器上，下载器会把 blob 对象传递给后台脚本，让后台脚本自行生成 blob URL，然后下载。

**性能测试：**

我在 2 分钟内从一个画师主页下载了 1.2 GB 图片，浏览器的内存占用没有明显增加。因为我有及时释放 blob URL，所以测试表现符合预期。

画师 純白可憐(Pale)：
https://www.pixiv.net/users/20778107

他的图片体积都比较大，不乏 10 - 30 MB 的图片，所以很适合用于测试下载大文件的表现。顺带一提，也适合测试梯子的下载速度。

### 打包 webextension-polyfill

编译代码时，需要把 webextension-polyfill 也一并打包。

我是用的是 webpack，在本项目中不需要修改打包配置。因为文件里引入了 webextension-polyfill，所以 webpack 在打包时会自动添加它的代码。

## 修改 manifest.json

Firefox 虽然也支持 MV 3，但是一些字段和 Chrome 有区别，需要修改 manifest.json。下面只说我遇到的情况，至于完整的区别，虽然官方文档里有个兼容性表格，但是看着费劲，想了解的话不如问 AI。问的时候记得限定为 MV 3 版本，否则 AI 会回答一些 MV 2 里才能用的属性。

### 添加 id 属性

可以在 browser_specific_settings 属性里设置扩展的 id，例如：

```json
"browser_specific_settings": {
    "gecko": {
      "id": "PowerfulPixivDownloader@pixiv.download"
    }
  },
```

虽然这不是必须的，但是自定义一个总比发布时生成的随机 id 要好。id 的值是自定义的，具有独特性即可，常见的格式如 `扩展名@邮箱或域名`。

参见文档：
什么时候需要附加组件 ID？
https://extensionworkshop.com/documentation/develop/extensions-and-the-add-on-id/#when-do-you-need-an-add-on-id

### 后台脚本不能使用 service_worker

在 Chrome 扩展 MV 3 里，后台脚本必须使用 service_worker，但 Firefox 不支持，依然需要使用传统的 scripts。下面的配置同时具有这两种方式，以便在两个浏览器里都生效：

```json
"background": {
  "preferred_environment": ["service_worker"],
  "service_worker": "js/background.js",
  "scripts": ["js/background.js"]
},
```

preferred_environment 的作用是：如果 Firefox 以后支持了 service_worker，让它优先使用 service_worker，而非 scripts。

### incognito 模式的区别

incognito 用于设置隐私窗口是否启用独立的后台脚本。

```json
"incognito": "spanning",
```

spanning 是默认模式，即使有多个窗口（指主窗口和隐私窗口），扩展的后台脚本也只有一份。隐身窗口里的前台操作会发送给唯一的后台脚本。还有个 split 即拆分模式，主窗口和隐私窗口的后台脚本是独立的。

下载器之前使用的是 split，但是 Firefox 只支持 spanning，使用 split 的话会报错。所以下载器只能改成 spanning。目前这会导致下载器无法在隐私窗口里下载文件，之后换个下载方式看能不能解决这个问题。

## 调试扩展

Chrome 在扩展管理页面里可以添加本地扩展的文件夹，在代码重新编译后也可以点击刷新按钮重新加载。但是 Firefox 要麻烦些，因为它的扩展管理页面里只能加载有签名的 zip 或 xpi 包，不能加载未签名的压缩包，也不能加载文件夹。

需要进入“调试附加组件”页面 `about:debugging#/runtime/this-firefox`，才能加载本地扩展（选择扩展的 manifest.json 文件），以及重载扩展、检查背景页面：

![](./images/20250809_151731.png)

我看发布扩展时也挺麻烦，因为下载器的代码是用 webpack 打包了的，所以每次更新时都需要提供源代码和 build 方法，让测试人员手动构建，并要求生成的文件内容一致。还要提交第三方库的仓库网址之类的，这些都是发布 Chrome 扩展时没有的步骤。

### 傻逼 Firefox 浪费生命

一个纯前台的功能在 Chrome 上好好的，在 Firefox 上却会报错。

我把一个图片加载为 arraybuffer：

```ts
const cover = await fetch(coverUrl).then((response) => {
  if (response.ok) return response.arrayBuffer()
})
```

然后把它传递给 jepub.js 来创建电子书。在 Chrome 上一直都是正常的，但是在 Firefox 上却报错了。原因是 jepub.js 里的 `if (data instanceof ArrayBuffer)` 检查结果是 `false`。

对此，AI 回答：`response.arrayBuffer()` 返回的 ArrayBuffer 是由浏览器内部的原生代码创建的，而不是通过 `new ArrayBuffer()` 构造的。这可能导致 Firefox 将其视为一个**非标准**的 ArrayBuffer，尽管它在功能上是**等价的**。

按照 AI 的建议，使用 `new ArrayBuffer()` 复制了一份这个 arraybuffer：

```ts
const newCover = new ArrayBuffer(cover.byteLength);
new Uint8Array(newCover).set(new Uint8Array(cover));
```

经过这样脱裤子放屁的操作，果然可以通过 `data instanceof ArrayBuffer` 的检查了。但之后调用 jszip.js 时又产生了报错：

```
Error: Can't read the data of 'OEBPS/assets/17995414.jpg'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?
```

然而 Chrome 上依然是一切正常的，依然顺利地创建了电子书。

这个报错是其他地方的 `response.blob()` 导致的，原因是一样的，Firefox 不认为这样生成的 blob 是标准的 blob 对象，当 jszip 对这样的 blob 进行检查时，就产生了上面的错误。

我真的日了 Firefox 的马，方方面面搞这么严格，但你是面向用户的浏览器，而不是后端或者工业代码，现在搞得用户体验屌差（程序员也是用户好吧）。我的代码和数据格式明明没问题，就因为沟槽的类型检查不断折腾，而且这次出问题的还都是第三方库，我还得在第三方库里检查相关代码、打日志，我现在真是边改边骂。而且不知道以后还有没有别的坑。

不管是前面说过的前台生成的 blob URL 无法在后台使用、还是严格的类型检查，以及加载、发布扩展时的严格要求，都是在平白增加程序员折腾和 debug 的时间。对于类型的严格要求让少数老学究去折腾就算了，但实际上是所有使用 Firefox 进行开发的程序员都会被影响，我真是服了，怪不得你扩展软件生态差呢，根本没有舒心的开发体验。



