import { defineConfig } from "rollup"
import resolve from "rollup-plugin-node-resolve"
// import commonjs from "@rollup/plugin-commonjs"
import typescript from "rollup-plugin-typescript2"
import dts from "rollup-plugin-dts"

export default defineConfig([
  {
    input: "src/index.ts", // 打包入口
    output: [
      {
        format: "cjs", // 打包为commonjs格式
        file: "dist/auto-prefixer.cjs.js", // 打包后的文件路径名称
        name: "autoPrefixer", // 打包后的默认导出文件名称
      },
      {
        format: "esm", // 打包为esm格式
        file: "dist/auto-prefixer.esm.js",
        name: "autoPrefixer",
      },
      {
        format: "umd", // 打包为umd通用格式
        file: "dist/auto-prefixer.umd.js",
        name: "autoPrefixer",
        minifyInternalExports: true,
      },
    ],
    plugins: [
      resolve(), // 查找打包第三方模块
      // commonjs(), // commonjs 转换成 es2015
      typescript(), // 解析 ts
    ],
  },
  {
    input: "src/index.ts",
    output: [
      {
        format: "esm",
        file: "dist/index.d.ts",
      },
    ],
    plugins: [
      dts(), // 生成.d.ts文件
    ],
  },
])
