你可以克隆本项目，并修改一些参数，编译成你自己使用的版本。

开发指南在 Readme 里。

## 下载线程数量

默认情况下，下载器最多可以进行 5 个下载线程。即使你输入更大的数字，也会被限制到 5。

你可以修改如下的参数：

`src\ts\modules\DownloadControl.ts`

```
private readonly downloadThreadMax: number = 5 // 同时下载的线程数的最大值，也是默认值
```

## 文件名相关

生成文件名、文件夹名是下面文件实现的：

`src\ts\modules\FileName.ts`

如果你对文件命名有特别的需求，可以修改这个文件。