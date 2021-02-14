# 添加选项

## 添加 html 文本

如果它是一个表单项：

在 `src\ts\modules\setting\FormHTML.ts` 添加这个选项的 html 元素。需要对 checkbox、radio、input 等元素设置 name 属性。

在 `src\ts\modules\setting\Form.d.ts` 添加声明。需要从哪些元素上获取值，就添加对应的声明。

如果它不是一个表单项，请跳过上面两步。

## 使选项能够被获取

在 `src\ts\modules\setting\Settings.ts` 里的 `interface XzSetting` 里设置选项的类型声明。

在 `src\ts\modules\setting\Settings.ts` 里的 `settings` 里添加选项的默认值。

### 如果它是一个表单项

然后在 `src\ts\modules\setting\FormSettings.ts` 里：

在 `ListenChange` 方法里保存这个设置的值。（直接使用封装好的方法）

在 `restoreFormSettings` 方法里恢复这个设置的值。（直接使用封装好的方法）

### 如果它不是一个表单项

你需要在其他模块里自己控制它的读取、修改。

## 使用

在其它组件里 `import { settings } from '/src/ts/modules/setting/Settings'`，然后使用 `settings.name` 获取选项的值。

可以参考这个模块里的说明。