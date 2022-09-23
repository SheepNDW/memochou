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

測試的目的是為了知道最後這個 `writeFile` 這個方法有沒有被執行，它應該要儲存 data 到一個檔案之中：

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

目前這個寫法存在一個問題，每當執行這個測試時，它都會產生副作用並在 data 資料夾下產生一個新的檔案。
