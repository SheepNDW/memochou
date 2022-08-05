# Narrowing

###### tags: `TypeScript`

參考資料: [TypeScript 新手指南](https://willh.gitbook.io/typescript-tutorial/)、[TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

[Toc]

---

假設有一個 function 叫做 `padLeft`，如果 `padding` 是數值，它就會在 input 前加入多少 number 的空格，如果 `padding` 是字串，那就直接在加在 input 前面，試著寫出來後呈現如下：

```ts
function padLeft(padding: number | string, input: string): string {
  return " ".repeat(padding) + input;
  // 此時會看到 padding 出現紅色警告
  // Argument of type 'string | number' is not assignable to parameter of type 'number'.
  // Type 'string' is not assignable to type 'number'.
}
```

此時 TypeScript 警告說把 `number | string` 型別賦予給 `number` 可能無法得到我們想要的結果，也就是說我們沒有明確定義這裡的 `padding` 到底是不是 `number` 而且也沒有處理如果是 `string` 時要怎麼做。

因此要將可能為多種型別的變數縮限 (narrowing) 成單一型別，這樣一來就不會報警告了：

```ts
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input; // (parameter) padding: number
  }
  return padding + input; // (parameter) padding: string
}
```
> TS 在看到 if 中的 `typeof padding === "number"` 時，會將其理解為一種被稱作 type guard 的程式碼，並根據我們寫的判斷去推斷後面可能的型別為何

## `typeof` type guards 

JavaScript 提供了一個 `typeof` 運算子，它會檢驗運算元的型別，而 TypeScript 期待它傳回一組特定的字串：
- `"string"`
- `"number"`
- `"bigint"`
- `"boolean"`
- `"symbol"`
- `"undefined"`
- `"object"`
- `"function"`

在 TypeScript 中，檢查 typeof 回傳的值 `(typeof padding === "number")` 是一種型別保護 (type guard)。因為 TypeScript 編碼了 typeof 如何對不同的值進行操作，所以它知道它在 JavaScript 中的一些坑。

例如，請注意在上面的列表中，typeof 不返回 null。查看以下示例：

```ts
function printAll(strs: string | string[] | null) {
  if (typeof strs === 'object') {
    for (const s of strs) { // 這行的 strs 報了一個錯: Object is possibly 'null'.
      console.log(s);
    }
  } else if (typeof strs === 'string') {
    console.log(strs);
  } else {
    // ...
  }
}
```
> typeof null 會傳回 "object"，因此這邊只能讓 strs 的型別被縮限至 `string[] | null` 而不是期望中看到的 `string[]`


## Truthiness narrowing

在 JS 裡，我們常在條件句中使用表達式，例如 `&&` `||` 或是在 if 判斷式裡使用 `!`

```ts
function getUsersOnlineMessage(numUsersOnline: number) {
  if (numUsersOnline) {
    return `There are ${numUsersOnline} online now!`;
  }
  return "Nobody's here. :(";
}
```

在 JS 裡用 if 來讓條件強制以布林值去理解它們，再根據真假值來選擇它們的分支，像是如下的
- `0`
- `NaN`
- `""` (the empty string)
- `0n` (the `bigint` version of zero)
- `null`
- `undefined`

都會被強制轉成 `false`，反之的都為 `true`

你也可以使用 `Boolean()` 或是 `!!` 將所有值轉成布林值

```ts
// both of these result in 'true'
Boolean("hello"); // type: boolean, value: true
!!"world"; // type: true,    value: true
```

利用這種真值進行判斷的方式相當常見，尤其是在防範 null 或 undefined 之類的值時。例如，讓我們嘗試將它用於我們的 printAll 函式

```ts {2}
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === 'object') {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === 'string') {
    console.log(strs);
  }
}
```
> 透過檢查 strs 是否為 true，讓我們迴避了 TypeError: null is not iterable 的錯誤

::: warning ※ 常見錯誤：將最外層套一個 if 判斷是否為真
千萬不要做出這種事，這樣如果今天外面傳的是一個空字串進去就直接涼了
:::

```ts
function printAll(strs: string | string[] | null) {
  // !!!!!!!!!!!!!!!!
  //  DON'T DO THIS!
  // !!!!!!!!!!!!!!!!
  if (strs) {
    if (typeof strs === 'object') {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === 'string') {
      console.log(strs);
    }
  }
}
```

還有一個常見的利用真值去 narrow 的就是利用 `!` (邏輯 NOT) 去過濾掉假值的分支

```ts {5}
function multiplyAll(
  values: number[] | undefined,
  factor: number
): number[] | undefined {
  if (!values) {
    return values;
  } else {
    return values.map((x) => x * factor);
  }
}

console.log(multiplyAll([3, 4], 2));    // [6, 8]
console.log(multiplyAll(undefined, 2)); // undefined
```

## Equality narrowing

TypeScript 也可以使用 switch 語句還有 `===`, `!==`, `==`, `!=` 等運算子去做等值檢查進而限縮型別 (narrow types)，例如：

```ts
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // We can now call any 'string' method on 'x' or 'y'.
    x.toUpperCase(); // (method) String.toUpperCase(): string
    y.toLowerCase(); // (method) String.toLowerCase(): string
  } else {
    console.log(x); // (parameter) x: string | number
    console.log(y); // (parameter) y: string | boolean
  }
}
```

當我們在檢查 x 和 y 是否相等時，TS 也會知道它們的型別也要相等，由於它們共同的型別只有 `string`，於是 TS 知道了它們在第一個條件分支中必然為 `string`

檢查是否相等也可以用來使用在特定字面值上，在 Truthiness narrowing 時有提到一個常見的錯誤寫法，此時我們可以寫一個特定的檢查去排除掉 null，這樣一來 TypeScript 就可以正確地從型別裡移除 null

```ts {2}
function printAll(strs: string | string[] | null) {
  if (strs !== null) {
    if (typeof strs === 'object') {
      for (const s of strs) { // (parameter) strs: string[]
        console.log(s);
      }
    } else if (typeof strs === 'string') {
      console.log(strs); // (parameter) strs: string
    }
  }
}
```

JavaScript 更寬鬆的 `==` 和 `!=` 相等檢查也可以正確地限縮範圍，檢查某個值 `== null`，不僅可以檢查它具體是否為 `null` 也同時可以檢查它是否可能為 `undefined`，`== undefined`亦有同樣效果。

在下面例子中，如果想要同時檢查並排除 null 和 undefined 就可以使用 `!=`：
```ts {6}
interface Container {
  value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
  if (container.value != null) {
    console.log(container.value); // (property) Container.value: number
    container.value *= factor;
  }
}

multiplyValue({ value: 5 }, 6);         // 5
multiplyValue({ value: undefined }, 6); // 不打印
multiplyValue({ value: null }, 6);      // 不打印
```

## The `in` operator narrowing

在 JS 中有 `in` 運算子能夠用來確定某一個屬性在特定的物件或其原型鏈中，而  TS 將這視為一種限縮潛在型別的方式。

例如這段程式碼：`"value" in x`，`value` 是一個字串字面值而 `x` 是一個聯合型別的變數。如果是 `true` 則 `x` 具有可選或必需屬性的型別的值，如果是 `false` 則 `x` 具有可選或缺失屬性型別的值。

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    return animal.swim();
  }

  return animal.fly();
}
```

再次重申，可選屬性會存在於 narrow 後的兩側，例如人類既可游泳也可以飛行，因此應該出現在 `in` 檢查的兩側：

```ts {3}
type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void; fly?: () => void }; // 加上一個 Human 型別

