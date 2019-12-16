<!-- TOC -->

- [简介](#简介)
- [安装](#安装)
  - [在线安装](#在线安装)
  - [离线安装](#离线安装)
- [Wiki](#wiki)
- [鸣谢](#鸣谢)
- [捐助](#捐助)
- [开发](#开发)
- [帮助](#帮助)
  - [常见问题](#常见问题)
  - [支持的语言](#支持的语言)
  - [可以使用的页面类型以及测试网址](#可以使用的页面类型以及测试网址)

<!-- /TOC -->
[View English introduction](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-EN.md)

# 简介

这是一个 Chrome 浏览器扩展程序，用于批量下载 Pixiv 上的图片。功能强大，支持多种页面类型。

现在也增加了一些辅助功能，如去除广告、快速收藏、看图模式、给未分类作品添加 tag 等。

![PixivBatchDownloader](https://raw.githubusercontent.com/wiki/xuejianxianzun/PixivBatchDownloader/images/2019-08-18-11-12-52.png)

[访问官网](https://pixiv.download/)

# 安装

## 在线安装

您可以从 **[Chrome Web Store](https://chrome.google.com/webstore/detail/powerful-pixiv-downloader/dkndmhgdcmjdmkdonmbgjpijejdcilfh)** 安装本扩展。

如果你喜欢这个扩展，请给它评分，使它可以被更多人看到，谢谢！

Chrome 会自动更新本应用的版本。

## 离线安装

如果您不能打开 Chrome Web Store，您可以离线安装。但是离线安装的话，之后的版本更新需要下载新版本来手动更新。

[查看离线安装教程](https://github.com/xuejianxianzun/PixivBatchDownloader/wiki/2.-%E5%AE%89%E8%A3%85#%E7%A6%BB%E7%BA%BF%E5%AE%89%E8%A3%85)

- 下载的文件会保存在浏览器的下载目录里。

- 请关闭浏览器设置中的“下载前询问每个文件的保存位置”选项，以免在下载时出现弹窗。

# Wiki

[查看 Wiki](https://github.com/xuejianxianzun/PixivBatchDownloader/wiki)

# 鸣谢

- 感谢 [道滿](https://zhtw.me/) 翻译繁体中文。

- 感谢 光の軌跡 翻译日语。

- 感谢 [Reinford0](https://github.com/Reinford0) 对本工具的测试和改进。

- 感谢 [z2n](https://github.com/z2n) 对本工具项目构建做出的改进。

# 捐助

如果您感觉本脚本帮到了您，您可以对我进行捐赠，不胜感激 (*╹▽╹*)

（可通过微信和支付宝扫码转账）

![支付宝](https://i.loli.net/2019/04/04/5ca5627614396.png) ![微信](https://i.loli.net/2019/04/04/5ca5627630bb4.png)

# 开发

本工具的开发环境为 Node.JS。

- 全局安装以下依赖：

```
npm i -g less prettier typescript webpack webpack-cli
```

- Clone 本项目，并安装依赖：

```
git clone https://github.com/xuejianxianzun/PixivBatchDownloader.git

cd ./PixivBatchDownloader

npm i
```

- 执行部分构建流程：

```
npm run ts  // 编译 ts 文件到 dist 文件夹
npm run less // 编译 less 文件到 dist 文件夹
npm run fmt // 格式化所有文件
```

- 一键编译并打包：

```
npm run build
```

- 在浏览器的扩展管理里，加载 dist 文件夹作为扩展。

# 帮助

## 常见问题

- 如果下载后的文件名异常，请禁用其他有下载功能的浏览器扩展。

- 如果使用 ssr、v2ray 等工具，下载时开启“全局代理”以提高下载速度。

- 如有其他问题或建议，欢迎加 **QQ 群 499873152** 进行交流。

## 支持的语言

简体中文

繁體中文

English （机翻，韩语设置下也使用英语文本）

日本語

欢迎您对翻译做出改进，谢谢~

## 可以使用的页面类型以及测试网址

0 [首页](https://www.pixiv.net/)

1 [作品页面](https://www.pixiv.net/artworks/72503012)

2 [列表页](https://www.pixiv.net/member_illust.php?id=544479)

2 [Tag 页面](https://www.pixiv.net/member_illust.php?id=544479&tag=%E6%9D%B1%E6%96%B9)

2 [收藏页面](https://www.pixiv.net/bookmark.php)

5 [搜索页面](https://www.pixiv.net/search.php?s_mode=s_tag&word=saber)

6 [地区排行榜](https://www.pixiv.net/ranking_area.php?type=state&no=0)

7 [排行榜](https://www.pixiv.net/ranking.php)

8 [Pixivision](https://www.pixivision.net/zh/a/3190)

9 [收藏作品的详情](https://www.pixiv.net/bookmark_add.php?id=63148723)

10 [关注的新作品](https://www.pixiv.net/bookmark_new_illust.php)

11 [发现](https://www.pixiv.net/discovery)

12 [大家的新作品](https://www.pixiv.net/new_illust.php)

[测试动图转换](https://www.pixiv.net/member.php?id=16274829)
