---
outline: deep
---

# ECMAScript 6 學習筆記

> 參考學習資源：[阮一峰 ECMAScript 6 (ES6) 標準入門教程](https://es6.ruanyifeng.com/)、[從 ES6 開始的 JavaScript 學習生活](https://eddy-chang.gitbook.io/javascript-start-from-es6/)

本筆記僅記錄複習 ES6+ 時一些不太熟悉或是比較重要的內容，並非所有的新特性及內容。

## 變數解構賦值

### 陣列解構

```js
let arr = [1, 2, 3];

let [a, b, c] = arr;
/*
  此時 a, b, c 的值會分別為: 1, 2, 3
*/

// 如果要取陣列的第三個值時，寫法如下
let [, , third] = arr;
console.log(third); // 3
```

小技巧：陣列中的元素交換位置

```js
let x = 1;
let y = 2;

[y, x] = [x, y];

console.log(x, y); // prints: 2 1
```

巢狀結構陣列的解構方式：

```js
let arr = [1, [2, 3, 4], 5, 6];

let [a, [b, , d], c] = arr;

console.log(b, d); // prints: 2 4
```

### 物件解構

巢狀結構物件的解構方式：

```js
let res = {
  code: 200,
  data: {
    list: ['aaa', 'bbb', 'ccc'],
  },
};

let {
  data: {
    list: [x, y, z],
  },
} = res;

console.log(x, y, z); // 'aaa' 'bbb' 'ccc'
```

函式參數解構：

```js
function getData() {
  let res = {
    code: 200,
    data: {
      list: ['aaa', 'bbb', 'ccc'],
    },
  };

  test(res);
}

function test({ code, data: { list } }) {
  console.log(code, list); // prints: 200 ['aaa', 'bbb', 'ccc']
}

getData();
```

## 數值的擴充功能

### 二進位和八進位的寫法

```js
// 過去只有十進位和十六進位
let num1 = 100;
let num2 = 0x100;

// 二進位寫法
let num3 = 0b100;

// 八進位寫法
let num4 = 0o100;

console.log(num1); // prints: 100
console.log(num2); // prints: 256
console.log(num3); // prints: 4
console.log(num4); // prints: 64
```

### `Number.isFinite`、`Number.isNaN`

將全域的 `isFinite` 和 `isNaN` 方法加入到了 Number 物件的內建方法裡，進而讓開發者減少使用全域方法，在程式撰寫上更加模組化：

**Number.isFinite(value)**

> 判斷傳入值是否為有限的數值，並回傳布林值。

```js
let num1 = Number.isFinite(100); // true
let num2 = Number.isFinite(100 / 0); // false
let num3 = Number.isFinite(Infinity); // false
let num4 = Number.isFinite('100'); // false
```

**Number.isNaN(value)**

> 判斷傳入值是否為 `NaN`，並回傳布林值。

```js {4,10}
// 使用 Number.isNaN 不會進行轉換
let num1 = Number.isNaN(100); // false
let num2 = Number.isNaN(NaN); // true
let num3 = Number.isNaN('sheep'); // false
let num4 = Number.isNaN('100'); // false

// 使用全域的 isNaN 它會先幫你轉換再進行判斷
let num1 = isNaN(100); // false
let num2 = isNaN(NaN); // true
let num3 = isNaN('sheep'); // true
let num4 = isNaN('100'); // false
```

它們和傳統的全域方法 `isFinite()` 和 `isNaN()` 的區別在於，傳統方法會先呼叫 `Number()` 進行非數值轉為數值，再進行判斷，而這兩個新方法只對數值有效，`Number.isFinite()` 對於非數值一律回傳 `false`,`Number.isNaN()` 只有對於 `NaN` 才回傳 `true`，非 `NaN` 一律回傳 `false`。

### `Number.isInteger`

**Number.isInteger(value)**

> 判斷傳入值是否為整數，並回傳布林值。

```js
let num1 = Number.isInteger(100); // true
let num2 = Number.isInteger(100.0); // true
let num3 = Number.isInteger('sheep'); // false
let num4 = Number.isInteger('100'); // false
```

### 極小常數 `Number.EPSILON`

> 它表示 1 與大於 1 的最小浮點數之間的差。2^-52（2.220446049250313e-16）

```js
function isEqual(x, y) {
  return Math.abs(x - y) < Number.EPSILON;
}

console.log(isEqual(0.1 + 0.2, 0.3)); // true
console.log(0.1 + 0.2 === 0.3); // false
```

`Number.EPSILON` 是 JavaScript 能夠表示的最小精度。因此如果兩個小數之間的誤差小於這個值，就可以認為這個誤差已經沒有意義了，視為相等。

### `Math.trunc()`

> 將小數部分抹除，回傳一個整數。

```js
Math.trunc(1.2); // 1
Math.trunc(1.8); // 1
Math.trunc(-1.8); // -1
Math.trunc(-1.2); // -1

// 如果是非數值，會先在內部轉為數值。
Math.trunc('123.456'); // 123
Math.trunc(true); //1
Math.trunc(false); // 0
Math.trunc(null); // 0

// 如果是空值或是無法擷取整數的值，回傳 NaN
Math.trunc(NaN); // NaN
Math.trunc('foo'); // NaN
Math.trunc(); // NaN
Math.trunc(undefined); // NaN
```

### `Math.sign()`

> 用來判斷一個數到底是正數、負數、還是零。對於非數值，會先將其轉換為數值。

```js
Math.sign(-100); // -1
Math.sign(100); // +1
Math.sign(0); // +0
Math.sign(-0); // -0
Math.sign('sheep'); // NaN
```

## 陣列的擴充功能

### 展開運算子 Spread Operator

> 展開（Spread）運算子就是三個點（`...`）

常被用來淺複製一個陣列如下：

```js
const arr = [1, 2, 3];
const copyArr = [...arr];
```

或是用在合併陣列：

```js
const arr = [1, 2, 3];
const arr2 = [4, 5, 6];

console.log([...arr, ...arr2]); // prints: [ 1, 2, 3, 4, 5, 6 ]
```

與解構賦值一起使用可以做到下面的效果：

```js
const myArr = [1, 2, 3, 4, 5, 6, 7, 8];
const [a, b, ...c] = myArr;

console.log(a, b, c); // prints: 1 2 [ 3, 4, 5, 6, 7, 8 ]
```

### `Array.from()`

> `Array.from` 方法可以用來將類似陣列的物件（array-like object）和可迭代（iterable）的物件轉換為真正的陣列。

使用情境：

- 將函式內部的 `arguments` 物件轉成真正的陣列：

```js
function test() {
  console.log(arguments.filter); // undefined
  console.log(Array.from(arguments).filter); // [Function: filter]
}

test(1, 2, 3, 4);
```

- 將 NodeList 轉為真正的陣列：

```js
const olis = document.querySelectorAll('li');

Array.from(olis).map(() => {
  // ...
});
```

### `Array.of()`

> `Array.of` 方法用在將一組值，轉換為陣列。

這個方法主要是用來彌補 `Array()` 的不足之處，原本的建構函式 Array 當參數數量不同時會有不同的行為：

```js
Array(); // []
Array(3); // [, , ,]
Array(3, 11, 8); // [3, 11, 8]
```

`Array.of` 基本上可以用來替代 `Array()` 或是 `new Array()`，並且行為非常統一：

```js
Array.of(); // []
Array.of(undefined); // [undefined]
Array.of(1); // [1]
Array.of(1, 2); // [1, 2]
```

### 陣列實體的 `find()`、`findIndex()`

陣列的 `find` 方法，用於找出第一個符合條件的陣列成員。 它的參數是一個 `callback`，所有陣列成員依次執行該 `callback`，直到找出第一個回傳值為 `true` 的成員，然後回傳該成員。 如果沒有符合條件的成員，則回傳 `undefined`。

```js
const arr = [11, 12, 13, 14, 15];
arr.find((item) => item > 13); // 14
```

陣列的 `findIndex` 方法的用法與 `find` 方法非常類似，回傳第一個符合條件的陣列成員的位置，如果所有成員都不符合條件，則回傳 `-1`。

```js
arr.findIndex((item) => item > 13); // 3
```

> 註：ES2022 中新增了從後面向前查找的 `findLast` 和 `findLastIndex` 兩個方法。

### 陣列實體的 `fill()`

> `fill` 方法使用給定值，填充一個陣列。

可以快速填充一個初始化的空陣列：

```js
new Array(3).fill(7);
// [7, 7, 7]
```

`fill` 方法還可以接受第二個和第三個參數，用於指定填充的起始位置和結束位置。

```js
['a', 'b', 'c'].fill(7, 1, 2);
// ['a', 7, 'c']
```

### 陣列實體的`flat()`、`flatMap()`

陣列的成員有時可能還是陣列，`flat` 方法可以將巢狀的陣列"攤平"，變成一個一維的陣列。並且這個方法回傳的是一個新的陣列，不會影響原本的陣列。

```js
const arr = [1, 2, 3, [4, 5, 6]];

const arr1 = arr.flat();
console.log(arr1); // prints: [ 1, 2, 3, 4, 5, 6 ]
```

`flatMap()` 方法對原陣列的每個成員執行一個函式（相當於執行 `Array.prototype.map()`），然後對回傳值組成的陣列執行 `flat()` 方法。 該方法回傳一個新陣列，不改變原陣列。

```js
const arr = [
  {
    name: '飲料',
    list: ['可樂', '雪碧', '紅茶'],
  },
  {
    name: '食物',
    list: ['雞塊', '漢堡', '薯條'],
  },
];

const res = arr.flatMap((item) => item.list);
console.log(res); // prints: [ '可樂', '雪碧', '紅茶', '雞塊', '漢堡', '薯條' ]
```

## 物件的擴充功能

### 物件屬性名表達式

```js
const name = 'a';

const obj = {
  name: 'sheep',
};

// 此時打印 obj，屬性名稱仍為 name，因為 obj 裡的 name 被當作字串解析
```

通過給物件屬性名稱加上中括號 `[]`，就可以使用變數當作物件的屬性名稱：

```js
const name = 'a';

const obj = {
  [name]: 'sheep',
};

// 此時 obj 就會變成 { a: 'sheep' }
```

表達式寫法也適用於定義方法名：

```js
const obj = {
  ['h' + 'ello']() {
    return 'hi';
  },
};
obj.hello(); // hi
```

### 物件的展開運算子

> 用法和陣列的 `...` 差不多，但是物件的展開運算子是 ES9 (ES2018) 才加入。

使用 `...` 快速合併物件：

```js
const obj1 = {
  name: 'sheep',
};

const obj2 = {
  age: 25,
};

const obj3 = {
  name: 'hitsuji',
};

console.log({ ...obj1, ...obj2, ...obj3 });
// prints: {name: 'hitsuji', age: 25}
// 屬性若重名則以後來者為主
```

### `Object.assign()`

在 ES9 之前若是要合併物件，需要使用 `Object.assign()` 方法來實作：

```js
const obj = {};
const obj1 = {
  name: 'sheep',
};
const obj2 = {
  age: 25,
};
const obj3 = {
  name: 'hitsuji',
};

console.log(Object.assign(obj, obj1, obj2, obj3));
// prints: {name: 'hitsuji', age: 25}
// obj = {name: 'hitsuji', age: 25}
```

`Object.assign` 會影響到第一個傳入的物件，因此如果不希望原資料被改變的話，可以先宣告一個空物件去接收。

### `Object.is()`

ES5 比較兩個值是否相等，只有兩個運算子：相等運算子（`==`）和嚴格相等運算子（`===`）。 它們都有缺點，前者會自動轉換資料型別，後者的 `NaN` 不等於自身，以及 `+0` 等於 `-0`。 JavaScript 缺乏一種運算，在所有環境中，只要兩個值是一樣的，它們就應該相等。

`Object.is()` 被用來比較兩個值是否嚴格相等，與 `===` 的行為基本一致。

```js
Object.is('foo', 'foo'); // true
Object.is({}, {}); // false
```

不同之處只有兩個：一是 `+0` 不等於 `-0`，二是 `NaN` 等於自身。

```js
// ===
parseInt('sheep') === NaN; // false
+0 === -0; // true

// Object.is
Object.is(parseInt('sheep'), NaN); // true
Object.is(+0, -0); // false
```
