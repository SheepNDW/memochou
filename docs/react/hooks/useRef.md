# useRef

`useRef` 函式會回傳一個可變的 ref 物件，其 `.current` 屬性被初始化為傳入的參數。並且這個回傳的 ref 物件在整個元件的生命週期中保持不變。

## 語法

```tsx
import { useRef } from 'react';

const ref = useRef(initialValue);

ref.current; // 透過 `.current` 屬性來存取 ref 中保存的值
```

這個 hook 主要用來解決兩個問題：

1. 需要取得 DOM 元素或是子元件的參考。
2. 保存一個可以跨渲染週期存在的可變值。

## 透過 ref 操作 DOM 元素

當我們需要直接操作 DOM 元素時，可以使用 `useRef` 來取得該元素的參考。

常見的需求有：

1. 自動 focus 到輸入框。
2. 取得元素的屬性（例如寬高、位置等）。
3. 控制媒體播放（例如影片、音樂等）。
4. 整合第三方函式庫。

### 範例：自動 focus 到輸入框

```tsx
import { useEffect, useRef } from 'react';

function AutoFocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      // 透過 current 屬性來存取 DOM 元素，並呼叫 focus 方法
      inputRef.current.focus();
    }
  }, []);

  // 將 ref 屬性綁定到 input 元素上
  return <input ref={inputRef} />;
}
```

## 儲存跨渲染週期的可變值

一個最簡單的例子是用一個 state 來當作計數器 `count`，每次按下按鈕就會讓 `count` 加 1。但是如果我們想要在每次渲染時都印出前一次的 `count` 值，這時候就可以使用 `useRef` 來保存前一次的值。

```tsx
import { useRef, useState } from 'react';

function Count() {
  const [count, setCount] = useState(0);

  // 單純用一個變數是無法保存前一次的值的，因為每次元件重新渲染時，變數都會被重新初始化
  // const prevCount = 0;
  const prevCount = useRef(0);

  const add = () => {
    setCount((c) => c + 1);
    prevCount.current = count;
  };

  return (
    <>
      <h1>
        目前的 count 值：{count}，前次 count 值：{prevCount.current}
      </h1>

      <button onClick={add}>+1</button>
    </>
  );
}
```
> 實際寫範例時會出現 `Error: Cannot access refs during render` 的 ESLint 錯誤。這是因為官方文件在注意事項有提到 Do not write or read ref.current during rendering, except for initialization. This makes your component’s behavior unpredictable. 這裡僅為說明 `useRef` 的特性，實際使用時請避免在渲染期間讀取或寫入 `ref.current`。

### 範例：管理計時器

我們來看一個計時器的情境，當使用者按下開始按鈕後，計時器會開始計數，每秒更新一次畫面上的秒數。當使用者按下停止按鈕後，計時器會停止。

我們先來看這段程式碼：

```tsx
import { useState } from 'react';

function StopWatch() {
  console.log('render');
  let timer: number | null = null;
  const [count, setCount] = useState(0);

  const start = () => {
    if (timer) return;
    timer = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
  };

  const stop = () => {
    console.log(timer);
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const reset = () => {
    stop();
    setCount(0);
  };

  return (
    <div>
      <h1>StopWatch: {count}s</h1>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

可以發現到，當我們按下開始按鈕後，計時器正常讀秒，但是當我們按下停止按鈕後，計時器並沒有停止，這是因為 `timer` 變數在每次元件重新渲染時都會被重新初始化為 `null`，導致我們無法正確地清除計時器。

我們可以使用 `useRef` 來解決這個問題，因為 `useRef` 的值不會因為元件重新渲染而改變：

```tsx tsx{5,9-10,17-19}
import { useRef, useState } from 'react';

function StopWatch() {
  console.log('render');
  const timer = useRef<number | null>(null);
  const [count, setCount] = useState(0);

  const start = () => {
    if (timer.current) return;
    timer.current = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
  };

  const stop = () => {
    console.log(timer);
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  const reset = () => {
    stop();
    setCount(0);
  };

  return (
    <div>
      <h1>StopWatch: {count}s</h1>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

## 注意事項

1. 元件在重新渲染時，`useRef` 並不會被重新初始化。
2. 修改 `ref.current` 不會觸發元件重新渲染。因為 React 不會知道它何時發生變化，因為 ref 只是一個普通的 JavaScript 物件。
3. `ref.current` 不能被當作其他 hook 的依賴值使用，因為它的變化不會觸發重新渲染。因此不能把它放在 `useEffect`、`useMemo`、`useCallback` 等 hook 的依賴陣列中。
4. `useRef` 不能直接用來獲取子元件的實例，需要使用 `forwardRef`（*React 18）。
5. React 19 之後，可以直接夠過 `props` 將 ref 傳遞給子元件，而不需要使用 `forwardRef`。

## 參考資料

- [React 官方文件 - useRef](https://react.dev/reference/react/useRef)
