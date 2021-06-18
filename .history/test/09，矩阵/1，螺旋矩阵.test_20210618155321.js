/*
 * @Descripttion:
 * @version:
 * @Author: LCQ
 * @Date: 2021-06-18 12:00:24
 * @LastEditors: LCQ
 * @LastEditTime: 2021-06-18 15:53:21
 */
import matrix from "./1，螺旋矩阵";

test("matrix", () => {
  let input = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];
  expect(matrix(input)).toEqual([1, 2, 3, 6, 9, 8, 7, 4, 9]);
});
