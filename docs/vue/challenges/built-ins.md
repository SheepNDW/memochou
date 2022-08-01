# Built-ins 解答

###### tags: `vue`

## DOM Portal

> [題目連結](https://vuejs-challenges.netlify.app/questions/13-dom-portal/README.html)

### 解答

```vue
<script setup>

const msg = "Hello World"

</script>

<template>
  <!-- Renders its to a child element of the `body` -->
  <Teleport to="body">
    <span>{{ msg }}</span>
  </Teleport>	
</template>
```

> 參考閱讀：[Teleport](https://vuejs.org/guide/built-ins/teleport.html#teleport)


## Optimize performance directive

> [題目連結](https://vuejs-challenges.netlify.app/questions/12-optimize-perf-directive/README.html)

### 解答

```vue
<script setup>
import { ref } from "vue"

const count = ref(0)

setInterval(() => {
  count.value++
}, 1000)
</script>

<template>
  <span v-once>Make it never change: {{ count }}</span>
</template>
```
