---
outline: deep
---


# effectScope()

本文為閱讀完此 [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md) 後並參考了 VueUse 中的一些實作後的筆記。

###### tags: `vue`

`effectScope` 是 Vue 3.2 才出現的 API，[官方文檔](https://vuejs.org/api/reactivity-advanced.html#effectscope)對其的說明是創建一個 effect 作用域，可以捕獲其中所建立的響應式副作用 (例如 computed, watcher)，這樣捕獲到的副作用可以一起處理，更多此 API 的說明可以參考官方[RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md)

## `effectScope()`

* 型別

```ts
function effectScope(detached?: boolean): EffectScope

interface EffectScope {
  run<T>(fn: () => T): T | undefined // undefined if scope is inactive
  stop(): void
}
```

* 範例

```js
const scope = effectScope()

scope.run(() => {
  const doubled = computed(() => counter.value * 2)

  watch(doubled, () => console.log(doubled.value))

  watchEffect(() => console.log('Count: ', doubled.value))
})

// to dispose all effects in the scope
scope.stop()
```

## 為什麼會有 effectScope？

根據 RFC 上的說法，在 Vue 的元件 `setup()`中，這些副作用 (effect) 會被收集並綁定到目前實例 (instance) 上，當實例被卸載時，副作用將被自動處理。

然而如果我們在元件之外或是做為一個獨立的 package 使用它們時，就需要手動去收集&清除這些副作用，如下：

* 收集：

```js
const disposables = [];

const counter = ref(0);
const doubled = computed(() => counter.value * 2);

disposables.push(() => stop(doubled));

const stopWatch1 = watchEffect(() => {
  console.log(`counter: ${counter.value}`);
});

disposables.push(stopWatch1);

const stopWatch2 = watch(doubled, () => {
  console.log(doubled.value);
});

disposables.push(stopWatch2);
```

* 清理：

```js
disposables.forEach((f) => f());
disposables = [];
```

手動去執行不僅複雜的邏輯收集成本較高之外，如果忘記收集也可能造成記憶體洩漏 (memory leaks)，effectScope 就是為了幫開發者做這件事而誕生的。


## effectScope 的使用

### 基本用法

建立一個作用域 (scope)：
```js
const scope = effectScope();
```

這個 scope 可以執行一個函式並將捕獲函式同步執行期間的所有副作用，也包含任何在內部建立副作用的 API (e.g. `computed`, `watch` and `watchEffect`)：

```js
scope.run(() => {
  const doubled = computed(() => counter.value * 2);

  watch(doubled, () => console.log(doubled.value));

  watchEffect(() => console.log('Count: ', doubled.value));
});

// the same scope can run multiple times
scope.run(() => {
  watch(counter, () => {
    /*...*/
  });
});
```

當 `scope.stop()` 被呼叫時，它將遞迴地停止所有捕獲的副作用和巢狀的作用域。

```js
scope.stop();
```

### 巢狀作用域 Nested Scopes

預設情況下巢狀的作用域也由父層作用域收集，當父層作用域被釋放 (dispose) 時，它的所有後代作用域也將停止。

```js
const scope = effectScope();

scope.run(() => {
  const doubled = computed(() => counter.value * 2);

  // not need to get the stop handler, it will be collected by the outer scope
  effectScope().run(() => {
    watch(doubled, () => console.log(doubled.value));
  });

  watchEffect(() => console.log('Count: ', doubled.value));
});

// dispose all effects, including those in the nested scopes
scope.stop();
```

### 分離的巢狀作用域 Detached Nested Scopes

`detached` 表示是否分離和父層的聯繫，如果為 `true` 則表示與父層分離，執行父層的 `stop` 方法時不會去停止巢狀作用域的監聽：

```js
let nestedScope;

const parentScope = effectScope();

parentScope.run(() => {
  const doubled = computed(() => counter.value * 2);

  // with the detected flag,
  // the scope will not be collected and disposed by the outer scope
  nestedScope = effectScope(true /* detached */);
  nestedScope.run(() => {
    watch(doubled, () => console.log(doubled.value));
  });

  watchEffect(() => console.log('Count: ', doubled.value));
});

// disposes all effects, but not `nestedScope`
parentScope.stop();

// stop the nested scope only when appropriate
nestedScope.stop();
```

### `onScopeDispose`

和 `onUnmounted()` 很像，區別在 `onScopeDispose` 作用於目前的作用域而不是元件實例。這可以幫助我們去清理 composable functions 在其作用域中的副作用，由於 `setup()` 也為元件建立了一個作用域，當沒有顯式建立作用域時，它會等效於 `onUnmounted()`：

```js
import { onScopeDispose } from 'vue';

const scope = effectScope();

scope.run(() => {
  onScopeDispose(() => {
    console.log('cleaned!');
  });
});

scope.stop(); // logs 'cleaned!'
```

## 使用案例

### Shared Composable

有些組合函式會設置全域的副作用，例如下面的 `useMouse()` 函式：

```js
import { ref, onUnmounted } from 'vue';

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function handler(e) {
    x.value = e.x;
    y.value = e.y;
  }

  window.addEventListener('mousemove', handler);

  onUnmounted(() => {
    window.removeEventListener('mousemove', handler);
  });

  return { x, y };
}
```

如果在多個元件中呼叫 `useMouse()`，則每個元件都會掛上一個 `mousemove` 的偵聽器並創建自己的 `x` 和 `y`。
在這裡應該能夠透過在多個元件之間共享相同的偵聽器和`x` `y` 來提升效能，但我們無法，因為每個 `onUnmounted` 的呼叫都耦合到單個元件實例。

我們可以使用 detached scope 和 `onScopeDispose` 來做到這件事。首先我們需要將 `onUnmounted` 換成 `onScopeDispose`：

```diff
- import { ref, onUnmounted } from 'vue';
+ import { ref, onScopeDispose } from 'vue';

export function useMouse() {
- onUnmounted(() => {
+ onScopeDispose(() => {
    window.removeEventListener('mousemove', handler);
  });
}
```

這依然能正常執行是因為 Vue 元件現在也還是在一個作用域中執行它的 `setup()`，這個作用域將在元件卸載時被釋放。

然後我們可以新建一個用來管理父層作用域訂閱的工具函式：

```js
/* createSharedComposable.js */
import { effectScope, onScopeDispose } from 'vue';

export function createSharedComposable(composable) {
  let subscribers = 0;
  let state, scope;

  const dispose = () => {
    if (scope && --subscribers <= 0) {
      scope.stop();
      state = scope = null;
    }
  };

  return (...arg) => {
    subscribers++;
    if (!state) {
      scope = effectScope(true);
      state = scope.run(() => composable(...arg));
    }
    onScopeDispose(dispose);
    return state;
  };
}
```

現在我們就可以透過它來創造一個可以共享版本的 `useMouse`：

```js
const useSharedMouse = createSharedComposable(useMouse);
```

這個新的 `useSharedMouse` 組合函式只會在全域掛一次事件偵聽器，無論有多少元件去使用它，並且它會在沒有任何元件使用時自己移除掉事件偵聽器。

### Ephemeral Scopes

我們還可以動態建立或釋放一些作用域，`onScopeDispose` 讓 `useMouse` 能正確進行清理，而在此過程中永遠不會呼叫 `onUnmounted`。

```vue
<script setup>
import { effectScope, onScopeDispose, ref, watch } from 'vue';
import { useMouse } from '../composable/useMouse';

const enabled = ref(true);
let mouseState, mouseScope;

const dispose = () => {
  mouseScope && mouseScope.stop();
  mouseState = null;
};

watch(
  enabled,
  () => {
    if (enabled.value) {
      mouseScope = effectScope();
      mouseState = mouseScope.run(() => useMouse());
    } else {
      dispose();
    }
  },
  { immediate: true }
);

onScopeDispose(dispose);
</script>
```

### Global State

我們還可以利用 `effectScope` 去模擬一個 `store` 來完成一套比較靈活的狀態管理。

