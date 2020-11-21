<!-- TOC -->

- [API：](#api)
- [url 中不能直接使用的字段：](#url-中不能直接使用的字段)
  - [pageType:](#pagetype)
  - [p](#p)
- [url 中可以直接使用的字段：](#url-中可以直接使用的字段)
  - [word](#word)
  - [order](#order)
  - [type](#type)
  - [wlt](#wlt)
  - [hlt](#hlt)
  - [ratio](#ratio)
  - [tool](#tool)
  - [s_mode](#s_mode)
  - [mode](#mode)
  - [scd](#scd)
  - [ecd](#ecd)
  - [blt](#blt)
  - [bgt](#bgt)
  - [tlt](#tlt)
  - [tgt](#tgt)
  - [original_only](#original_only)
  - [work_lang](#work_lang)

<!-- /TOC -->

# API：

```
https://www.pixiv.net/ajax/search/${pageType}/${word}?word=${word}&order=${order}&p=${p}&type=${type}&s_mode=${s_mode}&mode=${mode}&wlt=${wlt}&hlt=${hlt}&ratio=${ratio}&tool=${tool}&scd=${scd}&ecd=$(ecd)&blt=${blt}&bgt=$(bgt)
```

# url 中不能直接使用的字段：

## pageType:
- artworks  // 插画·漫画
- illustrations // 插画
- manga // 漫画
- novels  // 小说

因为 url 中显示的这些类型，与实际请求时发送的类型未必完全一致。所以需要再判断。

## p

number

1. *最多 1000 页，超过 1000 视为 1000*
2. 如果没有 p，则为第一页

# url 中可以直接使用的字段：

## word

string   

## order

- date_d  // 默认，按从新到旧
- date  // 从旧到新，可以从 url 获取

*如果 url 里没有 order 就视为 date_d*


## type
-                   //获取所有类型时，不需指定。如：插画、漫画、动图（动态插画）  插画·漫画没有这个字段
- illust            // 插画
- manga             // 漫画
- ugoira            // 动图，但其实和 illust 一样，没有单独区分动图
- illust_and_ugoira // 插画 和 动图，但其实和 illust 一样

*小说页面没有这个字段*

## wlt

number


## hlt

number


## ratio
- 0.5  // 横图
- 0   // 正方形
- -0.5  // 纵图

## tool
string

## s_mode

*搜索的精准度*

-             // 为空时是 "标签"
- s_tag_full  // 标签（完全一致）
- s_tc        // 标题，说明文字

## mode

*如果不限制，则留空*

- safe
- r18

## scd

*开始时间*

2019-10-23

## ecd

*结束时间*

2019-11-06

## blt

*收藏数量起始范围*

## bgt

*收藏数量终止范围*

*如果非会员使用收藏数标记，会被忽略*

## tlt

小说页面筛选字数时的起点

如 0-5000 ，tlt 为 0

## tgt

小说页面筛选字数时的终点

如 0-5000 ，tgt 为 5000

## original_only

仅显示原创作品

小说页面限定？

## work_lang

小说页面的作品语言选项