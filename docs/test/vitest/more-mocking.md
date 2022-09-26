# More on Mocking & Diving Deeper

[JavaScript Unit Testing - The Practical Guide](https://www.udemy.com/course/javascript-unit-testing-the-practical-guide/) 課程筆記

## Mocking Global Values & Functions

有一個用到 fetch 方法的 async function 如下：

```js
export async function sendDataRequest(data) {
  const response = await fetch('https://dummy-site.dev/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new HttpError(response.status, 'Sending the request failed.', responseData);
  }

  return responseData;
}
```

fetch 是全域的 API，不屬於任何一個模組，所以沒辦法通過 `vi.mock` 的方式去替代它，這裡可以使用 `vi.stubGlobal` 去替代：

```js
const testResponseData = { testKey: 'testData' };

const testFetch = vi.fn((url, options) => {
  return new Promise((resolve, reject) => {
    const testResponse = {
      ok: true,
      json() {
        return new Promise((resolve, reject) => {
          resolve(testResponseData);
        });
      },
    };
    resolve(testResponse);
  });
});

vi.stubGlobal('fetch', testFetch);

describe('sendDataRequest()', () => {
  it('should return any available response data', () => {
    const testData = { key: 'test' };

    return expect(sendDataRequest(testData)).resolves.toEqual(testResponseData);
  });
});
```

接著在來完善一下這個測試，在原始的 fetch 中，如果傳入的 data 是沒辦法被 `stringify()` 的話，整個 promise 是會直接 reject 的，因此這裡在在針對 `testFetch` 做一點修改：

```js {3-5}
const testFetch = vi.fn((url, options) => {
  return new Promise((resolve, reject) => {
    if (typeof options.body !== 'string') {
      return reject('Not a string.');
    }
    const testResponse = {
      ok: true,
      json() {
        return new Promise((resolve, reject) => {
          resolve(testResponseData);
        });
      },
    };
    resolve(testResponse);
  });
});
```

然後新增一個測試案例：

```js
it('should convert the provided data to JSON before sending the request', async () => {
  const testData = { key: 'test' };

  let errorMessage;

  // 使用 try catch 取得錯誤訊息再去做斷言
  try {
    await sendDataRequest(testData);
  } catch (error) {
    errorMessage = error;
  }

  expect(errorMessage).not.toBe('Not a string.');
});
```
