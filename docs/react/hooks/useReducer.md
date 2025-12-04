---
outline: deep
---

# useReducer

`useReducer` 提供我們除了 `useState` 外另一種管理狀態的方式，讓我們可以處理較複雜的狀態邏輯。

它可以同時更新多個狀態，而且可以把對狀態的更新邏輯從元件中抽離出來，讓程式碼更具可讀性與可維護性。

## 語法

```ts
const [state, dispatch] = useReducer(reducer, initialArg, init?);
```

### 參數

- `reducer`：一個處理狀態更新邏輯的函式，接收兩個參數：目前的狀態 `state` 和一個描述更新行為的 `action` 物件，並回傳新的狀態。
- `initialArg`：初始狀態的值。
- `init?`：一個可選的初始化函式，用於根據 `initialArg` 計算初始狀態。

### 回傳值

`useReducer` 回傳一個陣列，包含兩個元素：

1. `state`：目前的狀態值。初次渲染時，它是 `init(initialArg)` 或是 `initialArg`（如果沒有提供 `init` 函式）的結果。
2. `dispatch`：一個用於觸發狀態更新的函式。用於更新 state 並觸發元件重新渲染。

```tsx
import { useReducer } from 'react';

// 根據舊狀態 `state` 進行處理，處理完後回傳新狀態 `newState`
// reducer 只會在 dispatch 被呼叫時執行
// `state` 是唯讀的，不能直接修改
function reducer(state, action) {
  // ...
  return newState;
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 18 });
  // ...
}
```

## 基本使用

我們來看一個簡單的計數器範例：

首先我們要先定義初始狀態（initial state）：

```tsx
const initialState = { count: 0 };
```

然後是 reducer 函式：

```tsx
const initialState = { count: 0 };

type State = typeof initialState;
type ActionType = { type: 'increment' } | { type: 'decrement' };

function reducer(state: State, action: ActionType) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}
```

`reducer` 是一個根據不同 `action` 來更新狀態的純函式。它接收一個目前的狀態和一個描述更新行為的 `action` 物件，然後根據 `action.type` 來決定如何更新狀態。

```tsx [Counter.tsx]
function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h1>Count: {state.count}</h1>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}

export default Counter;
```

當點擊 "+" 按鈕時，會呼叫 `dispatch({ type: 'increment' })`，觸發 `reducer` 函式，並將 `state.count` 增加 1。點擊 "-" 按鈕則會減少 1。

## 購物車範例

`useReducer` 非常適合用來管理較複雜的狀態，假設我們今天要實作一個購物車功能，需要有基本的 CRUD，我們可以透過 `useReducer` 來更好地去管理所有與購物車相關的狀態。

我們先來確認整體元件的設計架構：

```
src/components/ShoppingCart/
├── index.tsx           # 主元件，管理狀態與組合子元件
├── types.ts            # 型別定義
├── cartReducer.ts      # Reducer 邏輯
├── ProductCard.tsx     # 商品卡片元件
├── CartItemRow.tsx     # 購物車單項元件
├── CartTable.tsx       # 購物車表格元件
└── ShoppingCart.module.css
```

CSS template 如下：

```css [ShoppingCart.module.css]
.container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.title {
  margin-bottom: 20px;
}

/* 商品列表 */
.productList {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.productCard {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  min-width: 120px;
}

.productCard h3 {
  margin: 0 0 8px 0;
}

.productCard p {
  margin: 0 0 12px 0;
}

.addButton {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.addButton:hover {
  background-color: #45a049;
}

/* 購物車區塊 */
.cartSection {
  margin-top: 30px;
}

.emptyCart {
  color: #888;
}

/* 表格 */
.table {
  width: 100%;
  border-collapse: collapse;
}

.tableHeader {
  border-bottom: 2px solid #ddd;
}

.tableHeader th {
  padding: 10px;
}

.textLeft {
  text-align: left;
}

.textCenter {
  text-align: center;
}

.tableRow {
  border-bottom: 1px solid #eee;
}

.tableRow td {
  padding: 10px;
}

/* 數量控制 */
.quantityControl {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* 刪除按鈕 */
.deleteButton {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.deleteButton:hover {
  background-color: #d32f2f;
}

/* 購物車底部 */
.cartFooter {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.totalAmount {
  margin: 0;
  font-size: 1.2rem;
}

.clearButton {
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clearButton:hover {
  background-color: #f57c00;
}
```

### 定義初始狀態與 reducer 函式

在修改購物車狀態時，要切記 immutable 的原則，不能直接修改 `state`，在對複雜資料結構進行更新時，要先建立新的物件或陣列，再進行修改，最後回傳新的狀態。

::: code-group

```ts [cartReducer.ts]
import type { CartState, CartAction, CartItem } from './types';

export const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id);

      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      return {
        items: updatedItems,
        totalAmount: calculateTotal(updatedItems),
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter((item) => item.id !== action.payload.id);
      return {
        items: updatedItems,
        totalAmount: calculateTotal(updatedItems),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        const updatedItems = state.items.filter((item) => item.id !== id);
        return {
          items: updatedItems,
          totalAmount: calculateTotal(updatedItems),
        };
      }

      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      return {
        items: updatedItems,
        totalAmount: calculateTotal(updatedItems),
      };
    }

    case 'CLEAR_CART': {
      return initialState;
    }

    default:
      return state;
  }
}
```

