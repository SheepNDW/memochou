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


#### 跨層級的受保護成員存取 Cross-hierarchy protected access

不同的 OOP 語言對於通過基底類別引用存取受保護成員是否合法存在分歧：

```ts
class Base {
  protected x: number = 1;
}
class Derived1 extends Base {
  protected x: number = 5;
}
class Derived2 extends Base {
  f1(other: Derived2) {
    other.x = 10;
  }
  f2(other: Base) {
    other.x = 10;
/* 屬性 'x' 已受到保護，只能透過類別 'Derived2' 的執行個體加以存取。這是類別 'Base' 的執行個體。ts(2446) */
  }
}
```

在 Java 中這是合法的，而 C# 和 C++ 認為這段程式碼是不合法的。

TypeScript 站在 C# 和 C++ 這邊。因為 `Derived2` 的 `x` 應該只有從 `Derived2` 的子類別訪問才是合法的，而 `Derived1` 並不是它們中的一個。此外，如果通過 `Derived1` 引用存取 `x` 是不合法的，通過一個基底類別引用存取也應該是不合法的。


### `private`

`private` 和 `protected` 類似，區別在它修飾的屬性或方法是私有的，不能在宣告它的類別的外部存取，即便是子類別。

```ts
class Base {
  private x = 0;
}
const b = new Base();
// 無法從類別外部存取
console.log(b.x);
// 'x' 是私用屬性，只可從類別 'Base' 中存取。ts(2341)

class Derived extends Base {
  showX() {
    // 也無法從子類別裡存取
    console.log(this.x);
    // x' 是私用屬性，只可從類別 'Base' 中存取。ts(2341)
  }
}
```

因為 `private` 修飾的成員對於衍生類別來說是不可見的，所以衍生類別也不能增加其可見性：

```ts
class Base {
  private x = 0;
}
class Derived extends Base {
/*
類別 'Derived' 不正確地擴充基底類別 'Base'。
  在類型 'Base' 中，'x' 是私用屬性，但在類型 'Derived' 中不是。ts(2415)
*/
  x = 1;
}
```

#### 跨實例私有成員存取 Cross-instance private access

不同的 OOP 語言在關於一個類的不同實例是否可以獲取彼此的 `private` 成員上，也是不一致的。像 Java、C#、C++、Swift 和 PHP 都是允許的，Ruby 是不允許。

TypeScript 允許跨實例私有成員的獲取：

```ts
class A {
  private x = 10;

  public sameAs(other: A) {
    // No error
    return other.x === this.x;
  }
}
```

#### 注意事項

和其他 TypeScript 型別系統一樣，`private` 和 `protected` 只會在型別檢查的時候強制生效。

這意味著在 JavaScript 執行時，像 `in` 或者簡單的屬性查找，依然可以取得 `private` 或 `protected` 成員：


```ts
class MySafe {
  private secretKey = 12345;
}
```

```js
// 在編譯後的 JS 檔案中實測
class MySafe {
  constructor() {
    this.secretKey = 12345;
  }
}

const s = new MySafe();
console.log(s.secretKey); // 可以打印出 12345
```

`private` 還允許在型別檢查時通過中括號進行存取。這讓比如單元測試的時候，更容易存取 `private` 欄位，也讓這些欄位是弱私有 (soft private) 而不是嚴格的強制私有。

```ts
class MySafe {
  private secretKey = 12345;
}

const s = new MySafe();

// Not allowed during type checking
console.log(s.secretKey);
// 'secretKey' 是私用屬性，只可從類別 'MySafe' 中存取。ts(2341)

// OK
console.log(s['secretKey']);
```

有別於 TypeScript 的 `private`，JavaScript 的私有欄位 (`#`) 即便經過編譯仍然保留私有性，並且不會提供像上面中括號的存取方式，這讓他們變成強私有 (hard private)。

```ts
class Dog {
  #barkAmount = 0;
  personality = 'happy';

  constructor() {}
}
```

```js
"use strict";
class Dog {
  #barkAmount = 0;
  personality = 'happy';
  constructor() { }
}
```

當被編譯成 ES2021 或者之前的版本，TypeScript 會使用 WeakMaps 替代 `#`:

```js
"use strict";
var _Dog_barkAmount;
class Dog {
    constructor() {
        _Dog_barkAmount.set(this, 0);
        this.personality = 'happy';
    }
}
_Dog_barkAmount = new WeakMap();
```

如果你需要防止惡意攻擊，保護類別中的值，你應該使用強私有的機制比如閉包，WeakMaps，或者私有欄位。但是注意，這也會在執行時影響效能。

## 靜態成員 Static Members

類別可以用 `static` 定義一個靜態的成員，靜態成員和實例沒有關係，可以通過類別本身存取到：

