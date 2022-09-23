# Advanced Testing Concepts

[JavaScript Unit Testing - The Practical Guide](https://www.udemy.com/course/javascript-unit-testing-the-practical-guide/) 課程筆記

## `toBe()` vs `toEqual()`

用上一章的範例來舉例這兩個差在哪：

```js
describe('cleanNumbers()', () => {
  it('should return an array of number values if an array of string number values is provided', () => {
    const numberValues = ['1', '2'];

    const cleanedNumbers = cleanNumbers(numberValues);

    expect(cleanedNumbers).toBe([1, 2]);   // fail
    expect(cleanedNumbers).toEqual([1, 2]); // pass
  });

  // ...
});
```

因為 `toBe` 會是完全的相等，而物件在 js 中是 reference value，即使他們長很像但參考位置不同。而 `toEqual()` 則會去深度比較兩物件的值和形狀是否一樣，如果一樣就通過，不會去看參考位置是否一樣。

## 非同步程式碼的測試

有一個可以生成 token 的非同步函式如下：

```js
import jwt from 'jsonwebtoken';

export function generateToken(userEmail, doneFn) {
  jwt.sign({ email: userEmail }, 'secret123', doneFn);
}

// 呼叫方式
// generateToken('test@test.com', (err, token) => {
//   console.log(token);
// });
```

我們不需要去對第三方的庫進行測試，因此這裡我們只需要確定最後有一個 token 回傳即可：

```js
import { expect, it } from 'vitest';
import { generateToken } from './async-example';

// 在 callback 中傳入一個 done 參數，它會在非同步執行完畢後執行
it('should generate a token value', (done) => {
  const testUserEmail = 'test@test.com';

  generateToken(testUserEmail, (err, token) => {
    // 使用 try catch 去操作成功或是失敗的 callback
    try {
      expect(token).toBeDefined();
      // expect(token).toBe(2);
      done();
    } catch (err) {
      done(err);
    }
  });
});
```

如果在高版本的 Vitest 去寫上面的寫法應該會看到如下的警告：

![](https://i.imgur.com/wUyX1Gm.png)

:::warning 注意
從 Vitest v0.10.0 開始，上面 callback style 寫法已經被廢棄，取而代之的是你可以使用 `async/await` 或是使用 Promise 來模擬 callback style
:::

* Promise 寫法：
```js
it('should generate a token value', () =>
  new Promise((resolve, reject) => {
    const testUserEmail = 'test@test.com';

    generateToken(testUserEmail, (err, token) => {
      try {
        expect(token).toBe(2);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }));
```

### 使用 Promise & async/await 測試非同步程式碼

如果要測試的函式是一個 Promise，如下：

```js
export function generateTokenPromise(userEmail) {
  const promise = new Promise((resolve, reject) => {
    jwt.sign({ email: userEmail }, 'secret123', (error, token) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
  });

  return promise;
}
```

則可以使用 Promise 的寫法或是 async/await 寫法去測試：

```js
it('should generate a token value', () => {
  const testUserEmail = 'test@test.com';

  // return promise 斷言，確保 Vitest / Jest 等待 promise 執行完
  return expect(generateTokenPromise(testUserEmail)).resolves.toBeDefined();
});

// 使用 async 註記的函式會隱式 return promise，所以不用 return
it('should generate a token value', async () => {
  const testUserEmail = 'test@test.com';

  const token = await generateTokenPromise(testUserEmail);

  expect(token).toBeDefined();
});
```

## Testing Hooks

文檔上又稱為 Setup and Teardown，這些 hook 可以讓我們進到測試的生命週期，以避免重複設置和拆卸程式碼。它們作用於當前上下文，如果在頂層使用，則會作用於檔案；如果在 `describe` 內，則作用於該 suite 中。

案例：有一個名為 User 的類別，現在要對其屬性方法進行測試。

```js
// hooks.js
export class User {
  constructor(email) {
    this.email = email;
  }

  updateEmail(newEmail) {
    this.email = newEmail;
  }

  clearEmail() {
    this.email = '';
  }
}
```

在不使用 hook 的情況下，你或許會這樣去寫測試：

```js
// hooks.spec.js
import { it, expect } from 'vitest';

import { User } from './hooks';

it('should update the email', () => {
  const testEmail = 'test@test.com';
  const newTestEmail = 'test2@test.com';

  const user = new User(testEmail);
  user.updateEmail(newTestEmail);

  expect(user.email).toBe(newTestEmail);
});

it('should have an email property', () => {
  const testEmail = 'test@test.com';

  const user = new User(testEmail);

  expect(user).toHaveProperty('email');
});

it('should store the provided email value', () => {
  const testEmail = 'test@test.com';

  const user = new User(testEmail);

  expect(user.email).toBe(testEmail);
});

it('should clear the email', () => {
  const testEmail = 'test@test.com';

  const user = new User(testEmail);
  user.clearEmail();

  expect(user.email).toBe('');
});

it('should still have an email property after clearing the email', () => {
  const testEmail = 'test@test.com';

  const user = new User(testEmail);
  user.clearEmail();

  expect(user).toHaveProperty('email');
});
```

可以看到在上面的測試程式碼中不斷地重複宣告 `testEmail` 還有重新 new 了一個 `user`。

此時也許有人會想把這兩件事給提出去作為一個公共的變數使用：

```js
const testEmail = 'test@test.com';
const user = new User(testEmail);

it('should update the email', () => {
  const newTestEmail = 'test2@test.com';

  user.updateEmail(newTestEmail);

  expect(user.email).toBe(newTestEmail);
});

it('should have an email property', () => {
  expect(user).toHaveProperty('email');
});

it('should store the provided email value', () => {
  expect(user.email).toBe(testEmail);
});

it('should clear the email', () => {
  user.clearEmail();

  expect(user.email).toBe('');
});

it('should still have an email property after clearing the email', () => {
  user.clearEmail();

  expect(user).toHaveProperty('email');
});
```

看起來一切安好但是測試一跑下去直接就 Fail 了：

![](https://i.imgur.com/Fy8gKca.png)

這是因為我們在 `should update the email` 的測試中將 email 給更新了，導致後來的測試受到影響，此時 Vitest 提供的 Hook 就派上用場了：

* beforeAll - 目前 context 開始前
* beforeEach - 測試案例開始前
* afterEach - 測試案例結束後
* afterAll - 目前 context 結束後

```js
const testEmail = 'test@test.com';
let user;

beforeAll(() => {
  user = new User(testEmail);
  console.log('beforeAll()');
});

// 在每次測試案例開始前 reset 掉 user
beforeEach(() => {
  user = new User(testEmail);
  console.log('beforeEach()');
});
afterEach(() => {
  // user = new User(testEmail);
  console.log('afterEach()');
});
afterAll(() => {
  console.log('afterAll()');
});

it('should update the email', () => {
  const newTestEmail = 'test2@test.com';

  user.updateEmail(newTestEmail);

  expect(user.email).toBe(newTestEmail);
});

it('should have an email property', () => {
  expect(user).toHaveProperty('email');
});

it('should store the provided email value', () => {
  expect(user.email).toBe(testEmail);
});

it('should clear the email', () => {
  user.clearEmail();

  expect(user.email).toBe('');
});

it('should still have an email property after clearing the email', () => {
  user.clearEmail();

  expect(user).toHaveProperty('email');
});
```
