[중국어 간체](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README.md)

[중국어 번체](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-ZH-TW.md)

[日本語](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-JA.md)

[English](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-EN.md)

[Russian](https://github.com/xuejianxianzun/PixivBatchDownloader/blob/master/README-RU.md)

[Discord](https://discord.gg/eW9JtTK)

![version](https://img.shields.io/github/v/release/xuejianxianzun/PixivBatchDownloader)

<!-- TOC -->

- [소개](#소개)
- [온라인 설치](#온라인-설치)
- [오프라인 설치](#오프라인-설치)
- [Wiki](#wiki)
- [Patreon](#patreon)
- [도움을 주신 분들](#도움을-주신-분들)
- [개발](#개발)

<!-- /TOC -->

# 소개

**Powerful Pixiv Downloader**

이것은 **Chrome** 브라우저의 확장 프로그램으로 Pixiv에서 일러스트 및 소설을 일괄 다운로드할 수 있습니다.

**지원 언어:** 간체 중국어, 번체 중국어, 일본어, 영어, 한국어, 러시아어.

**주요 기능은 다음과 같습니다:**

- Pixiv 사용자의 모든 작품, 북마크, 팔로우, 랭킹, 검색 결과 등을 일괄 다운로드;
- 다양한 필터링 조건을 설정하여 다운로드하려는 작품을 선별;
- 사용자 이름, 작품 제목, 사용자 지정 텍스트 등의 규칙으로 폴더 생성;
- 파일 이름 사용자 지정;
- 일러스트, 만화, 우고이라, 소설 다운로드;
- 보는 작품을 원클릭으로 다운로드;
- 다운로드하려는 작품을 수동으로 선택(다중 선택);
- 정기적인 크롤링 및 다운로드;
- 우고이라를 WebM, GIF, APNG 형식으로 변환;
- 소설을 TXT, EPUB 형식으로 저장;
- 사용자의 아바타와 커버 이미지를 저장;
- 다운로드 진행 상황을 저장하고 미완료 다운로드를 재개;
- 다운로드 기록을 저장하여 중복 다운로드 방지;
- 작품을 일괄적으로 북마크;
- 북마크 내 분류되지 않은 작품에 태그 추가;
- Pixiv 사용 경험과 효율성을 최적화하는 다양한 강화 기능;
- 작품 페이지에 들어가지 않고 작품을 미리 보거나 원본 이미지를 확인;
- 내장된 이미지 뷰어로 다중 이미지 작품을 확인;
- 팔로우한 사용자를 강조 표시;

![PixivBatchDownloader screenshot](./notes/images/ui-ko-0.png)

![PixivBatchDownloader screenshot](./notes/images/ui-ko-1.png)

# 온라인 설치

Chrome, Edge 등 Chromium 코어 브라우저는 **[Chrome Web Store](https://chrome.google.com/webstore/detail/powerful-pixiv-downloader/dkndmhgdcmjdmkdonmbgjpijejdcilfh)** 에서 이 확장 프로그램을 설치할 수 있습니다.

Firefox 브라우저는 **[Add-Ons](https://addons.mozilla.org/firefox/addon/powerfulpixivdownloader/)** 에서 이 확장 프로그램을 설치할 수 있습니다.

# 오프라인 설치

Wiki 페이지를 확인하세요:
[오프라인 설치](https://xuejianxianzun.github.io/PBDWiki/#/en/OfflineInstallation)

Android에서 이 확장 프로그램을 사용하려면 Wiki 페이지를 확인하세요:
[Microsoft Edge Canary 브라우저에 설치](https://xuejianxianzun.github.io/PBDWiki/#/en/MicrosoftEdgeCanary)

# Wiki

[Wiki 보기](https://xuejianxianzun.github.io/PBDWiki)

# Patreon

<a href='https://www.patreon.com/xuejianxianzun'><img src='https://c5.patreon.com/external/logo/become_a_patron_button.png' alt='Become a patron' width='140px' /></a>

지원해 주셔서 감사합니다!

# 도움을 주신 분들

- [道滿](https://zhtw.me/) , [VHlqg](https://github.com/VHlqg) 중국어 번체로 번역해 주셔서 감사합니다.

- [KOZ39](https://github.com/KOZ39) 한국어로 번역해 주셔서 감사합니다.

- 러시아 번역에 대해 [bropines](https://github.com/bropines)에게 감사드립니다.

- [光の軌跡](https://github.com/jiaer24) 일본어로 번역해 주셔서 감사합니다.

- [z2n](https://github.com/z2n) 프로그램을 개선해 주셔서 감사합니다.

# 개발

1. 이 도구는 개발 중에 Node.js를 먼저 설치해야 합니다.

2. 이 프로젝트를 복제하고(또는 먼저 포크) 종속성을 설치합니다:

```
git clone https://github.com/xuejianxianzun/PixivBatchDownloader.git

cd ./PixivBatchDownloader

npm i
```

지금까지 초기화가 완료되었습니다.

로컬 디버깅을 위해 브라우저의 확장 프로그램에서 'dist' 디렉토리를 로드할 수 있습니다.

-----------

이 프로젝트의 npm 명령어는 다음과 같습니다:

```
npm run ts // ts 파일을 dist 디렉토리에 컴파일합니다.
npm run less // less 파일을 dist 디렉토리에 컴파일합니다.
npm run fmt // 모든 파일 서식 지정

npm run pre-build // fmt, ts, less 명령을 실행합니다(모든 코드를 포함하지만 패키지화하지는 않음).

npm run build // fmt, ts, less 명령을 실행하고 패키징에 필요한 다른 파일을 dist 디렉토리에 복사한 다음 dist 디렉토리를 zip 파일로 압축합니다.
```

코드를 수정하여 컴파일하면 코드는 dist 디렉토리에 컴파일됩니다. 브라우저의 확장 프로그램에서 오프라인으로 로드된 확장 프로그램을 업데이트한 다음 pixiv 페이지를 새로고침하여 새 코드를 적용해야 합니다.
