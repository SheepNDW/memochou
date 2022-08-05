# Everyday Types

###### tags: `TypeScript`

參考資料: [TypeScript 新手指南](https://willh.gitbook.io/typescript-tutorial/)、[TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

[Toc]

## 常用原始型別 The primitives: string, number, and boolean

原始資料型別包括：boolean (布林值)、number (數值)、string (字串)、null、undefined 以及 ES6 中的新型別 Symbol。而其中 JS 最常見的三個原始資料型別分別是字串、數值、布林值。

設定 tsconfig.ts 檔案中的 rootDir 和 outDir 方便使用

```json
"rootDir": "./src",
"outDir": "./dist",
```

定義型別方法：在變數後方加上冒號空格然後寫上型別名稱
```typescript
let str: string = 'hello typescript';
let num: number = 100;
let bool: boolean = true;
```

## 陣列 Arrays

* 「型別 + 方括號」表示法
```typescript
let arr: number[] = [1, 2, 3];
arr = ['a'] // 類型 'string' 不可指派給類型 'number'
```

* 陣列泛型 `Array<elemType>`

```typescript
let arr2: Array<number> = [4, 5, 6];
arr = [] // 陣列是空的也是合法的
arr = ['a'] // 類型 'string' 不可指派給類型 'number'
```

## 任意值 any

任意值（Any）用來表示允許賦值為任意型別，當你不希望某個特定值導致型別檢查錯誤時可以使用它。

定義一個 obj 顯式定義為 any，此時下方所有程式碼皆不會報錯，直到執行編譯後的 JS 檔才會出現錯誤，因此除非必要，大多數情況不要使用 any。
```typescript
let obj: any = {
  x: 0,
};

obj.foo();
obj();
obj.bat = 100;
obj = 'hello';
const n: number = obj;
```

## 變數的型別註記 Type Annotations on Variables

> When you declare a variable using `const`, `var`, or `let`, you can optionally add a type annotation to explicitly specify the type of the variable
> 當你使用`const`, `var`, `let`宣告一個變數時，你可以選擇添加一個型別註記去顯式指定一個型別給該變數

```typescript
let myName: string = 'sheep';
```

:::warning
TypeScript 不使用像 int x = 0 這樣的“左側型別”風格的宣告；型別註記將始終在輸入的內容之後。
:::

但是，在大多數情況下，這不是必需的。 TypeScript 會盡可能地嘗試自動推斷程式碼中的型別。例如，變數的型別是根據其初始值的型別推斷的

```typescript
// No type annotation needed -- 'myName' inferred as type 'string'
let myName = 'sheep';
```
> 如果沒有明確的指定型別，那麼 TypeScript 會依照型別推論（Type Inference）的規則推斷出一個型別。

## 函式 Functions

一個函式會有輸入和輸出，TS 允許我們去定義它們的型別。

### 參數型別註記 Parameter Type Annotations

```typescript
// 為參數 name 定義 string 型別
function greet(name: string) {
  console.log('hello' + name.toUpperCase() + '!!');
}

greet(42) // 類型 'number' 的引數不可指派給類型 'string' 的參數
greet('sheep')
```

### 回傳值型別註記 Return Type Annotations

```typescript
function getFavoriteNumber(): number {
  return 777;
}
```

與變數型別註記很相似，通常不需要回傳型別註記，因為 TypeScript 將根據其回傳語句推斷函式的回傳型別。

### 匿名函式 Anonymous Functions

當匿名函式出現在 TypeScript 可以確定調用它的地方時，該函式的參數會自動賦予型別

```typescript
const names = ['sheep', 'lion', 'monkey'];

// TS 會自己判斷 name 為 string
names.forEach((name) => {
  console.log(name.toUpperCase());
});
```
> 即使 name 沒有寫上型別註記，TypeScript 還是使用了 forEach 函式的型別以及推斷的陣列型別來確定 name 將具有的型別。


## 物件的型別 Object Types

除了原始型別 (primitives) 之外，會遇到的最常見的型別是物件 (object) 型別。這指的是任何帶有屬性的 JavaScript 值，幾乎是所有屬性！要定義物件型別，我們只需列出其屬性及其型別。

```typescript
// The parameter's type annotation is an object type
function printCoord(pt: { x: number; y: number }) {
  console.log('座標的 x 值為:' + pt.x);
  console.log('座標的 y 值為:' + pt.y);
}

printCoord({
  x: 3,
  y: 7,
});
```

### 可選屬性 Optional Properties

有時我們希望不要完全匹配一個形狀，那麼可以用可選屬性 (`?`)

```typescript
// 在屬性名後加上一個問號，這樣 last 就可以是 string 或是 undefined
function printName(obj: { first: string; last?: string }) {
  // ...
}

// 兩個都是可行的
printName({ first: 'sheep' });
printName({ first: 'sheep', last: 'yang' });
```

在 JavaScript 中，如果你訪問一個不存在的屬性，你會得到 undefined 而不是執行時錯誤。因此，當你從可選屬性中讀取資料時，你必須在使用它之前檢查 undefined

```typescript
function printName(obj: { first: string; last?: string }) {
  // console.log(obj.last.toUpperCase()); // 物件可能為「未定義」
  
  // 方法一 if 判斷式
  if (obj.last !== undefined) {
    console.log(obj.last.toUpperCase());
  }
  
  // 方法二 optional chaining
  console.log(obj.last?.toUpperCase());
}
```

## 聯合型別 Union Types

聯合型別（Union Types）表示取值可以為多種型別中的一種。

### Defining a Union Type
聯合型別使用` | `分隔每個型別。

```typescript
// 這裡 id: number | string 的含意為: 允許 id 是字串或是數值 但不能是其他型別
function printId(id: number | string) {
  console.log('Your ID is: ' + id);
}

// ok
printId(101);
printId('202');

// 類型 '{ myID: number; }' 的引數不可指派給類型 'string | number' 的參數
printId({ myID: 12345 });
```

### Working with Union Types
當 TypeScript 不確定一個聯合型別的變數到底是哪個型別的時候，**我們只能存取此聯合型別的所有型別裡共有的屬性或方法**。

```typescript
function printId(id: number | string) {
  // console.log(id.toUpperCase()); // number 型別並不存在 toUpperCase() 方法
  if (typeof id === 'string') {
    console.log(id.toUpperCase());
  } else {
    console.log(id);
  }
}

function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // 此時 'x' 是 'string[]'
    console.log("Hello, " + x.join(" and "));
  } else {
    // 此時 'x' 是 'string'
    console.log("Welcome lone traveler " + x);
  }
}
```

有時聯合型別中的型別有著共同的方法，此時就不需要去縮小型別的範圍

```typescript
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}

console.log(getFirstThree('abcdef')); // 'abc'
console.log(getFirstThree([2, 3, 4, 5, 6])); // [2, 3, 4]
```

## 型別別名 Type Aliases

型別別名用來給一個型別起個新名字。

```typescript
type Point = {
  x: number;
  y: number;
};
// 它實際上跟之前在 object types 中寫的例子完全相等
function printCoord(pt: Point) {
  console.log('座標的 x 值為:' + pt.x);
  console.log('座標的 y 值為:' + pt.y);
}

printCoord({ x: 100, y: 200 });
```

型別別名也可以用在聯合型別中：

```typescript
type ID = number | string;

function printId(id: ID) {
  console.log(id);
}

printId(100);
printId('hello');
```

## 介面 Interfaces

在 TypeScript 中，我們使用介面（Interfaces）來定義物件的型別。

```typescript
interface ICoordPoint {
  x: number;
  y: number;
}

function printCoord(pt: ICoordPoint) {
  console.log('座標的 x 值為:' + pt.x);
  console.log('座標的 y 值為:' + pt.y);
}

printCoord({ x: 100, y: 100 });
```

### Type Aliases 和 Interfaces 的差異

> 補充閱讀：[TypeScript 介面(Interface) v.s. 型別別名(Type Alias)](https://ithelp.ithome.com.tw/articles/10224646?sc=rss.iron)、[介面的延展 X 功能與意義 - Interface Extension & Significance](https://ithelp.ithome.com.tw/articles/10215586)、[介面與型別 X 混用與比較 - TypeScript Interface V.S. Type](https://ithelp.ithome.com.tw/articles/10216626)

* 介面的擴展（Interface Extension / Inheritance）：

Interface 可以使用 extends 進行延展擴充
```typescript
interface Animal {
  name: string;
}
interface Bear extends Animal {
  honey: boolean;
}

const bear: Bear = {
  name: 'winnie',
  honey: true,
};
```

而 type 寫法則為：
```typescript
type Animal = {
  name: string;
};
type Bear = Animal & {
  honey: boolean;
};

const bear: Bear = {
  name: 'winnie',
  honey: true,
};
```

* 向現有的型別添加欄位

interface 可以被重複定義多次，而此介面最後推論結果會是所有重複定義介面的交集
```typescript
interface MyWindow {
  count: number;
}
interface MyWindow {
  title: string;
}

const w: MyWindow = {
  title: 'hello ts',
  count: 100,
};
```

而 type 不允許重複定義，型別創建後就不能再更改，只能透過` & `去擴展

```typescript
type MyWindow = {
  title: string
}
type MyWindow = {
  count: number
}
// Error: Duplicate identifier 'MyWindow'.
```

## 型別斷言 Type Assertions

型別斷言（Type Assertion）可以用來手動指定一個值的型別。

語法：<型別>值 or 值 as 型別
```typescript
// 透過 getElementById 獲取的元素 typescript 只知道是某一種 HTMLElement
// 此時就可以透過型別斷言去指定更具體的型別
const myCanvas = document.getElementById('main_canvas') as HTMLCanvasElement;
const myCanvas2 = <HTMLCanvasElement>document.getElementById('main_canvas');
```

例子：將一個聯合型別的變數指定為一個更加具體的型別
> 取自 TypeScript 新手指南型別斷言章節範例

當 TypeScript 不確定一個聯合型別的變數到底是哪個型別的時候，我們只能訪問此聯合型別的所有型別裡共有的屬性或方法
```typescript
function getLength(something: string | number): number {
  if (something.length) {
    return something.length;
  } else {
    return something.toString().length;
  }
}
// 在存取 length 時報了錯
// error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
```

此時可以使用型別斷言將 `something` 斷言成 `string`

```typescript
function getLength(something: string | number): number {
  if ((<string>something).length) {
    return (<string>something).length;
  } else {
    return something.toString().length;
  }
}
```

注意：**型別斷言不是型別轉換，斷言成一個聯合型別中不存在的型別是不允許的**

## 字面值型別 Literal Types

### 字串字面值(String Literal Types)

用來限定字串變數只能使用列舉的字串值

```typescript
function printText(s: string, alignment: 'left' | 'right' | 'center') {
  // ...
}

printText('hello', 'left');
// printText('world', 'center2'); 
// 類型 '"center2"' 的引數不可指派給類型 '"left" | "right" | "center"' 的參數
```

### 數字字面值(Numeric Literal Types)

和字串字面值類似，數字字面值可以限制變數的值為特定範圍的數字

```typescript
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

亦可結合在一起打組合拳

```typescript
interface Options {
  width: number;
}
function configure(x: Options | 'auto') {
  // ...
}

configure({ width: 100 });
configure('auto');
// configure('automatic');
// Argument of type '"automatic"' is not assignable to parameter of type 'Options | "auto"'.
```

### 布林字面值(Boolean Literal Types)

也可以定義布林值給變數，只要對掉就會報錯
```typescript
const TRUE: true  = true
const FALSE: false = false

// const TRUE: true = false // 報錯!
```

## null 和 undefined 型別

在 TypeScript 中，可以使用 null 和 undefined 來定義這兩個原始資料型別

```typescript
let u: undefined = undefined;
let n: null = null;

function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  } else {
    console.log('Hello, ' + x.toUpperCase());
  }
}
```

### 非空斷言 Non-null Assertion Operator (Postfix`!`)

如果你在非常確定值不會是 null 或 undefined 時可以使用驚嘆號去斷言它
```typescript
function liveDangerously(x?: number | null) {
  console.log(x!.toFixed());
}
```

## 列舉 Enums

```typescript
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}

console.log(Direction.Up);   // 1
console.log(Direction.Down); // 2
```

上面這段程式碼經過 TypeScript 編譯後會轉成如下：

```javascript
"use strict";
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Right"] = 4] = "Right";
})(Direction || (Direction = {}));
console.log(Direction.Up);
console.log(Direction.Down);
```

列舉成員會被賦值為從 1 開始遞增的數字，同時也會對列舉值到列舉名進行反向對映


## 不太常見的原始型別 bigint symbol

### bigint

```typescript
// Creating a bigint via the BigInt function
const oneHundred: bigint = BigInt(100);
 
// Creating a BigInt via the literal syntax
const anotherHundred: bigint = 100n;
```

### symbol

```typescript
const firstName = Symbol('name');
const secondName = Symbol('name');

if (firstName === secondName) {
  console.log('ok');
}
// This condition will always return 'false' since the types 'typeof firstName' and 'typeof secondName' have no overlap.
```


