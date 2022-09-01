---
outline: deep
---

# Classes

###### tags: `TypeScript`

參考資料: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)、[冴羽 TypeScript 系列](https://ts.yayujs.com/)


## 類別 Class

TypeScript 完全支持 ES2015 中引入的 `class` 關鍵字。

和其他 JavaScript 語言特性一樣，TypeScript 提供了型別註記 (type annotation) 和其他語法，允許你表示 class 和其他型別之間的關係。

## 類別成員 Class Members

這是一個最基本的 class - 一個空類別

```ts
class Point {}
```

現在讓我們來加些新成員進去。

### 欄位 Fields

一個欄位宣告會在類別中建立一個公共(public)可寫入(writeable)的屬性：

```ts
class Point {
  x: number;
  y: number;
}

const pt = new Point();

pt.x = 0;
pt.y = 0;
```
> 型別註記是選擇性的，如果沒有指定的話會被隱式推論為 `any`

欄位也可以設定初始設定式 (initializers)，會在類別被實例化時自動執行：

```ts
class Point {
  x = 0;
  y = 0;
}

const pt = new Point();

console.log(`${pt.x}, ${pt.y}`); // 0, 0
```

就像 `const`、`let` 和 `var` 一樣，類別屬性的初始值將會被用於推論其型別：

```ts
const pt = new Point();
pt.x = '0';
// 類型 'string' 不可指派給類型 'number'。ts(2322)
```

#### --strictPropertyInitialization

[strictPropertyInitialization](https://www.typescriptlang.org/tsconfig#strictPropertyInitialization)選項控制了類別的欄位是否需要在建構函式 (constructor) 中初始化，預設為 `true`。

```ts
class BadGreeter {
  name: string;
  // 屬性 'name' 沒有初始設定式，且未在建構函式中明確指派。ts(2564)
}
```

```ts
class BadGreeter {
  name: string;

  constructor() {
    this.name = 'hello';
  }
}
```

請注意：欄位需要自己在建構函式中進行初始化。TypeScript 並不會去分析你從建構函式中去調用的方法來去判斷初始化的值，因為一個衍生類別 (derived class) 可能會覆蓋那些方法並無法初始化成員：

```ts
class BadGreeter {
  name: string;
  // 屬性 'name' 沒有初始設定式，且未在建構函式中明確指派。ts(2564)
  setName(): void {
    this.name = 'hello';
  }
  constructor() {
    this.setName();
  }
}
```

如果你打算透過建構函式以外的方式初始化一個欄位 (例如：引入第三方庫去補充類別的內容)，你可以使用明確的賦值斷言 (definite assignment assertion operator) `!`：

```ts
class OKGreeter {
  // Not initialized, but no error
  name!: string;
}
```

### `readonly`

欄位可以加一個 `readonly` 修飾符作為前綴，這可以防止對建構函式之外的欄位進行賦值。

```ts
class Greeter {
  readonly name: string = 'world';

  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }

  err() {
    this.name = 'not ok';
    // 因為 'name' 為唯讀屬性，所以無法指派至 'name'。ts(2540)
  }
}

const g = new Greeter();
g.name = 'also not ok';
// 因為 'name' 為唯讀屬性，所以無法指派至 'name'。ts(2540)
```

### 建構函式 Constructors

class 的建構函式和一般函式非常相似，你可以加上帶型別註記的參數、預設值和多載：

```ts
class Point {
  x: number;
  y: number;

  // Normal signature with defaults
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
```

```ts
class Point {
  // Overloads
  constructor(x: number, y: string);
  constructor(s: string);
  constructor(xs: any, y?: any) {
    // TBD
  }
}
```

類別的建構簽章 (constructor signature) 和函式簽章 (function signature) 之間還是有一些區別：

* 建構函式不能有參數型別 — 這些屬於外層類別的宣告，我們稍後會提到。
* 建構函式不能有[回傳值型別註記](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#return-type-annotations) — 因為總是回傳類別實例的型別。

#### Super Calls

就像在 JavaScript 中一樣，如果你有一個 base class，你需要在使用任何 `this.` 成員之前，先在建構式中呼叫 `super()`：

```ts
class Base {
  k = 4;
}

class Derived extends Base {
  constructor() {
    // Prints a wrong value in ES5; throws exception in ES6
    console.log(this.k);
    // 必須先呼叫 'super' 才能存取衍生類別中建構函式的 'this'。ts(17009)
    super();
  }
}
```

忘記呼叫 `super` 是在 JavaScript 中很容易犯的錯誤，但是 TypeScript 會在需要的時候提醒你。

### 方法 Methods

class 中的函式屬性被稱為方法 (method)，方法跟函式、建構函式一樣，使用相同的型別註記。

```ts
class Point {
  x = 10;
  y = 10;

  scale(n: number) {
    this.x = n;
    this.y = n;
  }
}
```

除了標準的型別註記，TypeScript 並沒有給方法新增任何新東西。

注意在一個方法體內，它依然必須透過 `this.` 存取欄位和其他方法。方法體內一個未限定的名稱 (unqualified name，沒有明確限定作用域的名稱) 總是指向閉包作用域裡的內容。

```ts
let x: number = 0;

class C {
  x: string = 'hello';

  m() {
    // 這個實際上是在修改第一行的 x，而不是 class 的屬性
    x = 'world'; // 類型 'string' 不可指派給類型 'number'。ts(2322)
  }
}
```

### Getters / Setters

類別也可以有存取器 (accessors)：

```ts
class C {
  _length = 0;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value;
  }
}
```

TypeScript 針對存取器也有些特別的推論規則：

* 如果 `get` 存在而 `set` 不存在，屬性會被自動設為 `readonly`
* 如果不指定 setter 參數的型別，它會從 getter 的回傳值型別去推論
* getters 和 setters 必須有相同的成員可見性 (Member Visibility)

從 TypeScript 4.3 開始，存取器在讀取和設置的時候可以使用不同型別。

```ts
class Thing {
  _size = 0;

  get size(): number {
    return this._size;
  }

  set size(value: string | number | boolean) {
    let num = Number(value);

    // Don't allow NaN, Infinity, etc

    if (!Number.isFinite(num)) {
      this._size = 0;
      return;
    }

    this._size = num;
  }
}
```

###  索引簽章 Index Signatures

類別可以宣告索引簽章，它和物件型別的索引簽章是一樣的：

```ts
class MyClass {
  [s: string]: boolean | ((s: string) => boolean);

  check(s: string) {
    return this[s] as boolean;
  }
}
```

因為索引簽章型別還需要抓取方法的型別，所以要有效地使用這些型別並不容易。通常最好將索引資料存在另外一個地方而不是類別實例本身。

## 類別的繼承 Class Heritage

和其他具有物件導向特性的語言一樣，JavaScript 的類別可以從基底類別繼承而來。

### `implements` Clauses

你可以使用 `implements` 子句來檢查類別是否滿足特定 `interface`。如果一個類別未能正確實作它，將會報錯：

```ts
interface Pingable {
  ping(): void;
}

class Sonar implements Pingable {
  ping() {
    console.log('ping!');
  }
}

class Ball implements Pingable {
/*
類別 'Ball' 不正確地實作介面 'Pingable'。
  類型 'Ball' 缺少屬性 'ping'，但類型 'Pingable' 必須有該屬性。ts(2420)
*/
  pong() {
    console.log('pong!');
  }
}
```

class 也可以實作多個 interface，例如: `class C implements A, B {`

#### 注意事項

`implements` 子句僅僅是檢查類別是否按照介面型別實作，但它不會改變類別的型別或者方法的型別。一個常見錯誤就是以為 `implements` 子句會改變類別的型別，然而實際上它並不會：

```ts
interface Checkable {
  check(name: string): boolean;
}

class NameChecker implements Checkable {
  check(s) { /* 參數 's' 隱含了 'any' 類型。ts(7006) */
  
    // 注意在這裡沒有抱錯
    return s.toLowercse() === 'ok';
            // any
  }
}
```

在這個例子裡，我們可能預期 `s` 的型別會受到 `name: string` 參數所影響，實際並沒有，`implements` 子句並不會影響 class 內部是如何檢查或型別推論的。

同樣地，實作一個有可選屬性的介面，並不會建立這個屬性：

```ts
interface A {
  x: number;
  y?: number;
}
class C implements A {
  x = 10;
}
const c = new C();
c.y = 10;
// 類型 'C' 沒有屬性 'y'。ts(2339)
```

### `extends` Clauses

類別可以使用 `extends` 關鍵字實現繼承，一個衍生類別有基底類別所有的屬性和方法，還可以定義額外的成員。

```ts
class Animal {
  move() {
    console.log('Moving along!');
  }
}

class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i < times; i++) {
      console.log('woof!');
    }
  }
}

const d = new Dog();
// Base class method
d.move();
// Derived class method
d.woof(3);
```

#### Overriding Methods

一個衍生類別可以覆寫一個基底類別的欄位或是屬性。你可以使用 `super.` 語法去存取基底類別的方法。

TypeScript 強制要求衍生類別總是它的基底類別的子類型 (subtype)。

舉個例子，這是一個合法的覆寫方式：

```ts
class Base {
  greet() {
    console.log('Hello, world!');
  }
}

class Derived extends Base {
  greet(name?: string) {
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}

const d = new Derived();
d.greet();         // Hello, world!
d.greet('reader'); // Hello, READER
```

衍生類別要遵循其基底類別的約定，而且通過一個基底類別引用指向一個衍生類別的實例是非常常見且和合法的：

```ts
// Alias the derived instance through a base class reference
const b: Base = d;
// No problem
b.greet();
```

但如果 `Derived` 不遵循 `Base` 的約定呢？

```ts
class Derived extends Base {
  // 讓參數為必填
  greet(name: string) {
  /*
  類型 'Derived' 中的屬性 'greet' 無法指派給基底類型 'Base' 中的相同屬性。
    類型 '(name: string) => void' 不可指派給類型 '() => void'。ts(2416)
  */
    console.log(`Hello, ${name.toUpperCase()}`);
  }
}
```

即使忽略錯誤去編譯它，它在執行時也會崩潰

```ts
const b: Base = new Derived();
// Crashes because "name" will be undefined
b.greet();
```

#### Type-only Field Declarations

當 `target >= ES2022` 或是 useDefineForClassFields 設為 `true` 時，類別欄位在父類別建構函式完成後進行初始化，覆蓋父類別設置的任何值。當你只想為繼承的欄位重新宣告更準確的型別時，這可能會成為問題。為了處理這些情況，你可以寫 `declare` 向 TypeScript 表示這個欄位宣告不應該有執行時的影響。

```ts
interface Animal {
  dateOfBirth: any;
}

interface Dog extends Animal {
  breed: any;
}

class AnimalHouse {
  resident: Animal;
  constructor(animal: Animal) {
    this.resident = animal;
  }
}

class DogHouse extends AnimalHouse {
  // Does not emit JavaScript code,
  // only ensures the types are correct
  declare resident: Dog;
  constructor(dog: Dog) {
    super(dog);
  }
}
```

#### Initialization Order

有些情況下，JavaScript 類別初始化的順序會讓你感到很奇怪，讓我們看這個例子：

```ts
class Base {
  name = 'base';
  constructor() {
    console.log('My name is ' + this.name);
  }
}

class Derived extends Base {
  name = 'derived';
}

// Prints "base", not "derived"
const d = new Derived(); // My name is base
```

這邊發生了什麼了？

類別初始化的順序就像在 JavaScript 中定義的那樣：

* 基底類別欄位初始化
* 基底類別建構函式執行
* 衍生類別欄位初始化
* 衍生類別建構函式執行

這意味著基底類別建構函式只能看到它自己的 `name` 的值，因為此時衍生類別的欄位還沒有初始化。

#### Inheriting Built-in Types

::: info 
如果你不打算繼承 Array、Error、Map 等內置型別，或是你的編譯目標明確設置為 ES6/ES2015 或更高版本，可以跳過本節
:::

在 ES2015 中，當調用 `super(...)` 的時候，如果構造函數返回了一個對象，會隱式替換 `this` 的值。所以捕獲 `super()` 可能的回傳值並用 `this` 替換它是非常有必要的。

這就導致，像 `Error`、`Array` 等子類別，也許不會再如你期望的那樣運行。這是因為 `Error`、`Array` 等類似內置物件的建構函式，會使用ECMAScript 6 的 `new.target` 調整原型鏈。然而，在ECMAScript 5 中，當調用一個建構函式的時候，並沒有方法可以確保 `new.target` 的值。其他的降級編譯器預設也會有同樣的限制。

像下面這樣一個子類別 (subclass)：

```ts
class MsgError extends Error {
  constructor(m: string) {
    super(m);
  }
  sayHello() {
    return 'hello' + this.message;
  }
}
```

你可能會發現到：

* 物件的方法可能是 `undefined`，所以呼叫 `sayHello` 會導致錯誤
* `instanceof` 失效，`(new MsgError()) instanceof MsgError` 會 return `false`

我們推薦，手動的在 super(...) 調用後調整原型：

```ts
class MsgError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, MsgError.prototype);
  }

  sayHello() {
    return 'hello ' + this.message;
  }
}
```

不過，任何 `MsgError` 的子類別也不得不手動設置原型。如果執行時不支持 `Object.setPrototypeOf`，你也許可以使用 `__proto__`。

不幸的是，這些方案並不會能在 IE 10 或者之前的版本正常執行。解決的一個方法是手動拷貝原型中的方法到實例中（就比如 `MsgError.prototype` 到 `this`），但是它自己的原型鏈依然沒有被修復。

## 成員可見性 Member Visibility

TypeScript 可以使用三種存取修飾符（Access Modifiers），分別是 `public`、`private` 和 `protected`。可以用來控制某些方法或屬性是否能被類別外部的程式碼讀取。

### `public`

類別成員預設可見性為 `public`，`public` 修飾的屬性或方法是公有的，可以在任何地方被存取到：

```ts
class Greeter {
  public greet() {
    console.log('hi!');
  }
}
const g = new Greeter();
g.greet();
```

因為 `public` 是預設的存取修飾符，所以你不需要寫它，除非處於格式或者可讀性的原因。

### `protected`

`protected` 修飾的屬性或方法是受保護的，它和 `private` 類似，區別是它在子類別中也是允許被存取的。

```ts
class Greeter {
  public greet() {
    console.log('hello, ' + this.getName());
  }
  protected getName() {
    return 'hi!';
  }
}

class SpecialGreeter extends Greeter {
  public howdy() {
    console.log('Howdy, ' + this.getName());
  }
}

const g = new SpecialGreeter();
g.greet();
g.getName();
// 'getName' 是受保護屬性，只可從類別 'Greeter' 及其子類別中存取。ts(2445)
```

#### 受保護成員的公開 Exposure of protected members

衍生類別需要遵循基底類別的實作，但可以選擇公開具有更多能力的基底類別的子類型，這就包括讓一個 `protected` 成員變成 `public`：

```ts
class Base {
  protected m = 10;
}
class Derived extends Base {
  // No modifier, so default is 'public'
  m = 15;
}
const d = new Derived();
console.log(d.m); // 15
```
> 現在 `Derived` 已經能夠自由讀寫這個 `m`

這裡要注意的是，在衍生類別中，如果這種暴露不是故意的，我們需要細心地去拷貝 `protected` 修飾符。
