[简体中文](/README.md)

[繁體中文](/README-ZH-TW.md)

[English](/README-EN.md)

[한국어](/README-KO.md)

[Русский](/README-RU.md)

[Discord channel](https://discord.gg/eW9JtTK)

![version](https://img.shields.io/github/v/release/xuejianxianzun/PixivBatchDownloader)

<!-- TOC -->

- [はじめに](#はじめに)
- [インストール](#インストール)
  - [オンラインでのインストール](#オンラインでのインストール)
  - [オフラインでのインストール](#オフラインでのインストール)
- [Wiki](#wiki)
- [Patreon](#patreon)
- [謝辞](#謝辞)
- [開発](#開発)
- [ヘルプ](#ヘルプ)
  - [サポートされている言語](#サポートされている言語)
  - [Tips](#tips)
  - [利用可能なページとテストURL](#利用可能なページとテストurl)

<!-- /TOC -->

# はじめに

**Powerful Pixiv Downloader**

Powerful Pixiv Downloaderは画像や小説を一括ダウンロード出来る**Chrome**用拡張機能です。

簡体字中国語、繁体字中国語、日本語、英語、韓国語に対応しています。

主な機能

- アーティストごとの作品、自分のブックマーク、フォロー、ランキング、検索結果から一括でダウンロード。
- 見た作品を一括でダウンロード
- 作品を手動選択してダウントード
- 一括ダウンロード時にフィルターを使用可能。ダウンロードする作品を絞り込めます。
- イラスト、漫画、うごイラ(アニメーション)、小説をダウンロード
- うごイラをGIF、WebM、APNG、ZIPの各形式で保存可能。
- 小説をTXT、EPUBの各形式で保存可能。
- アーティスト名、日付、タイトルなど、様々なデータごとにフォルダを作成可能。

![PixivBatchDownloader screenshot](./notes/images/ui-ja-0.png)

![PixivBatchDownloader screenshot](./notes/images/ui-ja-1.png)

# インストール

## オンラインでのインストール

1. **Chromiumベース** ブラウザは、**[Chrome Web Store](https://chrome.google.com/webstore/detail/powerful-pixiv-downloader/dkndmhgdcmjdmkdonmbgjpijejdcilfh)**からこの拡張機能をインストールできます。

**注意：** Chromeウェブストアの拡張機能は最新版では無い場合があります。必要であれば以下のオフラインでのインストールを行ってください。

## オフラインでのインストール
1. 1. リリースページ](https://github.com/xuejianxianzun/PixivBatchDownloader/releases/)から最新版のインストールパッケージをダウンロードし、適当なフォルダに解凍してください。
2. 拡張機能の管理へ入ってください。Chromeはメニューの「その他のツール」-「拡張機能」、Edgeはメニューの「拡張機能」を選択します。
3. 拡張機能の管理ページで「開発者モード」を有効にしてください。
4. Chromeでは「パッケージ化されていない拡張機能を読み込む」、Edgeでは   「展開して読み込み」を選択して、インストールパッケージを解凍したフォルダを選択してください。

**注意：** オフラインでのインストールが完了したらPixivのページを再読み込みするか、ブラウザを再起動してください。

----------

- ダウンロードされたファイルはブラウザのダウンロードフォルダに保存されます。
- ブラウザの設定で「ダウンロード前に各ファイルの保存場所を確認する」をオフにしてください。

# Wiki

[Wiki](https://xuejianxianzun.github.io/PBDWiki)

# Patreon

<a href='https://www.patreon.com/xuejianxianzun'><img src='https://c5.patreon.com/external/logo/become_a_patron_button.png' alt='Become a patron' width='140px' /></a>

支援に心より感謝申し上げます。

# 謝辞

- [道滿](https://zhtw.me/)さん、[VHlqg](https://github.com/VHlqg)さん - 繁体字中国語への翻訳

- [光の軌跡](https://github.com/jiaer24)さん　- 日本語への翻訳

- [bropines](https://github.com/bropines)さん - ロシア語への翻訳

- [KOZ39](https://github.com/KOZ39)さん - 韓国語への翻訳

- [z2n](https://github.com/z2n)さん - プログラムの改良

# 開発

1. このツールの開発時にはNode.JSが必須です。最初にインストールしてください。

2. 以下の依存関係をグローバルにインストールします。

```
npm i -g less prettier typescript webpack webpack-cli
```

3. このプロジェクトをクローンし(あるいはフォークし)、依存関係をインストールします。

```
git clone https://github.com/xuejianxianzun/PixivBatchDownloader.git

cd ./PixivBatchDownloader

npm i
```
以上で初期化は完了です。

ブラウザの拡張機能管理で `dist` フォルダを拡張機能として読み込むと、ローカルデバッグができるようになります。

-----------

このプロジェクトのnpmコマンドは以下の通りです。
```
npm run ts // compile ts file to dist folder
npm run less // compile less files to the dist folder
npm run fmt // format all files

npm run pre-build // execute fmt, ts, less commands (compile all code, but do not package)

npm run build // execute fmt, ts, less commands, and copy other files needed for packaging to the dist folder, and finally pack the dist folder into a zip file
```

コードを修正してコンパイルすると、そのコードは `dist` フォルダにコンパイルされます。新しいコードを適用するには、ブラウザの拡張機能管理でオフラインで読み込まれた拡張機能を更新し、pixivのページを更新してください。

# ヘルプ

## サポートされている言語

- 簡体字中国語
- 繫体字中国語
- 英語
- 日本語
- 韓国語
- ロシア語

新たな翻訳や修正もお待ちしております。

## Tips

- ダウンロード後のファイル名に異常がある場合は、ダウンロード機能を持つ他の拡張機能を無効にしてください。

## 利用可能なページとテストURL

0 [ホームページ](https://www.pixiv.net/)

1 [作品ページ](https://www.pixiv.net/artworks/72503012)

2 [リストページ](https://www.pixiv.net/users/544479/artworks)

2 [タグページ](https://www.pixiv.net/users/544479/artworks/%E6%9D%B1%E6%96%B9)

3 [ブックマーク(従来)](https://www.pixiv.net/bookmark.php)

4 [ブックマーク](https://www.pixiv.net/users/9460149/bookmarks/artworks)

5 [検索](https://www.pixiv.net/tags/saber/artworks?s_mode=s_tag)

6 [地域ランキング](https://www.pixiv.net/ranking_area.php?type=state&no=0)

7 [ランキング](https://www.pixiv.net/ranking.php)

8 [Pixivision](https://www.pixivision.net/zh/a/3190)

9 [ブックマークの詳細](https://www.pixiv.net/bookmark_detail.php?id=63148723)

10 [フォローユーザーの作品](https://www.pixiv.net/bookmark_new_illust.php)

11 [ディスカバリー](https://www.pixiv.net/discovery)

12 [みんなの新着](https://www.pixiv.net/new_illust.php)

13 [小説](https://www.pixiv.net/novel/show.php?id=12771688)

14 [小説シリーズ](https://www.pixiv.net/novel/series/1090654)

15 [小説検索](https://www.pixiv.net/tags/%E7%99%BE%E5%90%88/novels)

16 [小説ランキング](https://www.pixiv.net/novel/ranking.php?mode=daily)

17 [フォローユーザーの作品(小説)](https://www.pixiv.net/novel/bookmark_new.php)

18 [みんなの新着(みんなの新着)](https://www.pixiv.net/novel/new.php)

19 [マンガシリーズ](https://www.pixiv.net/user/3698796/series/61267)

20 [フォローユーザー](https://www.pixiv.net/users/9460149/following)

21 [リクエスト](https://www.pixiv.net/request)

22 [制限付きURL](https://www.pixiv.net/artworks/unlisted/CbLRCId2sY3ZzQDqnQj6)
