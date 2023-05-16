# Directives 解答

###### tags: `vue`

## Capitalize

> [題目連結](https://vuejs-challenges.netlify.app/questions/305-capitalize/README.html)

### 解答

* 解法一：自訂 Input 元件 ([官方文件寫法](https://vuejs.org/guide/components/events.html#usage-with-v-model))

```vue
<!-- App.vue -->
<script setup>
import { ref } from 'vue';
import CustomInput from './components/CustomInput.vue';

const val = ref('yoyo');
</script>

<template>
  <CustomInput v-model.capitalize="val" />
</template>
```

```vue
<!-- CustomInput.vue -->
<script setup>
const props = defineProps({
  modelValue: {
    type: String,
  },
  modelModifiers: {
    type: Object,
    default: () => ({}),
  },
});
// console.log(props.modelModifiers) // { capitalize: true }

const emit = defineEmits(['update:modelValue']);

const emitValue = (e) => {
  let value = e.target.value;
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1);
  }
  emit('update:modelValue', value);
};
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

* 解法二：為 v-model 加上自訂修飾子

```vue
<script setup>
import { ref, vModelText } from 'vue';

// vModelText ===> ModelDirective
const _vModelText = vModelText;

_vModelText.updated = (el, binding) => {
  const {
    value,
    modifiers: { capitalize },
  } = binding;
  
  // 判斷是否有 capitalize 修飾子
  if (capitalize && value) {
    el.value = value[0].toUpperCase() + value.slice(1);
  }
};

const val = ref(''); 
</script>

<template>
  <input type="text" v-model.capitalize="val" />
</template>
```


## v-focus

> [題目連結](https://vuejs-challenges.netlify.app/questions/19-v-focus/README.html)

### 解答

```vue
<script setup>
import { ref } from 'vue';

const state = ref(false);

/**
 * Implement the custom directive
 * Make sure the input element focuses/blurs when the 'state' is toggled
 */

const VFocus = {
  beforeUpdate(el, binding) {
    const isFocus = binding.value;
    isFocus ? el.focus() : el.blur();
  },
};

setInterval(() => {
  state.value = !state.value;
}, 2000);
</script>

<template>
  <input v-focus="state" type="text" />
</template>
```

> 參考閱讀：[Custom Directives](https://vuejs.org/guide/reusability/custom-directives.html#custom-directives)


## v-debounce-click

> [題目連結](https://vuejs-challenges.netlify.app/questions/20-v-debounce-click/README.html)

### 解答

```vue
<script setup>
/**
 * Implement the custom directive
 * Make sure the `onClick` method only gets triggered once when clicked many times quickly
 * And you also need to support the debounce delay time option. e.g `v-debounce-click:ms`
 *
 */
const debounce = (func, delay) => {
  let timer;
  return (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(e);
    }, delay);
  };
};

const VDebounceClick = {
  mounted(el, binding) {
    el.addEventListener('click', debounce(binding.value, binding.arg));
  },
  unmounted(el) {
    el.removeEventListener('click', debounce(binding.value, binding.arg));
  },
};

function onClick() {
  console.log('Only triggered once when clicked many times quickly');
}
</script>

<template>
  <button v-debounce-click:200="onClick">
    Click on it many times quickly
  </button>
</template>
```


## v-active-style

> [題目連結](https://vuejs-challenges.netlify.app/questions/24-v-active-style/README.html)

### 解答

```vue
<script setup>
import { ref, watch } from 'vue';

/**
 * Implement the custom directive
 * Make sure the list item text color changes to red when the `toggleTab` is toggled
 *
 */
const VActiveStyle = {
  mounted(el, { value }) {
    const [styles, isActiveFn] = value;

    el._stop = watch(
      isActiveFn,
      (newVal) => {
        for (const [k, v] of Object.entries(styles)) {
          console.log(newVal);
          el.style[k] = newVal ? v : '';
        }
      },
      { immediate: true }
    );
  },
  unmounted(el) {
    el._stop();
  },
};

const list = [1, 2, 3, 4, 5, 6, 7, 8];
const activeTab = ref(0);
function toggleTab(index) {
  activeTab.value = index;
}
</script>

<template>
  <ul>
    <li
      v-for="(item, index) in list"
      :key="index"
      v-active-style="[{ color: 'red' }, () => activeTab === index]"
      @click="toggleTab(index)"
    >
      {{ item }}
    </li>
  </ul>
</template>
```


## v-model

> [題目連結](https://vuejs-challenges.netlify.app/questions/26-v-model/README.html)

### 解答

```vue
<script setup>
import { ref } from 'vue';

/**
 * Implement a custom directive
 * Create a two-way binding on a form input element
 *
 */
const VOhModel = {
  mounted(el, { value, instance }) {
    el.value = value;
    el.addEventListener('input', (e) => (instance.value = e.target.value));
  },
};

const value = ref('Hello Vue.js');

defineExpose({
  value,
});
</script>

<template>
  <input v-oh-model="value" type="text" />
  <p>{{ value }}</p>
</template>
```


