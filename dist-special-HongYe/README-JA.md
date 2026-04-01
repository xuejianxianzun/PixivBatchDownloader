[简体中文](/README.md)

[繁體中文](/README-ZH-TW.md)

[English](/README-EN.md)

[한국어](/README-KO.md)

[Русский](/README-RU.md)

[Discord channel](https://discord.gg/eW9JtTK)

![version](https://img.shields.io/github/v/release/xuejianxianzun/PixivBatchDownloader)

<!-- TOC -->

- [はじめに](#はじめに)
- [オンラインインストール](#オンラインインストール)
- [オフラインインストール](#オフラインインストール)
- [Wiki](#wiki)
- [Patreon](#patreon)
- [謝辞](#謝辞)
- [開発](#開発)

<!-- /TOC -->

# はじめに

**Powerful Pixiv Downloader**

Powerful Pixiv Downloaderは画像や小説を一括ダウンロード出来る**Chrome**用拡張機能です。

簡体字中国語、繁体字中国語、日本語、英語、韓国語、ロシアに対応しています。

**主な機能：**

- Pixivユーザーのすべての作品、ブックマーク、フォロー、ランキング、検索結果などを一括ダウンロード；
- さまざまなフィルタ条件を設定して、ダウンロードしたい作品を選別；
- ユーザー名、作品タイトル、カスタムテキストなどのルールでフォルダを作成；
- ファイル名をカスタマイズ；
- イラスト、マンガ、うごイラ、小説をダウンロード；
- 見ている作品をワンクリックでダウンロード；
- ダウンロードしたい作品を手動で選択（複数選択）；
- 定期的なクロールとダウンロード；
- うごイラをWebM、GIF、APNG形式に変換；
- 小説をTXT、EPUB形式で保存；
- ユーザーのアバターやカバー画像を保存；
- ダウンロードの進捗を保存し、未完了のダウンロードを再開；
- ダウンロード履歴を保存して重複を回避；
- 作品を一括でブックマーク；
- ブックマーク内の未分類作品にタグを追加；
- Pixivの使用体験と効率を最適化するさまざまな強化機能；
- 作品ページに入らずに作品をプレビューしたり、原画を閲覧；
- ビルトインの画像ビューアで複数画像の作品を閲覧；
- フォローしているユーザーをハイライト；

![PixivBatchDownloader screenshot](./notes/images/ui-ja-0.png)

![PixivBatchDownloader screenshot](./notes/images/ui-ja-1.png)

# オンラインインストール

Chrome、EdgeなどのChromiumコアのブラウザは、**[Chrome Web Store](https://chrome.google.com/webstore/detail/powerful-pixiv-downloader/dkndmhgdcmjdmkdonmbgjpijejdcilfh)** からこの拡張機能をインストールできます。

Firefoxブラウザは、**[Add-Ons](https://addons.mozilla.org/firefox/addon/powerfulpixivdownloader/)** からこの拡張機能をインストールできます。

# オフラインインストール

Wikiページをご覧ください：
[オフラインインストール](https://xuejianxianzun.github.io/PBDWiki/#/en/OfflineInstallation)

Androidでこの拡張機能を使用したい場合は、Wikiページをご覧ください：
[Microsoft Edge Canaryブラウザでのインストール](https://xuejianxianzun.github.io/PBDWiki/#/en/MicrosoftEdgeCanary)

# Wiki

[Wikiを参照](https://xuejianxianzun.github.io/PBDWiki)

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

2. このプロジェクトをクローンし(あるいはフォークし)、依存関係をインストールします。

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
