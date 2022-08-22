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
