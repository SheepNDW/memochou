# useCallback

`useCallback` 和 `useMemo` 一樣，都是用來最佳化效能的 hook。它的主要作用是快取住一個函式，避免在每次組件重新渲染時都重新創建該函式。

## 語法

```tsx
const cachedFn = useCallback(fn, deps)
```

### 參數

- `fn`: 你想要快取的函式。
- `deps`: 依賴陣列，當陣列中的值改變時，`fn` 會被重新創建，和 `useEffect` 的依賴陣列相似。

### 回傳值

- 回傳一個記憶化的函式，減少重複建立的開銷。

```tsx
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

## 基本使用

接著來透過一個簡單的範例來說明 `useCallback` 的必要性。假設有一個搜尋元件 `Search`，它包含一個輸入框和一個顯示 keyword 的結構，當輸入框觸發 `onChange` 事件時，會更新 keyword 狀態。此時會重新渲染 `Search` 元件，並且重新建立 `handleChange` 函式並加進 Set 集合中，造成不必要的記憶體浪費。

```tsx
import React, { useState } from 'react';

const set = new Set();

function Search() {
  const [keyword, setKeyword] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  // 把 handleChange 函式的參考加入 Set 中
  set.add(handleChange);
  console.log('Set 中函式數量：', set.size);

  return (
    <div>
      <input type="text" value={keyword} onChange={handleChange} />
      <hr />
      <p>{keyword}</p>
    </div>
  );
}
```

執行上述程式碼，當我們在輸入框中輸入文字時，會發現 Set 中的函式數量會不斷增加，為了防止每次 re-render 都重新建立 `handleChange` 函式，我們可以使用 `useCallback` 來快取這個函式。

```tsx {1,8-10}
import React, { useCallback, useState } from 'react';

const set = new Set();

function Search() {
  const [keyword, setKeyword] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  // ...
}
```

此時無論 `keyword` 狀態如何變化，`handleChange` 函式都不會重新建立，Set 中的函式數量將保持為 1。

## 防止子元件不必要的重新渲染

當父元件重新渲染時，子元件也會跟著重新渲染，而如果子元件有使用 `React.memo` 則會比較 `props` 是否有改變來決定是否重新渲染。但如果父元件傳遞給子元件的 `props` 是一個函式，則每次父元件重新渲染時，該函式都會被重新建立，導致子元件無法利用 `React.memo` 來避免重新渲染。

我們來看下面這個 Search 元件的範例：

::: code-group

```tsx [Search.tsx]
import React, { useState } from 'react';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';

function Search() {
  const [keyword, setKeyword] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div>
      <SearchInput onChange={handleChange} />
      <hr />
      <SearchResult query={keyword} />
    </div>
  );
}
```

```tsx [SearchInput.tsx]
import React, { useEffect } from 'react';

type Props = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchInput = React.memo(function SearchInput({ onChange }: Props) {
  useEffect(() => {
    console.log('search-input re-render');
  });

  return <input type="text" onChange={onChange} placeholder="search..." />;
});

export default SearchInput;
```

```tsx [SearchResult.tsx]
import { useEffect, useState } from 'react';

const mockApiCall = (query: string) => {
  return new Promise<{ id: number; text: string }[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, text: `Result for "${query}" 1` },
        { id: 2, text: `Result for "${query}" 2` },
        { id: 3, text: `Result for "${query}" 3` },
      ]);
    }, 200);
  });
};

function SearchResult({ query }: { query: string }) {
  const [list, setList] = useState<{ id: number; text: string }[]>([]);

  useEffect(() => {
    if (!query) {
      setList([]);
      return;
    }
    mockApiCall(query).then((res) => {
      setList(res);
    });
  }, [query]);

  return (
    <div>
      <h3>Search Results for "{query}":</h3>
      <ul>
        {list.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResult;
```

:::

實際執行後，可以發現在輸入框中輸入文字時，`SearchInput` 元件會不斷重新渲染，因為 React.memo 比較 `onChange` 函式的參考時，發現每次都是不同的函式。然而 `SearchInput` 元件其實並不需要重新渲染，因為它的行為並沒有改變。

此時，我們就可以使用 `useCallback` 來快取 `handleChange` 函式，讓它在父元件重新渲染時保持相同的參考：

```tsx [Search.tsx]
function Search() {
  const [keyword, setKeyword] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // [!code --]
    setKeyword(e.target.value); // [!code --]
  }; // [!code --]
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { // [!code ++]
    setKeyword(e.target.value); // [!code ++]
  }, []); // [!code ++]

  return (
    <div>
      <SearchInput onChange={handleChange} />
      <hr />
      <SearchResult query={keyword} />
    </div>
  );
}
```

## 總結

`useCallback` 和 `useMemo` 一樣，都是用來最佳化效能的 hook。在使用時，應該根據實際情況來決定是否需要使用，因為快取住一個函式也會帶來一些額外的記憶體開銷。

## 參考資料

- [React 官方文件 - useCallback](https://react.dev/reference/react/useCallback)
