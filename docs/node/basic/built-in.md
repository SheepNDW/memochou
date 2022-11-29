---
outline: deep
---

# 內建模組

## http 模組

> 要使用 HTTP Server 和 Client，則必須 `require('http')`。

```js
const http = require('http');

// 建立 server
http.createServer((req, res) => {
  // req 接收瀏覽器傳的參數
  // res 回傳渲染的內容
  res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
  res.write(`
    <html>
      <b>hello world</b>
      <div>你好 世界</div>
    </html>
  `);
  res.end();
}).listen(3000, () => {
  console.log('server start');
});
```

```js
const http = require('http');

const server = http.createServer();

// 監聽請求事件
server.on('request', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      data: 'Hello World!',
    })
  );
});

server.listen(3000);
```

## url 模組

### parse

```js
const url = require('url')
const urlString = 'http://localhost:3000/ad/index.html?id=8&name=mouse#tag=110';
const parsedStr = url.parse(urlString);
console.log(parsedStr);
/*
Url {
  protocol: 'http:',
  slashes: true,
  auth: null,
  host: 'localhost:3000',
  port: '3000',
  hostname: 'localhost',
  hash: '#tag=110',
  search: '?id=8&name=mouse',
  query: 'id=8&name=mouse',
  pathname: '/ad/index.html',
  path: '/ad/index.html?id=8&name=mouse',
  href: 'http://localhost:3000/ad/index.html?id=8&name=mouse#tag=110'
}
*/
```

### format

```js
const url = require('url')
const urlObject = {
  protocol: 'http:',
  slashes: true,
  auth: null,
  host: 'localhost:3000',
  port: '3000',
  hostname: 'localhost',
  hash: '#tag=110',
  search: '?id=8&name=mouse',
  query: 'id=8&name=mouse',
  pathname: '/ad/index.html',
  path: '/ad/index.html?id=8&name=mouse',
  href: 'http://localhost:3000/ad/index.html?id=8&name=mouse#tag=110',
};
const parsedObj = url.format(urlObject);
console.log(parsedObj);
/* 
http://localhost:3000/ad/index.html?id=8&name=mouse#tag=110
*/
```

### resolve

```js
const url = require('url')
const a = url.resolve('/one/two/three', 'four'); // ( 注意最後加 / ，不加 / 的區別 )
const b = url.resolve('http://example.com/', '/one');
const c = url.resolve('http://example.com/one', '/two');
console.log(a + ',' + b + ',' + c);
/* 
/one/two/four,http://example.com/one,http://example.com/two
*/
```

### 新版寫法

使用 `new URL` 取代 `url.parse`

```js
const urlString = 'http://localhost:3000/ad/index.html?id=8&name=mouse#tag=110';
const myURL = new URL(urlString);
console.log(myURL);
/*
URL {
  href: 'http://localhost:3000/ad/index.html?id=8&name=mouse#tag=110',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/ad/index.html',
  search: '?id=8&name=mouse',
  searchParams: URLSearchParams { 'id' => '8', 'name' => 'mouse' },
  hash: '#tag=110'
}
*/
```

使用 `new URL` 取代 `url.resolve`

```js
const newUrl = new URL('/one', 'http://example.com/aaa/bbb/');
console.log(newUrl.href); 
// prints: http://example.com/one
```

新的 `url.format` 寫法

```js
const myURL = new URL('https://a:b@測試?abc#foo');
console.log(url.format(myURL, { unicode: true, auth: false, fragment: false, search: false }));
// prints: https://測試/
```

### fileURLToPath & urlToHttpOptions

```js
const { fileURLToPath, urlToHttpOptions } = require('node:url');

console.log(new URL('file://c://你好.txt').pathname); // 錯誤: /c://%E4%BD%A0%E5%A5%BD.txt
console.log(fileURLToPath('file://c://你好.txt')); // 正確: c:\\你好.txt (Windows)

const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL);
/*
URL {
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  origin: 'https://xn--g6w251d',
  protocol: 'https:',
  username: 'a',
  password: 'b',
  host: 'xn--g6w251d',
  hostname: 'xn--g6w251d',
  port: '',
  pathname: '/',
  search: '?abc',
  searchParams: URLSearchParams { 'abc' => '' },
  hash: '#foo'
}
*/

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```

## querystring 模組

### parse

```js
const querystring = require('node:querystring');
const str = 'name=sheep&age=25&job=f2e';
const obj = querystring.parse(str);

console.log(obj);
// prints: [Object: null prototype] { name: 'sheep', age: '25', job: 'f2e' }
```

### stringify

```js
const myobj = {
  a: 1,
  b: 2,
  c: 3,
};

const mystr = querystring.stringify(myobj);
console.log(mystr);
// prints: a=1&b=2&c=3
```

### escape/unescape

