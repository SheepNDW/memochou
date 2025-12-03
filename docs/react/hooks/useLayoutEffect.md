# useLayoutEffect

::: warning 注意
`useLayoutEffect` 可能會影響效能，請盡可能只使用 `useEffect`。
:::

`useLayoutEffect` 是 `useEffect` 的一種變體。它會在瀏覽器重繪螢幕之前觸發執行。

## 語法

```ts
useLayoutEffect(setup, deps?)
```

- `setup`：一個回呼函式，放你的 effect 邏輯。然後跟 `useEffect` 一樣，可以選擇性地回傳一個清理函式。
- `deps?`：可選的依賴項陣列，setup 中使用到的響應式值列表（props、state等）。 

## 與 `useEffect` 的差異

| 區別     | `useEffect`                          | `useLayoutEffect`                      |
| -------- | ------------------------------------ | -------------------------------------- |
| 執行時間 | 瀏覽器完成佈局和繪製`之後`執行副作用 | 在瀏覽器完成佈局和繪製`之前`執行副作用 |
| 執行方式 | 非同步執行                           | 同步執行                               |
| DOM 渲染 | 不會阻塞 DOM 渲染                    | 會阻塞 DOM 渲染                        |

::: tip
React 保證了 `useLayoutEffect` 中的程式碼以及其中的狀態更新會在瀏覽器繪製之前完成。
:::

### 測試 DOM 阻塞

以下範例展示了 `useEffect` 和 `useLayoutEffect` 在 DOM 更新上的差異：

```tsx
import { useEffect, useLayoutEffect, useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count === 0) {
      // 模擬耗時計算 (阻塞 200ms)
      const start = performance.now();
      while (performance.now() - start < 200) {
        // busy wait
      }
      setCount(10 + Math.floor(Math.random() * 100));
    }
  }, [count]);

  // 切換成 useLayoutEffect 來觀察差異

  // useLayoutEffect(() => {
  //   if (count === 0) {
  //     const start = performance.now();
  //     while (performance.now() - start < 200) {
  //       // busy wait
  //     }
  //     setCount(10 + Math.floor(Math.random() * 100));
  //   }
  // }, [count]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>useEffect vs useLayoutEffect</h2>
      <p>點擊重置，觀察數字變化。</p>

      <div
        style={{
          fontSize: '40px',
          fontWeight: 'bold',
          color: count === 0 ? 'red' : 'green',
        }}
      >
        Count: {count}
      </div>

      <button onClick={() => setCount(0)} style={{ marginTop: '10px' }}>
        重置 (設為 0)
      </button>

      <div style={{ marginTop: '20px', color: '#666' }}>
        <p>
          <b>useEffect:</b> 你會先看到紅色的 0 (閃爍)，然後變成綠色的隨機數字。
        </p>
        <p>
          <b>useLayoutEffect:</b> 你<b>不會</b>看到紅色的
          0，畫面會稍微卡頓一下，然後直接顯示綠色的隨機數字。
        </p>
      </div>
    </div>
  );
}
```

- `useEffect`：你會先看到紅色的 0（因為瀏覽器先繪製了初始狀態），然後經過模擬的阻塞後，變成綠色的隨機數字。這會產生「閃爍」的效果。
- `useLayoutEffect`：瀏覽器在繪製前就會執行 Effect 並更新狀態，所以你永遠不會看到紅色的 0。畫面會稍微停頓（阻塞），然後直接顯示綠色的結果。

### 測試同步與非同步渲染

下面是一段動畫過渡的範例：

