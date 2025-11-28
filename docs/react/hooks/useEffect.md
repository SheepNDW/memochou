---
outline: deep
---


# useEffect

useEffect 是 React 中用於處理副作用（side effects）的 hook。透過 useEffect，我們可以執行一些帶有副作用的操作，例如資料抓取、訂閱事件等。

## 什麼是副作用函式？什麼是純函式？

### 純函式（Pure Function）

純函式是指在相同的輸入下，總是會回傳相同的輸出，且不會對外部狀態產生任何影響的函式，這也意味著純函式的行為是可預測的。純函式不會修改外部狀態也不會依賴外部可變狀態。

### 副作用函式（Side Effect Function）

副作用函式則是指在執行過程中會影響外部狀態或依賴外部可變狀態的函式。函式行為的可預測性降低，但是副作用不一定是壞事，有時候副作用的效果才是我們想要的。

常見的帶有副作用的操作包括：

- 資料抓取（fetching data）
- 操作 DOM
- 操作 storage（localStorage、sessionStorage）
- 計時器（setTimeout、setInterval）

```ts
let globalVar = 0;

function effectFunction(x: number): number {
  globalVar += x; // 修改外部變數

  localStorage.setItem('globalVar', `${globalVar}`); // 修改 localStorage

  fetch('/api/data').then((res) => {/* ... */}); // 發送網路請求

  document.querySelector('#app').textContent = `Value: ${globalVar}`; // 修改 DOM element

  return globalVar;
}
```

## useEffect 的使用方式

```tsx
useEffect(setup, deps?)
```

- `setup`: 一個帶有副作用的函式，並且可以選擇性地回傳一個清理函式（cleanup function）。元件掛載時會執行 `setup`，依賴項改變時會先執行 `cleanup`，然後再執行 `setup`，在元件卸載時也會執行 `cleanup`。
- `deps?`: 一個可選的依賴陣列，包含 `setup` 函式中所使用到的響應式值（state、props 等），或是自己在元件中定義的變數或函式。如果不傳入 `deps`，則每次元件重新渲染時都會執行 `setup`。


### 基本使用

#### 操作 DOM

```tsx
import { useEffect } from 'react';

function App() {
  const dom = document.getElementById('data');
  console.log(dom); // null

  useEffect(() => {
    const data = document.getElementById('data');
    console.log(data); // <div id="data">Hello World</div>
  }, []);

  return (
    <>
      <div id="data">Hello World</div>
    </>
  );
}
```

#### 打 API 抓資料

```tsx
useEffect(() => {
  fetch('https://api.example.com/data')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}, []);
```

## 執行時機

- 元件掛載時（Mounting）：當元件第一次被渲染到 DOM 時，會執行 `setup` 函式。
- 依賴項改變時（Updating）：當 `deps` 陣列中的任一值發生變化時，會先執行 `cleanup` 然後再執行 `setup`。
- 元件卸載時（Unmounting）：當元件從 DOM 中被移除時，會執行 `cleanup` 函式。

如果沒有為 useEffect 提供依賴陣列，則 effect 中的副作用函式會在**每次**元件渲染**完成**後執行。例如：

```tsx
import { useEffect, useState } from 'react';

function Count() {
  const [count, setCount] = useState(0);

  const add = () => {
    setCount((c) => c + 1);
  };

  // 這裡每次輸出的都是前一次的舊值
  console.log(document.querySelector('h1')?.innerHTML);

  // 在元件每次渲染完成之後，都會重新執行 effect 中的副作用函式
  useEffect(() => {
    console.log(document.querySelector('h1')?.innerHTML);
  });

  return (
    <>
      <h1>目前的 count 值：{count}</h1>
      <button onClick={add}>+1</button>
    </>
  );
}
```

### 有依賴陣列的情況

如果 deps 陣列為空陣列 `[]`，則 effect 中的副作用函式只會在元件首次渲染完成後執行一次，之後當元件重新渲染時不會再執行。

