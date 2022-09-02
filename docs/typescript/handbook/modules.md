---
outline: deep
---

# Modules

###### tags: `TypeScript`

參考資料: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)、[冴羽 TypeScript 系列](https://ts.yayujs.com/)

## 模組 Module

JavaScript 有很長一段不同方式處理模組化程式碼的歷史，自 2012 TypeScript 問世以來，已經實作支持很多格式。但隨著時間推移，社群和 JavaScript 規範已經融合到一種稱為 ES Modules (或是 ES6 modules) 的格式上，這也就是我們熟知的 `import/export` 語法。

ES Module 在 2015 年被添加到 JavaScript 規範中，到 2020 年，大部分的 web 瀏覽器和 JavaScript 執行環境都已經廣泛支援。

本章節將涵蓋說明 ES Module 和在它之前流行的前身 CommonJS `module.exports =` 語法，你可以在 [Modules](https://www.typescriptlang.org/docs/handbook/modules.html) 章節找到其他模組模式。

## JavaScript 模組是如何被定義的

在 TypeScript 中，就像在 ECMAScript 2015 中一樣，任何包含了頂層(top-level) `import` 或 `export` 的檔案都會被視為一個模組。

相應的，一個沒有頂層 `import` 和 `export` 宣告的檔案將被視為一個腳本，它的內容會在全域範圍內可用。

模組會在它自己的作用域，而不是在全域作用域裡執行。這意味著，在一個模組中宣告的變數、函式、類別等，對於模組之外的程式碼都是不可見的，除非它們使用一種匯出(export)形式顯式匯出。反之，要使用從不同模組匯出的變數、函式、類別等，必須使用其中一種匯入(import)形式匯入。

## 非模組 Non-modules

在開始之前，了解 TypeScript 將什麼視為模組非常重要。JavaScript 規範聲明任何沒有 `export` 或者頂層 `await` 的 JavaScript 檔案都應該被認為是一個腳本，而非一個模組。

在一個腳本檔案(script file)裡，變數和型別會被宣告在共享的全域作用域，並且假設你將使用 outFile 設定選項將多個輸入檔案合併成一個輸出檔案中，或者在 HTML 中使用多個 `<script>` 標籤來載入這些檔案 (以正確的順序)。

如果你有一個檔案，現在沒有任何 `import` 或者 `export`，但是你希望它被作為模組處理，加上這行程式碼：

```ts
export {}
```

這會將檔案改成一個沒有匯出任何內容的模組，無論這個模組的目標是什麼，這個語法都可以生效。

## TypeScript 中的模組 Modules in TypeScript

在 TypeScript 中，當寫一個基於模組的程式碼時，有三個重要的事情需要考慮：

* Syntax：我想 import 和 export 時該用什麼語法？
* Module Resolution：模組名（或路徑）和硬碟檔案之間的關係是什麼樣的？
* Module Output Target：匯出的 JavaScript 模組長什麼樣？

### ES Module Syntax

一支檔案可以通過 `export default` 宣告一個主要的匯出 (main export)：

```ts
// @filename: hello.ts
export default function helloWorld() {
  console.log('hello, world!');
}
```

匯入的方式如下：

```ts
import helloWorld from './hello';
helloWorld();
```

除了預設匯出，你也可以 `export` 語法匯出多個變數和函式：

```ts
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;

export class RandomNumberGenerator {}

export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
```

這些匯出的內容可以在別的檔案透過 `import` 語法匯入：

```ts
import { pi, phi, absolute } from './maths';

console.log(pi);
const absPhi = absolute(phi);
// const absPhi: number
```

### Additional Import Syntax

可以使用 `import { old as new }` 之類的格式重命名匯入：

```ts
import { pi as π } from './maths';

console.log(π);
// (alias) var π: number
// import π
```

你可以混合使用上面的語法，寫成一個單獨的 `import`：

```ts
// @filename: maths.ts
export const pi = 3.14;
export default class RandomNumberGenerator {}

// @filename: app.ts
import RandomNumberGenerator, { pi as π } from './maths';

RandomNumberGenerator;
// (alias) class RandomNumberGenerator
// import RandomNumberGenerator

console.log(π);
// (alias) const π: 3.14
// import π
```
