---
outline: deep
---

# Object Types

###### tags: `TypeScript`

---

在 JavaScript 中，將資料分組和傳遞的最基本方式就是透過物件 (object)，而在 TypeScript 中，我們通過物件型別 (*object types*) 來表示它。

物件型別可以是匿名的：

```ts
function greet(person: { name: string; age: number }) {
  return 'Hello ' + person.name;
}
```

也可以使用介面 (interface) 給它命名：

```ts
interface Person {
  name: string;
  age: number;
}

function greet(person: Person) {
  return 'Hello ' + person.name;
}
```

或是透過型別別名 (type alias)：

```ts
type Person = {
  name: string;
  age: number;
};

function greet(person: Person) {
  return 'Hello ' + person.name;
}
```

上面三種方式都可以用來定義一個物件的型別。

## Property Modifiers

物件型別中的每一個屬性 (property) 都可以被指定型別、屬性是否可選 (optional) 以及屬性是否為唯讀 (readonly)

### Optional Properties

我們可以在物件的屬性名後面加上一個問號 `?` 來標示這個屬性是可選的：

```ts
type Shape = {};

interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}

function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos;
  let yPos = opts.yPos;
  console.log(xPos, yPos);
}

const shape: Shape = {};
paintShape({ shape });
paintShape({ shape, xPos: 100 });
paintShape({ shape, yPos: 100 });
paintShape({ shape, xPos: 100, yPos: 100 });
```

在上面的例子裡，`xPos` 和 `yPos` 就是可選屬性，所以所有的呼叫都是合法。
我們也可以嘗試讀取這些屬性，但如果我們是在 `strictNullChecks` 模式下，TypeScript 會提示我們，屬性值可能是 `undefined`。

```ts
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos;              
  // (property) PaintOptions.xPos?: number | undefined
  let yPos = opts.yPos;
  // (property) PaintOptions.yPos?: number | undefined
}
```

在 JavaScript 中，如果一個屬性值沒有被設置，我們獲取會得到 `undefined`。所以我們可以針對 `undefined` 處理一下：

```ts
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos ?? 0;
  let yPos = opts.yPos ?? 0;
}
```

像這樣設置預設值的方式在 JavaScript 中很常見，所以有專門的語法去支持它：

```ts
function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
  console.log(xPos); // (parameter) xPos: number
  console.log(yPos); // (parameter) yPos: number
  // ...
}
```

這裡我們使用了解構語法以及為 `xPos` 和 `yPos` 提供了預設值。現在 `xPos` 和 `yPos` 的值在 `paintShape` 函式內部一定存在，但對於呼叫 `paintShape` 的人來說卻是可選的。

::: info 注意
現在並沒有在解構語法裡放置型別註記的方式。這是因為在 JavaScript 中，下面的語法代表的意思完全不同。
:::

```ts
function draw({ shape: Shape, xPos: number = 100 /*...*/ }) {
  render(shape);
  // Cannot find name 'shape'. Did you mean 'Shape'?
  render(xPos);
  // Cannot find name 'xPos'.
}
```

在物件解構語法中，`shape: Shape` 表示的是把 shape 的值賦值給區域變數 `Shape`。`xPos: number` 也是一樣，會基於 xPos 創建一個名為 `number` 的變數。


### `readonly` Properties

在 TypeScript 中，屬性也可以被標記為 `readonly`。雖然它不會改變在執行 (runtime) 時的任何行為，但在型別檢查期間，被標記為 `readonly` 的屬性是不能被寫入其他值的。

```ts
interface SomeType {
  readonly prop: string;
}

function doSomething(obj: SomeType) {
  // We can read from 'obj.prop'.
  console.log(`prop has the value '${obj.prop}'.`);

  // But we can't re-assign it.
  obj.prop = 'hello';
  // 因為 'prop' 為唯讀屬性，所以無法指派至 'prop'。ts(2540)
}
```

使用 readonly 修飾符並不意味著一個值就完全是不變的 (immutable)，`readonly` 僅僅表明屬性本身是不能被重新寫入的。

```ts
interface Home {
  readonly resident: {
    name: string;
    age: number;
  };
}

function visitForBirthDay(home: Home) {
  // We can read and update properties from 'home.resident'.
  console.log(`Happy birthday ${home.resident.name}!`);
  home.resident.age++;
}

function evict(home: Home) {
  // But we can't write to the 'resident' property itself on a 'Home'.
  home.resident = { 
  // 因為 'resident' 為唯讀屬性，所以無法指派至 'resident'。ts(2540)
    name: 'Victor the Evictor',
    age: 42,
  };
}
```

