---
outline: deep
---

# Express Middleware

> https://expressjs.com/zh-tw/guide/using-middleware.html

## 中介軟體（Middleware）

Express 是一個本身功能極簡的路由與中介軟體 Web 架構：本質上，Express 應用程式是一系列的中介軟體函式呼叫。

中介軟體函式是一些有權存取要求物件 (req)、回應物件 (res) 和應用程式要求/回應循環中之下一個中介軟體函式的函式。下一個中介軟體函式通常以名為 next 的變數表示。

如果現行中介軟體函式不會結束要求/回應循環，它必須呼叫 `next()`，以便將控制權傳遞給下一個中介軟體函式。否則，要求將會停擺。

Express 應用程式可以使用下列類型的中介軟體：

- 應用程式層次的中介軟體
- 路由器層次的中介軟體
- 錯誤處理中介軟體
- 內建中介軟體
- 協力廠商中介軟體（第三方）

## 應用程式層次的中介軟體

使用 `app.use()` 和 `app.METHOD()` 函式，將應用程式層次的中介軟體連結至 app object 實例，其中 METHOD 是中介軟體函式要處理的 HTTP 要求方法（例如 GET、PUT 或 POST），並採小寫。例如：

```js
const app = express()

// 没有裝載路徑的 middleware，app 的每個請求都會執行該 middleware
app.use((req, res, next) => {
  console.log('驗證 token');
  next();
});
```

## 路由器層次的中介軟體

路由器層次的中介軟體的運作方式如同應用程式層次的中介軟體，不同之處在於它會連結至 `express.Router()` 實例。

- HomeRouter.js
```js
const express = require('express');

const router = express.Router();

// 路由器層次
router.get('/', (req, res) => {
  res.send('home');
});

module.exports = router;
```

- app.js
```js
const HomeRouter = require('./router/HomeRouter');

app.use('/home', HomeRouter);
```

## 錯誤處理中介軟體

錯誤處理中介軟體函數的定義方式，與其他中介軟體函數相同，差別在於引數是四個而非三個，具體來說，就是使用 (err, req, res, next) 簽章：

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('something broke!');
});
```

## 內建中介軟體

express.static 是 Express 唯一內建的中介軟體。它基於 serve-static，負責在 Express 應用程式中提供靜態資源。每個應用可有多個靜態目錄。

```js
app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(express.static('files'))
```

## 第三方中介軟體

針對必要的功能安裝 Node.js 模組，然後在應用程式層次或路由器層次將它載入到您的應用程式中。

```sh
npm install cookie-parser
```

```js
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

// load the cookie-parsing middleware
app.use(cookieParser());
```
