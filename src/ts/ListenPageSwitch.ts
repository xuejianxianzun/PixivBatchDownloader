import { EVT } from './EVT'

// 监听页面的无刷新切换
class ListenPageSwitch {
  constructor() {
    this.supportListenHistory()
    this.listenPageSwitch()
  }

  // 为监听 history 的事件提供支持
  private supportListenHistory() {
    const element = document.createElement('script')
    element.setAttribute('type', 'text/javascript')
    element.innerHTML = `
    let _wr = function (type) {
      let orig = history[type];
      return function () {
        let rv = orig.apply(this, arguments);
        let e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
      };
    };
    history.pushState = _wr('pushState');
    history.replaceState = _wr('replaceState');
    `
    document.head.appendChild(element)
  }

  // 无刷新切换页面时派发事件
  private listenPageSwitch() {
    ;['pushState', 'popstate', 'replaceState'].forEach((item) => {
      window.addEventListener(item, () => {
        EVT.fire('pageSwitch')
      })
    })
  }
}

new ListenPageSwitch()