TypeScript 在檢查兩個型別是否相容的時候，並不會考慮兩個型別裡的屬性是否為 `readonly`，這也意味著 `readonly` 的值是可以通過別名去修改的。

```ts
interface Person {
  name: string;
  age: number;
}

interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}

let writablePerson: Person = {
  name: 'Person McPersonface',
  age: 42,
};

// works
let readonlyPerson: ReadonlyPerson = writablePerson;

console.log(readonlyPerson.age); // prints '42'
writablePerson.age++;
console.log(readonlyPerson.age); // prints '43'
```

### Index Signatures

有時候我們無法提前知道一個型別裡所有屬性的名字，但我們知道這些值的形狀。

在這情況下，你可以使用索引簽章 (index signature) 來定義可能值的型別，例如：

```ts
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = ['a', 'b'];
const secondItem = myArray[1]; // const secondItem: string
```

這樣我們就有了一個帶有 index signature 的 `StringArray` 介面，這個 index signature 表示當一個 `StringArray` 型別的值使用 `number` 的值進行索引的時候，會回傳一個 `string` 的值。

index signature 的屬性類型必須是 `string` 或者是 `number`。

::: details 可以支持兩種型別的索引器
雖然 TypeScript 可以同時支持 `string` 和 `number` 型別的索引器，但從數字索引回傳的型別必須是從字串索引回傳的型別的子型別。這是因為當使用一個數字進行索引時，JavaScript 實際上是把它轉成了一個字串，也就是說使用 `100` 進行索引和使用 `'100'` 索引其實是一樣的。

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Error: indexing with a numeric string might get you a completely separate type of Animal!
interface NotOkay {
  [x: number]: Animal;
  // 'number' index type 'Animal' is not assignable to 'string' index type 'Dog'.
  [x: string]: Dog;
}
```
若要改為不報錯的寫法需要改成：

```ts
interface NotOkay {
  [x: number]: Dog;
  [x: string]: Animal;
}
```
:::

儘管字串索引簽章 (string index signature) 用來定義字典模式 (dictionary pattern) 很有效，但也會強制所有屬性要匹配索引簽章的回傳型別。這是因為一個字串索引宣告可以是 `obj.property` 也可以是 `obj['property']`。
在下面的例子裡，`name` 的型別並不匹配字串索引的型別，所以型別檢查器會噴出錯誤：

```ts
interface NumberDictionary {
  [index: string]: number;
  length: number;
  name: string;
  // 類型 'string' 的屬性 'name' 不可指派給 'string' 索引類型 'number'。ts(2411)
}
```

然而如果將索引簽章寫成聯合型別那屬性就可以是各種型別了：

```ts
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length is a number
  name: string; // ok, name is a string
}
```

最後，你也可以給索引簽章設置 `readonly`：

```ts
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

let myArray: ReadonlyStringArray = ['aaa', 'bbb', 'ccc']
myArray[2] = 'ddd' // 類型 'ReadonlyStringArray' 中的索引簽章只允許讀取。ts(2542)
```

你不能給 `myArray[2]` 賦值，因為索引簽章是唯讀的。

## Extending Types

我們很常會需要一個比其他型別更具體的型別，舉例來說：假設我們有一個 `basicAddress` 型別用來描述在美國郵寄信件和包裹的所需欄位。

```ts
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
```

這在一些情況下已經滿足所需了，但同一個地址的建築往往還有不同的 unit number，我們可以在定義一個 `AddressWithUnit`：

```ts {3}
interface AddressWithUnit {
  name?: string;
  unit: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
```

這樣寫雖然可以達成我們的目的，但是為了純添加一個欄位我們必須重複再寫一次其他的欄位。

我們可以使用 `extends` 去擴展原本的 `BasicAddress` 型別，這樣 `AddressWithUnit` 就只需要加入一個新的欄位即可：

```ts
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
  unit: string;
}
```

對 `interface` 使用 `extends` 關鍵字可以讓我們有效的從其他宣告過的型別裡複製成員，並添加我們想要新增的成員。

`interface` 又可以擴展多個型別：

```ts
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = {
  color: 'red',
  radius: 42,
};
```

## Intersection Types

TypeScript 還提供了一個交叉型別 (*intersection type*) 用來合併已經存在的物件型別。

使用 `&` 運算子來定義 `intersection type`：

```ts
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;
```

我們在這將 `Colorful` 和 `Circle` 取交集產生了一個擁有所有 `Colorful` 和 `Circle` 成員的新型別。

```ts
function draw(circle: Colorful & Circle) {
  console.log(`Color was ${circle.color}`);
  console.log(`Radius was ${circle.radius}`);
}

