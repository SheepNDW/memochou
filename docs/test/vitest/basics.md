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


