# Conditional Types

###### tags: `TypeScript`

參考資料: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)、[冴羽 TypeScript 系列](https://ts.yayujs.com/)

## 條件判斷 Conditional Types

很多時候，我們需要基於輸入的值來決定輸出的值，同樣我們也需要基於輸入的值的型別來決定輸出的值的型別。Conditional types 就是用來幫助我們描述輸入型別和輸出型別之間的關係。

```ts
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}

// type Example1 = number
type Example1 = Dog extends Animal ? number : string;

// type Example2 = string
type Example2 = RegExp extends Animal ? number : string;
```

Conditional types 的寫法很像是 JavaScript 的條件運算式 (`condition` ? `trueExpression` : `falseExpression`)：

```ts
SomeType extends OtherType ? TrueType : FalseType;
```

