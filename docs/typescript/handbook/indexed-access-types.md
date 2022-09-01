# Indexed Access Types

###### tags: `TypeScript`

參考資料: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)、[冴羽 TypeScript 系列](https://ts.yayujs.com/)

---

我們可以使用索引存取型別 (*indexed access type*) 來查找另外一個型別上的特定屬性：

```ts
type Person = {
  age: number;
  name: string;
  alive: boolean;
};

type Age = Person['age']; // type Age = number

let age: Age = 100;
age = '100'; // 類型 'string' 不可指派給類型 'number'。ts(2322)
```

因為索引名本身就是一種型別，因此我們也可以使用 `union`、`keyof` 或是其他型別：

```ts
interface Person {
  age: number;
  name: string;
  alive: boolean;
}

// type I1 = string | number
type I1 = Person['age' | 'name'];
const i11: I1 = 100;    // OK
const i12: I1 = '100';  // OK
const i13: I1 = true;   // Error

// type I2 = string | number | boolean
type I2 = Person[keyof Person];
const i21: I2 = '100';
const i22: I2 = 100;   // OK
const i23: I2 = true;  // OK
const i24: I2 = {};    // Error

type AliveOrName = 'alive' | 'name';
type I3 = Person[AliveOrName];
const i31: I3 = true;    // OK
const i32: I3 = 'hello'; // OK
const i33: I3 = 100;     // Error
```

如果你嘗試查找一個不存在的屬性，TypeScript 會報錯：

```ts
type I1 = Person['alve'];
// Property 'alve' does not exist on type 'Person'.
```

接下來是另外一個範例，我們使用 `number` 來獲取陣列元素的型別。結合 `typeof` 可以方便的捕獲陣列字面值的元素型別：

```ts
const MyArray = [
  { name: 'Alice', age: 15 },
  { name: 'Bob', age: 23 },
  { name: 'Eve', age: 38 },
];

// // type Person = { name: string; age: number; }
type Person = typeof MyArray[number];

const p: Person = {
  name: 'sheep',
  age: 18,
};

// type Age = number
type Age = typeof MyArray[number]['age'];

// type Age2 = number
type Age2 = Person['age'];
```

索引只能是型別，這意味著你不能使用一個變數：

```ts
const key = 'age';
type Age = Person[key];
/*
類型 'key' 無法作為索引類型。ts(2538)
'key' 為值，但在此處卻作為類型使用。您是否是指 'typeof key'?ts(2749)
*/
```

但是你可以用型別別名做到類似的重構：

```ts
type key = 'age';
type Age = Person[key];
```

## 實戰案例 
> 取自冴羽大大文章中範例程式碼

假設有這樣一個業務場景，一個頁面要用在不同的APP 裡，比如 MOMO、蝦皮、Line pay，根據所在 APP 的不同，調用的底層 API 會不同，我們可能會這樣寫：

```ts
const APP = ['MOMO', 'Shopee', 'LinePay'];

function getPhoto(app: string) {
  // ...
}

getPhoto('MOMO');     // OK
getPhoto('whatever'); // OK
```

如果只是對 app 限制為 `string` 型別，即使傳入其他字串也不會導致報錯，我們可以使用字面值聯合型別來進行限制：

```ts
const APP = ['MOMO', 'Shopee', 'LinePay'];
type app = 'MOMO' | 'Shopee' | 'LinePay';

function getPhoto(app: app) {
  // ...
}

getPhoto('MOMO'); // OK
getPhoto('whatever'); // NOT OK
```

但是重複寫兩遍有點冗，我們要怎麼根據一個陣列獲取它的所有值的字串聯合型別呢? 此時可以結合上篇的 `typeof` 和本節內容實現：

```ts
const APP = ['MOMO', 'Shopee', 'LinePay'] as const;
type app = typeof APP[number];

function getPhoto(app: app) {
  // ...
}

getPhoto('MOMO'); // OK
getPhoto('whatever'); // NOT OK
```

### 解析：

首先是使用 `as const` 將陣列轉為 `readonly` 的元組 (tuple)：

```ts
const APP = ['MOMO', 'Shopee', 'LinePay'] as const;
// const APP: readonly ["MOMO", "Shopee", "LinePay"]
```

但此時 `APP` 還是一個值，通過 `typeof` 取得 `APP` 的型別：

```ts
type typeOfAPP = typeof APP;
// type typeOfAPP = readonly ["MOMO", "Shopee", "LinePay"]
```

最後再通過 indexed access types 取得字串聯合：

```ts
type app = typeof APP[number];
// type app = "MOMO" | "Shopee" | "LinePay"
```