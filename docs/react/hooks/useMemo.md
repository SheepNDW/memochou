---
outline: deep
---

# useMemo

`useMemo` 是一個用在效能最佳化的 hook。它主要的功能是避免每次在重新渲染時都重複進行複雜的計算或是創建物件，透過快取住之前的計算結果，僅當依賴的值改變時才重新計算，藉此提升效能。

## React.memo

`memo` 是一個 React 的 API，用來包裹一個元件，使其在接收到相同的 props 時不會重新渲染。用來減少不必要的渲染次數，提升效能。

### 用法

```tsx
const MemoizedComponent = React.memo(Component);
```

我們來看一個情境，我們在父元件中宣告一個 `count` 和 `flag` 狀態，並且將 `count` 傳入子元件 `Child` 中。當我們點擊按鈕改變 `flag` 狀態時，會發現子元件也會重新渲染，這是因為 React 預設會在父元件重新渲染時也重新渲染子元件。

```tsx
import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  return (
    <div>
      <div>
        <button onClick={() => setCount((c) => c + 1)}>Count++</button>
        <button onClick={() => setFlag((f) => !f)}>Toggle Flag</button>
      </div>

      <div>Flag: {String(flag)}</div>

      <Child count={count} />
    </div>
  );
}

function Child({ count }: { count: number }) {
  console.log('child re-render');

  return <div>Child Count: {count}</div>;
}
```

而只要使用 `memo` 包裹子元件 `Child`，當我們改變 `flag` 狀態時，子元件就不會重新渲染了，只有子元件依賴的 props 發生變化的時候，才會觸發子元件的重新渲染。

```tsx
function Child({ count }: { count: number }) { // [!code --]
const Child = React.memo(function Child({ count }: { count: number }) { // [!code ++]
  console.log('child re-render');

  return <div>Child Count: {count}</div>;
});
```

### React.memo 總結

1. 使用情境：
    - 當子元件接收的 props 不經常改變時。
    - 當元件重新渲染的成本較高時。
    - 需要避免不必要的重新渲染以提升效能時。
2. 優點：
    - 透過快取減少不必要的重新渲染，提升效能。
    - 減少資源浪費。
3. 注意事項：
    - 過度使用可能導致程式碼複雜化，只在確實需要最佳化的元件上使用。
    - 對於簡單的元件，使用 `memo` 的開銷可能比重新渲染的還大。
    - 如果 `props` 經常改變，使用 `memo` 可能不會帶來效能提升。

## useMemo 用法

```tsx
const cachedValue = useMemo(calcFunction, deps)
```

- `calcFunction`：一個用來計算值的函式，回傳一個需要被快取的值。
- `deps`：依賴陣列，當陣列中的值改變時，`calcFunction` 才會被重新執行。

```tsx
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    // 計算函式，回傳一個過濾後的 todos
    () => filterTodos(todos, tab),
    // 依賴陣列，當 todos 或 tab 改變時才重新計算
    [todos, tab]
  );
  // ...
}
```

### 跳過額外的昂貴重新計算

我們來看官方文件中給的 TodoList 範例。在這個範例中，我們有一個 `todos` 陣列和一個 `tab` 狀態，`tab` 用來決定目前顯示的是所有待辦事項、已完成事項還是未完成事項。每次 `tab` 狀態改變時，我們都需要重新計算 `visibleTodos`。與此同時，我們還有一個 `isDark` 狀態，用來切換深色模式。

先來看看如果不使用 `useMemo` 的情況：

::: code-group

```tsx [App.tsx]
import TodoList from '@/components/TodoList';
import { createTodos } from '@/utils';
import { useState } from 'react';

const todos = createTodos();

function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>All</button>
      <button onClick={() => setTab('active')}>Active</button>
      <button onClick={() => setTab('completed')}>Completed</button>
      <br />
      <label>
        <input 
          type="checkbox" 
          checked={isDark} 
          onChange={(e) => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList 
        todos={todos} 
        tab={tab} 
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

export default App;
```

``` tsx [TodoList.tsx]
import { filterTodos, type Todo } from '@/utils';

const themeStyles: Record<'light' | 'dark', React.CSSProperties> = {
  light: {
    color: '#213547',
    backgroundColor: '#ffffff',
    paddingRight: '1rem',
    borderRadius: 8,
  },
  dark: {
    color: 'rgba(255, 255, 255, 0.87)',
    backgroundColor: '#242424',
    paddingRight: '1rem',
    borderRadius: 8,
  },
};

type Props = {
  todos: Todo[];
  theme: 'light' | 'dark';
  tab: string;
};

function TodoList({ todos, theme, tab }: Props) {
  const visibleTodos = filterTodos(todos, tab);

  return (
    <div style={themeStyles[theme]}>
      <ul>
        <p>
          <b>
            Note: <code>filterTodos</code> is artificially slowed down!
          </b>
        </p>
        {visibleTodos.map((todo) => (
          <li key={todo.id}>{todo.completed ? <s>{todo.text}</s> : todo.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
```

