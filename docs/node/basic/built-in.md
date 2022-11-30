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

## fs 模組

```js
const fs = require('fs');

// 新增資料夾
fs.mkdir('./avatar', (err) => {
  // console.log(err);
  if (err?.code === 'EEXIST') {
    console.log('資料夾已存在');
  }
});

// 重新命名資料夾
fs.rename('./avatar', './avatar2', (err) => {
  if (err?.code === 'ENOENT') {
    console.log('該資料夾並不存在');
  }
});

// 刪除資料夾
fs.rmdir('./avatar', (err) => {
  if (err?.code === 'ENOENT') {
    console.log('資料夾不存在');
  }
});

// 寫內容到檔案裡
fs.writeFile('./avatar/a.txt', 'hello', (err) => {
  console.log(err);
});

// 新增內容到檔案裡
fs.appendFile('./avatar/a.txt', '\nworld', (err) => {
  console.log(err);
});

// 讀取檔案內容
fs.readFile('./avatar/a.txt', (err, data) => {
  if (!err) {
    console.log(data.toString('utf-8'));
  }
});

fs.readFile('./avatar/a.txt', 'utf-8', (err, data) => {
  if (!err) {
    console.log(data);
  }
});

// 刪除檔案
fs.unlink('./avatar/a.txt', (err) => {
  console.log(err);
});

// 讀取資料夾內容
fs.readdir('./avatar', (err, data) => {
  if (!err) {
    console.log(data);
  }
});

// 讀取檔案狀態
fs.stat('./avatar/text.txt', (err, data) => {
  console.log(data.isFile());
  console.log(data.isDirectory());
});

// 同步讀取檔案
try {
  const content = fs.readFileSync('./avatar/text.txt', 'utf-8')
  console.log(content)
  console.log(0)
} catch (e) {
  console.log(e.message)
}

// 非同步讀取檔案：方法一
fs.readFile('./avatar/text.txt', 'utf-8', (err, content) => {
  console.log(content)
  console.log(0)
})
console.log(1)

// 非同步讀取檔案：方法二
const fs = require("fs").promises
fs.readFile('./avatar/text.txt', 'utf-8').then(result => {
  console.log(result)
})
```

## stream 模組

`stream` 是 Node.js 提供的又一個僅在 server 端可用的模組，目的是支援“流”這種資料結構。

什麼是流？流是一種抽象的資料結構。想像水流，當在水管中流動時，就可以從某個地方（例如自來水廠）源源不斷地到達另一個地方（比如你家的洗手池）。我們也可以把資料看成是資料流，比如你敲鍵盤的時候，就可以把每個字符依次連起來，看成字符流。這個流是從鍵盤輸入到應用程式，實際上它還對應著一個名字：標準輸入流（stdin）。

