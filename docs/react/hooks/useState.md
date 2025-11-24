---
outline: deep
---

# useState

`useState` 讓 function component 能夠擁有自己的狀態。它是一個管理狀態的 hook，通過它可以做到狀態的初始化、讀取和更新。

## 基本使用

```tsx
const [state, setState] = useState(initialState);
```

`useState` 接受一個初始狀態作為參數，回傳一個陣列，陣列的第一個元素代表目前狀態值，如果要修改這個狀態，則需要使用陣列的第二個元素 `set` 函式來更新狀態。

例如：

```tsx
import { useState } from 'react';

function Count() {
  const [count, setCount] = useState(0);

  const add = () => {
    setCount(count + 1);
  };

  return (
    <>
      <h1>目前的 count 值：{count}</h1>

      <button onClick={add}>+1</button>
    </>
  );
}

export default Count;
```

::: tip 注意
`useState` 是一個 hook，因此只能在元件的最頂層或是其他 hook 裡面呼叫它，不能在條件判斷或是迴圈中使用。
:::

## 狀態發生變化時，元件會重新渲染

在 function component 中，使用 `setState` 更新狀態後，React 在每次狀態發生變化，都會觸發元件的重新執行，進而根據最新的狀態值來更新畫面（DOM 結構）。

```tsx
function Count() {
  const [count, setCount] = useState(0);

  // 只要 count 狀態改變，都會 print 出這行
  console.log('Count 元件渲染');

  const add = () => {
    setCount(count + 1);
  };

  return (
    <>
      <h1>目前的 count 值：{count}</h1>

      <button onClick={add}>+1</button>
    </>
  );
}
```

::: tip 注意
當元件被重新執行時，不會重複執行 `useState` 給予初始狀態，會直接使用上一次的狀態值。但是自己定義的函式或變數都會重新建立。
:::

## 初始狀態可以是函式

`useState` 的初始狀態參數也可以是一個函式，透過這個函式回傳的值來當作初始狀態。這個用法適合在初始狀態的計算比較複雜，或是需要從外部取得資料時使用。

```tsx
const [value, setValue] = useState(() => initialValue);
```

例如：

```tsx
import { useState } from 'react';

function DateInfo() {
  // const [date] = useState({ year: 2025, month: 11 day: 24 });

  const [date] = useState(() => {
    const dt = new Date();
    return {
      year: dt.getFullYear(),
      month: dt.getMonth() + 1,
      day: dt.getDate(),
    };
  });

  return (
    <>
      <h1>
        今日日期：{date.year} 年 {date.month} 月 {date.day} 日
      </h1>
    </>
  );
}

export default DateInfo;
```

::: tip 注意
以函式作為初始狀態參數時，這個函式只會在元件初次渲染時執行一次，之後不會再執行。元件重新渲染時，會直接使用上一次的狀態值。
:::

## useState 是非同步更新狀態

`useState` 的 `set` 函式是非同步更新狀態的，所以在修改狀態後無法立即取得最新的狀態值。例如：

```tsx
const [count, setCount] = useState(0);

const add = () => {
  setCount(count + 1);
  console.log(count); // 這裡印出的 count 還是舊的值
};
```

執行上面的 `add` 函式時，雖然呼叫了 `setCount` 將 `count` 狀態加 1，但緊接著印出的 `count` 仍然是更新前的值，證明了 `setCount` 是非同步更新狀態的。

### batch update 機制

在我們呼叫 `setState` 方法時，會觸發元件的 re-render，但是 re-render 並不會立即發生，React 其實會等到所有的事件處理函式或是生命週期函式執行完畢後，再一次性地進行 re-render，這個機制稱為 batch update。

我們可以看到下面的案例：

```tsx
const [count, setCount] = useState(0);

console.log('Component Rendered:', count);

const changeCount = () => {
  setCount(1);
  setCount(2);
  setCount(3);
};
```

