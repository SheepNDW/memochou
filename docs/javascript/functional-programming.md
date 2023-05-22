---
outline: deep
---

# Functional Programming

本篇為觀看 [JavaScript: The Advanced Concepts](https://www.udemy.com/course/advanced-javascript-concepts/) 課程裡關於 FP 章節做的筆記。

## Pure Functions

> - same `input` -> same `output` no matter how many times it is called
> - function cannot modify anything outside itself

純函式（pure function）是指在相同的輸入下，永遠會得到相同的輸出，且不會有任何副作用的函式。

### No Side Effects

首先來看一個有副作用的函式：

```js
const array = [1, 2, 3];

function mutateArray(arr) {
  arr.pop();
}

mutateArray(array);
console.log(array); // [1, 2]
```
> mutateArray 在每一次被呼叫時，都會改變外部的 array，這個 array 相當於是一個全域的變數，我們必須每次都要注意到它的變化，才能確保程式的正確性。

現在假設又多了一個函式：

```js
function mutateArray2(arr) {
  arr.forEach(item => arr.push(1));
}
```

然後今天同時去呼叫這兩個函式：

```js
mutateArray(array);
mutateArray2(array);
console.log(array); // [1, 2, 1, 1]
```

此時會讓人很困惑，因為我們不知道 `array` 到底會變成什麼樣子，必須要一行一行去確認這個共享的狀態是怎麼被函式修改的。函式的呼叫順序會影響到程式的執行結果，這樣的程式碼可能會有意想不到的 bug，這也是副作用會造成的問題。

那要如何才能讓這段程式碼不產生副作用，不會去改變到原始陣列呢？

```js
const array = [1, 2, 3];
function removeLastItem(arr) {
  const newArray = [...arr];
  newArray.pop();
  return newArray;
}

console.log(removeLastItem(array)); // [1, 2]
console.log(array); // [1, 2, 3]
```
> 我們可以建立一個新的陣列，然後將原始陣列的值複製到新的陣列中，這樣就不會去改變原始陣列了。

再來看一個例子：

```js
function multiplyBy2(arr) {
  return arr.map(item => item * 2);
}
console.log(multiplyBy2(array)); // [2, 4, 6]
console.log(array); // [1, 2, 3]
```
> `map` 方法會回傳一個新的陣列，所以也不會改變原始陣列，因此這個 `multiplyBy2` 函式也是一個純函式。

另外值得一提的是下面這麼一個函式：

```js
function a() {
  console.log('hi');
}
```

這個函式看起來沒有任何的副作用，但是它其實是有副作用的，`console.log()` 是 `window` 的方法，它會在瀏覽器的 console 上打印東西，這個操作會影響到外部世界，違反了純函式不應該有副作用的原則。

### Same Input, Same Output

接著來探討純函式的另一個特性“相同輸入會得到相同輸出”，這也是所謂的 Referential Transparency（引用透明）的特性。

首先我們先來看一個函式：

```js
function sum(a, b) {
  return a + b;
}
sum(3, 4);
```

如果我們傳入 `3` 和 `4`，那麼就會得到 `7`，無論呼叫多少次，這個結果都是固定的。

我們再定義一個函式：

```js
function multiply(num) {
  return num * 2;
}
```

現在我們用 sum(3, 4) 作為 multiply 的輸入：

```js
multiply(sum(3, 4)); // 14
```

這裡的 sum(3, 4) 可以直接被它的結果 7 替換，而不會影響程式的執行結果：

```js
console.log(multiply(7)); // 14
```

你可以將函式呼叫替換為其結果，而不會改變程式的行為，這就是 Referential Transparency。

那麼這樣做會給我們什麼好處呢？

- **可讀性**：程式的行為變得更可預測，因為它不依賴於外部的狀態。
- **可維護性**：引用透明的函式不會更改任何外部狀態，因此我們不需要擔心在其他地方對這些狀態進行更改。
- **可重用性**：引用透明的函式可以在任何需要其計算結果的地方重用。
- **測試性**：我們可以獨立地測試這些函式，只需檢查它們的輸入和輸出即可。

## Idempotent

在數學和電腦科學中，「冪等性」（Idempotent）是指一個操作不論進行多少次，結果都不會再有所改變。但它不一定需要是純函式，例如，對於一個將特定資料庫欄位設定為特定值的函式，無論你呼叫它多少次，結果都會一樣，但由於這個函式有副作用（改變資料庫的狀態），所以它不是純函式。

```js
function notGood() {
  return Math.random()
}
function good() {
  return 5
}
Math.abs(Math.abs(10))
```

`notGood` 這個函式不是冪等的，因為每次呼叫都會回傳不同的結果，而 `good` 這個函式就是冪等的，因為每次呼叫都會回傳 `5`。而 `Math.abs()` 不管你取多少次絕對值，回傳值都是一樣的，所以也是冪等的。

## Imperative vs Declarative

指令式（Imperative）的程式設計關注的是"如何達成"目標：它提供了達成某項結果所需要的具體步驟。
相對的，宣告式（Declarative）的程式設計更關注於"應該達成什麼結果"或"目標狀態是什麼"：它關注於我們想要達成的目標，而不是達成這個目標的具體步驟。

有個簡單的例子可以說明這兩者之間的差異：

```js
// Imperative code
for (let i = 0; i < 3; i++) {
  console.log(i);
}
```

這個 for 迴圈就是一個典型的指令式程式碼，它明確地告訴電腦我們的目標：從 0 開始，當 `i` 小於 3 時，對 `i` 進行遞增，並在每一步中在控制台輸出 `i` 的值。

如果我們要以宣告式的方式達成相同的結果，那會是怎樣呢？

```js
// Declarative code
[0, 1, 2].forEach((i) => console.log(i));
```

這就是一個宣告式的過程，我們只需告訴電腦我們的目標：對陣列 `[0, 1, 2]` 做 `forEach` 的操作，並且在每次迭代中對 `i` 做 `console.log` 的操作，`forEach` 會自動幫我們處理迭代的邏輯（`forEach` 內部已經封裝好迴圈的邏輯），我們不需要自己去實作。

這種宣告式的方式有幾個優點：它往往更易讀、更簡短，而且更易維護，因為我們只需關注目標，而無需理解達成目標的具體步驟。

最後，函數式程式設計就是一種宣告式程式設計的形式。這是因為在函數式程式設計中，我們主要使用函數來表達我們的邏輯，而不是透過改變狀態或使用變數來達成我們的目標。這種方式讓我們的程式更加易讀，並且提升了程式的可維護性。

現代前端框架（例如 React 和 Vue）也是宣告式的，過去使用 jQuery 時，我們需要自己去操作 DOM，但現在我們只需告訴框架我們想要的結果，框架就會自動幫我們去操作 DOM。

## Immutability

在函數式程式設計中，我們盡可能地避免改變狀態，而是複製並創建新的狀態。這種特性稱為「不可變」（Immutability），它是函數式程式設計的核心概念之一。

舉例來說，假設我們有一個 obj 如下：

```js
const obj = {
  name: 'sheep';
}
```

當我們想要對 `obj` 進行操作時，會選擇創建 `obj` 的複製，對該複製進行操作，然後回傳新的物件，而不是直接修改 `obj`：

```js
function clone(obj) {
  return { ...obj }; // this is pure
}

function updateName(obj) {
  const obj2 = clone(obj);
  obj2.name = 'cute sheep';
  return obj2;
}

const updatedObj = updateName(obj);
console.log(updatedObj); // { name: 'cute sheep' }
console.log(obj); // { name: 'sheep' }
```

這樣的好處是，我們可以在任何時間點都可以回到 `obj` 的原始狀態，而不需要擔心 `obj` 的值被改變。

然而，這種方式有一個潛在的問題，就是每次都要複製整個物件可能會消耗大量的記憶體和效能，特別是當物件很大時。所以在實務上，會使用一些利用結構共享（structural sharing）的方式去實作的套件，例如 [immutable](https://immutable-js.github.io/immutable-js/) 或是使用 `Proxy` 實作的 [immer](https://immerjs.github.io/immer/)。

## High Order Functions and Closures

當一個函式接受另一個或多個函式作為參數，或是回傳另一個函式時，我們稱這個函式為高階函式（High Order Function，HOF）。

```js
const hof = (fn) => fn(5);
hof(function a(x) { return x }); // 5
```

在上面這個例子中，`hof` 就是一個高階函式，因為它接受一個函式 `a` 作為參數。

高階函式在 JavaScript 中有許多應用，例如 Array 的 `map`、`filter` 和 `reduce` 方法都是高階函式。它們能讓我們以更簡潔、更抽象的方式來處理資料。

閉包（Closure）是指一個函式可以存取它所建立時的作用域環境。這是 JavaScript 語言的特性之一，它允許我們在函式中創建私有變數，並封裝與控制這些變數的存取。

```js
function closure() {
  let count = 0;
  return function getCounter() {
    count++;
    return count;
  }
}

const increment = closure();
increment(); // 1
increment(); // 2
increment(); // 3
```

由於閉包的原因，`increment` 可以記住在外部函式 `closure` 中宣告的變數 `count`，因此即使外部的 `closure` 執行完畢後，`increment` 仍然可以繼續使用 `count` 變數。

這種特性使得閉包在函數式程式設計中非常有用，我們可以利用閉包來創建並控制私有變量，以避免全域變數的使用，並防止變量被意外修改。

```js
function closure() {
  let count = 55;
  return function getCounter() {
    return count;
  }
}

const getCounter = closure();
getCounter(); // 55
getCounter(); // 55
getCounter(); // 55
```

在這個例子中，`count` 變數就像是一個私有的變數。我們可以透過 `getCounter` 函式來存取到該變數，也可以確保其他人不會去修改到它，這是一個非常好用的特性，也被廣泛地應用在函數式式程式設計中。

## Currying

柯里化（Currying）是一種將接受多個參數的函式轉換成一系列的接受單一參數函式的技術，並且每次回傳一個新函式來處理下一個參數，當所有參數都已處理完畢時，才回傳最終運算結果。是個「將一個接受 n 個參數的 function，轉變成 n 個只接受一個參數的 function」的過程。

讓我們來看一個例子：

```js
const multiply = (a, b) => a * b;
multiply(3, 4); // 12
```

這是一個接受兩個參數的函式，我們可以將它轉換成一個接受一個參數的函式：

```js
const curriedMultiply = (a) => (b) => a * b;
curriedMultiply(3)(4); // 12
```

那這樣有什麼好處呢？
我們可以利用柯里化來創建一些可以重複使用的函式：

```js
const multiplyBy5 = curriedMultiply(5);
multiplyBy5(4); // 20
multiplyBy5(5); // 25
multiplyBy5(6); // 30
```

這樣我們就可以很方便地創建一個乘以 5 的函式，並且可以重複使用它。

## Partial Application

部分應用（Partial Application）指的是在已知一部分參數的情況下，產生一個新的函式。這個新的函式能夠記住那些已經傳入的參數，然後在呼叫時只需要提供剩餘的參數即可。部分應用和柯里化（Currying）都是函數式程式設計中重要的技巧，但他們的應用情境與設計邏輯有所不同。柯里化後的函式一次只接受一個參數，而部分應用則是通過固定一些參數來產生一個新的函式。

讓我們來看一下兩者的差異：

- currying

```js
const multiply = (a, b, c) => a * b * c;
const curriedMultiply = (a) => (b) => (c) => a * b * c;
curriedMultiply(3)(4)(10); // 120
```

- partial application

```js
const multiply = (a, b, c) => a * b * c;

// 使用 `bind` 創建部分應用函式，第一個參數為 `null` 表示我們不需要綁定 `this`
const partialMultiplyBy5 = multiply.bind(null, 5);
partialMultiplyBy5(4, 10); // 200
```

## Compose & Pipe

Compose 和 Pipe 都是用來組合並處理多個函式的工具，它們都會回傳一個新的函式，並且這個新的函式會將傳入的參數依序傳入到每個函式中，最後回傳最終的結果。
它們的區別在於函式執行的順序不同，Compose 是從右到左執行，而 Pipe 則是從左到右執行。

假設現在有一個需求是將一個數字 `-50` 乘以 `3`，然後取絕對值，我們可以這麼去實作：

```js
const compose = (f, g) => (data) => f(g(data));
const multiplyBy3 = (num) => num * 3;
const makePositive = (num) => Math.abs(num);
const multiplyBy3AndAbsolute = compose(multiplyBy3, makePositive); // 先取絕對值，再乘以 3

multiplyBy3AndAbsolute(-50); // 150
```

接下來我們來看看 Pipe 的實作：

```js
// 將 f 與 g 的順序對調
const pipe = (f, g) => (data) => g(f(data));
const multiplyBy3AndAbsolute = pipe(multiplyBy3, makePositive); // 先乘以 3，再取絕對值

multiplyBy3AndAbsolute(-50); // 150
```

兩者之間的差異只在於執行的順序不同：

```js
fn1(fn2(fn3(50)));
compose(fn1, fn2, fn3)(50);
pipe(fn3, fn2, fn1)(50);
```
> 兩者的呼叫結果都是 `fn1(fn2(fn3(50)))`

## Practice: Amazon shopping

```js
const user = {
  name: 'Kim',
  active: true,
  cart: [],
  purchases: [],
};

const amazonHistory = [];

const compose =
  (f, g) =>
  (...args) =>
    f(g(...args));

console.log(
  purchaseItem(
    emptyCart,
    buyItem,
    applyTaxToItems,
    addItemToCart
  )(user, { name: 'laptop', price: 200 })
);
// prints:
// {
//   name: 'Kim',
//   active: true,
//   cart: [],
//   purchases: [{ name: 'laptop', price: 260 }]
// }

function purchaseItem(...fns) {
  return fns.reduce(compose);
}

function addItemToCart(user, item) {
  amazonHistory.push(user);
  const updatedCart = [...user.cart, item];
  return { ...user, cart: updatedCart };
}

function applyTaxToItems(user) {
  amazonHistory.push(user);
  const { cart } = user;
  const taxRate = 1.3;
  const updatedCart = cart.map((item) => {
    return {
      name: item.name,
      price: item.price * taxRate,
    };
  });
  return { ...user, cart: updatedCart };
}

function buyItem(user) {
  amazonHistory.push(user);
  return { ...user, purchases: user.cart };
}

function emptyCart(user) {
  amazonHistory.push(user);
  return { ...user, cart: [] };
}
```
