import browser from 'webextension-polyfill'

// 注入脚本到页面的上下文中
// 主要是为了注入拦截 API 请求的脚本
// 这个脚本的执行时机是 document_start，可以让注入的脚本尽早生效。如果注入的晚了，就会拦截不到早期发起的请求

const scriptList = ['lib/api_interceptor.js']

function injectScript() {
  scriptList.forEach((path) => {
    const url = browser.runtime.getURL(path)
    const script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', url)
    ;(document.head || document.documentElement).appendChild(script)
  })
}

// 在红叶的版本里启用此功能
injectScript()