function move(animal: Fish | Bird | Human) {
  if ('swim' in animal) {
    // (parameter) animal: Fish | Human
    return animal.swim();
  }

  // (parameter) animal: Bird | Human
  return animal.fly();
}
```
> 此時兩個 animal 都會飄紅並提示 `無法呼叫可能為 'undefined' 的物件。ts(2722)`

這裡可以使用型別斷言去解決報錯問題

```ts
function move(animal: Fish | Bird | Human) {
  if ('swim' in animal) {
    return (animal as Fish).swim();
  }

  return (animal as Bird).fly();
}
```

## `instanceof` narrowing

在 JS 中 `instanceof` 運算子可以用來判斷一個值是否是另一個值的實例 (instance)，比較的是原型 (prototype)，例如 `x instanceof Foo` 即檢查 Foo.prototype 是否存在於 x 的原型鍊 (prototype chain) 裡。

而 `instanceof` 也是一種型別保護 (type guard)，TS 會藉由 `instanceof` 限縮被 instanceof 保護的分支：

```ts
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString()); // (parameter) x: Date
  } else {
    console.log(x.toUpperCase()); // (parameter) x: string
  }
}

logValue(new Date()); // Wed, 03 Aug 2022 10:32:20 GMT
logValue('hello ts'); // HELLO TS
```

## Assignments

正如我們前面提到的，當我們為任何變數賦值時，TypeScript 會查看賦值的右側並適當地限縮左側。

```ts
// let x: string | number
let x = Math.random() < 0.5 ? 10 : 'hello world!';

