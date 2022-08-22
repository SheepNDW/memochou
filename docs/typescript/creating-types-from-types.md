# Creating Types from Types

###### tags: `TypeScript`

TypeScript 的型別系統非常強大，因為它允許我們使用其他型別去表達型別。

這個想法最簡單的形式就是泛型 (generics)，在實際開發中可以使用各式各樣的型別運算子 (type operator) 來操作，也可以使用已經擁有的值來表示型別。

我們可以透過各種 type operator 去用簡潔、可維護的方式去表達複雜的操作以及值。在這個章節我們將介紹根據現有的型別或值來表達新型別的方法。

* [Generics](/typescript/generics) - Types which take parameters
* [Keyof Type Operator](/typescript/keyof-types) - Using the `keyof` operator to create new types
* [Typeof Type Operator](/typescript/typeof-types) - Using the `typeof` operator to create new types
* [Indexed Access Types](/typescript/indexed-access-types) - Using `Type['a']` syntax to access a subset of a type
* [Conditional Types](/typescript/conditional-types) - Types which act like if statements in the type system
* [Mapped Types](/typescript/mapped-types) - Creating types by mapping each property in an existing type
* [Template Literal Types](/typescript/template-literal-types) - Mapped types which change properties via template literal strings