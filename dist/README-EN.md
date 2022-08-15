[简体中文](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README.md)

[繁體中文](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-ZH-TW.md)

[韩国语](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-KO.md)

[Discord channel](https://discord.gg/eW9JtTK)

![version](https://img.shields.io/github/v/release/xuejianxianzun/PixivBatchDownloader)

<!-- TOC -->

- [Introduction](#introduction)
- [Install](#install)
  - [Online installation](#online-installation)
  - [Offline installation](#offline-installation)
- [Wiki](#wiki)
- [Patreon](#patreon)
- [Thanks](#thanks)
- [Development](#development)
- [Help](#help)
  - [Supported languages](#supported-languages)
  - [Tips](#tips)
  - [Available pages and test URL](#available-pages-and-test-url)

<!-- /TOC -->

# Introduction

**Powerful Pixiv Downloader**

This is a browser extension for **Chrome** that lets you download images and novels from Pixiv in batch. 

Available languages: Simplified Chinese, Traditional Chinese, Japanese, English、Korean.

The main function:

- Batch download all the artist's works, your bookmarks, your following, rankings, search results, etc.;
- One-click download of any work you see;
- Manually select the work you want to download on the page;
- Set filter conditions to filter the works you want to download;
- Download illustrations, manga, ugoira(animations), novels;
- Save ugoira in GIF, WebM, APNG, ZIP formats;
- Save novels in TXT, EPUB format;
- Create folders with various data such as artist name, date, title, etc.;
- Customize file names and sort them;
- Add 0 in front of the serial number, so that the sorting will not be confused;
- Save user avatar and cover image;
- display larger thumbnails for easier viewing;
- Preview the image on the thumbnail, and view the original image;
- Save download records to avoid repeated downloads;
- Save download progress, resume unfinished downloads;
- export work data;
- Collect works in batches;
- add tags to uncategorized works in your bookmarks;
- Timed crawl;

![PixivBatchDownloader screenshot](./notes/images/ui-en-0.png)

![PixivBatchDownloader screenshot](./notes/images/ui-en-1.png)

# Install

## Online installation

1. **Chromium kernel** browser can install this extension from the **[Chrome Web Store](https://chrome.google.com/webstore/detail/powerful-pixiv-downloader/dkndmhgdcmjdmkdonmbgjpijejdcilfh)**.

2. **Microsoft Edge** browser can install this extension from the **[Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/hpcoocgpiepjcngmhhknkflhpkoklphp)**.

**Note:** Sometimes the extension on the Chrome Web Store may not be the latest version. If necessary, you can install it offline.

## Offline installation

1. Download the latest version of the installation package from [Releases page](https://github.com/xuejianxianzun/PixivBatchDownloader/releases/) and unzip it to a folder.
2. Enter the extension management. Chrome clicks "More Tools" - "Extensions Management" in the menu; Edge clicks "Extensions" in the menu.
3. On the extension management page, enable "Developer Mode".
4. Click the button "Load unpacked" and select the folder where the installation package is unzipped.

**Note:** After offline installation, please refresh the pixiv page or restart the browser for normal use.

----------

- The downloaded file will be saved in your browser's download directory.

- Please turn off "Ask where to save each file before downloading" in browser settings.

# Wiki

[Wiki](https://xuejianxianzun.github.io/PBDWiki)

Note: Currently only available in Chinese. Welcome to translate!

# Patreon

<a href='https://www.patreon.com/xuejianxianzun'><img src='https://c5.patreon.com/external/logo/become_a_patron_button.png' alt='Become a patron' width='140px' /></a>

Thank you for your support!

# Thanks

- Thanks [道滿](https://zhtw.me/) , [VHlqg](https://github.com/VHlqg) for translating traditional Chinese.

- Thanks [KOZ39](https://github.com/KOZ39) for translating traditional Korean.

- Thanks [光の軌跡](https://github.com/jiaer24) for translating traditional Japanese.

- Thanks [z2n](https://github.com/z2n) for improvements to the program.

# Development

1. This tool needs to be installed Node.JS first during development.

2. Install the following dependencies globally:

```
npm i -g less prettier typescript webpack webpack-cli
```

3. Clone this project (or fork first) and install dependencies:

```
git clone https://github.com/xuejianxianzun/PixivBatchDownloader.git

cd ./PixivBatchDownloader

npm i
```

So far, the initialization is complete.

You can load the `dist` folder as an extension in the extension management of your browser for local debugging.

-----------

The npm command of this project:

```
npm run ts // compile ts file to dist folder
npm run less // compile less files to the dist folder
npm run fmt // format all files

npm run pre-build // execute fmt, ts, less commands (compile all code, but do not package)

npm run build // execute fmt, ts, less commands, and copy other files needed for packaging to the dist folder, and finally pack the dist folder into a zip file
```

When you modify the code and compile it, the code will be compiled to the `dist` folder. You need to refresh the offline loaded extension in the browser's extension management, and then refresh the pixiv page to apply the new code.

# Help

## Supported languages

Simplified Chinese

Traditional Chinese

English

Japanese

Korean

You can also optimize the translation, thank you very much :)

## Tips

- If the file name after downloading is abnormal, disable other browser extensions that have download capabilities.

## Available pages and test URL

0 [Home page](https://www.pixiv.net/)

1 [Artwork page](https://www.pixiv.net/artworks/72503012)

2 [List page](https://www.pixiv.net/users/544479/artworks)

2 [Tag page](https://www.pixiv.net/users/544479/artworks/%E6%9D%B1%E6%96%B9)

3 [Bookmarks-legacy](https://www.pixiv.net/bookmark.php)

4 [Bookmarks](https://www.pixiv.net/users/9460149/bookmarks/artworks)

5 [Search](https://www.pixiv.net/tags/saber/artworks?s_mode=s_tag)

6 [Area ranking](https://www.pixiv.net/ranking_area.php?type=state&no=0)

7 [Ranking](https://www.pixiv.net/ranking.php)

8 [Pixivision](https://www.pixivision.net/zh/a/3190)

9 [Bookmark detail](https://www.pixiv.net/bookmark_detail.php?id=63148723)

10 [New Work: Following](https://www.pixiv.net/bookmark_new_illust.php)

11 [Discovery](https://www.pixiv.net/discovery)

12 [New from All users](https://www.pixiv.net/new_illust.php)

13 [Novel](https://www.pixiv.net/novel/show.php?id=12771688)

14 [Series of novels](https://www.pixiv.net/novel/series/1090654)

15 [Search novel](https://www.pixiv.net/tags/%E7%99%BE%E5%90%88/novels)

16 [Novel ranking](https://www.pixiv.net/novel/ranking.php?mode=daily)

17 [New Novel: Following](https://www.pixiv.net/novel/bookmark_new.php)

18 [New Novel from All users](https://www.pixiv.net/novel/new.php)

19 [Manga series page](https://www.pixiv.net/user/3698796/series/61267)

20 [Following](https://www.pixiv.net/users/9460149/following)
