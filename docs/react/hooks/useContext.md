# useContext

在 React 中，如果元件的層級結構較深，如果要將資料從最上層的元件傳遞到最底層的元件，不得不一路將資料透過 props 傳遞下去，即使中間的元件並不需要這些資料都得幫忙代轉，這就是所謂的「prop drilling」問題。

比較直覺的例子是：

```tsx
function App() {
  return <A user="Marsgoat" />;
}

function A(props) {
  return <B user={props.user} />;
}

function B(props) {
  return <C user={props.user} />;
}

function C(props) {
  return <D user={props.user} />;
}

function D(props) {
  return <E user={props.user} />;
}

function E({ user }) {
  return <div>Hello {user}</div>;
}
```
> 只有 E 元件需要 user 資料，但 A → B → C → D 都得幫忙傳。

而解決這個問題的方法之一，就是使用 React 內建的 Context API，透過 Context 可以讓我們更方便地在元件樹中傳遞資料。

## 語法

主要步驟如下：

1. 使用 `createContext` 建立一個全域的 Context 物件。
2. 在元件樹的上層使用 `<Context.Provider value={...}>` (React 18) 或 `Context value={...}` (React 19) 提供資料。
3. 在需要使用資料的元件中，使用 `useContext` 取得 Context。

```tsx
import { createContext, useContext } from 'react';

const ThemeContext = createContext({ theme: 'light' });

function App() {
  return (
    <>
      <ThemeContext.Provider value={{ theme: 'light' }}>
        <Child />
      </ThemeContext.Provider>
    </>
  );
}

function Child() {
  return (
    <>
      <h2>Child</h2>
      <GrandChild />
    </>
  );
}

function GrandChild() {
  const { theme } = useContext(ThemeContext);
  return <p>GrandChild - Current theme: {theme}</p>;
}
```

## 基本使用

來寫一個傳遞主題 (theme) 的範例，要注意在 React 19 中，`Provider` 的寫法有些許不同。

### React 18 範例

首先我們先透過 `createContext` 建立一個 `ThemeContext`，然後透過這個 `ThemeContext` 建立的元件包裹整個應用程式，並提供主題資料。

只要是被包裹的元件，無論在哪個層級，都可以使用 `useContext` 來取得主題資料。

::: code-group

```tsx [context/ThemeContext.tsx]
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

export { ThemeProvider, useTheme };
```

```tsx [main.tsx] {3,9,11}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
```

```tsx [App.tsx]
import type { CSSProperties } from 'react';
import { useTheme } from './context/ThemeContext';

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === 'light' ? '切換為深色' : '切換為淺色';

  return (
    <button type="button" onClick={toggleTheme}>
      {label}
    </button>
  );
}

function ThemedBox({ title }: { title: string }) {
  const { theme } = useTheme();
  const styles: CSSProperties = {
    backgroundColor: theme === 'light' ? '#ffffff' : '#111111',
    border: '1px solid #e5e5e5',
    width: '120px',
    height: '120px',
    color: theme === 'light' ? '#222222' : '#f5f5f5',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '10px',
    transition: 'background-color 150ms ease, color 150ms ease',
  };

  return <div style={styles}>{title}</div>;
}

function App() {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        gap: '16px',
      }}
    >
      <ThemeToggleButton />
      <div style={{ display: 'flex', gap: '12px' }}>
        <ThemedBox title="Parent" />
        <ThemedBox title="Child" />
      </div>
    </div>
  );
}
```

:::

### React 19 範例

::: tip
其實 19 版和 18 版是差不多的，只是不用再使用 `<ThemeContext.Provider>`，而是直接使用 `<ThemeContext>` 元件來包裹即可，不過仍然向下相容 18 版的寫法。
:::

```tsx [context/ThemeContext.tsx]
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    {/* [!code --] */}
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
    {/* [!code ++] */}
    <ThemeContext value={{ theme, toggleTheme }}>
      {children}
    {/* [!code --] */}
    <ThemeContext.Provider>
    {/* [!code ++] */}
    </ThemeContext>
  );
}
```

## 結合購物車範例

現在我們將之前所用 reducer 編寫的購物車範例，用 Context 來管理各個元件之間的購物車狀態。

::: code-group

```tsx [ShoppingCart/CartContext.tsx]
import { createContext, useContext, type ReactNode } from 'react';
import { useImmerReducer } from 'use-immer';
import { cartReducer, initialState } from './cartReducer';
import type { CartState, Product } from './types';

type CartContextType = {
  state: CartState;
  addToCart: (product: Product) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useImmerReducer(cartReducer, initialState);

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext
      value={{
        state,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext>
  );
}

function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}

export { CartProvider, useCart };
```

