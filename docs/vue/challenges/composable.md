# Composable Function 解答

###### tags: `vue`

## useToggle

> [題目連結](https://vuejs-challenges.netlify.app/questions/15-useToggle/README.html)

### 解答

```vue
<script setup>
import { ref } from 'vue';

/**
 * Implement a composable function that toggle state
 * Make the function work fine
 */
function useToggle(initialState) {
  const state = ref(initialState);
  const toggle = () => (state.value = !state.value);

  return [state, toggle];
}

const [state, toggle] = useToggle(false);
</script>

<template>
  <p>State: {{ state ? 'ON' : 'OFF' }}</p>
  <p @click="toggle">Toggle state</p>
</template>
```


## useCounter

> [題目連結](https://vuejs-challenges.netlify.app/questions/17-useCounter/README.html)

### 解答

```vue
<script setup>
import { ref } from 'vue';

/**
 * Implement the composable function
 * 1. inc (+)
 * 2. dec (-)
 * 3. reset
 * 4. min & max option support
 * Make the function work fine
 */
function useCounter(initialValue = 0, options = {}) {
  const count = ref(initialValue);

  const inc = () => {
    const tempValue = count.value + 1;
    if (tempValue > options?.max) return;
    count.value++;
  };

  const dec = () => {
    const tempValue = count.value - 1;
    if (tempValue < options?.min) return;
    count.value--;
  };

  const reset = () => {
    count.value = initialValue;
  };

  return {
    count,
    inc,
    dec,
    reset,
  };
}

const { count, inc, dec, reset } = useCounter(0, { min: 0, max: 10 });
</script>

<template>
  <p>Count: {{ count }}</p>
  <button @click="inc">inc</button>
  <button @click="dec">dec</button>
  <button @click="reset">reset</button>
</template>
```

* 更精簡的寫法：
```javascript
function useCounter(initialValue = 0, options = {}) {
  const count = ref(initialValue);
  const inc = () => count.value < options?.max && count.value++;
  const dec = () => count.value > options?.min && count.value--;
  const reset = () => (count.value = initialValue);

  return {
    count,
    inc,
    dec,
    reset,
  };
}
```

## useLocalStorage

> [題目連結](https://vuejs-challenges.netlify.app/questions/18-useLocalStorage/README.html)

### 解答

```vue
<script setup>
import { ref, watch } from 'vue';

/**
 * Implement the composable function
 * Make the function work fine
 */
function useLocalStorage(key, initialValue) {
  const value = ref(initialValue);
  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, newValue);
    },
    { immediate: true }
  );

  return value;
}

const counter = useLocalStorage('counter', 0);

// We can get localStorage via triggered the getter:
console.log(counter.value);

// And We also can set localStorage via triggered the setter:

counter.value = 1;
</script>
```

## useMouse

> [題目連結](https://vuejs-challenges.netlify.app/questions/25-useMouse/README.html)

### 解答

```vue
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

// Implement ...
function useEventListener(target, event, callback) {
  onMounted(() => target.addEventListener(event, callback));
  onUnmounted(() => target.removeEventListener(event, callback));
}

// Implement ...
function useMouse() {
  const x = ref(0);
  const y = ref(0);

  useEventListener(window, 'mousemove', ({ clientX, clientY }) => {
    x.value = clientX;
    y.value = clientY;
  });

  return {
    x,
    y,
  };
}
const { x, y } = useMouse();
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```
