---
outline: deep
---

# Mocking & Spies: Dealing with Side Effects

[JavaScript Unit Testing - The Practical Guide](https://www.udemy.com/course/javascript-unit-testing-the-practical-guide/) 課程筆記

## Mocking & Spies

如果今天要測試一個 `writeData` 函式如下：

```js
// path, fs 為 node 內建的模組
import path from 'path';
import { promises as fs } from 'fs';

export default function writeData(data, filename) {
  const storagePath = path.join(process.cwd(), 'data', filename);
  return fs.writeFile(storagePath, data);
}
```

測試的目的是為了知道最後這個 `writeFile` 這個方法有沒有被執行：

```js
import { it, expect, vi } from 'vitest';
import { promises as fs } from 'fs';

import writeData from './io';

it('should execute the writeFile method', () => {
  const testData = 'Test';
  const textFilename = 'text.txt';

  return expect(writeData(testData, textFilename)).resolves.toBeUndefined();
});
```

目前這個寫法存在一個問題，每當執行這個測試時，它都會產生在 data 資料夾下產生一個新的檔案的副作用。
在撰寫測試時應該避免這些會和外部產生互動的副作用 (例如 http 請求)，我們實際要關心的是這個函式有沒有正確被執行，而裡面的 `writeFile` 能不能正確執行則為 nodeJS 的責任，不需要去對它的執行結果進行測試。

為了去除這些副作用，可以使用兩個測試替身 `spy` 或是 `mock` 去達成：

* Spy： 用在你只是想知道函式是否有被執行，但不在乎它究竟做了什麼。

* Mock：替代可能提供某些特定於測試的行為的 API。

### Working with Spies

測試一個 `generateReportData` 函式如下：

```js
export function generateReportData(logFn) {
  const data = 'Some dummy data for this demo app';
  if (logFn) {
    logFn(data);
  }

  return data;
}
```

使用 `vi` 物件來替換掉會有副作用的 `logFn`，因為這裡只關心它有沒有被正確的呼叫而已：

```js
import { describe, it, expect, vi } from 'vitest';
import { generateReportData } from './data';

describe('generateReportData()', () => {
  it('should execute logFn if provided', () => {
    const logger = vi.fn();

    generateReportData(logger);

    expect(logger).toBeCalled();
  });
});
```

### Getting started with Mocks

回到一開始的 `writeData`，我們這裡並不希望實際去呼叫原生的 `writeFile` 方法，它只需要在生產模式下才需要真正地去執行它的功能，但是在測試時並不會，我們只是想要知道它有沒有被呼叫而已。

```js
export default function writeData(data, filename) {
  const storagePath = path.join(process.cwd(), 'data', filename);
  return fs.writeFile(storagePath, data);
}
```

乍看之下這個情境很適合 `spy`，我們可以用 `spy` 去替換掉它，然後只要判斷它是否被呼叫即可，但實際上在這裡無法做到，因為 `fs` 裡面擁有一些我們沒有的模組。

此時就可以使用 mock 去定義它的模組方法：

```js
vi.mock('fs');

it('should execute the writeFile method', () => {
  const testData = 'Test';
  const textFilename = 'text.txt';

  return expect(writeData(testData, textFilename)).resolves.toBeUndefined();
})
```

此時雖然會報錯說 `Cannot read properties of undefined (reading 'then')`，但是已經不會生成新的檔案了，代表測試此時不會走原生的 `writeFile` 方法。

接著可以像在原始實作時一樣，將 promises 引入：

```js
import { promises as fs } from 'fs';

it('should execute the writeFile method', () => {
  const testData = 'Test';
  const textFilename = 'text.txt';

  writeData(testData, textFilename);

  // return expect(writeData(testData, textFilename)).resolves.toBeUndefined();
  expect(fs.writeFile).toBeCalled();
});
```

此時再跑測試就會通過了。


### Custom Mocking

寫完了 writeFile 的 mock 替身，接著再來測檔名 `storagePath`

```js
import path from 'path';
import { promises as fs } from 'fs';

export default function writeData(data, filename) {
  const storagePath = path.join(process.cwd(), 'data', filename);
  return fs.writeFile(storagePath, data);
}
```

自訂一個 Mock 替身並手動寫邏輯告訴它裡面有一個 join 模組

```js
vi.mock('path', () => {
  return {
    // 如果是預設匯出的引入要用一個 default 當作 key
    // 如果是具名匯出的引入則用該名稱當作 key
    default: {
      join: (...args) => {
        return args[args.length - 1];
      },
    },
  };
});

it('should execute the writeFile method', () => {
  const testData = 'Test';
  const textFilename = 'text.txt';

  writeData(testData, textFilename);

  // 這樣就可以具體寫出 writeFile 被呼叫時所傳入的參數
  expect(fs.writeFile).toBeCalledWith(textFilename, testData);
});
```

### `__mocks__` 資料夾

在這個資料夾下的檔案如果有對應的模組名稱的檔案，vitest 在執行 mock 測試時會去檢查是否有相同的 mock 可以呼叫。

```js
// __mocks__/fs.js
import { vi } from 'vitest';

export const promises = {
  writeFile: vi.fn((path, data) => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }),
};
```