```tsx [App.tsx]
import ShoppingCart from './components/ShoppingCart';
import { CartProvider } from './components/ShoppingCart/CartContext';

function App() {
  return (
    <CartProvider>
      <ShoppingCart />
    </CartProvider>
  );
}
```

```tsx [ShoppingCart/index.tsx]
function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState); // [!code --]
  // [!code --]
  const handleAddToCart = (product: Product) => { // [!code --]
    dispatch({ type: 'ADD_ITEM', payload: product }); // [!code --]
  }; // [!code --]
  // [!code --]
  const handleUpdateQuantity = (id: number, quantity: number) => { // [!code --]
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }); // [!code --]
  }; // [!code --]
  // [!code --]
  const handleRemove = (id: number) => { // [!code --]
    dispatch({ type: 'REMOVE_ITEM', payload: { id } }); // [!code --]
  }; // [!code --]
  // [!code --]
  const handleClear = () => { // [!code --]
    dispatch({ type: 'CLEAR_CART' }); // [!code --]
  }; // [!code --]

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🛒 購物車範例</h1>

      {/* 商品列表 */}
      <section>
        <h2>商品列表</h2>
        <div className={styles.productList}>
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              {/* [!code --] */}
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>
      </section>

      {/* 購物車內容 */}
      <section className={styles.cartSection}>
        {/* [!code --] */}
        <CartTable
          {/* [!code --] */}
          items={state.items}
          {/* [!code --] */}
          totalAmount={state.totalAmount}
          {/* [!code --] */}
          onUpdateQuantity={handleUpdateQuantity}
          {/* [!code --] */}
          onRemove={handleRemove}
          {/* [!code --] */}
          onClear={handleClear}
          {/* [!code --] */}
        />
        {/* [!code ++] */}
        <CartTable />
      </section>
    </div>
  );
}
```

:::

將原本在 `ShoppingCart` 元件中使用的 `useReducer` 管理的狀態與操作函式，移到了 `CartContext` 中，然後在外層使用 `CartProvider` 包裹整個購物車元件，這樣 `ShoppingCart` 元件以及其子元件就可以透過 `useCart` 來取得購物車的狀態與操作函式，而不需要再透過 props 傳遞。

::: code-group

```tsx [ProductCard.tsx]
function ProductCard({ product, onAddToCart }: ProductCardProps) { // [!code --]
function ProductCard({ product }: ProductCardProps) { // [!code ++]
  const { addToCart } = useCart(); // [!code ++]

  return (
    <div className={styles.productCard}>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addToCart(product)}>
        加入購物車
      </button>
    </div>
  );
}
```

```tsx [CartTable.tsx]
function CartTable({ items, totalAmount, onUpdateQuantity, onRemove, onClear }: CartTableProps) { // [!code --]
function CartTable() { // [!code ++]
  const { state, clearCart } = useCart(); // [!code ++]
  const { items, totalAmount } = state; // [!code ++]

  if (items.length === 0) {
    return <p className={styles.emptyCart}>購物車是空的</p>;
  }

  return (
    <>
      <h2>購物車 ({items.length} 項商品)</h2>
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
              {/* [!code --] */}
              onUpdateQuantity={onUpdateQuantity}
              {/* [!code --] */}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>

      <div className={styles.cartFooter}>
        <h3 className={styles.totalAmount}>總金額: ${totalAmount}</h3>
        <button onClick={clearCart} className={styles.clearButton}>
          清空購物車
        </button>
      </div>
    </>
  );
}
```

```tsx [CartItemRow.tsx]
function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) { // [!code --]
function CartItemRow({ item }: CartItemRowProps) { // [!code ++]
  const { updateQuantity, removeItem } = useCart(); // [!code ++]

  return (
    <tr className={styles.tableRow}>
      <td>{item.name}</td>
      <td className={styles.textCenter}>${item.price}</td>
      <td className={styles.textCenter}>
        <div className={styles.quantityControl}>
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
        </div>
      </td>
      <td className={styles.textCenter}>${item.price * item.quantity}</td>
      <td className={styles.textCenter}>
        <button onClick={() => removeItem(item.id)} className={styles.deleteButton}>
          刪除
        </button>
      </td>
    </tr>
  );
}
```

:::

## 參考資料

- [React 官方文件 - Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React 官方文件 - useContext](https://react.dev/reference/react/useContext)
