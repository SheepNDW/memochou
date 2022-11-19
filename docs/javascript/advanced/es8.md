---
outline: deep
---

# ECMAScript 8 學習筆記

> 參考學習資源：[阮一峰 ECMAScript 6 (ES6) 標準入門教程 第三版](https://www.bookstack.cn/books/es6-3rd)、[從 ES6 開始的 JavaScript 學習生活](https://eddy-chang.gitbook.io/javascript-start-from-es6/)

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
