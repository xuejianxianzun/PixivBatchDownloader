import { pageType } from './PageType'

// 查找横图作品的缩略图和容器
class FindHorizontalImageWrap {
  constructor() {
    this.obBody()
  }

  // 寻找作品缩略图的容器时使用的选择器
  // 并不是所有容器都需要处理，只需要处理应用了“显示更大的缩略图”的容器
  // 有些缩略图并不会被放大，也就不用处理它们的容器
  private workWrapSelectors = ['.searchList', 'li[size="1"]', 'ul>div']

  // 首先会动态生成 li（或者是包含很多 li 的容器元素）
  // 但是此时 li 里面没有 img 标签，而是用一个 figure 标签占位
  // 然后先为一些 li 生成里面的 img 标签（在用户主页会先给首屏显示的 li 生成 img 标签，但是在其他页面也有可能直接为所有 li 生成 img）
  // 有时候当页面滚动到下面的 li 的时候，才会生成里面的 img 标签
  // observer 可以捕获到添加的 img 标签，并且有 src 属性
  // 如果开启了下载器的替换方形缩略图功能，则捕获到的 src 是替换后的
  // 如果 img 的 src 是在缓存里的（并且没有禁用缓存），则捕获到它时就已经 complete 了

  // 首页的“关注用户・好P友的作品”和排行榜区域这样的横向滚动区域是分多次添加的：
  // 1. 页面加载时，这块区域是一次性添加的，添加的是最外层的 div，里面包含了作品列表，但只有前 8 个作品，后面是一些空壳容器
  // 2. 当用户向右滚动时，动态添加后续作品，此时既会添加单个 img 元素来填充空壳容器，还会添加单个的新的空壳容器（div）

  private obBody() {
    const ob = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          for (const el of mutation.addedNodes) {
            // 从添加的元素里寻找缩略图容器
            const e = el as HTMLElement
            const wrapList: HTMLElement[] = []
            // 如果添加的是单个的 li，，则判断它是不是缩略图容器
            if (e.nodeName === 'LI') {
              if (
                e.getAttribute('size') === '1' ||
                e.querySelector('div[width="184"]') ||
                e.classList.contains('searchList')
              ) {
                wrapList.push(e)
              }
            } else if (e.nodeName === 'IMG' && (e as HTMLImageElement).src) {
              if (pageType.type === pageType.list.ArtworkSearch) {
                // 在搜索页面里，添加的元素是 img 而不是其容器 li
                const li = e.closest('li')
                if (li) {
                  this.readyCheckImage(e as HTMLImageElement, li)
                }
              } else {
                // 在其他页面里（主要是首页），横向滚动区域里的一些作品是动态添加 img 元素的，寻找其父元素
                const parent = e.closest('ul>div') as HTMLDivElement
                if (parent) {
                  this.readyCheckImage(e as HTMLImageElement, parent)
                }
              }
            } else if (e.nodeType === 1) {
              // 如果添加的不是 li，则尝试在子元素里寻找缩略图容器
              for (const selector of this.workWrapSelectors) {
                const elList = e.querySelectorAll(selector)
                for (const el of elList) {
                  wrapList.push(el as HTMLLIElement)
                }
                // 如果这个选择器查找到了元素，就不再查找下一个选择器，以免重复查找
                if (elList.length > 0) {
                  break
                }
              }
              // 如果前面没有找到缩略图容器，则尝试其他办法
              // 注意，这里使用的选择器不是容器本身的选择器，而是容器的子元素，所以需要单独处理
              // if (wrapList.length === 0) {
              //   const elList = e.querySelectorAll('div[width="184"]')
              //   for (const el of elList) {
              //     if(el.parentNode?.nodeName === 'LI'){
              //       wrapList.push(el.parentNode as HTMLLIElement)
              //     }
              //   }
              // }
            }

            // 监视缩略图容器
            for (const wrap of wrapList) {
              this.obWorkWrap(wrap)
            }
          }
        }
      }
    })

    ob.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  // 监视作品缩略图容器内部的 img 元素
  private obWorkWrap(wrap: HTMLElement) {
    // 已经有 img 元素的情况
    if (pageType.type === pageType.list.ArtworkSearch) {
      // .searchList 是下载器在搜索页面生成的元素，里面一开始就有 img 元素，所以不需要监视
      if (wrap.classList.contains('searchList') || wrap.nodeName === 'LI') {
        const img = wrap.querySelector('img')! as HTMLImageElement
        this.readyCheckImage(img, wrap)
        return
      }
    }

    // 如果是动态生成 img 的情况，则需要对 wrap 使用监视器
    const ob = new MutationObserver((records) => {
      for (const record of records) {
        // 生成作品缩略图内部的 img 时，addedNodes 数组里只有 img 标签这一个元素
        if (
          record.addedNodes.length === 1 &&
          record.addedNodes[0].nodeName === 'IMG'
        ) {
          const img = record.addedNodes[0] as HTMLImageElement
          this.readyCheckImage(img, wrap, ob)
        }
      }
    })
    ob.observe(wrap, {
      childList: true,
      subtree: true,
    })
  }

  // 当图片加载完成时检查它的宽高，并取消监视
  private readyCheckImage(
    img: HTMLImageElement,
    wrap: HTMLElement,
    ob?: MutationObserver
  ) {
    if (img?.complete) {
      this.checkImage(img, wrap)
      ob && ob.disconnect()
    } else {
      img &&
        (img.onload = () => {
          this.checkImage(img, wrap)
          ob && ob.disconnect()
        })
    }
  }

  // 当 img 加载完成后，计算 img 是横图还是竖图
  private checkImage(img: HTMLImageElement, wrap: HTMLElement) {
    if (!img.src.includes('1200.jpg')) {
      return
    }
    if (img.naturalWidth / img.naturalHeight > 1) {
      this.find(wrap)
    }
  }

  private onFindCB: Function[] = []
  // 注册回调函数
  public onFind(cb: Function) {
    this.onFindCB.push(cb)
  }

  // 当找到横图的容器时会执行回调函数
  private find(wrap: HTMLElement) {
    for (const cb of this.onFindCB) {
      cb(wrap)
    }
  }
}

const findHorizontalImageWrap = new FindHorizontalImageWrap()
export { findHorizontalImageWrap }