x = 1;
console.log(x); // let x: number

x = 'goodbye!';
console.log(x); // let x: string
```

在這裡即使將 `x` assign 成 `number` 後，還是可以再次將它 assign 成 `string`，這是因為 x 在宣告的時候就被推斷為 `string | number`，所以 TypeScript 會根據宣告的型別來檢查。

如果試圖將 x 重新 assign 成 `boolean`，就會報錯：

```ts
x = true; // Type 'boolean' is not assignable to type 'string | number'.
```

## Control flow analysis (CFA)

到目前為止，我們已經透過一些基本案例來了解到 TypeScript 如何在特定分支中限縮範圍。

現在再回來看一下這個 padLeft 函式：

```ts
function padLeft(padding: number | string, input: string) {
  if (typeof padding === 'number') {
    return ' '.repeat(padding) + input;
  }
  return padding + input; // (parameter) padding: string
}
```

如果 padLeft 函式執行時從第一個 if 中 return，TypeScript 能夠分析此程式碼並發現到如果 padding 是 `number` 的情況下，下面的 return padding + input 是無法訪問到的，因此它會在函式剩下的部分把 `number` 從 padding 的型別中去除 (從 `string | number` narrow 成 `string`) 。

這種基於可達性的代碼分析稱為**控制流分析(CFA)**，TypeScript 在遇到型別保護(type guards)和賦值(assignments)時使用這種流分析來限縮型別。
當分析一個變數時，控制流(control flow)可以一次又一次地分裂和重新合併，並且可以觀察到該變數在每個點具有不同的型別。

```ts
function example() {
  let x: string | number | boolean;

  x = Math.random() < 0.5;
  console.log(x); // let x: boolean

  if (Math.random() < 0.5) {
    x = 'hello';
    console.log(x); // let x: string
  } else {
    x = 100;
    console.log(x); // let x: number
  }

  return x; // let x: string | number
}

let x = example();

x = 'hello';
x = 100;
x = true; // 類型 'boolean' 不可指派給類型 'string | number'。ts(2322)
```
> example 函式在最後回傳出去時 x 型別已經變成 `string | number`

## Using type predicates

到目前為止，我們已經使用現有的 JavaScript 結構來處理限縮範圍，但是有時你仍希望能更直接地控制型別在整段程式碼中的變化方式。

如果我們要定義一個使用者自定義 type guard，可以定義一個函式，讓它的回傳值是個型別謂語 (type predicates) 即可，型別謂語的語法為：`參數名稱(parameterName) is 型別(Type)`。

```ts
type Fish = {
  name: string;
  swim: () => void;
};
type Bird = {
  name: string;
  fly: () => void;
};

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined; 
  // 將 pet 斷言為 Fish 這樣就型別就一定會有 swim
}
```
> 範例中的 `pet is Fish` 就是型別謂語，型別謂語只能用在單一傳入值，且會回傳布林值，而當回傳值是 true 時，TypeScript 就會將變數的型別限縮到某一型別 (例如範例中就是 Fish)

接著來定義一個 getSmallPet 函式，讓它每次被呼叫時隨機回傳一種 pet：

```ts
function getSmallPet(): Fish | Bird {
  let fish: Fish = {
    name: 'sharkey',
    swim: () => {},
  };

  let bird: Bird = {
    name: 'sparrow',
    fly: () => {},
  };

  return Math.random() < 0.5 ? bird : fish;
}

