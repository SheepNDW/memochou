---
outline: deep
---

# ECMAScript 8 學習筆記

> 參考學習資源：[阮一峰 ECMAScript 6 (ES6) 標準入門教程](https://es6.ruanyifeng.com/)、[從 ES6 開始的 JavaScript 學習生活](https://eddy-chang.gitbook.io/javascript-start-from-es6/)

本筆記僅記錄複習 ES6+ 時一些不太熟悉或是比較重要的內容，並非所有的新特性及內容。

## async 與 await

> `async` 函式回傳一個 Promise 物件，可以使用 `then` 方法添加 callback。當函式執行的時候，一旦遇到 `await` 就會先回傳，等到非同步操作完成，再接著執行函式體內後面的語句。

### Async

async 函式，使非同步操作變得更加方便。

- 更好的語義
- 回傳值為 Promise

```js
async function test() {
  return new Promise((resolve, reject) => {
    resolve('data-1111');
  });
}

test()
  .then((result) => {
    console.log('success: ', result);
  })
  .catch((error) => {
    console.log('err: ', err);
  });
```

### await

`await` 指令後方是一個 Promise 物件，回傳該物件的結果。如果不是 Promise 物件，就直接回傳對應的值。

```js
function ajax1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('data-1111');
    }, 1000);
  });
}

function ajax2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('data-2222');
    }, 1000);
  });
}

async function test() {
  let res1 = await ajax1();
  console.log(res1);

  let res2 = await ajax2(res1);
  console.log(res2);

  return res2;
}

test().then((result) => {
  console.log('result: ', result);
});

/*
  prints:
    （1 秒後）
    data-1111

    （再過 1 秒）
    data-2222
    result: data-2222
*/
```

### 錯誤處理

用 `try...catch` 來進行錯誤時的處理。

```js
try {
  let res1 = await ajax('https://somethingUrl/1');
  let res2 = await ajax('https://somethingUrl/2');
} catch(err) {
  console.log('err: ', err);
}
```

## 物件方法的擴充

### Object.values() 和 Object.entries()

ES2017 引入了跟 `Object.keys` 配套的 `Object.values` 和 `Object.entries`，作為遍歷一個物件的補充手段。

```js
let obj = {
  name: 'sheep',
  age: 25,
};

console.log(Object.values(obj));  // prints: ['sheep', 25]
console.log(Object.entries(obj)); // prints: [['name', 'sheep'], ['age', 25]]

let m = new Map(Object.entries(obj));
console.log(m); // prints: {'name' => 'sheep', 'age' => 25}
```

### Object.getOwnPropertyDescriptors()

ES5 的 `Object.getOwnPropertyDescriptor()` 方法會回傳某個物件屬性的描述物件（descriptor）。ES2017 引入了 `Object.getOwnPropertyDescriptors()` 方法，回傳指定物件所有自身屬性（非繼承屬性）的描述物件。

**複製物件**

該方法的引入目的，主要是為了解決 `Object.assign()` 無法正確複製 `get` 屬性和 `set` 屬性的問題。

```js
let obj = {
  name: 'sheep',
  age: 25,

  get uppername() {
    return this.name.substring(0, 1).toUpperCase() + this.name.substring(1);
  },

  set uppername(val) {

    this.name = val;
  },
};

let obj1 = {};
Object.assign(obj1, obj);
```

![](https://i.imgur.com/jecc6kR.png)

> `Object.assign(obj1, obj)` 無法複製 get set 方法

這時 `Object.getOwnPropertyDescriptors()` 方法配合 `Object.defineProperties()` 方法，就可以實現正確複製。

```js
Object.defineProperties(obj1, Object.getOwnPropertyDescriptors(obj));
```

![](https://i.imgur.com/VBfjqk9.png)

## 字串填充

> `padStart()`、`padEnd()` 方法可以使得字串達到固定長度，有兩個參數，字串目標長度和填充內容。

```js
let str = 'sheep';

console.log(str.padStart(10, 'x')); // xxxxxsheep
console.log(str.padEnd(10, 'x'));   // sheepxxxxx

// 原字串長度大於等於目標長度則不會改變
console.log(str.padStart(5, 'x'));  // sheep
console.log(str.padEnd(5, 'x'));    // sheep
```

實作：日期補零

```js
// 期待的 list 內容：01 02 03 04 05 06 07 08 09 10 11 12
let list = [];

for (let i = 1; i < 13; i++) {
  list.push((i + '').padStart(2, '0'));
}
```

## 函式參數的末尾加上逗號

```js
function (
  a,
  b,
  c,
) {
  console.log(a, b)
}

test(
  1,
  2,
  3,
)
```

> 「末尾逗號」在新增新的參數、屬性、元素時是有用的，你可以直接新加一行而不必給上一行再補充一個逗號，這樣使版本控制工具的修改紀錄也更加簡潔
