# Integration Tests

[JavaScript Unit Testing - The Practical Guide](https://www.udemy.com/course/javascript-unit-testing-the-practical-guide/) 課程筆記

## 寫一個整合測試

課程中隊整合測試的認定是測試一個內涵其他函式的測試，例如下面這個例子：

```js
export function cleanNumbers(numberValues) {
  const numbers = [];
  for (const numberInput of numberValues) {
    validateStringNotEmpty(numberInput);
    const number = transformToNumber(numberInput);
    validateNumber(number);
    numbers.push(number);
  }

  return numbers;
}
```

`cleanNumbers` 的回傳值會受到 `validateStringNotEmpty`、`transformToNumber`、`validateNumber` 三個函式執行結果所影響，整合測試即是將這三個合在一起放在 `cleanNumbers` 的測試裡，我們只觀察最後 `cleanNumbers` 的測試結果有沒有通過。

實作 `cleanNumbers` 函式的測試：

```js
describe('cleanNumbers()', () => {
  it('should return an array of number values if an array of string number values is provided', () => {
    const numberValues = ['1', '2'];

    const cleanedNumbers = cleanNumbers(numberValues);

    expect(cleanedNumbers[0]).toBeTypeOf('number');
  });

  it('should throw an error if an array with at least one empty string is provided', () => {
    const numberValues = ['', 1];

    const cleanFn = () => cleanNumbers(numberValues);

    expect(cleanFn).toThrow();
  });
});
```

測試一個函式的同時也測試了複數個函式，雖然這可以節省很多時間，但是實際上開發者必須要拿捏好單元測試和整合測試之間的平衡點，而不是完全偏重某一方。一般情況下單元測試的數量會比整合測試來得多。