![](https://i.imgur.com/1rtYMOX.png)

如果應用程式把字符一個一個輸出到顯示器上，這也可以看成是一個流，這個流也有名字：標準輸出流（stdout）。流的特點是資料是有序的，而且必須依次讀取，或者依次寫入，不能像Array那樣隨機定位。

有些流用來讀取資料，比如從檔案讀取資料時，可以打開一個檔案流，然後從檔案流中不斷地讀取資料。有些流用來寫入資料，比如向檔案寫入資料時，只需要把資料不斷地往檔案流中寫進去就可以了。

在 Node.js 中，流也是一個物件，我們只需要回應流的事件就可以了：`data` 事件表示流的資料已經可以讀取了，`end` 事件表示這個流已經到末尾了，沒有資料可以讀取了，`error` 事件表示出錯了。

```js
const fs = require('fs');

const rs = fs.createReadStream('./1.txt', 'utf-8');

rs.on('data', (chunk) => {
  console.log('chunk-', chunk);
});

rs.on('end', () => {
  console.log('end');
});

rs.on('error', (err) => {
  console.log(err);
});
```

要注意，`data` 事件可能會有多次，每次傳遞的 `chunk` 是流的一部分資料。

要以流的形式寫入檔案，只需要不斷呼叫 `write()` 方法，最後以 `end()` 結束：

```js
const fs = require('fs');

const ws = fs.createWriteStream('./2.txt', 'utf-8');

ws.write('1111111');
ws.write('2222222');
ws.write('3333333');

ws.end();
```

`pipe` 就像可以把兩個水管串成一個更長的水管一樣，兩個流也可以串起來。一個 `Readable` 流和一個 `Writable` 流串起來後，所有的資料自動從 `Readable` 流進入 `Writable` 流，這種操作叫 `pipe`。

在 Node.js 中，`Readable` 流有一個 `pipe()` 方法，就是用來幹這件事的。

讓我們用 `pipe()` 把一個檔案流和另一個檔案流串起來，這樣源檔案的所有資料就自動寫入到目標檔案裡了，所以，這實際上是一個複製檔案的程式：

```js
const fs = require('fs');

const readStream = fs.createReadStream('./1.txt');
const writeStream = fs.createWriteStream('./2.txt');

readStream.pipe(writeStream);
```

## zlib 模組

![](https://i.imgur.com/n6QIxtM.png)

```js
const http = require('http');
const fs = require('fs');
const zlib = require('zlib');
const gzip = zlib.createGzip();

http
  .createServer((req, res) => {
    // res 可寫流
    const readStream = fs.createReadStream('./index.js');
    res.writeHead(200, {
      'Content-Type': 'application/x-javascript;charset=utf-8',
      'Content-Encoding': 'gzip',
    });
    readStream.pipe(gzip).pipe(res);
  })
  .listen(3000, () => {
    console.log('server start!');
  });
```

## crypto 模組

crypto 模組的目的是為了提供通用的加密和雜湊（Hash）演算法。用純 JavaScript 程式碼實現這些功能不是不可能，但速度會非常慢。Nodejs 用 C/C++ 實現這些演算法後，透過 crypto 這個模組輸出為 JavaScript 介面，這樣用起來方便，執行速度也快。

MD5 是一種常用的雜湊演算法，用於給任意資料一個“簽章”。這個簽章通常用一個十六進位的字串表示：

```js
const crypto = require('crypto');

const hash = crypto.createHash('md5');

// 可任意多次呼叫update():
hash.update('Hello, world!');
hash.update('Hello, nodejs!');

console.log(hash.digest('hex')); 
```

`update()` 方法預設字串編碼為 `UTF-8`，也可以傳入 Buffer。

如果要計算 SHA1，只需要把 `'md5'` 改成 `'sha1'`，就可以得到 SHA1 的結果 `1f32b9c9932c02227819a4151feed43e131aca40`。

Hmac 演算法也是一種雜湊演算法，它可以利用 MD5 或 SHA1 等雜湊演算法。不同的是，Hmac 還需要一個密鑰：

```js
const crypto = require('crypto');

const hmac = crypto.createHmac('sha256', 'secret-key');

hmac.update('Hello, world!');
hmac.update('Hello, nodejs!');

console.log(hmac.digest('hex')); // 80f7e22570...
```

只要密鑰發生了變化，那麼同樣的輸入資料也會得到不同的簽章，因此，可以把 Hmac 理解為用隨機數“增強”的雜湊演算法。

AES是一種常用的對稱加密演算法，加解密都用同一個密鑰。crypto 模組提供了 AES，但是需要自己封裝好函式，便於使用：

```js
const crypto = require('crypto');

function encrypt(key, iv, data) {
  let dep = crypto.createCipheriv('aes-128-cbc', key, iv);

  return dep.update(data, 'binary', 'hex') + dep.final('hex');
}

function decrypt(key, iv, crypted) {
  crypted = Buffer.from(crypted, 'hex').toString('binary');

  let dep = crypto.createDecipheriv('aes-128-cbc', key, iv);
  return dep.update(crypted, 'binary', 'utf8') + dep.final('utf8');
}

//16*8 = 128
let key = 'abcdef1234567890';
let iv = 'tbcdey1234567890';

let data = 'sheep';

let crypted = encrypt(key, iv, data);
console.log('加密結果-', crypted);

let decrypted = decrypt(key, iv, crypted);
console.log('解密結果-', decrypted);
```
