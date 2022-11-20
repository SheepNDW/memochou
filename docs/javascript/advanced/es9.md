---
outline: deep
---

# ECMAScript 9 學習筆記

> 參考學習資源：[阮一峰 ECMAScript 6 (ES6) 標準入門教程 第三版](https://www.bookstack.cn/books/es6-3rd)

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