// okay
draw({ color: 'blue', radius: 42 });

// 故意將 radius 拼錯字
draw({ color: 'red', raidus: 42 });
/* 
類型 '{ color: string; raidus: number; }' 的引數不可指派給類型 'Colorful & Circle' 的參數。
  物件常值只會指定已知的屬性，但類型 'Colorful & Circle' 中沒有 'raidus'。您是否想要寫入 'radius'? ts(2345)
*/
```

## Interfaces vs. Intersections

這兩種方式在合併型別上看起來很像，但實際上卻有不同。最主要的不同在於衝突怎麼處理，這也是決定選擇哪一種方式的主要原因。

```ts
interface Colorful {
  color: string;
}

interface ColorfulSub extends Colorful {
  color: number;
}
/*
介面 'ColorfulSub' 不正確地擴充介面 'Colorful'。
  屬性 'color' 的類型不相容。
    類型 'number' 不可指派給類型 'string'。ts(2430)
*/
```

`extends` 在重寫型別時會報錯，但是 `intersection type` 不會：

```ts
interface Colorful {
  color: string;
}

type ColorfulSub = Colorful & {
  color: number;
};
```

此時雖然不報錯，但是 `color` 屬性的型別會變成 `never`，因為 `color` 的型別不可能同時滿足 `string` 和 `number`。


## Generic Object Types

試著想像有一個叫做 `Box` 的型別可以包含任意值：

```ts
interface Box {
  contents: any;
}
```

現在這個 `contents` 屬性型別為 `any`，它雖然能正常運作，但這容易有意想不到的驚喜發生。

我們可以使用 `unknown` 去代替它，但這同時意味著在已經知道 `contents` 型別的情況下，我們要去做預防檢查，或是使用容易出錯的型別斷言 (type assertion)。

```ts
interface Box {
  contents: unknown;
}

let x: Box = {
  contents: 'Hello World',
};

// x 型別為 unknown 不能直接使用 toLowerCase()
console.log(x.contents.toLowerCase());

// 我們可以對 'x.contents' 做檢查
if (typeof x.contents === 'string') {
  console.log(x.contents.toLowerCase());
}

// 或是使用 type assertion
console.log((x.contents as string).toLowerCase());
```

較為安全的做法是為每個型別的 `contents` 定義不同的 `Box`：

```ts
interface NumberBox {
  contents: number;
}

interface StringBox {
  contents: string;
}

interface BooleanBox {
  contents: boolean;
}
```

但這同時也意味著我們不得不創建不同的函式或是函式多載 (overload) 才能去處理不同的型別：

```ts
function setContents(box: StringBox, newContents: string): void;
function setContents(box: NumberBox, newContents: number): void;
function setContents(box: BooleanBox, newContents: boolean): void;
function setContents(box: { contents: any }, newContents: any) {
  box.contents = newContents;
}
```

這樣寫起來實在是不優雅又太繁瑣了，我們可以寫個宣告參數型別的泛型 `Box`

```ts
interface Box<Type> {
  contents: Type;
}
```

你可以這樣理解：`Box` 的 `Type` 就是 `contents` 擁有的型別 `Type`。

當我們去引用 `Box` 的時候需要給它一個參數型別去替換掉 `Type`：

```ts
let box: Box<string>;
```

把 `Box` 看作是一個實際型別的模板，`Type` 就是一個佔位符等著被其他型別給替換掉，當 TypeScript 看到 `Box<string>` 時，它會自動將 `Box<Type>` 裡的 `Type` 替換成 `string`，結果就會變成 `{ contents: string }`。也就是說，這個 `Box<string>` 和前面寫到的 `StringBox` 做的事情是一樣的。

```ts
interface Box<Type> {
  contents: Type;
}

interface StringBox {
  contents: string;
}

let boxA: Box<string> = { contents: 'hello' };
boxA.contents; // (property) Box<string>.contents: string

