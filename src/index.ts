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
  PATHNAME = "pathname",
}

// 前缀名
const PREFIX_STR = "/blocface"
// 原生方法，防止外部修改 window.* 造成循环引用
const _window = typeof window === "undefined" ? globalThis : window
const _fetch = _window?.fetch
const _open = _window?.open
const _location = _window?.location

/**处理绝对路径 */
const dealWithAbsoluteURL = (url: string) => {
  const localOrigin = _window?.location?.origin
  const { protocol, host, pathname, origin } = new URL(url)
  // 域名与当前域名相同需要添加前缀
  return origin === localOrigin ? protocol + "//" + host + PREFIX_STR + pathname : url
}

/**去除前缀, 还原路径 */
// 用于原路径对比操作
export const withoutPrefix = (url: string) => url?.replace(PREFIX_STR, "")

/**路径添加前缀方法 */
export const prefixerStr = (inputStr?: string): string => {
  // 没有参数直接返回 前缀 base pathname
  if (!inputStr || typeof inputStr !== "string") return PREFIX_STR

  // 是否是绝对地址
  if (isAbsoluteUrl(inputStr)) return dealWithAbsoluteURL(inputStr)

  return `${PREFIX_STR}` + (inputStr?.startsWith("/") ? `${inputStr}` : `/${inputStr}`)
}

// 用于替代 fetch 方法
export const $fetch = (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
  // 解析参数
  const inputStr =
    typeof input === "string" ? input : input instanceof Request ? input.url : input instanceof URL ? input.href : ""

  const urlWithPrefix = prefixerStr(inputStr)
  let reuqestParams = null

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

//替代window.location方法
export const $location = new Proxy(Object.create(_location || {}), {
  get(_, key) {
    if (typeof Reflect.get(_location, key) === "function") {
      if (key === locationParams.REPLACE) {
        return function (url: string | URL): void {
          const urlStr = url instanceof URL ? url.href : url
          if (typeof urlStr === "string" && urlStr) {
            _location.replace(prefixerStr(urlStr))
          } else {
            const replaceMethod = Reflect.get(_location, key)
            Reflect.apply(replaceMethod, _location, arguments)
          }
        }
      }
      //如果是函数返回一个包装函数以便维持正确上下文
      return function () {
        const replaceMethod = Reflect.get(_location, key)
        Reflect.apply(replaceMethod, _location, arguments)
      }
    }
    if (key === locationParams.HREF || key === locationParams.PATHNAME) {
      const value = Reflect.get(_location, key)
      return withoutPrefix(value)
    }
    return Reflect.get(_location, key)
  },
  set(_, key, value) {
    //空字符串刷新
    if (key === locationParams.HREF && value) {
      return Reflect.set(_location, locationParams.HREF, prefixerStr(value))
    }
    return Reflect.set(_location, key, value)
  },
})

// 注册全局 window 代理方法
export const registerWindow = () => {
  if (!window) return
  window.$fetch = $fetch
  window.$open = $open
  window.$location = $location
}
