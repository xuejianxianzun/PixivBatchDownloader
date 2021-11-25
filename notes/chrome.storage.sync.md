# chrome.storage.sync

文档： https://developer.chrome.com/docs/extensions/reference/storage/#property-sync

`chrome.storage.sync` 和 `localStorage` 有一些区别：

- `chrome.storage.sync` 是异步的（`localStorage` 是同步的）
- `chrome.storage.sync` 可以储存对象（`localStorage` 只能储存为字符串格式）
- 存取数据的语法和结果都有区别

例如对于数据：

```js
const data = {
  name: 'saber'
}
```

## set

`localStorage` 的写法是两个参数:

```js
localStorage.setItem('data', data)
```

`chrome.storage.sync` 的写法是一个对象：

```js
chrome.storage.sync.set({
  data: {
    name: 'saber'
  }
  // 或者简写为 data
})
```

## get

`localStorage` 的结果不包含 key `data`:

```js
localStorage.getItem('data')

// return
{
  name: 'saber'
}
// 可以直接使用 result
```

`chrome.storage.sync` 包含 key `data`:
```js
chrome.storage.sync.get('data')

// return
{
  data: {
    name: 'saber'
  }
}
// 需要通过 result['data'] 使用
```

我觉得 `chrome.storage.sync` 的 get、set 在设计上是好的，但是如果每次只操作一条数据，数据的格式多嵌套了一层挺麻烦的。

## 使用 promise

`chrome.storage.sync` 的 get、set 需要在清单版本为 V3 的前提下才能使用 promise 作为返回值。

现在本扩展程序因为浏览器兼容性的原因没有升级到 V3，所以只能使用回调函数。

## 体积限制

`chrome.storage.sync` 一共可以储存：
- 最多 512 条数据（项目）
- 每条数据的体积上限是 8 KiB
- 所有数据的体积上限是 100 KiB

`chrome.storage.sync` 能储存的数据的体积很小，所以只适合储存配置和标记，其他数据还是要储存在其他地方。

## 写入次数限制

MAX_WRITE_OPERATIONS_PER_MINUTE

每分钟最多执行 120 次写入操作。超出限制就会报错：

```
Unchecked runtime.lastError: This request exceeds the MAX_WRITE_OPERATIONS_PER_MINUTE quota.
```

此外，每小时最多执行 1800 次写入操作，超出限制也会报错。

