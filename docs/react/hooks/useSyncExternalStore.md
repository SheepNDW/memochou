---
outline: deep
---

# useSyncExternalStore

`useSyncExternalStore` 是一個 React 18 引入的 hook，用於用於從外部儲存（例如狀態管理庫、瀏覽器 API 等）獲取狀態並在元件中同步顯示。對於需要訂閱外部資料源並在資料變更時更新元件的情況很有用。

## 常見場景

1. 訂閱外部 store：當你使用像 Redux、Zustand 或其他狀態管理庫時。
2. 與瀏覽器 API 交互：例如 storage 事件、location 變更等。
3. 抽離狀態邏輯：用自訂 hooks 抽離狀態邏輯。
4. SSR 支援。

## 語法

```ts
useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

參數：

* `subscribe`: 用來訂閱資料來源變更的函式。它接收一個 callback，當資料變更時會呼叫該 callback，然後會回傳一個取消訂閱的函式。
* `getSnapshot`: 用來獲取當前資料快照的函式。（即目前狀態）
* `getServerSnapshot`（可選）: 在 SSR 時用來取得資料來源的快照。

回傳值 `res` 是目前的資料快照，讓我們在渲染邏輯中使用。

```ts
const subscribe = (callback: () => void) => {
    // 訂閱
    callback() 
    return () => { 
        // 取消訂閱
    }
}

const getSnapshot = () => {
    return data
}

const res = useSyncExternalStore(subscribe, getSnapshot)
```

## 範例

### 訂閱瀏覽器 API 實作自訂 hook（`useStorage`）

我們要實作一個 `useStorage` 的自訂 hook，用來訂閱 localStorage 的資料。讓我們可以確保元件在 `localStorage` 變更時自動更新。

目標是能夠存資料到 localStorage，並在不同瀏覽器分頁中同步更新這些狀態。

```tsx [hooks/useStorage.ts]
import { useCallback, useSyncExternalStore } from 'react';

/**
 * 用於同步 localStorage 與 React 狀態的 Hook
 * 使用 useSyncExternalStore 確保跨分頁同步，當其他分頁修改 localStorage 時會自動更新
 * 
 * 注意：瀏覽器的 storage 事件只在「不同分頁」修改 localStorage 時觸發，
 * 同一分頁內的修改不會自動觸發該事件。因此在 updateStorage 中需要手動 dispatch 事件來通知更新。
 * 
 * @param key - localStorage 的鍵名
 * @param initialValue - 當 localStorage 中沒有對應值時使用的預設值
 * @returns 包含當前值與更新函式的 tuple `[value, setValue]`
 */
export function useStorage<T>(key: string, initialValue: T): [T, (newValue: T) => void] {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('storage', callback);

    return () => {
      window.removeEventListener('storage', callback);
    };
  }, []);

  const getSnapshot = useCallback((): T => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      return JSON.parse(storedValue) as T;
    }
    return initialValue;
  }, [key, initialValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot);

  const updateStorage = useCallback(
    (newValue: T) => {
      localStorage.setItem(key, JSON.stringify(newValue));
      // 手動觸發 storage 事件
      window.dispatchEvent(new StorageEvent('storage', { key }));
    },
    [key]
  );

  return [value, updateStorage];
}
```

#### 支援 SSR 的版本

如果你的應用需要支援 Server-Side Rendering（例如 Next.js），需要提供 `getServerSnapshot` 來避免水合錯誤：

```tsx
const getServerSnapshot = useCallback((): T => {
  // 伺服器端無法存取 localStorage，回傳初始值
  return initialValue;
}, [initialValue]);

const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
```

然後在元件中，我們就可以直接使用這個 `useStorage` hook 來同步 localStorage 的資料，並且在重新整理或是其他分頁修改資料時自動更新。

```tsx [App.tsx]
import { useStorage } from './hooks/useStorage';

function App() {
  const [val, setVal] = useStorage('data', 1);

  return (
    <>
      <h3>{val}</h3>
      <button onClick={() => setVal(val + 1)}>設定val</button>
    </>
  );
}
```

### 訂閱 history 實作路由跳轉

實作一個簡易的 `useHistory` hook，取得瀏覽器 url 狀態以及參數

```tsx [hooks/useHistory.ts]
import { useSyncExternalStore } from 'react';

export function useHistory() {
  const subscribe = (callback: () => void) => {
    window.addEventListener('popstate', callback);
    window.addEventListener('hashchange', callback);

    return () => {
      window.removeEventListener('popstate', callback);
      window.removeEventListener('hashchange', callback);
    };
  };

  const getSnapshot = () => {
    return window.location.href;
  };

  const url = useSyncExternalStore(subscribe, getSnapshot);

  const push = (url: string) => {
    window.history.pushState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const replace = (url: string) => {
    window.history.replaceState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return [url, push, replace] as const;
}
```

#### 支援 SSR 的版本

如果需要支援 SSR，添加 `getServerSnapshot`：

```tsx
const getServerSnapshot = () => {
  // 伺服器端回傳空字串或預設 URL
  return '';
};

const url = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
```

接著在元件中使用這個 `useHistory` hook 來取得目前的 url，並且可以進行路由跳轉。

```tsx [App.tsx]
import { useHistory } from './hooks/useHistory';

function App() {
  const [history, push, replace] = useHistory();

  return (
    <>
      <div>當前url:{history}</div>
      <button
        onClick={() => {
          push('/aaa');
        }}
      >
        跳轉 - push
      </button>
      <button
        onClick={() => {
          replace('/bbb');
        }}
      >
        替換 - replace
      </button>
    </>
  );
}
```

效果呈現：

* `history` 會得到目前的 url。每當 url 變化時，`useSyncExternalStore` 會自動觸發更新，使 `history` 反映最新的 url。
* `push` 和 `replace` 函式分別用於新增和替換瀏覽器的歷史紀錄。

## 注意事項

### 1. getSnapshot 必須回傳穩定的值

`getSnapshot` 應該在狀態相同時回傳相同的引用，避免不必要的重新渲染。對於物件或陣列，建議使用序列化或是 immutable 資料結構。

### 2. subscribe 函式應該保持穩定

使用 `useCallback` 包裹 `subscribe` 函式，確保依賴項不變時函式引用保持穩定，避免重複訂閱和取消訂閱。

### 3. 避免在 getSnapshot 中執行副作用

`getSnapshot` 應該是純函式，只負責讀取和回傳當前狀態，不應該修改狀態或執行其他副作用。

### 4. SSR 水合問題

在使用 SSR 時，如果不提供 `getServerSnapshot`，可能會導致客戶端與伺服器端渲染不一致，造成水合錯誤。務必根據實際情況提供適當的 `getServerSnapshot`。

### 5. 瀏覽器 API 的可用性

當使用瀏覽器 API（如 `localStorage`、`window.location` 等）時，需要注意這些 API 在伺服器端不可用。在 SSR 環境中，應該在 `getServerSnapshot` 中提供合理的預設值。

## 參考資料

* [React 官方文件 - useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)
