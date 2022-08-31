# Conditional Types

###### tags: `TypeScript`

參考資料: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)、[冴羽 TypeScript 系列](https://ts.yayujs.com/)

## 條件型別 Conditional Types

很多時候，我們需要基於輸入的值來決定輸出的值，同樣我們也需要基於輸入的值的型別來決定輸出的值的型別。Conditional types 就是用來幫助我們描述輸入型別和輸出型別之間的關係。

```ts
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}

// type Example1 = number
type Example1 = Dog extends Animal ? number : string;

// type Example2 = string
type Example2 = RegExp extends Animal ? number : string;
```

Conditional types 的寫法很像是 JavaScript 的條件運算式 (`condition` ? `trueExpression` : `falseExpression`)：

```ts
SomeType extends OtherType ? TrueType : FalseType;
```

條件型別 (conditional type) 在搭配泛型使用時會非常有用，以下方 `createLabel` 函式為例：

```ts
interface IdLabel {
  id: number;
}
interface NameLabel {
  name: string;
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw 'unimplemented';
}
```

這裡使用 overload 描述了 `createLabel` 是如何基於 input 的型別不同而做出不同的選擇，回傳不同的型別。這邊要注意幾點：

1. 如果一個 library 必須在其 API 中一遍又一遍地做出相同選擇，它會變得很笨重。
2. 我們在此不得不定義了三個多載：一個是處理每個明確知道的型別 (一個 `string` 一個 `number`)，另一個是處理通用情況 (`string | number`)，每當要為 `createLabel` 新增新型別，多載的數量將會倍增。

我們其實可以將邏輯寫成條件判斷：

```ts
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
```

然後就可以使用這個 conditional type 去把多載簡化為沒有多載的單個函式：

```ts
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw 'unimplemented';
}

let a = createLabel('typescript');                 
// let a: NameLabel
let b = createLabel(2.8);                          
// let b: IdLabel
let c = createLabel(Math.random() ? 'hello' : 42); 
// let c: NameLabel | IdLabel
```

### Conditional Type Constraints

一般來說，使用條件型別 (conditional type) 會提供給我們一些新的資訊，正如同我們使用 type guard 去限縮一個型別來得到一個更具體的型別，條件型別的 true 分支也會進一步限制泛型。

讓我們來看一下這個例子：

```ts
type MessageOf<T> = T['message'];
// Type '"message"' cannot be used to index type 'T'.
```

在這個例子中，TypeScript 出錯是因為不知道 `T` 有一個名為 `message` 的屬性。我們可以約束 `T`，TypeScript 將不再報錯：

```ts
// 透過 extends 確保 T 一定會有 message 屬性
// 如此 MessageOf 這個 type 的型別就是會 T 當中 message 屬性的型別
type MessageOf<T extends { message: unknown }> = T['message'];

interface Email {
  message: string;
}

type EmailMessageContent = MessageOf<Email>;
// type EmailMessageContent = string
```

但是，如果我們想要 `MessageOf` 可以傳入任何型別，但是當傳入的值沒有 message 屬性的時候，則 return 預設型別比如 never 呢？

我們可以把 constraint 拿出來然後使用條件判斷來做到這一點：

```ts
type MessageOf<T> = T extends { message: unknown } ? T['message'] : never;

interface Email {
  message: string;
}

interface Dog {
  bark(): void;
}

type EmailMessageContent = MessageOf<Email>; // string
type DogMessageContent = MessageOf<Dog>;     // never
```

在 true 分支中，TypeScript 會知道 `T` 有一個 `message` 屬性。

再舉一個例子，定義一個 type `Flatten`，將陣列型別攤平為它的元素型別，當傳入的不是陣列則直接回傳傳入值型別：

```ts
type Flatten<T> = T extends any[] ? T[number] : T;

type Str = Flatten<string[]>; // type Str = string
type Num = Flatten<number>;   // type Num = number
```

這裡使用 indexed access type 的 number 索引去取得 `string[]` 元素的型別。

## 在條件型別中推論 Inferring Within Conditional Types

conditional type 提供了 `infer` 關鍵字，可以從正在比較的型別中推論型別，然後在 `true` 分支裡引用該推論結果。我們來修改 `Flatten` 的實作，借助 `infer` 去推論元素型別，而不是使用 indexed access type 手動取得它：

```ts
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

我們在這使用了 `infer` 關鍵字宣告了一個新的型別變數 `Item`，而不是像之前在 `true` 分支裡明確地寫出如何取得 `T` 的元素型別。這使我們不必考慮如何從我們感興趣的型別結構中挖掘出需要的型別結構。

我們也可以利用 `infer` 關鍵字去寫些有用的 helper type。舉例來說，透過 `infer` 推論函式回傳的型別，並使用該型別來定義新的型別：

```ts
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>;
// type Num = number
type Str = GetReturnType<(x: string) => string>; 
// type Str = string
type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>; 
// type Bools = boolean[]
```

如果要從多個 call signature 中 (像是多載函式) 推論型別時，會按照最後的簽章進行推論，因為一般這個簽章是用來處理所有情況的簽章。

```ts
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;

type T1 = ReturnType<typeof stringOrNum>;
// type T1 = string | number
```

## 分配條件型別 Distributive Conditional Types

當 conditional type 作用在泛型時，如果傳入一個聯合型別就會變成分配的 (distributive)。

舉個例子，如果我們在 `ToArray` 傳入一個聯合型別，conditional type 就會被應用在聯合型別的每個成員上：

```ts
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;
// type StrArrOrNumArr = string[] | number[]
```

讓我們來分析一下 `StrArrOrNumArr` 裡都發生了什麼，這是我們傳入的型別：

```ts
string | number
```

接下來會去遍歷聯合中的每個成員，相當於：

```ts
ToArray<string> | ToArray<number>;
```

最後的結果就是：

```ts
string[] | number[];
```

通常這是預期的行為，如果想要避免分配發生，可以在 extends 前後的型別都加上 `[]`

```ts
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// 'StrArrOrNumArr' 不再是一個 union
type StrArrOrNumArr = ToArrayNonDist<string | number>;
// type StrArrOrNumArr = (string | number)[]
```


