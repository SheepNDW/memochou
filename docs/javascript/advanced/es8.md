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

