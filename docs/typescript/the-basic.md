---
outline: deep
---

# The Basic

###### tags: `TypeScript`

參考資料: [TypeScript 新手指南](https://willh.gitbook.io/typescript-tutorial/)、[TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## 安裝 TypeScript

```sh
npm install -g typescript
```

以上指令會在全域性環境下安裝 tsc 指令，安裝完成之後，我們就可以在任何地方執行 tsc 指令了。

### ※ 補充：[ts-node](https://www.npmjs.com/package/ts-node)

使用 `ts-node` 可以省去每次我們要查看執行結果時都要切到編譯後的 JS 檔裡跑 `node` 指令

```sh
# 全域安裝
npm install -g ts-node
```

使用方式：`ts-node script.ts`

## Hello TypeScript

在目錄下新增一個`hello.ts`檔案並輸入以下方程式碼後，打開終端機輸入並執行 `tsc hello.ts`

```typescript
function greet(person, date) {
  console.log(`hello ${person}, today is ${date}.` );
}

greet('綿羊', '2022-07-20')
```


此時會自動產生一個編譯後的檔案 `hello.js`

```javascript
function greet(person, date) {
  console.log(`hello ${person}, today is ${date}.`);
}
greet('綿羊', '2022-07-20');
```

不過此時控制台會報一個錯說函式名稱重複了，接著請在終端裡輸入：`tsc --init`

接著會變成 greet 函式中的兩個參數 person 和 date 報了`參數 'person' 隱含了 'any' 類型`的錯，解決方法是在剛剛 init 出來的 tsconfig.json 檔中把`"strict": true`給註解掉。

### 自動監聽編譯 `tsc --watch`

在終端輸入`tsc --watch`可以開啟 TS 根據 .ts 檔的變化自動編譯出新的 .js 檔案

### 在報錯的時候終止 js 檔案的產生 `tsc --noEmitOnError`

**TypeScript 編譯的時候即使報錯了，還是會產生編譯結果**，我們仍然可以使用這個編譯之後的檔案。

例如：
```typescript
function greet(person, date) {
  console.log(`hello ${person}, today is ${date}.` );
}

greet('Sheep') // 不傳第二個參數給它, 它仍會產生一個 JS 檔並且可以執行
```

此時如果要阻止它繼續編譯產生 JS 檔，可以使用`tsc --noEmitOnError`指令，或是在`tsconfig.json`中配置`noEmitOnError`即可。
此時把剛剛的 JS 刪掉再重新編譯就會發現不會有 JS 出現了。

## 顯式型別 Explicit Types

如果在嚴格模式下，不給 person 和 date 定義型別的話，TS 就會編譯錯誤。

修改 `hello.ts`
```typescript
function greet(person: string, date: Date) {
  console.log(`hello ${person}, today is ${date.toDateString()}!` );
}

greet('Sheep', new Date());
```

> Keep in mind, we don’t always have to write explicit type annotations. In many cases, TypeScript can even just infer (or “figure out”) the types for us even if we omit them. 
> 
> 我們不用每次都給變數寫明確的型別，TS 會根據原始資料的型別去推斷出一個型別

定義一個 msg 讓他一開始是字串，TypeScript 會在沒有明確的指定型別的時候推測出一個型別，此時不會報錯並且將它修改成其他字串也能正常運作，但是只要將它改成不是字串的資料時，它就會報一個`類型 'number' 不可指派給類型 'string'`的錯。

```typescript
let msg = 'hello there!'; // 不會報錯
msg = 'hello world'; // 可以正常修改
msg = 100 // Type 'number' is not assignable to type 'string'.
```

## 編譯降級 Downleveling

透過 TS 編譯出來的 JS 檔的原始碼如下：

```javascript
`Hello ${person}, today is ${date.toDateString()}!`
```

預設編譯出的 JS 檔都會是 ES6 的語法，如果需要降級的話需要在 config 檔中設定

```json
"target": "es2016" // 把此行改成 "target": "es5"
```

此時再執行`tsc --watch`，編譯出的結果為：

```javascript
"hello ".concat(person, ", today is ").concat(date.toDateString(), "!")
```

## 嚴格模式 Strictness

在某些情況TS不會去做型別推論，而是退回最原始的 any，打開 noImplicitAny 將對任何型別被隱式推斷為 any 的變數發出錯誤。

例如：

```javascript
function greet(person, date) { // 此時的 person 和 date 都將被視為 any
  console.log(`hello ${person}, today is ${date.toDateString()}!`);
}
```

在`tsconfig.json`中設定嚴格模式
```json
"noImplicitAny": true,   // 不隱式轉換 any
"strictNullChecks": true // 檢查 null 和 undefined
```

而上方兩個設定都可以被涵蓋在 `"strict": true` 裡，只要打開嚴格模式就自動會開啟
