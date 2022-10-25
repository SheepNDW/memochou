# ECMAScript 6 學習筆記

## 變數解構賦值

### 陣列解構

```js
let arr = [1, 2, 3];

let [a, b, c] = arr;
/*
  此時 a, b, c 的值會分別為: 1, 2, 3
*/

// 如果要取陣列的第三個值時，寫法如下
let [, , third] = arr;
console.log(third); // 3
```

小技巧：陣列中的元素交換位置

```js
let x = 1;
let y = 2;

[y, x] = [x, y];

console.log(x, y); // prints: 2 1
```

巢狀結構陣列的解構方式：

```js
let arr = [1, [2, 3, 4], 5, 6];

let [a, [b, , d], c] = arr;

console.log(b, d); // prints: 2 4
```
