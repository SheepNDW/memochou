# useTransition

`useTransition` 是 React 18 引進的一個 hook，用於管理 UI 的過渡狀態。它可以被用來標記較低優先級，而不阻塞較高優先級的更新。

## 語法

```ts
const [isPending, startTransition] = useTransition();
```

### 參數

`useTransition` 不接受任何參數。

### 回傳值

`useTransition` 回傳一個陣列，包含兩個元素：

1. `isPending`: 一個布林旗標，表示是否有待處理的 transition。
2. `startTransition` 函式: 用於包裹需要標記為 transition 的更新，呼叫此函式可以把狀態的更新標記為較低優先級。

## 用法

`useTransition` 可以將一個更新標記為低優先級的更新，使其可以被較高優先級的更新打斷，不會阻塞 UI 對使用者操作的回應，提高使用者體驗。

來看一個官網提供的 Tab 切換範例：

::: code-group

```tsx [App.tsx]
import { useState } from 'react';
import AboutTab from './components/Tabs/AboutTab';
import ContactTab from './components/Tabs/ContactTab';
import PostsTab from './components/Tabs/PostsTab';
import TabButton from './components/Tabs/TabButton';

function App() {
  const [tab, setTab] = useState('about');

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```tsx [TabButton.tsx]
import { useTransition } from 'react';

type Props = {
  action: () => void | Promise<void>;
  children: React.ReactNode;
  isActive: boolean;
};

export default function TabButton({ action, children, isActive }: Props) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>;
  }
  if (isPending) {
    return (
      <b
        style={{
          opacity: 0.5,
          cursor: 'wait',
          pointerEvents: 'none',
        }}
      >
        {children}
      </b>
    );
  }
  return (
    <button
      onClick={async () => {
        startTransition(async () => {
          // await the action that's passed in.
          // This allows it to be either sync or async.
          await action();
        });
      }}
    >
      {children}
    </button>
  );
}
```

```tsx [PostsTab.tsx]
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  const items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return <ul>{items}</ul>;
});

function SlowPost({ index }: { index: number }) {
  const startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return <li>Post #{index + 1}</li>;
}

export default PostsTab;
```

```tsx [AboutTab.tsx]
export default function AboutTab() {
  return <p>Welcome to my profile!</p>;
}
```

```tsx [ContactTab.tsx]
export default function ContactTab() {
  return (
    <>
      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

:::

可以觀察到 `TabButton` 元件，它使用了 `useTransition` 來管理按鈕的狀態。在按鈕被點擊時，會呼叫 `startTransition` 函式來包裹 `action`，這樣可以將切換 Tab 的更新標記為低優先級。當 `isPending` 為 `true` 時，按鈕會顯示為半透明且不可點擊，表示正在進行 transition。

這讓我們可以在點了 Posts Tab 後，仍然能夠順暢地點擊 About 或 Contact Tab，而不會被 Posts Tab 的大量渲染所阻塞。

```tsx [TabButton.tsx] {22-26}
export default function TabButton({ action, children, isActive }: Props) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>;
  }
  if (isPending) {
    return (
      <b
        style={{
          opacity: 0.5,
          cursor: 'wait',
          pointerEvents: 'none',
        }}
      >
        {children}
      </b>
    );
  }
  return (
    <button
      onClick={async () => {
        startTransition(async () => {
          // await the action that's passed in.
          // This allows it to be either sync or async.
          await action();
        });
      }}
    >
      {children}
    </button>
  );
}
```

## 原理解析

`useTransition` 的核心原理是將一部分狀態更新處理為低優先任務，這樣可以將比較重要的 UI 更新任務優先執行，在渲染大量資料或進行複雜計算時，能夠保持 UI 的流暢性。React 會透過 Scheduler 來管理這些任務的優先級：

1. 高優先級更新：直接影響使用者互動的更新，例如表單輸入、按鈕點擊等。
2. 低優先級更新：相對不影響互動的過渡性任務，例如大量資料渲染、動畫等。

```txt
+-----------------------+
|         App           |
|                       |
|  +--------------+     |
|  |    Input     |     |
|  +--------------+     |
|                       |
|  +--------------+     |
|  |   Display    |     |
|  +--------------+     |
+-----------------------+

使用者輸入
    |
    v
[高優先級更新] ---> [調度器] ---> [React 更新元件]
    |
    +---> [低優先級過渡更新] --> [調度器] --> [等待處理]
```

## 參考資料

- [React 官方文件 - useTransition](https://react.dev/reference/react/useTransition)
