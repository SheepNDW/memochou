---
outline: deep
---

# useDeferredValue

`useDeferredValue` 用於延遲某些狀態的更新，直到主要渲染任務完成。對於需要頻繁更新的狀態（如輸入框、滾動位置等）非常有用，可以讓 UI 保持流暢，避免頻繁的更新導致效能問題。

## useTransition 與 useDeferredValue 的區別

雖然這兩個 hook 都涉及延遲更新，但他們關注的重點和用途不同：

- `useTransition` 關注的是**狀態的過渡**。它允許開發者控制某個更新的 transition 狀態，並提供了一個 `isPending` 標誌來指示過渡是否正在進行。
- `useDeferredValue` 則關注的是**單個值的延遲更新**。它允許開發者將某個值標記為低優先級。

## 語法

```ts
const deferredValue = useDeferredValue(value)
```

### 參數

- `value`：需要延遲更新的值。（可以是任何類型）

### 回傳值

- `deferredValue`：延遲更新的值，在初始渲染期間回傳值會與 `value` 相同。

### 注意

當 `useDeferredValue` 接收到與前一次不同的 `value` 時（使用 `Object.is` 進行比較），除了目前渲染（此時還是舊值）之外，React 會安排一個在背景進行可中斷的重新渲染，如果 `value` 有新的更新，那麼 React 會從頭重新啟動背景渲染。舉個例子，如果使用者在輸入框中的輸入速度比接收延遲值的圖表重新渲染的速度快，那麼圖表只會在使用者停止輸入後重新渲染。

此外，`useDeferredValue` 並不是 debounce，它不需要像 debounce 那樣設定等待時間，而是根據使用者裝置的情況進行延遲，當使用者裝置效能較好時，延遲時間會較短甚至無感。

### 與 debounce/throttle 的差異

| 特性     | useDeferredValue              | debounce/throttle        |
| -------- | ----------------------------- | ------------------------ |
| 延遲時機 | 由 React 根據裝置效能自動決定 | 需手動設定固定的等待時間 |
| 執行環境 | 僅限 React 元件內             | 任何 JavaScript 環境     |
| 取消機制 | React 自動處理（可中斷渲染）  | 需自行實作取消邏輯       |
| 適用情境 | 延遲 UI 渲染                  | 延遲 API 請求、事件處理  |

簡單來說，如果你的目標是「讓畫面保持流暢」，用 `useDeferredValue`；如果是「減少 API 呼叫次數」，則用 debounce。

## 範例: 延遲搜尋結果顯示

在下面這個搜尋範例中，Result 元件會根據使用者輸入的 `query` 狀態來顯示搜尋結果。而結果列表會產生大量的 `<li>` 元素，是一個比較耗時的渲染過程。

```tsx
function App() {
  const [query, setQuery] = useState('');

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  return (
    <>
      <div style={{ height: 500 }}>
        <input type="text" value={query} onChange={onInputChange} />
        <hr />
        <Result query={query} />
      </div>
    </>
  );
}

function Result({ query }: { query: string }) {
  if (!query) return null;

  const items = Array.from({ length: 10000 }, (_, i) => i + 1).map((i) => (
    <li key={i}>
      Result #{i} for "{query}"
    </li>
  ));

  return <ul>{items}</ul>;
}
```

在這個情境裡，我們不能使用 `useTransition`，因為 `useTransition` 會把狀態更新標記為 transition，但是被標記為 transition 的狀態更新會被其他狀態更新給打斷。因此在我們頻繁更新 `query` 狀態時，會導致中間的輸入狀態被跳過，使用者無法看到即時的輸入反饋：

```tsx {6-8}
function App() {
  const [query, setQuery] = useState('');
  const [, startTransition] = useTransition();

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    startTransition(() => {
      setQuery(e.target.value);
    });
  }

  return (
    <>
      <div style={{ height: 500 }}>
        <input type="text" value={query} onChange={onInputChange} />
        <hr />
        <Result query={query} />
      </div>
    </>
  );
}
```

要解決這個問題，就需要使用 `useDeferredValue` 來延遲 `query` 狀態的更新，讓輸入框的更新優先於結果列表的渲染：

```tsx
import { memo, useDeferredValue, useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  // 基於 query 狀態建立一個延遲版本的狀態
  const deferredQuery = useDeferredValue(query);

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  return (
    <>
      <div style={{ height: 500 }}>
        <input type="text" value={query} onChange={onInputChange} />
        <hr />
        {/* 把延遲的 query 傳給子元件 */}
        <Result query={deferredQuery} />
      </div>
    </>
  );
}

// 子元件需要使用 memo 進行包裝，這樣當 props 沒有改變時就不會重新渲染
const Result = memo(function Result({ query }: { query: string }) {
  if (!query) return;

  const items = Array.from({ length: 10000 }, (_, i) => i + 1).map((i) => (
    <li key={i}>
      Result #{i} for "{query}"
    </li>
  ));

  return <ul>{items}</ul>;
});
```

### 表明內容已經過時

在 `query` 頻繁更新的過程中，`deferredQuery` 的值會明顯落後於 `query`。此時使用者在畫面上看到的結果列表可能並不是最新的搜尋結果。為了讓使用者知道目前顯示的結果是過時的，我們可以對於內容已過時的情況進行提示：

```tsx {5-6,18}
function App() {
  const [query, setQuery] = useState('');
  // 基於 query 狀態建立一個延遲版本的狀態
  const deferredQuery = useDeferredValue(query);
  // 判斷目前的 deferredQuery 是否為過時的
  const isStale = deferredQuery !== query;

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  return (
    <>
      <div style={{ height: 500 }}>
        <input type="text" value={query} onChange={onInputChange} />
        <hr />
        {/* 把延遲的 query 傳給子元件 */}
        <div style={{ opacity: isStale ? 0.5 : 1, transition: '0.3s' }}>
          <Result query={deferredQuery} />
        </div>
      </div>
    </>
  );
}
```

## 參考資料

- [React 官方文件 - useDeferredValue](https://react.dev/reference/react/useDeferredValue)
