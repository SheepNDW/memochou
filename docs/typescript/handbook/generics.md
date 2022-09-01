# Generics

###### tags: `TypeScript`

參考資料: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)、[冴羽 TypeScript 系列](https://ts.yayujs.com/)

---

軟體工程中的一個主要部分就是構建元件 (building component)，元件不僅需要有定義良好和一致的API，也需要是可複用的 (reusable)。好的元件可以處理當前的資料也可以處理未來可能遇到的資料，這會在建構大型軟體系統時給你最大的靈活度。

在比如 C# 和 Java 中，用來創建可複用元件的工具，我們稱之為泛型 (generics)。利用泛型，我們可以創建一個支援眾多型別的元件，這讓使用者可以使用自己的型別消費 (consume) 這些元件。

## Hello World of Generics

讓我們寫一個恆等函式 (identity function)，這個 identity 函式會回傳任何傳入內容的函式，你也可以把它理解為類似於 `echo` 指令。

如果沒有泛型，我們就需要給這個 identity 函式特定的型別：

```ts
function identity(arg: number): number {
  return arg;
}
```

或是給它一個 `any`：

```ts
function identity(arg: any): any {
  return arg;
}
```

雖然使用 `any` 可以讓函式接收各種型別的 `arg` 參數，但我們也遺失了這個函式回傳值的型別資訊，例如我們傳了一個 `number` 進去，我們唯一能知道的訊息就是函式回傳了一個 `any` 型別的值。

我們需要一個可以去捕獲參數型別的方式，然後用它來表示回傳值的型別。這裡我們使用了一個型別的變數 (type variable)，一個代表型別而不是值的特殊變數。

```ts
function identity<Type>(arg: Type): Type {
  return arg;
}
```

加上 `Type` 這個型別變數後，我們能夠去捕獲到使用者傳入參數的型別 (例如 `number`)，以便我們將來去使用這個型別。然後我們又在 return type 裡使用了 `Type`，透過檢查我們可以清楚的知道參數和回傳值的型別是相同的。

像這樣寫法的 identity 函式就是一個泛型，它可以作用於任何型別。和 `any` 不同的是，它和第一個用 `number` 定義的方式一樣不會遺失回傳值的型別。

我們有兩種呼叫這個泛型函式的方式，第一種是傳入所有參數，包含參數型別：

```ts
let output = identity<string>('myString'); // let output: string
```

在這裡我們明確的給 `Type` 設置為 `string` 作為函式呼叫的參數。

第二種方式是最常見的，使用型別推論 (type argument inference) 讓 TypeScript 在編譯時根據傳入的參數自動推論出 `Type` 的值。

```ts
let output = identity('myString'); // let output: string
```

注意這次我們並沒有用 `<>` 明確的傳入型別，當編譯器看到 `myString` 這個值，就會自動設置 Type 為它的型別（即 `string`）。

type argument inference 是非常好用的工具，它可以讓程式碼更精簡且可讀性更好，我們只需要在一些更複雜的情境裡，當編譯器無法自動推論出型別時，才需要像第一個例子一樣傳入一個明確的型別。

## Working with Generic Type Variables

當你開始使用泛型函式時，一定會注意到當你寫一個像是 `identity` 函式的時候，編譯器會強制你在函式體中正確地去使用這些參數型別，也就是說這些參數實際上被認為可以是 `any` 或所有型別。

以剛才的 `identity` 函式為例：

```ts
function identity<Type>(arg: Type): Type {
  return arg;
}
```

如果我們想在呼叫它的時候印出這個參數的長度，可能會這樣去寫：

```ts
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length); // 類型 'Type' 沒有屬性 'length'。ts(2339)
  return arg;
}
```

此時編譯器會報錯並提示我們正在使用 `arg` 的 `.length` 屬性，但是我們沒有在其他地方定義過 `arg` 有這個屬性。請記住，我們之前說過這些型別變數代表著 `any` 甚至是所有型別，所以很有可能今天傳入的是一個沒有 `.lengrh` 的 `number` 型別。

假設我們打算將此函式用在 `Type[]` 而不是直接使用 `Type`，因為使用的是陣列，所以 `.length` 屬性必定存在，我們就可以像創建其他型別的陣列一樣去定義：

```ts
function loggingIdentity<Type>(arg: Type[]): Type[] {
  console.log(arg.length);
  return arg;
}
```

你可以這樣去理解 `loggingIdentity` 的型別：泛型函式 `loggingIdentity` 接受一個參數型別 `Type` 然後它的 argument `arg` 是一個 `Type` 陣列，函式回傳值是 `Type` 陣列。

如果我們傳一個 number 陣列進去，將會得到一個也是 number 的陣列回傳值，使用型別變數 `Type`，是作為我們使用的型別的一部分，而不是之前的一整個型別，這會給我們更大的自由度。

我們也可以這樣去寫剛剛這個例子，效果是一樣的：

```ts
function loggingIdentity<Type>(arg: Array<Type>): Array<Type> {
  console.log(arg.length); // Array has a .length, so no more error
  return arg;
}
```

## Generic Types

在前一個章節裡，我們已經建立了一個泛型 identity 函式，並且可以支持傳入各種型別的參數。在這個章節裡，我們將探索函式本身的型別，以及如何建立泛型介面 (interface)。

泛型函式的形式就跟其他非泛型函式的一樣，都需要先列一個參數型別清單，這有點像函式宣告：

```ts
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: <Type>(arg: Type) => Type = identity;
```

泛型的參數型別可以使用不同的名字，只要數量和使用方式上一致即可：

```ts
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: <Input>(arg: Input) => Input = identity;
```

我們也可以以物件型別的呼叫簽章 (call signature) 的形式，書寫這個泛型：

```ts
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: { <Type>(arg: Type): Type } = identity;
```

我們可以進一步將上面這個物件字面值抽離出來，寫成一個 interface：

```ts
interface GenericIdentityFn {
  <Type>(arg: Type): Type;
}

let myIdentity: GenericIdentityFn = identity;
```

有的時候，我們會希望將泛型參數作為整個介面的參數，這可以讓我們清楚的知道傳入的是什麼參數(舉個例子：`Dictionary<string>` 而不是 `Dictionary`)。而且介面裡其他的成員也可以看到。

```ts
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

注意在這個例子裡，我們只做了少許改動。不再描述一個泛型函式，而是將一個非泛型函式簽章，作為泛型的一部分。

現在當我們使用 `GenericIdentityFn` 的時候，需要明確給出參數的型別。(在這個例子中，是 `number`)，有效的鎖定了呼叫簽章使用的型別。

當要描述一個包含泛型的型別時，理解什麼時候把參數型別放在呼叫簽章里，什麼時候把它放在介面裡是很有用的。


## Generic Classes

泛型 class 和泛型 interface 的寫法很像，在泛型 class 的名字後面加上一個尖括號(`<>`)包裹住參數型別列表。

```ts
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```
> 你可能會在寫這個泛型時遇到了關於沒有初始化的報錯，這裡可以先將 `tsconfig.json` 裡的 `"strictPropertyInitialization"` 調成 `false`，後面會再提到關於 class 的型別問題。

在這個例子中你可能已經注意到了這個 `GenericNumber` class 並沒有限制你只能使用 `number` 型別，我們也可以使用 `string` 會是其他更複雜的型別：

```ts
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = '';
stringNumeric.add = function (x, y) {
  return x + y;
};

console.log(stringNumeric.add(stringNumeric.zeroValue, 'test')); // 'test'
```

和 interface 一樣，將參數型別放在 class 上可以確保 class 裡所有的屬性都使用一樣的型別。

正如我們在 Class 章節提過的，一個 class 它的型別有兩部分：靜態部分 (static side) 和實例部分 (instance side)。泛型 class 僅僅對實例部分生效，所以當我們使用 class 的時候，要注意靜態成員並不能使用參數型別。


## Generic Constraints

在之前我們用泛型寫過這個 `loggingIdentity` 函式，假設我們想要獲取參數 `arg` 的 `.length` 屬性，但是編譯器並不能證明每種型別都有 `.length` 屬性，所以它會報錯：

```ts
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length); // 類型 'Type' 沒有屬性 'length'。ts(2339)
  return arg;
}
```

我們希望將此函式限制為只能使用也具有 `.length` 屬性的型別，只要型別有這個成員，我們就允許使用它，但必須至少要有這個成員。為此，我們需要列出對 `Type` 限制的必要條件。

為了實現它，我們可以寫一個 interface 來描述我們的限制條件，我們在這寫了一個只有一個 `.length` 屬性的 interface 然後使用 `extends` 關鍵字去對泛型進行限制：

```ts
interface Lengthwise {
  length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length);
  return arg;
}

