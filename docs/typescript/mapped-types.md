# Mapped Types

###### tags: `TypeScript`

參考資料: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)、[冴羽 TypeScript 系列](https://ts.yayujs.com/)


## 映射型別 Mapped Types

有的時候，一個型別要基於另外一個型別，但你又不想拷貝一份，這個時候可以考慮使用映射型別 (Mapped Type)。

Mapped Type 建立在 index signature 的語法上，用在宣告未提前宣告的屬性型別：

```ts
// 當你需要提前宣告屬性的型別時
type OnlyBoolsAndHorses = {
  [key: string]: boolean | Horse;
};

const conforms: OnlyBoolsAndHorses = {
  del: true,
  rodney: 123,
};
```

而 Mapped Type，就是使用了 `PropertyKeys` 聯合型別的泛型，其中 `PropertyKeys` 多是通過 `keyof` 建立，然後循環遍歷 key 值建立一個型別：

```ts
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
```

在這個例子裡，`OptionsFlags` 會遍歷 `Type` 所有的屬性，然後設為 `boolean` 型別。

```ts
type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<FeatureFlags>;
/*
type FeatureOptions = {
    darkMode: boolean;
    newUserProfile: boolean;
}
*/
```

## 映射修飾符 Mapping Modifiers

在使用 Mapped Type 的時候有兩個額外的修飾符可以使用，一個是 `readonly`，用於設置屬性唯讀，一個是 `?`，用於設置屬性可選。

你可以透過前綴 (prefix) `-` 或是 `+` 來刪除或是添加這些修飾符，如果你不寫前綴，則預設為 `+`

```ts
// 移除屬性中的 'readonly' 屬性
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
  readonly id: string;
  readonly name: string;
};

type UnlockedAccount = CreateMutable<LockedAccount>;
/*
type UnlockedAccount = {
    id: string;
    name: string;
}
*/
```

```ts
// 移除屬性中的可選屬性
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};

type User = Concrete<MaybeUser>;
/*
type User = {
    id: string;
    name: string;
    age: number;
}
*/
```

## 通過 `as` 實現 Key 的重新映射 Key Remapping via `as`

在 TypeScript 4.1 以後，你可以使用 `as` 語句重新映射型別中的 key：

```ts
type MappedTypeWithNewProperties<Type> = {
  [Properties in keyof Type as NewKeyType]: Type[Properties]
}
```

你可以利用樣板字面值型別 (template literal types)，基於之前的屬性名建立一個新屬性名：

```ts
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
}

interface Person {
  name: string;
  age: number;
  location: string;
}

type LazyPerson = Getters<Person>;
/*
type LazyPerson = {
    getName: () => string;
    getAge: () => number;
    getLocation: () => string;
}
*/
```

你也可以利用 conditional type 回傳一個 `never` 去過濾掉某些屬性：

```ts
// 移除 'kind' 屬性
type RemoveKindField<Type> = {
  [Property in keyof Type as Exclude<Property, 'kind'>]: Type[Property];
};

interface Circle {
  kind: 'circle';
  radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;
/*
type KindlessCircle = {
    radius: number;
}
*/
```

你還可以去遍歷任何聯合，不僅僅是 `string | number | symbol` 這種聯合，可以是任何型別的聯合：

```ts
type EventConfig<Events extends { kind: string }> = {
  [E in Events as E['kind']]: (event: E) => void;
};

type SquareEvent = { kind: 'square'; x: number; y: number };
type CircleEvent = { kind: 'circle'; radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>;
/*
type Config = {
    square: (event: SquareEvent) => void;
    circle: (event: CircleEvent) => void;
}
*/
```

## 深入探索 Further Exploration

Mapped Type 可以很好地跟本章節 (Type Manipulation) 的其他功能搭配使用，舉例來說，現在有一個使用 Conditional Type 的 Mapped Type，它會根據一個物件的屬性 pii 是否設置為 true 回傳 true false：

```ts
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
  id: { format: 'incrementing' };
  name: { type: string; pii: true };
};

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
/*
type ObjectsNeedingGDPRDeletion = {
    id: false;
    name: true;
}
*/
```