```tsx
import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

const baseStyle: CSSProperties = {
  width: '150px',
  height: '150px',
  opacity: 0,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  fontSize: '18px',
  fontWeight: 'bold',
};

function App() {
  const [key, setKey] = useState(0);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  // 使用 useEffect 實現動畫效果
  useEffect(() => {
    if (ref1.current) {
      // 這裡我們動態設定 transition 和 opacity
      ref1.current.style.transition = 'opacity 2s';
      ref1.current.style.opacity = '1';
    }
  }, [key]); // 依賴 key 以便重置

  // 使用 useLayoutEffect 實現動畫效果
  useLayoutEffect(() => {
    if (ref2.current) {
      // 這裡我們動態設定 transition 和 opacity
      ref2.current.style.transition = 'opacity 2s';
      ref2.current.style.opacity = '1';
    }
  }, [key]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>useEffect vs useLayoutEffect (動畫觸發)</h2>
      <p>觀察兩者在觸發 CSS Transition 時的差異。</p>

      <button
        onClick={() => setKey((k) => k + 1)}
        style={{ marginBottom: '20px', padding: '8px 16px' }}
      >
        重置 / 重新執行
      </button>

      <div style={{ display: 'flex', gap: '40px' }}>
        {/* Box 1 */}
        <div>
          <h3>useEffect</h3>
          <div
            key={`effect-${key}`} // 使用 key 強制重新掛載 DOM
            ref={ref1}
            style={{
              ...baseStyle,
              background: '#ff4d4f',
            }}
          >
            Fade In
          </div>
          <p style={{ maxWidth: '200px', fontSize: '14px', color: '#666', marginTop: '10px' }}>
            <b>會淡入顯示。</b>
            <br />
            useEffect 在瀏覽器繪製<b>後</b>執行。瀏覽器先畫了 opacity: 0，然後我們改成 1，觸發
            Transition。
          </p>
        </div>

        {/* Box 2 */}
        <div>
          <h3>useLayoutEffect</h3>
          <div
            key={`layout-${key}`} // 使用 key 強制重新掛載 DOM
            ref={ref2}
            style={{
              ...baseStyle,
              background: '#1890ff',
            }}
          >
            Instant
          </div>
          <p style={{ maxWidth: '200px', fontSize: '14px', color: '#666', marginTop: '10px' }}>
            <b>會直接出現 (無動畫)。</b>
            <br />
            useLayoutEffect 在瀏覽器繪製<b>前</b>執行。瀏覽器第一次畫的時候，opacity 已經被改成 1
            了，所以沒有狀態變化，也就沒有動畫。
          </p>
        </div>
      </div>
    </div>
  );
}
```

1. `useEffect` 的動畫效果：
    - 初始渲染時，元素的 `opacity` 為 `0`。瀏覽器繪製後，`useEffect` 執行並將 `opacity` 設為 `1`，觸發了淡入動畫效果。

2. `useLayoutEffect` 的動畫效果：
    - 初始渲染時 `opacity: 0`，在 DOM 更新後立即同步執行 `useLayoutEffect`，將 `opacity` 設為 `1`。由於這發生在瀏覽器繪製之前，瀏覽器只會看到最終狀態 `opacity: 1`，因此沒有動畫效果。

## 應用情境

- 需要同步讀取或修改 DOM 的情況，例如測量元素尺寸或位置並在渲染前進行調整。
- 防止視覺閃爍或不一致的 UI 狀態，在某些情況下，非同步的 `useEffect` 可能會導致可見的佈局跳動或是閃爍。
- 模擬生命週期方法，如果你需要將 class component 遷移到 function component，並且需要模擬 `componentDidMount`、`componentDidUpdate` 或 `componentWillUnmount` 的同步行為。

### 記錄捲動位置

我們可以記錄使用者的捲動位置，並等待他回到這個頁面時，恢復到之前的捲動位置：

::: code-group

```ts [useScrollRestoration.ts]
import { useCallback, useLayoutEffect, useRef } from 'react';

export function useScrollRestoration<T extends HTMLElement>(key: string) {
  const ref = useRef<T>(null);
  const timer = useRef<number>(null);

  const onScroll = useCallback(
    (e: React.UIEvent<T>) => {
      const scrollTop = e.currentTarget.scrollTop;

      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        sessionStorage.setItem(`scroll-${key}`, String(scrollTop));
      }, 150);
    },
    [key]
  );

  useLayoutEffect(() => {
    const saved = sessionStorage.getItem(`scroll-${key}`);

    if (ref.current && saved) {
      ref.current.scrollTop = Number(saved);
    }
  }, [key]);

  return {
    ref,
    onScroll,
  };
}
```

```tsx [App.tsx]
import { useScrollRestoration } from './hooks/useScrollRestoration';

function App() {
  const { ref, onScroll } = useScrollRestoration<HTMLDivElement>('list-container');

  return (
    <div
      style={{ height: '500px', width: '300px', overflow: 'auto' }}
      ref={ref}
      onScroll={onScroll}
    >
      {Array.from({ length: 500 }, (_, i) => (
        <p key={i}>Item {i + 1}</p>
      ))}
    </div>
  );
}
```

:::

我們封裝了一個 `useScrollRestoration` hook，然後用一個 `ref` 綁定到需要記錄捲動位置的容器上，並且在 `onScroll` 事件中記錄捲動位置到 `sessionStorage`。當元件掛載時，我們使用 `useLayoutEffect` 來恢復之前的捲動位置，確保在瀏覽器繪製之前就設定好捲動位置，避免閃爍。

## 參考資料

- [React 官方文件 - useLayoutEffect](https://react.dev/reference/react/useLayoutEffect)
