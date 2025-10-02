# 提交到 Add-on

## Summary

The powerful Pixiv bulk downloader improves download efficiency and enhances the experience of using pixiv.net.
强大的 Pixiv 批量下载器，可以提高下载效率，并且增强 pixiv.net 的使用体验。
ダウンロード効率を向上し、pixiv.net のユーザー エクスペリエンスを強化できる強力な Pixiv バッチ ダウンローダーです。

## Description

This add-on is used to help users download files from pixiv.net, especially when batch downloads are required. It can download illustrations, manga, Ugoira, novels.
You can download all the works of a certain artist, your bookmark, your following, rankings, search results, etc. with one click;
You can also set filters, rename files, convert GIFs, and enhance your browsing experience.
After installation, when you browse various pages of pixiv.net, you can see the blue button of this downloader on the right side of the page. Click it to start using it.

--------------

该附加组件用于帮助用户从 pixiv.net 下载文件，特别是需要批量下载时。它可以下载插画、漫画、动图、小说。
你可以一键下载某个画师的所有作品、你的收藏、你的关注、排行榜、搜索结果等；
你还可以设置过滤条件、重命名文件、转换动图、增强你的浏览体验。
安装之后，当你浏览 pixiv.net 的各种页面时，都可以在页面右侧看到这个下载器的蓝色按钮，点击它就可以开始使用。

--------------

このアドオンは、pixiv.netからファイルをダウンロードする際に役立ちます。特に一括ダウンロードが必要な場合に便利です。イラスト、マンガ、うごイラ、小説などをダウンロードできます。
特定のアーティストの作品、ブックマーク、フォロー、ランキング、検索結果などをワンクリックでダウンロードできます。
フィルターの設定、ファイル名の変更、GIFの変換など、ブラウジング体験を向上させる機能も搭載されています。
インストール後、pixiv.netの様々なページを閲覧すると、ページの右側にこのダウンローダーの青いボタンが表示されます。クリックして使用を開始してください。

## Privacy Policy

**Privacy Policy for Powerful Pixiv Downloader**

This program is a browser extension and is a download tool for the website pixiv.net.
This program will request some URLs on pixiv.net according to the user's operation.
This program will not modify the user's account settings, Nor will the user's information be sent to other websites.

**Use pixiv token**

pixiv.net will generate a token for the logged-in user, some network requests need to use the token.
This program will store the user's token locally, which is used when some requests need to be accompanied by a token.
The user's token will not be sent to sites other than pixiv.net.

**Use pixiv cookies**

pixiv.net will generate cookies for users to save some information about users.
This program automatically attaches cookies when sending a request.
This program does not create cookies.
This program will not modify or store user cookies.

**No ads**

This program does not serve ads.

**Does not track users**

This program does not track user activities.

## Notes to Reviewer

### 提交的英文

**Project Description:**
This add-on is an open-source project that was previously only available on Chrome, and now I have made it Firefox compatible.
It is developed using Node.js + TypeScript + webpack. My development environment is Windows 11, but it should be fine on other platforms as well.

**Project Homepage:**
https://github.com/xuejianxianzun/PixivBatchDownloader

**Development Notes:**
https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-EN.md#development

**Development Steps:**

```
git clone https://github.com/xuejianxianzun/PixivBatchDownloader.git
cd ./PixivBatchDownloader
npm i
npm run build
```

The compiled code is in the dist folder and is packaged into a zip file.

**Functional Testing:**

This extension is used to download files from pixiv.net, most of the time downloading images.

For a simple test, you can open the following example page (no login required):
https://www.pixiv.net/artworks/85539421
Then click the blue button on the right side of the page to download, and you can also adjust the downloader's settings.

If you want to use it on other pages of pixiv.net (e.g., homepage, search page, etc.), you will need to log in to your pixiv account. Since pixiv accounts require two-step verification, I don't want to provide a test account because I can't send you the verification code in time. You can sign up for a pixiv account to test it yourself.

### 原文（未提交）

**项目说明：**
这个附加组件是一个开源项目，之前只能在 Chrome 上使用，现在我使它兼容了 Firefox。
它是使用 Node.js + TypeScript + webpack 开发的。我的开发环境是 Windows 11，不过在其他平台上应该也没有问题。

**项目主页：**
https://github.com/xuejianxianzun/PixivBatchDownloader

**开发说明：**
https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-EN.md#development

**开发步骤：**

```
git clone https://github.com/xuejianxianzun/PixivBatchDownloader.git
cd ./PixivBatchDownloader
npm i
npm run build
```

编译后的代码在 dist 文件夹里，并且会打包到一个 zip 文件。

**功能测试：**

这个扩展程序用于从 pixiv.net 上下载文件，大部分时候都是下载图片。

对于简单的测试，你可以打开下面的示例页面（不需要登录账号）：
https://www.pixiv.net/artworks/85539421
然后点击页面右侧的蓝色按钮就可以进行下载，也可以调整下载器的设置。

如果要在 pixiv.net 的其他页面使用（例如主页、搜索页面等），需要登录 pixiv 账号。由于 pixiv 账号需要二步验证，因此我不想提供测试账号，因为我无法及时把验证码发给你。你可以自己注册一个 pixiv 账号进行测试。


