# CSS Features 解答

###### tags: `vue`

## Dynamic css values

> [題目連結](https://vuejs-challenges.netlify.app/questions/14-dynamic-css-values/README.html)

### 解答

```vue
<script setup>
import { ref } from "vue"
const theme = ref("red")

const colors = ["blue", "yellow", "red", "green"]

setInterval(() => {
  theme.value = colors[Math.floor(Math.random() * 4)]
}, 1000)

</script>

<template>
  <p>hello</p>
</template>

<style scoped>
/* Modify the code to bind the dynamic color */
p {
  color: v-bind(theme)
}
</style>
```

> 參考閱讀：[v-bind() in CSS](https://vuejs.org/api/sfc-css-features.html#v-bind-in-css)


## Global CSS

> [題目連結](https://vuejs-challenges.netlify.app/questions/27-global-css/README.html)


### 解答

```vue
<template>
  <p>Hello Vue.js</p>
</template>

<style scoped>

p {
  font-size:20px;
  color:red;
  text-align: center;
  line-height: 50px;
}

/* Make it works */
:global(body) {
  width: 100vw;
  height: 100vh;
  background-color: burlywood;
}
</style>

```

> 參考閱讀：[Global Selectors](https://vuejs.org/api/sfc-css-features.html#global-selectors)

