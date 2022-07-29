# v-model 語法糖原理

元件直接加入 v-model

###### tags: `vue`


## 解析 v-model 背後都做了什麼

在 vue2.0 中 v-model 語法糖簡寫的程式碼：
>`<Son :value="msg" @input="msg=$event" />`

在 vue3.0 中 v-model 語法糖有所調整：
>`<Son :modelValue="msg" @update:modelValue="msg=$event" />`

## 寫一個案例來說明：

需求：父元件傳了一個值給子元件，子元件透過自訂事件去修改值並讓改過的值可以正確顯示

![](https://i.imgur.com/qbsTaWQ.gif)

App 元件
```vue
<template>
  <div>
    <h1>父元件 - {{ count }}</h1>
    <hr />
    <Son :modelValue="count" @update:modelValue="count = $event" />
  </div>
</template>

<script>
import { ref } from 'vue'
import Son from './Son.vue'

export default {
  name: 'App',
  components: { Son },
  setup() {
    const count = ref(10)

    return { count }
  }
}
</script>
```

Son 元件
```vue
<template>
  <h2>
    子元件 - {{ modelValue }}
    <button @click="handleClick">改變父元件</button>
  </h2>
</template>

<script>
export default {
  name: 'Son',
  props: {
    modelValue: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    const handleClick = () => {
      emit('update:modelValue', 100)
    }

    return {
      handleClick
    }
  }
}
</script>
```

首先要來理解一下這段程式碼的意義：`@update:modelValue="count = $event"`，
`$event` 此時為自訂事件的傳參，也就是子元件傳來的 100，然後將它賦值給了 count。

### 使用 v-model 簡化程式碼

在案例中的這一行程式碼：
```vue
<Son :modelValue="count" @update:modelValue="count = $event" />
```

可以直接用 v-model 來完成一樣的功能
```vue
<Son v-model="count" />
```

### 總結：

:::info v2 對比 v3
vue3.0 封裝元件支持 v-model 的時候，父傳子`:modelValue` 子傳父 `@update:modelValue`

vue2.0 的 xxx.sync 語法糖解析：
  * 父傳子 `:xxx` 子傳父 `@update:xxx` 在vue3.0 使用 `v-model:xxx` 代替。
:::

### 補充：Vue 的 $event

如果想要獲取到原生事件裡的事件物件 (Event Object)：
> 1. 如果綁定的是函式 func `func(e){ // e 就是事件物件 }`
> 2. 如果綁定的是JS表達式，此時提供一個默認的變量 `$event`

例如我在 h1 上綁一個點擊事件並直接寫表達式：
```vue
<h1 @click="$event.target.style.color = 'orange'">父元件 - {{ count }}</h1>
```

此時就能透過 $event.target 來取得觸發事件的元素進行操作

![](https://i.imgur.com/z1ahUiM.gif)

如果想要獲取自訂事件：
> 1. 如果綁定的是函式 func `func(data) { // data 觸發自訂事件的傳參 }`
> 2. 如果綁定的是JS表達式，此時 `$event` 代表觸發自訂事件的傳參

