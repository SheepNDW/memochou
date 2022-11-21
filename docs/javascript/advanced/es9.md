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