```ts
class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}

console.log(MyClass.x);
MyClass.printX();
```

靜態成員同樣可以使用 `public` `protected` 和 `private` 這些修飾符：

```ts
class MyClass {
  private static x = 0;
}
console.log(MyClass.x);
// 'x' 是私用屬性，只可從類別 'MyClass' 中存取。ts(2341)
```

靜態成員也可以被繼承：

```ts
class Base {
  static getGreeting() {
    return 'hello world';
  }
}
class Derived extends Base {
  myGreeting = Derived.getGreeting();
}
```

### Special Static Names

從 `Function` 原型覆蓋屬性通常是不安全的，因為類別本身就是可以用 new 調用的函式，所以不能使用一些固定的靜態名稱，函式屬性像 `name`、`length`、`call` 不能被用來定義 `static` 成員：

```ts
class S {
  static name = 'S!';
}
// 靜態屬性 'name' 與建構函式 'S' 的內建屬性 'Function.name' 相衝突。ts(2699)
```

### Why No Static Classes?

TypeScript（和 JavaScript） 並沒有名為靜態類別（static class）的結構，但是像 C# 和 Java 有。

所謂的 static class 指的是作為 class 的靜態成員存在於某個 class 內部的 class，比如這種：

```java
// java
public class OuterClass {
  private static String a = "1";
	static class InnerClass {
  	private int b = 2;
  }
}
```

static class 之所以存在是因為這些語言強迫所有的資料和函式都要在一個類別內部，但這個限制在 TypeScript 中並不存在，所以也沒有 static class 的需要。一個只有一個單獨實例的類別，在 JavaScript/TypeScript 中完全可以使用普通物件替代。

舉例來說，我們不需要一個 static class 語法，因為 TypeScript 中一個常規物件 (或頂級函式) 可以實現一樣的功能：

```ts
// Unnecessary "static" class
class MyStaticClass {
  static doSomething() {}
}

// Preferred (alternative 1)
function doSomething() {}

// Preferred (alternative 2)
const MyHelperObject = {
  doSomething() {},
};
```

## `static` Blocks in Classes

Static block 允許你寫一系列有自己作用域的語句，也可以獲取類別裡的私有欄位。這意味著我們可以安心的寫初始化程式碼：正常書寫語句，無變數洩漏，還可以完全獲取類別中的屬性和方法。

```ts
class Foo {
  static #count = 0;

  get count() {
    return Foo.#count;
  }

  static {
    try {
      const lastInstances = {
        length: 100,
      };
      // OK
      Foo.#count += lastInstances.length;
    } 
    catch {}
  }
}

// 不能在類別外部存取
Foo.#count;
// 因為屬性 '#count' 具有私人識別碼，所以無法在類別 'Foo' 外存取該屬性。ts(18013)
```

## 泛型類別 Generic Classes

和 interface 一樣，class 也可以寫泛型。當使用 `new` 實例化一個泛型 class，它的參數型別的推論跟函式呼叫是同樣的方式：

```ts
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}

const b = new Box('hello!');
// const b: Box<string>

const n = new Box<number>(123);
// const n: Box<number>
```

class 也可以跟 interface 一樣使用泛型限制和預設值。

### 靜態成員的參數型別 Type Parameters in Static Members

下面這段程式碼並不合法，但是原因可能沒有那麼明顯：

```ts
class Box<Type> {
  static defaultValue: Type;
  // 靜態成員不得參考類別類型參數。ts(2302)
}
```

記住型別最後會被完全抹除，執行時只有一個 `Box.defaultValue` 屬性槽。這也意味著如果設置 `Box<string>.defaultValue` 是可以的話，也會改變 `Box<number>.defaultValue`，這樣並不好。

所以泛型類別的靜態成員不應該引用類別的參數型別。

## `this` at Runtime in Classes

TypeScript 並不會更改 JavaScript 執行時的行為，並且 JavaScript 有時會出現一些奇怪的運行時行為。

比如 JavaScript 處理 `this` 就很奇怪：

```ts
class MyClass {
  name = 'MyClass';
  getName() {
    return this.name;
  }
}
const c = new MyClass();
const obj = {
  name: 'obj',
  getName: c.getName,
};

// Prints "obj", not "MyClass"
console.log(obj.getName());
```

預設情況下，函式中 `this` 的值取決於函式的呼叫方式。在這個例子中，因為函式是通過 `obj` 引用呼叫的，所以它的 `this` 是 `obj` 而不是 class 實例。

而這顯然不是你所期待的。TypeScript 提供了一些方式緩解或阻止這種錯誤。

### 箭頭函式

如果你有一個函式經常在被呼叫的時候遺失 `this` 上下文，使用箭頭函式也許比較好：

