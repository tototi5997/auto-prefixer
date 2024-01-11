import { isAbsoluteUrl } from "./utils"

declare global {
  interface Window {
    $open: (url?: string | URL | undefined, target?: string | undefined, features?: string | undefined) => Window | null
    $fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>
    $location: Location
  }
}

enum locationParams {
  HREF = "href",
  REPLACE = "replace",
}

// 前缀名
const PREFIX_STR = "/blocface"
// 原生方法，防止外部修改 window.* 造成循环引用
const _window = typeof window === "undefined" ? globalThis : window
const _fetch = _window?.fetch
const _open = _window?.open
const _location = _window?.location

export const prefixerStr = (inputStr?: string): string => {
  // 没有参数直接返回 前缀 base pathname
  if (!inputStr || typeof inputStr !== "string") return PREFIX_STR

  // 是否是绝对地址
  if (isAbsoluteUrl(inputStr)) {
    const localOrigin = _window?.location?.origin
    const { protocol, host, pathname, origin } = new URL(inputStr)
    //域名与当前域名相同
    if (origin === localOrigin) {
      return protocol + "//" + host + PREFIX_STR + pathname
    }
    // 其他域名，不做处理
    else return inputStr
  }

  return `${PREFIX_STR}` + (inputStr?.startsWith("/") ? `${inputStr}` : `/${inputStr}`)
}

// 用于替代 fetch 方法
export const $fetch = (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
  // 解析参数
  const inputStr =
    typeof input === "string" ? input : input instanceof Request ? input.url : input instanceof URL ? input.href : ""

  const urlWithPrefix = prefixerStr(inputStr)
  let reuqestParams

  // 重新构造 request 对象
  if (input instanceof Request) {
    reuqestParams = new Request(urlWithPrefix, input as RequestInit)
  }

  return _fetch(reuqestParams || urlWithPrefix, init)
}

// window.open
export const $open = (url: string | URL | undefined, target?: string | undefined, features?: string | undefined) => {
  const inputStr = typeof url === "string" ? url : url?.href
  const urlWithPrefix = prefixerStr(inputStr)
  return _open(urlWithPrefix, target, features)
}

// proxy location
export const $location = new Proxy(Object.create(_location || {}), {
  get(_, key) {
    if (typeof Reflect.get(_location, key) === "function") {
      if (key === locationParams.REPLACE) {
        return function (url: string): void {
          if (typeof url === "string" && url && !isAbsoluteUrl(url)) {
            _location.replace(prefixerStr(url))
          } else {
            const replaceMethod = Reflect.get(_location, key)
            Reflect.apply(replaceMethod, _location, arguments)
          }
        }
      }
      return function () {
        const replaceMethod = Reflect.get(_location, key)
        Reflect.apply(replaceMethod, _location, arguments)
      }
    }
    return Reflect.get(_location, key)
  },
  set(_, key, value) {
    //空字符串刷新
    if (key === "href" && value && !isAbsoluteUrl(value)) {
      _location.href = prefixerStr(value)
    }
    Reflect.set(_location, key, value)
    return true
  },
})

// 注册全局 window 代理方法
export const registerWindow = () => {
  if (!window) return

  window.$fetch = $fetch
  window.$open = $open
  window.$location = $location
}