將剛才的範例修改如下：

```tsx
useEffect(() => {
  console.log(document.querySelector('h1')?.innerHTML);
}); // [!code --]
}, []); // [!code ++]
```

現在不論我們點擊多少次按鈕，useEffect 中的 `console` 只會執行一次。

如果想要有條件地去觸發 useEffect 的重新執行，則需要在 deps 陣列放入指定的依賴值。

React 會在每次元件渲染完成後，去比對前後兩次的依賴值是否有改變，只要有任何一個依賴值改變了，都會觸發 useEffect 的重新執行。反之，如果所有依賴值都沒有改變，則不會觸發 useEffect 的重新執行。

我們接著調整剛才的範例，讓 useEffect 只在 count 改變時才執行，而 flag 不論怎麼改變都不會觸發 useEffect：

```tsx
function Count() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  const add = () => {
    setCount((c) => c + 1);
  };

  useEffect(() => {
    console.log(document.querySelector('h1')?.innerHTML);
  }, [count]);

  return (
    <>
      <h1>目前的 count 值：{count}</h1>
      <p>Flag 為 {`${flag}`}</p>
      <button onClick={add}>+1</button>
      <button onClick={() => setFlag((f) => !f)}>Toggle Flag</button>
    </>
  );
}
```

::: tip 注意
不建議將物件型別作為 useEffect 的依賴值，因為 React 內部是使用 `Object.is()` 來比較前後兩次的依賴值是否相等，而如果是一般物件型別的話，每次重新渲染時都會產生一個新的物件參考，導致 useEffect 每次都被觸發執行，這樣就失去了使用依賴陣列的意義。
:::

## 清理副作用（Cleanup）

如果元件裡面使用了訂閱事件、計時器等副作用操作，通常需要在元件卸載或依賴值改變時進行清理，避免 memory leak 或不必要的效能消耗。

### 清除定時器

我們來看一個範例，當 `name` 值改變時，useEffect 會設定一個計時器，在 3 秒後更新 `greeting` 狀態。如果在 3 秒內 `name` 再次改變，則需要清除之前的計時器，避免多個計時器同時存在。

```tsx
import { useState, useEffect } from 'react';

function App() {
  const [name, setName] = useState('Sheep');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setGreeting(`Hello, ${name}!`);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [name]);

  return (
    <div>
      <label>
        輸入名字：
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </label>
      <p>{greeting}</p>
    </div>
  );
}
```

### 元件卸載時清理

我們來看另一個範例，當元件掛載時掛上了一個記錄滑鼠游標位置的事件偵聽器，當元件卸載時需要將事件偵聽器移除。

```tsx
import { useEffect, useState } from 'react';

function MouseInfo() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 定義滑鼠移動的事件處理函式
    const mouseMoveHandler = (e: MouseEvent) => {
      console.log({ x: e.clientX, y: e.clientY });
      setPosition({ x: e.clientX, y: e.clientY });
    };

    // 元件在首次掛載時，註冊滑鼠移動事件偵聽器
    window.addEventListener('mousemove', mouseMoveHandler);

    // 回傳一個清理函式，在元件卸載時移除事件偵聽器
    return () => window.removeEventListener('mousemove', mouseMoveHandler);
  }, []);

  return (
    <div>
      <p>滑鼠游標位置：{`X: ${position.x}, Y: ${position.y}`}</p>
    </div>
  );
}

function App() {
  const [flag, setFlag] = useState(false);

  return (
    <div>
      <button onClick={() => setFlag(!flag)}>Toggle Mouse Info</button>
      {flag && <MouseInfo />}
    </div>
  );
}
```

## 倒計時工具範例

一個非常常見也是面試常考的情境是實作一個倒數計時器（countdown timer）。使用者呼叫一個 `useCountdown` 的 custom hook，並傳入初始的秒數，然後這個 hook 會回傳目前剩餘的秒數以及一個禁用狀態，表示倒數計時是否結束。

