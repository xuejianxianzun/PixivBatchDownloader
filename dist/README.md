[English](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-EN.md)

[繁體中文](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-ZH-TW.md)

[日本語](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-JA.md)

[韩国语](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-KO.md)

[Russian](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-RU.md)

[Discord 频道](https://discord.gg/eW9JtTK)

![version](https://img.shields.io/github/v/release/xuejianxianzun/PixivBatchDownloader)

<!-- TOC -->

- [简介](#简介)
- [在线安装](#在线安装)
- [离线安装](#离线安装)
- [Wiki](#wiki)
- [鸣谢](#鸣谢)
- [支持和捐助](#支持和捐助)
- [开发](#开发)
- [友情链接](#友情链接)

<!-- /TOC -->

# 简介

**Powerful Pixiv Downloader**

这是一个浏览器扩展程序，用于批量下载 Pixiv 上的图片和小说。

**支持的语言：** 简体中文、繁體中文、日本語、English、한국어、Русский。

**主要功能：**

- 批量下载 Pixiv 用户的所有作品、你的收藏、你的关注、排行榜、搜索结果等；
- 你可以设置多种过滤条件，筛选出你想下载的作品；
- 使用用户名、作品标题、自定义文本等多种规则建立文件夹；
- 自定义文件名；
- 下载插画、漫画、动图、小说；
- 一键下载你看到的任何作品；
- 手动选择（多选）你想下载的作品；
- 定时抓取和下载；
- 转换动图为 WebM、GIF、APNG 格式；
- 保存小说为 TXT、EPUB 格式；
- 保存用户的头像、封面图；
- 保存下载进度，恢复未完成的下载；
- 保存下载记录，避免重复下载；
- 批量收藏作品；
- 给收藏里的未分类作品添加标签；
- 多种增强功能，优化 Pixiv 的使用体验和效率；
- 无需进入作品页面即可预览作品、查看原图；
- 内置图片查看器，查看多图作品；
- 高亮关注的用户；

![PixivBatchDownloader screenshot](./notes/images/ui-zh-0.png)

![PixivBatchDownloader screenshot](./notes/images/ui-zh-1.png)

[访问官网](https://pixiv.download/)

[在 YouTube 查看视频教程](https://www.youtube.com/playlist?list=PLO2Mj4AiZzWEpN6x_lAG8mzeNyJzd478d)

# 在线安装

Chrome、Edge 等 Chromium 内核的浏览器可以从 **[Chrome Web Store](https://chrome.google.com/webstore/detail/powerful-pixiv-downloader/dkndmhgdcmjdmkdonmbgjpijejdcilfh)** 安装本扩展。

Firefox 浏览器可以从 **[Add-Ons](https://addons.mozilla.org/firefox/addon/powerfulpixivdownloader/)** 安装本扩展。

# 离线安装

请查看 Wiki 页面：
[离线安装](https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/%E7%A6%BB%E7%BA%BF%E5%AE%89%E8%A3%85)

如果你想在 Android 上使用这个扩展，请查看 Wiki 页面：
[在 Microsoft Edge Canary 浏览器上安装](https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/MicrosoftEdgeCanary)

# Wiki

[查看 Wiki](https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/%E7%AE%80%E4%BB%8B)

# 鸣谢

- 感谢 [道滿](https://zhtw.me/) 、 [VHlqg](https://github.com/VHlqg) 翻译繁体中文。

- 感谢 [光の軌跡](https://github.com/jiaer24) 翻译日语。

- 感谢 [KOZ39](https://github.com/KOZ39) 翻译韩语。

- 感谢 [bropines](https://github.com/bropines) 翻译俄语。

- 感谢 [Reinford0](https://github.com/Reinford0) 对本工具的测试和改进。

- 感谢 [z2n](https://github.com/z2n) 对本工具项目构建做出的改进。

# 支持和捐助

如果您感觉本脚本帮到了您，您可以对我进行支持和捐助，不胜感激 (*╹▽╹*)

1. 爱发电：

[https://afdian.com/a/xuejianxianzun](https://afdian.com/a/xuejianxianzun)

2. Patreon：

[https://www.patreon.com/xuejianxianzun](https://www.patreon.com/xuejianxianzun)

3. 你可以通过微信或支付宝扫码转账：

![微信](https://xuejianxianzun.github.io/PBDWiki/zh-cn/images/weixin.png) ![支付宝](https://xuejianxianzun.github.io/PBDWiki/zh-cn/images/alipay.png)

# 开发

1. 本工具在开发时需要先安装 Node.JS。

2. Clone 本项目（或者先 Fork），并安装依赖：

```
git clone https://github.com/xuejianxianzun/PixivBatchDownloader.git

cd ./PixivBatchDownloader

npm i
```

至此初始化完成。

你可以在浏览器的扩展管理里，加载 `dist` 文件夹作为扩展程序，以进行本地调试。

-----------

本项目的 npm 命令：

```
npm run ts  // 编译 ts 文件到 dist 文件夹
npm run less // 编译 less 文件到 dist 文件夹
npm run fmt // 格式化所有文件

npm run pre-build // 执行 fmt、ts、less 命令（即编译所有代码，但是不打包）

npm run build // 执行 fmt、ts、less 命令，并把打包所需的其他文件也复制到 dist 文件夹，最后把 dist 文件夹打包成 zip 文件
```

当你修改了代码并且编译之后，代码会被编译到 `dist` 文件夹。你需要在浏览器的扩展管理里刷新离线加载的这个扩展，然后刷新 pixiv 页面，以应用新的代码。

# 友情链接

[PixivUserBatchDownload](https://github.com/Mapaler/PixivUserBatchDownload/)

Pixiv User Batch Download 简称 PUBD，它是一个 UserScript 脚本，可以让你在 Pixiv 的画师页面里批量抓取所有作品，发送到 Aria2 下载，适合动手能力强的用户使用。

- **配合 Aria2 下载，可发送到本地或远端路由器。**

- 可使用掩码自定义保存文件夹、重命名。

[PixivFanboxDownloader](https://github.com/xuejianxianzun/PixivFanboxDownloader)

用于批量下载 Pixiv Fanbox 上的文件的浏览器扩展程序。