```ts
class MyClass {
  name = 'MyClass';
  getName = () => {
    return this.name;
  };
}
const c = new MyClass();
const g = c.getName;
// Prints "MyClass" instead of crashing
console.log(g());
```

這裡有一些權衡：

* `this` 的值保證在執行是正確的，即使沒用 TypeScript 檢查的程式碼也是如此
* 這會使用更多的記憶體，因為每一個類別實例都會複製一次這個函式
* 你不能在衍生類別使用 `super.getName`，因為在原型鍊中並沒有入口可以從中取得基底類別方法

### `this` 參數

在方法或函式定義中，名為 `this` 的初始 (第一個) 參數在 TypeScript 中具有特殊含義。該參數會在編譯期間被抹除：

```ts
// TypeScript input with 'this' parameter
function fn(this: SomeType, x: number) {
  /* ... */
}
```

```js
// JavaScript output
function fn(x) {
  /* ... */
}
```

TypeScript 會檢查是否使用正確的上下文呼叫帶有 `this` 參數的函式。不像上一個使用箭頭函式的例子，我們可以給方法定義一個 `this` 參數，靜態強制方法被正確呼叫：

```ts
class MyClass {
  name = 'MyClass';
  getName(this: MyClass) {
    return this.name;
  }
}

const c = new MyClass();
console.log(c.getName()); // 'MyClass'

const g = c.getName;
console.log(g());
// 類型 'void' 的 'this' 內容無法指派給方法之類型 'MyClass' 的 'this'。ts(2684)
```

這個方法也有一些和箭頭函式剛好相反的權衡：

* JavaScript 調用者依然可能在沒有注意到的時候不正確地使用類別方法
* 每個類別定義只分配一個函式，而不是每個類別實例一個
* 基底類別方法定義依然可以通過 `super` 呼叫


## `this` 型別

在類別中有一個特殊型別叫做 `this`，會動態引用當前類別的型別，讓我們看下它的用法：

```ts
class Box {
  contents: string = '';
  // (method) Box.set(value: string): this
  set(value: string) {
    this.contents = value;
    return this;
  }
}
```

在這裡 TypeScript 推論 `set` 的回傳值型別是 `this`，而不是 `Box`。現在讓我們來建立一個 `Box` 的子類別：

```ts
class ClearableBox extends Box {
  clear() {
    this.contents = '';
  }
}

const a = new ClearableBox();
const b = a.set('hello');
// const b: ClearableBox

console.log(b); // ClearableBox { contents: 'hello' }
```

你也可以在參數型別註記中使用 `this`：

```ts
class Box {
  content: string = '';
  sameAs(other: this) {
    return other.content === this.content;
  }
}
```

有別於寫 `other: Box`，如果你有一個衍生類別，它的 `sameAs` 方法只接受來自同一個衍生類別的實例：

```ts
class Box {
  content: string = '';
  sameAs(other: this) {
    return other.content === this.content;
  }
}

class DerivedBox extends Box {
  otherContent: string = '?';
}

const base = new Box();
const derived = new DerivedBox();
derived.sameAs(base);
// 類型 'Box' 的引數不可指派給類型 'DerivedBox' 的參數。
  // 類型 'Box' 缺少屬性 'otherContent'，但類型 'DerivedBox' 必須有該屬性。ts(2345)
```

### 基於 `this` 的型別守衛 `this`-based type guards

你可以在類別和介面的方法回傳的位置，使用 `this is Type`。當搭配使用型別限縮 (例如 `if` 判斷)，目標的型別會被限縮為更具體的 `Type`。

```ts
class FileSystemObject {
  isFile(): this is FileRep {
    return this instanceof FileRep;
  }
  isDirectory(): this is Directory {
    return this instanceof Directory;
  }
  isNetworked(): this is Networked & this {
    return this.networked;
  }
  constructor(public path: string, private networked: boolean) {}
}

class FileRep extends FileSystemObject {
  constructor(path: string, public content: string) {
    super(path, false);
  }
}

class Directory extends FileSystemObject {
  children: FileSystemObject[];
  constructor() {
    super('', false);
    this.children = [];
  }
}

interface Networked {
  host: string;
}

const fso: FileSystemObject = new FileRep('foo/bar.txt', 'foo');

if (fso.isFile()) {
  fso.content;
  // const fso: FileRep
} else if (fso.isDirectory()) {
  fso.children;
  // const fso: Directory
} else if (fso.isNetworked()) {
  fso.host;
  // const fso: Networked & FileSystemObject
}
```

基於 this 的型別守衛的一個常見的例子是允許對特定欄位進行延遲驗證 (lazy validation)。舉例來說，當 `hasValue` 被驗證為 true 時，這種情況會從型別中移除 `undefined`：