let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim(); // let pet: Fish
} else {
  pet.fly(); // let pet: Bird
}
```

從上面的例子可以知道 TypeScript 不僅知道在 if 分支中 pet 為 Fish，還知道它在 else 中沒有 Fish 所以必須是 Bird。

你還可以透過使用 type guard `isFish` 去過濾一個 `Fish | Bird` 陣列來獲得一個 `Fish` 陣列：

```ts
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];

const underWater: Fish[] = zoo.filter(isFish);
// 等同於
const underWater2: Fish[] = zoo.filter(isFish) as Fish[];

// 對於更複雜的範例，謂語可能需要重複
const underWater3: Fish[] = zoo.filter((pet): pet is Fish => {
  if (pet.name === 'frog') return false;
  return isFish(pet);
});
```

## Discriminated unions
> 使用 `|` 聯合多個介面的時候，透過一個共有的屬性形成可辨識聯合

到目前為止我們的範例都聚焦在使用簡單的型別(如字串、布林值和數值)來限縮單個變數的範圍。雖然這很常見，但在 JavaScript 中大多數時候我們將要處理稍微複雜的結構。

為了激發靈感，想像一下今天我們創造了一些業務試圖去對圓形和方形進行編碼，圓形要記錄它們的半徑，正方形要記錄它們的邊長。我們將使用一個叫做 `kind` 的欄位來判斷我們正在處理的形狀。

這裡我們實作了一個介面 `Shape`：

```ts
interface Shape {
  kind: 'circle' | 'square'; // 這裡使用了字串字面值定義型別
  radius?: number;
  sideLength?: number;
}
```

在這邊我們使用了字串字面值 (string literal types): `'circle'` 和 `'square'` 來分別告訴我們這個形狀應該要是圓還是正方形，通過使用 `'circle' | 'square'` 而不是直接使用 `string` 可以避免拼錯字問題。

```ts
function handleShape(shape: Shape) {
  // oops! 
  if (shape.kind === 'rect') {
    // 因為類型 '"circle" | "square"' 與 '"rect"' 未重疊，所以此條件永遠會傳回 'false'。ts(2367)
  }
}
```

再來寫一個 getArea 函式來去求出面積，首先來寫求圓面積的邏輯：

```ts
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2; // 物件可能為「未定義」。ts(2532)
}
```

因為 radius 可能是 undefined 所以這裡拋出了一個錯誤，但如果我們對 `kind` 屬性加了適當的檢查呢？

```ts
function getArea(shape: Shape) {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius ** 2; // 物件可能為「未定義」。ts(2532)
  }
}
```
> 由於當初定義 interface 時 radius 是可選的，因此即使確定 kind 是 'circle' 此時的 radius 的型別仍然為： (property) Shape.radius?: number | undefined

好喔... TypeScript 還是不知道這裡該做什麼，此刻我們比型別檢查更清楚這裡的值是什麼，可以嘗試使用非空斷言 (non-null assertion) 來斷言半徑一定存在。

```ts {3}
function getArea(shape: Shape) {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius! ** 2; // 在 radius 後加上一個 !
  }
}
```

但這不是一個很理想的做法，我們在此不得不使用非空斷言說服型別檢查器 (type-checker) `shape.radius` 已經被定義，但如果我們開始移動程式碼，這些斷言很容易出現錯誤。
此外，在 strictNullChecks 之外，我們都可以意外地去訪問到這些欄位 (因為在讀取它們時假設可選屬性始終存在)，我們在這絕對可以做得更好。

編碼這段 `Shape` 的問題在於 type-checker 無法依據 `kind` 屬性知道 `radius` 或 `sideLength` 是否存在。我們需要將我們所知道的訊息傳達給 type-checker，考慮到了這一點，讓我們重新定義 `Shape`

```ts
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Square {
  kind: 'square';
  sideLength: number;
}

