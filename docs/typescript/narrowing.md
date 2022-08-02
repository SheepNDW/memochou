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
  if (typeof strs === "object") {
    for (const s of strs) { // 這行的 strs 報了一個錯: Object is possibly 'null'.
      console.log(s);
    }
  } else if (typeof strs === "string") {
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
    if (typeof strs === "object") {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === "string") {
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

TypeScript 也可以使用 switch 語句還有 `===`, `!==`, `==`, `!=` 等運算子去做等值檢查進而縮小型別 (narrow types)，例如：

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

JavaScript 更寬鬆的 `==` 和 `!=` 等式檢查也可以正確地縮小範圍，檢查某個值 `== null`，不僅可以檢查它具體是否為 `null` 也同時可以檢查它是否可能為 `undefined`，`== undefined`亦有同樣效果。

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
