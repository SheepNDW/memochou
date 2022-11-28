# CommonJS 規範

## modules 模組化規範寫法

我們可以把共用的功能抽離成為一個單獨的 js 檔案作為一個模組，預設情況下面這個模組裡面的方法或者屬性，外面是沒法存取的。如果要讓外部可以存取模組裡面的方法或者屬性，就必須在模組裡面透過 `exports` 或者 `module.exports` 向外輸出屬性或者方法。

a.js：

```js
function test() {
  console.log('test-aaa');
}
function upper(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

function _init() {
  console.log('init');
}

// 寫法一
// module.exports = {
//   test,
//   upper,
// };

// 寫法二
exports.test = test;
exports.upper = upper;
```

b.js：

```js
const moduleA = require('./a');

function test() {
  console.log('test-bbb');
}

console.log(moduleA.upper('sheep'));

module.exports = test;
```

c.js：

```js
function test() {
  console.log('test-ccc');
}

module.exports = test;
```

index.js：

```js
const moduleA = require('./a');
const moduleB = require('./b');
const moduleC = require('./c');

console.log(moduleA);

moduleA.test();
moduleB();
moduleC();
```
