# Advanced Ref APIs

> Reference：
> - [shallowRef()](https://vuejs.org/api/reactivity-advanced.html#shallowref)
> - [triggerRef()](https://vuejs.org/api/reactivity-advanced.html#shallowref)
> - [customRef()](https://vuejs.org/api/reactivity-advanced.html#shallowref)

## shallowRef()

呼叫 `ref()` 會回傳一個響應式的 ref 物件，並透過 `.value` 取得內部得值。而 `shallowRef()` 用法和 `ref` 一樣差別在於它只對淺層的資料進行響應式監聽：

```vue:line-numbers
<script setup lang="ts">
import { ref, shallowRef } from 'vue';

const message = ref({
  content: 'hello world',
});

const shallowMsg = shallowRef({
  content: 'hello world',
});

const changeRef = () => {
  message.value.content = 'has changed!';
};

const changeShallowRef = () => {
  shallowMsg.value.content = 'has changed!';
};
</script>

<template>
  <div>
    <button @click="changeRef">change ref</button>
    <button @click="changeShallowRef">change shallowRef</button>
    <h2>ref: {{ message }}</h2>
    <h2>shallowRef: {{ shallowMsg }}</h2>
  </div>
</template>
```

![](https://i.imgur.com/mGtTlwL.gif)

> 實際去點兩個按鈕會發現 shallowRef 並不會更新，但其實值已經改了

如果想要讓更改有響應式的話有兩個方式：

- 直接對 `value` 做修改：

```ts
const changeShallowRef = () => {
  shallowMsg.value.content = 'has changed!'; // [!code --]
  shallowMsg.value = { // [!code ++]
    content: 'has changed!', // [!code ++]
  }; // [!code ++]
};
```

- 使用 `triggerRef()` 去強制更新

## triggerRef()

`triggerRef` 可以強制觸發一個依賴於 `shallowRef` 的副作用，通常用在對一個 `shallowRef` 物件的深層結構進行修改後。

繼續修改剛剛的範例：

```ts
const changeShallowRef = () => {
  shallowMsg.value.content = 'use triggerRef force to update!';
  triggerRef(shallowMsg); // 呼叫 triggerRef 並將 shallowMsg 傳入
};
```

![](https://i.imgur.com/KJ9efpE.gif)

::: warning 注意
如果把 `ref` 跟 `shallowRef` 的修改放在一起會導致 `shallowRef` 的深層修改被同時觸發，因為 `ref` 的修改會去呼叫 `triggerRef`
:::

將範例的 `changeRef` 改成如下：

```ts
const changeRef = () => {
  message.value.content = 'has changed!';
  shallowMsg.value.content = 'also changed!';
};
```

![](https://i.imgur.com/A0CWkDA.gif)

## customRef()

客製一個自定義的 ref，顯式宣告對其依賴追蹤和更新觸發的控制方式。

- 使用方式

`customRef()` 預期接收一個工廠函式作為參數，這個工廠函式接受 `track` 和 `trigger` 兩個函式作為參數，並回傳一個帶有 `get` 和 `set` 方法的物件。

一般會在 `get` 中透過 `track()` 告訴 vue 該追蹤哪個依賴，在 `set` 去呼叫 `trigger()` 來告訴 vue 現在應該去觸發更新並重新解析 template。

- 範例：

客製一個 ref 只能接收數字的字串，任何不是數字的改動都不做改變：

```vue:line-numbers
<script setup lang="ts">
import { customRef } from 'vue';

const strNum = strNumberRef('');

function strNumberRef<T>(value: T) {
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        if (isNaN(+newValue)) {
          newValue = value;
        }
        value = newValue;
        trigger();
      },
    };
  });
}
</script>

<template>
  <div>
    only sting number ref:
    <input type="text" v-model="strNum" />
  </div>
</template>
```
