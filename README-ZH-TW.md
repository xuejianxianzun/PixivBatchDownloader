[English](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-EN.md)

[简体中文](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README.md)

[日本語](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-JA.md)

[韩国语](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-KO.md)

[Russian](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-RU.md)

[Discord 頻道](https://discord.gg/eW9JtTK)

![version](https://img.shields.io/github/v/release/xuejianxianzun/PixivBatchDownloader)

<!-- TOC -->

- [簡介](#簡介)
- [線上安裝](#線上安裝)
- [離線安裝](#離線安裝)
- [Wiki](#wiki)
- [鳴謝](#鳴謝)
- [支持和捐助](#支持和捐助)
- [開發](#開發)

<!-- /TOC -->

# 簡介

**Powerful Pixiv Downloader**

這是一個瀏覽器擴充功能，用於批次下載 Pixiv 上的圖片和小說。

**可選擇介面語言：** 简体中文、繁體中文、日本語、English、한국어、Русский。

**主要功能：**

- 批量下載 Pixiv 使用者的所有作品、你的收藏、你的關注、排行榜、搜尋結果等；
- 你可以設定多種過濾條件，篩選出你想下載的作品；
- 使用使用者名稱、作品標題、自訂文字等多種規則建立資料夾；
- 自訂檔案名稱；
- 下載插畫、漫畫、動圖、小說；
- 一鍵下載你看到的任何作品；
- 手動選擇（多選）你想下載的作品；
- 定時抓取和下載；
- 將動圖轉換為 WebM、GIF、APNG 格式；
- 將小說儲存為 TXT、EPUB 格式；
- 儲存使用者的頭像、封面圖；
- 儲存下載進度，恢復未完成的下載；
- 儲存下載記錄，避免重複下載；
- 批量收藏作品；
- 為收藏中的未分類作品新增標籤；
- 多種增強功能，優化 Pixiv 的使用體驗和效率；
- 無需進入作品頁面即可預覽作品、查看原圖；
- 內建圖片檢視器，查看多圖作品；
- 高亮關注的使用者；

![PixivBatchDownloader screenshot](./notes/images/ui-tw-0.png)

![PixivBatchDownloader screenshot](./notes/images/ui-tw-1.png)

[瀏覽官網](https://pixiv.download/)

# 線上安裝

Chrome、Edge 等 Chromium 內核的瀏覽器可從 **[Chrome Web Store](https://chrome.google.com/webstore/detail/powerful-pixiv-downloader/dkndmhgdcmjdmkdonmbgjpijejdcilfh)** 安裝本擴展。

Firefox 瀏覽器可從 **[Add-Ons](https://addons.mozilla.org/firefox/addon/powerfulpixivdownloader/)** 安裝本擴展。

# 離線安裝

請查看 Wiki 頁面：
[離線安裝](https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/%E7%A6%BB%E7%BA%BF%E5%AE%89%E8%A3%85)

如果你想在 Android 上使用這個擴展，請查看 Wiki 頁面：
[在 Microsoft Edge Canary 瀏覽器上安裝](https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/MicrosoftEdgeCanary)

# Wiki

[查看 Wiki](https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/%E7%AE%80%E4%BB%8B)

# 鳴謝

- 感謝 [道滿](https://zhtw.me/) 、 [VHlqg](https://github.com/VHlqg) 翻譯繁體中文。

- 感謝 [光の軌跡](https://github.com/jiaer24) 翻譯日語。

- 感謝 [KOZ39](https://github.com/KOZ39) 翻译韩語。

- 感谢 [bropines](https://github.com/bropines) 翻译俄语。

- 感謝 [Reinford0](https://github.com/Reinford0) 對本工具的測試和改進。

- 感謝 [z2n](https://github.com/z2n) 對本工具專案構建做出的改進。

# 支持和捐助

如果您感覺本腳本幫到了您，您可以對我進行支持和捐助，不勝感激 (*╹▽╹*)

我的 Patreon：

[https://www.patreon.com/xuejianxianzun](https://www.patreon.com/xuejianxianzun)

# 開發

1. 本工具在開發時需要先安裝 Node.JS。

2. Clone 本項目（或者先 Fork），並安裝依賴：

```
git clone https://github.com/xuejianxianzun/PixivBatchDownloader.git

cd ./PixivBatchDownloader

npm i
```

至此初始化完成。

你可以在瀏覽器的擴充管理中，載入 `dist` 資料夾作為擴充功能，以進行本地除錯。

-----------

本項目的 npm 命令：

```
npm run ts  // 編譯 ts 檔案到 dist 資料夾
npm run less // 編譯 less 檔案到 dist 資料夾
npm run fmt // 格式化所有檔案

npm run pre-build // 執行 fmt、ts、less 命令（即編譯所有程式碼，但是不打包）

npm run build // 執行 fmt、ts、less 命令，並把打包所需的其他檔案也複製到 dist 資料夾，最後把 dist 資料夾打包成 zip 檔案
```

當你修改了程式碼並且編譯之後，程式碼會被編譯到 `dist` 資料夾。你需要在瀏覽器的擴充管理裡重新整理離線載入的這個擴充功能，然後重新整理 pixiv 頁面，以應用新的程式碼。
