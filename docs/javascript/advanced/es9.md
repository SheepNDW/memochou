---
outline: deep
---

# ECMAScript 9 學習筆記

> 參考學習資源：[阮一峰 ECMAScript 6 (ES6) 標準入門教程](https://es6.ruanyifeng.com/)

## 物件的其餘參數與展開運算子

### 物件的其餘參數（rest）

```js
let obj = {
  name: 'sheep',
  age: 25,
  job: 'f2e',
};

let { name, ...other } = obj;
console.log(name, other); // sheep {age: 25, job: 'f2e'}

function test({ name, ...other }) {
  console.log(name, other);
}

test(obj); // sheep {age: 25, job: 'f2e'}
```

### 物件的展開運算子（spread）

```js
// 合併物件
let obj1 = {
  name: 'hitsuji',
  job: 'f2e',
};

let obj2 = {
  name: 'sheep',
  age: 18,
};

let obj3 = { ...obj1, ...obj2 };
console.log(obj3); // {name: 'sheep', job: 'f2e', age: 18}

function ajax(options) {
  const defaultOptions = {
    method: 'get',
    async: true,
  };
  options = { ...defaultOptions, ...options };

  console.log(options);
}

ajax({
  url: '',
  method: 'post',
});
// {method: 'post', async: true, url: ''}

// 物件淺複製
let obj4 = {
  name: 'sheep',
  age: 25,
};

let obj5 = { ...obj4 };
obj5.age = 18;

console.log(obj4.age, obj5.age); // 25 18
```

## 正規表達式的 Named Capture Groups

正規表達式使用小括號進行群組對應（Capturing Group）。

```js
const RE_DATE = /(\d{4})-(\d{2})-(\d{2})/;
```

上面程式碼中，正規表達式裡面有三組小括號。使用 `exec` 方法，就可以將這三組對應結果提取出來。

```js
const RE_DATE = /(\d{4})-(\d{2})-(\d{2})/;
const matchObj = RE_DATE.exec('2022-11-21');
const year = matchObj[1]; // 2022
const month = matchObj[2]; // 11
const day = matchObj[3]; // 21
```

Capturing Group 的一個問題是，每一組的對應含義不容易看出來，而且只能用數字序號（比如 `matchObj[1]`）引用，要是群組的順序變了，引用的時候就必須修改序號。

ES2018 引入了 Named Capture Groups，允許為每一個群組對應指定一個名字，既便於閱讀程式碼，又便於引用。

```js
const RE_DATE = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const matchObj = RE_DATE.exec('2022-11-21');
const { year, month, day } = matchObj.groups;
console.log(year, month, day); // 2022 11 21
```

上面程式碼中，使用「問號 + 尖括號 + 群組名」（`?<year>`），然後就可以在 `exec` 方法回傳結果的 `groups` 屬性上引用該群組名。同時，數字序號（`matchObj[1]`）依然有效。

## Promise.finally()

> 無論成功還是失敗，都會執行的程式，例如隱藏對話框，關閉 loading 提示...等。

```js
function ajax() {
  return new Promise((resolve, reject) => {
    reject('err-1111');
  });
}

// 請求之前打開 loading
ajax()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log('err: ', err);
  })
  .finally(() => {
    // 關閉 loading
    console.log('finally');
  });
```

## 非同步迭代器

### 同步迭代器的問題

```js
function* gen() {
  yield 1111;
  yield 2222;
}
const g = gen();
console.log(g.next());
console.log(g.next());
console.log(g.next());
```

![](https://i.imgur.com/k5fIGc8.png)

```js
function ajax(data) {
  return new Promise((resolve) => {
    resolve(data);
  });
}

function* gen() {
  yield ajax(1111);
  yield ajax(2222);
}
const g = gen();

g.next().value.then((res) => {
  console.log(res);
});
g.next().value.then((res) => {
  console.log(res);
});
```

![](https://i.imgur.com/rNj42Ej.png)

> `value` 屬性的回傳值是一個 Promise 物件，用來放置非同步操作。但是這樣寫很麻煩，不太符合直覺，語意也比較繞。

### 非同步迭代器生成函式

> Generator 函式回傳一個同步迭代器，非同步 Generator 函式的作用，是回傳一個非同步迭代器物件。在語法上，非同步 Generator 函式就是 async 函式與 Generator 函式的結合。

```js
// 非同步生成器
async function* gen() {
  yield ajax(1111);
  yield ajax(2222);
}
const g = gen(); // g 就是一個非同步迭代器

g.next()
  .then((res) => {
    console.log(res);
    return g.next();
  })
  .then((res) => {
    console.log(res);
    return g.next();
  })
  .then((res) => {
    console.log(res);
  });
```

![](https://i.imgur.com/xBgmsEI.png)

### for await of

> `for...of` 迴圈用於遍歷同步的 Iterator 介面。新引入的 `for await...of` 迴圈，則是於遍歷非同步的 Iterator 介面。

```js
async function test() {
  const list = [g.next(), g.next(), g.next()];

  for await (const i of list) {
    console.log(i);
  }
}
test();
```

### 案例：使用 `for` 迴圈去進行一連串非同步執行任務

```js
function timer(t) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('data-' + t);
    }, t);
  });
}

async function* gen() {
  yield timer(1000); // task 1
  yield timer(2000); // task 2
  yield timer(3000); // task 3
}

async function test() {
  // 此時 await 卡住的是整個區塊
  for await (const item of gen()) {
    console.log('start-', Date.now());
    console.log(item);
    console.log('end-', Date.now());
  }
}
test();
```

### node.js 用法

```js
// 傳統寫法
function main(inputFilePath) {
  const readStream = fs.createReadStream(
    inputFilePath,
    { encoding: 'utf8', highWaterMark: 1024 }
  );
  readStream.on('data', (chunk) => {
    console.log('>>> '+ chunk);
  });
  readStream.on('end', () => {
    console.log('### DONE ###');
  });
}

// 非同步迭代器寫法
async function main(inputFilePath) {
  const readStream = fs.createReadStream(
    inputFilePath, 
    { encoding: 'utf8', highWaterMark: 1024 }
  );

  for await (const chunk of readStream) {
    console.log('>>> ' + chunk);
  }
  console.log('### DONE ###');
}
```
