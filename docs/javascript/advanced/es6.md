---
outline: deep
---

# ECMAScript 6 學習筆記

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

### 1. 二進位和八進位的寫法

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

### 2. `Number.isFinite`、`Number.isNaN`

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

### 3. `Number.isInteger`

**Number.isInteger(value)**

> 判斷傳入值是否為整數，並回傳布林值。

```js
let num1 = Number.isInteger(100); // true
let num2 = Number.isInteger(100.0); // true
let num3 = Number.isInteger('sheep'); // false
let num4 = Number.isInteger('100'); // false
```

### 4. 極小常數 `Number.EPSILON`

> 它表示 1 與大於 1 的最小浮點數之間的差。2^-52（2.220446049250313e-16）

```js
function isEqual(x, y) {
  return Math.abs(x - y) < Number.EPSILON;
}

console.log(isEqual(0.1 + 0.2, 0.3)); // true
console.log(0.1 + 0.2 === 0.3); // false
```

`Number.EPSILON` 是 JavaScript 能夠表示的最小精度。因此如果兩個小數之間的誤差小於這個值，就可以認為這個誤差已經沒有意義了，視為相等。

### 5. `Math.trunc()`

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

### 6. `Math.sign()`

> 用來判斷一個數到底是正數、負數、還是零。對於非數值，會先將其轉換為數值。

```js
Math.sign(-100); // -1
Math.sign(100); // +1
Math.sign(0); // +0
Math.sign(-0); // -0
Math.sign('sheep'); // NaN
```
