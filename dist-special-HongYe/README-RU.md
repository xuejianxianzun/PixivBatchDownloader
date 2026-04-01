[简体中文](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README.md)

[繁體中文](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-ZH-TW.md)

[日本語](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-JA.md)

[韩国语](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-KO.md)

[English](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-EN.md)

[Discord channel](https://discord.gg/eW9JtTK)

![version](https://img.shields.io/github/v/release/xuejianxianzun/PixivBatchDownloader)

<!-- TOC -->

- [Вступление](#вступление)
- [Онлайн-установка](#онлайн-установка)
- [Оффлайн-установка](#оффлайн-установка)
- [Wiki](#wiki)
- [Благодарности](#благодарности)
- [Разработка](#разработка)

<!-- /TOC -->

# Вступление

**Мощный загрузчик Pixiv**

Это расширение для браузера ** Chrome**, которое позволяет загружать изображения и новеллы из Pixiv в пакетном режиме.

**Поддерживаемые языки:** упрощенный китайский, традиционный китайский, японский, английский, корейский, русский.

**Основная функция:**

- Массовая загрузка всех работ пользователя Pixiv, ваших закладок, подписок, рейтингов, результатов поиска и т.д.;
- Настройка различных условий фильтрации для выбора желаемых работ;
- Создание папок с использованием имени пользователя, заголовка работы, пользовательского текста и других правил;
- Настройка имен файлов;
- Загрузка иллюстраций, манги, угойры, романов;
- Загрузка любой увиденной работы одним кликом;
- Ручной выбор (множественный выбор) работ для загрузки;
- Периодический краулинг и загрузка;
- Преобразование угойры в форматы WebM, GIF, APNG;
- Сохранение романов в форматах TXT, EPUB;
- Сохранение аватаров пользователей и обложек;
- Сохранение прогресса загрузки и возобновление незавершенных загрузок;
- Сохранение истории загрузок для избежания дублирования;
- Массовая добавка работ в закладки;
- Добавление тегов к неклассифицированным работам в закладках;
- Различные улучшения для оптимизации опыта и эффективности использования Pixiv;
- Предпросмотр работ и просмотр оригинальных изображений без перехода на страницу работы;
- Встроенный просмотрщик изображений для просмотра работ с несколькими изображениями;
- Подсветка пользователей, на которых вы подписаны;

![PixivBatchDownloader скриншот](./notes/images/ui-ru-0.png)

![PixivBatchDownloader скриншот](./notes/images/ui-ru-1.png)

# Онлайн-установка

Браузеры с ядром Chromium, такие как Chrome и Edge, могут установить это расширение из **[Chrome Web Store](https://chrome.google.com/webstore/detail/powerful-pixiv-downloader/dkndmhgdcmjdmkdonmbgjpijejdcilfh)**.

Браузеры Firefox могут установить это расширение из **[Add-Ons](https://addons.mozilla.org/firefox/addon/powerfulpixivdownloader/)**.

# Оффлайн-установка

Пожалуйста, ознакомьтесь со страницей Wiki:
[Оффлайн-установка](https://xuejianxianzun.github.io/PBDWiki/#/en/OfflineInstallation)

Если вы хотите использовать это расширение на Android, ознакомьтесь со страницей Wiki:
[Установка в браузере Microsoft Edge Canary](https://xuejianxianzun.github.io/PBDWiki/#/en/MicrosoftEdgeCanary)

# Wiki

[Просмотреть Wiki](https://xuejianxianzun.github.io/PBDWiki)

# Благодарности

- Спасибо [道滿](https://zhtw.me/) , [VHlqg](https://github.com/VHlqg) за перевод традиционного китайского языка.

- Спасибо [KOZ39](https://github.com/KOZ39) за перевод традиционного корейского языка.

- Спасибо [bropines](https://github.com/bropines) за русский перевод.

- Спасибо [光の軌跡](https://github.com/jiaer24) за перевод традиционного японского языка.

- Спасибо [z2n](https://github.com/z2n) за улучшение программы.

- Ну типа я перевел, спасибо Pinus.

# Разработка

1. При разработке этого инструмента необходимо сначала установить Node.JS.

2. Клонируйте этот проект (или сначала сделайте форк) и установите зависимости:

```
git clone https://github.com/xuejianxianzun/PixivBatchDownloader.git

cd ./PixivBatchDownloader

npm i
```

На данный момент инициализация завершена.

Вы можете загрузить папку `dist` в качестве расширения в управлении расширениями вашего браузера для локальной отладки.

-----------

Команды npm для этого проекта:

```
npm run ts // скомпилируйте файл ts в папку dist
npm run less // скомпилируйте файлы less в папку dist
npm run fmt // форматы всех файлов

npm run pre-build // выполните команды fmt, ts, less (компилируется весь код, но не упаковывается)

npm run build // выполните команды fmt, ts, less и скомпилируйте другие файлы, необходимые для упаковки, в папку dist, и, наконец, упакуйте папку dist в zip-файл
```

Когда вы изменяете код и компилируете его, код будет скомпилирован в папку `dist`. Вам нужно обновить автономно загруженное расширение в управлении расширениями браузера, а затем обновить страницу pixiv, чтобы применить новый код.