::: code-group

```tsx [hooks/useCountdown.ts]
import { useEffect, useState } from 'react';

export function useCountdown(initialSeconds = 10): [number, boolean] {
  initialSeconds = Math.round(Math.abs(initialSeconds)) || 10;

  const [remaining, setRemaining] = useState(initialSeconds);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (remaining <= 0) return;

    const timer = setTimeout(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setIsFinished(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [remaining]);

  return [remaining, isFinished];
}
```

```tsx [components/Countdown.tsx]
import { useCountdown } from '@/hooks/useCountdown';

function Countdown() {
  const [remaining, isFinished] = useCountdown(5);

  const handleClick = () => {
    console.log('送出');
  };

  return (
    <>
      <button disabled={!isFinished} onClick={handleClick}>
        {isFinished ? '確認' : `請詳閱條款 (${remaining} 秒)`}
      </button>
    </>
  );
}
```

:::


## 處理非同步操作中的競爭條件

下面有一個情境是，使用者在搜尋框中輸入 id 來取得使用者資料。假設使用者快速地輸入了多個 id，導致多個非同步的 fetch 請求同時進行，這時候可能會發生競爭條件（race condition），最終顯示的資料並不是最後一次輸入的 id 所對應的資料。

```tsx
import { useEffect, useState } from 'react';

interface UserData {
  name: string;
  id: number;
  email: string;
  username: string;
  phone: string;
  website: string;
}

function SearchUser() {
  const [userId, setUserId] = useState(1);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data: UserData = await res.json();
        setUserData(data);
        setError(null);
      } catch (err) {
        setError(`Error: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(Number(e.target.value));
  };

  return (
    <div>
      <h1>Search User</h1>
      <label htmlFor="userId">
        User ID:
        <input id="userId" type="number" value={userId} onChange={handleChange} />
      </label>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {userData && (
        <div>
          <h2>User Details</h2>
          <p>Name: {userData.name}</p>
          <p>ID: {userData.id}</p>
          <p>Email: {userData.email}</p>
          <p>Username: {userData.username}</p>
          <p>Phone: {userData.phone}</p>
          <p>Website: {userData.website}</p>
        </div>
      )}
    </div>
  );
}
```

### Race Condition 的影響

- 狀態不一致：最後顯示的資料不一定對應到最後一次輸入。
- 額外的生命週期問題：如果元件 unmount 之後請求才結束，又在回傳結果後更新 state，會造成「嘗試更新已卸載元件」的情況，因此我們也會在 cleanup 階段中止請求，讓它跟著 effect 生命週期結束。

### 解決方案 - 利用 cleanup 機制

我們可以利用 useEffect 的 cleanup 機制配合 `AbortController` 來解決這個問題。每次發起新的 fetch 請求時，都會中止前一次的請求，確保只有最後一次的請求會更新狀態。

```tsx tsx{2,10,36}
  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const data: UserData = await res.json();
        setUserData(data);
      } catch (err) {
        const error = err as Error;

        // 如果是主動中止 (例如 userId 改變或元件卸載)，就直接忽略
        if (error.name === 'AbortError') return;

        setError(`Error: ${error.message}`);
        setUserData(null); // 視需求決定要不要清掉舊資料
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // userId 改變或元件卸載時中止請求
    return () => {
      controller.abort();
    };
  }, [userId]);
```

## 注意事項

1. 不要在 useEffect 中改變依賴陣列中的值，這會導致無限迴圈。
2. 多個不同功能的副作用應該拆分成多個 useEffect，而不是放在同一個 useEffect 中。
3. 使用之前應該要先想想是否真的需要 useEffect，有時候可以透過其他方式達成相同的效果，應該將其視為最後的手段。（延伸閱讀：[You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)）

## 參考資料

- [React 官方文件 - useEffect](https://react.dev/reference/react/useEffect)
