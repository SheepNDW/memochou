# 工具型別 - Partial & Pick

> [`Partial<Type>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype) <br>
> [`Pick<Type, Keys>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)

## Partial

傳入一個型別參數，將此型別中的所有屬性變為 optional

### 原始碼：

```ts
/**
 * Make all properties in T optional
 */
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

- `keyof` 將一個物件的全部屬性提取成 union type
- `in` 去遍歷每一個 key （union 中的每一項）
- `?` 轉成 optional type
- `T[P]` 索引存取符，從 T 中存取 P 所代表的型別 

### 範例：

```ts
type Person = {
  name: string;
  age: number;
  address: string;
};

type p = Partial<Person>;
```

此時這個 p 的型別就會變成：

```ts
type p = {
  name?: string | undefined;
  age?: number | undefined;
  address?: string | undefined;
}
```

## Pick

從一個物件型別的屬性中，選擇一組屬性（字串字面值或字串字面值聯合）並回傳一個新的型別

### 原始碼：

```ts
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

- 吃兩個型別參數：T 為一個物件型別，K 為 T 的一個或一組屬性 key 的型別
- 透過 `extends` 對泛型 K 做限制，必須為 T 中所包含的屬性 key
- 使用 mapped types 來產生對應的型別

### 範例：

```ts
type Person = {
  name: string;
  age: number;
  address: string;
};

type p = Pick<Person, 'age' | 'name'>;
```

此時 p 的型別就會是：

```ts
type p = {
  age: number;
  name: string;
}
```