let boxB: StringBox = { contents: 'world' };
boxB.contents; // (property) StringBox.contents: string
```

而這個 `Box` 是可重複使用的 (reusable)，因為 `Type` 可以被任何型別給替換，這也意味著當我們需要一個新的 box 型別時，我們不再需要去宣告一個新的 `Box` 型別：

```ts
interface Box<Type> {
  contents: Type;
}

interface Apple {
  // ....
}

// Same as '{ contents: Apple }'.
type AppleBox = Box<Apple>;
```

同時我們也可以寫泛型函式去避免使用 overload：

```ts
function setContents<Type>(box: Box<Type>, newContents: Type) {
  box.contents = newContents;
}
```

型別別名 (type alias) 也可以使用泛型，我們可以把 `Box` 改成 type 的寫法：

```ts
type Box<Type> = {
  contents: Type;
};
```

### The `Array` Type

當我們在寫型別 `number[]` 或是 `string[]` 的時候，其實它們只是 `Array<number>` 和 `Array<string>` 的簡寫。

```ts
function doSomething(value: Array<string>) {
  // ...
}

let myArray: string[] = ['hello', 'world'];

// either of these work!
doSomething(myArray);
doSomething(new Array('hello', 'world'));
```

和上面的 `Box` 很像，`Array` 本身也是個泛型：

```ts
interface Array<Type> {
  /**
   * Gets or sets the length of the array.
   */
  length: number;

  /**
   * Removes the last element from an array and returns it.
   */
  pop(): Type | undefined;

  /**
   * Appends new elements to an array, and returns the new length of the array.
   */
  push(...items: Type[]): number;

  // ...
}
```

現代 JavaScript 也提供其他是泛型的資料結構，比如 `Map<K, V>`，`Set<T>` 和 `Promise<T>`。因為 `Map`、`Set`、`Promise` 的行為表現，它們可以跟任何型別搭配使用。

### The `ReadonlyArray` Type

`ReadonlyArray` 是一個特殊型別，它可以描述陣列不能被改變。

```ts
function doStuff(values: ReadonlyArray<string>) {
  // We can read from 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);

  // ...but we can't mutate 'values'.
  values.push('hello!');
  // 類型 'readonly string[]' 沒有屬性 'push'。ts(2339)
}
```

`ReadonlyArray` 主要是用來做意圖聲明。當我們看到一個函式 return `ReadonlyArray`，就是在告訴我們不能去更改其中的內容，當我們看到一個函式支持傳入 `ReadonlyArray`，這是在告訴我們我們可以放心的傳入陣列到函式中，而不用擔心會改變陣列的內容。

不像 `Array`，`ReadonlyArray` 並不是一個我們可以用的建構式 (constructor)。

```ts
new ReadonlyArray("red", "green", "blue");
// 'ReadonlyArray' 只會參考類型，但此處將其用為值。ts(2693)
```

不過我們可以直接把一個常規的陣列賦值給 `ReadonlyArray`：

```ts
const roArray: ReadonlyArray<string> = ['red', 'green', 'blue'];
```

TypeScript 同樣也提供了 `ReadonlyArray<Type>` 的簡寫方式： `readonly Type[]`

```ts
function doStuff(values: readonly string[]) {
  // ...
}
```

最後有一點要注意，就是 `Arrays` 和 `ReadonlyArray` 並不能雙向的賦值：

```ts
let x: readonly string[] = [];
let y: string[] = [];

x = y; // ok
y = x; // 類型 'readonly string[]' 為 'readonly'，因此無法指派給可變動的類型 'string[]'。ts(4104)
```

### Tuple Types

元組 (Tuple) 型別是另一種 `Array` 型別，當你明確知道陣列包含多少元素以及每個位置的元素型別為何時，就適合使用元組型別。

```ts
type StringNumberPair = [string, number];
```

上面這個 `StringNumberPair` 就是 `string` 和 `number` 的元組。

跟 `ReadonlyArray` 一樣，它並不會在執行時產生影響，但是對 `TypeScript` 很有意義。在型別系統中，`StringNumberPair` 描述了索引0 的值型別是 `string` 而索引1 的值型別是 `number`。

```ts
function doSomething(pair: [string, number]) {
  const a = pair[0]; // const a: string
  const b = pair[1]; // const b: number
}

