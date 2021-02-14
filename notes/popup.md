本扩展没有 popup，所以点击扩展图标有两种效果：

1. 在不可用的网站，无反应
2. 在可用的网站，显示下载器面板

最近商店的评论区有个人说点图标没反应，还给了差评。我想可能是没有在 pixiv 就点击了图标导致的。

虽然我很无奈，但是我尝试用 popup 来显示提示：只能在 pixiv.net 使用。

但是尝试之后，我发现**设置 popup 会导致点击扩展图标不会显示下载器面板**。

原因：

点击扩展图标打开下载面板是依赖于 `chrome.browserAction.onClicked` 事件：

```JavaScript
chrome.browserAction.onClicked.addListener(function (tab) {
  // 打开下载面板
  chrome.tabs.sendMessage(tab.id!, {
    msg: 'click_icon',
  })
})
```

但是如果设置了 popup，就不会触发 `chrome.browserAction.onClicked` 事件，所以也就无法通过点击图标打开下载器面板。（不过仍然可以通过页面上的下载按钮打开下载器面板）。

官网是这么写的：

onClicked: Fired when a browser action icon is clicked. **Does not fire if the browser action has a popup.**

-----------------

动态设置 popup 也存在这个问题。

```JavaScript
chrome.browserAction.onClicked.addListener(function (tab) {
  // 如果不可用，则用 popup 显示提示
  if (!checkEnable(tab.url)) {
    chrome.browserAction.setPopup({
      popup: 'popup.html',
    })
  }
})
```

如果默认不添加 popup，而是当用户在不可用的网站点击扩展图标时动态设置 popup，也有问题。因为一旦设置过一次 popup，那么后续就不会再触发 `onClicked` 事件，而是始终显示 popup。那么之后再 pixiv 页面点击图标也是只会显示 popup，而不会打开下载面板。

所以尝试一番之后我放弃了用 popup 显示提示的想法。

------------

题外话：为什么下载器一直以来都没有把设置选项放在 popup 里，或者单独做一个设置页面（通过点击扩展图标打开设置页面）。

这是因为目前的做法：把设置项直接显示在页面上，可以让每个页面使用不同的设置，并且不会互相影响。在浏览 pixiv 的时候，用户经常会打开多个页面，每个页面里的选项可以自由修改并且不会影响到其他页面，是很有用的。

如果把设置选项放到 popup 里或者是一个单独的设置页面里，那么要让各个页面的设置能够互不影响，恐怕实现起来会很麻烦，所以我没有这样做。

不过现在确实存在一个问题，就是设置项越来越多，看起来会密密麻麻的。