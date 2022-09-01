---
outline: deep
---

# Template Literal Types

###### tags: `TypeScript`

參考資料: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)、[冴羽 TypeScript 系列](https://ts.yayujs.com/)


## 樣板字面值型別 Template Literal Types

樣板字面值型別以字串字面值型別 (string literal type) 為基礎，可以通過聯合擴展成多個字串。

它們跟 JavaScript 的樣板字面值是一樣的語法，但是只能用在型別操作中。當使用樣板字面值型別時，它會替換樣板中的變數，回傳一個新的字串字面值：

```ts
type World = 'world';
type Greeting = `hello ${World}`;
// type Greeting = "hello world"
```

當內插中的變數是一個聯合型別時，每個可能的字串字面值都會被表示：

```ts
type EmailLocaleIDs = 'welcome_email' | 'email_heading';
type FooterLocaleIDs = 'footer_title' | 'footer_sendoff';

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// type AllLocaleIDs = "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
```

如果樣板字面值裡的多個內插都是聯合型別，結果會交叉相乘，比如下面的例子就有 2 * 2 * 3 一共 12 種結果：

```ts
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = 'en' | 'ja' | 'pt';

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
// type LocaleMessageIDs = "en_welcome_email_id" | "en_email_heading_id" | "en_footer_title_id" | "en_footer_sendoff_id" | "ja_welcome_email_id" | "ja_email_heading_id" | "ja_footer_title_id" | "ja_footer_sendoff_id" | "pt_welcome_email_id" | "pt_email_heading_id" | "pt_footer_title_id" | "pt_footer_sendoff_id"
```

如果真的是非常長的字串聯合，推薦提前生成，這種還是適用於短一些的情況。

### String Unions in Types

樣板字面值最有用的地方在於你可以基於一個型別內部的資訊，定義一個新的字串，讓我們看到下面這個範例：

有一個函式 `makeWatchedObject`，它會給傳入的物件新增一個 `on` 方法。在 JavaScript 中，它的調用看起來是這樣：`makeWatchedObject(baseObject)`，我們假設傳入的物件是長這樣：

```ts
const passedObject = {
  firstName: 'Sheep',
  lastName: 'Yang',
  age: 25,
};
```

`on` 方法會被新增到這個傳入的物件，此方法接收兩個參數， `eventName` (`string`) 和 `callBack` (`function`)：

```ts
// pseudocode
const result = makeWatchedObject(baseObject);
result.on(eventName, callBack);
```

我們希望 `eventName` 是這種形式：`attributeInThePassedObject + "Changed"`。舉個例子，`passedObject` 有一個屬性 `firstName`，對應產生的 `eventName` 為 `firstNameChanged`，同理，`lastName` 對應的是 `lastNameChanged`，`age` 對應的是 `ageChanged`。

當 `callBack` 被呼叫的時候：

* 應該被傳入與 `attributeInThePassedObject` 相同型別的值。比如 `passedObject` 中，`firstName` 的值型別為 `string`，對應 `firstNameChanged` 事件的回呼函式則接受傳入一個 `string` 的值，`age` 的值型別為 `number`，對應 `ageChanged` 事件的回呼函式則接受傳入一個 `number` 的值。
* return type 為 `void`。

`on()` 方法的簽章 (signature) 最一開始是這樣：`on(eventName: string, callBack: (newValue: any) => void)`，但是使用這樣的簽章無法實現上面說的限制，這時就可以使用樣板字面值：

```ts
const person = makeWatchedObject({
  firstName: 'Sheep',
  lastName: 'Yang',
  age: 25,
});

// makeWatchedObject has added `on` to the anonymous Object
person.on('firstNameChanged', (newValue) => {
  console.log(`firstName was changed to ${newValue}!`);
});
```

注意這個例子裡，`on` 方法新增的事件名為 `"firstNameChanged"`，而不僅是 `"firstName"`，而 callback 傳入值 `newValue`，我們希望限制為 `string`。我們先實現第一點。

在這個例子中，我們希望傳入的事件名的型別是物件屬性名的聯合，只是每個聯合成員都在最後拼接一個 `Changed`，在 JavaScript 中，我們可以做這樣一個計算：

```ts
Object.keys(passedObject).map((x) => `${x}Changed`)
```

而在型別系統裡，樣板字面值提供了一個類似的字串操作方法：

```ts
type PropEventSource<Type> = {
  on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};

// Create a "watched object" with an 'on' method
// so that you can watch for changes to properties.
declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;
```

注意，在範例中樣板字面值裡寫的是 `string & keyof Type`，如果只寫成 `keyof Type` 呢？

```ts
type PropEventSource<Type> = {
  on(eventName: `${keyof Type}Changed`, callback: (newValue: any) => void): void;
};
/*
類型 'keyof Type' 不可指派給類型 'string | number | bigint | boolean | null | undefined'。
  類型 'string | number | symbol' 不可指派給類型 'string | number | bigint | boolean | null | undefined'。
    類型 'symbol' 不可指派給類型 'string | number | bigint | boolean | null | undefined'。ts(2322)
*/
```

從報錯訊息中可以看出原因，`keyof` 會回傳 `string | number | symbol` 型別，但是樣板字面值的變數要求的型別卻是 `string | number | bigint | boolean | null | undefined`，相比之下多了一個 `symbol` 型別，所以這裡其實可以這樣寫：

```ts
type PropEventSource<Type> = {
  on(eventName: `${Exclude<keyof Type, symbol>}Changed`, callback: (newValue: any) => void): void;
};
```

或是這樣寫：

```ts
type PropEventSource<Type> = {
  on(eventName: `${Extract<keyof Type, string>}Changed`, callback: (newValue: any) => void): void;
};
```

通過這種方式定義型別後，我們嘗試使用錯誤的事件名去調用 `on` 的時候，TypeScript 就會報錯：

```ts
person.on('firstNameChanged', () => {});

// 誤將 key 當作事件名
person.on('firstName', () => {});
// 類型 '"firstName"' 的引數不可指派給類型 '"firstNameChanged" | "lastNameChanged" | "ageChanged"' 的參數。ts(2345)

// 打錯字
person.on('frstNameChanged', () => {});
// 類型 '"frstNameChanged"' 的引數不可指派給類型 '"firstNameChanged" | "lastNameChanged" | "ageChanged"' 的參數。ts(2345)
```


### Inference with Template Literals

現在來實現第二點，回呼函式傳入值的型別與對應屬性值的型別相同。我們現在只是簡單的對 `callBack` 的參數使用 `any`。實現這個限制的關鍵在於借助泛型函式：

1. 取得泛型函式第一個參數的字面值，生成一個字面值型別
2. 該字面值型別可以被物件屬性構成的聯合限制
3. 物件屬相的型別可以通過索引存取獲取
4. 應用此型別，確保回呼函式的參數型別與物件屬性的型別是同樣的

```ts
type PropEventSource<Type> = {
  on<Key extends string & keyof Type>(
    eventName: `${Key}Changed`,
    callback: (newValue: Type[Key]) => void
  ): void;
};

declare function makeWatchedObject<Type>(
  obj: Type
): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: 'Sheep',
  lastName: 'Yang',
  age: 25,
});

person.on('firstNameChanged', newName => { // (parameter) newName: string
  console.log(`new name is ${newName.toUpperCase()}`);
})

person.on('ageChanged', newAge => { // (parameter) newAge: number
  if (newAge < 0) {
    console.warn("warning! negative age");
  }
})
```

這裡我們把 `on` 改成了一個泛型函式。

當一個用戶調用的時候傳入 `"firstNameChanged"`，TypeScript 會嘗試著推論 `Key` 正確的型別。它會匹配 `key` 和 `"Changed"` 前的字串，然後推論出字串 `"firstName"`，然後再獲取原始物件的 `firstName` 屬性的型別，在這個例子中，就是 `string` 型別。

## Intrinsic String Manipulation Types

TypeScript 的一些型別可以用於字串操作，這些型別因為效能考量被內置在編譯器中，你不能在 `.d.ts` 檔案裡找到它們。

### `Uppercase<StringType>`

將字串中的每個字符都改成大寫：

```ts
type Greeting = 'Hello, world';
type ShoutyGreeting = Uppercase<Greeting>;
// type ShoutyGreeting = "HELLO, WORLD"

type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`;
type MainID = ASCIICacheKey<'my_app'>;
// type MainID = "ID-MY_APP"
```

### `Lowercase<StringType>`

將字串中的每個字符都改成小寫：

```ts
type Greeting = 'Hello, world';
type QuietGreeting = Lowercase<Greeting>;
// type QuietGreeting = "hello, world"

type ASCIICacheKey<Str extends string> = `id-${Lowercase<Str>}`;
type MainID = ASCIICacheKey<'MY_APP'>;
// type MainID = "id-my_app"
```

### `Capitalize<StringType>`

將字串中的第一個字符轉換為大寫字母：

```ts
type LowercaseGreeting = 'hello, world';
type Greeting = Capitalize<LowercaseGreeting>;
// type Greeting = "Hello, world"
```
### `Uncapitalize<StringType>`

將字串中的第一個字符轉換為小寫字母：

```ts
type UppercaseGreeting = 'HELLO WORLD';
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>;
// type UncomfortableGreeting = "hELLO WORLD"
```

::: details 字串操作型別的技術細節
從 TypeScript 4.1 開始，這些內置函式會直接使用 JavaScript 字串執行時函式，而不是 locale aware。
```ts
function applyStringMapping(symbol: Symbol, str: string) {
  switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
    case IntrinsicTypeKind.Uppercase:
      return str.toUpperCase();
    case IntrinsicTypeKind.Lowercase:
      return str.toLowerCase();
    case IntrinsicTypeKind.Capitalize:
      return str.charAt(0).toUpperCase() + str.slice(1);
    case IntrinsicTypeKind.Uncapitalize:
      return str.charAt(0).toLowerCase() + str.slice(1);
  }
  return str;
}
```
:::