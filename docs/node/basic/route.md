# 路由

## 基礎

目錄結構：

```
root
├── api.js
├── index.js
├── route.js
├── server.js
│
└── static
      ├── 404.html
      ├── favicon.ico
      ├── home.html
      └── login.html
```

- route.js

```js
const fs = require('fs');

function render(res, path, type = '') {
  res.writeHead(200, { 'Content-Type': `${type ? type : 'text/html'};charset=utf8` });
  res.write(fs.readFileSync(path), 'utf-8');
  res.end();
}

const route = {
  '/login': (req, res) => {
    render(res, './static/login.html');
  },
  '/home': (req, res) => {
    render(res, './static/home.html');
  },
  '/404': (req, res) => {
    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf8' });
    res.write(fs.readFileSync('./static/404.html'), 'utf-8');
    res.end();
  },
  '/favicon.ico': (req, res) => {
    render(res, './static/favicon.ico', 'image/x-icon');
  },
};

module.exports = route;
```

- api.js

```js
function render(res, data, type = '') {
  res.writeHead(200, { 'Content-Type': `${type ? type : 'application/json'};charset=utf8` });
  res.write(data);
  res.end();
}

const apiRouter = {
  '/api/login': (req, res) => {
    render(res, `{"ok":1}`);
  },
};

module.exports = apiRouter;
```

- server.js

```js
const http = require('http');

const Router = {};

function use(obj) {
  Object.assign(Router, obj);
}

function start() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    try {
      Router[url.pathname](req, res);
    } catch {
      Router['/404'](req, res);
    }
  });

  server.listen(3000, () => console.log('localhost:3000'));
}

exports.start = start;
exports.use = use;
```

- index.js

```js
const server = require('./server');
const route = require('./route');
const api = require('./api');

// 註冊路由
server.use(route);
server.use(api);

server.start();
```

## 獲取參數

### GET

```js
'/api/login': (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');

  if (
    url.searchParams.get('username') === 'sheep' &&
    url.searchParams.get('password') === '123456'
  ) {
    render(res, `{"ok":1}`);
  } else {
    render(res, `{"ok":0}`);
  }
}
```

### POST

```js
'/api/loginpost': (req, res) => {
  let post = '';

  // 透過 req 的 data 事件監聽函式，每當接受到請求體的資料，就累加到 post 變數中
  req.on('data', (chunk) => {
    post += chunk;
  });

  req.on('end', () => {
    console.log(post);
    post = JSON.parse(post);

    if (post.username === 'sheep' && post.password === '123456') {
      render(res, `{"ok":1}`);
    } else {
      render(res, `{"ok":0}`);
    }
  });
}
```

## 靜態資源處理

```js
const fs = require('fs');
const path = require('path'); // [!code ++]
// npm i mime
const mime = require('mime'); // [!code ++]

const route = {
  '/login': (req, res) => {
    render(res, './static/login.html');
  },
  '/': (req, res) => {
    render(res, './static/home.html');
  },
  '/home': (req, res) => {
    render(res, './static/home.html');
  },
  '/404': (req, res) => {
    if (readStaticFile(req, res)) return; // [!code ++]

    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf8' });
    res.write(fs.readFileSync('./static/404.html'), 'utf-8');
    res.end();
  },
  '/favicon.ico': (req, res) => { // [!code --]
    render(res, './static/favicon.ico', 'image/x-icon'); // [!code --]
  }, // [!code --]
};

function readStaticFile(req, res) { // [!code ++]
  const url = new URL(req.url, 'http://127.0.0.1:3000'); // [!code ++]
  const pathname = path.join(__dirname, '/static', url.pathname); // [!code ++]
  // [!code ++]
  if (fs.existsSync(pathname)) { // [!code ++]
    render(res, pathname, mime.getType(path.extname(pathname))); // [!code ++]
    return true; // [!code ++]
  } // [!code ++]
  return false; // [!code ++]
} // [!code ++]
```
