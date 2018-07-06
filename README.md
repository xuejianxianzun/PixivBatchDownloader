[View English introduction](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-EN.md)

![PixivBatchDownloader](https://wx3.sinaimg.cn/large/640defebgy1fsndo9dwvcj20zm0wv0xj.jpg)

# 简介：

这是一个 Chrome 浏览器的扩展，用于批量下载 Pixiv 上的图片。功能强大，支持多种页面类型。

现在也增加了一些辅助功能，如去除广告、快速收藏、看图模式等。

本扩展是 [XZPixivDownloader](https://github.com/xuejianxianzun/XZPixivDownloader) 的移植。

# 安装：

[Chrome webstore 页面](https://chrome.google.com/webstore/detail/hfgoikdmppghehigkckknikdgdcjbfpl)

- 下载的文件会保存在浏览器的下载目录里。

- 请关闭浏览器设置中的“下载前询问每个文件的保存位置”选项，以免在下载时出现弹窗。

## 可以使用的页面类型以及测试网址：

0 [首页](https://www.pixiv.net/)

1 [作品页面](https://www.pixiv.net/member_illust.php?mode=medium&illust_id=62751951)

2 [作品列表页](https://www.pixiv.net/member_illust.php?id=544479)

3 [tag列表页](https://www.pixiv.net/member_illust.php?id=544479&tag=%E6%9D%B1%E6%96%B9)

4 [收藏页面](https://www.pixiv.net/bookmark.php)

5 [tag搜索页](https://www.pixiv.net/search.php?s_mode=s_tag&word=saber)

6 [地区排行榜](https://www.pixiv.net/ranking_area.php?type=state&no=0)

7 [排行榜](https://www.pixiv.net/ranking.php)

8 [pixivision上的插画、漫画、cosplay页面](https://www.pixivision.net/zh/a/3190)

9 [相似作品](https://www.pixiv.net/bookmark_add.php?id=63148723)

10 [大家的新作品](https://www.pixiv.net/new_illust.php)

10 [关注的新作品](https://www.pixiv.net/bookmark_new_illust.php)

11 [发现](https://www.pixiv.net/discovery)

12 [pixiv特辑上的插画](https://www.pixiv.net/showcase/a/3190/)

13 [响应关联作品](https://www.pixiv.net/response.php?mode=all&id=194231)

## 支持的语言：

简体中文（繁体设置下也使用简体中文文本）

English （机翻，韩语设置下也使用英语文本）

日本語 （机翻）

欢迎您对翻译做出改进，谢谢~

## 提示：

- Chrome 的资源限制问题

下载p站图片时，该页面会占用较多内存和cpu资源。如果切换到了其他页面，导致下载页面未激活，那么chrome就会限制下载页面的资源使用，导致下载缓慢。

解决办法：把下载的标签页单独拖出来，成为一个独立的窗口。新窗口里只有这一个页面，它始终是激活的。这样下载不受影响，我们也可以使用其他页面了。

- 手动将动图合成为视频：

因为pixiv上动图的源文件是zip压缩包，体积大，看图还麻烦。我们可以将压缩包里的图片解压出来，之后用ffmpeg将动图转换成视频。你可以参考这里：

[使用FFmpeg将pixiv的动图合成为视频](https://saber.love/?p=3859)

- 如有问题或建议，欢迎加 QQ 群 499873152 进行交流。

## 捐助：

如果您感觉本脚本帮到了您，您可以对我进行捐赠，不胜感激 (*╹▽╹*)

[查看捐赠页面](https://saber.love/donation)（可通过微信和支付宝扫码转账）