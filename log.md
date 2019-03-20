## 1.1.2

之前的下载方式和脚本版是一样的，点击 a 标签下载。现在为了能自动建立文件夹，改成了发送给 chrome 来下载。

## 1.1.3

上个版本里，把 time_interval 改小了，结果出现了问题，极少数图片会下载重复，并且重复了几个，就会有几个正常图片下载不到，就像被“挤掉了”一样。于是把 time_interval 改回去了。

**time_interval** 这个参数是半年前加上的，可参考脚本版 log.md 的 5.1.0 条目。简单来说，可能是连续两个下载任务间隔时间很短的话，会导致有一个保存不上。这个参数人为的增加了延迟。

但是很奇怪的是，当初脚本版出现这种情况会导致漏下，如今扩展版的异常不是漏下，而是变成重复了，其中原因不清楚。

我不能确定这个问题是否真的是由 time_interval 导致的。因为目前这个问题仍然偶尔出现。问题总是出在前几个作品里（10个以内），里面有 1 或 2 个重复的，并且导致有其他作品漏下了。

最近的测试里，每批 400 张图片，下载了 4 次（1600 张），出现了 1 个重复的图片。

我觉得下载越快（浏览器处理不过来），越容易出现这个问题。解决的办法可能需要继续增加 time_interval 的延迟，或者（并且）减少同时下载的线程数。但是这样下载会变慢，暂不处理。

扩展版的稳定性一直不如脚本好，很奇怪。有时候脚本版的看图组件会加载失败；有时候收藏时自动点赞失效，奇哉怪也。

## 1.2.3

点击扩展图标可以显示/隐藏下载面板

## 1.2.5

上个版本出现了bug，改回上上版本的内容。

## 1.3.0

- 感谢 [z2n](https://github.com/z2n) 对本工具做出的改进，使本工具适配了 Firefox 浏览器。

- 因为 Firefox 扩展的规定，使用的 jQuery 版本必须大于 3.0，所以升级了 jQuery 库。

- 优化了获取 token 的方式，使其更加稳定。

- Firefox 在内存占用方面的缺点：

当下载的文件数量比较多的时候，Firefox 所需的内存占用量比 Chrome 略大。

而且下载完成后，Chrome 的内存占用很快回落到一个稳定水平，Firefox 的回落速度却明显比较慢。

以上两点可能导致 Firefox 在下载大量任务时，内存占用过多导致卡死。

## 1.3.1

Firefox 的扩展要求提供第三方库的说明

# Third-party library used

## [webextension-polyfill](https://github.com/mozilla/webextension-polyfill)

[browser-polyfill.js](https://github.com/mozilla/webextension-polyfill/blob/master/src/browser-polyfill.js)

## [gif.js](https://github.com/jnordberg/gif.js)

[gif.js](https://github.com/jnordberg/gif.js/blob/master/dist/gif.js)

[gif.worker.js](https://github.com/jnordberg/gif.js/blob/master/dist/gif.worker.js)

## [zip.js](https://github.com/gildas-lormeau/zip.js)

[inflate.js](https://github.com/gildas-lormeau/zip.js/blob/master/WebContent/inflate.js)

[zip.js](https://github.com/gildas-lormeau/zip.js/blob/master/WebContent/zip.js)

[z-worker.js](https://github.com/gildas-lormeau/zip.js/blob/master/WebContent/z-worker.js)

## [viewerjs](https://github.com/fengyuanchen/viewerjs)

Viewerjs-mix.js [Javascript part](https://github.com/fengyuanchen/viewerjs/blob/master/dist/viewer.js)

Viewerjs-mix.js [CSS part](https://github.com/fengyuanchen/viewerjs/blob/master/dist/viewer.css)

## 1.3.7

同步了脚本版的修改。

每次脚本版的大改，要再同步到扩展版里都很麻烦，因为两者的代码只是部分通用。

之前上架 Mozilla 扩展时，因为 jQuery 源代码过审没通过，遭到下架。我也想不明白是为什么。现在去掉了 jQuery，可以尝试再次上架了。

### 扩展里代码移植时产生的不同

- 互相检测使标识不同

- ex 不判断 Firefox

合并代码之后要搜索 Firefox 删除

- ex 不判断 allowFolder

- ex 中间面板没有安装扩展的提示

相关 css 代码也不同

github 的 url 不同

设置文件夹哪里没有“如何使用”

- ex 转换 gif 代码不同

initViewer() 里面不同

- ex 设置 history _wr 方式不同

- ex 获取 tt 不同

- ex 获取用户名时判断登陆的代码不同

- 下载时

不判断 GMinfo，不使用 GM_xmlhttpRequest

dataurl和 bloburl不同

要单独处理这里的改动，以及 startDownload()

- ex 多了 readBlobAsDataURL()

- ex 多了 browser 相关代码

## 1.4.5

- 修改了扩展的 logo 和应用商店的封面图。

- 增加提示：禁用其他下载扩展。

## 1.4.7

- 合并文件夹和文件名输入框

- 优化文件名生成逻辑

- 接受重复字段，去掉空值字段

- 优化一些文本描述和用户体验

## 1.4.8

原样保留空字段,放到文件名里.

## 1.4.9

添加命名规则的示例。

## 1.5.0

修复动图额外建立了文件夹的问题。

## 1.5.1

修改命名规则后，快速下载也会建立文件夹了。现在修改成不建立文件夹的状态。

## 1.5.2

文件名标记里有些值是数字（如 bmk），导致 replace 报错 `once.replace(safe_fileName_rule, '_')`。现在统一转换为字符串，避免错误。

## 1.5.3

- 在 sortByProperty 里把参数都转换成了数字。

之前传入的参数是字符串，按首位比较的，不准确。转换成数字以保证结果准确。

- 暂停和继续下载添加定时器。

如果点了暂停，然后点开始继续，中间间隔时间很短，可能会出问题。所以加上了延时。

## 1.5.4

fix the notation of some of the Japanese.

## 1.5.5

- 修改了右侧按钮样式使其更加明显

- 添加了建立文件夹的提示

- 优化日文文本

## 1.5.6

- 优化文本

- 修复 getUserName 的 bug

之前 getUserName 会使用 old_title，这是有问题的，不同语言的 title 不一样，导致严重错误，英语语言下完全无法下载。现在修复了。

## 1.5.7

修复 bug

## 1.5.8

p 站最近在 tag 搜索页的 R-18 分类里，增加了广告信息，导致抓取出错，现在修复这个问题。