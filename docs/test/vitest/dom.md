# Testing & The DOM (Frontend JavaScript Testing)

[JavaScript Unit Testing - The Practical Guide](https://www.udemy.com/course/javascript-unit-testing-the-practical-guide/) 課程筆記

## Virtual HTML Page

測試一個 `showError` 函式如下：

```js
export function showError(message) {
  const errorContainerElement = document.getElementById('errors');
  const errorMessageElement = document.createElement('p');
  errorMessageElement.textContent = message;
  errorContainerElement.innerHTML = '';
  errorContainerElement.append(errorMessageElement);
}
```

這個函式被執行時會對瀏覽器中的元素進行操作，vitest 的預設執行環境為 node，但是 node 中沒有瀏覽器的方法，可以使用 `JSDOM` 或是 `Happy DOM` 去模擬環境，課程中用的範例是 `Happy DOM`。

首先在腳本指令中新增這一段：

```json {4}
// package.json
"scripts": {
  "start": "http-server -c-1",
  "test": "vitest --run --environment happy-dom"
}
```

使用 Happy DOM 提供的方法來模擬一個 HTML 頁面：

```js
import fs from 'fs';
import path from 'path';

import { beforeEach, expect, it, vi } from 'vitest';
import { Window } from 'happy-dom';

import { showError } from './dom';

const htmlDocPath = path.join(process.cwd(), 'index.html');
const htmlDocumentContent = fs.readFileSync(htmlDocPath).toString();

const window = new Window();
const document = window.document;

// https://github.com/capricorn86/happy-dom/tree/master/packages/happy-dom#vm-context
window.location.href = 'http://localhost:8080';

vi.stubGlobal('document', document);

beforeEach(() => {
  // 清空並初始化 document
  document.body.innerHTML = '';
  document.write(htmlDocumentContent);
});

it('should add an error paragraph to the id="errors" element', () => {
  showError('Test');

  const errorsEl = document.getElementById('errors');
  const errorParagraph = errorsEl.firstElementChild;

  expect(errorParagraph).not.toBeNull();
});

it('should not contain an error paragraph initially', () => {
  const errorsEl = document.getElementById('errors');
  const errorParagraph = errorsEl.firstElementChild;

  expect(errorParagraph).toBeNull();
});

it('should output the provided message in the error paragraph', () => {
  const testErrorMessage = 'Test';

  showError(testErrorMessage);

  const errorsEl = document.getElementById('errors');
  const errorParagraph = errorsEl.firstElementChild;

  expect(errorParagraph.textContent).toBe(testErrorMessage);
});
```
