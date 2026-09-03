# 把 wiki 里的按钮配置自动化

在 `src\ts\setting\Wiki.ts` 里保存着设置项和按钮的配置。其中设置项的配置是 `optionConfigs` 自动生成的，但是按钮的配置不是自动生成的，需要手动维护。当我在其他模块里添加了一个按钮之后，需要在 wiki  的 `buttonsSchema` 里的对应分类里添加它的 id。如果忘记添加，就会导致这个按钮没有对应的wiki链接。

如果能把按钮的配置也自动生成就好了，不过添加按钮的位置比较零散，而且目前和设置项有一些区别：
- 设置项是在初始化时就全部生成、可用的，但是按钮都是按需生成，然后使用 `wiki.registerBtn` 注册的。注册过的按钮才会绑定“长按时打开 wiki 链接”的动作。
- 设置项的元素会永久存在，但是很多按钮都会因为页面切换而动态添加、移除。有些会在 `destroy` 方法里通过类似 `Tools.clearSlot('crawlBtns')` 的方法从插槽容器里移除，有些会随着页面内容变化而自动消失，所以没有手动移除的步骤。

要让按钮的配置自动化，可能需要让按钮在配置文件里全部预定义，甚至可能需要预生成所有按钮元素。

## 按钮的分类

### 添加到设置面板里的按钮

绝大部分按钮都是添加到设置面板上的指定区域的。这里有两种情况：
1. 有些模块会直接调用 `Tools.addBtn` 直接添加按钮。
2. 有些模块则使用 `addInitPageBtn` 方法来添加按钮（它其实是对 `Tools.addBtn`的封装，并且会把第一个 brand 按钮视为主按钮）。

### 添加到网页上的按钮

有两个模块：
- `src/ts/crawlArtworkPage/CrawlRecommendWorks.ts` 里的 `downloadRecommendedWorks` 按钮是使用 `Tools.addBlueTextBtn` 方法生成，然后添加到网页上的。这个按钮会注册到 wiki。
- `src\ts\pageFunciton\DisplayThumbnailListOnMultiImageWorkPage.ts` 里使用 `Tools.addBlueTextBtn` 方法生成添加了多个按钮。这些按钮没有注册到 wiki，因为它们的功能简单易懂，无需在 wiki 里添加详细说明。保持这个行为。

## 可行性分析

### 现状梳理

设置项之所以能自动化，是因为它的分类信息在"定义处就近声明"：每个设置项（`OptionConfigs` 里的 `OptionMeta`）自带 `categoryLevel1` 和 `categoryLevel2` 字段，`getOptionsByCategory()` 在初始化时自动把编号聚合到对应分类，`Wiki.initOptionsSchema()` 再据此生成 `optionsSchema`。全程不需要手动维护 ids。

按钮则相反：`buttonsSchema` 在 `Wiki.ts` 里手写 3 级嵌套结构（目前约 58 个 id），与按钮的创建点完全分离，因此新增按钮时容易漏配。实测已发现一个真实漏配实例：`src/ts/crawlArtworkPage/InitAreaRankingPage.ts` 的主按钮 `crawlCurrentPageWork` 通过 `addInitPageBtn` 创建（内部会调用 `wiki.registerBtn` 注册长按事件），但它不在 `buttonsSchema` 里，长按会提示"没有找到对应的链接"。这证明痛点真实存在，自动化有实际价值。

另外，本次核对发现：`buttonsSchema` 里的 58 个 id 全部能在代码中找到（无孤儿配置），说明现有维护虽然繁琐但基本完整。

### 方案 A（推荐）：集中配置表 + 自动生成 schema

仿照设置项的做法，新建 `src/ts/setting/ButtonConfigs.ts`：

- `buttonCategorySchema`：把现有 3 个一级分类（startCrawl / downloadArea / extraFeatures）和所有二级分类迁移过去（id / nameKey，可增加 `order` 以稳定分类顺序）。
- 按钮元数据列表：集中声明每个按钮的 `{ id, categoryLevel1, categoryLevel2 }`。
- `buttonsByCategory`：照搬 `getOptionsByCategory` 的逻辑自动聚合 ids。

`Wiki.ts` 里删除手写 `buttonsSchema`，初始化时从 `ButtonConfigs` 自动生成（模仿 `initOptionsSchema`）。