```ts
class Box<T> {
  value?: T;

  hasValue(): this is { value: T } {
    return this.value !== undefined;
  }
}

const box = new Box();
box.value = 'Gameboy';

box.value;
// (property) Box<unknown>.value?: unknown

if (box.hasValue()) {
  box.value;
  // (property) value: unknown
}
```

## 參數屬性 Parameter Properties

TypeScript 提供了特殊的語法，可以把一個建構函式參數轉成一個同名同值的類別屬性。這些被稱為參數屬性 (parameter properties)，你可以通過在建構函式參數前加上存取修飾符 `public` `private` `protected` 或者 `readonly` 來建立參數屬性，最後這些類別屬性欄位也會得到這些修飾符：

```ts
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {
    // No body necessary
  }
}
const a = new Params(1, 2, 3);
console.log(a.x);
            // (property) Params.x: number

console.log(a.z);
// 'z' 是私用屬性，只可從類別 'Params' 中存取。ts(2341)
```

## 類別表達式 Class Expressions

類別表達式跟類別宣告非常類似，唯一不同的是類別表達式不需要名稱，儘管我們可以通過最終綁定的任何識別字來引用：

```ts
const someClass = class<Type> {
  content: Type;
  constructor(value: Type) {
    this.content = value;
  }
};

const m = new someClass('hello world');
// const m: someClass<string>
```

## 抽象類別和成員 `abstract` Classes and Members

TypeScript 中的 class、method、field 可以是抽象的。

抽象方法或是抽象欄位是不提供實作的，這些成員必須存在在一個抽象類別中，這個抽象類別也不能被直接實例化。

抽象類別的作用是作為子類別的基底類別，讓子類別實作所有的抽象成員。當一個類別沒有任何抽象成員時，它就被認為是具體的。

讓我們看到下面這個例子：

```ts
abstract class Base {
  abstract getName(): string;

  printName() {
    console.log('Hello, ' + this.getName());
  }
}

const b = new Base();
// 無法建立抽象類別的執行個體。ts(2511)
```

我們無法使用 `new` 去實例化 `Base`，因為它是抽象的。相反，我們需要建立一個衍生類別實作抽象成員：

```ts
class Derived extends Base {
  getName() {
    return 'world';
  }
}

const d = new Derived();
d.printName(); // prints Hello, world
```

注意，如果我們忘記實作基底類別的抽象成員，會得到一個報錯：

```ts
class Derived extends Base {
  /* 非抽象類別 'Derived' 未實作從類別 'Base' 繼承而來的抽象成員 'getName'。ts(2515) */
  // forgot to do anything
}
```

### 抽象建構簽章 Abstract Construct Signatures

有的時候你會希望接受傳入可以繼承一些抽象類別產生一個類別實例的類別建構函式。

舉個例子，你也許會寫出這樣的程式碼：

```ts
function greet(ctor: typeof Base) {
  const instance = new ctor();
  // 無法建立抽象類別的執行個體。ts(2511)
  instance.printName();
}
```

TypeScript 會報錯，告訴你正試圖實例化一個抽象類別。畢竟，根據 `greet` 的定義，這段程式碼應該是合法的：

```ts
// Bad!
greet(Base);
```

但是如果你寫一個函式接受傳入一個建構簽章：

```ts
function greet(ctor: new () => Base) {
  const instance = new ctor();
  instance.printName();
}

greet(Derived);
greet(Base);
/*
類型 'typeof Base' 的引數不可指派給類型 'new () => Base' 的參數。
  無法將抽象建構函式類型指派給非抽象建構函式類型。ts(2345)
*/
```

現在 TypeScript 會正確的告訴你，哪一個類別建構函式可以被呼叫，`Derived` 可以，因為它是具體的，而 `Base` 是不能的。

## 類別之間的關係

在大多數情況下，TypeScript 的類別跟其他型別一樣，會被結構性比較。

例如，下面這兩個類別可以用於替代彼此，因為它們結構是相等的：

```ts
class Point1 {
  x = 0;
  y = 0;
}

class Point2 {
  x = 0;
  y = 0;
}

// OK
const p: Point1 = new Point2();
```

同樣地，即使沒有顯式繼承，類別的子類型之間也可以建立關係：

```ts
class Person {
  name: string;
  age: number;
}

class Employee {
  name: string;
  age: number;
  salary: number;
}

// OK
const p: Person = new Employee();
```

這聽起來有些簡單，但還有一些例子可以看出奇怪的地方。

空類別沒有成員，在結構化型別系統 (structural type system) 中，沒有成員的型別通常是其他任何東西的父類型 (supertype)。所以你如果寫一個空類別 (千萬不要這麼做)，任何東西都能用來代替它：

```ts
class Empty {}

function fn(x: Empty) {
  // can't do anything with 'x', so I won't
}

// All OK!
fn(window);
fn({});
fn(fn);
```
