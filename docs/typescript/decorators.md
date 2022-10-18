---
outline: deep
---

# 裝飾器 Decorators

裝飾器目前還是 JS 的實驗性語法，要在 TS 使用它之前需要在 `tsconfig.json` 裡將 `experimentalDecorators` 選項給打開：

```ts
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

## Decorators

TypeScript 的裝飾器為一個函式，並以 `@expression` 的形式去使用，`expression` 求值後必須為一個函式，它會在執行時被呼叫。

## Class Decorator

先來寫一個最基本的類別裝飾器：

```ts
function Logger(constructor: Function) {
  console.log('Logging...');
  console.log(constructor);
}

@Logger
class Person {
  name = 'Sheep';

  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();

console.log(pers);
```

此時在控制台打印出來的東西長這樣：

![](https://i.imgur.com/lXTq2jp.png)

我們可以發現 Decorator 會先被打印出來，然後才是 constructor 中的 log，這是因為 Decorator 是在定義類別時執行的，而不是在類別被實例化時執行。

## Decorator Factory

除了上面那種寫法之外，還可以定義一個裝飾器工廠 (Decorator Factory)，它基本上會回傳一個裝飾器函式，但是我們可以將它做為裝飾器指派給某個需要裝飾的東西。

```ts
// 使用裝飾器工廠我們就能接受傳參，並讓內部回傳的裝飾器函式可以使用
function Logger(logString: string) {
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

// 使用方式就是直接在這呼叫並傳入自訂的參數
@Logger('LOGGING - PERSON')
class Person {
  name = 'Sheep';

  constructor() {
    console.log('Creating person object...');
  }
}
```

此時可以看到打印出的結果出現了我們自訂的字串：

![](https://i.imgur.com/ozXiVag.png)

這可以讓我們更加靈活的去使用裝飾器。

我們還可以同時使用多個裝飾器：

```ts
function Logger(logString: string) {
  console.log('LOGGER FACTORY');
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

function WithTemplate(template: string, hookId: string) {
  console.log('TEMPLATE FACTORY');
  return function (constructor: any) {
    console.log('Rendering template');
    const hookEl = document.getElementById(hookId);
    const p = new constructor();
    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector('h1')!.textContent = p.name;
    }
  };
}

@Logger('LOGGING')
@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person {
  name = 'Sheep';

  constructor() {
    console.log('Creating person object...');
  }
}
```

![](https://i.imgur.com/tomqrZ7.png)

> 裝飾器的執行順序為 bottom-up


## Property Decorator

裝飾器還可以使用在類別中的欄位裡：

```ts
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator!');
  console.log(target, propertyName);
}

class Product {
  @Log
  title: string;
  private _price: number;

  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Invalid price - should be positive!');
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  getPriceWithTax(tax: number) {
    return this._price * (1 + tax);
  }
}
```

![](https://i.imgur.com/f1SF8iB.png)