```ts [utils.ts]
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: 'Todo ' + (i + 1),
      completed: Math.random() > 0.5,
    });
  }
  return todos;
}

export function filterTodos(todos: Todo[], tab: string) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  const startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter((todo) => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

:::

在 `filterTodos` 函式中，我們故意加入了一段耗時的模擬程式碼，讓過濾操作變得非常緩慢。然後我們操作 `isDark` 狀態來切換深色模式，會發現每次切換時，`filterTodos` 都會被重新執行，導致 UI 卡頓。

現在我們將 `useMemo` 加入到 `TodoList` 元件中，來快取 `visibleTodos` 的計算結果：

```tsx [TodoList.tsx]
import { useMemo } from 'react'; // [!code ++]

function TodoList({ todos, theme, tab }: Props) {
  const visibleTodos = filterTodos(todos, tab); // [!code --]
  const visibleTodos = useMemo( // [!code ++]
    () => filterTodos(todos, tab), // [!code ++]
    [todos, tab] // [!code ++]
  ); // [!code ++]
  // ...
}
```

這樣一來，當我們切換 `isDark` 狀態時，`filterTodos` 就不會被重新執行了，只有當 `todos` 或 `tab` 改變時，才會觸發重新計算 `visibleTodos`。

### 配合 React.memo 達成讓子元件不重新渲染

上面提到過，我們有時會用 `memo` 來包裹子元件，避免不必要的重新渲染。現在我們將範例改寫，將 `TodoList` 元件中的待辦事項列表抽離成一個 `List` 子元件，然後模擬它是一個渲染成本較高的元件，並使用 `memo` 來包裹它：

::: code-group

```tsx [TodoList.tsx] {23}
function filterTodos(todos: Todo[], tab: string) {
  return todos.filter((todo) => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}

function TodoList({ todos, theme, tab }: Props) {
  // 每次 theme 改變時，visibleTodos 都會是一個新的陣列
  const visibleTodos = filterTodos(todos, tab);

  return (
    <div style={themeStyles[theme]}>
      <p>
        <b>
          Note: <code>filterTodos</code> is artificially slowed down!
        </b>
      </p>
      {/* 因此這個 props 不會是相同的陣列，導致 <List /> 每次都會重新渲染 */}
      <List items={visibleTodos} />
    </div>
  );
}
```

```tsx [List.tsx] {4}
import type { Todo } from '@/utils';
import { memo } from 'react';

const List = memo(function List({ items }: { items: Todo[] }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  const startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map((todo) => (
        <li key={todo.id}>{todo.completed ? <s>{todo.text}</s> : todo.text}</li>
      ))}
    </ul>
  );
});

export default List;
```

:::

此時，當我們切換 `isDark` 狀態時，會發現 `List` 元件仍會不斷地重新渲染造成 UI 卡頓。這是因為每次 `TodoList` 元件重新渲染時，`visibleTodos` 都會被重新建立成一個新的陣列，即使內容相同，但記憶體位置不同，導致 `List` 元件認為 props 改變了，因此觸發重新渲染，使得 memo 失效。

此時，我們可以使用 `useMemo` 來快取 `visibleTodos`，確保只有在 `todos` 或 `tab` 改變時才重新建立陣列，這樣就能避免 `List` 元件不必要的重新渲染：

```tsx {2-6}
function TodoList({ todos, theme, tab }: Props) {
  // 讓 react 在 re-render 時，能夠快取住之前的 visibleTodos 陣列...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...只要 todos 或 tab 沒有改變
  );

  return (
    <div style={themeStyles[theme]}>
      <p>
        <b>
          Note: <code>filterTodos</code> is artificially slowed down!
        </b>
      </p>
      {/* ...<List /> 就會接收相同的陣列，避免不必要的重新渲染 */}
      <List items={visibleTodos} />
    </div>
  );
}
```

### useMemo 總結

1. 使用情境：
    - 需要快取複雜計算結果以提升效能時。
    - 需要避免子元件因接收新物件或陣列而重新渲染時。
2. 優點：
    - 透過快取減少不必要的計算，提升效能。
    - 減少資源浪費。
3. 注意事項：
    - 不要過度使用，僅在確實需要最佳化效能的情況下使用。
    - 如果依賴經常改變，使用 `useMemo` 的效果會大打折扣。
    - 如果沒有明顯的效能問題，傾向不去使用 `useMemo`。

::: tip
使用 [React Compiler](https://react.dev/learn/react-compiler) 會自動去記憶值和函式，減少手動使用 `useMemo` 和 `useCallback` 的需要。
:::

## 參考資料

- [React 官方文件 - useMemo](https://react.dev/reference/react/useMemo)
- [React 官方文件 - React.memo](https://react.dev/reference/react/memo)