防漏配机制：在 `Tools.addBtn` / `addBlueTextBtn`（registerToWiki 为 true 时）注册按钮时查一次配置表，找不到就在 console 里输出警告，把"运行时才发现没有链接"提前到开发期。

**优点**：与设置项的机制完全对齐；对现有调用点零侵入（不改 `addBtn` 签名、不改任何模块）；schema 不再手写嵌套结构；可加校验。
**成本**：新建 1 个文件 + 迁移 58 个 id + 修改 Wiki.ts + 加校验逻辑，改动集中、风险可控。
**注意**：不需要预生成按钮元素。wiki 链接是运行时长按按钮时才构造的，schema 只是纯数据；按钮仍然保持按需生成、随页面切换动态增删的现状。

### 方案 B：创建处就近声明分类（更彻底，但不推荐现在做）

给 `Tools.addBtn` 增加可选参数（或改为 options 对象）传入 wiki 分类，在按钮创建处直接声明，schema 运行时动态构建。漏配在机制上不可能发生。

**缺点**：`addBtn` 签名已经较长（slot / text / title / id / emphasis / intent 共 6 参），再加参数不优雅；需要修改所有调用点（约 30+ 处，包括刚抽取的 `addBlueTextBtn`）；分类信息分散在各模块，反而难以总览。适合作为未来方向，现阶段投入产出比低。

### 方案 C：只加校验（最低成本起步）

保持 `buttonsSchema` 手动维护不变，仅在 `registerBtn` 时校验 id 是否在 schema 里：不在则 console.warn（开发期），运行时 toast 更明确的错误提示。

**优点**：改动极小（只动 Wiki.ts 一两处），立刻能暴露 `crawlCurrentPageWork` 这类漏配。
**缺点**：没有真正消除手动维护，只是降低遗漏率。

### 结论：值得做，建议分两步

1. **先做方案 C**（约 10 分钟）：立刻暴露存量漏配，防止新增漏配。
2. **再做方案 A**（推荐，约 1-2 小时）：把 schema 迁移到 `ButtonConfigs` 并自动生成，从机制上消除手动维护。

迁移时用脚本核对 58 个 id 与代码创建点的对应关系（本次已核对正向一致）；迁移后用现有调试任务 `Output Wiki structure` 导出前后 JSON 对比，确认分类归属与 URL 不变。

**保持的行为**：`DisplayThumbnailListOnMultiImageWorkPage` 里 5 个不注册 wiki 的按钮（thumbnailListManualSelect 等）不放入配置表；`addBlueTextBtn` 的 `registerToWiki` 参数与配置表二选一驱动，避免双数据源。

## 实施记录（2026-08-30）

方案 A 已完成：

- 新建 `src/ts/setting/ButtonConfigs.ts`：`categorySchema`（3 个一级分类 + 21 个二级分类）+ `buttonList`（63 个按钮元数据，含修复漏配的 `crawlCurrentPageWork`）+ `buttonsByCategory` 自动聚合 + `checkButtonRegistered` 校验方法。每个按钮元数据包含 `id`、`nameKey`（创建该按钮时的 text 参数，即 i18n key）、`categoryLevel1`、`categoryLevel2`。
- 修改 `src/ts/setting/Wiki.ts`：删除手写 `buttonsSchema`（62 个 id 的嵌套结构），初始化时通过 `initButtonsSchema()` 从 `ButtonConfigs` 自动生成；`registerBtn` 增加防漏配校验（未配置的按钮在控制台输出警告，每个 id 只警告一次）。
- 迁移验证：脚本对比新旧结构，21 个分类完全一致，唯一差异是 `Ranking` 分类新增 `crawlCurrentPageWork`（修复漏配）。`npm run ts` 编译通过，`npm run fmt` 已格式化。
- 附带修复：`InitAreaRankingPage`（地区排行榜）主按钮 `crawlCurrentPageWork` 原来不在 `buttonsSchema` 里，长按会提示"没有找到对应的链接"，现已配置到 `startCrawl/Ranking` 分类。

以后新增按钮时，只需在 `ButtonConfigs.ts` 的 `buttonList` 里添加一条 `{ id, nameKey, categoryLevel1, categoryLevel2 }` 记录即可；如果忘记添加，长按按钮时控制台会输出警告。`nameKey` 类型为 `LangTextKey`，编译时会校验 key 是否真实存在于 `langText`。

## 结论

选择方案 A，新增了 `src/ts/setting/ButtonConfigs.ts`，已实现。
