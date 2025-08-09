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

下载器是在前台页面里下载文件的，下载完之后生成 Blob URL 发送给后台脚本，用 download API 下载。

在 Chrome 里这没问题，但是在 Firefox 里不行。而且也没产生错误信息，就单纯是失败，浏览器不会建立下载。

不知道是不是因为后台脚本和前台页面处于不同的环境里，所以后台脚本里无法加载使用前台生成的 Blob URL。

由于前台脚本无法调用 download API，所以我只能修改下载方式。

现在在 Firefox 浏览器上，下载器会把 arraybuff 传递给后台脚本，让后台脚本自行生成 Blob URL，然后下载。





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