```ts [types.ts]
export type Product = {
  id: number;
  name: string;
  price: number;
};

export type CartItem = Product & {
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  totalAmount: number;
};

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };
```

:::

### 在元件中使用 useReducer

::: code-group

```tsx [index.tsx]
import { useReducer } from 'react';
import { cartReducer, initialState } from './cartReducer';
import CartTable from './CartTable';
import ProductCard from './ProductCard';
import styles from './ShoppingCart.module.css';
import type { Product } from './types';

// 模擬商品資料
const products: Product[] = [
  { id: 1, name: '蘋果', price: 30 },
  { id: 2, name: '香蕉', price: 20 },
  { id: 3, name: '橘子', price: 25 },
];

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const handleAddToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemove = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🛒 購物車範例</h1>

      <section>
        <h2>商品列表</h2>
        <div className={styles.productList}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>

      <section className={styles.cartSection}>
        <h2>購物車 ({state.items.length} 項商品)</h2>
        <CartTable
          items={state.items}
          totalAmount={state.totalAmount}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemove}
          onClear={handleClear}
        />
      </section>
    </div>
  );
}

export default ShoppingCart;
```

```tsx [ProductCard.tsx]
import styles from './ShoppingCart.module.css';
import type { Product } from './types';

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
};

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className={styles.productCard}>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => onAddToCart(product)} className={styles.addButton}>
        加入購物車
      </button>
    </div>
  );
}

export default ProductCard;
```

```tsx [CartTable.tsx]
import CartItemRow from './CartItemRow';
import styles from './ShoppingCart.module.css';
import type { CartItem } from './types';

type CartTableProps = {
  items: CartItem[];
  totalAmount: number;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  onClear: () => void;
};

function CartTable({ items, totalAmount, onUpdateQuantity, onRemove, onClear }: CartTableProps) {
  if (items.length === 0) {
    return <p className={styles.emptyCart}>購物車是空的</p>;
  }

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}>
            <th className={styles.textLeft}>商品</th>
            <th className={styles.textCenter}>單價</th>
            <th className={styles.textCenter}>數量</th>
            <th className={styles.textCenter}>小計</th>
            <th className={styles.textCenter}>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>

      <div className={styles.cartFooter}>
        <h3 className={styles.totalAmount}>總金額: ${totalAmount}</h3>
        <button onClick={onClear} className={styles.clearButton}>
          清空購物車
        </button>
      </div>
    </>
  );
}

export default CartTable;
```

```tsx [CartItemRow.tsx]
import styles from './ShoppingCart.module.css';
import type { CartItem } from './types';

type CartItemRowProps = {
  item: CartItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
};

function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  return (
    <tr className={styles.tableRow}>
      <td>{item.name}</td>
      <td className={styles.textCenter}>${item.price}</td>
      <td className={styles.textCenter}>
        <div className={styles.quantityControl}>
          <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
        </div>
      </td>
      <td className={styles.textCenter}>${item.price * item.quantity}</td>
      <td className={styles.textCenter}>
        <button onClick={() => onRemove(item.id)} className={styles.deleteButton}>
          刪除
        </button>
      </td>
    </tr>
  );
}

export default CartItemRow;
```

:::

### 進階：使用第三個參數 init

useReducer 的第三個參數 init 可以用於初始化狀態：

```tsx
function init(initialCount: number): CartState {
  // 可以從 localStorage 讀取，或進行其他計算
  const saved = localStorage.getItem('cart');
  if (saved) {
    return JSON.parse(saved);
  }
  return { items: [], totalAmount: initialCount };
}

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, 0, init);
  // ...
}
```

這種方式的好處：

- 初始化邏輯從元件中抽離
- `init` 函式可以重用於重置狀態
- 避免在每次渲染時都執行初始化邏輯


## 總結

為什麼這個範例適合使用 `useReducer` 呢？我們可以從下表來比較 `useState` 與 `useReducer` 在這個情境下的差異：

| 特性               | useState            | useReducer                     |
| ------------------ | ------------------- | ------------------------------ |
| 單一狀態更新       | ✅ 簡單              | ⚠️ 稍微複雜                     |
| 多個相關狀態更新   | ⚠️ 需多次 `setState` | ✅ 一次 `dispatch` 更新多個狀態 |
| 複雜邏輯處理       | ❌ 邏輯散落各處      | ✅ 集中在 `reducer` 函式中      |
| 狀態依賴前一個狀態 | ⚠️ 需用 callback     | ✅ 自動拿到最新 state           |
| 可測試性           | ⚠️ 需 mock 元件      | ✅ 純函式易測試                 |

Reducer 的設計原則

1. 純函式（Pure Function）
   - 相同的輸入永遠產生相同的輸出
   - 不產生副作用（如 API 呼叫、修改外部變數）
2. Immutable 更新

```ts
// 錯誤：直接修改 state
state.items.push(newItem);
return state;

// 正確：建立新的陣列
return {
  ...state,
  items: [...state.items, newItem],
};
```

### 何時選擇 useReducer？

適合使用 `useReducer` 的情境：

- 狀態邏輯複雜，包含多個子值
- 下一個狀態依賴於前一個狀態
- 需要集中管理多種更新操作
- 想讓狀態邏輯更容易測試

適合使用 `useState` 的情境：

- 狀態簡單（布林值、字串、數字）
- 狀態更新邏輯簡單
- 狀態之間沒有關聯性


## 參考資料

- [React 官方文件 - useReducer](https://react.dev/reference/react/useReducer)
