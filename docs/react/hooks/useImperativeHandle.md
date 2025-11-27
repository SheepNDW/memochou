# useImperativeHandle

`useImperativeHandle` 這個 hook 可以讓我們自訂當使用 `ref` 來存取子元件時，子元件所暴露的某些自定義方法或屬性。類似於在 Vue 元件中的 `defineExpose` 功能。

## 語法 

`useImperativeHandle(ref, createHandle, dependencies?)`

```tsx
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);
  // ...
```

它接收三個參數：

1. `ref`：由 props 得到的 ref 物件。
2. `createHandle`：一個回呼函式，回傳要暴露給父元件的方法或屬性物件。
3. `dependencies`（可選）：一個依賴陣列，當陣列中的值改變時，會重新執行 `createHandle`。

## 基本使用

::: tip 注意
`useRef` 在取得子元件實例時，React `18` 和 `19` 版本的使用方式不太一樣。
:::

### React 18

在 18 版本中需要配合 `forwardRef` 一起使用。

元件透過 `forwardRef` 包裹後，可以接收 `ref` 作為第二個參數，然後在元件內部使用 `useImperativeHandle` 來接收 `ref`，並定義要暴露給父元件的方法或屬性。

::: code-group

``` tsx [App.tsx]
import { useRef } from 'react';
import Child, { type ChildRef } from '@/components/Child';

function App() {
  const childRef = useRef<ChildRef>(null);

  const getChildInfo = () => {
    if (childRef.current) {
      console.log('Child component ref:', childRef.current);
    }
  };

  const incrementChildCount = () => {
    childRef.current?.increment();
  };

  const decrementChildCount = () => {
    childRef.current?.decrement();
  };

  return (
    <>
      <h1>Parent Component</h1>
      <button onClick={getChildInfo}>Get Child Info</button>
      <button onClick={incrementChildCount}>Increment Child Count</button>
      <button onClick={decrementChildCount}>Decrement Child Count</button>

      <hr />

      <Child ref={childRef} />
    </>
  );
}
```

``` tsx [components/Child.tsx] tsx{10,13-20}
import { forwardRef, useImperativeHandle, useState } from 'react';

export interface ChildRef {
  name: string;
  count: number;
  increment: () => void;
  decrement: () => void;
}

const Child = forwardRef<ChildRef>(function Child(_props, ref) {
  const [count, setCount] = useState(0);

  useImperativeHandle(ref, () => {
    return {
      name: 'Child',
      count,
      increment: () => setCount(count + 1),
      decrement: () => setCount(count - 1),
    };
  });

  return (
    <div>
      <h2>Child</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </div>
  );
});

export default Child;
```
:::

### React 19

在 19 版本中不再需要配合 `forwardRef` 使用，子元件可以直接從 props 中取得 `ref`。

``` tsx [components/Child.tsx]
const Child = forwardRef<ChildRef>(function Child(_props, ref) { // [!code --]
function Child({ ref }: { ref: React.Ref<ChildRef> }) { // [!code ++]
  const [count, setCount] = useState(0);

  useImperativeHandle(ref, () => {
    return {
      name: 'Child',
      count,
      increment: () => setCount(count + 1),
      decrement: () => setCount(count - 1),
    };
  });

  return (
    <div>
      <h2>Child</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </div>
  );
}
```

## 執行時機（第三個參數）

1. 如果不傳入第三個參數，那麼 `useImperativeHandle` 會在每次元件掛載和重新渲染時都會執行。

```tsx
useImperativeHandle(ref, () => {
  // ...
});
```

2. 如果傳入一個空陣列作為第三個參數，那麼 `useImperativeHandle` 只會在元件掛載時執行一次，然後狀態更新時不會再執行。

```tsx
useImperativeHandle(ref, () => {
  // ...
}, []);
```

3. 如果傳入一個有依賴值的陣列作為第三個參數，那麼 `useImperativeHandle` 會在元件掛載時執行一次，然後只有當陣列中的依賴值改變時才會再執行。

```tsx
const [count, setCount] = useState(0);

useImperativeHandle(ref, () => {
  // ...
}, [count]);
```

## 參考資料

- [React 官方文件 - forwardRef](https://react.dev/reference/react/forwardRef)
- [React 官方文件 - useRef](https://react.dev/reference/react/useRef#i-cant-get-a-ref-to-a-custom-component)
- [React 官方文件 - useImperativeHandle](https://react.dev/reference/react/useImperativeHandle)
