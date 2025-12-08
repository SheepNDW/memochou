---
outline: deep
---

# useImmer

[use-immer](https://github.com/immerjs/use-immer) 是一個基於 [immer](https://github.com/immerjs/immer) 實作出用來操作狀態的 hook 的 library。它可以讓我們用類似「可變」的方式來更新不可變的狀態，從而簡化狀態更新的邏輯。

## 安裝

::: code-group

```sh [npm]
npm install immer use-immer
```

```sh [pnpm]
pnpm add immer use-immer
```

:::

## API

### useImmer

`useImmer` 的使用方式和 `useState` 類似，函式回傳一個陣列，第一個元素是狀態值，第二個元素是一個用來更新狀態的函式。

```ts
const [state, updateState] = useImmer(initialState);
```

參數

- `initialState`：初始狀態值或是一個回傳初始狀態值的函式。

回傳值

- `state`：目前的狀態值。
- `updateState`：用來更新狀態的函式。它接受一個「製作者函式」（producer function）作為參數，該函式接受一個「草稿狀態」（draft state）作為參數，我們可以在這個函式中直接修改草稿狀態，immer 會自動產生新的不可變狀態。

### useImmerReducer

`useImmerReducer` 是 `useReducer` 的 immer 版本，使用方式也和 `useReducer` 類似。

```ts
const [state, dispatch] = useImmerReducer(reducer, initialState, init?);
```

## 使用方式

### 處理巢狀物件狀態

我們先來看一個範例，使用 `useState` 來管理一個巢狀物件的狀態時，每次更新都需要手動展開物件，這樣會讓程式碼變得冗長且難以維護。

```tsx
import { useState } from 'react';

interface Profile {
  name: string;
  email: string;
  address: {
    city: string;
    country: string;
  };
  marketing: {
    newsletter: boolean;
    sms: boolean;
  };
}

const initialProfile: Profile = {
  name: 'Sheep',
  email: 'abc@example.com',
  address: { city: 'Taipei', country: 'TAIWAN' },
  marketing: { newsletter: true, sms: false },
};

export default function App() {
  const [profile, setProfile] = useState<Profile>(initialProfile);

  const updateName = (name: string) => {
    setProfile((prev) => ({ ...prev, name }));
  };

  const updateCity = (city: string) => {
    setProfile((prev) => ({
      ...prev,
      address: { ...prev.address, city },
    }));
  };

  const toggleNewsletter = () => {
    setProfile((prev) => ({
      ...prev,
      marketing: {
        ...prev.marketing,
        newsletter: !prev.marketing.newsletter,
      },
    }));
  };

  const reset = () => setProfile(initialProfile);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '24px' }}>
      <h1>useState deep updates</h1>
      <section style={{ display: 'grid', gap: '12px', maxWidth: 440 }}>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>Name</span>
          <input
            value={profile.name}
            onChange={(e) => updateName(e.target.value)}
            style={{ padding: '8px 10px' }}
          />
        </label>

        <label style={{ display: 'grid', gap: 4 }}>
          <span>City</span>
          <input
            value={profile.address.city}
            onChange={(e) => updateCity(e.target.value)}
            style={{ padding: '8px 10px' }}
          />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={profile.marketing.newsletter}
            onChange={toggleNewsletter}
          />
          <span>Subscribe to newsletter</span>
        </label>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={reset} style={{ padding: '8px 12px' }}>
            Reset
          </button>
        </div>
      </section>

      <pre
        style={{
          marginTop: 16,
          padding: 12,
          background: '#111',
          color: '#e5e5e5',
          borderRadius: 8,
          maxWidth: 520,
          overflowX: 'auto',
        }}
      >
        {JSON.stringify(profile, null, 2)}
      </pre>
    </main>
  );
}
```

現在我們來用 `useImmer` 重寫這個範例：

```tsx
import { useImmer } from 'use-immer';

export default function App() {
  const [profile, updateProfile] = useImmer<Profile>(initialProfile);

  const updateName = (name: string) => {
    updateProfile((draft) => {
      draft.name = name;
    });
  };

  const updateCity = (city: string) => {
    updateProfile((draft) => {
      draft.address.city = city;
    });
  };

  const toggleNewsletter = () => {
    updateProfile((draft) => {
      draft.marketing.newsletter = !draft.marketing.newsletter;
    });
  };

  const reset = () => updateProfile(() => initialProfile);

  // ...
}
```

可以看到使用 `useImmer` 後，我們可以直接在 `update` 函式中拿到一個可變的 `draft` 狀態，然後直接修改它的屬性，程式碼變得更簡潔易讀。

### 處理陣列狀態

透過 `immer`，我們也可以更方便地操作陣列狀態，所有原生的陣列方法都可以直接使用。

```tsx
import { useState } from 'react';
import { useImmer } from 'use-immer';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function App() {
  const [text, setText] = useState('');
  const [todos, updateTodos] = useImmer<Todo[]>([
    { id: 1, text: 'Learn useImmer', completed: false },
    { id: 2, text: 'Refactor setState code', completed: true },
  ]);

  const addTodo = (value: string) => {
    const next = value.trim();
    if (!next) return;
    updateTodos((draft) => {
      draft.push({ id: Date.now(), text: next, completed: false });
    });
    setText('');
  };

  const toggleTodo = (id: number) => {
    updateTodos((draft) => {
      const target = draft.find((todo) => todo.id === id);
      if (target) {
        target.completed = !target.completed;
      }
    });
  };

  const deleteTodo = (id: number) => {
    updateTodos((draft) => {
      const index = draft.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        draft.splice(index, 1);
      }
    });
  };

  const clearCompleted = () => {
    updateTodos((draft) => draft.filter((todo) => !todo.completed));
  };

  const remaining = todos.filter((todo) => !todo.completed).length;
  const completed = todos.length - remaining;

  return (
    <main>
      <h1>Todo List</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTodo(text);
        }}
        style={{ display: 'flex', gap: 8, marginTop: 12 }}
      >
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Add a task..."
          style={{ flex: 1 }}
        />
        <button type="submit">Add</button>
      </form>

      <section style={{ marginTop: 12 }}>
        <strong>{todos.length} total</strong> · <span>{remaining} remaining</span>
        <button
          type="button"
          onClick={clearCompleted}
          disabled={completed === 0}
          style={{ marginLeft: 8 }}
        >
          Clear completed
        </button>
      </section>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}
          >
            <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
            <span
              style={{
                flex: 1,
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#888' : 'inherit',
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p style={{ color: '#555', marginTop: 12 }}>Nothing here yet. Add your first task!</p>
      )}
    </main>
  );
}
```

## useImmerReducer 範例

我們直接拿之前在 [useReducer 的購物車範例](./useReducer#購物車範例) 來改：

::: code-group

```tsx [index.tsx]
import { useReducer } from 'react'; // [!code --]
import { useImmerReducer } from 'use-immer'; // [!code ++]

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState); // [!code --]
  const [state, dispatch] = useImmerReducer(cartReducer, initialState); // [!code ++]
  // ...
```

```ts [cartReducer.ts]
// ...

export function cartReducer(draft: CartState, action: CartAction) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = draft.items.find((item) => item.id === action.payload.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        draft.items.push({ ...action.payload, quantity: 1 });
      }

      draft.totalAmount = calculateTotal(draft.items);
      break;
    }

    case 'REMOVE_ITEM': {
      draft.items = draft.items.filter((item) => item.id !== action.payload.id);
      draft.totalAmount = calculateTotal(draft.items);
      break;
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        draft.items = draft.items.filter((item) => item.id !== id);
        draft.totalAmount = calculateTotal(draft.items);
        break;
      }

      const item = draft.items.find((cartItem) => cartItem.id === id);
      if (item) {
        item.quantity = quantity;
        draft.totalAmount = calculateTotal(draft.items);
      }

      break;
    }

    case 'CLEAR_CART': {
      return initialState;
    }

    default:
      return draft;
  }
}
```

:::

可以看到使用 `useImmerReducer` 後，我們可以直接在 reducer 中修改 `draft` 狀態，而不需要手動回傳新的狀態物件。

## 注意事項

1. 不要直接修改 draft 以外的狀態值，immer 只能追蹤在 producer function 中的 draft 狀態變更。
2. 回傳值處理：在 producer function 中，如果你回傳一個新的值，immer 會忽略對 draft 的修改，並使用你回傳的值作為新的狀態。

## 總結

`useImmer` 提供了一個簡潔且直觀的方式來管理 React 中的不可變狀態，特別是在處理巢狀物件或陣列時，大幅降低了心智負擔。

## 參考資料

- [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)
- [use-immer GitHub Repository](https://github.com/immerjs/use-immer)
