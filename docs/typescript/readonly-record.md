# 工具型別 - Readonly & Record

> [`Readonly<Type>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype) <br>
> [`Record<Keys, Type>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)

## Readonly

建立一個將傳入的物件型別中所有屬性設定成`唯讀`的型別，意味著這個型別的所有的屬性全都不可以重新賦值。

### 原始碼：

```ts
/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

> 跟 [Partial](/typescript/partial-pick.html#partial) 很像只是改成了 `readonly`

### 範例：

```ts
type Person = {
  name: string;
  age: number;
  address: string;
};

type personOnly = Readonly<Person>;
```

此時 `personOnly` 的型別為：

```ts
type personOnly = {
  readonly name: string;
  readonly age: number;
  readonly address: string;
}
```

且一旦定義為 readonly 即不能再修改屬性的值：

```ts
const person: Readonly<Person> = {
  name: 'sheep',
  age: 100,
  address: 'taipei',
};

person.age = 18;
// Cannot assign to 'age' because it is a read-only property.ts(2540)
```

## Record

`Record<Keys, Type>` 建立一個物件型別，他的所有 key 都會是 `Keys` 型別，value 都是 `Type` 型別。

### 原始碼：

```ts
/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

- `keyof any` 會回傳一個 `string | number | symbol` 的 union

### 範例：

```ts
type Person = {
  name: string;
  age: number;
};

type K = 'A' | 'B' | 'C';

type People = Record<K, Person>;
/* 
type People = {
  A: Person;
  B: Person;
  C: Person;
} 
*/

const obj: People = {
  A: { name: 'aaa', age: 18 },
  B: { name: 'bbb', age: 18 },
  C: { name: 'ccc', age: 18 },
};
```
