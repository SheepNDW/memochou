# Typeof Type Operator

###### tags: `TypeScript`

參考資料: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)、[冴羽 TypeScript 系列](https://ts.yayujs.com/)

## The `typeof` type operator

在 JavaScript 中有一個 `typeof` 運算子，你可以在表達式上下文 (expression context) 中使用：

```ts
console.log(typeof 'hello world'); // string
```

而在 TypeScript 添加了一個 `typeof` 運算子可以在型別上下文 (type context) 中使用，用來取得一個變數或是屬性的型別：

```ts
let s = 'hello';
let n: typeof s; // let n: string
```

如果只是用在判斷基本型別，那它並沒有多大用處，但是和其他的型別運算子 (type operator) 搭配使用時可以很方便地去表達許多模式。舉個例子來說明，使用 TypeScript 內建的 Utility Type `ReturnType<T>`，它可以接受一個參數 `T`，如果參數滿足函式型別，它就會回傳該函式的回傳值型別：

```ts
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>; // type K = boolean
```

如果我們直接對函式名稱使用 `ReturnType`，會得到以下的報錯：

```ts
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<f>;
/* 'f' 為值，但在此處卻作為類型使用。您是否是指 'typeof f'?ts(2749) */
```

請記住值(value)和型別(type)是不同的東西，要取得 `f` 的型別，需要使用 `typeof`：

```ts
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
/*
type P = {
  x: number;
  y: number;
}
*/
```

## Limitations

TypeScript 有意的限制了可以使用 `typeof` 的表達式的種類。

具體來說就是只有對識別字(比如變數)或是其屬性使用 `typeof` 是合法的，這有助於避免你誤以為你寫的程式碼正在執行，但實際上並非如此：

```ts
// Meant to use = ReturnType<typeof msgbox>
let shouldContinue: typeof msgbox('Are you sure you want to continue?');
// ',' expected.
```

本意是想獲取 `msgbox('Are you sure you want to continue?')` 的回傳值型別，所以直接使用了 `typeof msgbox('Are you sure you want to continue?')`，看似能正常執行，但實際並不會，這是因為 `typeof` 只能對識別字和屬性使用，這裡正確的寫法應為：

```ts
let shouldContinue: ReturnType<typeof msgbox>
```
