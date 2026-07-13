# 添加一个显示在设置面板的表单里的设置项

日期：2026-07-12

一个设置项里可能有一个或多个表单控件，例如使用 checkbox 作为开关；使用 input、checkbox、radio、textarea 等表单元素来让用户设置它的值，并显示当前状态。

## 1 添加该设置的类型和默认值

首先需要为使用到的控件起一个名字（name）。如果该设置里需要使用多个表单控件，就需要添加多个名字。

1. 编辑 `src\ts\setting\Settings.ts`：
- 在 `interface XzSetting` 里设置新添加的所有 name 的值的类型声明。可能是 `boolean`、`string`、`number`、`string[]` 等。
- 在 `defaultSettings` 变量里添加这些 name 的默认值。

2. 在 `src\ts\setting\FormType.d.ts` 里添加新增的表单控件的类型声明（通常就是 `HTMLInputElement`）。

## 2 设置值与表单元素的双向绑定

在 `src\ts\setting\FormSettings.ts` 里，根据这些新增的 name 的类型，在 `inputFileds` 里添加对应的 name。例如：如果它是一个 checkbox，就在 `inputFileds.checkbox` 属性里添加它的 name。

这样，当设置值变化时，表单上的元素也会相应变化；表单里的值变化时，也会自动保存到设置里。

## 3 添加这个设置的 html 代码

1. 在 `src\ts\setting\OptionsHtml.html` 添加这个设置项的 html 元素（`div.option`），并为其分配一个未被使用的编号 `no`。具体的 html 元素可以参考其他设置项的（`div.option`）的代码。
2. 编辑 `src\ts\setting\OptionConfigs.ts`，在 `options` 里添加该设置卡片的配置信息，使用编号 `no` 作为标志。不管这个设置里是否包含多个子选项，都只需要为该设置添加一个配置项。

## 4 添加 i18n 文本

设置的 html 代码里经常需要使用 i18n 文本（例如设置名字、选项名字、帮助信息的文本），此时需要在 `src\ts\langText.ts` 里添加 i18n 文本。

在少数情况下，有些文本可以复用 langText.ts 里已有的文本。

## 5 使用

在其它组件里 `import { settings } from '/src/ts/setting/Settings'`，然后使用 `settings.name` 获取选项的值。

如果需要修改设置的值，则需要使用 `setSetting` 方法。

## 附加说明

- 如果添加的设置是内部设置，不需要显示在设置面板上供用户查看、修改，那么只需要使用步骤 1.1 和 5 即可。
- 如果添加的设置不是一个独立的设置，而是为一个已存在设置添加子选项（这意味着 `src\ts\setting\OptionConfigs.ts` 里已经存在这个设置的 `options` 配置项），那么就不需要修改 `src\ts\setting\OptionConfigs.ts`。
