---
outline: deep
---

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

### 物件解構

巢狀結構物件的解構方式：

```js
let res = {
  code: 200,
  data: {
    list: ['aaa', 'bbb', 'ccc'],
  },
};

let {
  data: {
    list: [x, y, z],
  },
} = res;

console.log(x, y, z); // 'aaa' 'bbb' 'ccc'
```

函式參數解構：

```js
function getData() {
  let res = {
    code: 200,
    data: {
      list: ['aaa', 'bbb', 'ccc'],
    },
  };

  test(res);
}

function test({ code, data: { list } }) {
  console.log(code, list); // prints: 200 ['aaa', 'bbb', 'ccc']
}

getData();
```
