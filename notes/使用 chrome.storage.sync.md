# 使用 chrome.storage.sync

为了持久化保存配置，本扩展程序使用 `chrome.storage.sync` 储存配置数据，以及一些标记。

文档： https://developer.chrome.com/docs/extensions/reference/storage/#property-sync

## 体积限制

`chrome.storage.sync` 一共可以储存：
- 最多 512 条数据（项目）
- 每条数据的体积上限是 8 KiB
- 所有数据的体积上限是 100 KiB

`chrome.storage.sync` 能储存的数据的体积很小，所以只适合储存配置和标记，其他数据还是要储存在其他地方。

## 写入次数限制

MAX_WRITE_OPERATIONS_PER_MINUTE

每分钟最多执行 120 次写入操作。超出次数就会报错：

```
Unchecked runtime.lastError: This request exceeds the MAX_WRITE_OPERATIONS_PER_MINUTE quota.
```

此外，每小时最多执行 1800 次写入操作。