loggingIdentity('hello');             // OK
loggingIdentity(['hello', 'world']);  // OK
```

因為我們已經對這個泛型函式做了限制，所以它將不再適用於所有型別：

```ts
loggingIdentity(3); 
// 類型 'number' 的引數不可指派給類型 'Lengthwise' 的參數。ts(2345)
```

需要傳入符合限制條件的屬性值：

```ts
loggingIdentity({ length: 10, value: 3 });
```

## Using Type Parameters in Generic Constraints

你可以宣告一個受另一個參數型別限制的參數型別。舉例來說，我們想要從一個物件中拿到給定屬性名的值，我們必須確保我們不會意外抓取物件上不存在的屬性，因此我們要在這兩種型別中放置一個限制 (constraints)：

```ts
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, 'a');
getProperty(x, 'm');
// 類型 '"m"' 的引數不可指派給類型 '"a" | "b" | "c" | "d"' 的參數。ts(2345)
```

在實作的時候，你可能會注意到 vscode 會正確提示你可以輸入的屬性名：

![](https://i.imgur.com/k38ttfT.png)

## Using Class Types in Generics

在 TypeScript 中使用泛型建立工廠函式 (factory) 時，有必要透過其建構函式 (constructor function) 來引用類別的型別，例如：

```ts
function create<Type>(c: { new (): Type }): Type {
  return new c();
}
```

接著是一個更複雜的範例，使用原型屬性來推論和限制建構函式和類別型別的實例之間的關係：

```ts
class BeeKeeper {
  hasMask: boolean = true;
}

class ZooKeeper {
  nametag: string = 'sheep';
}

class Animal {
  numLegs: number = 4;
}

class Bee extends Animal {
  keeper: BeeKeeper = new BeeKeeper();
}

class Lion extends Animal {
  keeper: ZooKeeper = new ZooKeeper();
}

function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}

console.log(createInstance(Lion).keeper.nametag); // sheep
console.log(createInstance(Bee).keeper.hasMask);  // true
console.log(createInstance(BeeKeeper));
/*
類型 'typeof BeeKeeper' 的引數不可指派給類型 'new () => Animal' 的參數。
  類型 'BeeKeeper' 缺少屬性 'numLegs'，但類型 'Animal' 必須有該屬性。ts(2345)
*/
```
