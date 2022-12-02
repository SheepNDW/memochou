# Express

> https://expressjs.com/zh-tw/

基於 Node.js Web 應用程式的開發框架

## 執行原理

底層：http 模組

> Express 框架建立在 node 內建的 http 模組上

原生 node 建立 server 的程式碼如下：

```js
const http = require('http');

const app = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
  res.write(`
    <html>
      <h1>Hello World</h1>
    </html>
  `);
  res.end();
});
app.listen(3000, () => console.log('server start!'))
```

Express 框架的核心是對 http 模組的再封裝。將上面程式碼用 Express 改寫：

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <html>
      <h1>Hello World</h1>
    </html>
  `);
});
app.listen(3000, () => console.log('server start'));
```

> Express 相當於是在 http 模組之上加了一層中介

## 基本路由

路由是指判斷應用程式如何回應用戶端對特定端點的要求，而這個特定端點是一個 URI（或路徑）與一個特定的 HTTP request 方法（GET、POST 等）。

每一個路由可以有一或多個處理程式函式，當路由相符時，就會執行這些函式。

路由定義的結構如下：

```js
app.METHOD(PATH, HANDLER)
```

- app 是 express 的實例
- METHOD 是 HTTP 請求方法
- PATH 是伺服器上的路徑
- HANDLER 是當路由相符時要執行的函式

路由路徑和請求方法一起定義了請求的端點，它可以是字串、字串模式或者正規表達式。

```js
// 符合根路徑的請求
app.get('/', (req, res) => {
  res.send('root');
});

// 符合 /about 路徑的請求
app.get('/about', (req, res) => {
  res.send('about');
});

// 符合 /random.text 路徑的請求
app.get('/random.text', (req, res) => {
  res.send('random.text');
});
```

使用字串模式的路由路徑範例：

```js
// 符合 acd 和 abcd
app.get('/ab?cd', (req, res) => {
  res.send('ab?cd');
});

// 符合 /ab/******
app.get('/ab/:id', (req, res) => {
  res.send('aaaaaaa');
});

// 符合 abcd、abbcd、abbbcd 等
app.get('/ab+cd', (req, res) => {
  res.send('ab+cd');
});

// 符合 abcd、abxcd、abRABDOMcd、ab123cd 等
app.get('/ab*cd', (req, res) => {
  res.send('ab*cd');
});

// 符合 /abe 和 /abcde
app.get('/ab(cd)?e', (req, res) => {
 res.send('ab(cd)?e');
});
```

使用正規表達式的路由路徑範例：

```js
// 符合任何路徑中含有 a 的路徑：
app.get(/a/, (req, res) => {
  res.send('/a/');
});

// 符合 butterfly、dragonfly，不符合 butterflyman、dragonfly man 等
app.get(/.*fly$/, (req, res) => {
  res.send('/.*fly$/');
});
```

可以在請求處理提供多個回呼函式，其行為類似中介軟體（middleware）。唯一的區別是這些回呼函式有可能呼叫 `next('route')` 方法而略過其餘的路由回呼。可以利用該機制為路由定義前置條件，如果在現行路由上繼續執行沒有意義，則可以將控制權傳遞給剩下的路由。

```js
const func1 = (req, res, next) => {
  // 驗證用戶 token, cookie 過期
  console.log('驗證 token');
  const isValid = true;
  if (isValid) {
    res.sheep = '這是 func1 計算的結果';
    next();
  } else {
    res.send('error');
  }
};

const func2 = (req, res) => {
  // 查詢 db
  // 回傳內容
  console.log(res.sheep);
  res.send({ list: [1, 2, 3] });
};

app.get('/home', [func1, func2]);
app.get('/list', func1, (req, res) => {
  res.send('list');
});
```
