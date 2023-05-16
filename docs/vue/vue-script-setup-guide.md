# Vue 3 初探 Script Setup 

###### tags: `vue`

[參考影音](https://youtu.be/9whgkjxoCME) <br>
[官方文件](https://staging-cn.vuejs.org/api/sfc-script-setup.html)


## 專案建立

快速搭建一個基於 Vite 的 Vue 專案
```sh
npm init vue@latest
``` 

專案名稱：vue-script-setup
其餘配置全選 no

## Basic Syntax

### 傳統 setup 函式
```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const name = ref('Sheep')
    const age = ref(24)
    
    const handleClick = () => {
      name.value = 'Hitsuji'
      age.value = 30
    }

    return {
      name,
      age,
      handleClick
    }
  }
}
</script>

<template>
  <h1 @click="handleClick">My name is {{ name }}, I'm {{ age }} years old</h1>
</template>
```
setup function 什麼都好就是有個地方挺惱人：每個定義的資料或是方法都要在最後 return 出去，有時候忘記返回了就會報錯，開發體驗不太好。


::: info 在本篇的主角 `<script setup>` 出現後，這個問題獲得了解決
:::

### `<script setup>`
  
> `<script setup>` is a compile-time syntactic sugar for using Composition API inside Single File Components (SFCs)
> 
> `<script setup>` 是在 SFC 中使用 Composition API 編譯時的語法糖

使用方式很簡單，直接在 script 標籤上加上 setup 屬性(attribute)，在裡面定義的資料及方法就不需要再另外 return 給模板：

```vue
<script setup>
import { ref } from 'vue'

const name = ref('Sheep')
const age = ref(24)
</script>
```
當使用 `<script setup>` 的時候，任何在 `<script setup>` 聲明的頂層的綁定 (包括變數，函式聲明，以及 import 引入的內容) 都能在模板中直接使用

> `<script setup>` will **execute every time an instance of the component is created.**
> 
> 在裡面的程式碼會被編譯成 component setup 函式的內容，也就是說它和普通的 `<script>` 標籤只在 component 首次引入執行一次不同，`<script setup>` 中的程式碼會在每一次元件實例被創建的時候執行。


## Using Components

在 `<script setup>` 裡的值也能直接被當作自定義元件的標籤名

```vue
<script setup>
import { ref } from 'vue'
import MyButton from './components/MyButton.vue'

const name = ref('Sheep')
const age = ref(24)

const handleClick = () => {
  name.value = 'Hitsuji'
  age.value = 30
}
</script>

<template>
  <h1 @click="handleClick">My name is {{ name }}, I'm {{ age }} years old</h1>
  <MyButton />
</template>
```
> 直接將 MyButton 視為一個變數來引用，不需要另外寫一個 component 屬性去註冊

## `defineProps()`

在 `<script setup>` 中必須使用 defineProps 和 defineEmits API 來聲明 props 和 emits

### 原本的選項式寫法

```vue
<template>
  <!-- 父元件中傳入一個 prop -->
  <MyButton text="this is a button" />
</template>
```

```vue
<script>
export default {
  props: {
    // 這裡的寫法跟以前一樣
    text: {
      type: String,
      default: 'Click'
    }
  },
  setup(props) {
    console.log(props.text)
  }
}
</script>
```
> 如果想要在 setup 中存取 props 的值需透過傳參的方式來獲得 props 的值

### `<script setup>`

```vue
<script setup>
const props = defineProps({
  text: {
    type: String,
    default: 'Click'
  }
})

console.log(props.text)
</script>

<template>
  <button>{{ text }}</button>
</template>
```
> 在模板中可以直接寫 text 來存取，而在 script 標籤裡要再加上 `props.XXX`


## `defineEmits()`

`App.vue` 在父元件中綁定一個自訂事件在 MyButton 上
```vue
<script setup>
import { ref } from 'vue'
import MyButton from './components/MyButton.vue'

const name = ref('Sheep')
const age = ref(24)

const handleClick = () => {
  name.value = 'Hitsuji'
  age.value = 18
}

const changeAge = (value) => {
  age.value = value
}
</script>

<template>
  <h1 @click="handleClick">My name is {{ name }}, I'm {{ age }} years old</h1>
  <MyButton text="this is a button" @buttonClicked="changeAge" />
</template>
```

`MyButton.vue`
```vue
<script setup>
const props = defineProps({
  text: {
    type: String,
    default: 'Click'
  }
})

const emit = defineEmits(['buttonClicked'])

const handleButtonClicked = () => {
  emit('buttonClicked', 30)
}
</script>

<template>
  <button @click="handleButtonClicked">{{ text }}</button>
</template>
```
> 使用 `defineEmits()` API 來在 script 標籤中使用及定義 emits

