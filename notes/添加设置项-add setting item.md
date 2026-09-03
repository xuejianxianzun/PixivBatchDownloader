# 添加一个显示在设置面板的表单里的设置项

日期：2026-08-29

下载器的设置项分为两种：
1. 内部设置，不需要显示在设置面板上供用户查看、修改。这种设置的数量比较少。如果要添加的设置是内部设置，那么只需要使用步骤 1 和 7 即可。
2. 会显示在设置面板上的设置，供用户查看、修改。这种设置有对应的表单元素，并且添加的步骤也更复杂。这个文档就是为了添加这种设置而编写的。

对于第二种设置，又可以分为两种情况：
1. 新增一个完整的设置项（独立的、一级设置项），需要使用本文档里的所有步骤。
2. 添加一个二级设置项（它是某个一级设置项里的子设置），则跳过步骤 4，因为只有一级设置项需要在 `OptionConfigs` 里添加配置。

## 1 添加该设置的类型和默认值

首先你需要为新增的设置起名。

一个设置项至少具有一个名字（name）。如果这个设置项需要显示在设置面板里（即这个设置项具有 html 代码），根据它所使用的表单控件数量，可能需要起多个名字。一个设置项里可能有一个或多个表单控件，例如使用 checkbox 作为开关；使用 input、checkbox、radio、textarea 等表单元素来显示状态，并允许用户修改它的值。

决定好名字之后，编辑 `src\ts\setting\Settings.ts`：
1. 在 `interface XzSetting` 里设置新添加的所有 name 的值的类型声明。可能是 `boolean`、`string`、`number`、`string[]` 等。
2. 在 `defaultSettings` 变量里添加这些 name 的默认值。

## 2 添加表单元素的类型声明

在 `src\ts\setting\FormType.d.ts` 里添加新增的表单控件的类型声明。

单选按钮的类型是 `RadioNodeList`，textarea 元素的类型是 `HTMLTextAreaElement`，其余控件的类型都是 `HTMLInputElement`。

## 3 设置值与表单元素的双向绑定

在 `src\ts\setting\FormSettings.ts` 里，根据这些新增的 name 的类型，在 `inputFileds` 里添加对应的 name。例如：如果它是一个 checkbox，就在 `inputFileds.checkbox` 属性里添加它的 name。

这样，当设置值变化时，表单上的元素也会相应变化；表单里的值变化时，也会自动保存到设置里。

## 4 添加这个设置的配置

编辑 `src\ts\setting\OptionConfigs.ts`，在 `options` 里添加该设置卡片的配置信息，使用编号 `no` 作为标志。不管这个设置里是否包含多个子选项，都只需要为该设置添加一个配置项。

PS：如果添加的设置不是一个独立的设置，而是为一个已存在设置添加子选项（这意味着 `src\ts\setting\OptionConfigs.ts` 里已经存在这个设置的 `options` 配置项），那么就不需要修改 `src\ts\setting\OptionConfigs.ts`。

## 5 添加这个设置的 html 代码

`src\ts\setting\OptionsHtml.html` 里保存了每个设置项的 html 代码片段。需要在里面添加新的设置项的 html 元素（`div.option`），并为其分配一个未被使用的新编号 `no`。设置项的编号是递增的，所以把当前使用中的最大的编号 +1 即可作为新设置项的编号。

`OptionsHtml.html` 里的外层结构、标题、翻译、提示、帮助按钮、子选项、各种表单控件和固定 className 的详细规则，见 [如何添加一个设置项的表单元素.md](./如何添加一个设置项的表单元素.md)。添加 HTML 前必须先阅读该文档。

## 6 添加 i18n 文本

设置的 html 代码里经常需要使用 i18n 文本（例如设置名字、选项名字、帮助信息的文本），此时需要在 `src\ts\langText.ts` 里添加需要的 i18n 文本配置。

PS：有时 langText.ts 里可能已经有需要的文本了，可以直接复用。

## 7 使用

在其它组件里 `import { settings } from '/src/ts/setting/Settings'`，然后使用 `settings.name` 获取选项的值。

如果需要修改设置的值，则需要使用 `setSetting` 方法。

## 对设置项的显示顺序的说明

当下载器在设置面板上渲染一级设置项的元素时，会按照 `OptionConfigs.ts` 的 `options` 里声明的顺序进行渲染。例如你想让新设置项显示在 `no: 88,` 和 `no: 89,` 之间，那么它的配置信息也需要位于这两个配置之间。

至于 `OptionsHtml.html`，它里面的 html 代码片段的顺序并不重要，不会影响设置项在显示时的顺序。不过为了查看起来更加直观，使查看这些 html 的效果像是在查看最终的表单代码，所以它里面的 html 代码的顺序是与 `OptionConfigs.ts` 里的顺序保持一致的。

对于 AI Agent，如果你需要添加一级设置项，但用户没有告诉你添加到什么位置（例如：添加到某个设置项之前或之后），则需要明确进行询问。

如果你需要为一个已存在的一级设置项添加二级设置项（子设置），那么需要确认：
- 它属于哪个一级设置项
- 它的 html 代码应该添加到 `OptionsHtml.html` 里的哪个位置
如果不清楚，就询问用户。
