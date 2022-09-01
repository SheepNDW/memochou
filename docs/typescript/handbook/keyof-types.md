# Keyof Type Operator

###### tags: `TypeScript`

參考資料: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)、[冴羽 TypeScript 系列](https://ts.yayujs.com/)

## The `keyof` type operator

對一個物件型別使用 `keyof` 型別運算子，會回傳由物件的 key 值組成的字串或數值字面值的聯合 (union)，在下面的例子中，P 的型別就等同於 "x" | "y"：

```ts
type Point = { x: number; y: number };
type P = keyof Point;
/* type P = keyof Point */
```

如果這個型別有 `string` 或是 `number` 的索引簽章，`keyof` 會直接回傳這些型別：

```ts
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
/* type A = number */

type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
/* type M = string | number */
```

這裡要注意的是，在這個例子裡 `M` 的型別為 `string | number`，這是因為在 JavaScript 中物件的 key 值會被強制轉型成 string，所以 `obj[0]` 和 `obj['0']` 是相同的。


(註：原文到這就結束了，以下引用自冴羽大大在他的 TS 系列文章的補充)

## 數值字面值聯合型別

前面也提到過 `keyof` 可能回傳一個數值字面值 (numeric literal) 的聯合型別，那究竟什麼時候會回傳它呢，可以試著撰寫這樣一個物件：

```ts
const NumericObject = {
  [1]: '梓一號',
  [2]: '梓二號',
  [3]: '梓三號',
};

type result = keyof typeof NumericObject;

/*
NumericObject 的 type 為:
{
  1: string;
  2: string;
  3: string;
}
所以這個 result 的型別最後就是:
type result = 1 | 2 | 3
*/
```

## Symbol

TypeScript 亦支持 symbol 型別的屬性名：

```ts
const sym1 = Symbol();
const sym2 = Symbol();
const sym3 = Symbol();

const symbolToNumberMap = {
  [sym1]: 1,
  [sym2]: 2,
  [sym3]: 3,
};

type KS = keyof typeof symbolToNumberMap;
/* type KS = typeof sym1 | typeof sym2 | typeof sym3 */
```

這也是為什麼在泛型中寫出像下面這個例子的程式碼會報錯：

```ts
function useKey<T, K extends keyof T>(obj: T, key: K) {
  let name: string = key;
  /*
  類型 'string | number | symbol' 不可指派給類型 'string'。
    類型 'number' 不可指派給類型 'string'。ts(2322)
  */
}
```

如果今天很確定只使用字串型別的屬性名，你可以這樣寫：

```ts
function useKey<T, K extends Extract<keyof T, string>>(obj: T, key: K) {
  let name: string = key; // OK
}
```

而如果要處理所有的屬性名，可以這樣寫：

```ts
function useKey<T, K extends keyof T>(obj: T, key: K) {
  let name: string | number | symbol = key;
}
```

## 類別和介面

對類別使用 `keyof`：

```ts
class Person {
  name: 'Sheep';
}

type result = keyof Person;
/* type result = "name" */
```

```ts
class Person {
  [1]: string = 'sheep';
}

type result = keyof Person;
/* type result = 1 */
```

對介面使用 `keyof`：

```ts
interface Person {
  name: string;
}

type result = keyof Person;
/* type result = "name" */
```

## 實戰

在前一節[泛型](/typescript/handbook/generics.html#using-type-parameters-in-generic-constraints)裡就寫到了一個 `keyof` 的應用： 

> 我們想要從一個物件中拿到給定屬性名的值，我們必須確保我們不會意外抓取物件上不存在的屬性，因此我們要在這兩種型別中放置一個限制：

```ts {1}
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, 'a');
```