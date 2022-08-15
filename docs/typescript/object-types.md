# Object Types

###### tags: `TypeScript`

[Toc]

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
