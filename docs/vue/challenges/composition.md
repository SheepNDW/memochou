# Composition API 解答

###### tags: `vue`

## Lifecycle Hooks

> [題目連結](https://vuejs-challenges.netlify.app/questions/10-lifecycle/README.html)

### 解答

```vue
<script setup>
import { onMounted, inject, onUnmounted } from 'vue';

const timer = inject('timer');
const count = inject('count');

onMounted(() => {
  timer.value = window.setInterval(() => {
    count.value++;
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<template>
  <div>
    <p>Child Component: {{ count }}</p>
  </div>
</template>
```

## ref family

> [題目連結](https://vuejs-challenges.netlify.app/questions/2-ref-family/README.html)

### 解答

```vue
<script setup>
import { ref, reactive, isRef, unref, toRefs } from 'vue';

const initial = ref(10);
const count = ref(0);

// Challenge 1: Update ref
function update(value) {
  // impl...
  count.value = value;
}

/**
 * Challenge 2: Checks if `count` is a ref object.
 * Make the output to be 1
 */
console.log(
  // impl ? 1 : 0
  isRef(count) ? 1 : 0
);

/**
 * Challenge 3: Unwrap ref
 * Make the output to be true
 */
function initialCount(value) {
  // Make the output to be true
  console.log(unref(value) === 10);
}

initialCount(initial);

/**
 * Challenge 4:
 * create a ref for a property on a source reactive object.
 * The created ref is synced with its source property:
 * mutating the source property will update the ref, and vice-versa.
 * Make the output to be true
 */
const state = reactive({
  foo: 1,
  bar: 2,
});
const fooRef = toRefs(state);

// mutating the ref updates the original
fooRef.foo.value++;
console.log(state.foo === 2);

// mutating the original also updates the ref
state.foo++;
console.log(fooRef.foo.value === 3);
</script>

<template>
  <div>
    <p>
      <span @click="update(count - 1)">-</span>
      {{ count }}
      <span @click="update(count + 1)">+</span>
    </p>
  </div>
</template>
```

> 參考閱讀：[Reactivity API: Utilities](https://vuejs.org/api/reactivity-utilities.html#reactivity-api-utilities)

## losing-reactivity

> [題目連結](https://vuejs-challenges.netlify.app/questions/3-losing-reactivity/README.html)

### 解答

```vue
<script setup>
import { reactive, toRefs } from 'vue';

function useCount() {
  const state = reactive({
    count: 0,
  });

  function update(value) {
    state.count = value;
  }

  return {
    state: toRefs(state),
    update,
  };
}

const {
  state: { count },
  update,
} = useCount();
</script>

<template>
  <div>
    <p>
      <span @click="update(count - 1)">-</span>
      {{ count }}
      <span @click="update(count + 1)">+</span>
    </p>
  </div>
</template>
```

## writable-computed

> [題目連結](https://vuejs-challenges.netlify.app/questions/4-writable-computed/README.html)

### 解答

```vue
<script setup>
import { ref, computed } from 'vue';

const count = ref(1);
// const plusOne = computed(() => count.value + 1);

/**
 * Make the `plusOne` can be written.
 * So we'll get the result is `plusOne` to be 3, and `count` to be 2.
 */

const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => (count.value = val - 1),
});

plusOne.value++;
</script>

<template>
  <div>
    <p>{{ count }}</p>
    <p>{{ plusOne }}</p>
  </div>
</template>
```

## watch family

> [題目連結](https://vuejs-challenges.netlify.app/questions/5-watch-family/README.html)

### 解答

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);

/**
 * Challenge 1: Watch once
 * Make sure the watch callback is only triggered once
 */
const stopCountWatcher = watch(count, () => {
  if (count.value) stopCountWatcher();
  console.log('Only triggered once');
});

count.value = 1;
setTimeout(() => (count.value = 2));

/**
 * Challenges 2: Watch object
 * Make sure the watch callback is triggered
 */
const state = ref({
  count: 0,
});

watch(
  state,
  () => {
    console.log('The state.count updated');
  },
  { deep: true }
);

state.value.count = 2;

/**
 * Challenge 3: Callback Flush Timing
 * Make sure visited the updated eleRef
 */

const eleRef = ref();
const age = ref(2);
watch(
  age,
  () => {
    console.log(eleRef.value);
  },
  { flush: 'post' }
);
age.value = 18;
</script>

<template>
  <div>
    <p>
      {{ count }}
    </p>
    <p ref="eleRef">
      {{ age }}
    </p>
  </div>
</template>
```

> 參考閱讀：[Callback Flush Timing](https://vuejs.org/guide/essentials/watchers.html#callback-flush-timing)


## shallow ref

> [題目連結](https://vuejs-challenges.netlify.app/questions/6-shallow-ref/README.html)

### 解答

```vue
<script setup>
import { shallowRef, triggerRef, watch } from 'vue';

const state = shallowRef({ count: 1 });

// Does NOT trigger
watch(
  state,
  () => {
    console.log('State.count Updated');
  },
  { deep: true }
);

/**
 * Modify the code so that we can make the watch callback trigger.
 */

// answer 1:
// state.value = { count: 2 };

// answer 2:
state.value.count = 2;
triggerRef(state);
</script>

<template>
  <div>
    <p>
      {{ state.count }}
    </p>
  </div>
</template>
```

> 參考閱讀：[shallowRef](https://vuejs.org/api/reactivity-advanced.html#shallowref)、[triggerRef](https://vuejs.org/api/reactivity-advanced.html#triggerref)


## Dependency Injection

> [題目連結](https://vuejs-challenges.netlify.app/questions/9-dependency-injection/README.html)

### 解答

```vue
<script setup>
// Add code to make the `count` value injected into the child component.
import { inject } from 'vue'
  
const count = inject('count')
</script>

<template>
  {{ count }}
</template>
```

## effectScope API

> [題目連結](https://vuejs-challenges.netlify.app/questions/8-effect-scope/README.html)

### 解答

```vue
<script setup>
import { ref, computed, watch, watchEffect, effectScope } from 'vue';

const counter = ref(1);
const doubled = computed(() => counter.value * 2);

// use `effectScope` API to make these effect stop together after triggered once
const watchScope = effectScope();
const watchEffectScope = effectScope();

watchScope.run(() => {
  watch(doubled, () => {
    console.log(doubled.value);
    watchScope.stop();
  });
});

watchEffectScope.run(() => {
  watchEffect(() => {
    console.log('Count: ', doubled.value);
    watchEffectScope.stop();
  });
});

counter.value = 2;

setTimeout(() => {
  counter.value = 4;
});
</script>

<template>
  <div>
    <p>
      {{ doubled }}
    </p>
  </div>
</template>
```

> 參考閱讀：[effectScope](https://vuejs.org/api/reactivity-advanced.html#effectscope)


## custom ref

> [題目連結](https://vuejs-challenges.netlify.app/questions/23-custom-ref/README.html)

### 解答

```vue
<script setup>
import { customRef, watch } from 'vue';

/**
 * Implement the function
 */
function useDebouncedRef(value, delay = 200) {
  let timer = null;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
}

const text = useDebouncedRef('hello');

/**
 * Make sure the callback only triggered once when enter multiple times in a certain timeout
 */
watch(text, (value) => {
  console.log(value);
});
</script>

<template>
  <input v-model="text" />
</template>
```
