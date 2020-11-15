# 添加选项

## 添加 html 文本

在 `src\ts\modules\setting\FormHTML.ts` 添加这个选项的 html 元素。需要对 checkbox、radio、input 等元素设置 name 属性。

## 添加声明

在 `src\ts\modules\setting\Form.d.ts` 添加声明。需要从哪些元素上获取值，就添加对应的声明。

在 `src\ts\modules\setting\Settings.ts` 里的 `interface XzSetting` 里设置选项的类型声明。

## 使选项能够被获取

在 `src\ts\modules\setting\Settings.ts` 里的 `settings` 里添加选项的默认值。

然后在 `src\ts\modules\setting\SaveSettings.ts` 里：

在 `ListenChange` 方法里保存这个设置的值。（直接使用封装好的方法）

在 `restore` 方法里恢复这个设置的值。（直接使用封装好的方法）

## 使用

在其它组件里，需要 `import { settings } from '/src/ts/modules/setting/Settings'`，然后使用 `settings.name` 获取选项的值。

## 额外说明

当选项在 `ListenChange` 方法里保存过之后，它的值改变时会触发 `EVT.events.settingChange` 事件，传递选项名称和它的值。这是自动进行的。