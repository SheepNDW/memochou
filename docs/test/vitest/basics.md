# Testing Basics

[JavaScript Unit Testing - The Practical Guide](https://www.udemy.com/course/javascript-unit-testing-the-practical-guide/) 課程筆記

## Scripts 腳本指令

```json
// package.json
"scripts": {
  "test": "vitest --run --reporter verbose",
  "test:watch": "vitest",
}
```

* `--run`: 只執行一次
* `--reporter verbose`: 顯示測試細節 (verbose 可以保持完整可見的任務樹)
* `test:watch`: 開啟監聽模式 (根據程式碼改動自動執行測試)

## 撰寫第一個測試檔

```js
// math.js
export function add(numbers) {
  let sum = 0;

  for (const number of numbers) {
    sum += number;
  }
  return sum;
}

// math.spec.js
import { expect, it } from 'vitest';
import { add } from './math';

it('should summarize all number values in an array', () => {
  const result = add([1, 2, 3]);
  expect(result).toBe(6);
});
```

## The AAA Pattern - Arrange, Act, Assert

3A 原則：
* Arrange 階段：定義測試的環境和參數
* Act 階段：實際執行應該要被測試的程式碼或是函式
* Assert 階段：驗證執行結果與預測結果是否一致

若以剛剛的例子來實作的話，可以修改成這樣：

```js
it('should summarize all number values in an array', () => {
  // Arrange
  const numbers = [1, 2, 3];

  // Act
  const result = add(numbers);

  // Assert
  const expectedResult = numbers.reduce(
    (prevValue, currValue) => prevValue + currValue,
    0
  );
  expect(result).toBe(expectedResult);
});
```
> 範例中將預期的值改為用 reduce 去計算出來可以保證今天如果去修改 `numbers` 裡的值時，不小心忘了把 `toBe` 也一起更改時會出現測試錯誤的情境不會發生。

## Defining Behaviors & Fixing Errors In Your Code

實際開發中不應該只寫一種情境的測試，還要去定義出各種情境讓受測的方法在各種情境下都能按我們所想的去執行，現在繼續補上兩個測試情境：

* 當傳入的陣列中有不合法的值時應該回傳 `NaN`
* 如果是數字型的字串也要能回傳正確的加總值

```js
it('should yield NaN if a least one invalid number is provided', () => {
  const inputs = ['invalid', 1];

  const result = add(inputs);

  expect(result).toBeNaN();
});

it('should yield a correct sum if an array of numeric string values is provided', () => {
  const numbers = ['1', '2'];

  const result = add(numbers);

  const expectedResult = numbers.reduce(
    (prevValue, currValue) => +prevValue + +currValue,
    0
  );
  expect(result).toBe(expectedResult);
});
```

此時再執行 `npm run test` 時應該會吃到兩個 fail：`AssertionError: expected '0invalid1' to be NaN` 和 `AssertionError: expected '012' to be 3 // Object.is equality`。

通過測試得知了 `add` 函式存在了一些問題需要去修正：

```js {6}
// math.js
export function add(numbers) {
  let sum = 0;

  for (const number of numbers) {
    sum += +number; // 將 number 轉成數字
  }
  return sum;
}
```

再次執行 `npm run test` 後會看到已經都通過了。

## Testing For Errors

測試有無拋出錯誤時可以用 `trycatch` 去捕捉錯誤，也可以將函式包再另一個函式 resultFn 中，透過 `expect` 去執行它並配合 `toThrow` 去斷言它的結果：

```js
it('should throw an error if no value is passed into the function', () => {
  const resultFn = () => {
    add();
  };
  expect(resultFn).toThrow();
  expect(resultFn).not.toThrow(); // 如果加了 not 則代表不希望出現
});

it('should throw an error if provided with multiple arguments instead of an array', () => {
  const num1 = 1;
  const num2 = 2;

  const resultFn = () => {
    add(num1, num2);
  };

  expect(resultFn).toThrow();
});
```
> 如果今天是在 TS 環境上開發，上面這兩個測試情境會直接噴錯，因為函式定義時明確寫著接收一個陣列參數，但是在 JS 裡這是被允許的，所以要寫入錯誤情況的測試。


## Tests With Multiple Assertions (Multiple Expectations)

`toBeTypeOf` 可以用來檢查 result 是否為預期的型別，例如有這麼一個叫 `transformToNumber` 的函式，它會將傳入的字串數字參數轉成數字：

```js
// numbers.js
export function transformToNumber(value) {
  return +value;
}

// numbers.spec.js
import { it, expect } from 'vitest';
import { transformToNumber } from './numbers';

it('should transform a string number to a number of type number', () => {
  const input = '1';
  const result = transformToNumber(input);
  expect(result).toBeTypeOf('number');
});

// NaN 的 typeOf 也會是 number 所以要再測一次確定不是 NaN
it('should transform a string number to a number of type number', () => {
  const input = '1';
  const result = transformToNumber(input);
  expect(result).toBe(+input);
});

// 可以寫多個預期和斷言
it('should yield NaN for non-transformable values', () => {
  const input = 'invalid';
  const input2 = [1, 2, 3];

  const result = transformToNumber(input);
  const result2 = transformToNumber(input2);

  expect(result).toBeNaN();
  expect(result2).toBeNaN();
});
```

## Test Suites

使用 `describe` 區分開每個單元間的測試，讓這些測試可以更好的被組織並呈現在終端上

```js
describe('validateStringNotEmpty()', () => {
  it('...', () => {
    // ...
  });
});

describe('validateNumber()', () => {
  it('...', () => {
    // ...
  });
});
```

效果如下圖：

![](https://i.imgur.com/4rhhDgk.png)

