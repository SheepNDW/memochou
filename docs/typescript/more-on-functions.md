# More on Functions

###### tags: `TypeScript`

參考資料: [TypeScript 新手指南](https://willh.gitbook.io/typescript-tutorial/)、[TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

[Toc]

---

函式是任何應用程式的基本構件，無論是區域函式 (local functions)、從別的模組中匯入的函式又或者是來自一個類別 (class) 中的方法。它們也是 value，和其他的 value 一樣在 TypeScript 中有很多方式去描述這些函式是如何被呼叫的，讓我們開始學習如何撰寫型別去描述函式。

## Function Type Expressions

定義函式型別最簡單的方法是使用函式型別表達式 (function type expression)，這些型別在語法上很類似於箭頭函式：

```ts
function greeter(fn: (a: string) => void) {
  // (parameter) fn: (a: string) => void
  fn('hello world');
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole); // hello world
```

語法：`(a: string) => void` 

它的意思是「**一個沒有回傳值的函式帶有一個型別為 string 的參數 a。**」另外，就像函式宣告一樣，如果這個參數沒有被指定型別，那它會預設推論為 `any`。

::: tip Note
在這裡參數的名稱是**必需**的，如果一個函式型別為 (string) => void 代表這個函式有一個型別為 any 的參數叫做 string！
:::

當然，我們也可以把它拿出去並使用 type alias 去定義函式的型別：

```ts
type GreetFunction = (a: string) => void;

function greeter(fn: GreetFunction) {
  fn('hello world');
}
```

## Call Signatures

在 JavaScript 中，函式除了可以呼叫之外也可以擁有屬性，但是在 function type expression 的語法並不准許我們宣告屬性在裡面，如果我們想要定義一些可以被呼叫的屬性，可以在一個物件型別裡撰寫呼叫簽章 (*call signature*)：

```ts
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + ' returned ' + fn(6));
}
```
::: tip Note
要注意這邊的語法和函式的型別表達式略有不同：「在參數和傳回值之間使用的是 `:` 而不是 `=>`」
:::

定義好 `doSomething` 後，我們可以嘗試去呼叫並執行它：

```ts
function fn1(n: number) {
  console.log(n);
  return true;
}

fn1.description = 'hello';

doSomething(fn1);

// 6
// hello returned true
```

## Construct Signatures

JavaScript 的函式也可以使用 `new` 運算子來呼叫，當函式被呼叫時，TypeScript 會將其認為是建構函式 (constructors)，因為它們通常會建立一個新的物件。<br>
你可以藉由在 call signature 前面加上一個 `new` 來撰寫建構函式簽章 (*construct signature*)：

```ts
class SomeObject {
  s: string;
  constructor(s: string) {
    this.s = s;
  }
}

type SomeConstructor = {
  // 在 call signature 前加上一個 new
  new (s: string): SomeObject;
};

function fn(ctor: SomeConstructor) {
  return new ctor('hello');
}

const f = fn(SomeObject);
console.log(f.s); // hello
```

有些物件，像是 JavaScript 中的 `Date`，可以呼叫也可以通過 `new` 來呼叫，你可以任意組合型別相同的 call 和 construct signature：

```ts
interface CallOrConstructor {
  new (s: string): Date;
  (n?: number): number;
}

function fn(date: CallOrConstructor) {
  let d = new date('2022-08-08');
  let n = date(100);
}
```

## Generic Functions

我們經常會寫出這種函式：輸入的型別與輸出的型別有關，或是兩個輸入的型別以某種形式互相關聯。
現在讓我們來考慮一下假如有一個函式，它會回傳陣列裡的第一個元素：

```ts
function firstElement(arr: any[]) {
  return arr[0];
}
```

此時函式 return 回來的型別是 `any`，如果他能夠 return 這個陣列元素的具體型別就好了。

在 TypeScript 中，泛型 (*generics*) 被用來描述兩個值之間的關聯。 我們通過在 function signature 中宣告一個參數型別 (*type parameter*) 來做到這一點：

```ts
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```

透過給函式加上一個參數型別 `Type`，並在兩個地方使用，這樣我們就已經在函式的輸入 (陣列) 和輸出 (回傳值) 之間搭建了一個連繫。
現在當我們去呼叫它時，會出現一個更具體的型別：

```ts
// s is of type 'string'
const s = firstElement(['a', 'b', 'c']);
// n is of type 'number'
const n = firstElement([1, 2, 3]);
// u is of type undefined
const u = firstElement([]);
```

### Inference

::: tip Note
在上面的例子中，我們沒有明確指定 `Type` 的型別，型別是被 TypeScript 自動推論出來的。
:::

我們還可以使用多種不同型別的參數，例如像這樣一個使用者自訂的 `map` 函式：

```ts
// 泛型不光可以定義一個，也可以定義多個 (名字可以自己取但使用時必須跟你寫的是一樣的)
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
  return arr.map(func);
}

// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(['1', '2', '3'], (n) => parseInt(n));

console.log(parsed); // [1, 2, 3]
```

在這個範例中，TypeScript 既可以從傳入的參數推論出 `Input` 的型別 (從傳入的 `string[]`)，也可以根據函式的回傳值 (`number`)，推論出 `Output` 的型別。

### Constraints

我們已經寫了一些可以處理任何 (any) 型別的泛用函式 (generic functions)。有的時候我們想要將兩個 value 關聯在一起，但只能對裡面的一些固定欄位進行操作，在這種情況下，我們可以使用 *constraint* (中文譯作約束或是限制) 來對參數型別加以限制。

讓我們來寫一個會回傳兩個數值中較長值的 `longest` 函式 ，為了實現它，我們需要一個型別為 `number` 的 `length` 屬性，但是如果只是定義了普通的泛型 Type，我們無法保證這個 Type 一定會有 `length` 屬性，此時我們可以使用 `extends` 語法來給這個泛型加上限制：

```ts
// 一般泛型函式
function longest<Type>(a: Type, b: Type) {
  if (a.length >= b.length) { // 類型 'Type' 沒有屬性 'length'。ts(2339)
    return a;
  } else {
    return b;
  }
}
```

使用 `extends` 語法來限制泛型可接受的型別：

```ts
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [3, 4, 5]);
// longerString is of type 'sheep' | 'hitsuji'
const longerString = longest('sheep', 'hitsuji');
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
```

在這個例子中有一些有趣的事情需要我們注意，TypeScript 會推論出 `longest` 回傳值的型別，所以回傳值的型別推論也適用於泛型函式。

正是因為我們對 `Type` 做了 `{ length: number }` 限制，我們才可以被允許獲取 `a` `b` 參數的 `.length` 屬性。如果沒有了 type constraint，我們甚至沒辦法取到這些屬性，因為這些傳入的值可能是其他沒有 length 屬性的型別。

根據傳入的參數，`longerArray` 和 `longerString` 的型別都可以被推論出來。請記住，所謂泛型就是用一個相同型別來關聯兩個或者更多的值！

而在上面範例的最後，如我們所願的，呼叫 `longest(10, 100)` 會被 TypeScript 警告，因為 `number` 並不擁有 `.length` 屬性。

### Working with Constrained Values

下面是一個在使用泛型限制 (generic constraints) 時的常見錯誤：

```ts
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    return { length: minimum };
  }
// Type '{ length: number; }' is not assignable to type 'Type'.
// '{ length: number; }' is assignable to the constraint of type 'Type',
// but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'.
}
```

這個函式看起來沒什麼問題，`Type` 被 `{ length: number }` 限制，函式回傳 `Type` 或是一個符合限制的值。
這其中的問題在於這個函式理應回傳和傳入時相同型別的物件 (也就是泛型 `Type`)，而不僅僅是符合限制的物件。

如果假設上面的程式碼是合法的，那你就有可能寫出這樣的程式碼：

```ts
// 'arr' gets value { length: 6 }
const arr = minimumLength([1, 2, 3], 6);
// and crashes here because arrays have
// a 'slice' method, but not the returned object!
console.log(arr.slice(0));
```

### Specifying Type Arguments

通常情況下 TypeScript 可以自動推論出泛型呼叫時傳入參數的型別，然而凡事總有例外，舉個例子，當你在撰寫一個可以合併兩個陣列的函式時：

```ts
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}
```

一般情況下，如果你像這樣去呼叫這個函式會出現報錯：

```ts
const arr = combine([1, 2, 3], ['hello']);
// Type 'string' is not assignable to type 'number'.
```

然而，如果你仍然打算這樣做，你可以手動的指定 (specify)  `Type`：

```ts
const arr = combine<string | number>([1, 2, 3], ['hello']);

// 手動指定型別後你就會發現不報錯了，順便來打印一下這個 arr
console.log(arr); // [ 1, 2, 3, 'hello' ]
```

因為函式的參數一開始都是定義成泛型 (`Type`)，基本上除非業務需求，不然不推薦手動去給泛型指定型別。

### Guidelines for Writing Good Generic Functions
> 撰寫一個優雅的泛型函式的準則

撰寫泛型函式很有趣，但也很容易被這些參數型別 (type parameters) 給迷惑，使用太多參數型別或是在不必要的地方使用 constraint，都可能會導致不正確型別推論。

::: info 這裡推薦三個寫出好的泛型函式的準則：
1. 在可能的情況下，直接使用參數型別本身，而不是對其進行限制 (constraint)
2. 盡可能地減少使用參數型別
3. 如果一個參數型別只會出現在一個地方，請重新思考你是否真的需要它
:::

#### 1. Push Type Parameters Down 參數型別下移

下面兩個 function 的寫法很雷同：

```ts
function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}

function firstElement2<Type extends any[]>(arr: Type) {
  return arr[0];
}

// a: number (good)
const a = firstElement1([1, 2, 3]);
// b: any (bad)
const b = firstElement2([1, 2, 3]);
```

乍看之下它們長得非常相似，但是 `firstElement1` 的寫法比 `firstElement2` 來得更好，因為它推論出回傳值的型別是 `Type`，但 `firstElement2` 推論回傳值的型別是 `any`，因為 TypeScript 不得不用限制的型別來推論這個 `arr[0]` 表達式，而不是等到函式呼叫時再去推論這個元素的型別。

以下節錄自[冴羽](https://github.com/mqyqingfeng)大大在他的 TypeScript 教學文檔裡關於 push down 的解釋：
> 關於本節原文中提到的 `push down` 含義，在《重構》裡，就有一個函式下移（Push Down Method）的優化方法，指如果超類 (superclass) 中的某個函式只與一個或者少數幾個子類 (subclass) 有關，那麼最好將其從超類中挪走，放到真正關心它的子類中去。即只在超類保留共用的行為。
>
>這種將超類中的函式本體複製到具體需要的子類的方法就可以稱之為"push down"，與本節中的去除 `extends any[]`，將其具體的推斷交給 `Type` 自身就類似於`push down`。

#### 2. Use Fewer Type Parameters

下面是另外一對看起來很相似的 function：

```ts
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}

function filter2<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func);
}
```

我們創建了一個並沒有關聯兩個值的參數型別 `Func`，這是一個要不得的行為，因為它代表著使用者必須無緣無故去手動指定一個額外的型別參數。
`Func` 在這什麼也沒做，但卻讓這個函式變得更難閱讀和理解。

#### 3. Type Parameters Should Appear Twice

有時候我們會忘記其實函式並不一定需要泛型：

```ts
function greet<Str extends string>(s: Str) {
  console.log('Hello, ' + s);
}

greet('world');
```

其實我們可以簡單的寫成這樣：

```ts
function greet(s: string) {
  console.log('Hello, ' + s);
}
```

請記住，參數型別用於關聯多個值之間的型別，如果一個參數型別只在函式簽章 (function signature) 中出現一次，那它就沒有跟任何東西有關聯。


## Optional Parameters

JavaScript 的函式經常會被傳入非固定數量的參數，例如，`number` 的 `toFixed` 方法就支持選擇性傳入一個小數位 (digits) 參數：

```ts
function f(n: number) {
  console.log(n.toFixed()); // 0 arguments
  console.log(n.toFixed(3)); // 1 argument
}

f(123.45); // 123, 123.450
f(); // 報錯: 應有 1 個引數，但得到 0 個。ts(2554)
```

在 TypeScript 裡我們可以使用 `?` 來表示此參數是選擇性傳入的：

```ts
function f(x?: number) {
  // ...
}
f(); // OK
f(10); // OK
```

雖然參數被指定為 `number` 型別，但實際上它的型別為 `number | undefined`，這是因為在 JavaScript 裡沒有指定值的函式參數會被賦予 `undefined`。

你也可以提供一個參數預設值給它：

```ts
function f(x = 10) {
  // ...
}
```

現在這個 `f` 函式體內，`x` 的型別為 `number`，因為任何未定義的參數都會被替換成 `10`。
這裡要注意的是，如果參數是可選的，使用者還是可以傳入 `undefined` 作為參數：

```ts
declare function f(x?: number): void;
// cut
// All OK
f();
f(10);
f(undefined);
```

另外需要注意 `?` 不能與預設參數同時存在：

```ts
function f(n?: number = 10) { // 參數不得有問號及初始設定式。ts(1015)
  // ...
}
```

### Optional Parameters in Callbacks

在學習過可選參數和函式表達式後，你很容易會在撰寫帶有 callback 的函式中犯了以下錯誤：

```ts
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}
```

將索引值寫成可選參數 `index?` 是為了想要讓下面的呼叫方式是合法的：

```ts
myForEach([1, 2, 3], (a) => console.log(a));
myForEach([1, 2, 3], (a, i) => console.log(a, i));
```

但實際上 TypeScript 會認為這個 callback 被呼叫時可能只會傳入一個引數 (argument)，也就是說這個 `myForEach` 函式也可能會是這樣：

```ts
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    // 我今天不想提供 index 值
    callback(arr[i]);
  }
}
```

TypeScript 會按此理解並報了一個實際上並不可能發生的錯：

```ts
myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed());
  // Object is possibly 'undefined'.
});
```

那如何修改呢？不設置為可選參數其實就可以了：

```ts
function myForEach(arr: any[], callback: (arg: any, index: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}

myForEach([1, 2, 3], (a, i) => {
  console.log(a);
});
```

在 JavaScript 裡，如果你呼叫一個函式並傳入了比需要還更多的參數進去，這些額外的參數會被忽略掉，而 TypeScript 亦是如此。

::: info 當要為 callback 寫一個函式型別時，永遠不要寫可選參數，除非你打算在不傳參的情況下呼叫這個函式。
:::

## Function Overloads

一些 JavaScript 函式在呼叫的時候可以傳入不同數量或型別的引數 (argument)。舉例來說，撰寫一個函式來生成一個 `Date`，這個函式接收一個時間戳 (一個引數) 或者一個月/日/年的格式 (三個引數)。

在 TypeScript 裡，我們可以透過撰寫多載簽章 (*overload signatures*) 來指定一個函式的不同呼叫方法。
為此，我們需要寫一些函式簽章 (通常為兩個或是以上)，然後再寫函式主體：

```ts
/* overload signatures */
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
/* function implementation */
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}

const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3); // 沒有任何多載需要 2 引數，但有多載需要 1 或 3 引數。ts(2575)
```

在這個例子裡，我們撰寫了兩個 overload，一個接受一個引數 (argument)，另一個接受三個引數。
這前兩個函式定義 (signature) 又被稱為多載簽章 (*overload signatures*)

然後我們又寫了一個滿足所有的 overload signatures 的函式實作 (function implementation)，又稱作實作簽章 (implementation signature)。
這個簽章並不能直接去呼叫，就算我們已經在函式的定義中寫了一個必填參數和兩個可選參數，它依然不能被傳入兩個參數去進行呼叫，因為它必須符合我們前面寫的 overload 所定義好的規則。

再來看看這個例子 (取自[TypeScript 新手指南](https://willh.gitbook.io/typescript-tutorial/basics/type-of-function#guo-zai))，實現一個函式 `reverse`，輸入數字 `123` 的時候，輸出反轉的數字 `321`，輸入字串 `'hello'` 的時候，輸出反轉的字串 `'olleh'`。

利用聯合型別，我們可以這麼去實現：

```ts
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''));
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('');
  } else {
    return x;
  }
}

const aaa = reverse(123);   // aaa: string | number
const bbb = reverse('abc'); // bbb: string | number
```

但是這樣寫有一個缺點，沒辦法精確的表達，輸入為數字的時候，輸出也應該為數字，輸入為字串的時候，輸出也應該為字串。

此時就可以使用 overload 定義多個 `reverse` 的函式型別：

```ts
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''));
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('');
  } else {
    return x;
  }
}

const aaa = reverse(123);   // aaa: number
const bbb = reverse('abc'); // bbb: string
```

在上面例子裡，我們重複定義了多次函式 `reverse`，前幾次都是 overload signature，最後一次是函式實作，透過撰寫 function overload 我們就可以得到精確的輸出型別。

### Overload Signatures and the Implementation Signature

下面是一個常見的困擾來源，人們常常像這樣去寫程式碼但是又不明白為何會報錯：

```ts
function fn(x: string): void;
function fn() {
  console.log('hello');
}
// 希望能夠不傳任何參數去呼叫
fn(); // 報錯: 應有 1 個引數，但得到 0 個。ts(2554)
```

再次強調，寫進函式實作的 signature 對外部來說是"不可見"的，也就意味著外界"看不到"它的 signature，自然也就不能按照實作簽章 (implementation signature) 的方式去呼叫，正確的做法是撰寫多載簽章 (overload signature)。

> implementation signature 對外界來說不可見，當在寫一個多載函式的時候，你應該總是在函式實作之上寫兩個或以上的 signature。

此外實作簽章還必須要和多載簽章相容 (compatible)，舉個例子，下面這些函式之所以報錯，是因為它們的實作簽章沒有正確的匹配到多載簽章：

```ts
function func(x: boolean): void;
function func(x: string): void; // 此多載簽章與其實作簽章不相容。ts(2394)
function func(x: boolean) {}
```

正確的寫法是在實作簽章上定義聯合型別來滿足所有多載簽章定義的型別：

```ts
function func(x: boolean): void;
function func(x: string): void;
function func(x: boolean | string) {}
```

接下來再來看一個例子，如果我們定義了函式的回傳值型別：

```ts
function func(x: string): string;
function func(x: boolean): boolean; // 此多載簽章與其實作簽章不相容。ts(2394)
function func(x: string | boolean) {
  return 'hello';
}
```

可以看到因為回傳值為一個字串導致第二個 overload signature 出現了報錯。

解決方式也很簡單，只要給實作簽章定義回傳值的型別即可：

```ts
function func(x: string): string;
function func(x: boolean): boolean;
function func(x: string | boolean): string | boolean {
  return 'hello';
}
```

