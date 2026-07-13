# AGENTS.md

本文件为本仓库内工作的 AI agent、代码助手、自动化工具提供统一说明。

## 项目概览

- 项目名称：Powerful Pixiv Downloader
- 类型：浏览器扩展
- 主要功能：批量下载 Pixiv 的插画、漫画、动图、小说，并提供筛选、命名、预览、断点续传、导出等功能
- 主要技术栈：TypeScript、Webpack、Less、WebExtension API
- GitHub 主页：https://github.com/xuejianxianzun/PixivBatchDownloader

## 目录与入口

- `src/ts/content.ts`：前台内容脚本入口。很多模块通过“仅导入即注册”的方式挂载功能。
- `src/ts/serviceWorker/background.ts`：后台 service worker 入口。
- `src/ts/injectScript.ts`：注入脚本入口。
- `src/ts/setting/SettingsPanelBootstrap.ts`：设置面板（下载器的 UI 界面）的入口。用户可以在设置面板上查看和修改设置、启动抓取和下载流程。
- `src/ts/PageType.ts`：区分不同类型的页面。很多功能都会根据页面类型进行分别处理。
- `src/ts/crawl*/`：初始化每种页面里的抓取逻辑。其中，`crawlArtworkPage` 文件夹里的模块用于抓取只有图像作品的页面；`crawlNovelPage` 文件夹里的模块用于抓取只有小说作品的页面；`crawlMixedPage` 抓取同时具有图像作品和小说作品的页面。
- `src/ts/store/`：保存运行时数据、储存抓取结果、类型定义。
- `src/ts/download/`：下载相关逻辑。
- `src/ts/setting/Settings.ts`：保存下载器的设置、当设置发生变化时派发事件进行通知。
- `src/ts/API.ts`：封装了对 Pixiv.net 的一些 API 的请求。
- `src/ts/EVT.ts`：事件系统。有许多模块会触发事件；监听事件有助于解耦。
- `src/ts/Tools.ts`：与本项目耦合的工具类。
- `src/ts/utils/`：该文件夹里的模块是通用的工具类，与本项目没有耦合关系。其中 `src/ts/utils/Utils.ts` 是最常用的。
- `src/ts/Language.ts`：自制的 i18n 系统。
- `src/style/`：Less 样式源码。
- `dist/`：编译产物目录。
- `notes/`：设计说明、调研记录、截图等。修改复杂功能前，先检查这里是否已有说明。

## 代码风格

- 使用 Prettier 默认格式化结果；当前仓库使用：
  - 变量名使用驼峰命名法
  - TypeScript 文件的文件名与它内部的 class 名称相同，并且都是首字母大写的。class 的实例名称则是首字母小写的。
  - 单引号
  - 不写分号
  - 2 空格缩进
  - 保留 ES5 trailing comma
- 注释的风格：
  - 代码注释与日志优先使用中文。
  - 修改代码时，对于模块里的全局变量和全局方法（即模块里或 class 里的顶级成员），必须添加注释，并且使用 JSDoc 格式，如 `/** 注释内容 */`。对于局部代码块、变量，添加适当的注释即可（通常用来说明工作流程），并且使用普通的双斜线注释。
- 优先复用现有工具类、状态模块、事件系统，不要平行造新轮子。
- 不要为了绕过类型检查而使用不必要的 `any` 或双重断言。

## 现有模式与约定

- 事件系统统一使用 `EVT`；很多模块通过监听事件驱动状态变化。
- 很多功能模块是“副作用模块”：创建文件后如果希望自动启用，通常还需要在入口文件中 `import`。
- 下载、抓取、预览、设置等逻辑已经高度模块化；改动前先搜索是否已有近似实现。
- 小说、设定资料、命名规则等复杂功能，`notes/` 目录里可能有专门文档，优先遵循文档设计。
- `dist/` 是编译产物，通常不手改源码生成内容；应修改 `src/` 下源文件并重新编译。

## 修改原则

- 只做与当前任务直接相关的改动，避免顺手清理无关问题。
- 保持现有行为和用户体验，除非需求明确要求改变。
- 新增逻辑时优先延续现有命名、日志、错误处理、事件绑定方式。
- 如果某个功能需要跨多个模块接线，务必把所有相关入口都接完整。

## 构建与验证

- 安装依赖：`npm i`
- 仅编译 TypeScript / Webpack：`npm run ts`
- 仅编译 Less：`npm run less`
- 格式化：`npm run fmt`
- 完整构建：`npm run build`

建议按最小范围验证：

- 只改 `src/ts/`：优先运行 `npm run ts`
- 只改 `src/style/`：优先运行 `npm run less`
- 需要统一格式时：运行 `npm run fmt`

## 提交前检查

- 确认改动位于正确入口和正确模块。
- 确认新增模块已在需要的入口文件中导入。
- 确认 TypeScript 编译通过。
- 不要提交无关的临时文件或调试残留。

## 给后续 agent 的建议

- 先搜索再改：本仓库功能多、历史久，重复实现的风险高。
- 遇到修改抓取流程、下载流程、合并小说、命名规则等需求时，优先检查相邻模块。
- review 时忽略编译产物，即 `dist/` 目录里的文件。 
- 翻译 i18n 语句时（即修改 `src\ts\langText.ts` 里的文本时），需要遵守翻译规则：`notes\翻译多语言文本的 prompt.md`
