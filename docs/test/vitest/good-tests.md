---
outline: deep
---

# Writing Good Tests

[JavaScript Unit Testing - The Practical Guide](https://www.udemy.com/course/javascript-unit-testing-the-practical-guide/) 課程筆記

## 如何寫一個好測試？

![](https://i.imgur.com/JbiyRxI.png)

## 測試一個處理非常多業務的函式

在示範案例中的 `app.js` 有一個 `formSubmitHandler` 函式處理了很多的業務如下：

```js
import { extractNumbers } from './src/parser.js';
import {
  validateStringNotEmpty,
  validateNumber,
} from './src/util/validation.js';
import { add } from './src/math.js';
import { transformToNumber } from './src/util/numbers.js';

const form = document.querySelector('form');
const output = document.getElementById('result');

function formSubmitHandler(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const numberInputs = extractNumbers(formData);

  let result = '';
  
  try {
    const numbers = [];
    for (const numberInput of numberInputs) {
      validateStringNotEmpty(numberInput);
      const number = transformToNumber(numberInput);
      validateNumber(number);
      numbers.push(number);
    }
    result = add(numbers).toString();
  } catch (error) {
    result = error.message;
  }

  let resultText = '';

  if (result === 'invalid') {
    resultText = 'Invalid input. You must enter valid numbers.';
  } else if (result !== 'no-calc') {
    resultText = 'Result: ' + result;
  }

  output.textContent = resultText;
}

form.addEventListener('submit', formSubmitHandler);
```


### Refactoring
此時可以將整個函式重構並將單一邏輯給抽離出去各自測試：

#### Step 1

將處理表單轉換為 input 陣列的業務抽走
```diff
function formSubmitHandler(event) {
  event.preventDefault();
- const formData = new FormData(form);
- const numberInputs = extractNumbers(formData);

  // 略
}
```

把它寫成一個函式用 import 的方式引入並呼叫：

```js
// parser.js
export function extractEnteredNumberValues(form) {
  const formData = new FormData(form);
  const numberInputs = extractNumbers(formData);

  return numberInputs;
}
```

```diff
# app.js
- import { extractNumbers } from './src/parser.js';
+ import { extractEnteredNumberValues } from './src/parser.js';

function formSubmitHandler(event) {
  event.preventDefault();
+ const numberValues = extractEnteredNumberValues(form);

  // 略
}
```

#### Step 2

接著將產生 `result` 的業務抽離：

```diff
function formSubmitHandler(event) {
  event.preventDefault();
  const numberValues = extractEnteredNumberValues(form);

- let result = '';
  
- try {
-   const numbers = [];
-   for (const numberInput of numberInputs) {
-     validateStringNotEmpty(numberInput);
-     const number = transformToNumber(numberInput);
-     validateNumber(number);
-     numbers.push(number);
-   }
-   result = add(numbers).toString();
- } catch (error) {
-   result = error.message;
- }

  // ...
}
```

接著來到 `math.js` 封裝一個 `calculateResult` 函式：

```js
// math.js
export function calculateResult(numberValues) {
  let result = '';
  try {
    const numbers = [];
    for (const numberInput of numberValues) {
      validateStringNotEmpty(numberInput);
      const number = transformToNumber(numberInput);
      validateNumber(number);
      numbers.push(number);
    }
    result = add(numbers).toString();
  } catch (error) {
    result = error.message;
  }

  return result;
}
```

這裡可以看到函式中還包含了處理 `numbers` 的業務，這裡再將此邏輯給抽離出去：

```diff
export function calculateResult(numberValues) {
  let result = '';
  try {
-   const numbers = [];
-   for (const numberInput of numberInputs) {
-     validateStringNotEmpty(numberInput);
-     const number = transformToNumber(numberInput);
-     validateNumber(number);
-     numbers.push(number);
-   }
    result = add(numbers).toString();
  } catch (error) {
    result = error.message;
  }

  return result;
}
```

在 `number.js` 裡新增一個 `clearNumbers` 函式，用以處理將輸入的值處理成一個陣列：

```js
// number.js
export function cleanNumbers(numberValues) {
  const numbers = [];
  for (const numberInput of numberValues) {
    validateStringNotEmpty(numberInput);
    const number = transformToNumber(numberInput);
    validateNumber(number);
    numbers.push(number);
  }

  return numbers;
}
```

在 `math.js` 中引入：

```js {1,6}
import { cleanNumbers } from './util/numbers.js';

export function calculateResult(numberValues) {
  let result = '';
  try {
    const numbers = cleanNumbers(numberValues);
    result = add(numbers).toString();
  } catch (error) {
    result = error.message;
  }

  return result;
}
```

改寫 `app.js`

```diff
- import {
-   validateStringNotEmpty,
-   validateNumber,
- } from './src/util/validation.js';
- import { add } from './src/math.js';
- import { transformToNumber } from './src/util/numbers.js';
+ import { calculateResult } from './src/math.js';

function formSubmitHandler(event) {
  event.preventDefault();
  const numberValues = extractEnteredNumberValues(form);

+ const result = calculateResult(numberValues);

  // ...
}
```

#### Step 3

將產生 `resultText` 的業務抽離：

```diff
function formSubmitHandler(event) {
  event.preventDefault();
  const numberValues = extractEnteredNumberValues(form);

- let result = '';
  
- try {
-   const numbers = [];
-   for (const numberInput of numberInputs) {
-     validateStringNotEmpty(numberInput);
-     const number = transformToNumber(numberInput);
-     validateNumber(number);
-     numbers.push(number);
-   }
-   result = add(numbers).toString();
- } catch (error) {
-   result = error.message;
- }

  // ...
}
```

新建一個 `output.js` 檔案：

```js
// output.js
export function generateResultText(calculateResult) {
  let resultText = '';

  if (calculateResult === 'invalid') {
    resultText = 'Invalid input. You must enter valid numbers.';
  } else if (calculateResult !== 'no-calc') {
    resultText = 'Result: ' + calculateResult;
  }

  return resultText;
}
```

在 `app.js` 引入

```diff
+ import { generateResultText } from './src/output.js';

function formSubmitHandler(event) {
  event.preventDefault();
  const numberValues = extractEnteredNumberValues(form);

  const result = calculateResult(numberValues);
+ const resultText = generateResultText(result);

  // ...
}
```

#### Step 4

將改寫 `output` 元素中的值的業務也一併提出去

```diff
- const output = document.getElementById('result');

function formSubmitHandler(event) {
  event.preventDefault();
  const numberValues = extractEnteredNumberValues(form);

  const result = calculateResult(numberValues);
  const resultText = generateResultText(result);

- output.textContent = resultText;
}
```

放在 `output.js` 一起管理

```js
// output.js
export function outputResult(resultText) {
  const output = document.getElementById('result');
  output.textContent = resultText;
}
```

在 `app.js` 引入，現在我們就會得到一個乾淨的 `formSubmitHandler` 函式，並可以為裡面每一個 `unit` 進行測試

```js
function formSubmitHandler(event) {
  event.preventDefault();
  const numberValues = extractEnteredNumberValues(form);

  const result = calculateResult(numberValues);
  const resultText = generateResultText(result);

  outputResult(resultText);
}
```

### Testing

新建一個 `output.spec.js` 檔案去測試 `generateResultText` 的功能：

```js
import { describe, it, expect } from 'vitest';

import { generateResultText } from './output';

describe('generateResultText()', () => {
  it('should return a string, no matter which value is passed in', () => {
    const val1 = 1;
    const val2 = 'invalid';
    const val3 = false;

    const result1 = generateResultText(val1);
    const result2 = generateResultText(val2);
    const result3 = generateResultText(val3);

    expect(result1).toBeTypeOf('string');
    expect(result2).toBeTypeOf('string');
    expect(result3).toBeTypeOf('string');
  });

  it('should return a string that contains the calculation result if a number is provided as a result', () => {
    const result = 5;

    const resultText = generateResultText(result);

    expect(resultText).toContain(result.toString());
  });

  it('should return an empty string if "no-calc" is provided as a result', () => {
    const result = 'no-calc';

    const resultText = generateResultText(result);

    expect(resultText).toBe('');
  });

  it('should return a string that contains "Invalid" if "invalid" is provided as a result', () => {
    const result = 'invalid';

    const resultText = generateResultText(result);

    expect(resultText).toContain('Invalid');
  });
});
```
