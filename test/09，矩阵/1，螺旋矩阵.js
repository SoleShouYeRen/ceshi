/*
 * @Descripttion:
 * @version:
 * @Author: LCQ
 * @Date: 2021-06-18 12:01:12
 * @LastEditors: LCQ
 * @LastEditTime: 2021-06-18 13:02:40
 */
/* 
矩阵
  螺旋矩阵
  旋转图像
*/

export default arr => {
  let map = (arr, r = []) => {
    // 处理每一圈的数据的遍历过程
    for (let i = 0, len = arr.length; i < len; i++) {
      if (i === 0) {
        r = r.concat(arr[i]); // 拿到第一行数据
      } else if (i === len - 1) {
        r = r.concat(arr[i].reverse()); // 拿到最后一行数据
      } else {
        r.push(arr[i].pop()); // 拿到中间行的最后一个数
      }
    }
    arr.shift(); // 清除第一行
    arr.pop(); // 清除最后一行
    for (let i = arr.length - 1; i >= 0; i--) {
      r.push(arr[i].shift()); // 拿到中间行的第一个数
    }
    if (arr.length) {
      return map(arr, r); // 递归 sss
    } else {
      return r;
    }
  };
  return map(arr, []);
};
