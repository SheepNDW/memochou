# More on Functions

###### tags: `TypeScript`

參考資料: [TypeScript 新手指南](https://willh.gitbook.io/typescript-tutorial/)、[TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

[Toc]

---

函式是任何應用程式的基本構件，無論是本地的函式、從別的模組中匯入的函式又或者是來自一個類別 (class) 中的方法。它們也是 value，和其他的 value 一樣在 TypeScript 中有很多方式去描述這些函式是如何被呼叫的，讓我們開始學習如何撰寫型別去描述函式。

## Function Type Expressions

定義函式型別最簡單的方法是使用函式型別表達式 (function type expression)，這些型別在語法上很類似於箭頭函式：

```ts
function greeter(fn: (a: string) => void) {
  // (parameter) fn: (a: string) => void
  fn('hello world');
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole); // hello world
```

語法：`(a: string) => void` 

它的意思是「**一個沒有回傳值且帶有一個參數 a 型別為 string 的函式。**」另外，就像函式宣告一樣，如果這個參數沒有被指定型別，那它會預設推論為 `any`。

::: tip Note
在這裡參數的名稱是**必需**的，如果一個函式型別為 (string) => void 代表這個函式有一個型別為 any 的參數叫做 string！
:::

當然，我們也可以把它拿出去並使用 type alias 去定義函式的型別：

```ts
type GreetFunction = (a: string) => void;

function greeter(fn: GreetFunction) {
  fn('hello world');
}
```

## Call Signatures

在 JavaScript 中，函式除了可以呼叫之外也可以擁有屬性，但是在 function type expression 的語法並不准許我們宣告屬性在裡面，如果我們想要定義一些可以被呼叫的屬性，可以在一個物件型別裡撰寫呼叫簽章 (*call signature*)：

```ts
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + ' returned ' + fn(6));
}
```
::: tip Note
要注意這邊的語法和函式的型別表達式略有不同：「在參數和傳回值之間使用的是 `:` 而不是 `=>`」
:::

```ts
function fn1(n: number) {
  console.log(n);
  return true;
}

fn1.description = 'hello';

doSomething(fn1);

// 6
// hello returned true
```