```js
const str1 = 'id=3&city=台北&url=https://www.google.com';
const escaped = querystring.escape(str1);
console.log(escaped);
// prints: id%3D3%26city%3D%E5%8F%B0%E5%8C%97%26url%3Dhttps%3A%2F%2www.google.com

const escape1 = 'id%3D3%26city%3D%E5%8F%B0%E5%8C%97%26url%3Dhttps%3A%2F%2www.google.com';
const str2 = querystring.unescape(escape1);
console.log(str2);
// prints: id=3&city=台北&url=https://www.google.com
```

## http 模組補充

### JSONP

```js
const http = require('http');

const app = http.createServer((req, res) => {
  const myURL = new URL(req.url, 'http://localhost:3000');
  // console.log(myURL.searchParams.get('callback'));
  const cb = myURL.searchParams.get('callback');
  switch (myURL.pathname) {
    case '/api/user':
      res.end(
        `${cb}(${JSON.stringify({
          name: 'sheep',
          age: 18,
        })})`
      );
      break;

    default:
      res.end('404');
  }
});

app.listen(3000, () => {
  console.log('localhost:3000');
});
```

```html
<body>
  <!-- 呼叫 JSONP -->
  <script>
    var oscript = document.createElement('script');
    oscript.src = 'http://localhost:3000/api/user?callback=test';

    document.body.appendChild(oscript);

    function test(obj) {
      console.log(obj);
    }
  </script>
</body>
```

### 跨域：CORS

```js
const http = require('http');

const app = http.createServer((req, res) => {
  const myURL = new URL(req.url, 'http://localhost:3000');

  res.writeHead(200, {
    'Content-Type': 'application/json;charset=utf-8',
    'access-control-allow-origin': '*',
  });

  switch (myURL.pathname) {
    case '/api/user':
      res.end(
        JSON.stringify({
          name: 'sheep',
          age: 18,
        })
      );
      break;

    default:
      res.end('404');
  }
});

app.listen(3000, () => {
  console.log('localhost:3000');
});
```

### get

```js
const http = require('http');
const https = require('https');

const app = http.createServer((req, res) => {
  const myURL = new URL(req.url, 'http://localhost:3000');

  res.writeHead(200, {
    'Content-Type': 'application/json;charset=utf-8',
    'access-control-allow-origin': '*',
  });

  switch (myURL.pathname) {
    case '/api/films':
      httpGet((data) => {
        res.end(data);
      });
      break;

    default:
      res.end('404');
  }
});

app.listen(3000, () => {
  console.log('localhost:3000');
});

function httpGet(cb) {
  let data = '';
  https.get('somethingURL', (res) => {
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      // console.log(data);
      cb(data);
    });
  });
}
```

### post

```js
const http = require('http');
const https = require('https');

const app = http.createServer((req, res) => {
  const myURL = new URL(req.url, 'http://localhost:3000');

  res.writeHead(200, {
    'Content-Type': 'application/json;charset=utf-8',
    'access-control-allow-origin': '*',
  });

  switch (myURL.pathname) {
    case '/api/post':
      httpPost((data) => {
        res.end(data);
      });
      break;

    default:
      res.end('404');
  }
});

app.listen(3000, () => {
  console.log('localhost:3000');
});

function httpPost(cb) {
  let data = '';

  const options = {
    hostname: 'm.xiaomiyoupin.com',
    port: '443',
    path: '/mtop/market/search/placeHolder',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'x-www-form-urlencoded'
    },
  };

  const req = https.request(options, (res) => {
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => cb(data));
  });
  // req.write("name=sheep&age=100")
  req.write(JSON.stringify([{}, { baseParam: { ypClient: 1 } }]));
  req.end();
}
```

### 爬蟲

```js
const http = require('http');
const https = require('https');
const cheerio = require('cheerio');

const app = http.createServer((req, res) => {
  const myURL = new URL(req.url, 'http://localhost:3000');

  res.writeHead(200, {
    'Content-Type': 'application/json;charset=utf-8',
    'access-control-allow-origin': '*',
  });

  switch (myURL.pathname) {
    case '/api/films':
      httpGet((data) => {
        res.end(spider(data));
      });
      break;

    default:
      res.end('404');
  }
});

app.listen(3000, () => {
  console.log('localhost:3000');
});

function httpGet(cb) {
  let data = '';
  https.get('https://i.maoyan.com/', (res) => {
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      cb(data);
    });
  });
}

function spider(data) {
  // npm i cheerio
  const $ = cheerio.load(data);
  const $movielist = $('.column.content');
  const movies = [];

  $movielist.each((index, value) => {
    movies.push({
      title: $(value).find('.title').text(),
      grade: $(value).find('.grade').text(),
      actor: $(value).find('.actor').text(),
    });
  });

  console.log(movies);
  return JSON.stringify(movies);
}
```

## events 模組

```js
const EventEmitter = require('events');

const event = new EventEmitter();

event.on('play', (data) => {
  console.log('事件觸發了-play', data);
});

event.on('run', (data) => {
  console.log('事件觸發了-run', data);
});

setTimeout(() => {
  event.emit('play', '111111');
}, 2000);
```