我們嘗試在同一個事件處理中連續呼叫三次 `setCount`，但最後元件只會重新渲染一次，並且 `count` 的值會是最後一次呼叫 `setCount` 時所設定的值 `3`。React 會在正執行的事件內的所有 `setState` 呼叫結束後，才會開始重新渲染元件，每次呼叫 `setState`，都會將其記錄到一個佇列中，然後合併這些狀態更新，最後只進行一次重新渲染。

整個過程像是這樣：

```tsx
const changeCount = () => {
  // 第一次呼叫，將 count 設為 1，加入佇列
  // 但此時尚未重新渲染也還未真正更新 count 狀態
  setCount(1);

  // 第二次呼叫，將 count 設為 2，加入佇列
  // 仍然尚未重新渲染也還未真正更新 count 狀態
  setCount(2);

  // 第三次呼叫，將 count 設為 3，加入佇列
  // 仍然尚未重新渲染也還未真正更新 count 狀
  setCount(3);

  // 到此為止，事件處理函式結束，React 開始處理佇列中的狀態更新
  // 依序試算佇列中的狀態更新: 原值 -> 1 -> 2 -> 3
  // 最終 count 狀態被更新為 3，並觸發元件重新渲染
};
```

上面這種「一個事件中的多次狀態更新會被合併成一次重新渲染」的行為，就是 batch update 機制用來減少不必要的重新渲染次數，提升效能的方式。

::: info
React 18 之後，batch update 機制不僅限於同步的 React 事件，在其他情境下也會自動啟用，例如在 `setTimeout`、`Promise` 的 `then` 回呼函式中，都會自動進行 batch update。
:::

### 使用函式更新狀態

如果我們想要以原有的 `count` 去做遞增，希望點擊按鈕一次，就會連續 `+1` 三次時，可能會直覺得想到：

```tsx
const add = () => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
};
```

但是這樣寫並不會達到預期的效果，前面也有提到，`setCount` 是非同步更新狀態的，同一次 render 中的 state 值是固定且永遠不變的，所以每次呼叫 `setCount(count + 1)` 時，讀取到的 `count` 都是相同的舊值，因此最終 `count` 只會增加 1。相當於我們只是執行了三次的 `setCount(0 + 1)`。

解決的方式就是改成使用函式更新狀態，`useState` 所提供的 `setState` 方法，在呼叫時除了可以直接傳入目標的新值作為參數以外，其實也可以傳入一個 updater function 做為參數

```ts
setCount((prevValue) => prevValue + 1);
```

這個更新函式會在執行時，接收到目前的狀態值作為參數，然後基於這個值來計算並回傳新的狀態值。

因此我們可以將上面的 `add` 函式改寫成：

```tsx
const add = () => {
  // 首次呼叫，將 `prevCount => prevCount + 1` 加入到待執行佇列
  setCount((prevCount) => prevCount + 1);

  // 第二次呼叫，將 `prevCount => prevCount + 1` 加入到待執行佇列
  setCount((prevCount) => prevCount + 1);

  // 第三次呼叫，將 `prevCount => prevCount + 1` 加入到待執行佇列
  setCount((prevCount) => prevCount + 1);

  // 到此為止，事件處理函式結束，React 開始處理佇列中的狀態更新
  // 依序執行佇列中的更新函式:
  // 第一次: prevCount = 0 -> 回傳 0 + 1 = 1
  // 第二次: prevCount = 1 -> 回傳 1 + 1 = 2
  // 第三次: prevCount = 2 -> 回傳 2 + 1 = 3
};
```

第一個 `setCount` 呼叫時，會將 `0 + 1` 計算結果 `1` 設為新的狀態值；然後作為第二個 `setCount` 呼叫的 `prevCount` 參數...，以此類推，最終 `count` 狀態會被更新為 `3`。

## 參考資料

- [一次打破 React 常見的學習門檻與觀念誤解 系列文章](https://ithelp.ithome.com.tw/users/20129300/ironman/5892)
  - [[Day 13] 深入理解 batch update](https://ithelp.ithome.com.tw/articles/10300091)
  - [[Day 14] 以 functional updater 來呼叫 setState](https://ithelp.ithome.com.tw/articles/10300743)
