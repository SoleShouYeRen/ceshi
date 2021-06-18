/*
 * @Descripttion: 
 * @version: 
 * @Author: LCQ
 * @Date: 2020-11-16 11:51:28
 * @LastEditors: LCQ
 * @LastEditTime: 2020-11-16 11:54:46
 */
export function deepCopy (obj) {
  let result = Array.isArray(obj) ? [] : {} // 注意指向对象的指针，每次都创建新的空对象
  for (let key in obj) {
    // if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = deepCopy(obj[key])
      } else {
        result[key] = obj[key]
      }
    // }
  }
  return result
}