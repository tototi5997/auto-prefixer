# @zlicom/autoprefixer

[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-downloads-url]
[![MIT License][license-image]][license-url]

## Installation

```shell
$ npm install @zlicom/autoprefixer --save-dev
```

## Why @zlicom/autoprefixer ?

* 轻量级前缀添加工具集
* 支持自定义前缀
* 原生 API 代理

# Customize

```shell
  // src/prefixer.ts
  const PREFIX_STR = '/you_prefixer'
```

```shell
  $ pnpm build
  $ npm login
  $ pnpm publish
```

# API

`prefixerStr(inputStr: string)`

返回一个带有前缀的字符串

```javascript
prefixerStr(); // /your-prefix
prefixerStr('/api'); // /your-prefix/api
```

`$fetch(nput: RequestInfo | URL,
  init?: RequestInit | undefined)`

使用同 `window.fetch`

`$open(
  url: string | URL | undefined,
  target?: string | undefined,
  features?: string | undefined,)`

使用同 `window.open`

`$location`

代理 `window.location` 的 `href` 属性和 `replace` 方法

`registerWindow`

注册 `$fetch`,`$open`和`$location` 到 window

```jsx
// src/index.js
import { registerWindow } from '@web-common/auto-prefixer';

const App = () => {
  registerWindow();
  return <Element></Element>;
};
```


[npm-version-image]: https://img.shields.io/npm/v/@zlicom/auto-prefixer.svg?style=flat
[npm-url]: https://www.npmjs.com/package/@zlicom/auto-prefixer

[npm-downloads-image]: https://img.shields.io/npm/dm/@zlicom/auto-prefixer.svg?style=flat
[npm-downloads-url]: https://npmcharts.com/compare/@zlicom/auto-prefixer?minimal=true

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE
