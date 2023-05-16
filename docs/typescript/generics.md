# 泛型 Generics 

## Generic Function

有一個 `merge` 函式，它會將傳入的兩個物件合併起來：

```ts
function merge(objA: object, objB: object) {
  return { ...objA, ...objB };
}
```

乍看之下沒什麼問題，但如果我們將函式回傳值給儲存起來時會發現到 TypeScript 並沒有辦法去解析這個回傳的物件具體有什麼東西：

```ts
const mergeObj = merge({ name: 'Sheep' }, { age: 25 });
mergeObj.age; // 類型 '{}' 沒有屬性 'age'。ts(2339)
```
> TypeScript 只推論出回傳一個 `{}` 但它沒有攜帶任何我們可以使用的資訊

將案例用泛型改寫：

```ts
// function merge<T, U>(objA: T, objB: U): T & U
function merge<T, U>(objA: T, objB: U) {
  return { ...objA, ...objB };
}

const mergeObj = merge({ name: 'Sheep' }, { age: 25 });
/*  const mergeObj: {
        name: string;
    } & {
        age: number;
    } 
*/
```

使用泛型之後，TypeScript 就會正確理解這兩個參數是一個具體的型別（實際傳入參數的型別），而不只是未知的 `object`。

而由於泛型太過自由，也產生了新的問題如下：

```ts
// 由於沒有限制 T, U 的具體型別，所以這邊直接傳入一個 number 也能通過編譯
const mergeObj = merge({ name: 'Sheep', hobbies: ['sports'] }, 25);
```

要解決這個問題就需要對泛型進行限制 (constraint)：

```ts
function merge<T extends object, U extends object>(objA: T, objB: U) {
  return { ...objA, ...objB };
}
```
> 此時 IDE 就會對剛剛的 25 發出錯誤提示

再來看另外一個使用 `extends` 對泛型函式進行限制的案例：

```ts
interface Lengthy {
  length: number;
}

// 使用 extends 確保這個 T 必須要有 length 屬性
function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let descriptionText = 'Got no value.';
  if (element.length === 1) {
    descriptionText = 'Got 1 element.';
  } else if (element.length > 1) {
    descriptionText = 'Got ' + element.length + ' elements.';
  }
  return [element, descriptionText];
}

console.log(countAndDescribe('Hi there!')); // ['Hi there!', 'Got 9 elements.']
console.log(countAndDescribe(['Sports', 'Cooking'])); // [Array(2), 'Got 2 elements.']
console.log(countAndDescribe([])); // [Array(0), 'Got no value.']
console.log(countAndDescribe(10)); // error
```

除了 `extends` 還可以使用 `keyof` 對泛型進行限制：

```ts
// 使用 keyof T 確保 key 值一定存在
function extractAndConvert<T extends object, U extends keyof T>(
  obj: T,
  key: U
) {
  return 'Value: ' + obj[key];
}

extractAndConvert({ name: 'Sheep' }, 'name')
```

## Generic Class

除了函式之外，類別也可以使用泛型來變得更加靈活，例如：

```ts
class DataStorage<T> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}

const textStorage = new DataStorage<string>();
textStorage.addItem('Sheep');
textStorage.addItem('Hitsuji');
textStorage.removeItem('Sheep');
console.log(textStorage.getItems()); // ['Hitsuji']

const numberStorage = new DataStorage<number>();
```

也是乍看之下一切都是那麼美好，但如果今天是使用 objectStorage 就出大事了：

```ts
const objectStorage = new DataStorage<object>();
objectStorage.addItem({ name: 'Sheep' });
objectStorage.addItem({ name: 'Hitsuji' });
objectStorage.removeItem({ name: 'Hitsuji' });
console.log(objectStorage.getItems()); // [{name: 'Sheep'}]
```

這是因為物件在 JavaScript 中是 reference，因此在實作中的 indexOf 總是會回傳 -1 所以會從陣列的末尾開始然後刪除最後一項。

在這個案例中最好的做法是確保 `DataStorage` 只能和純值一起使用：

```ts
class DataStorage<T extends string | number | boolean> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    if (this.data.indexOf(item) === -1) return;
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}
```

## Generic Utility Types

### Partial

有時候在寫程式時會遇到下面這種情況，我們會先給定一個空物件，然後才往裡面去添加屬性，但是在 TypeScript 裡會收到錯誤警告：

```ts
interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

function createCourseGoal(
  title: string,
  description: string,
  date: Date
): CourseGoal {
  let courseGoal = {};
  courseGoal.title = title; // error
  courseGoal.description = description; // error
  courseGoal.completeUntil = date; // error
  return courseGoal; // error
}
```

如果給初始的 courseGoal 指定型別的話，則最初的空物件會報錯：

```ts
let courseGoal: CourseGoal = {};
// 類型 '{}' 在類型 'CourseGoal' 中缺少下列屬性: title, description, completeUntil
```

此時可以使用內建的 `Partial` 型別，告訴 TypeScript 這個物件最終會是什麼型別：

```ts
function createCourseGoal(
  title: string,
  description: string,
  date: Date
): CourseGoal {
  let courseGoal: Partial<CourseGoal> = {};
  courseGoal.title = title;
  courseGoal.description = description;
  courseGoal.completeUntil = date;

  // return 時斷言為 CourseGoal 告訴 TS 它已經不再是 Partial
  return courseGoal as CourseGoal;
}
```

`Partial` 型別提供了開發者需要逐步添加屬性的彈性。

### Readonly

TypeScript 提供了一個內建的泛型 `Readonly` 讓我們可以鎖定特定的型別使其為唯獨的：

```ts
const names: Readonly<string[]> = ['Sheep', 'Hitsuji'];

// 此時如果想對 names 進行增刪等操作都會報錯
names.push('Bob');
names.pop();
```

可以參考文件看更多 [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