doSomething(['hello', 42]);
```

如果我們想要拿到元素數量之外的元素，TypeScript 就會報錯：

```ts {3-4}
function doSomething(pair: [string, number]) {
  // ...
  const c = pair[2]; 
  // 長度為 '2' 的元組類型 '[string, number]' 在索引 '2' 沒有項目。ts(2493)
}
```

我們也可以將元組給解構：

```ts
function doSomething(stringHash: [string, number]) {
  const [inputString, hash] = stringHash;
  console.log(inputString); // const inputString: string
  console.log(hash); // const hash: number
}
```

::: info
元組在重度依賴約定 (heavily convention-based) 的 API 中很有用，因為它會讓每個元素的意義都很明顯。當我們解構的時候，元組給了我們命名變數的自由度。在上面的例子中，我們可以命名元素 0 和 1 為我們想要的名字。

然而，也不是每個使用者都這樣認為，所以有的時候，使用一個帶有描述屬性名稱的物件也許更適合你的 API。
:::

除了長度檢查，簡單的元組跟宣告了 `length` 屬性和具體的索引屬性的 `Array` 是一樣的。

```ts
interface StringNumberPair {
  // specialized properties
  length: 2;
  0: string;
  1: number;

  // Other 'Array<string | number>' members...
  slice(start?: number, end?: number): Array<string | number>;
}
```

在元組裡你也可以寫一個可選屬性，但可選元素必須在最後面，且也會影響型別的 `length`。

```ts
type Either2dOr3d = [number, number, number?];

function setCoordinate(coord: Either2dOr3d) {
  const [x, y, z] = coord; // const z: number | undefined
  console.log(x, y, z);
  console.log(`Provided coordinates had ${coord.length} dimensions`); 
                                      // (property) length: 2 | 3
}
```

Tuple 也可以使用剩餘元素語法，但必須是 array/tuple 型別：

```ts
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```

- `StringNumberBooleans` 描述了一個元組的前兩個元素分別是 `string` 和 `number`，但後面可以有任意數量的 `boolean`。
- `StringBooleansNumber` 描述了一個元組的第一個元素是 `string`，接著是任意數量的 `boolean` 並以 `number` 結尾。
- `BooleansStringNumber` 描述了一個元組的起始元素是任意數量的 `boolean`，並以 `string` 和 `number` 結尾。


一個有剩餘元素 (rest element) 的元組不會設置 "length"，因為它只知道在不同位置上的已知元素信息：

```ts
const a: StringNumberBooleans = ['hello', 1];
const b: StringNumberBooleans = ['beautiful', 2, true];
const c: StringNumberBooleans = ['world', 3, true, false, true, false, true];

console.log(a.length); // (property) length: number

type StringNumberPair = [string, number];
const d: StringNumberPair = ['1', 1];
console.log(d.length); // (property) length: 2
```

可選元素和剩餘元素的存在，使得 TypeScript 可以在參數列表裡使用元組，就像這樣：

```ts
function readButtonInput(...args: [string, number, ...boolean[]]) {
  const [name, version, ...input] = args;
  // ...
}
```

上面的寫法基本等同於：

```ts
function readButtonInput(name: string, version: number, ...input: boolean[]) {
  // ...
}
```

### `readonly` Tuple Types

元組亦可使用 `readonly` 修飾符：

```ts
function doSomething(pair: readonly [string, number]) {
  // ...
}
```

你可能已經猜到了，TypeScript 中不允許寫入 `readonly` 元組的任何屬性：

```ts
function doSomething(pair: readonly [string, number]) {
  pair[0] = 'hello!';
  // Cannot assign to '0' because it is a read-only property.
}
```

在大多數的程式碼裡，元組 (Tuple) 往往只是被創建，使用後也未修改，因此盡可能將元組設置為 `readonly` 是個好習慣。

如果我們給一個陣列字面值 (array literals) `const` 斷言時，它將被推論為 `readonly` 元組。

```ts
let point = [3, 4] as const; // let point: readonly [3, 4]

function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

distanceFromOrigin(point);
/* 
類型 'readonly [3, 4]' 的引數不可指派給類型 '[number, number]' 的參數。
  類型 'readonly [3, 4]' 為 'readonly'，因此無法指派給可變動的類型 '[number, number]'。ts(2345)
*/
```

即使 `distanceFromOrigin` 沒有修改傳入的元素，但函式希望傳入的是一個可變的元組 (mutable tuple)，因為 `point` 被推論為 `readonly [3, 4]` 並不相容 `[number, number]`，因此無法保證 `point` 的元素不會被更改到。
