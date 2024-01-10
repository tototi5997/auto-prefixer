/**
 * 判断字符串路径是否为绝对路径
 * @param str
 * @returns boolean
 */
export const isAbsoluteUrl = (str: string): boolean => {
  const pattern = /^(https?:\/\/).+/;
  return pattern.test(str)
}