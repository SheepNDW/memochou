---
outline: deep
---

# `infer` keyword

> [Inferring Within Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)

在 Conditional Types 使用 `infer`，可以從正在比較的型別中推論型別，然後在 true 分支裡引用該推論結果。

## 範例：

### 基本使用

- 定義一個型別，如果傳入為陣列型別就回傳陣列元素的型別，否則傳入什麼型別就回傳什麼型別

```ts twoslash
type Infer<T> = T extends Array<any> ? T[number] : T;

type A = Infer<(string | number)[]>;

type B = Infer<boolean>;
```


使用 `infer` 改寫：

```ts twoslash
type Infer<T> = T extends Array<infer U> ? U : T;

type A = Infer<(string | symbol)[]>;
//   ^? 
/* type A = string | symbol */
```

- 將 tuple 轉成 union

```ts twoslash
type TupleToUni<T> = T extends Array<infer E> ? E : never;

type SomeTuple = [string, number];

type ToUnion = TupleToUni<SomeTuple>;
//    ^?
/* type ToUnion = string | number */
```

### 提取型別

- 提取首個元素

```ts twoslash
type Arr = ['a', 'b', 'c'];

type First<T extends any[]> = T extends [infer First, ...any[]] ? First : [];

type a = First<Arr>;
/* type a = "a" */
```

> 將 `T` 透過 `extends` 限制成陣列型別，再使用 `infer` 宣告一個 `first` 變數來提取，剩下的元素就讓它是一個任意型別，最後再將這個變數 `first` 回傳出去。

- 提取最後一個元素

```ts twoslash
type Arr = ['a', 'b', 'c'];

type Last<T extends any[]> = T extends [...any[], infer Last] ? Last : [];

type c = Last<Arr>;
/* type c = "c" */
```

- 去掉第一個元素 (shift)

```ts twoslash
type Arr = ['a', 'b', 'c'];

type Shift<T extends any[]> = T extends [unknown, ...infer Rest] ? Rest : [];

type Rest = Shift<Arr>;
/* type Rest = ["b", "c"] */
```

> 把第一個元素之外的剩餘元素宣告成變數並回傳

- 去除最後一個元素 (pop)

```ts twoslash
type Arr = ['a', 'b', 'c'];

type Pop<T extends any[]> = T extends [...infer Rest, unknown] ? Rest : [];

type Rest = Pop<Arr>;
/* type Rest = ["a", "b"] */
```

> 把 shift 的方法反過來做就好了

### 遞迴

現在有一個陣列型別為：

```ts
type Arr = [1, 2, 3, 4];
```

希望可以透過一個 utility type 去把它變成：

```ts
type Arr = [4, 3, 2, 1];
```

- 實作：

```ts twoslash
type Arr = [1, 2, 3, 4];

type Reverse<T extends any[]> = T extends [infer First, ...infer Rest]
  ? [...Reverse<Rest>, First]
  : T;

type ReverseArr = Reverse<Arr>;
/* type ReverseArr = [4, 3, 2, 1] */
```

> 一樣先透過泛型限制讓 `T` 只能是陣列型別，然後將陣列的首個元素提出並放入新陣列的尾巴，反覆此操作形成一個遞迴，滿足條件後則結束條件並回傳新的型別。