type Shape = Circle | Square;
```

在這裡，我們已經適當地將 `Shape` 分成了兩種型別，它們的 `kind` 屬性具有不同的值，但是 `radius` 和 `sideLength` 在它們各自的型別中被宣告為必填的屬性。

現在讓我們試著去訪問 `Shape` 中的 `radius` 看看會發生什麼事：

```ts
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
  //類型 'Shape' 沒有屬性 'radius'。
  // 類型 'Square' 沒有屬性 'radius'。ts(2339)
}
```

就像第一次定義 `Shape` 時一樣，這裡依然噴出了錯誤。當 `radius` 是可選的時，我們得到一個錯誤（啟用了 strictNullChecks），因為 TypeScript 無法判斷該屬性是否存在，現在 `Shape` 是一個 union，TypeScript 告訴我們 `shape` 可能是一個 `Square`，而 `Square` 上沒有定義半徑！ 
兩種解釋都是對的，但只有在 `Shape` 是聯合型別時，無論你怎麼設定 strictNullChecks，它都會拋出錯誤。

但如果此時我們再次使用 if 判斷對 `kind` 進行 narrow 呢？

```ts
function getArea(shape: Shape) {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius ** 2; // (parameter) shape: Circle
  }
}
```

我們成功排除了錯誤！當聯合 (union) 中的每一個型別都包含了共同的 literal types 屬性時，TypeScript 就會認為這是一個 *discriminated union*，並且可以去 narrow 聯合的成員範圍。

在上面的例子中，`kind` 是共同的屬性 (被認為是 `Shape` 中可判別的屬性)，檢查 `kind` 屬性是否為 `'circle'`，排除了在 `Shape` 裡 `kind` 屬性型別不是 `'circle'` 的所有型別，此舉讓 `Shape` 的型別被 narrow 成了 `Circle`。

同樣的檢查也適用於 switch 語句，現在我們可以試著不使用任何的 `!` (non-null assertions) 去書寫完整的 `getArea` 函式了：

```ts
function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2; // (parameter) shape: Circle
    case 'square':
      return shape.sideLength ** 2; // (parameter) shape: Square
  }
}
```
> 你可以發現到在不同 case 裡，TypeScript 都可以在編輯器中給出正確的關鍵字提示

向 TypeScript 傳遞正確的資訊 (Circle 和 Square 實際上分別是兩個具有特定 `'kind'` 欄位的型別) 是非常重要的，這麼做可以讓我們撰寫型別安全的 TypeScript 程式碼，並和之前寫 JavaScript 時沒有什麼不同。如此一來，type system 就能夠正確地在 switch 的分支中判斷出應有的型別。

更多 Discriminated Unions 的實際使用場合可以參考此篇：
> [Discriminated Unions & Unreachable Error](https://pjchender.dev/typescript/ts-narrowing/#discriminated-unions--unreachable-error) @ PJCHENder

## The `never` type

在對型別範圍進行 narrowing 時，你可以將聯合中的選項減少到消除所有可能性並且一無所有的程度，在這些情況下，TypeScript 將會使用 `never` 型別來表示一個不應該存在的狀態。

## Exhaustiveness checking

`never` 型別可以被分配給每種型別，但是沒有任何型別可以被分配給 `never` (除了 `never` 自己)。這代表你可以在 switch 語句中去 narrow 並依靠 `never` 去做窮舉檢查。

舉例來說，我們在 `getArea` 函式裡新增一個 `default`，它會在所有的可能都沒被 case 到的時候將 shape 分配給 `never`：

```ts {7-9}
function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2; // (parameter) shape: Circle
    case 'square':
      return shape.sideLength ** 2; // (parameter) shape: Square
    default:
      const _exhaustiveCheck: never = shape; // (parameter) shape: never
      return _exhaustiveCheck; 
  }
}
```

如果在 `Shape` 聯合裡新增一個 type，TypeScript 就會報錯：

```ts
interface Triangle {
  kind: 'triangle';
  sideLength: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape; // (parameter) shape: Triangle
      // Type 'Triangle' is not assignable to type 'never'.
      return _exhaustiveCheck;
  }
}
```

